import { io } from 'socket.io-client';

// Ajuste para seu endereço de API
const SOCKET_URL = 'http://localhost:3000'; // Ou seu endereço de produção

// Configuração do socket
export const socket = io(SOCKET_URL, {
  transports: ['websocket'], // Importante para React Native
  autoConnect: true, // Conectar automaticamente
  reconnectionAttempts: 5, // Tentativas de reconexão
  reconnectionDelay: 1000, // Intervalo entre tentativas
});

// Eventos globais do socket
socket.on('connect', () => {
  console.log('Conectado ao servidor Socket.io');
});

socket.on('disconnect', () => {
  console.log('Desconectado do servidor Socket.io');
});

socket.on('connect_error', (err) => {
  console.log('Erro de conexão:', err.message);
});

export default socket;