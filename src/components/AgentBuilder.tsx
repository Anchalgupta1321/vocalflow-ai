import React, { useState } from 'react';
import { AgentConfig, VoiceOption } from '../types';
import { VOICE_CATALOG } from '../data/mockData';
import { 
  Bot, Volume2, HelpCircle, Calendar, Phone, CheckCircle2, Play, 
  Plus, Trash2, ArrowRight, Sparkles, MessageSquare, ShieldCheck, Zap
} from 'lucide-react';

interface AgentBuilderProps {
  agents: AgentConfig[];
  selectedAgent: AgentConfig;
  onSelectAgent: (agent: AgentConfig) => void;
  onSaveAgent: (agent: AgentConfig) => void;
  onStartTestCall: (agent: AgentConfig) => void;
}

export const AgentBuilder: React.FC<AgentBuilderProps> = ({
  agents,
  selectedAgent,
  onSelectAgent,
  onSaveAgent,
  onStartTestCall,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [agentForm, setAgentForm] = useState<AgentConfig>(selectedAgent);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const handleVoicePreview = (voice: VoiceOption) => {
    setPlayingVoiceId(voice.id);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(voice.sampleText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setPlayingVoiceId(null);
      utterance.onerror = () => setPlayingVoiceId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingVoiceId(null), 2500);
    }
  };

  const handleAddFaq = () => {
    setAgentForm({
      ...agentForm,
      faqs: [...agentForm.faqs, { question: '', answer: '' }],
    });
  };

  const handleRemoveFaq = (index: number) => {
    const updated = [...agentForm.faqs];
    updated.splice(index, 1);
    setAgentForm({ ...agentForm, faqs: updated });
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...agentForm.faqs];
    updated[index][field] = value;
    setAgentForm({ ...agentForm, faqs: updated });
  };

  const handleSave = () => {
    onSaveAgent(agentForm);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Selector */}
      <div className="glass-panel rounded-3xl p-8 border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-purple-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> GUI Studio Workflow
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Inbound Telemarketing Exempt (Zero TRAI Risk)
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">AI Receptionist Studio</h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Build, test, and publish conversational AI phone receptionists for Indian clinics, restaurants, and SMBs in under 3 minutes.
          </p>
        </div>

        {/* Existing Agent Switcher & Call Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={agentForm.id}
            onChange={(e) => {
              const found = agents.find((a) => a.id === e.target.value);
              if (found) {
                setAgentForm(found);
                onSelectAgent(found);
              }
            }}
            className="bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-60 shadow-inner"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.businessName})
              </option>
            ))}
          </select>

          <button
            onClick={() => onStartTestCall(agentForm)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2 shrink-0 animate-pulse"
          >
            <Phone className="w-4 h-4" />
            Make Test Call Now
          </button>
        </div>
      </div>

      {/* Spacious Stepper Progress Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { num: 1, label: '1. Identity & Profile', icon: Bot },
          { num: 2, label: '2. Voice & Audio', icon: Volume2 },
          { num: 3, label: '3. FAQs Knowledge', icon: HelpCircle },
          { num: 4, label: '4. Calendar Workflows', icon: Calendar },
          { num: 5, label: '5. Phone & Launch', icon: Phone },
        ].map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.num;
          return (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-indigo-500 text-white shadow-xl shadow-indigo-500/15 ring-2 ring-indigo-500/20'
                  : 'bg-slate-900/60 border-slate-800/90 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold truncate">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* STEP CONTENT PANELS */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800/90 space-y-8 shadow-2xl">
        
        {/* STEP 1: IDENTITY & PROFILE */}
        {activeStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-slate-800/90 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Bot className="w-6 h-6 text-indigo-400" />
                  Step 1: Agent Persona & Business Details
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Define the name, business sector, and spoken language for your AI receptionist.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Agent Identifier Name</label>
                <input
                  type="text"
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                  className="input-field w-full"
                  placeholder="e.g. Apollo Dental Clinic Receptionist"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Business / Clinic Name</label>
                <input
                  type="text"
                  value={agentForm.businessName}
                  onChange={(e) => setAgentForm({ ...agentForm, businessName: e.target.value })}
                  className="input-field w-full"
                  placeholder="e.g. Apollo Dental Care, Indiranagar"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Industry Sector</label>
                <select
                  value={agentForm.industry}
                  onChange={(e) => setAgentForm({ ...agentForm, industry: e.target.value })}
                  className="input-field w-full cursor-pointer"
                >
                  <option value="Healthcare / Clinic / Hospital">Healthcare / Clinic / Hospital</option>
                  <option value="Restaurant / Dining / Cafe">Restaurant / Dining / Cafe</option>
                  <option value="Real Estate & Property Management">Real Estate & Property Management</option>
                  <option value="Salon & Spa Services">Salon & Spa Services</option>
                  <option value="Automobile Dealership & Service">Automobile Dealership & Service</option>
                  <option value="Legal & Advisory Services">Legal & Advisory Services</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Primary Spoken Language</label>
                <select
                  value={agentForm.language}
                  onChange={(e) => setAgentForm({ ...agentForm, language: e.target.value as any })}
                  className="input-field w-full cursor-pointer"
                >
                  <option value="Hinglish">Hinglish (Most popular in Urban India)</option>
                  <option value="English">Indian English (Clear & Formal)</option>
                  <option value="Hindi">Pure Hindi (हिंदी)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">First Greeting Sentence (Spoken when phone answered)</label>
              <textarea
                value={agentForm.greeting}
                onChange={(e) => setAgentForm({ ...agentForm, greeting: e.target.value })}
                rows={2}
                className="input-field w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">System Prompt & Behavior Directives</label>
              <textarea
                value={agentForm.systemPrompt}
                onChange={(e) => setAgentForm({ ...agentForm, systemPrompt: e.target.value })}
                rows={4}
                className="input-field w-full font-mono text-slate-200"
              />
            </div>
          </div>
        )}

        {/* STEP 2: VOICE & AUDIO ENGINE */}
        {activeStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-slate-800/90 pb-4">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Volume2 className="w-6 h-6 text-indigo-400" />
                Step 2: Choose Voice Layer & Provider Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select from ElevenLabs (Premium Quality), Cartesia (Sonic Ultra-low latency), Bolna (Pure Hindi), or Vio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {VOICE_CATALOG.map((v) => {
                const isSelected = agentForm.voice.id === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setAgentForm({ ...agentForm, voice: v })}
                    className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/40 shadow-xl'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-4 right-4 bg-indigo-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                        <CheckCircle2 className="w-3 h-3" /> Selected
                      </span>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{v.name}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
                          {v.provider}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Accent: {v.accent} • {v.gender}</p>
                      <p className="text-xs text-slate-300 italic bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                        "{v.sampleText.slice(0, 75)}..."
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Est. Voice Base</span>
                        <span className="font-bold text-amber-400 font-mono text-sm">₹{v.costPerMinInr.toFixed(2)}/min</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVoicePreview(v);
                        }}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
                      >
                        <Play className={`w-3.5 h-3.5 ${playingVoiceId === v.id ? 'animate-bounce text-indigo-400' : ''}`} />
                        {playingVoiceId === v.id ? 'Playing...' : 'Listen Sample'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: KNOWLEDGE BASE & FAQS */}
        {activeStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800/90 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-indigo-400" />
                  Step 3: Business Information & FAQs
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Teach your AI receptionist about opening hours, location, consultation fees, and common inquiries.
                </p>
              </div>

              <button
                onClick={handleAddFaq}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" /> Add FAQ Pair
              </button>
            </div>

            <div className="space-y-5">
              {agentForm.faqs.map((faq, index) => (
                <div key={index} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">FAQ Pair #{index + 1}</span>
                    <button
                      onClick={() => handleRemoveFaq(index)}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1">Customer Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                        placeholder="e.g. Where are you located?"
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1">AI Answer</label>
                      <input
                        type="text"
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                        placeholder="e.g. We are on 100 Feet Road, Indiranagar, Bangalore."
                        className="input-field w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: CALENDAR & WORKFLOW INTEGRATIONS */}
        {activeStep === 4 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-slate-800/90 pb-4">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-indigo-400" />
                Step 4: Calendar & Action Workflows
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Connect appointment scheduling calendars, WhatsApp follow-ups, and maximum call length guards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Google / Outlook Calendar Sync</h4>
                      <p className="text-xs text-slate-400">Auto-book time slots during phone calls</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={agentForm.calendarConnected}
                    onChange={(e) => setAgentForm({ ...agentForm, calendarConnected: e.target.checked })}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-2 font-mono">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Calendar: <strong>Dr. Sharma Main Appointments (Google Calendar)</strong></span>
                </div>
              </div>

              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Automated WhatsApp Follow-Up</h4>
                      <p className="text-xs text-slate-400">Send instant WhatsApp confirmation post-call</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-300 font-bold rounded">Active</span>
                </div>
                <p className="text-xs text-slate-400">
                  Sends location maps, calendar invites, and billing links to caller right after call disconnects.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* STEP 5: PHONE & PUBLISH */}
        {activeStep === 5 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-slate-800/90 pb-4">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Phone className="w-6 h-6 text-indigo-400" />
                Step 5: Dedicated Phone Number & Live Test
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your AI receptionist is assigned an Indian landline/virtual number (+91 80 / +91 22).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 border border-indigo-500/30 rounded-3xl space-y-4 shadow-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">Assigned Virtual Reception Number</span>
                <div className="text-3xl font-mono font-extrabold text-white tracking-wider flex items-center gap-3">
                  <Phone className="w-7 h-7 text-emerald-400" />
                  {agentForm.phoneNumber}
                </div>
                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <p>• Status: <span className="text-emerald-400 font-semibold">Active & Listening</span></p>
                  <p>• Telephony Route: <span className="text-slate-400">SIP Trunking / Exotel / Tata Tele communications</span></p>
                  <p>• TRAI Status: <span className="text-emerald-400 font-semibold">Inbound Service Reception (Zero Spam Flag)</span></p>
                </div>
              </div>

              <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white">Test Your AI Receptionist Live</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Simulate an incoming phone call right inside your browser with real-time speech responses, low-latency turn-taking, and automatic appointment booking.
                  </p>
                </div>

                <button
                  onClick={() => onStartTestCall(agentForm)}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 animate-bounce" />
                  Launch Interactive Browser Call
                </button>
              </div>

            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION ACTIONS */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <button
            disabled={activeStep === 1}
            onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
            className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors font-semibold"
          >
            Previous Step
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-xl transition-colors"
            >
              Save Draft
            </button>

            {activeStep < 5 ? (
              <button
                onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  handleSave();
                  onStartTestCall(agentForm);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-xl shadow-indigo-500/30 transition-all"
              >
                <Sparkles className="w-4 h-4" /> Save & Launch Test Call
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
