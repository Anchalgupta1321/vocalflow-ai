import { VoiceOption, AgentConfig, CallLog, TraiConsentRecord, TenantInfo, AppointmentRecord } from '../types';

export const MOCK_TENANTS: TenantInfo[] = [
  {
    id: 'tenant-101',
    name: 'Spice Lounge Fine Dining & Bar (Indiranagar)',
    ownerEmail: 'reservations@spicelounge.in',
    planName: 'Starter (₹4,999/mo)',
    includedMinutes: 300,
    usedMinutesThisMonth: 185,
    dltEntityId: 'PE-44883920-TRAI',
    dltHeader: 'VM-SPICE',
    razorpaySubStatus: 'active',
    nextBillingDate: '2026-11-01'
  },
  {
    id: 'tenant-102',
    name: 'Grand Heritage Hotel & Boutique Resort (Goa)',
    ownerEmail: 'bookings@grandheritagegoa.com',
    planName: 'Pro (₹9,999/mo)',
    includedMinutes: 750,
    usedMinutesThisMonth: 420,
    dltEntityId: 'PE-99018472-TRAI',
    dltHeader: 'AD-HERITAGE',
    razorpaySubStatus: 'active',
    nextBillingDate: '2026-11-05'
  }
];

export const MOCK_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: 'res-301',
    tenantId: 'tenant-101',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98450 12345',
    slotTime: 'Tonight at 8:30 PM',
    serviceName: 'Terrace Candlelight Table for 4 Guests',
    status: 'confirmed',
    bookedByAgent: 'Spice Lounge Table Booking AI'
  },
  {
    id: 'res-302',
    tenantId: 'tenant-102',
    customerName: 'Ananya Roy',
    customerPhone: '+91 99001 88776',
    slotTime: 'This Weekend (Sat 2 PM - Mon 11 AM)',
    serviceName: 'Deluxe Sea View Suite + Complimentary Breakfast',
    status: 'confirmed',
    bookedByAgent: 'Grand Heritage Room Booking AI'
  }
];

export const VOICE_CATALOG: VoiceOption[] = [
  {
    id: 'cartesia-sonic',
    name: 'Sonic UltraFast (Instant Turn-Taking)',
    provider: 'cartesia',
    accent: 'Global English',
    gender: 'Female',
    sampleText: 'Good evening! Thank you for calling Spice Lounge Fine Dining. How many guests will be joining your table tonight?',
    costPerMinInr: 6.00,
    qualityStars: 5,
  },
  {
    id: 'el-rachel',
    name: 'Rachel (Warm Indian Accent)',
    provider: 'elevenlabs',
    accent: 'Indian English',
    gender: 'Female',
    sampleText: 'Welcome to Grand Heritage Hotel & Resort Goa. Are you looking to book a room suite or inquire about pool villa rates?',
    costPerMinInr: 7.70,
    qualityStars: 5,
  },
  {
    id: 'bolna-deepa',
    name: 'Deepa (Pure Hindi & Hinglish)',
    provider: 'bolna',
    accent: 'Hindi / Hinglish',
    gender: 'Female',
    sampleText: 'नमस्ते! रॉयल पैलेस रिसॉर्ट में आपका स्वागत है। क्या मैं आपकी टेबल बुकिंग या रूम रिजर्वेशन में मदद करूँ?',
    costPerMinInr: 5.50,
    qualityStars: 4,
  },
  {
    id: 'vio-priya',
    name: 'Priya (Low Latency South Asia)',
    provider: 'vio',
    accent: 'Indian Warm',
    gender: 'Female',
    sampleText: 'Good evening! Thank you for calling Saffron Fine Dining. Would you prefer indoor seating or rooftop lounge?',
    costPerMinInr: 4.50,
    qualityStars: 4,
  },
];

