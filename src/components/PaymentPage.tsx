import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { stripeClient } from '@/lib/stripeClient';

interface PaymentPageProps {}

const PaymentPage: React.FC<PaymentPageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'expired' | 'failed'>('pending');
  const [formMessage, setFormMessage] = useState<string | null>(null);

  // Recuperar dados do estado da navegação ou da URL
  const { plan, billing, isDevelopment } = location.state || {};
  const sessionId = searchParams.get('session_id');

  // Verificar status do pagamento
  useEffect(() => {
    const checkPaymentStatus = async () => {
      // Se estamos em modo de desenvolvimento ou não temos um sessionId, usamos o mock
      if (isDevelopment || !sessionId) {
        setTimeout(() => {
          setIsLoading(false);
          // Simular pagamento aprovado
          if (isDevelopment && Math.random() > 0.3) {
            setPaymentStatus('paid');
            setTimeout(() => {
              navigate('/checkout/success', {
                state: {
                  plan,
                  transactionId: billing?.id || `dev_${Date.now()}`,
                  billing
                }
              });
            }, 1500);
          } else {
            setPaymentStatus('pending');
          }
        }, 2000);
        return;
      }

      try {
        // Verificar status real do pagamento no Stripe
        const status = await stripeClient.getPaymentStatus(sessionId);
        
        setIsLoading(false);
        
        if (status.status === 'paid' || status.status === 'complete') {
          setPaymentStatus('paid');
          navigate('/checkout/success', {
            state: {
              plan,
              transactionId: status.id,
              billing: status
            }
          });
        } else if (status.status === 'expired' || status.status === 'canceled') {
          setPaymentStatus('expired');
          setFormMessage('Este pagamento foi cancelado ou expirou. Por favor, tente novamente.');
        } else {
          setPaymentStatus('pending');
          setFormMessage('Aguardando confirmação do pagamento. Isso pode levar alguns instantes.');
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
        setIsLoading(false);
        setPaymentStatus('failed');
        setFormMessage('Ocorreu um erro ao verificar o status do pagamento. Por favor, tente novamente.');
      }
    };

    checkPaymentStatus();
  }, [sessionId, isDevelopment, navigate, plan, billing]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Verificando Pagamento</CardTitle>
            <CardDescription>
              Estamos processando seu pagamento
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p>Verificando status do pagamento...</p>
              </div>
            ) : paymentStatus === 'paid' ? (
              <div className="py-8">
                <p className="text-green-600 font-bold text-xl mb-2">Pagamento aprovado!</p>
                <p>Você será redirecionado em instantes...</p>
              </div>
            ) : paymentStatus === 'expired' ? (
              <div className="py-8">
                <p className="text-red-600 font-bold text-xl mb-2">Pagamento expirado</p>
                <p>Este pagamento expirou ou foi cancelado. Por favor, tente novamente.</p>
              </div>
            ) : paymentStatus === 'failed' ? (
              <div className="py-8">
                <p className="text-red-600 font-bold text-xl mb-2">Erro no pagamento</p>
                <p>Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.</p>
              </div>
            ) : (
              <div className="py-8">
                <p className="text-yellow-600 font-bold text-xl mb-2">Aguardando confirmação</p>
                <p>Seu pagamento está sendo processado. Isso pode levar alguns instantes.</p>
              </div>
            )}
            
            {formMessage && (
              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                <p className="text-yellow-700 text-sm">{formMessage}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/checkout')}
            >
              Voltar para o checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;