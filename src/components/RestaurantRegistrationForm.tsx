import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useParams, useNavigate } from 'react-router-dom';

// Schema de validação com Zod
// Remove or comment out unused variables
// const availabilitySchema = z.object({...}); // Unused variable

const restaurantSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  location: z.string().min(1, "Localização é obrigatória"),
  cuisine: z.string().min(1, "Tipo de cozinha é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  promotion: z.string().min(1, "Promoção é obrigatória"),
  // Para availability, vamos usar uma string JSON por simplicidade inicialmente
  // Você pode criar uma UI mais elaborada para isso depois
  availability: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }, "Formato de disponibilidade inválido (deve ser JSON)").transform(val => JSON.parse(val)),
  // Para features, vamos usar uma string separada por vírgulas
  features: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()) : []),
  logo: z.instanceof(FileList).optional() // Campo para o arquivo de logo
    .refine(files => !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024, { // Exemplo: Limite de 5MB
      message: 'O arquivo do logo deve ter no máximo 5MB.',
    })
    .refine(files => !files || files.length === 0 || ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(files[0].type), {
      message: 'Formato de arquivo inválido. Use JPG, PNG, WEBP ou GIF.',
    }),
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

const defaultAvailabilityExample = JSON.stringify({
  'Segunda': { morning: '11:30 - 14:30', evening: '17:00 - 22:00' },
  'Terça': { morning: '11:30 - 14:30', evening: '17:00 - 22:00' },
  // ... outros dias
}, null, 2);

interface RestaurantRegistrationFormProps {
  isEditMode?: boolean;
}

