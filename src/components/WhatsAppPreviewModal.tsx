import React from 'react';
import { CallLog } from '../types';
import { CheckCheck, MapPin, Calendar, Clock, MessageSquare } from 'lucide-react';

interface WhatsAppPreviewModalProps {
  isOpen: boolean;
  log: CallLog | null;
  onClose: () => void;
}

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  isOpen,
  log,
  onClose,
}) => {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-sm rounded-3xl border border-emerald-500/30 bg-slate-950 overflow-hidden shadow-2xl animate-scaleUp">
        
        {/* WhatsApp Header */}
        <div className="bg-emerald-700 px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
              {log.agentName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xs font-bold">{log.agentName}</h3>
              <p className="text-[10px] text-emerald-100 opacity-90">Official Business WhatsApp</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:opacity-75 font-bold text-sm">✕</button>
        </div>

        {/* WhatsApp Chat Body */}
        <div className="p-4 bg-[#0b141a] min-h-[300px] flex flex-col justify-end space-y-3 font-sans">
          
          {/* System Date Badge */}
          <div className="self-center bg-[#182229] text-[#8696a0] text-[10px] px-2.5 py-1 rounded-md font-medium">
            TODAY • DISPATCHED POST-CALL
          </div>

          {/* Incoming Message Bubble */}
          <div className="bg-[#005c4b] text-white p-3 rounded-2xl rounded-tl-none max-w-[90%] space-y-2 shadow text-xs">
            <p className="font-semibold text-emerald-200">
              Namaste {log.customerName || 'Valued Customer'}! 🙏
            </p>
            <p className="text-[11px] leading-relaxed">
              Thank you for calling {log.agentName}. Here are your booking details:
            </p>
            
            <div className="bg-[#0b141a]/60 p-2.5 rounded-xl space-y-1 text-[11px] border border-emerald-500/20">
              <p className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {log.actionTaken || 'Appointment Confirmed'}
              </p>
              <p className="flex items-center gap-1.5 text-emerald-200">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                100 Feet Road, Indiranagar, Bangalore
              </p>
            </div>

            <p className="text-[10px] text-emerald-200/80">
              Need to reschedule or have questions? Simply reply to this chat!
            </p>

            <div className="flex justify-end items-center gap-1 text-[9px] text-emerald-200 opacity-75">
              <span>{log.startTime.split(' ')[1]}</span>
              <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
};
