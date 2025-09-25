// Cliente dedicado para Stripe
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_default_test_key';
const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY || 'sk_test_your_default_test_key';
const STRIPE_WEBHOOK_SECRET = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number; // em centavos
  currency: string; // Adicionando suporte multi-moeda
}

export interface StripeCustomer {
  name: string;
  email: string;
  phone: string;
  document: string; // CPF para clientes brasileiros
}

export interface StripePaymentRequest {
  customer: StripeCustomer;
  products: StripeProduct[];
  currency: string; // Moeda da transação (BRL, USD, EUR, etc.)
  returnUrl: string;
  successUrl: string;
  cancelUrl: string;
}

export interface StripePaymentResponse {
  id: string;
  url: string; // URL para checkout do Stripe
  status: string;
  amount: number;
  currency: string;
  expiresAt: string;
}

export class StripeClient {
  private publicKey: string;
  private secretKey: string;
  private webhookSecret: string | undefined;

  constructor(publicKey?: string, secretKey?: string, webhookSecret?: string) {
    this.publicKey = publicKey || STRIPE_PUBLIC_KEY;
    this.secretKey = secretKey || STRIPE_SECRET_KEY;
    this.webhookSecret = webhookSecret || STRIPE_WEBHOOK_SECRET;
  }

  async createPaymentIntent(data: StripePaymentRequest): Promise<StripePaymentResponse> {
    try {
      // Preparar os itens para o Stripe
      const lineItems = data.products.map(product => ({
        price_data: {
          currency: data.currency.toLowerCase(),
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price, // em centavos
        },
        quantity: product.quantity,
      }));

      // Criar a sessão de checkout
      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${this.secretKey}`,
        },
        body: new URLSearchParams({
          'payment_method_types[]': 'card',
          'mode': 'payment',
          'success_url': data.successUrl,
          'cancel_url': data.cancelUrl,
          ...lineItems.flatMap((item, index) => [
            `line_items[${index}][price_data][currency]=${item.price_data.currency}`,
            `line_items[${index}][price_data][product_data][name]=${item.price_data.product_data.name}`,
            `line_items[${index}][price_data][product_data][description]=${item.price_data.product_data.description || ''}`,
            `line_items[${index}][price_data][unit_amount]=${item.price_data.unit_amount}`,
            `line_items[${index}][quantity]=${item.quantity}`,
          ]),
          'customer_email': data.customer.email,
          'client_reference_id': `drinkpass-${Date.now()}`,
          'payment_intent_data[metadata][customer_name]': data.customer.name,
          'payment_intent_data[metadata][customer_phone]': data.customer.phone,
          'payment_intent_data[metadata][customer_document]': data.customer.document,
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const sessionData = await response.json();
      
      return {
        id: sessionData.id,
        url: sessionData.url,
        status: sessionData.payment_status,
        amount: sessionData.amount_total,
        currency: sessionData.currency,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      };
    } catch (error) {
      console.error('Erro ao criar pagamento Stripe:', error);
      throw error;
    }
  }

  async getPaymentStatus(sessionId: string): Promise<StripePaymentResponse> {
    try {
      const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const sessionData = await response.json();
      
      return {
        id: sessionData.id,
        url: sessionData.url,
        status: sessionData.payment_status,
        amount: sessionData.amount_total,
        currency: sessionData.currency,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      };
    } catch (error) {
      console.error('Erro ao consultar status do pagamento:', error);
      throw error;
    }
  }

  // Método para obter a chave pública (para uso no frontend)
  getPublicKey(): string {
    return this.publicKey;
  }
}

export const stripeClient = new StripeClient();