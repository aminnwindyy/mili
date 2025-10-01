import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function VoiceSearchButton({ onResult }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognition = useRef(null);

  React.useEffect(() => {
    // Check if Speech Recognition is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    
    recognition.current.continuous = false;
    recognition.current.interimResults = false;
    recognition.current.lang = 'fa-IR'; // Persian language

    recognition.current.onstart = () => {
      setIsListening(true);
    };

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        alert('لطفاً به مرورگر اجازه استفاده از میکروفون دهید');
      } else {
        alert('خطا در تشخیص صدا. لطفاً دوباره تلاش کنید');
      }
    };

    recognition.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, [onResult]);

  const startListening = () => {
    if (!isSupported) {
      alert('مرورگر شما از جستجوی صوتی پشتیبانی نمی‌کند');
      return;
    }

    try {
      recognition.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      alert('خطا در شروع تشخیص صدا');
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
  };

  const testSpeech = () => {
    // Text-to-speech test
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('جستجوی صوتی فعال است');
      utterance.lang = 'fa-IR';
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant={isListening ? "destructive" : "outline"}
        onClick={isListening ? stopListening : startListening}
        disabled={!isSupported}
        className={`${isListening ? 'animate-pulse' : ''} transition-all duration-200`}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 mr-2" />
            در حال شنیدن...
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" />
            جستجوی صوتی
          </>
        )}
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        onClick={testSpeech}
        title="تست صدا"
      >
        <Volume2 className="w-4 h-4" />
      </Button>
    </div>
  );
}