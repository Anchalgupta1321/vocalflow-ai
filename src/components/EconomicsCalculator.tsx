import React, { useState } from 'react';
import { UnitEconomicsState } from '../types';
import { 
  TrendingUp, DollarSign, PieChart, Sparkles, CheckCircle2, 
  ArrowRight, Calculator, Zap, ShieldCheck, RefreshCw 
} from 'lucide-react';

export const EconomicsCalculator: React.FC = () => {
  const [econ, setEcon] = useState<UnitEconomicsState>({
    monthlyPlanPriceInr: 4999,
    includedMinutes: 300,
    voiceProviderCostPerMin: 7.70, // ElevenLabs standard
    llmCostPerMin: 0.50, // GPT-4o mini
    telephonyCostPerMin: 1.20, // Indian SIP trunking
    dbHostingCostPerUser: 50,
    whatsappMessageCost: 0.50,
    activeSubscriberCount: 50,
  });

  const [usagePercentage, setUsagePercentage] = useState<number>(75); // Avg customer uses 75% of included minutes

  // Calculated Metrics
  const costPerMinTotal = econ.voiceProviderCostPerMin + econ.llmCostPerMin + econ.telephonyCostPerMin;
  const minsUsedPerCustomer = (econ.includedMinutes * (usagePercentage / 100));
  const variableVoiceLlmCostPerCustomer = minsUsedPerCustomer * costPerMinTotal;
  const whatsappTotalPerCustomer = (minsUsedPerCustomer / 2.5) * econ.whatsappMessageCost; // ~1 whatsapp msg per call
  const paymentGatewayFee = econ.monthlyPlanPriceInr * 0.02; // 2% Razorpay fee

  const totalCOGSPerCustomer = variableVoiceLlmCostPerCustomer + whatsappTotalPerCustomer + econ.dbHostingCostPerUser + paymentGatewayFee;
  const grossProfitPerCustomer = econ.monthlyPlanPriceInr - totalCOGSPerCustomer;
  const grossMarginPercent = ((grossProfitPerCustomer / econ.monthlyPlanPriceInr) * 100).toFixed(1);

  const mrr = econ.monthlyPlanPriceInr * econ.activeSubscriberCount;
  const totalMonthlyCost = totalCOGSPerCustomer * econ.activeSubscriberCount;
  const totalMonthlyNetProfit = mrr - totalMonthlyCost;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Unit Economics & Pricing Model
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-amber-300 font-mono">ElevenLabs / Cartesia vs Local Voice</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">SaaS Margin & Profitability Engine</h2>
          <p className="text-sm text-slate-400">
            Simulate monthly subscription revenue, included call minutes, voice provider stacks, and net profit margins.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 text-right space-y-1 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Calculated Gross Margin</span>
          <span className="text-3xl font-extrabold text-emerald-400">{grossMarginPercent}%</span>
          <span className="text-[11px] text-slate-400 block">₹{grossProfitPerCustomer.toFixed(0)} profit / customer</span>
        </div>
      </div>

      {/* Main Sliders & Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" />
            Pricing & Customer Volume Controls
          </h3>

          <div className="space-y-5">
            
            {/* Monthly Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">Customer Monthly Subscription Price</label>
                <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded border border-indigo-500/30 text-sm">
                  ₹{econ.monthlyPlanPriceInr.toLocaleString()}/month
                </span>
              </div>
              <input
                type="range"
                min={1999}
                max={14999}
                step={500}
                value={econ.monthlyPlanPriceInr}
                onChange={(e) => setEcon({ ...econ, monthlyPlanPriceInr: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹1,999 (Starter)</span>
                <span>₹4,999 (Recommended Base)</span>
                <span>₹14,999 (Pro Enterprise)</span>
              </div>
            </div>

            {/* Included Minutes Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">Included Call Minutes per Month</label>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30 text-sm">
                  {econ.includedMinutes} Included Mins
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={econ.includedMinutes}
                onChange={(e) => setEcon({ ...econ, includedMinutes: Number(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Avg Minute Usage Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">Average Customer Capacity Utilization</label>
                <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded border border-purple-500/30 text-sm">
                  {usagePercentage}% ({Math.round(minsUsedPerCustomer)} Mins Used)
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={100}
                step={5}
                value={usagePercentage}
                onChange={(e) => setUsagePercentage(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Active Customers Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">Total Active Paying Customers</label>
                <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/30 text-sm">
                  {econ.activeSubscriberCount} Active Clients
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={econ.activeSubscriberCount}
                onChange={(e) => setEcon({ ...econ, activeSubscriberCount: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

          </div>

          {/* STACK PRESET SELECTORS */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-300 block">Select Underlying Voice Tech Stack</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: 'ElevenLabs Base', cost: 7.70, tag: 'Premium' },
                { name: 'Cartesia Sonic', cost: 6.00, tag: 'UltraFast' },
                { name: 'Bolna AI', cost: 5.50, tag: 'Hindi' },
                { name: 'Vio Indian', cost: 4.50, tag: 'Cheapest' },
              ].map((v) => (
                <button
                  key={v.name}
                  onClick={() => setEcon({ ...econ, voiceProviderCostPerMin: v.cost })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    econ.voiceProviderCostPerMin === v.cost
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[11px] font-bold block truncate">{v.name}</span>
                  <span className="text-xs font-mono font-bold text-amber-400">₹{v.cost.toFixed(2)}/min</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Financial Output & Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Per-Minute Cost Stack */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-400" />
              Blended Cost Stack Per Minute Spoken
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">1. Voice Generation (TTS)</span>
                <span className="font-mono font-bold text-white">₹{econ.voiceProviderCostPerMin.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">2. LLM Latency Layer (GPT-4o mini)</span>
                <span className="font-mono font-bold text-white">₹{econ.llmCostPerMin.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">3. Telephony Trunking (Inbound/Outbound)</span>
                <span className="font-mono font-bold text-white">₹{econ.telephonyCostPerMin.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold bg-slate-900 px-3 rounded-lg border border-slate-800">
                <span className="text-indigo-300">Total All-in Cost per Minute</span>
                <span className="font-mono text-amber-400">₹{costPerMinTotal.toFixed(2)}/min</span>
              </div>
            </div>
          </div>

          {/* Business Scale Output */}
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Monthly SaaS Business Metrics ({econ.activeSubscriberCount} Clients)
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Monthly Recurring Revenue (MRR)</span>
                <span className="text-lg font-bold text-white font-mono">₹{mrr.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Infrastructure COGS</span>
                <span className="text-sm font-mono text-rose-400">₹{totalMonthlyCost.toFixed(0)}</span>
              </div>
              <div className="pt-3 border-t border-indigo-500/30 flex justify-between items-center">
                <span className="text-sm font-bold text-emerald-400">Net Profit Per Month</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">₹{totalMonthlyNetProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
