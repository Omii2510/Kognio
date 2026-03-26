import api from './api';

export const voiceService = {
  processCommand: (command) => api.post('/nlp/process-command', { command }),
  
  startListening: (onResult, onError) => {
    if (!('webkitSpeechRecognition' in window)) {
      onError('Speech recognition not supported');
      return null;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      onError(event.error);
    };

    recognition.start();
    return recognition;
  }
};
