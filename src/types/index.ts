export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type TicketStatus = 'Pendiente' | 'Ganado' | 'Perdido';

export interface Ticket {
  id: string;
  title: string;
  gameType: string;
  gameNumber?: string;
  gameDate: string;
  amount?: number | null;
  place?: string;
  status: TicketStatus;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  owner?: User; // Solo presente en vistas de admin
}

export interface AuthResponse {
  data: {
    token?: string;
    user: User;
  };
}

export interface TicketResponse {
  data: Ticket;
}

export interface TicketsResponse {
  data: Ticket[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TicketFilters {
  status?: string;
  gameType?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
