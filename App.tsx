
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { JourneyType, AppEvent } from './types';
import { JOURNEYS } from './constants';
import PhoneFrame from './components/PhoneFrame';
import WhatsAppUI from './components/WhatsAppUI';
import USSDUI from './components/USSDUI';
import AdminDashboard from './components/AdminDashboard';
import { Globe, ArrowRight, ShieldCheck, Sparkles, Command } from 'lucide-react';

const App: React.FC = () => {
  const [activeJourney, setActiveJourney] = useState<JourneyType>('AMINA');
  const [wasteRecovered, setWasteRecovered] = useState(420);
  const [jobsCreated, setJobsCreated] = useState(1248);
  const [events, setEvents] = useState<AppEvent[]>([]);

  const logEvent = useCallback((message: string, type: 'success' | 'info' | 'alert') => {
    const newEvent: AppEvent = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      message,
      type
    };
    setEvents(prev => [newEvent, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    logEvent("Ondo Connect State Hub V2 online.", "success");
    logEvent("Connection established: Akure Central Hub.", "info");
    logEvent("AI Core: Initializing regional intelligence engine.", "info");
  }, [logEvent]);

  const handleImpact = (val: number) => {
    setWasteRecovered(prev => prev + val);
    setJobsCreated(prev => prev + 1);
  };

  const currentJourneyData = useMemo(() => 
    JOURNEYS.find(j => j.id === activeJourney) || JOURNEYS[0]
  , [activeJourney]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900 selection:bg-emerald-100 antialiased overflow-x-hidden">
      {/* State-Level Platform Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-[#008751] rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-200 transform hover:rotate-6 hover:scale-110 transition-all duration-500 cursor-pointer">
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tighter leading-none italic uppercase">Ondo Connect</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
              <p className="text-[10px] text-emerald-800 font-black tracking-[0.4em] uppercase">Sunshine State Economic OS</p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex gap-14 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Economic Hub Performance</span>
            <span className="text-xl font-black text-slate-950 tracking-tighter tabular-nums leading-none mt-1.5">96.8 / 100</span>
          </div>
          <button 
            onClick={() => setActiveJourney('ADMIN')}
            className="bg-slate-950 text-white px-10 py-[18px] rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3 shadow-2xl hover:bg-slate-800 transition-all hover:-translate-y-1 active:translate-y-0 group border border-white/10"
          >
            <Command className="w-4 h-4 text-emerald-400 group-hover:rotate-90 transition-transform" /> COMMAND CENTER
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-12 flex flex-col items-center">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          <div className="lg:col-span-4 flex justify-center sticky lg:top-36 h-fit">
            <div className="relative group">
              <div className={`absolute -inset-24 opacity-30 blur-[140px] rounded-full transition-all duration-1000 animate-pulse ${
                activeJourney === 'AMINA' ? 'bg-green-500' : 
                activeJourney === 'CHUKA' ? 'bg-blue-500' : 
                activeJourney === 'BOLA' ? 'bg-emerald-500' : 'bg-slate-950'
              }`}></div>
              
              {activeJourney === 'ADMIN' ? (
                <div className="w-full max-w-[440px] h-[720px] bg-white rounded-[4.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden relative animate-in zoom-in duration-500">
                  <AdminDashboard wasteTotal={wasteRecovered} jobsTotal={jobsCreated} events={events} />
                </div>
              ) : (
                <div className="animate-in slide-in-from-bottom duration-700">
                  <PhoneFrame title={activeJourney}>
                    {activeJourney === 'AMINA' && (
                      <WhatsAppUI 
                        journey="AMINA"
                        userName="Amina (Farmer)" 
                        userAvatar="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop"
                        onLogEvent={logEvent}
                        initialMessages={[
                          { id: '1', text: "E ku ijoko, Amina! 🌾 I am your AI Farmer Assistant, here to help you grow.", sender: 'bot', timestamp: new Date() },
                          { id: '2', text: "Weather Alert: Heavy rain predicted in Odigbo. Protect your cocoa fermenting today.", sender: 'bot', timestamp: new Date() },
                        ]}
                      />
                    )}
                    {activeJourney === 'CHUKA' && (
                      <USSDUI onLogEvent={logEvent} onRegistered={() => {
                        setJobsCreated(p => p + 1);
                        logEvent("Formalization: New Digital Artisan ID #OD-2024-CH issued.", "success");
                      }} />
                    )}
                    {activeJourney === 'BOLA' && (
                      <WhatsAppUI 
                        journey="BOLA"
                        userName="Bola (Collector)" 
                        userAvatar="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop"
                        onImpact={handleImpact}
                        onLogEvent={logEvent}
                        initialMessages={[
                          { id: '1', text: "Hi Bola! 🌍 Great collections yesterday. Your impact has been recorded.", sender: 'bot', timestamp: new Date() },
                          { id: '2', text: "URGENT HUB ALERT: 50kg PET Waste verified. Your collection is ready for payout.", sender: 'bot', timestamp: new Date() },
                        ]}
                      />
                    )}
                  </PhoneFrame>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-16 lg:pt-12">
            <div className="bg-white p-16 rounded-[5rem] shadow-xl border border-slate-100 relative overflow-hidden group hover:border-emerald-200 transition-all duration-700">
              <div className="flex items-center gap-10 mb-14">
                <div className={`p-8 rounded-[3rem] text-white shadow-2xl transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-700 ${currentJourneyData.color}`}>
                  {React.cloneElement(currentJourneyData.icon as React.ReactElement, { className: 'w-10 h-10' })}
                </div>
                <div>
                  <h2 className="text-5xl font-black text-slate-950 tracking-tighter leading-none uppercase italic leading-none">{currentJourneyData.label}</h2>
                  <p className="text-[12px] text-slate-400 font-black uppercase tracking-[0.6em] mt-5">Ondo State Intelligence Engine</p>
                </div>
              </div>
              
              <div className="space-y-12">
                <p className="text-slate-600 text-3xl font-medium leading-[1.3] tracking-tight">
                  {activeJourney === 'AMINA' && "Bridging the gap for 14,000+ farmers. Our vision system provides instant disease diagnosis, while localized logic handles complex Yoruba translation."}
                  {activeJourney === 'CHUKA' && "Digital inclusion for artisans. Fast USSD registration formalizes business nodes instantly, secured by Ondo's decentralized ledger."}
                  {activeJourney === 'BOLA' && "Turning waste into prosperity. Circular nodes use computer vision for material verification and smart logic for impact scoring and rewards."}
                  {activeJourney === 'ADMIN' && "The Strategic Nerve Center. Monitoring growth via real-time geospatial analytics and predictive AI risk modeling across all 18 LGAs."}
                </p>

                <div className="flex flex-wrap gap-6">
                   <div className="flex items-center gap-5 px-10 py-5 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-xs font-black uppercase tracking-[0.3em] text-slate-950 shadow-sm group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all duration-500">
                    <ShieldCheck className="w-7 h-7 text-emerald-600" /> State-Grade Security
                  </div>
                  <div className="flex items-center gap-5 px-10 py-5 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-xs font-black uppercase tracking-[0.3em] text-slate-950 shadow-sm group-hover:bg-amber-50 group-hover:border-amber-100 transition-all duration-500">
                    <Sparkles className="w-7 h-7 text-amber-500" /> Hybrid AI Infrastructure
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {JOURNEYS.map((j) => (
                <button
                  key={j.id}
                  onClick={() => setActiveJourney(j.id)}
                  className={`p-12 rounded-[4rem] flex flex-col items-center gap-8 transition-all border group ${
                    activeJourney === j.id 
                      ? `${j.color} text-white shadow-[0_50px_100px_-30px_rgba(0,0,0,0.35)] scale-105 border-transparent` 
                      : 'bg-white text-slate-400 hover:bg-slate-50 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className={`p-6 rounded-[2rem] transition-all group-hover:rotate-12 ${activeJourney === j.id ? 'bg-white/20 shadow-inner' : 'bg-slate-50'}`}>
                    {React.cloneElement(j.icon as React.ReactElement, { className: 'w-8 h-8' })}
                  </div>
                  <span className="text-[12px] font-black uppercase tracking-[0.4em] text-center leading-relaxed">
                    {j.label.split(' ').length > 1 ? j.label.split(' ')[1] : j.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-slate-950 text-white p-16 rounded-[5rem] shadow-2xl relative overflow-hidden group border border-white/5">
               <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-[12s]">
                <Globe className="w-[30rem] h-[30rem]" />
              </div>
              <div className="relative z-10 max-w-2xl space-y-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-[2.5px] bg-emerald-400 rounded-full"></div>
                  <h4 className="text-[12px] font-black text-emerald-400 uppercase tracking-[0.8em]">ONDO 2025 IMPACT VISION</h4>
                </div>
                <p className="text-5xl font-black tracking-tighter leading-tight italic uppercase">
                  Accelerating prosperity with Hybrid AI.
                </p>
                <p className="text-slate-400 text-xl font-medium leading-relaxed">
                  Ondo Connect leverages world-class infrastructure and localized intelligence to provide a digital economy for every citizen.
                </p>
                <button 
                  onClick={() => setActiveJourney('AMINA')}
                  className="mt-6 flex items-center gap-6 bg-emerald-500 text-slate-950 px-14 py-7 rounded-[3rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-emerald-400 transition-all hover:gap-12 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.3)] border-b-4 border-emerald-700"
                >
                  LAUNCH ECOSYSTEM <ArrowRight className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-32 py-28 px-16 bg-white border-t border-slate-200">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-14 opacity-50 grayscale hover:grayscale-0 transition-all duration-1000">
            <div className="flex items-center gap-10">
              <div className="w-14 h-14 bg-slate-950 rounded-[1.2rem] flex items-center justify-center text-white font-black text-3xl italic">O</div>
              <div className="space-y-2">
                <p className="text-base font-black text-slate-950 tracking-tighter uppercase italic">Ondo Connect Ecosystem</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none">Sunshine State Economic OS</p>
              </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;