const RestaurantRegistrationForm: React.FC<RestaurantRegistrationFormProps> = ({ isEditMode = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);

  const { control, register, handleSubmit, formState: { errors }, reset, setValue } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: '',
      location: '',
      cuisine: '',
      address: '',
      phone: '',
      description: '',
      promotion: '',
      availability: defaultAvailabilityExample,
      features: '',
      logo: undefined,
    }
  });

  // Buscar dados do restaurante se estiver no modo de edição
  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (isEditMode && id) {
        try {
          setIsLoading(true);
          
          const { data, error } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) {
            throw error;
          }
          
          if (data) {
            // Preencher o formulário com os dados existentes
            setValue('name', data.name);
            setValue('location', data.location);
            setValue('cuisine', data.cuisine);
            setValue('address', data.address);
            setValue('phone', data.phone);
            setValue('description', data.description);
            setValue('promotion', data.promotion);
            setValue('availability', JSON.stringify(data.availability, null, 2));
            setValue('features', data.features ? data.features.join(', ') : '');
            
            // Guardar a URL do logo atual
            if (data.logo_url) {
              setCurrentLogoUrl(data.logo_url);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar dados do restaurante:', error);
          setFormMessage('Erro ao carregar dados do restaurante. Tente novamente.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRestaurantData();
  }, [isEditMode, id, setValue]);

  // Add at the top of your file, after imports:
  interface FormData {
  name: string;
  features: string[];
  location: string;
  cuisine: string;
  address: string;
  phone: string;
  description: string;
  promotion: string;
  logo?: FileList;
  availability?: any;
  }
  
  // Then use this type consistently:
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: '',
      location: '',
      cuisine: '',
      address: '',
      phone: '',
      description: '',
      promotion: '',
      availability: defaultAvailabilityExample,
      features: '',
      logo: undefined,
    }
  });

  const onSubmit: SubmitHandler<RestaurantFormData> = async (formData) => {
    setIsLoading(true);
    setFormMessage(null);

    try {
      let logoUrl: string | null = currentLogoUrl; // Manter a URL atual se não for enviado um novo logo
      const logoFile = formData.logo?.[0]; // Pega o primeiro arquivo da FileList

      if (logoFile) {
        console.log('Fazendo upload do logo:', logoFile.name);

        // Sanitização robusta do nome do arquivo
        const originalName = logoFile.name;
        const sanitizedBaseName = originalName
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
          .replace(/\s+/g, '_') // Substitui espaços por underscore
          .replace(/[^a-zA-Z0-9._-]/g, '') // Remove caracteres não permitidos, mantendo ponto e underscore/hífen
          .replace(/_{2,}/g, '_') // Substitui múltiplos underscores por um único
          .replace(/-{2,}/g, '-'); // Substitui múltiplos hífens por um único

        // Cria um nome de arquivo único para evitar conflitos
        const fileName = `${Date.now()}_${sanitizedBaseName}`;
        
        // Use diretamente o nome do arquivo para simplificar o acesso
        const filePath = fileName; 

        console.log('Nome do arquivo sanitizado para upload:', fileName);

        // Fazer upload do arquivo
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('restaurantlogos')
          .upload(filePath, logoFile, {
            cacheControl: '157680000', // Cache de 5 anos (60 * 60 * 24 * 365 * 5 = 157680000 segundos)
            upsert: false, // Não sobrescrever se o arquivo existir
          });

        if (uploadError) {
          console.error('Erro no upload do logo:', uploadError);
          throw new Error(`Falha no upload do logo: ${uploadError.message}`);
        }

        console.log('Logo enviado:', uploadData);
        
        // Obter a URL pública do arquivo enviado com expiração de 5 anos
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 5); // Adiciona 5 anos à data atual
        
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('restaurantlogos')
          .createSignedUrl(filePath, 157680000); // 5 anos em segundos
        
        if (signedUrlError) {
          console.error('Erro ao gerar URL assinada:', signedUrlError);
          
          // Fallback para URL pública se a URL assinada falhar
          const { data: publicUrlData } = supabase.storage
            .from('restaurantlogos')
            .getPublicUrl(filePath);
            
          if (!publicUrlData || !publicUrlData.publicUrl) {
            console.error('Erro ao obter URL pública do logo. Resposta:', publicUrlData);
            throw new Error('Não foi possível obter a URL do logo após o upload.');
          }
          
          logoUrl = publicUrlData.publicUrl;
          console.log('URL pública do logo (fallback):', logoUrl);
        } else {
          logoUrl = signedUrlData.signedUrl;
          console.log('URL assinada do logo (expira em 5 anos):', logoUrl);
        }
      }

      // Prepara os dados para inserção/atualização na tabela 'restaurants'
      const { logo, ...restOfData } = formData; 
      const dataToSave = {
        ...restOfData,
        logo_url: logoUrl,
      };

      let result;
      
      if (isEditMode && id) {
        // Atualizar restaurante existente
        result = await supabase
          .from('restaurants')
          .update(dataToSave)
          .eq('id', id);
          
        if (result.error) throw result.error;
        setFormMessage('Restaurante atualizado com sucesso!');
      } else {
        // Inserir novo restaurante
        result = await supabase
          .from('restaurants')
          .insert([dataToSave]);
          
        if (result.error) throw result.error;
        setFormMessage('Restaurante cadastrado com sucesso!');
        reset();
      }

      // Redirecionar para a lista após sucesso (opcional)
      setTimeout(() => {
        navigate('/admin/restaurants');
      }, 2000);
      
    } catch (error: any) {
      // Log do erro completo capturado no bloco catch
      console.error('Detalhes completos do erro capturado:', error);

      let userFriendlyMessage = 'Ocorreu um erro inesperado. Verifique o console para mais detalhes.';

      if (error) {
        if (error.message) {
          userFriendlyMessage = `Erro: ${error.message}`;
        }
        // Tentativa de extrair mensagens de erro mais específicas do Supabase
        if (error.details) {
          userFriendlyMessage += ` Detalhes: ${error.details}`;
        }
      }
      
      setFormMessage(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Editar Restaurante' : 'Cadastrar Novo Restaurante/Bar'}
      </h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Campos do formulário permanecem os mesmos */}
        <div>
          <Label htmlFor="name">Nome do Estabelecimento</Label>
          <Input id="name" {...register('name')} />
          // Change from:
          // {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          // To:
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message?.toString()}</p>}
        </div>

        <div>
          <Label htmlFor="location">Localização (Ex: Cidade, Estado)</Label>
          <Input id="location" {...register('location')} />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <Label htmlFor="cuisine">Tipo de Cozinha</Label>
          <Input id="cuisine" {...register('cuisine')} />
          {errors.cuisine && <p className="text-red-500 text-sm mt-1">{errors.cuisine.message}</p>}
        </div>

        <div>
          <Label htmlFor="address">Endereço Completo</Label>
          <Input id="address" {...register('address')} />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" {...register('phone')} />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" {...register('description')} />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <Label htmlFor="promotion">Promoção Principal</Label>
          <Input id="promotion" {...register('promotion')} />
          {errors.promotion && <p className="text-red-500 text-sm mt-1">{errors.promotion.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="availability">Disponibilidade (JSON)</Label>
          <Textarea
            id="availability"
            rows={10}
            {...register('availability')}
            placeholder='Exemplo: {"Segunda": {"morning": "08:00-12:00", "evening": "18:00-22:00"}, ...}'
          />
          {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Insira os horários de funcionamento no formato JSON. Veja o exemplo no campo.
          </p>
        </div>

        <div>
          <Label htmlFor="features">Características Adicionais (separadas por vírgula)</Label>
          <Input 
            id="features" 
            {...register('features')}
            placeholder="Ex: Música ao vivo, Cerveja artesanal, Pet friendly"
          />
          {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features.message}</p>}
        </div>

        {/* Novo campo para upload do logo */}
        <div>
          <Label htmlFor="logo">Logo do Restaurante</Label>
          {currentLogoUrl && (
            <div className="mb-2">
              <p className="text-sm mb-2">Logo atual:</p>
              <img 
                src={currentLogoUrl} 
                alt="Logo atual" 
                className="h-20 w-auto object-contain mb-2" 
              />
            </div>
          )}
          <Input 
            id="logo" 
            type="file" 
            {...register('logo')} 
            accept="image/png, image/jpeg, image/webp, image/gif" // Tipos de arquivo aceitos
          />
          <p className="text-xs text-gray-500 mt-1">
            {isEditMode 
              ? 'Deixe em branco para manter o logo atual' 
              : 'Selecione um arquivo de imagem para o logo'}
          </p>
          {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading 
              ? (isEditMode ? 'Salvando...' : 'Cadastrando...') 
              : (isEditMode ? 'Salvar Alterações' : 'Cadastrar Restaurante')}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/restaurants')}
          >
            Cancelar
          </Button>
        </div>

        {formMessage && (
          <p className={`mt-4 text-sm ${formMessage.startsWith('Erro') ? 'text-red-600' : 'text-green-600'}`}>
            {formMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default RestaurantRegistrationForm;