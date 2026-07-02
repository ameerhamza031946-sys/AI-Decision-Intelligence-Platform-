import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, Loader2, Brain } from 'lucide-react';
import { sendChatMessage } from '../services/api';
import toast from 'react-hot-toast';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your Smart Community AI Assistant. How can I help you analyze data or make decisions today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Suggestions for the user to quickly get started
  const suggestions = [
    'How can we reduce traffic congestion?',
    'Analyze air quality index trends.',
    'Recommend public health improvements.',
    'Generate economic growth indicators.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to state
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Call the API service to get AI response
      const response = await sendChatMessage(messages, userMessage);
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.response || response },
      ]);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to get response from AI');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error connecting to the backend. Please check if the backend is running.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat cleared. How can I assist you with your smart community data today?',
      },
    ]);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col bg-surface-950 text-slate-100 p-4 lg:p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-primary">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2">
              Decision AI Assistant
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h1>
            <p className="text-xs text-slate-400">Smart City Analysis & Action Planner</p>
          </div>
        </div>

        {messages.length > 1 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/15 hover:text-red-400 text-slate-400 text-xs font-medium border border-white/5 transition-all"
            title="Clear Chat"
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              msg.role === 'user'
                ? 'bg-surface-800 border border-white/10 text-slate-300'
                : 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow-primary'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Bubble */}
            <div className={`p-4 rounded-2xl text-sm leading-relaxed border transition-all ${
              msg.role === 'user'
                ? 'bg-primary-600/25 border-primary-500/35 text-slate-100 rounded-tr-none'
                : 'bg-surface-900/80 border-white/5 text-slate-200 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center shadow-glow-primary">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-2xl bg-surface-900/80 border border-white/5 rounded-tl-none flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
              <span className="text-slate-400 text-xs font-medium">Assistant is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts (only when chat has just welcome message) */}
      {messages.length === 1 && !loading && (
        <div className="relative z-10 mb-4 animate-fade-in">
          <p className="text-xs text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
            <Sparkles size={12} className="text-primary-400" />
            Quick Suggestion Queries:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left text-xs bg-surface-900 hover:bg-surface-800 border border-white/5 hover:border-primary-500/30 p-3 rounded-xl text-slate-300 hover:text-slate-100 transition-all duration-250 cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="relative z-10 flex gap-2">
        <input
          type="text"
          placeholder="Ask a decision intelligence question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 bg-surface-900 border border-white/5 focus:border-primary-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500/30 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-primary-600 hover:bg-primary-500 text-white font-medium px-4 py-3 rounded-xl transition-all shadow-glow-primary flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
