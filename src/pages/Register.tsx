import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/auth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { UserPlus } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  
  const { register: registerField, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Omitir confirmPassword antes de enviar
      const { confirmPassword, ...userData } = data;
      const response = await register(userData);
      
      // La API no devuelve token al registrar, solo los datos del usuario
      toast.success('Cuenta creada exitosamente. Por favor, inicia sesión.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Error al registrarse');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="glass-panel w-full max-w-md p-8 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 -ml-16 -mt-16 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        
        <div className="text-center mb-8 relative z-10">
          <UserPlus className="text-primary mx-auto mb-4" size={48} />
          <h1 className="text-3xl font-bold mb-2">Crea tu cuenta</h1>
          <p className="text-muted">Únete a la mejor plataforma de boletas</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="relative z-10">
          <Input 
            label="Nombre Completo"
            placeholder="Juan Pérez"
            {...registerField('name')}
            error={errors.name?.message}
          />
          <Input 
            label="Correo Electrónico"
            type="email"
            placeholder="juan@example.com"
            {...registerField('email')}
            error={errors.email?.message}
          />
          <Input 
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            {...registerField('password')}
            error={errors.password?.message}
          />
          <Input 
            label="Confirmar Contraseña"
            type="password"
            placeholder="••••••••"
            className="mb-6"
            {...registerField('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Registrarse
          </Button>
        </form>

        <div className="text-center mt-6 text-sm text-muted relative z-10">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-primary hover:underline">Inicia Sesión</Link>
        </div>
      </div>
    </div>
  );
};
