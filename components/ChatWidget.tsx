import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy AuroraBot. ¿En qué puedo ayudarte hoy con nuestros productos o servicios?', timestamp: new Date() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Convert internal message format to Gemini history format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessageToGemini(history, userMsg.text);
      
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      <div 
        className={`pointer-events-auto bg-white rounded-2xl shadow-2xl w-[90vw] sm:w-[380px] mb-4 transition-all duration-300 origin-bottom-right overflow-hidden border border-gray-100 ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 h-0'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/10 rounded-full">
              <Sparkles className="w-5 h-5 text-aurora-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Asistente Virtual</h3>
              <p className="text-xs text-gray-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                En línea (Gemini AI)
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-aurora-100' : 'bg-slate-200'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-aurora-600" /> : <Bot className="w-5 h-5 text-slate-700" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-aurora-500 text-white rounded-br-none' 
                  : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-2">
               <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-slate-700" />
               </div>
               <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                 <div className="flex gap-1">
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu consulta..."
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500/20 focus:border-aurora-500 transition-all text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-aurora-500 text-white rounded-lg hover:bg-aurora-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[10px] text-center text-gray-400 mt-2">
            Potenciado por Google Gemini AI
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto group relative flex items-center justify-center w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg hover:shadow-aurora-500/30 hover:scale-105 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-aurora-500 rounded-full opacity-0 group-hover:opacity-20 animate-ping"></div>
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>
    </div>
  );
};