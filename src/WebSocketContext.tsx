import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

interface WebSocketContextType {
  tournaments: any[];
  sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Fonction pour envoyer des messages via WebSocket
  const sendMessage = (message: any) => {
    if (socket) {
      socket.emit('message', message);
    } else {
      console.warn('Socket non connecté, message non envoyé.');
    }
  };

  useEffect(() => {
    const newSocket = io(websocketUrl, {
      path: '/ws',
      reconnectionAttempts: 5, // Nombre de tentatives de reconnexion
      reconnectionDelay: 2000,  // Délai entre chaque tentative (2 secondes)
    });    
  
    newSocket.on('connect', () => {
      sendMessage({ type: 'request_initial_state' }); // Vérifiez si ce message est envoyé
    });
  
    newSocket.on('NEW_TOURNAMENT', (message) => {
      setTournaments((prev) => [...prev, message.tournament]);
    });
  
    newSocket.on('disconnect', () => {});
  
    newSocket.on('connect_error', (err) => {
      console.error('Erreur de connexion Socket.IO:', err);
    });
  
    setSocket(newSocket);
  
    return () => {
      newSocket.disconnect();
    };
  }, []);  
  
  return (
    <WebSocketContext.Provider
      value={useMemo(() => ({ tournaments, sendMessage }), [tournaments, sendMessage])}
    >
      {children}
    </WebSocketContext.Provider>
  );  
};

// Custom hook pour utiliser le contexte WebSocket
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
