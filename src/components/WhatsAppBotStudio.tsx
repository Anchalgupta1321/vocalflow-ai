import React, { useState } from 'react';
import { 
  MessageSquare, Send, CheckCheck, Sparkles, MapPin, Calendar, 
  Clock, Plus, Bot, ShieldCheck, FileText, CheckCircle2, Zap, Smartphone,
  BarChart2, ArrowUpRight, Check, AlertCircle, Filter, Eye, Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface WhatsAppFlow {
  id: string;
  name: string;
  triggerType: 'post_call' | 'keyword_match' | 'inbound_first_msg';
  keyword: string;
  status: 'active' | 'paused';
  responseBody: string;
  buttons: string[];
  dispatchesCount: number;
}

export const WhatsAppBotStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'simulator' | 'flows' | 'templates' | 'analytics'>('simulator');
  
  // Dynamic Hospitality Flows State
  const [flows, setFlows] = useState<WhatsAppFlow[]>([
    {
      id: 'flow-101',
      name: 'Post-Call Table Reservation Receipt Flow',
      triggerType: 'post_call',
      keyword: 'TABLE_RESERVED',
      status: 'active',
      responseBody: 'Namaste {{1}}! Your dinner table for {{2}} guests at Spice Lounge is confirmed for {{3}}. Click map link below.',
      buttons: ['Reschedule Table', 'View Location Map', 'Cancel'],
      dispatchesCount: 382
    },
    {
      id: 'flow-102',
      name: 'Restaurant Location & Valet Parking Bot',
      triggerType: 'keyword_match',
      keyword: 'LOCATION',
      status: 'active',
      responseBody: '📍 Spice Lounge Fine Dining is located on 100 Feet Road, Indiranagar, Bangalore (Opp. Toit). Free valet parking available!',
      buttons: ['Get Google Directions', 'Main Dining Hours'],
      dispatchesCount: 215
    },
    {
      id: 'flow-103',
      name: 'Food Menu & Bar List Dispatcher',
      triggerType: 'keyword_match',
      keyword: 'MENU',
      status: 'active',
      responseBody: '🍹 Click to view our artisanal cocktail menu & chef\'s special dinner ala-carte menu PDF.',
      buttons: ['Talk to Hostess Desk'],
      dispatchesCount: 140
    }
  ]);

  // Modal State for New Flow Creation
  const [showCreateFlowModal, setShowCreateFlowModal] = useState(false);
  const [flowName, setFlowName] = useState('');
  const [triggerType, setTriggerType] = useState<'post_call' | 'keyword_match' | 'inbound_first_msg'>('keyword_match');
  const [keyword, setKeyword] = useState('');
  const [responseBody, setResponseBody] = useState('');
  const [button1, setButton1] = useState('');
  const [button2, setButton2] = useState('');

  // Simulator Chat Stream for Restaurant / Hotel
  const [chatMessages, setChatMessages] = useState<
    { sender: 'bot' | 'user'; text: string; time: string; templateType?: string }[]
  >([
    {
      sender: 'bot',
      text: 'Namaste Rahul! 🙏 Thank you for calling Spice Lounge Fine Dining. Your terrace table for 4 guests is confirmed for Tonight at 8:30 PM.',
      time: '07:15 PM',
      templateType: 'TABLE_RESERVATION_RECEIPT'
    },
    {
      sender: 'user',
      text: 'LOCATION',
      time: '07:16 PM'
    },
    {
      sender: 'bot',
      text: '📍 Spice Lounge Fine Dining is located at 100 Feet Road, Indiranagar, Bangalore (Opp. Toit Pub). Free valet parking is available at the entrance!',
      time: '07:16 PM'
    }
  ]);

  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Meta Approved Hospitality Templates
  const templates = [
    {
      id: 'tpl_table_res',
      name: 'Post-Call Table Reservation Receipt',
      category: 'UTILITY',
      status: 'APPROVED',
      body: 'Namaste {{1}}! Your terrace table for {{2}} guests tonight at {{3}} is reserved at {{4}}. View map: {{5}}',
      dispatchedCount: 382
    },
    {
      id: 'tpl_room_confirm',
      name: 'Hotel Room Booking Receipt',
      category: 'UTILITY',
      status: 'APPROVED',
      body: 'Welcome {{1}}! Your Deluxe Suite at {{2}} is confirmed for {{3}}. Check-in is 2:00 PM.',
      dispatchedCount: 245
    },
    {
      id: 'tpl_feedback_req',
      name: 'Post-Dining Experience Feedback',
      category: 'MARKETING',
      status: 'APPROVED',
      body: 'Thank you for dining at {{1}} tonight! How was your food and service? Rate us: {{2}}',
      dispatchedCount: 890
    }
  ];

  const handleCreateFlow = () => {
    if (!flowName.trim() || !responseBody.trim()) return;

    const newFlow: WhatsAppFlow = {
      id: `flow-${Date.now()}`,
      name: flowName,
      triggerType: triggerType,
      keyword: keyword.toUpperCase() || 'INFO',
      status: 'active',
      responseBody: responseBody,
      buttons: [button1, button2].filter(Boolean),
      dispatchesCount: 0
    };

    setFlows((prev) => [newFlow, ...prev]);

    setFlowName('');
    setKeyword('');
    setResponseBody('');
    setButton1('');
    setButton2('');
    setShowCreateFlowModal(false);

    try {
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userText = userInput;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedMessages = [
      ...chatMessages,
      { sender: 'user' as const, text: userText, time: timeStr }
    ];

    setChatMessages(updatedMessages);
    setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let botReply = '';

      const upperText = userText.toUpperCase();
      const matchedFlow = flows.find(
        (f) => upperText.includes(f.keyword) || (f.keyword && upperText === f.keyword)
      );

      if (matchedFlow) {
        botReply = matchedFlow.responseBody;
      } else if (upperText.includes('RESCHEDULE') || upperText.includes('CHANGE TIME')) {
        botReply = 'I can help reschedule your reservation! We have open indoor/terrace tables at 7:00 PM or 9:30 PM tonight. Which slot do you prefer?';
      } else if (upperText.includes('CANCEL')) {
        botReply = 'Your table reservation has been cancelled. If you wish to rebook anytime, simply reply here or call our AI phone receptionist!';
      } else if (upperText.includes('MENU') || upperText.includes('FOOD') || upperText.includes('DRINKS')) {
        botReply = '🍹 Here is our digital ala-carte dinner & cocktail menu: https://spicelounge.in/menu-pdf';
      } else if (upperText.includes('HUMAN') || upperText.includes('HOSTESS')) {
        botReply = 'Connecting you to our restaurant hostess desk representative right now. Please hold on... 📞';
      } else {
        botReply = 'Thank you for messaging Spice Lounge Fine Dining! Type LOCATION, MENU, or RESCHEDULE for automated assistance.';
      }

      setChatMessages([
        ...updatedMessages,
        { sender: 'bot', text: botReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);

      try {
        confetti({ particleCount: 20, spread: 50, origin: { y: 0.8 } });
      } catch (e) {}
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-8 border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-purple-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Meta WhatsApp Cloud API Integration
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-indigo-300 font-mono">Restaurant & Hotel Automation</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">WhatsApp AI Bot & Flow Studio</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Configure automated post-call WhatsApp table Receipts, menu dispatches, and 2-way room booking bots.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sub-Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950/90 p-2 rounded-2xl border border-slate-800 text-xs font-bold shadow-inner">
            <button
              onClick={() => setActiveSubTab('simulator')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubTab === 'simulator' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 inline mr-1.5" /> Bot Simulator
            </button>
            <button
              onClick={() => setActiveSubTab('flows')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubTab === 'flows' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 inline mr-1.5" /> Custom Flows ({flows.length})
            </button>
            <button
              onClick={() => setActiveSubTab('templates')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubTab === 'templates' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 inline mr-1.5" /> Approved Templates
            </button>
            <button
              onClick={() => setActiveSubTab('analytics')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubTab === 'analytics' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 inline mr-1.5" /> WhatsApp Analytics
            </button>
          </div>

          <button
            onClick={() => setShowCreateFlowModal(true)}
            className="px-5 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 text-white text-xs font-extrabold rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Create New Flow
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE BOT SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Active Flows Overview */}
          <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-slate-800/90 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800/90 pb-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                Active Bot Flows & Keyword Triggers
              </h3>
              <button
                onClick={() => setShowCreateFlowModal(true)}
                className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Flow
              </button>
            </div>

            <div className="space-y-5">
              {flows.map((f) => (
                <div key={f.id} className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800/90 space-y-3 shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{f.name}</span>
                      <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                        KEYWORD: #{f.keyword}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 font-bold rounded-full">
                      ACTIVE
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 font-mono leading-relaxed">
                    "{f.responseBody}"
                  </p>

                  {f.buttons.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-slate-400">Quick Buttons:</span>
                      {f.buttons.map((b, i) => (
                        <span key={i} className="text-[11px] bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 font-medium">
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Smartphone Mock */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="glass-panel w-full max-w-sm rounded-[40px] border-4 border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex flex-col h-[580px] relative">
              
              {/* Phone Header */}
              <div className="bg-[#075e54] text-white px-5 py-3.5 flex items-center justify-between shadow-md shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-400/20 flex items-center justify-center font-bold text-xs border border-emerald-300">
                    SL
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Spice Lounge Fine Dining</h4>
                    <span className="text-[10px] text-emerald-200 block">Official Business Account • Online</span>
                  </div>
                </div>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 bg-[#0b141a] p-4 overflow-y-auto space-y-3.5 text-xs font-sans">
                <div className="self-center text-center">
                  <span className="bg-[#182229] text-[#8696a0] text-[10px] px-3 py-1 rounded-md">
                    MESSAGES ARE END-TO-END ENCRYPTED
                  </span>
                </div>

                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-2xl max-w-[85%] space-y-1 shadow ${
                        msg.sender === 'user'
                          ? 'bg-[#005c4b] text-white rounded-tr-none'
                          : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-slate-700/50'
                      }`}
                    >
                      <p className="text-[11px] leading-relaxed">{msg.text}</p>
                      <div className="flex justify-end items-center gap-1 text-[9px] opacity-75">
                        <span>{msg.time}</span>
                        {msg.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="text-[10px] text-emerald-400 italic bg-[#202c33] px-3 py-1.5 rounded-full w-fit animate-pulse">
                    Spice Lounge AI Host is typing...
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-[#1f2c34] border-t border-slate-800 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type LOCATION, MENU, REPORT, etc..."
                  className="w-full bg-[#2a3942] border-none rounded-full px-4 py-2 text-xs text-white placeholder-slate-400 outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center shrink-0 transition-colors shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: CUSTOM FLOWS LIST */}
      {activeSubTab === 'flows' && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/90 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Custom WhatsApp Bot Flow Registry
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Manage all dynamic keyword triggers and post-call dispatches.
              </p>
            </div>

            <button
              onClick={() => setShowCreateFlowModal(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
            >
              <Plus className="w-4 h-4" /> Add New Flow
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flows.map((f) => (
              <div key={f.id} className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between shadow">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{f.name}</span>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full">
                      {f.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400">
                    Trigger: <strong className="text-indigo-400 font-mono font-bold">#{f.keyword}</strong> ({f.triggerType})
                  </div>

                  <p className="text-xs text-slate-200 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono leading-relaxed">
                    "{f.responseBody}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Dispatches: <strong className="text-white font-mono font-bold">{f.dispatchesCount}</strong></span>
                  <span className="text-emerald-400 font-bold">2-Way Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: APPROVED TEMPLATES */}
      {activeSubTab === 'templates' && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/90 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Meta Approved WhatsApp Business Templates
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Templates registered and pre-approved by Meta for automated post-call dispatches.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((tpl) => (
              <div key={tpl.id} className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4 shadow">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{tpl.name}</span>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                    {tpl.status}
                  </span>
                </div>

                <p className="text-xs text-slate-200 bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono leading-relaxed">
                  "{tpl.body}"
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  <span>Category: <strong className="text-slate-200">{tpl.category}</strong></span>
                  <span className="text-emerald-400 font-mono font-bold">{tpl.dispatchedCount} Dispatched</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: WHATSAPP ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs text-slate-400 font-medium">Total WhatsApp Dispatches</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-white font-mono">1,417 Msgs</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +24%
                </span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs text-slate-400 font-medium">Delivery & Read Rate</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-emerald-400">98.6% Delivered</span>
                <span className="text-xs text-indigo-300 font-bold">89.2% Read</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs text-slate-400 font-medium">2-Way Bot Engagement</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-indigo-400">64.2% Reply</span>
                <span className="text-xs text-slate-400">910 replies</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs text-slate-400 font-medium">Meta API Messaging Cost</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-amber-400 font-mono">₹708.50</span>
                <span className="text-xs text-slate-400">~₹0.50/msg</span>
              </div>
            </div>

          </div>

          {/* Template Analytics Table */}
          <div className="glass-panel rounded-3xl border border-slate-800 p-8 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Meta Template Performance Breakdown</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                  <tr>
                    <th className="px-5 py-4">Template Name</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Dispatched</th>
                    <th className="px-4 py-4">Delivered Rate</th>
                    <th className="px-4 py-4">Read Rate</th>
                    <th className="px-5 py-4 text-right">Avg Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {templates.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-5 py-4 font-bold text-white">{t.name}</td>
                      <td className="px-5 py-4">{t.category}</td>
                      <td className="px-5 py-4 font-mono font-bold text-indigo-300">{t.dispatchedCount}</td>
                      <td className="px-4 py-4 text-emerald-400 font-bold">99.4%</td>
                      <td className="px-4 py-4 text-emerald-300 font-bold">91.2%</td>
                      <td className="px-5 py-4 text-right font-mono text-amber-400 font-bold">₹0.50</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* CREATE NEW FLOW MODAL */}
      {showCreateFlowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-emerald-500/30 bg-slate-950 p-8 space-y-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800/90 pb-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Build New WhatsApp AI Bot Flow
              </h3>
              <button
                onClick={() => setShowCreateFlowModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Flow Identifier Name</label>
                <input
                  type="text"
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  placeholder="e.g. Food Menu & Cocktail List Dispatcher"
                  className="input-field w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Trigger Type</label>
                  <select
                    value={triggerType}
                    onChange={(e) => setTriggerType(e.target.value as any)}
                    className="input-field w-full cursor-pointer"
                  >
                    <option value="keyword_match">Keyword Match (e.g. MENU)</option>
                    <option value="post_call">Post-Voice Call Dispatched</option>
                    <option value="inbound_first_msg">First Inbound Customer Message</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Trigger Keyword</label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g. MENU, LOCATION, RESCHEDULE"
                    className="input-field w-full font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Automated WhatsApp Response Body</label>
                <textarea
                  value={responseBody}
                  onChange={(e) => setResponseBody(e.target.value)}
                  rows={3}
                  placeholder="Enter the WhatsApp reply message sent to the customer..."
                  className="input-field w-full font-mono leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Quick Action Button 1 (Optional)</label>
                  <input
                    type="text"
                    value={button1}
                    onChange={(e) => setButton1(e.target.value)}
                    placeholder="e.g. Reserve Table"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Quick Action Button 2 (Optional)</label>
                  <input
                    type="text"
                    value={button2}
                    onChange={(e) => setButton2(e.target.value)}
                    placeholder="e.g. View Location Map"
                    className="input-field w-full"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowCreateFlowModal(false)}
                className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFlow}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20"
              >
                Publish Flow
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
