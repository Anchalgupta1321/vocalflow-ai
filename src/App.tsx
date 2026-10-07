import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { AgentBuilder } from './components/AgentBuilder';
import { CallSimulatorModal } from './components/CallSimulatorModal';
import { CallLogs } from './components/CallLogs';
import { AppointmentsManager } from './components/AppointmentsManager';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { WhatsAppBotStudio } from './components/WhatsAppBotStudio';
import { TraiCompliance } from './components/TraiCompliance';
import { IntegrationSettings } from './components/IntegrationSettings';
import { BillingManager } from './components/BillingManager';
import { EconomicsCalculator } from './components/EconomicsCalculator';
import { WhatsAppPreviewModal } from './components/WhatsAppPreviewModal';
import { INITIAL_AGENTS, MOCK_CALL_LOGS, VOICE_CATALOG, MOCK_TENANTS, MOCK_APPOINTMENTS } from './data/mockData';
import { AgentConfig, CallLog, TenantInfo, AppointmentRecord } from './types';
import { Phone } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'builder' | 'logs' | 'appointments' | 'analytics' | 'whatsapp' | 'trai' | 'integrations' | 'billing' | 'economics'>('builder');
  
  // Multi-Tenant Workspaces State
  const [tenants, setTenants] = useState<TenantInfo[]>(MOCK_TENANTS);
  const [activeTenant, setActiveTenant] = useState<TenantInfo>(MOCK_TENANTS[0]);

  // Data Collections State
  const [agents, setAgents] = useState<AgentConfig[]>(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig>(INITIAL_AGENTS[0]);
  const [callLogs, setCallLogs] = useState<CallLog[]>(MOCK_CALL_LOGS);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(MOCK_APPOINTMENTS);

  // Modals
  const [isTestCallOpen, setIsTestCallOpen] = useState(false);
  const [testCallAgent, setTestCallAgent] = useState<AgentConfig>(INITIAL_AGENTS[0]);
  const [whatsAppModalLog, setWhatsAppModalLog] = useState<CallLog | null>(null);

  const handleCreateTenant = (businessName: string) => {
    const newTenant: TenantInfo = {
      id: `tenant-${Date.now()}`,
      name: businessName,
      ownerEmail: `admin@${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
      planName: 'Starter (₹4,999/mo)',
      includedMinutes: 300,
      usedMinutesThisMonth: 0,
      dltEntityId: `PE-${Math.floor(10000000 + Math.random() * 90000000)}-TRAI`,
      dltHeader: `AD-${businessName.slice(0, 4).toUpperCase()}`,
      razorpaySubStatus: 'active',
      nextBillingDate: '2026-11-01'
    };

    setTenants((prev) => [...prev, newTenant]);
    setActiveTenant(newTenant);

    // Create default agent for new tenant
    const defaultAgent: AgentConfig = {
      id: `agent-${Date.now()}`,
      tenantId: newTenant.id,
      name: `${businessName} AI Receptionist`,
      businessName: businessName,
      industry: 'General Service',
      language: 'Hinglish',
      voice: VOICE_CATALOG[0],
      greeting: `Namaste! Welcome to ${businessName}. How can I assist your call today?`,
      systemPrompt: `You are a polite AI receptionist for ${businessName}. Answer customer questions and book appointment slots.`,
      faqs: [{ question: 'Where are you located?', answer: 'We are located in central Indiranagar, Bangalore.' }],
      calendarConnected: true,
      phoneNumber: `+91 80 4719 ${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'published',
      maxCallDurationMins: 5
    };

    setAgents((prev) => [...prev, defaultAgent]);
    setSelectedAgent(defaultAgent);
  };

  const handleSaveAgent = (updatedAgent: AgentConfig) => {
    setAgents((prev) => {
      const idx = prev.findIndex((a) => a.id === updatedAgent.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedAgent;
        return next;
      }
      return [...prev, updatedAgent];
    });
    setSelectedAgent(updatedAgent);
  };

  const handleCreateNewAgent = () => {
    const newAgent: AgentConfig = {
      id: `agent-${Date.now()}`,
      tenantId: activeTenant.id,
      name: `${activeTenant.name} Assistant`,
      businessName: activeTenant.name,
      industry: 'Healthcare / Clinic / Hospital',
      language: 'Hinglish',
      voice: VOICE_CATALOG[0],
      greeting: `Namaste! Thank you for calling ${activeTenant.name}. How can I help you today?`,
      systemPrompt: 'You are a professional, courteous receptionist. Answer customer queries, check available appointment slots, and confirm bookings.',
      faqs: [
        { question: 'What are your working hours?', answer: 'We are open Monday to Saturday from 9 AM to 7 PM.' }
      ],
      calendarConnected: true,
      phoneNumber: `+91 80 4719 ${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'published',
      maxCallDurationMins: 5
    };

    setAgents((prev) => [...prev, newAgent]);
    setSelectedAgent(newAgent);
    setActiveTab('builder');
  };

  const handleStartTestCall = (agentToTest: AgentConfig) => {
    setTestCallAgent(agentToTest);
    setIsTestCallOpen(true);
  };

  const handleCallCompleted = (newLog: CallLog) => {
    setCallLogs((prev) => [newLog, ...prev]);

    // Update active tenant used minutes
    setActiveTenant((prev) => ({
      ...prev,
      usedMinutesThisMonth: prev.usedMinutesThisMonth + Math.ceil(newLog.durationSeconds / 60)
    }));

    // Auto add appointment if action taken
    if (newLog.actionTaken && newLog.actionTaken.includes('Appointment')) {
      const newAppt: AppointmentRecord = {
        id: `appt-${Date.now()}`,
        tenantId: activeTenant.id,
        customerName: newLog.customerName || 'Browser Test User',
        customerPhone: newLog.customerPhone,
        slotTime: 'Tomorrow 4:00 PM',
        serviceName: 'Dental Scaling & Checkup',
        status: 'confirmed',
        bookedByAgent: newLog.agentName
      };
      setAppointments((prev) => [newAppt, ...prev]);
    }
  };

  const pageTitles: Record<string, string> = {
    builder: 'AI Receptionist Studio',
    logs: 'Call Logs & Transcripts',
    appointments: 'Bookings & Appointments',
    analytics: 'Call Analytics & CSAT',
    whatsapp: 'WhatsApp AI Bot & Flow Studio',
    trai: 'TRAI & DPDP Compliance',
    integrations: 'API Keys & Telephony',
    billing: 'Billing & Subscriptions',
    economics: 'SaaS Unit Economics',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Sticky Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tenants={tenants}
        activeTenant={activeTenant}
        onSelectTenant={(t) => {
          setActiveTenant(t);
          const tenantAgent = agents.find((a) => a.tenantId === t.id) || agents[0];
          setSelectedAgent(tenantAgent);
        }}
        onCreateTenant={handleCreateTenant}
        onNewAgent={handleCreateNewAgent}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Content Bar */}
        <header className="glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-3.5 sticky top-0 z-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white tracking-tight">{pageTitles[activeTab]}</h2>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-indigo-300 font-medium">{activeTenant.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleStartTestCall(selectedAgent)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 animate-pulse"
            >
              <Phone className="w-3.5 h-3.5" />
              Make Test Call Now
            </button>
          </div>
        </header>

        {/* Tab Views */}
        <main className="flex-1 pb-16">
          {activeTab === 'builder' && (
            <AgentBuilder
              agents={agents.filter((a) => a.tenantId === activeTenant.id || agents.length <= 2)}
              selectedAgent={selectedAgent}
              onSelectAgent={setSelectedAgent}
              onSaveAgent={handleSaveAgent}
              onStartTestCall={handleStartTestCall}
            />
          )}

          {activeTab === 'logs' && (
            <CallLogs
              logs={callLogs}
              onOpenWhatsAppPreview={(log) => setWhatsAppModalLog(log)}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsManager
              appointments={appointments}
              onAddAppointment={(newAppt) => setAppointments((prev) => [newAppt, ...prev])}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsDashboard />}

          {activeTab === 'whatsapp' && <WhatsAppBotStudio />}

          {activeTab === 'trai' && <TraiCompliance />}

          {activeTab === 'integrations' && <IntegrationSettings />}

          {activeTab === 'billing' && <BillingManager tenant={activeTenant} />}

          {activeTab === 'economics' && <EconomicsCalculator />}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>VocalFlow AI • Multi-Tenant Indian AI Voice Receptionist Platform</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>ElevenLabs / Cartesia Enabled</span>
            <span>•</span>
            <span>TRAI TCCCPR 2026 Ready</span>
          </div>
        </footer>

      </div>

      {/* Interactive Phone Call Simulator Modal */}
      <CallSimulatorModal
        isOpen={isTestCallOpen}
        agent={testCallAgent}
        onClose={() => setIsTestCallOpen(false)}
        onCallCompleted={handleCallCompleted}
      />

      {/* WhatsApp Post-Call Dispatch Preview Modal */}
      <WhatsAppPreviewModal
        isOpen={!!whatsAppModalLog}
        log={whatsAppModalLog}
        onClose={() => setWhatsAppModalLog(null)}
      />

    </div>
  );
}
export default App;
