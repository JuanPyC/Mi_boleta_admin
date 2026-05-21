import React from 'react';
import { Ticket, TicketStatus } from '../types';
import { Calendar, Tag, MapPin, Hash, DollarSign, Edit, Trash2, ChevronDown } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: TicketStatus) => void;
  isAdminView?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({ 
  ticket, 
  onEdit, 
  onDelete, 
  onStatusChange,
  isAdminView 
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ganado': return <span className="badge badge-success">Ganado</span>;
      case 'Perdido': return <span className="badge badge-danger">Perdido</span>;
      default: return <span className="badge badge-warning">Pendiente</span>;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Ganado': return 'text-[#10b981] border-[#10b981] bg-[#10b981]/10 hover:bg-[#10b981]/20';
      case 'Perdido': return 'text-[#ef4444] border-[#ef4444] bg-[#ef4444]/10 hover:bg-[#ef4444]/20';
      default: return 'text-[#f59e0b] border-[#f59e0b] bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20';
    }
  };

  const getGameTypeColor = (type: string) => {
    switch(type) {
      case 'Lotería': return '#8b5cf6'; // Primary
      case 'Rifa': return '#ec4899'; // Secondary
      case 'Sorteo': return '#3b82f6'; // Blue
      case 'Boleta': return '#10b981'; // Green
      default: return '#f59e0b'; // Yellow
    }
  };

  const date = new Date(ticket.gameDate).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="glass-panel p-4 flex flex-col gap-4 animate-fade-in" style={{ borderTop: `4px solid ${getGameTypeColor(ticket.gameType)}` }}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl mb-1">{ticket.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Tag size={14} /> <span>{ticket.gameType}</span>
          </div>
        </div>
        
        {isAdminView && onStatusChange ? (
          <div className="relative">
            <select 
              value={ticket.status}
              onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
              className={`text-xs font-bold pl-3 pr-7 py-1 rounded-full border cursor-pointer outline-none transition-all appearance-none ${getStatusStyles(ticket.status)}`}
            >
              <option value="Pendiente" style={{ background: '#1e293b', color: '#f59e0b' }}>Pendiente</option>
              <option value="Ganado" style={{ background: '#1e293b', color: '#10b981' }}>Ganado</option>
              <option value="Perdido" style={{ background: '#1e293b', color: '#ef4444' }}>Perdido</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" size={14} />
          </div>
        ) : (
          getStatusBadge(ticket.status)
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {ticket.gameNumber && (
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-primary" />
            <span>Nº {ticket.gameNumber}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-primary" />
          <span>{date}</span>
        </div>
        {ticket.amount && (
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-primary" />
            <span>${Number(ticket.amount).toLocaleString('es-CO')}</span>
          </div>
        )}
        {ticket.place && (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            <span className="truncate" title={ticket.place}>{ticket.place}</span>
          </div>
        )}
      </div>

      {ticket.notes && (
        <div className="text-sm text-muted mt-2 p-2 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <em>"{ticket.notes}"</em>
        </div>
      )}

      {isAdminView && ticket.owner && (
        <div className="text-xs text-muted mt-2 border-t pt-2" style={{ borderColor: 'var(--border-color)' }}>
          <strong>Propietario:</strong> {ticket.owner.name} ({ticket.owner.email})
        </div>
      )}

      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-2 mt-auto pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          {onEdit && (
            <button onClick={() => onEdit(ticket)} className="p-2 text-primary hover:bg-white hover:bg-opacity-10 rounded transition" title="Editar">
              <Edit size={18} />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(ticket.id)} className="p-2 text-danger hover:bg-white hover:bg-opacity-10 rounded transition" title="Eliminar">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
