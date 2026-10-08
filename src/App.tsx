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
import { SuperAdminStudio } from './components/SuperAdminStudio';
import { WhatsAppPreviewModal } from './components/WhatsAppPreviewModal';
import { INITIAL_AGENTS, MOCK_CALL_LOGS, VOICE_CATALOG, MOCK_TENANTS, MOCK_APPOINTMENTS } from './data/mockData';
import { AgentConfig, CallLog, TenantInfo, AppointmentRecord, UserRole } from './types';
import { Phone, Menu, LogOut, ShieldAlert } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'builder' | 'logs' | 'appointments' | 'analytics' | 'whatsapp' | 'trai' | 'integrations' | 'billing' | 'economics' | 'super_admin'>('super_admin');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('super_admin');
  const [isImpersonating, setIsImpersonating] = useState(false);

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

  const handleCreateTenant = (businessName: string, email?: string, planName?: string, minutes?: number) => {
    const newTenant: TenantInfo = {
      id: `tenant-${Date.now()}`,
      name: businessName,
      ownerEmail: email || `admin@${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
      planName: (planName as any) || 'Starter (₹4,999/mo)',
      includedMinutes: minutes || 300,
      usedMinutesThisMonth: 0,
      dltEntityId: `PE-${Math.floor(10000000 + Math.random() * 90000000)}-TRAI`,
      dltHeader: `AD-${businessName.slice(0, 4).toUpperCase()}`,
      razorpaySubStatus: 'active',
      nextBillingDate: '2026-11-01',
      createdAt: new Date().toISOString()
    };

    setTenants((prev) => [...prev, newTenant]);
    setActiveTenant(newTenant);

    // Create default agent for new tenant
    const defaultAgent: AgentConfig = {
      id: `agent-${Date.now()}`,
      tenantId: newTenant.id,
      name: `${businessName} AI Receptionist`,
      businessName: businessName,
      industry: 'Restaurant / Dining / Hospitality',
      language: 'Hinglish',
      voice: VOICE_CATALOG[0],
      greeting: `Namaste! Welcome to ${businessName}. How can I assist your call today?`,
      systemPrompt: `You are a polite AI receptionist for ${businessName}. Answer customer questions and book reservation slots.`,
      faqs: [{ question: 'Where are you located?', answer: 'We are located in central Indiranagar, Bangalore.' }],
      calendarConnected: true,
      phoneNumber: `+91 80 4719 ${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'published',
      maxCallDurationMins: 5
    };

    setAgents((prev) => [...prev, defaultAgent]);
    setSelectedAgent(defaultAgent);
  };

  const handleImpersonateTenant = (targetTenant: TenantInfo) => {
    setActiveTenant(targetTenant);
    setIsImpersonating(true);
    const tenantAgent = agents.find((a) => a.tenantId === targetTenant.id) || agents[0];
    setSelectedAgent(tenantAgent);
    setActiveTab('builder');
  };

  const handleExitImpersonation = () => {
    setIsImpersonating(false);
    setActiveTab('super_admin');
  };

  const handleToggleTenantStatus = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          const nextStatus = t.razorpaySubStatus === 'active' ? 'suspended' : 'active';
          return { ...t, razorpaySubStatus: nextStatus as any };
        }
        return t;
      })
    );
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
      industry: 'Restaurant / Dining / Hospitality',
      language: 'Hinglish',
      voice: VOICE_CATALOG[0],
      greeting: `Namaste! Thank you for calling ${activeTenant.name}. How can I help you today?`,
      systemPrompt: 'You are a professional, courteous receptionist. Answer customer queries, check available reservation slots, and confirm bookings.',
      faqs: [
        { question: 'What are your working hours?', answer: 'We are open Monday to Sunday from 12 PM to 11 PM.' }
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

    setActiveTenant((prev) => ({
      ...prev,
      usedMinutesThisMonth: prev.usedMinutesThisMonth + Math.ceil(newLog.durationSeconds / 60)
    }));

    if (newLog.actionTaken && (newLog.actionTaken.includes('Appointment') || newLog.actionTaken.includes('Table'))) {
      const newAppt: AppointmentRecord = {
        id: `appt-${Date.now()}`,
        tenantId: activeTenant.id,
        customerName: newLog.customerName || 'Browser Test User',
        customerPhone: newLog.customerPhone,
        slotTime: 'Tomorrow 8:30 PM',
        serviceName: 'Terrace Candlelight Table Reservation',
        status: 'confirmed',
        bookedByAgent: newLog.agentName
      };
      setAppointments((prev) => [newAppt, ...prev]);
    }
  };

  const pageTitles: Record<string, string> = {
    super_admin: 'Super Admin Control Center',
    builder: 'AI Receptionist Studio',
    logs: 'Call Logs & Transcripts',
    appointments: 'Bookings & Reservations',
    analytics: 'Call Analytics & CSAT',
    whatsapp: 'WhatsApp AI Bot & Flow Studio',
    trai: 'TRAI & DPDP Compliance',
    integrations: 'API Keys & Telephony',
    billing: 'Billing & Subscriptions',
    economics: 'SaaS Unit Economics',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* Sidebar Navigation */}
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
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        userRole={userRole}
        setUserRole={setUserRole}
        isImpersonating={isImpersonating}
        onExitImpersonation={handleExitImpersonation}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Impersonation Banner */}
        {isImpersonating && (
          <div className="bg-amber-500 text-slate-950 font-bold px-6 py-2 text-xs flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-950" />
              <span>SUPER ADMIN IMPERSONATION: Currently viewing & managing <strong>"{activeTenant.name}"</strong></span>
            </div>
            <button
              onClick={handleExitImpersonation}
              className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Exit to Super Admin Console
            </button>
          </div>
        )}

        {/* Top Content Bar */}
        <header className="glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 py-3.5 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="truncate">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">{pageTitles[activeTab]}</h2>
              <span className="text-[11px] text-indigo-300 font-medium truncate block">{activeTenant.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => handleStartTestCall(selectedAgent)}
              className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 sm:gap-2 animate-pulse"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Make </span>Test Call Now
            </button>
          </div>
        </header>

        {/* Responsive Tab View Container */}
        <main className="flex-1 pb-16 w-full max-w-7xl mx-auto">
          {activeTab === 'super_admin' && (
            <SuperAdminStudio
              tenants={tenants}
              onImpersonateTenant={handleImpersonateTenant}
              onCreateTenant={handleCreateTenant}
              onToggleTenantStatus={handleToggleTenantStatus}
            />
          )}

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
        <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-center sm:text-left text-[11px]">VocalFlow AI • Multi-Tenant Indian AI Voice Receptionist Platform</p>
          <div className="flex flex-wrap justify-center items-center gap-3 text-[11px] text-slate-400">
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
