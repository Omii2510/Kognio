import api from './api';

export const chatService = {
  sendMessage: (message, sessionId) => api.post('/chat/chat', { message, sessionId }),
  clearChat: (sessionId) => api.post('/chat/clear', { sessionId })
};