export const INITIAL_AGENTS: AgentConfig[] = [
  {
    id: 'agent-101',
    tenantId: 'tenant-101',
    name: 'Spice Lounge Table Booking AI',
    businessName: 'Spice Lounge Fine Dining & Bar',
    industry: 'Restaurant / Dining / Cafe',
    language: 'Hinglish',
    voice: VOICE_CATALOG[0],
    greeting: 'Good evening! Thank you for calling Spice Lounge Fine Dining Indiranagar. I am your AI Host. How many guests will be joining your dinner reservation tonight?',
    systemPrompt: 'You are a warm, courteous host at a high-end restaurant in Bangalore. Ask the caller for guest count, date, time slot (7:00 PM or 8:30 PM), indoor vs terrace seating, and special occasion requests (anniversary, birthday cake). Always confirm complimentary valet parking.',
    faqs: [
      { question: 'Is valet parking available?', answer: 'Yes! We offer complimentary valet parking right at the main entrance.' },
      { question: 'What is your dress code?', answer: 'Smart casual dress code is enforced after 7 PM.' },
      { question: 'Do you serve liquor / alcohol?', answer: 'Yes, we have a full bar serving artisanal cocktails, craft beer, and imported wine.' }
    ],
    calendarConnected: true,
    phoneNumber: '+91 80 4719 8820',
    status: 'published',
    maxCallDurationMins: 4
  },
  {
    id: 'agent-102',
    tenantId: 'tenant-102',
    name: 'Grand Heritage Room Booking AI',
    businessName: 'Grand Heritage Hotel & Boutique Resort',
    industry: 'Hotel / Resort / Hospitality',
    language: 'English',
    voice: VOICE_CATALOG[1],
    greeting: 'Welcome to Grand Heritage Hotel & Boutique Resort Goa. I am your AI Reservations Specialist. Are you looking for weekend room availability or pool villa packages?',
    systemPrompt: 'You are an elegant hotel receptionist. Check check-in/check-out dates, guest count, room category (Deluxe Sea View vs Private Pool Villa), and breakfast inclusion. Mention check-in time is 2 PM and check-out is 11 AM.',
    faqs: [
      { question: 'What is the check-in and check-out time?', answer: 'Check-in is at 2:00 PM and check-out is at 11:00 AM.' },
      { question: 'Is airport transfer included?', answer: 'Yes! Complimentary AC sedan airport pickup is included for stays over 2 nights.' }
    ],
    calendarConnected: true,
    phoneNumber: '+91 22 6902 4411',
    status: 'published',
    maxCallDurationMins: 5
  }
];

export const MOCK_CALL_LOGS: CallLog[] = [
  {
    id: 'call-901',
    agentName: 'Spice Lounge Table Booking AI',
    customerPhone: '+91 98450 12345',
    customerName: 'Rahul Verma',
    callType: 'inbound',
    startTime: '2026-10-07 07:14 PM',
    durationSeconds: 112,
    costInr: 15.4,
    status: 'completed',
    sentiment: 'positive',
    summary: 'Caller reserved terrace candlelight table for 4 guests tonight at 8:30 PM. Requested anniversary cake. Automated WhatsApp confirmation sent with Google Maps link.',
    transcript: [
      { speaker: 'AI', text: 'Good evening! Thank you for calling Spice Lounge Fine Dining Indiranagar. How many guests will be joining your reservation tonight?', timestamp: '00:01' },
      { speaker: 'Customer', text: 'Hi! We are 4 people coming for our wedding anniversary tonight around 8:30 PM. Do you have a nice table open?', timestamp: '00:08' },
      { speaker: 'AI', text: 'Happy anniversary, Mr. Rahul! I have held a romantic candlelight terrace table for 4 guests tonight at 8:30 PM. I will also make a note for our chef to prepare a complimentary dessert for you!', timestamp: '00:16' },
      { speaker: 'Customer', text: 'That sounds amazing! Thank you so much.', timestamp: '00:22' },
      { speaker: 'AI', text: 'My pleasure! I have just sent a WhatsApp confirmation with our location map and valet parking details. We look forward to hosting you!', timestamp: '00:29' }
    ],
    traiCompliant: true,
    dndStatus: 'clean',
    actionTaken: 'Table Booked: Terrace Table for 4 @ 8:30 PM',
    whatsappSent: true
  },
  {
    id: 'call-902',
    agentName: 'Grand Heritage Room Booking AI',
    customerPhone: '+91 99001 88776',
    customerName: 'Ananya Roy',
    callType: 'inbound',
    startTime: '2026-10-07 02:30 PM',
    durationSeconds: 148,
    costInr: 22.8,
    status: 'completed',
    sentiment: 'positive',
    summary: 'Inquired about weekend room rates. Booked Deluxe Sea View Suite for 2 nights (Sat-Mon). Sent WhatsApp receipt & resort brochure.',
    transcript: [
      { speaker: 'AI', text: 'Welcome to Grand Heritage Hotel & Boutique Resort Goa. How can I assist your stay today?', timestamp: '00:01' },
      { speaker: 'Customer', text: 'Hi, what is the room rate for a Sea View Suite this weekend from Saturday to Monday?', timestamp: '00:08' },
      { speaker: 'AI', text: 'Our Deluxe Sea View Suite is ₹8,500 per night, which includes buffet breakfast and airport transfers. Would you like me to hold a suite for Saturday check-in?', timestamp: '00:18' }
    ],
    traiCompliant: true,
    dndStatus: 'clean',
    actionTaken: 'Room Reserved: Deluxe Sea View Suite',
    whatsappSent: true
  }
];

export const MOCK_TRAI_CONSENTS: TraiConsentRecord[] = [
  {
    id: 'cns-401',
    customerPhone: '+91 98450 12345',
    consentType: 'inbound_request',
    grantedAt: '2026-10-01 19:30:00',
    expiryDate: '2027-10-01',
    purpose: 'Table Reservations & Special Offers',
    peRegistrationId: 'PE-44883920-TRAI',
    status: 'active'
  }
];
