import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

// Tipos de planos disponíveis
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  discount?: string;
}

// Dados do cliente para o checkout
interface CustomerData {
  name: string;
  email: string;
  phone: string;
  document: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    document: '',
  });

  // Definição dos planos disponíveis
  const plans: Plan[] = [
    {
      id: 'monthly',
      name: 'Plano Mensal',
      description: 'Assinatura mensal com flexibilidade.',
      price: 89.90,
      period: 'mês',
    },
    {
      id: 'semiannual',
      name: 'Plano Semestral',
      description: 'Assinatura semestral com desconto.',
      price: 69.90,
      period: 'mês',
      discount: 'Economize R$ 20,00/mês',
    },
    {
      id: 'annual',
      name: 'Plano Anual',
      description: 'Assinatura anual com o melhor preço.',
      price: 49.90,
      period: 'mês',
      discount: 'Economize R$ 40,00/mês',
    },
  ];

  // Plano atualmente selecionado
  const currentPlan = plans.find(plan => plan.id === selectedPlan) || plans[0];

  // Manipuladores de entrada
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatPhone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
    
    // Aplica a formatação
    if (numericValue.length <= 2) {
      return numericValue;
    } else if (numericValue.length <= 7) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
    } else if (numericValue.length <= 11) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;
    } else {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
    }
  };

  const formatCPF = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
    
    // Aplica a formatação
    if (numericValue.length <= 3) {
      return numericValue;
    } else if (numericValue.length <= 6) {
      return `${numericValue.slice(0, 3)}.${numericValue.slice(3)}`;
    } else if (numericValue.length <= 9) {
      return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6)}`;
    } else {
      return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value);
    setCustomerData(prev => ({
      ...prev,
      phone: formattedValue,
    }));
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPF(e.target.value);
    setCustomerData(prev => ({
      ...prev,
      document: formattedValue,
    }));
  };

  // Validação do formulário
  const validateForm = () => {
    if (!customerData.name.trim()) {
      setErrorMessage('Por favor, preencha seu nome completo.');
      return false;
    }
    
    if (!customerData.email.trim() || !customerData.email.includes('@')) {
      setErrorMessage('Por favor, preencha um e-mail válido.');
      return false;
    }
    
    const phoneNumbers = customerData.phone.replace(/\D/g, '');
    if (phoneNumbers.length < 10) {
      setErrorMessage('Por favor, preencha um telefone válido.');
      return false;
    }
    
    const cpfNumbers = customerData.document.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      setErrorMessage('Por favor, preencha um CPF válido.');
      return false;
    }
    
    return true;
  };

  // Função para gerar código PIX mock para desenvolvimento
  const generateMockPixCode = (plan: Plan): string => {
    const pixCodes: Record<string, string> = {
      monthly: "00020101021126330014br.gov.bcb.pix0111100229766475204089.9053039865802BR5917DRINKPASS LTDA6013BELO HORIZONT62070503***6304A55B",
      semiannual: "00020101021126330014br.gov.bcb.pix0111100229766475204069.9053039865802BR5917DRINKPASS LTDA6013BELO HORIZONT62070503***6304B66C",
      annual: "00020101021126330014br.gov.bcb.pix0111100229766475204049.9053039865802BR5917DRINKPASS LTDA6013BELO HORIZONT62070503***6304C77D"
    };
    
    return pixCodes[plan.id] || pixCodes.monthly;
  };

  // Processar pagamento
  const handleCheckout = async () => {
    console.log('Botão Finalizar Compra clicado!');
    setErrorMessage(null);
    
    // Validar formulário
    if (!validateForm()) {
      console.log('Validação do formulário falhou');
      return;
    }
  
    setIsLoading(true);
    console.log('Iniciando processo de checkout...');
  
    // Preparar dados para o Stripe
    const paymentData = {
      customer: {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone.replace(/\D/g, ''),
        document: customerData.document.replace(/\D/g, '')
      },
      products: [
        {
          id: `drinkpass-${currentPlan.id}`,
          name: `DrinkPass - ${currentPlan.name}`,
          description: currentPlan.description,
          quantity: 1,
          price: Math.round(currentPlan.price * 100), // Converter para centavos
          currency: 'BRL' // Moeda padrão
        }
      ],
      currency: 'BRL', // Moeda padrão
      returnUrl: `${window.location.origin}/checkout`,
      successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/checkout`
    };
  
    try {
      console.log('Dados do pagamento preparados:', paymentData);
      
      // Chamar API Stripe
      try {
        console.log('Tentando chamar API Stripe...');
        const billingResponse = await stripeClient.createPaymentIntent(paymentData);
        console.log('Dados da cobrança:', billingResponse);
        
        // Redirecionar para a página de checkout do Stripe
        window.location.href = billingResponse.url;
        return;
      } catch (apiError) {
        console.log('Erro na API, usando fallback:', apiError);
        
        // Fallback para desenvolvimento
        const mockBilling = {
          id: `pay_${Date.now()}`,
          url: `${window.location.origin}/checkout/payment`,
          status: 'pending',
          amount: Math.round(currentPlan.price * 100),
          currency: 'BRL',
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutos
        };
        
        console.log('Redirecionando com dados mock:', mockBilling);
        
        // Garantir que sempre redirecione
        setTimeout(() => {
          navigate('/checkout/payment', { 
            state: { 
              plan: currentPlan,
              billing: mockBilling,
              paymentData: paymentData,
              isDevelopment: true
            } 
          });
        }, 1000); // Pequeno delay para mostrar o loading
      }
      
    } catch (error) {
      console.error('Erro geral no checkout:', error);
      
      // Em caso de qualquer erro, ainda assim redirecionar
      const mockBilling = {
        id: `pay_${Date.now()}`,
        url: `${window.location.origin}/checkout/payment`,
        pixCode: generateMockPixCode(currentPlan),
        status: 'pending',
        amount: Math.round(currentPlan.price * 100),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      };
      
      console.log('Erro capturado, redirecionando mesmo assim:', mockBilling);
      
      setTimeout(() => {
        navigate('/checkout/payment', { 
          state: { 
            plan: currentPlan,
            billing: mockBilling,
            paymentData: paymentData,
            isDevelopment: true,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          } 
        });
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout DrinkPass</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna de seleção de plano */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Escolha seu plano</CardTitle>
                <CardDescription>Selecione o plano que melhor atende suas necessidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div 
                      key={plan.id} 
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer ${selectedPlan === plan.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <div className={`w-4 h-4 rounded-full border ${selectedPlan === plan.id ? 'border-primary bg-primary' : 'border-gray-400'}`}>
                        {selectedPlan === plan.id && (
                          <div className="w-2 h-2 rounded-full bg-white m-auto mt-1"></div>
                        )}
                      </div>
                      <div className="flex flex-col w-full">
                        <span className="font-medium">{plan.name}</span>
                        <span className="text-sm text-gray-500">{plan.description}</span>
                        <span className="font-bold mt-1">R$ {plan.price.toFixed(2)}/{plan.period}</span>
                        {plan.discount && (
                          <span className="text-sm text-green-600 font-medium">{plan.discount}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Coluna de dados do cliente */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Dados para pagamento</CardTitle>
                <CardDescription>Preencha seus dados para finalizar a compra</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome completo</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Seu nome completo" 
                    value={customerData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={customerData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    placeholder="(00) 00000-0000" 
                    value={customerData.phone}
                    onChange={handlePhoneChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="document">CPF</Label>
                  <Input 
                    id="document" 
                    name="document" 
                    placeholder="000.000.000-00" 
                    value={customerData.document}
                    onChange={handleCPFChange}
                  />
                </div>
                
                {errorMessage && (
                  <div className="bg-red-50 p-3 rounded-md border border-red-200">
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="w-full p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Plano selecionado:</span>
                    <span className="font-medium">{currentPlan.name}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>R$ {currentPlan.price.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Pagamento único via PIX
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Finalizar Compra'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
// Importar o novo cliente Stripe
import { stripeClient } from '@/lib/stripeClient';