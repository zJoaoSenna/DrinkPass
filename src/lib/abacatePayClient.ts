// Criar um cliente dedicado para AbacatePay
const ABACATE_PAY_API_KEY = import.meta.env.VITE_ABACATE_PAY_API_KEY || 'abc_dev_rWweKhQmjqj56s52B2qzRzfg';
const ABACATE_PAY_BASE_URL = 'https://api.abacatepay.com/v1';

export interface AbacatePayProduct {
  externalId: string;
  name: string;
  description: string;
  quantity: number;
  price: number; // em centavos
}

export interface AbacatePayCustomer {
  name: string;
  email: string;
  phone: string;
  document: string;
}

export interface AbacatePayBillingRequest {
  frequency: 'ONE_TIME' | 'MULTIPLE_TIME';
  methods: string[];
  products: AbacatePayProduct[];
  returnUrl: string;
  completionUrl: string;
  customer: AbacatePayCustomer;
}

export interface AbacatePayBillingResponse {
  id: string;
  url: string;
  pixCode?: string;
  qrCode?: string;
  status: string;
  amount: number;
  expiresAt: string;
}

export class AbacatePayClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || ABACATE_PAY_API_KEY;
    this.baseUrl = ABACATE_PAY_BASE_URL;
  }

  async createBilling(data: AbacatePayBillingRequest): Promise<AbacatePayBillingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/billing/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar cobrança AbacatePay:', error);
      throw error;
    }
  }

  async getBillingStatus(billingId: string): Promise<AbacatePayBillingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/billing/${billingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao consultar status da cobrança:', error);
      throw error;
    }
  }
}

export const abacatePayClient = new AbacatePayClient();