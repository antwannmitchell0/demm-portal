'use client';

import { useState, useCallback } from 'react';
import { Loader2, ChevronRight, Phone, Users, TrendingUp, MessageSquare, Calendar, BarChart3, Zap, AlertCircle } from 'lucide-react';
import { runAgent, CLIENT_CONFIG } from '@/lib/demm-api';

interface Props {
  clientId: string;
}

interface RunResult {
  response: string;
  credits_remaining: number;
  run_id: string;
}

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  category: 'urgent' | 'leads' | 'pipeline' | 'intel';
  needsContact?: boolean;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'missed_calls',
    label: 'Handle Missed Calls',
    description: 'Find every missed call from the last 48h and follow up',
    icon: <Phone className="w-4 h-4" />,
    prompt: 'Scan the account for all missed calls in the last 48 hours. For each one: identify the contact, draft a follow-up SMS, and log the action. Report back with who was contacted and what was sent.',
    category: 'urgent',
  },
  {
    id: 'unworked_leads',
    label: 'Work Uncontacted Leads',
    description: 'Find leads sitting idle and start the conversation',
    icon: <Users className="w-4 h-4" />,
    prompt: 'Find all new leads in the system that have not been contacted yet. For each one: reach out via SMS with a personalized introduction based on how they came in. Report how many were contacted.',
    category: 'leads',
  },
  {
    id: 'stalled_pipeline',
    label: 'Unstick the Pipeline',
    description: 'Find deals that stopped moving and re-engage them',
    icon: <TrendingUp className="w-4 h-4" />,
    prompt: 'Find all opportunities that haven\'t had any activity in the last 7 days. For each stalled deal: send a re-engagement message, add a follow-up task, and update the stage if needed. Report what you found and what actions were taken.',
    category: 'pipeline',
  },
  {
    id: 'cold_leads',
    label: 'Re-engage Cold Leads',
    description: 'Bring back contacts that went silent after 14+ days',
    icon: <MessageSquare className="w-4 h-4" />,
    prompt: 'Find contacts who last engaged more than 14 days ago and haven\'t booked or purchased. Send each one a re-engagement SMS with a reason to come back. Report how many were sent and what the messages said.',
    category: 'leads',
  },
  {
    id: 'appointment_reminders',
    label: 'Send Appointment Reminders',
    description: 'Remind everyone with an upcoming booking',
    icon: <Calendar className="w-4 h-4" />,
    prompt: 'Find all upcoming appointments in the next 48 hours. Send a reminder message to each contact with their appointment details. Report who was reminded and confirm the messages were sent.',
    category: 'urgent',
  },
  {
    id: 'weekly_pulse',
    label: 'Generate Weekly Report',
    description: 'Full account health: leads, pipeline, revenue, gaps',
    icon: <BarChart3 className="w-4 h-4" />,
    prompt: 'Generate a complete weekly performance report for this business. Include: new leads this week, appointments booked, pipeline movement, deals closed, missed opportunities, and top 3 things to focus on next week. Be specific with numbers.',
    category: 'intel',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  urgent: 'Needs Attention Now',
  leads: 'Lead Recovery',
  pipeline: 'Pipeline Health',
  intel: 'Business Intelligence',
};

const CATEGORY_ORDER = ['urgent', 'leads', 'pipeline', 'intel'];

export default function AgentConsole({ clientId }: Props) {
  const [activeAction, setActiveAction] = useState<QuickAction | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const config = CLIENT_CONFIG[clientId];

  const fire = useCallback(async (action: QuickAction) => {
    setActiveAction(action);
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await runAgent({
        client_id: clientId,
        ghl_location_id: config.ghl_location_id,
        task: action.prompt,
        contact_name: contactName.trim() || undefined,
        contact_phone: contactPhone.trim() || undefined,
        memory: true,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Agent run failed');
    } finally {
      setLoading(false);
    }
  }, [clientId, config.ghl_location_id, contactName, contactPhone]);

  const reset = () => {
    setActiveAction(null);
    setResult(null);
    setError(null);
  };

  const grouped = CATEGORY_ORDER.reduce<Record<string, QuickAction[]>>((acc, cat) => {
    acc[cat] = QUICK_ACTIONS.filter(a => a.category === cat);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Optional contact targeting */}
      <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
            Target a specific contact (optional)
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={contactName}
            onChange={e => setContactName(e.target.value)}
            placeholder="Contact name"
            className="bg-[#141414] border border-[#252525] focus:border-amber-500/40 rounded-md px-3 py-2 text-sm text-white placeholder-zinc-700 outline-none transition-colors"
          />
          <input
            type="tel"
            value={contactPhone}
            onChange={e => setContactPhone(e.target.value)}
            placeholder="Phone number"
            className="bg-[#141414] border border-[#252525] focus:border-amber-500/40 rounded-md px-3 py-2 text-sm text-white placeholder-zinc-700 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Action grid */}
      {!loading && !result && (
        <div className="space-y-5">
          {CATEGORY_ORDER.map(cat => (
            <div key={cat}>
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2 px-0.5">
                {CATEGORY_LABELS[cat]}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {grouped[cat].map(action => (
                  <button
                    key={action.id}
                    onClick={() => fire(action)}
                    className="group text-left bg-[#0d0d0d] hover:bg-[#131313] border border-[#1e1e1e] hover:border-amber-500/30 rounded-lg p-4 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-amber-500/70 group-hover:text-amber-500 transition-colors flex-shrink-0">
                        {action.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                            {action.label}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-amber-500 transition-colors flex-shrink-0" />
                        </div>
                        <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Running state */}
      {loading && activeAction && (
        <div className="bg-[#0d0d0d] border border-amber-500/20 rounded-lg p-8 flex flex-col items-center text-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border border-amber-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div className="absolute inset-0 rounded-full border border-amber-500/40 animate-ping" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{activeAction.label}</p>
            <p className="text-xs text-zinc-500 mt-1">Agent working on it… (10–30s)</p>
          </div>
          <Loader2 className="w-4 h-4 text-amber-500/50 animate-spin" />
        </div>
      )}

      {/* Result */}
      {!loading && result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-zinc-400">{activeAction?.label} — Done</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-amber-500/60 font-mono">
                {result.credits_remaining?.toLocaleString()} credits left
              </span>
              <button
                onClick={reset}
                className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>

          <div className="bg-[#080808] border border-[#1e1e1e] rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#141414] bg-[#0d0d0d]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#333]" />
                <div className="w-2 h-2 rounded-full bg-[#333]" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
              <span className="text-[10px] text-zinc-700 font-mono ml-1">
                demm-os · {result.run_id?.slice(0, 8)}
              </span>
            </div>
            <div className="p-5 max-h-[420px] overflow-y-auto">
              <pre className="text-green-400 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                {result.response}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-[#0d0d0d] border border-red-800/40 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={reset} className="text-xs text-zinc-600 hover:text-zinc-300 mt-2 transition-colors">
              ← Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
