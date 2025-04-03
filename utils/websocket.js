'use client';

import { store } from '@/redux/store';
import { updateCryptoPrice, setWebsocketConnected } from '@/redux/features/cryptoSlice';
import { toast } from 'sonner';

let ws=null; // Singleton WebSocket instance
let reconnectTimeout = null; // Timeout reference for reconnection attempts

export const initializeWebSocket = () => {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    // console.log('WebSocket already initialized');
    return ws; // Return the existing WebSocket instance
  }
  ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,cardano');

  ws.onopen = () => {
    store.dispatch(setWebsocketConnected(true));
    toast.success('Connected to crypto price feed');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    Object.entries(data).forEach(([asset, price]) => {
      store.dispatch(updateCryptoPrice({ id: asset, price: Number(price) }));
    });
  };

  ws.onclose = () => {
    store.dispatch(setWebsocketConnected(false));
    toast.error('Disconnected from crypto price feed');
    attemptReconnect();
  };

  ws.onerror = (error) => {
    // console.error('WebSocket error:', error);
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING){
      ws.close();
    }
    toast.error('Error connecting to crypto price feed. Retrying...');
    attemptReconnect();
  };

  return ws;
};

// Prevent multiple reconnection attempts
const attemptReconnect = () => {
  if (reconnectTimeout) return; // If a reconnect is already scheduled, exit

  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null; // Clear timeout reference after execution
    initializeWebSocket(); // Reconnect WebSocket
  }, 5000); // Retry after 5 seconds
};

// Simulate weather alerts
export const initializeWeatherAlerts = () => {
  const cities = ['New York', 'London', 'Tokyo'];
  const alerts = [
    'Storm Warning',
    'Heavy Rain Alert',
    'High Temperature Warning',
    'Strong Winds Expected',
  ];

  setInterval(() => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    const message = `${randomAlert} in ${randomCity}`;
    
    toast.warning(message, {
      description: 'Weather alert received',
    });
  }, 300000); // Every 5 minutes
};