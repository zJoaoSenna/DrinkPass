import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, CheckCircle2 } from "lucide-react";
import QRCode from 'qrcode';
import { abacatePayClient } from '@/lib/abacatePayClient';

interface PaymentPageProps {}

const PaymentPage: React.FC<PaymentPageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos em segundos
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'expired'>('pending');
  const [formMessage, setFormMessage] = useState<string | null>(null); // Adicionando formMessage

  // Recuperar dados do estado da navegação
  const { plan, billing, isDevelopment } = location.state || {};
  
  // Fallback para desenvolvimento
  const pixCode = billing?.pixCode || "00020101021126330014br.gov.bcb.pix0111100229766475204089.9053039865802BR5917DRINKPASS LTDA6013BELO HORIZONT62070503***6304A55B";
  const billingId = billing?.id || `dev_${Date.now()}`;

  // Função para formatar o tempo restante
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Função para copiar o código PIX para a área de transferência
  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Erro ao copiar para área de transferência:', err);
        setFormMessage('Não foi possível copiar o código. Por favor, copie manualmente.');
      });
  };

  // Função para abrir aplicativo bancário
  const openBankApp = () => {
    // Lista de URLs de esquema para apps bancários comuns
    const bankSchemes = [
      'nubank://',
      'itau://',
      'bradesco://',
      'santander://',
      'caixa://',
      'bb://'
    ];
    
    // Tenta abrir cada app bancário
    let opened = false;
    
    // Em dispositivos móveis, tenta abrir os apps
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      for (const scheme of bankSchemes) {
        try {
          window.location.href = scheme;
          opened = true;
          break;
        } catch (e) {
          console.log(`Não foi possível abrir ${scheme}`);
        }
      }
    }
    
    // Se não conseguiu abrir nenhum app ou está em desktop
    if (!opened) {
      // Tenta abrir o app padrão de PIX do sistema
      try {
        window.location.href = `pix://${pixCode}`;
      } catch (e) {
        setFormMessage('Não foi possível abrir um aplicativo bancário automaticamente. Por favor, abra manualmente seu app e escaneie o QR code.');
      }
    }
  };

  // Verificar status do pagamento
  const checkPaymentStatus = async () => {
    if (!billing?.id || isDevelopment) {
      // Simular verificação em modo desenvolvimento
      setIsCheckingStatus(true);
      setTimeout(() => {
        setIsCheckingStatus(false);
        // Simular pagamento aprovado aleatoriamente
        if (Math.random() > 0.7) {
          setPaymentStatus('paid');
          navigate('/checkout/success', {
            state: {
              plan,
              transactionId: billingId,
              billing
            }
          });
        } else {
          alert('Pagamento ainda não identificado. Tente novamente em alguns instantes.');
        }
      }, 2000);
      return;
    }

    setIsCheckingStatus(true);
    try {
      const status = await abacatePayClient.getBillingStatus(billing.id);
      
      if (status.status === 'paid') {
        setPaymentStatus('paid');
        navigate('/checkout/success', {
          state: {
            plan,
            transactionId: billing.id,
            billing: status
          }
        });
      } else if (status.status === 'expired') {
        setPaymentStatus('expired');
        alert('Este pagamento expirou. Você será redirecionado para criar um novo.');
        navigate('/checkout');
      } else {
        alert('Pagamento ainda não identificado. Tente novamente em alguns instantes.');
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      alert('Erro ao verificar o status do pagamento. Tente novamente.');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Verificação automática de status a cada 30 segundos
  useEffect(() => {
    if (paymentStatus === 'pending' && billing?.id && !isDevelopment) {
      const interval = setInterval(checkPaymentStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [paymentStatus, billing?.id, isDevelopment]);

  // Contador regressivo
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  
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
                <span>{plan?.name || 'Plano não especificado'}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>R$ {plan?.price?.toFixed(2) || '0.00'}</span>
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