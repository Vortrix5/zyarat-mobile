import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

// Define the shape of a ticket
interface Ticket {
  id: string; // Unique ID for the ticket instance
  eventId: string;
  title: string;
  imageUrl?: string;
  location?: string;
  purchaseDate: Date;
  eventDate: Date; // The date selected by the user
  price: string | number;
  qrCodeData: string; // Data for the QR code
}

// Define the context shape
interface TicketsContextType {
  tickets: Ticket[];
  addTicket: (ticketData: Omit<Ticket, 'id' | 'purchaseDate' | 'qrCodeData'>) => void;
  newTicketCount: number; // Keep for potential other uses, but badge will use upcoming count
  resetNewTicketCount: () => void;
  upcomingTicketCount: number; // Add count for upcoming tickets
}

// Create the context with a default value
const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

// Create the provider component
export const TicketsProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicketCount, setNewTicketCount] = useState(0);

  // Calculate upcoming tickets count
  const upcomingTicketCount = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today
    return tickets.filter(ticket => ticket.eventDate >= now).length;
  }, [tickets]); // Recalculate only when tickets array changes

  const addTicket = (ticketData: Omit<Ticket, 'id' | 'purchaseDate' | 'qrCodeData'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `ticket_${Date.now()}_${Math.random().toString(36).substring(7)}`, // Simple unique ID
      purchaseDate: new Date(),
      qrCodeData: `ZYARAT_TICKET_${ticketData.eventId}_${Date.now()}`, // Simple QR data
    };
    setTickets(prevTickets => [...prevTickets, newTicket]);
    setNewTicketCount(prevCount => prevCount + 1);
    console.log('Ticket added:', newTicket);
  };

  const resetNewTicketCount = () => {
    setNewTicketCount(0);
  };

  return (
    <TicketsContext.Provider value={{ tickets, addTicket, newTicketCount, resetNewTicketCount, upcomingTicketCount }}>
      {children}
    </TicketsContext.Provider>
  );
};

// Create a hook for easy consumption
export const useTickets = () => {
  const context = useContext(TicketsContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketsProvider');
  }
  return context;
};
