import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, CheckCircle2 } from "lucide-react";
import QRCode from 'qrcode';

interface PaymentPageProps {}

const PaymentPage: React.FC<PaymentPageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos em segundos
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  
  // Log para depuração
  useEffect(() => {
    console.log("Estado da navegação:", location.state);
  }, [location.state]);
  
  // Dados de teste para desenvolvimento (caso location.state esteja vazio)
  const testPlan = {
    id: 'monthly',
    name: 'Plano Mensal',
    description: 'Acesso a todos os benefícios por 1 mês',
    price: 29.90,
    period: 'mês',
  };

  const testPixCode = "00020101021226890014br.gov.bcb.pix2567pix-h.example.com/9d36b84f-c70b-478f-b95c-12729e90ca25520400005303986540510.005802BR5925Teste AbacatePay6009Sao Paulo62070503***63041D14";
  
  // Recuperar dados do estado da navegação (com fallback para dados de teste)
  const plan = location.state?.plan || testPlan;
  const pixCode = location.state?.pixCode || testPixCode;
  // Remove or comment out unused variable
  // const paymentId = location.state?.paymentId || "pay_test";
  
  // Formatar tempo restante
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Copiar código PIX para a área de transferência
  const copyToClipboard = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };
  
  // Adicionar função para abrir o app bancário
  const openBankApp = () => {
    // Criar URL com protocolo PIX
    const pixUrl = `pix:${pixCode}`;
    
    // Tentar abrir o app bancário
    window.location.href = pixUrl;
  };
  
  // Verificar status do pagamento
  const checkPaymentStatus = async () => {
    setIsCheckingStatus(true);
    setFormMessage(null);
    
    try {
      // Simulação para desenvolvimento
      setTimeout(() => {
        // Simulando pagamento bem-sucedido
        navigate('/checkout/success', { 
          state: { 
            plan: plan,
            transactionId: 'pix_' + Math.random().toString(36).substring(2, 15)
          } 
        });
        setIsCheckingStatus(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      setIsCheckingStatus(false);
      setFormMessage('Erro ao verificar o pagamento. Tente novamente.');
    }
  };
  
  // Contador regressivo
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  // Adicionar estado para armazenar a URL do QR Code
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  
  // Gerar QR Code como URL de imagem
  useEffect(() => {
    if (pixCode) {
      QRCode.toDataURL(pixCode, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      .then((url: string) => {
        setQrCodeUrl(url);
      })
      .catch((err: Error) => {
        console.error('Erro ao gerar QR Code:', err);
      });
    }
  }, [pixCode]);
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Pagamento via PIX</CardTitle>
            <CardDescription>
              Escaneie o QR Code ou copie o código PIX para pagar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Informações do plano */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Resumo da compra</h3>
              <div className="flex justify-between mb-1">
                <span>Plano:</span>
                <span>{plan.name}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>R$ {plan.price.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Tempo restante */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Este QR Code expira em:</p>
              <p className={`font-mono text-xl font-bold ${timeLeft < 120 ? 'text-red-500' : ''}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
            
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="border-4 border-primary/20 rounded-lg p-4 bg-white">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code PIX" 
                    width={200} 
                    height={200}
                  />
                ) : (
                  <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Código PIX */}
            <div className="relative">
              <div className="p-3 bg-gray-100 rounded-lg pr-12 break-all font-mono text-sm">
                {pixCode}
              </div>
              <button 
                onClick={copyToClipboard}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-primary"
                aria-label="Copiar código PIX"
              >
                {copied ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Botão para abrir app bancário */}
            <Button 
              variant="default" 
              className="w-full" 
              onClick={openBankApp}
            >
              Abrir aplicativo bancário
            </Button>
            
            {formMessage && (
              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                <p className="text-yellow-700 text-sm">{formMessage}</p>
              </div>
            )}
            
            <div className="text-center text-sm text-gray-500">
              <p>Após o pagamento, pode levar alguns instantes para confirmarmos a transação.</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={checkPaymentStatus}
              disabled={isCheckingStatus}
            >
              {isCheckingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando pagamento...
                </>
              ) : (
                'Já realizei o pagamento'
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={() => navigate('/checkout')}
            >
              Voltar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;