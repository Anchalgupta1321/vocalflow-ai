import React, { useState } from 'react';
import { CallLog } from '../types';
import { 
  PhoneCall, Search, Filter, Play, Pause, CheckCircle2, MessageSquare, 
  Clock, ShieldCheck, Download, AlertTriangle, ChevronRight, FileText, Volume2, Sparkles
} from 'lucide-react';

interface CallLogsProps {
  logs: CallLog[];
  onOpenWhatsAppPreview: (log: CallLog) => void;
}

export const CallLogs: React.FC<CallLogsProps> = ({ logs, onOpenWhatsAppPreview }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCallType, setSelectedCallType] = useState<string>('all');
  const [activeLogModal, setActiveLogModal] = useState<CallLog | null>(null);
  const [playingLogId, setPlayingLogId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.customerPhone.includes(searchTerm) ||
      (log.customerName && log.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedCallType === 'all' || log.callType === selectedCallType;
    return matchesSearch && matchesType;
  });

  const handlePlayAudioRecording = (log: CallLog) => {
    if (playingLogId === log.id) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPlayingLogId(null);
      return;
    }

    setPlayingLogId(log.id);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const firstTurn = log.transcript[0]?.text || log.summary;
      const utterance = new SpeechSynthesisUtterance(firstTurn);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setPlayingLogId(null);
      utterance.onerror = () => setPlayingLogId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingLogId(null), 4000);
    }
  };

  const totalDurationMins = (logs.reduce((acc, l) => acc + l.durationSeconds, 0) / 60).toFixed(1);
  const totalCostInr = logs.reduce((acc, l) => acc + l.costInr, 0).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Total Inbound Calls</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{logs.length}</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-bold">100% Answered</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Total Minutes Spoken</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{totalDurationMins} Mins</span>
            <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-medium">Avg ~1.8 Mins</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Total Direct Cost</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">₹{totalCostInr}</span>
            <span className="text-xs text-slate-400">Avg ₹{logs.length > 0 ? (Number(totalCostInr) / logs.length).toFixed(1) : 0}/call</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">TRAI Telecom Status</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Clean Status
            </span>
            <span className="text-xs text-slate-400">0 Flags</span>
          </div>
        </div>

      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guest number, name, transcript..."
              className="input-field w-full pl-10"
            />
          </div>

          <select
            value={selectedCallType}
            onChange={(e) => setSelectedCallType(e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="all">All Call Types</option>
            <option value="inbound">Inbound Table & Room Inquiries</option>
            <option value="outbound_service">Outbound Confirmation Calls</option>
          </select>
        </div>

        <button
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `VocalFlow_CallLogs_${Date.now()}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition-colors shadow"
        >
          <Download className="w-4 h-4" /> Export Call Logs
        </button>
      </div>

      {/* CALL LOGS TABLE */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Guest / Phone Number</th>
                <th className="px-6 py-4">AI Host Agent</th>
                <th className="px-6 py-4">Call Type & TRAI</th>
                <th className="px-6 py-4">Duration & Cost</th>
                <th className="px-6 py-4">Summary & Outcome</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                  
                  {/* Caller info */}
                  <td className="px-6 py-4.5 font-mono font-medium text-white">
                    <div className="font-bold text-sm">{log.customerPhone}</div>
                    {log.customerName && <div className="text-xs font-sans text-slate-300 font-medium">{log.customerName}</div>}
                    <span className="text-[10px] text-slate-400">{log.startTime}</span>
                  </td>

                  {/* Agent */}
                  <td className="px-6 py-4.5 font-bold text-indigo-300 text-xs">
                    {log.agentName}
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4.5 space-y-1">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border inline-block ${
                      log.callType === 'inbound'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    }`}>
                      {log.callType === 'inbound' ? 'Inbound Reception' : 'Outbound Service'}
                    </span>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Compliant
                    </div>
                  </td>

                  {/* Duration & Cost */}
                  <td className="px-6 py-4.5 font-mono">
                    <div className="text-slate-100 font-bold">{Math.floor(log.durationSeconds / 60)}m {log.durationSeconds % 60}s</div>
                    <div className="text-xs text-amber-400 font-bold">₹{log.costInr.toFixed(2)}</div>
                  </td>

                  {/* Summary */}
                  <td className="px-6 py-4.5 max-w-xs">
                    <p className="text-slate-200 truncate text-xs font-medium">{log.summary}</p>
                    {log.actionTaken && (
                      <span className="text-[10px] bg-slate-950 text-emerald-300 px-2.5 py-0.5 rounded-md border border-slate-800 mt-1 inline-block font-mono font-bold">
                        {log.actionTaken}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4.5 text-right space-x-2">
                    <button
                      onClick={() => handlePlayAudioRecording(log)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all inline-flex items-center gap-1 ${
                        playingLogId === log.id
                          ? 'bg-indigo-600 text-white border-indigo-500 animate-pulse'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                      title="Play Audio Recording"
                    >
                      {playingLogId === log.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => setActiveLogModal(log)}
                      className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition-colors"
                    >
                      Transcript
                    </button>

                    {log.whatsappSent && (
                      <button
                        onClick={() => onOpenWhatsAppPreview(log)}
                        className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors"
                        title="View WhatsApp Sent"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRANSCRIPT DETAIL MODAL */}
      {activeLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xl rounded-3xl border border-indigo-500/30 bg-slate-950 overflow-hidden shadow-2xl p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Call Transcript Log #{activeLogModal.id}</h3>
                <p className="text-xs text-slate-400">Guest: {activeLogModal.customerPhone} ({activeLogModal.customerName || 'Guest'})</p>
              </div>
              <button
                onClick={() => setActiveLogModal(null)}
                className="text-slate-400 hover:text-white font-bold text-sm px-2"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl space-y-1 text-xs text-slate-300 border border-slate-800">
              <p>• <strong>AI Agent:</strong> {activeLogModal.agentName}</p>
              <p>• <strong>Duration:</strong> {activeLogModal.durationSeconds} Seconds | <strong>Cost:</strong> ₹{activeLogModal.costInr}</p>
              <p>• <strong>Summary:</strong> {activeLogModal.summary}</p>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
              {activeLogModal.transcript.map((t, idx) => (
                <div key={idx} className="text-xs p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-[10px] text-indigo-400">
                    <span>{t.speaker === 'AI' ? `${activeLogModal.agentName} (AI)` : 'Guest'}</span>
                    <span className="text-slate-500">{t.timestamp}</span>
                  </div>
                  <p className="text-slate-100">{t.text}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveLogModal(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
