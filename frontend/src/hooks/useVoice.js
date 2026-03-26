import { useState } from 'react';
import { voiceService } from '../services/voiceService';

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const startListening = () => {
    setIsListening(true);
    setError(null);
    
    voiceService.startListening(
      (text) => {
        setTranscript(text);
        setIsListening(false);
      },
      (err) => {
        setError(err);
        setIsListening(false);
      }
    );
  };

  const processCommand = async (command) => {
    try {
      const response = await voiceService.processCommand(command);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { isListening, transcript, error, startListening, processCommand, setTranscript };
};
