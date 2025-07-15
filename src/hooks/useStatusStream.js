import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/api';

export const useStatusStream = () => {
  const [statusData, setStatusData] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(() => {
    try {
      const eventSource = new EventSource(`${API_BASE_URL}/colleagues/status/stream`);
      
      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'initial') {
            const statusMap = {};
            data.colleagues.forEach(colleague => {
              statusMap[colleague.id] = {
                name: colleague.name,
                is_at_work: colleague.is_at_work
              };
            });
            setStatusData(statusMap);
          } else if (data.type === 'statusChange') {
            setStatusData(prev => ({
              ...prev,
              [data.colleagueId]: {
                ...prev[data.colleagueId],
                is_at_work: data.isAtWork
              }
            }));
          }
          // Ignore heartbeat events
        } catch (err) {
          console.error('Error parsing SSE data:', err);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        setIsConnected(false);
        setError('Connection lost. Trying to reconnect...');
        
        // Try to reconnect after 3 seconds
        setTimeout(() => {
          eventSource.close();
          connect();
        }, 3000);
      };

      return eventSource;
    } catch (err) {
      console.error('Error creating SSE connection:', err);
      setError('Failed to connect to status stream');
      setIsConnected(false);
      return null;
    }
  }, []);

  useEffect(() => {
    const eventSource = connect();
    
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [connect]);

  return {
    statusData,
    isConnected,
    error,
    getStatus: (id) => statusData[id]?.is_at_work ?? null
  };
}; 