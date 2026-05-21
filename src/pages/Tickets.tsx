import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { getTickets, createTicket, updateTicket, deleteTicket } from '../services/tickets';
import { Ticket } from '../types';
import { TicketCard } from '../components/TicketCard';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { TicketSkeleton } from '../components/Skeleton';
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ticketSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  gameType: z.string().min(1, 'El tipo de juego es requerido'),
  gameNumber: z.string().optional(),
  gameDate: z.string().min(1, 'La fecha es requerida'),
  amount: z.coerce.number().min(0, 'El monto debe ser positivo').optional(),
  place: z.string().optional(),
  status: z.enum(['Pendiente', 'Ganado', 'Perdido']),
  notes: z.string().optional(),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 9, totalPages: 0 });
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
  });

  const fetchUserTickets = async (page = 1) => {
    try {
      setLoading(true);
      const params: any = { page, limit: meta.limit };
      if (search) params.q = search;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.gameType = typeFilter;
      const res = await getTickets(params);
      setTickets(res.data);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Error al cargar las boletas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUserTickets(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter, typeFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      fetchUserTickets(newPage);
    }
  };

  const openCreateModal = () => {
    setEditingTicket(null);
    reset({
      title: '', 
      gameType: 'Lotería', 
      gameNumber: '', 
      gameDate: new Date().toISOString().slice(0, 16), 
      amount: undefined, 
      place: '', 
      status: 'Pendiente', 
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ticket: Ticket) => {
    setEditingTicket(ticket);
    reset({
      ...ticket,
      gameDate: new Date(ticket.gameDate).toISOString().slice(0, 16),
      amount: ticket.amount || undefined,
      gameNumber: ticket.gameNumber || '',
      place: ticket.place || '',
      notes: ticket.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      try {
        await deleteTicket(id);
        setTickets(tickets.filter(t => t.id !== id));
        toast.success('Registro eliminado');
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const onSubmit = async (data: TicketFormValues) => {
    try {
      const payload = {
        ...data,
        gameDate: new Date(data.gameDate).toISOString()
      };

      if (editingTicket) {
        const res = await updateTicket(editingTicket.id, payload);
        setTickets(tickets.map(t => t.id === editingTicket.id ? res.data : t));
        toast.success('Registro actualizado');
      } else {
        const res = await createTicket(payload);
        setTickets([res.data, ...tickets]);
        toast.success('Registro creado');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar');
    }
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Mis Boletas</h1>
        <Button onClick={openCreateModal}><Plus size={20} /> Nuevo Registro</Button>
      </div>

      <div className="glass-panel p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-3 text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por título, lugar, notas..." 
            className="form-input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { value: 'Pendiente', label: 'Pendiente' },
              { value: 'Ganado', label: 'Ganado' },
              { value: 'Perdido', label: 'Perdido' }
            ]}
            className="mb-0 flex-1 md:min-w-[150px]"
          />
          <Select 
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)}
            options={[
              { value: 'Lotería', label: 'Lotería' },
              { value: 'Rifa', label: 'Rifa' },
              { value: 'Sorteo', label: 'Sorteo' },
              { value: 'Boleta', label: 'Boleta' },
              { value: 'Juego ocasional', label: 'Juego ocasional' }
            ]}
            className="mb-0 flex-1 md:min-w-[150px]"
          />
        </div>
        {(statusFilter || typeFilter || search) && (
          <Button variant="outline" onClick={() => { setStatusFilter(''); setTypeFilter(''); setSearch(''); }} className="!py-1 !px-3 text-sm w-full md:w-auto">
            Limpiar
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <TicketSkeleton key={i} />)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="glass-panel p-12 text-center text-muted border-dashed border-2">
          <p className="text-lg mb-4">No tienes registros que coincidan con los filtros.</p>
          <Button onClick={openCreateModal} variant="outline">Crea tu primer registro</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tickets.map(ticket => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket} 
                onEdit={openEditModal} 
                onDelete={handleDelete} 
              />
            ))}
          </div>

          {meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page === 1}
                className="!p-2"
              >
                <ChevronLeft size={20} />
              </Button>
              <span className="text-sm">
                Página <strong>{meta.page}</strong> de {meta.totalPages}
              </span>
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page === meta.totalPages}
                className="!p-2"
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTicket ? 'Editar Registro' : 'Nuevo Registro'}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <Input 
            label="Nombre del Sorteo" 
            required 
            {...register('title')} 
            error={errors.title?.message}
            placeholder="Ej. Baloto" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Tipo de Juego" 
              required 
              {...register('gameType')} 
              error={errors.gameType?.message}
              options={[ 
                { value: 'Lotería', label: 'Lotería' }, 
                { value: 'Rifa', label: 'Rifa' }, 
                { value: 'Sorteo', label: 'Sorteo' }, 
                { value: 'Boleta', label: 'Boleta' }, 
                { value: 'Juego ocasional', label: 'Juego ocasional' } 
              ]} 
            />
            <Select 
              label="Estado" 
              required 
              {...register('status')} 
              error={errors.status?.message}
              options={[ 
                { value: 'Pendiente', label: 'Pendiente' }, 
                { value: 'Ganado', label: 'Ganado' }, 
                { value: 'Perdido', label: 'Perdido' } 
              ]} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Fecha del Sorteo" 
              type="datetime-local" 
              required 
              {...register('gameDate')} 
              error={errors.gameDate?.message}
            />
            <Input 
              label="Número Jugado (Opcional)" 
              {...register('gameNumber')} 
              error={errors.gameNumber?.message}
              placeholder="Ej. 1234" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Valor Apostado (Opcional)" 
              type="number" 
              min="0" 
              step="0.01" 
              {...register('amount')} 
              error={errors.amount?.message}
              placeholder="Ej. 5000" 
            />
            <Input 
              label="Lugar de Compra (Opcional)" 
              {...register('place')} 
              error={errors.place?.message}
              placeholder="Ej. Tienda Esquina" 
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Notas Adicionales (Opcional)</label>
            <textarea 
              className={`form-input ${errors.notes ? 'border-red-500' : ''}`}
              rows={3} 
              {...register('notes')}
              placeholder="Ej. Premio de 10 millones"
            />
            {errors.notes && <span className="text-danger text-sm mt-1 block">{errors.notes.message}</span>}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" isLoading={isSubmitting}>Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
