import { fetchApi } from './api';
import { Ticket, TicketFilters, TicketResponse, TicketsResponse } from '../types';

export const getTickets = async (filters: TicketFilters = {}): Promise<TicketsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.gameType) queryParams.append('gameType', filters.gameType);
  if (filters.q) queryParams.append('q', filters.q);
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());

  const queryString = queryParams.toString();
  const endpoint = `/tickets${queryString ? `?${queryString}` : ''}`;

  return fetchApi<TicketsResponse>(endpoint);
};

export const createTicket = async (ticketData: Partial<Ticket>): Promise<TicketResponse> => {
  return fetchApi<TicketResponse>('/tickets', {
    method: 'POST',
    body: JSON.stringify(ticketData),
  });
};

export const updateTicket = async (id: string, ticketData: Partial<Ticket>): Promise<TicketResponse> => {
  return fetchApi<TicketResponse>(`/tickets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(ticketData),
  });
};

export const updateAdminTicket = async (id: string, ticketData: Partial<Ticket>): Promise<TicketResponse> => {
  return fetchApi<TicketResponse>(`/admin/tickets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(ticketData),
  });
};

export const deleteTicket = async (id: string): Promise<void> => {
  return fetchApi<void>(`/tickets/${id}`, {
    method: 'DELETE',
  });
};

export const getAllAdminTickets = async (filters: TicketFilters = {}): Promise<TicketsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.gameType) queryParams.append('gameType', filters.gameType);
  if (filters.q) queryParams.append('q', filters.q);
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());

  const queryString = queryParams.toString();
  const endpoint = `/admin/tickets${queryString ? `?${queryString}` : ''}`;

  return fetchApi<TicketsResponse>(endpoint);
};
