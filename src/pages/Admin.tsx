import React, { useEffect, useState } from 'react';
import { getAllAdminTickets, updateAdminTicket, deleteTicket } from '../services/tickets';
import { Ticket, TicketStatus } from '../types';
import { TicketCard } from '../components/TicketCard';
import { Select } from '../components/Select';
import { TicketSkeleton } from '../components/Skeleton';
import { Button } from '../components/Button';
import { Search, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

export const Admin: React.FC = () => {
  const { isAdmin } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12, totalPages: 0 });
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchAllTickets = async (page = 1) => {
    try {
      setLoading(true);
      const params: any = { page, limit: meta.limit };
      if (search) params.q = search;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.gameType = typeFilter;
      
      const res = await getAllAdminTickets(params);
      setTickets(res.data);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (error) {
      console.error('Error fetching admin tickets:', error);
      toast.error('Error al cargar los registros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      const delayDebounceFn = setTimeout(() => {
        fetchAllTickets(1);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [search, statusFilter, typeFilter, isAdmin]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      fetchAllTickets(newPage);
    }
  };

  const handleStatusChange = async (id: string, status: TicketStatus) => {
    try {
      const res = await updateAdminTicket(id, { status });
      setTickets(tickets.map(t => t.id === id ? { ...t, status: res.data.status } : t));
      toast.success('Estado actualizado');
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este registro como administrador?')) {
      try {
        await deleteTicket(id);
        setTickets(tickets.filter(t => t.id !== id));
        toast.success('Registro eliminado');
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('');
  };

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="outline" onClick={() => window.history.back()} className="!p-2">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold">Panel de Administrador</h1>
      </div>
      <p className="text-muted mb-8 ml-14">Visualiza y gestiona todos los registros de la plataforma</p>

      <div className="glass-panel p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-3 text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por título, número, email..." 
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
          <Button variant="outline" onClick={clearFilters} className="!py-1 !px-3 text-sm w-full md:w-auto">
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
          <p className="text-lg">No se encontraron registros en el sistema.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tickets.map(ticket => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket} 
                isAdminView={true}
                onStatusChange={handleStatusChange}
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
    </div>
  );
};
