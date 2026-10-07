export type VoiceProvider = 'elevenlabs' | 'cartesia' | 'bolna' | 'vio' | 'retell';

export interface VoiceOption {
  id: string;
  name: string;
  provider: VoiceProvider;
  accent: string;
  gender: string;
  sampleText: string;
  costPerMinInr: number;
  qualityStars: number;
}

export interface TenantInfo {
  id: string;
  name: string;
  ownerEmail: string;
  planName: 'Starter (₹4,999/mo)' | 'Pro (₹9,999/mo)' | 'Enterprise';
  includedMinutes: number;
  usedMinutesThisMonth: number;
  dltEntityId: string;
  dltHeader: string;
  razorpaySubStatus: 'active' | 'past_due' | 'trialing';
  nextBillingDate: string;
}

export interface AgentConfig {
  id: string;
  tenantId: string;
  name: string;
  businessName: string;
  industry: string;
  language: 'English' | 'Hindi' | 'Hinglish' | 'Tamil' | 'Telugu';
  voice: VoiceOption;
  greeting: string;
  systemPrompt: string;
  faqs: { question: string; answer: string }[];
  calendarConnected: boolean;
  phoneNumber: string;
  status: 'draft' | 'published';
  maxCallDurationMins: number;
}

export interface AppointmentRecord {
  id: string;
  tenantId: string;
  customerName: string;
  customerPhone: string;
  slotTime: string;
  serviceName: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  bookedByAgent: string;
}

export interface CallLog {
  id: string;
  agentName: string;
  customerPhone: string;
  customerName?: string;
  callType: 'inbound' | 'outbound_service' | 'outbound_promotional';
  startTime: string;
  durationSeconds: number;
  costInr: number;
  status: 'completed' | 'missed' | 'failed';
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  transcript: { speaker: 'AI' | 'Customer'; text: string; timestamp: string }[];
  traiCompliant: boolean;
  dndStatus: 'clean' | 'scrubbed' | 'not_applicable';
  actionTaken?: string;
  whatsappSent?: boolean;
}

export interface TraiConsentRecord {
  id: string;
  customerPhone: string;
  consentType: 'explicit_web' | 'ivr_opt_in' | 'inbound_request';
  grantedAt: string;
  expiryDate: string;
  purpose: string;
  peRegistrationId: string;
  status: 'active' | 'revoked';
}

export interface UnitEconomicsState {
  monthlyPlanPriceInr: number;
  includedMinutes: number;
  voiceProviderCostPerMin: number;
  llmCostPerMin: number;
  telephonyCostPerMin: number;
  dbHostingCostPerUser: number;
  whatsappMessageCost: number;
  activeSubscriberCount: number;
}
