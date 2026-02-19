
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Camera, Mic, ChevronLeft, Award, X, Navigation,
  MapPin, MoreVertical, Languages, Play, Loader2,
  Scan, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { ChatMessage } from '../types';
import { getSmartResponse, speakText } from '../services/ai';

interface WhatsAppUIProps {
  initialMessages: ChatMessage[];
  userName: string;
  userAvatar: string;
  journey: 'AMINA' | 'BOLA';
  onLogEvent?: (msg: string, type: 'success' | 'info' | 'alert') => void;
  onImpact?: (val: number) => void;
}

const WhatsAppUI: React.FC<WhatsAppUIProps> = ({ 
  initialMessages, userName, userAvatar, journey, onLogEvent, onImpact 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handlePlayAudio = async (text: string, msgId: string) => {
    if (playingId) return;
    setPlayingId(msgId);
    try {
      await speakText(text);
    } catch (err) {
      console.error("Speech error:", err);
    } finally {
      setPlayingId(null);
    }
  };

  const handleSend = async (text: string = input, img?: string) => {
    if (!text.trim() && !img) return;

    if (img) {
      setIsScanning(true);
      onLogEvent?.("System: Analyzing media with Groq Vision...", "info");
      await new Promise(r => setTimeout(r, 1200));
      setIsScanning(false);
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: text || (journey === 'AMINA' ? "Shared crop photo for analysis" : "Shared collection photo for verification"),
      sender: 'user',
      timestamp: new Date(),
      image: img,
      isSynced: true
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const context = journey === 'AMINA' 
      ? "Farmer Amina workflow. Analyzing agricultural data in Ondo. Multilingual mode: ON. Location: Odigbo Cluster." 
      : "Waste collector Bola workflow. Verifying collection and planning routes in Akure Hub Cluster.";

    // Logic split between Groq (Vision) and DeepSeek (Text) handled in service
    const botText = await getSmartResponse(text, context, img);

    setIsTyping(false);
    const botId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: botId,
      text: botText,
      sender: 'bot',
      timestamp: new Date()
    }]);

    // Demo Side Effects
    if (journey === 'AMINA' && img) {
      onLogEvent?.("AI Engine: Potential crop stress detected via Groq Vision.", "alert");
    }
    if (journey === 'BOLA' && img) {
      setShowReward(true);
      onImpact?.(25);
      onLogEvent?.("Verified: 50kg contribution synced via DeepSeek Logic.", "success");
    }
    if (journey === 'BOLA' && (text.toLowerCase().includes('route') || text.toLowerCase().includes('map') || text.toLowerCase().includes('go'))) {
      setShowMap(true);
    }
  };

  return (
    <div className="flex flex-col h-full whatsapp-bg relative overflow-hidden">
      {/* Reward Splash */}
      {showReward && (
        <div className="absolute inset-0 z-[60] bg-black/70 backdrop-blur-xl flex items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="bg-white rounded-[4rem] p-10 shadow-2xl space-y-8 animate-in zoom-in duration-500 border border-white/20 max-w-[260px] relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
            <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner transform rotate-12">
              <Award className="w-12 h-12 text-emerald-600 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-slate-800 uppercase italic leading-none tracking-tighter">Impact Credited</h4>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">State Circular Hub #042</p>
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-black text-emerald-600 tracking-tighter leading-none">₦2,500</p>
              <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">+120 EcoPoints</p>
            </div>
            <button 
              onClick={() => setShowReward(false)} 
              className="w-full bg-[#075e54] text-white py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-[#064e46] active:scale-95 transition-all"
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      )}

      {/* Scanning Overlay */}
      {isScanning && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 animate-pulse">
            <div className="relative">
              <Scan className="w-16 h-16 text-[#075e54]" />
              <div className="absolute inset-0 border-2 border-emerald-500 rounded-lg animate-ping"></div>
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Groq Vision AI</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Analyzing Media Markers...</p>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Header */}
      <div className="bg-[#075e54] text-white p-4 flex items-center gap-3 z-10 shadow-lg shrink-0">
        <ChevronLeft className="w-5 h-5 opacity-70" />
        <div className="relative">
          <img src={userAvatar} className="w-10 h-10 rounded-full border border-white/20 object-cover" alt="avatar" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#075e54] shadow-sm"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold truncate leading-tight tracking-tight">{userName}</h3>
          <p className="text-[9px] opacity-70 uppercase tracking-widest font-black flex items-center gap-1.5">
            <ShieldCheck className="w-2.5 h-2.5" /> SECURE NODE 
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setIsTranslating(!isTranslating); handleSend("Please translate your last message to " + (isTranslating ? "English" : "Yoruba")); }}
            className={`p-2 rounded-xl transition-all ${isTranslating ? 'bg-white/20 scale-110 shadow-lg' : 'hover:bg-white/10'}`}
          >
            <Languages className="w-4 h-4 opacity-90" />
          </button>
          <MoreVertical className="w-5 h-5 opacity-70" />
        </div>
      </div>

      {/* Message Stream */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
        <div className="flex justify-center mb-6">
          <span className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] shadow-sm border border-black/5">Today</span>
        </div>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] p-3.5 rounded-2xl text-[12px] shadow-lg relative group transition-all animate-in slide-in-from-bottom-3 duration-500 ${
              msg.sender === 'user' ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none border border-black/5'
            }`}>
              {msg.image && (
                <div className="mb-3 overflow-hidden rounded-[1.2rem] border border-black/5 shadow-inner bg-slate-100">
                  <img src={msg.image} className="w-full h-36 object-cover hover:scale-110 transition-transform duration-700" alt="upload" />
                </div>
              )}
              <p className="leading-snug text-slate-800 font-medium whitespace-pre-wrap">{msg.text}</p>
              
              {msg.sender === 'bot' && (
                <button 
                  onClick={() => handlePlayAudio(msg.text, msg.id)}
                  className={`mt-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl border transition-all ${
                    playingId === msg.id ? 'bg-[#075e54] text-white shadow-lg' : 'bg-slate-50 text-[#075e54] hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {playingId === msg.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  {playingId === msg.id ? 'Playing...' : 'Voice Assist'}
                </button>
              )}
              
              <div className="flex justify-end mt-1.5 opacity-30 text-[8px] font-black tabular-nums tracking-widest">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-3 p-3.5 bg-white/60 backdrop-blur-md rounded-2xl w-fit border border-white/40 animate-in fade-in">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
            </div>
            <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">DeepSeek Processing...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-[#f0f0f0]/95 backdrop-blur-md border-t border-black/5 flex items-center gap-3 shrink-0 pb-6">
        <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2 shadow-sm border border-black/5">
          <input 
            type="text" 
            placeholder="Citizen Input..." 
            className="flex-1 bg-transparent border-none outline-none text-xs p-1 font-medium placeholder:text-slate-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={() => fileRef.current?.click()} 
            className="text-slate-400 p-2 hover:text-[#075e54] transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input 
            type="file" 
            ref={fileRef} 
            className="hidden" 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => handleSend("", reader.result as string);
                reader.readAsDataURL(file);
              }
            }} 
          />
        </div>
        <button 
          onClick={() => input ? handleSend() : handlePlayAudio("Recording citizen voice note...", "recording")} 
          className="bg-[#128c7e] w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl active:scale-90 transition-transform hover:bg-[#075e54]"
        >
          {input ? <Send className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>

      {/* Map Overlay */}
      {showMap && (
        <div className="absolute inset-0 z-[100] bg-white animate-in slide-in-from-bottom-full duration-700 flex flex-col">
          <div className="p-5 bg-[#075e54] text-white flex justify-between items-center shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></div>
              <h4 className="text-sm font-black uppercase tracking-tighter italic">Live Routing Hub</h4>
            </div>
            <button onClick={() => setShowMap(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 bg-slate-100 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-40 grayscale" alt="map" />
            <div className="absolute bottom-10 left-6 right-6 space-y-4">
              <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Destination</p>
                    <p className="text-xl font-black text-slate-950 tracking-tighter italic uppercase">Shoprite Akure Hub</p>
                  </div>
                  <div className="bg-blue-50 px-4 py-2 rounded-2xl text-blue-700 font-black text-xs border border-blue-100 shadow-sm">8 MINS</div>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="w-2/3 h-full bg-blue-500 rounded-full shadow-sm"></div>
                </div>
              </div>
              <button 
                onClick={() => { setShowMap(false); handleSend("Hub Arrival: Requesting verification for 50kg plastics."); }}
                className="w-full bg-[#008751] text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-[#007041] active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                Confirm Arrival <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppUI;
