import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface PaymentSuccessProps {}

const PaymentSuccess: React.FC<PaymentSuccessProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Recuperar dados do estado da navegação (com fallback para dados de teste)
  const testPlan = {
    id: 'monthly',
    name: 'Plano Mensal',
    description: 'Acesso a todos os benefícios por 1 mês',
    price: 29.90,
    period: 'mês',
  };
  
  const plan = (location.state && location.state.plan) ? location.state.plan : testPlan;
  const transactionId = (location.state && location.state.transactionId) 
    ? location.state.transactionId 
    : 'pix_' + Math.random().toString(36).substring(2, 15);
  
  // Gerar data de expiração baseada no plano
  const getExpirationDate = () => {
    const today = new Date();
    
    if (plan?.id === 'monthly') {
      today.setMonth(today.getMonth() + 1);
    } else if (plan?.id === 'semiannual') {
      today.setMonth(today.getMonth() + 6);
    } else if (plan?.id === 'annual') {
      today.setFullYear(today.getFullYear() + 1);
    }
    
    return today.toLocaleDateString('pt-BR');
  };
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Card className="border-2 border-green-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Pagamento Confirmado!</CardTitle>
            <CardDescription>
              Seu pagamento foi processado com sucesso
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Informações do plano */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Detalhes da compra</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Plano:</span>
                  <span>{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor:</span>
                  <span>R$ {plan.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Método:</span>
                  <span>PIX</span>
                </div>
                <div className="flex justify-between">
                  <span>ID da transação:</span>
                  <span className="font-mono text-xs">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Válido até:</span>
                  <span>{getExpirationDate()}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-green-800">
                Seu DrinkPass está ativo! Você já pode aproveitar todos os benefícios do seu plano.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              Voltar para a página inicial
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/profile')}
            >
              Ver minha conta
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;