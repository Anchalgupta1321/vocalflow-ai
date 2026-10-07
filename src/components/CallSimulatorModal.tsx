import React, { useState, useEffect } from 'react';
import { AgentConfig, CallLog } from '../types';
import { 
  PhoneCall, PhoneOff, Mic, MicOff, Volume2, Sparkles, Zap, 
  CheckCircle2, Clock, Calendar, MessageSquare, ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CallSimulatorModalProps {
  isOpen: boolean;
  agent: AgentConfig;
  onClose: () => void;
  onCallCompleted: (newLog: CallLog) => void;
}

export const CallSimulatorModal: React.FC<CallSimulatorModalProps> = ({
  isOpen,
  agent,
  onClose,
  onCallCompleted,
}) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<{ speaker: 'AI' | 'Customer'; text: string; timestamp: string }[]>([]);
  const [customerInput, setCustomerInput] = useState<string>('');
  const [actionExtracted, setActionExtracted] = useState<string | null>(null);
  const [whatsappSent, setWhatsappSent] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number>(340);

  // Suggested prompt options
  const samplePrompts = [
    'I want to book an appointment for tomorrow afternoon.',
    'What are your consultation fees and clinic location?',
    'Can I reserve a table for 4 guests tonight at 8:30 PM?',
    'Do you accept emergency dental walk-ins today?',
  ];

  // Duration timer
  useEffect(() => {
    let timer: any;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  // Initial call start
  useEffect(() => {
    if (isOpen) {
      setCallStatus('connecting');
      setCallDuration(0);
      setTranscript([]);
      setActionExtracted(null);
      setWhatsappSent(false);

      const connectTimer = setTimeout(() => {
        setCallStatus('connected');
        // AI speaks greeting
        speakAiResponse(agent.greeting);
        setTranscript([
          { speaker: 'AI', text: agent.greeting, timestamp: '00:01' }
        ]);
      }, 1200);

      return () => clearTimeout(connectTimer);
    }
  }, [isOpen, agent]);

  const speakAiResponse = (text: string) => {
    setIsSpeaking(true);
    setLatencyMs(Math.floor(Math.random() * 120) + 280); // 280ms - 400ms simulate ElevenLabs/Cartesia

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const handleSendCustomerMessage = (textToSend?: string) => {
    const text = textToSend || customerInput;
    if (!text.trim() || callStatus !== 'connected') return;

    const timeStr = `00:${callDuration < 10 ? '0' + callDuration : callDuration}`;
    const newTranscript = [
      ...transcript,
      { speaker: 'Customer' as const, text, timestamp: timeStr }
    ];
    setTranscript(newTranscript);
    setCustomerInput('');

    // Generate smart AI response based on query
    setTimeout(() => {
      let aiReply = '';
      let action = null;

      const lower = text.toLowerCase();
      if (lower.includes('appointment') || lower.includes('book') || lower.includes('slot')) {
        aiReply = `Certainly! Dr. Sharma has open slots tomorrow at 2:30 PM or 4:00 PM. Would 4:00 PM work for you?`;
        action = `Appointment Slot Held: Tomorrow 4:00 PM`;
      } else if (lower.includes('table') || lower.includes('reserve') || lower.includes('guests')) {
        aiReply = `Great! I have reserved a special table for 4 guests tonight at 8:30 PM under your name.`;
        action = `Table Reserved: 4 Guests @ 8:30 PM`;
        setWhatsappSent(true);
      } else if (lower.includes('fee') || lower.includes('cost') || lower.includes('price') || lower.includes('location')) {
        aiReply = `Our initial consultation fee is ₹500, which includes full screening. We are located on 100 Feet Road, Indiranagar!`;
      } else if (lower.includes('emergency') || lower.includes('walk-in') || lower.includes('pain')) {
        aiReply = `Yes! We accept emergency pain walk-ins immediately between 9 AM and 8 PM daily.`;
        action = `Emergency Walk-in Flagged`;
      } else {
        aiReply = `Thank you for sharing that. I have updated your record. Is there anything else I can help you with today?`;
      }

      if (action) {
        setActionExtracted(action);
        setWhatsappSent(true);
        try {
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
        } catch (e) {}
      }

      setTranscript([
        ...newTranscript,
        { speaker: 'AI', text: aiReply, timestamp: `00:${callDuration + 2}` }
      ]);
      speakAiResponse(aiReply);
    }, 600);
  };

  const handleEndCall = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCallStatus('ended');
    setIsSpeaking(false);

    // Create call log object
    const finalLog: CallLog = {
      id: `call-${Date.now()}`,
      agentName: agent.name,
      customerPhone: '+91 98450 99887 (Test Call)',
      customerName: 'Browser Test User',
      callType: 'inbound',
      startTime: new Date().toLocaleString(),
      durationSeconds: Math.max(12, callDuration),
      costInr: Number((((agent.voice.costPerMinInr + 1.2 + 0.5) / 60) * Math.max(12, callDuration)).toFixed(2)),
      status: 'completed',
      sentiment: 'positive',
      summary: actionExtracted ? `Interactive test call completed. ${actionExtracted}` : 'Interactive test call completed. Information provided.',
      transcript: transcript.length > 0 ? transcript : [{ speaker: 'AI', text: agent.greeting, timestamp: '00:01' }],
      traiCompliant: true,
      dndStatus: 'clean',
      actionTaken: actionExtracted || 'General Inquiry Handled',
      whatsappSent: whatsappSent
    };

    onCallCompleted(finalLog);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-indigo-500/30 bg-slate-950 overflow-hidden shadow-2xl animate-scaleUp">
        
        {/* Call Header Bar */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Live AI Phone Agent Call
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                  {agent.voice.provider.toUpperCase()} ENGINE
                </span>
              </h3>
              <p className="text-xs text-slate-400">Target: {agent.businessName} ({agent.phoneNumber})</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              00:{callDuration < 10 ? `0${callDuration}` : callDuration}
            </span>
            <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              {latencyMs}ms latency
            </span>
          </div>
        </div>

        {/* CALL SCREEN visualizer */}
        <div className="p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-col items-center justify-center space-y-6">
          
          {/* Animated Avatar Glow Ring */}
          <div className="relative">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1 ${isSpeaking ? 'call-pulse-ring' : ''}`}>
              <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center">
                <Volume2 className={`w-10 h-10 ${isSpeaking ? 'text-indigo-400 animate-bounce' : 'text-slate-500'}`} />
              </div>
            </div>
            {isSpeaking && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                AI Speaking...
              </span>
            )}
          </div>

          {/* Audio Wave Visualizer Bars */}
          <div className="flex items-center gap-1.5 h-10">
            <div className={`w-1.5 bg-indigo-500 rounded-full ${isSpeaking ? 'animate-wave-1' : 'h-2'}`} />
            <div className={`w-1.5 bg-indigo-400 rounded-full ${isSpeaking ? 'animate-wave-2' : 'h-2'}`} />
            <div className={`w-1.5 bg-purple-500 rounded-full ${isSpeaking ? 'animate-wave-3' : 'h-2'}`} />
            <div className={`w-1.5 bg-pink-500 rounded-full ${isSpeaking ? 'animate-wave-4' : 'h-2'}`} />
            <div className={`w-1.5 bg-indigo-500 rounded-full ${isSpeaking ? 'animate-wave-5' : 'h-2'}`} />
          </div>

          {/* Intent / Action Extracted Status */}
          {actionExtracted && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-2 rounded-xl flex items-center gap-2 font-medium animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Automated Action Executed: <strong>{actionExtracted}</strong></span>
              {whatsappSent && (
                <span className="ml-2 text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> WhatsApp Dispatched
                </span>
              )}
            </div>
          )}
        </div>

        {/* TRANSCRIPT FEED */}
        <div className="p-4 max-h-56 overflow-y-auto space-y-3 bg-slate-950">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Real-time Speech Transcript</span>
          {transcript.map((t, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 text-xs ${
                t.speaker === 'AI' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[80%] ${
                  t.speaker === 'AI'
                    ? 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none'
                    : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-[10px] opacity-80">
                    {t.speaker === 'AI' ? `${agent.name} (AI)` : 'You (Customer)'}
                  </span>
                  <span className="text-[9px] opacity-60 font-mono">{t.timestamp}</span>
                </div>
                <p>{t.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CONTROLS & INPUT */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
          
          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] text-slate-400 self-center mr-1">Quick Prompts:</span>
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendCustomerMessage(p)}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/80 transition-colors"
              >
                "{p.slice(0, 32)}..."
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customerInput}
              onChange={(e) => setCustomerInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCustomerMessage()}
              placeholder="Speak to AI receptionist or type your query here..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={() => handleSendCustomerMessage()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all shrink-0"
            >
              Speak / Send
            </button>

            <button
              onClick={handleEndCall}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5 shrink-0"
            >
              <PhoneOff className="w-4 h-4" /> End Call
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
