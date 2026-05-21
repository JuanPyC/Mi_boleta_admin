import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/auth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Ticket as TicketIcon } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  
  const { register: registerField, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login(data);
      if (response.data?.token) {
        authLogin(response.data.token, response.data.user);
        toast.success(`Bienvenido, ${response.data.user.name}`);
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="glass-panel w-full max-w-md p-8 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-secondary rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        
        <div className="text-center mb-8 relative z-10">
          <TicketIcon className="text-primary mx-auto mb-4" size={48} />
          <h1 className="text-3xl font-bold mb-2">Bienvenido de nuevo</h1>
          <p className="text-muted">Inicia sesión en Mi Boleta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="relative z-10">
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
            className="mb-6"
            {...registerField('password')}
            error={errors.password?.message}
          />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Iniciar Sesión
          </Button>
        </form>

        <div className="text-center mt-6 text-sm text-muted relative z-10">
          ¿No tienes una cuenta? <Link to="/register" className="text-primary hover:underline">Regístrate</Link>
        </div>
      </div>
    </div>
  );
};
