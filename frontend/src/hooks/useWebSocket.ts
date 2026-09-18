import { useEffect, useRef, useState, useCallback } from 'react';

export interface WebSocketOptions<T> {
  url?: string;
  enabled?: boolean;
  onMessage?: (data: T) => void;
  reconnectInterval?: number;
}

export function useWebSocket<T = unknown>({
  url = 'ws://localhost:8000/ws',
  enabled = false, // Disabled by default until FastAPI backend runs
  onMessage,
  reconnectInterval = 5000,
}: WebSocketOptions<T> = {}) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<T | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as T;
          setLastMessage(parsed);
          onMessage?.(parsed);
        } catch {
          // Non-json message
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (enabled) {
          reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      setIsConnected(false);
    }
  }, [enabled, onMessage, reconnectInterval, url]);

  useEffect(() => {
    if (enabled) {
      connect();
    }
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [enabled, connect]);

  const sendMessage = useCallback((data: unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { isConnected, lastMessage, sendMessage };
}
