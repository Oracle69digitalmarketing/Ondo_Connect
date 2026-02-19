
import React, { useState } from 'react';
import { 
  Phone, QrCode, ArrowRight, Zap, ShieldCheck, 
  ExternalLink, MapPin, Award
} from 'lucide-react';

interface USSDUIProps {
  onLogEvent?: (msg: string, type: 'success' | 'info' | 'alert') => void;
  onRegistered?: () => void;
}

const USSDUI: React.FC<USSDUIProps> = ({ onLogEvent, onRegistered }) => {
  const [step, setStep] = useState(0); 
  const [input, setInput] = useState('');
  const [businessName, setBusinessName] = useState('');

  const handleNext = () => {
    if (step === 0 && input === '*123#') {
      setStep(1); setInput('');
      onLogEvent?.("USSD Registration Initiated: *123# dialed.", "info");
    } else if (step === 1 && input) {
      setBusinessName(input); setStep(2); setInput('');
    } else if (step === 2) {
      setStep(3);
      onLogEvent?.(`New Business Verified: ${businessName}.`, "success");
      onRegistered?.();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {step < 3 ? (
          <div className="w-full max-w-[240px] bg-[#f0f4f8] rounded-[2.5rem] p-6 shadow-2xl border-[6px] border-slate-900 space-y-4">
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-[10px] leading-relaxed whitespace-pre-wrap min-h-[140px] shadow-inner border border-white/5">
              {step === 0 && "ONDO CONNECT\n\nDial code to start:\n*123#"}
              {step === 1 && "WELCOME TO ONDO!\n\nEnter Business Name:"}
              {step === 2 && "SELECT INDUSTRY:\n1. Mechanic\n2. Tailor\n3. Hairdresser\n4. Carpenter"}
            </div>

            <div className="relative">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type here..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-black text-slate-800 outline-none"
              />
              <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-500 text-white rounded-lg"><ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        ) : (
          <div className="w-full animate-in slide-in-from-bottom duration-700">
            <div className="bg-white rounded-[2rem] p-6 shadow-2xl border-t-8 border-emerald-500 relative group overflow-hidden">
               <div className="absolute top-4 right-4 rotate-12 opacity-10">
                <Award className="w-20 h-20 text-emerald-900" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="bg-emerald-600 text-white p-2.5 rounded-2xl"><ShieldCheck className="w-6 h-6" /></div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ARTISAN ID</p>
                    <p className="text-xs font-black text-slate-900">#OD-2024-X</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">{businessName}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Akure Central • Verified
                  </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl flex items-center justify-center border border-slate-100 shadow-inner">
                  <QrCode className="w-24 h-24 text-slate-900" />
                </div>
                <button onClick={() => setStep(0)} className="w-full bg-[#008751] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                  Storefront Activated
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {step < 3 && (
        <div className="p-6 grid grid-cols-3 gap-3 border-t border-white/5 bg-slate-900">
          {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(key => (
            <button 
              key={key} 
              onClick={() => setInput(prev => prev + key.toString())}
              className="h-12 rounded-xl bg-white/5 text-white font-black text-lg hover:bg-white/10 active:scale-90 transition-all border border-white/5"
            >
              {key}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default USSDUI;
