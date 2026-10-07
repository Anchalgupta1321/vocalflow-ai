import React, { useState } from 'react';
import { AppointmentRecord } from '../types';
import { Calendar, Clock, User, Phone, CheckCircle2, Search, Filter, Plus, MessageSquare } from 'lucide-react';

interface AppointmentsManagerProps {
  appointments: AppointmentRecord[];
  onAddAppointment: (newAppt: AppointmentRecord) => void;
}

export const AppointmentsManager: React.FC<AppointmentsManagerProps> = ({
  appointments,
  onAddAppointment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('Dental Scaling & Checkup');

  const filtered = appointments.filter(
    (a) =>
      a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.customerPhone.includes(searchTerm) ||
      a.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    if (!name || !phone) return;
    onAddAppointment({
      id: `appt-${Date.now()}`,
      tenantId: 'tenant-101',
      customerName: name,
      customerPhone: phone,
      slotTime: time || 'Tomorrow 4:00 PM',
      serviceName: service,
      status: 'confirmed',
      bookedByAgent: 'Apollo Dental Receptionist (AI)'
    });
    setName('');
    setPhone('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Google / Outlook Calendar Synced
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-emerald-400 font-medium">Real-Time AI Slot Reservation</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Appointments & Booking Manager</h2>
          <p className="text-sm text-slate-400">
            View all appointments auto-booked by your AI Receptionist during phone calls.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Manual Appointment
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient/customer name, phone, service..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Total Booked: <strong className="text-white">{appointments.length}</strong>
        </span>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((appt) => (
          <div key={appt.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Confirmed by AI
              </span>
              <span className="text-[10px] font-mono text-slate-400">ID: {appt.id}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <User className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{appt.customerName}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{appt.customerPhone}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Slot: {appt.slotTime}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Service: <strong className="text-slate-200">{appt.serviceName}</strong></span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> WhatsApp Sent
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-indigo-500/30 bg-slate-950 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Create Appointment Slot</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Customer / Patient Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikramaditya Singh"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Customer Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98450 11223"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Date & Time Slot</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. Tomorrow 4:00 PM"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Service Type</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="Dental Scaling & Cleaning">Dental Scaling & Cleaning</option>
                  <option value="General Doctor Consultation">General Doctor Consultation</option>
                  <option value="Dinner Table Reservation for 4">Dinner Table Reservation for 4</option>
                  <option value="Property Site Visit Inspection">Property Site Visit Inspection</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Book Slot
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
