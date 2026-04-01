import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore.js';
import { useEventStore } from '@/store/eventStore.js';

/**
 * Manages a Socket.io connection scoped to an optional projectId room.
 * @param {string|null} projectId
 * @returns {{ connected: boolean }}
 */
export const useSocket = (projectId = null) => {
  const { token } = useAuthStore();
  const { updateEvent, prependEvent } = useEventStore();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const socket = io(
      import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
      {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      }
    );

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      if (projectId) {
        socket.emit('join:project', projectId);
      }
    });

    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', () => setConnected(false));

    socket.on('event:updated', (data) => {
      updateEvent(data);
    });

    socket.on('event:created', (data) => {
      prependEvent(data);
    });

    return () => {
      if (projectId && socket.connected) {
        socket.emit('leave:project', projectId);
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, projectId]);

  return { connected };
};
