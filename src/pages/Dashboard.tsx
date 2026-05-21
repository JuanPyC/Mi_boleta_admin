import React, { useEffect, useState } from 'react';
import { getTickets } from '../services/tickets';
import { Ticket } from '../types';
import { TicketCard } from '../components/TicketCard';
import { Link } from 'react-router-dom';
import { ArrowRight, Ticket as TicketIcon, Clock, CheckCircle, XCircle } from 'lucide-react';
import { TicketSkeleton } from '../components/Skeleton';

export const Dashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetching all to calculate summaries (ideally we'd have a dashboard endpoint)
      const res = await getTickets({ limit: 100 });
      setTickets(res.data);
    } catch (err: any) {
      setError('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const pendingTickets = tickets.filter(t => t.status === 'Pendiente');
  const wonTickets = tickets.filter(t => t.status === 'Ganado');
  const lostTickets = tickets.filter(t => t.status === 'Perdido');
  
  // Sort pending by date to get upcoming
  const upcomingTickets = [...pendingTickets]
    .sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="container py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-panel p-6 h-24 animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Próximos Sorteos</h2>
            <div className="grid gap-4">
              {[1, 2, 3].map(i => <TicketSkeleton key={i} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-6 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
          <div className="bg-primary bg-opacity-20 p-3 rounded-full text-primary"><TicketIcon size={24} /></div>
          <div><p className="text-sm text-muted mb-1">Total Juegos</p><p className="text-2xl font-bold">{tickets.length}</p></div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--warning)' }}>
          <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-full text-warning"><Clock size={24} /></div>
          <div><p className="text-sm text-muted mb-1">Pendientes</p><p className="text-2xl font-bold">{pendingTickets.length}</p></div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--success)' }}>
          <div className="bg-green-500 bg-opacity-20 p-3 rounded-full text-success"><CheckCircle size={24} /></div>
          <div><p className="text-sm text-muted mb-1">Ganados</p><p className="text-2xl font-bold">{wonTickets.length}</p></div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--danger)' }}>
          <div className="bg-red-500 bg-opacity-20 p-3 rounded-full text-danger"><XCircle size={24} /></div>
          <div><p className="text-sm text-muted mb-1">Perdidos</p><p className="text-2xl font-bold">{lostTickets.length}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Próximos Sorteos</h2>
            <Link to="/tickets" className="text-primary text-sm hover:underline flex items-center gap-1">Ver todos <ArrowRight size={16} /></Link>
          </div>
          {upcomingTickets.length > 0 ? (
            <div className="grid gap-4">
              {upcomingTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="glass-panel p-8 text-center text-muted border-dashed border-2">
              <p>No tienes sorteos pendientes próximamente.</p>
              <Link to="/tickets" className="text-primary hover:underline mt-2 inline-block">Registrar una boleta</Link>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
          <div className="glass-panel p-0 overflow-hidden">
            {tickets.slice(0, 5).map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <p className="font-medium truncate max-w-[150px]" title={t.title}>{t.title}</p>
                  <p className="text-xs text-muted">{new Date(t.gameDate).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${t.status === 'Ganado' ? 'bg-green-500 bg-opacity-20 text-success' : t.status === 'Perdido' ? 'bg-red-500 bg-opacity-20 text-danger' : 'bg-yellow-500 bg-opacity-20 text-warning'}`}>
                  {t.status}
                </span>
              </div>
            ))}
            {tickets.length === 0 && <div className="p-4 text-center text-muted">No hay actividad</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
