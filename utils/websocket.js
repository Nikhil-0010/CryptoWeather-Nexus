'use client';

import { store } from '@/redux/store';
import { updateCryptoPrice, setWebsocketConnected } from '@/redux/features/cryptoSlice';
import { toast } from 'sonner';

let ws=null; // Singleton WebSocket instance
let reconnectAttempts = 0;
const MAX_RETRIES = 5;

export const initializeWebSocket = () => {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    // console.log('WebSocket already initialized');
    return ws; // Return the existing WebSocket instance
  }
  ws = new WebSocket(`wss://wss.coincap.io/prices?assets=bitcoin,ethereum,cardano&apiKey=${process.env.NEXT_PUBLIC_COINCAP_API_KEY}`);

  ws.onopen = () => {
    store.dispatch(setWebsocketConnected(true));
    toast.success('Connected to crypto price feed');
    reconnectAttempts=0;
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      Object.entries(data).forEach(([asset, price]) => {
        store.dispatch(updateCryptoPrice({ id: asset, price: Number(price) }));
      });
    } catch (error) {
      console.error('WebSocket message parse error:', error);
    }
  };

  ws.onclose = () => {
    store.dispatch(setWebsocketConnected(false));
    // Only reconnect if it was an unexpected disconnect
    if (event.code !== 1000 && reconnectAttempts < MAX_RETRIES) {
      toast.error(`Disconnected from crypto price feed. Retrying in ${5 * (reconnectAttempts + 1)}s...`);
      ws = null;
      attemptReconnect();
    } else {
      console.warn('WebSocket closed normally or max retries reached.');
    }
  };

  ws.onerror = (error) => {
    // console.error('WebSocket error:', error);
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING){
      ws.close();
    }
    toast.error('Error connecting to crypto price feed. Retrying...');
    ws = null;
    attemptReconnect();
  };

  return ws;
};

// Prevent multiple reconnection attempts
const attemptReconnect = () => {
  if (reconnectAttempts >= MAX_RETRIES) {
    toast.error('Max reconnect attempts reached. Please refresh the page.');
    return;
  }

  setTimeout(() => {
    reconnectAttempts++;
    initializeWebSocket();
  }, 5000 * reconnectAttempts); // Exponential backoff
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