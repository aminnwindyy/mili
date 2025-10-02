import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, X } from 'lucide-react';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // Voice commands mapping
  const commands = {
    // Navigation commands
    'برو به صفحه اصلی': '/',
    'برو به خانه': '/',
    'برو به داشبورد': '/dashboard',
    'برو به نمای کلی': '/dashboard',
    'برو به پروژه ها': '/properties',
    'برو به املاک': '/properties',
    'برو به سرمایه گذاری': '/investments',
    'برو به سرمایه گذاری ها': '/investments',
    'برو به پورتفولیو': '/portfolio',
    'برو به پرتفوی': '/portfolio',
    'برو به بازار ثانویه': '/secondary-market',
    'برو به بازار': '/secondary-market',
    'برو به برنامه وفاداری': '/loyalty',
    'برو به وفاداری': '/loyalty',
    'برو به پورتال مالک': '/owner-portal',
    'برو به تنظیمات': '/settings',

    // Action commands
    'محاسبه سود': 'calculator',
    'ماشین حساب': 'calculator',
    'حساب کن': 'calculator',
    'کمک': 'help',
    'راهنما': 'help',
    'بستن': 'close',
    'خروج': 'close',
  };

  // Response messages
  const responses = {
    navigation: (page) => `در حال انتقال به ${getPageName(page)}...`,
    calculator: 'ماشین حساب باز شد',
    help: 'چطور می‌تونم کمکتون کنم؟ می‌تونید بگید: برو به پروژه‌ها، محاسبه سود، یا هر صفحه‌ای که می‌خواید',
    close: 'دستیار صوتی بسته شد',
    notFound: 'متوجه نشدم. لطفاً دوباره تلاش کنید یا بگید "کمک" برای راهنمایی',
  };

  const getPageName = (path) => {
    const pageNames = {
      '/': 'صفحه اصلی',
      '/dashboard': 'داشبورد',
      '/properties': 'پروژه‌ها',
      '/investments': 'سرمایه‌گذاری‌ها',
      '/portfolio': 'پورتفولیو',
      '/secondary-market': 'بازار ثانویه',
      '/loyalty': 'برنامه وفاداری',
      '/owner-portal': 'پورتال مالک',
      '/settings': 'تنظیمات',
    };
    return pageNames[path] || path;
  };

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fa-IR'; // Persian language
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setResponse('در حال گوش دادن...');
      };
      
      recognitionRef.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.toLowerCase().trim();
        setTranscript(speechResult);
        processCommand(speechResult);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setResponse('خطا در تشخیص صدا. لطفاً دوباره تلاش کنید.');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const processCommand = (command) => {
    console.log('Processing command:', command);
    
    // Find matching command
    let matchedCommand = null;
    let matchedKey = null;
    
    for (const [key, value] of Object.entries(commands)) {
      if (command.includes(key.toLowerCase()) || key.toLowerCase().includes(command)) {
        matchedCommand = value;
        matchedKey = key;
        break;
      }
    }
    
    if (matchedCommand) {
      if (matchedCommand.startsWith('/')) {
        // Navigation command
        setResponse(responses.navigation(matchedCommand));
        setTimeout(() => {
          navigate(matchedCommand);
          setIsOpen(false);
        }, 1000);
      } else if (matchedCommand === 'calculator') {
        setResponse(responses.calculator);
        // Trigger calculator (you can dispatch an event or call a function)
        setTimeout(() => {
          const calculatorEvent = new CustomEvent('openCalculator');
          window.dispatchEvent(calculatorEvent);
        }, 500);
      } else if (matchedCommand === 'help') {
        setResponse(responses.help);
      } else if (matchedCommand === 'close') {
        setResponse(responses.close);
        setTimeout(() => {
          setIsOpen(false);
        }, 1000);
      }
    } else {
      setResponse(responses.notFound);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      setIsOpen(true);
      recognitionRef.current.start();
    } else {
      alert('مرورگر شما از تشخیص صدا پشتیبانی نمی‌کند');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fa-IR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (response && response !== 'در حال گوش دادن...') {
      speakResponse(response);
    }
  }, [response]);

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Floating Voice Button */}
      <button
        onClick={startListening}
        className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
        title="دستیار صوتی"
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>

      {/* Voice Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="mb-4">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                  isListening ? 'bg-red-100 animate-pulse' : 'bg-blue-100'
                }`}>
                  {isListening ? (
                    <MicOff className="w-10 h-10 text-red-600" />
                  ) : (
                    <Mic className="w-10 h-10 text-blue-600" />
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">دستیار صوتی ملک‌چین</h3>
              
              {isListening && (
                <div className="mb-4">
                  <div className="flex justify-center space-x-1 mb-2">
                    <div className="w-2 h-8 bg-blue-500 rounded animate-pulse"></div>
                    <div className="w-2 h-6 bg-blue-400 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-10 bg-blue-500 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-4 bg-blue-300 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                    <div className="w-2 h-7 bg-blue-400 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              )}

              {transcript && (
                <div className="mb-4 p-3 bg-slate-100 rounded-lg">
                  <p className="text-sm text-slate-600">شما گفتید:</p>
                  <p className="font-medium text-slate-900">"{transcript}"</p>
                </div>
              )}

              {response && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 justify-center mb-1">
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600">پاسخ:</span>
                  </div>
                  <p className="text-slate-900">{response}</p>
                </div>
              )}

              <div className="flex gap-2 justify-center">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    شروع گفتگو
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                  >
                    <MicOff className="w-4 h-4" />
                    توقف
                  </button>
                )}
              </div>

              <div className="mt-4 text-xs text-slate-500">
                <p>نمونه دستورات:</p>
                <p>"برو به پروژه‌ها" • "محاسبه سود" • "برو به داشبورد"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
