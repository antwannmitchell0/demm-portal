'use client';

import { useState } from 'react';
import { Send, Loader2, Terminal, User, Phone, MessageSquare } from 'lucide-react';
import { runAgent, CLIENT_CONFIG } from '@/lib/demm-api';
import ActionRecord from '@/components/ActionRecord';

interface Props {
  clientId: string;
}

interface RunResult {
  response: string;
  credits_remaining: number;
  run_id: string;
}

export default function DemmChat({ clientId }: Props) {
  const [task, setTask] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [outreachReason, setOutreachReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const config = CLIENT_CONFIG[clientId];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await runAgent({
        client_id: clientId,
        ghl_location_id: config.ghl_location_id,
        task: task.trim(),
        contact_name: contactName.trim() || undefined,
        contact_phone: contactPhone.trim() || undefined,
        outreach_reason: outreachReason.trim() || undefined,
        memory: true,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Agent run failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTask('');
    setContactName('');
    setContactPhone('');
    setOutreachReason('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      {/* Left: Input */}
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Quick-Fill */}
          <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Contact Info (Optional)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-500 mb-1 ml-0.5">
                  Contact Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-amber-500/50 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-500 mb-1 ml-0.5">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (404) 555-0100"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-amber-500/50 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-zinc-500 mb-1 ml-0.5">
                Outreach Reason
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-3.5 h-3.5 text-zinc-600" />
                <input
                  type="text"
                  value={outreachReason}
                  onChange={(e) => setOutreachReason(e.target.value)}
                  placeholder="Follow up on quote, check in after consultation..."
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-amber-500/50 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Task input */}
          <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Task
              </span>
              <span className="text-red-500 text-xs ml-0.5">*</span>
            </div>

            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder={`What should DEMM OS do?\n\nExamples:\n• Send a follow-up SMS to the contact above\n• Check this week's appointment pipeline\n• Draft a re-engagement message for cold leads`}
              rows={6}
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-amber-500/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors font-mono resize-none leading-relaxed"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="border border-red-800/60 bg-red-950/30 rounded-md px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || !task.trim()}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/30 disabled:cursor-not-allowed text-black font-semibold px-5 py-2.5 rounded-md text-sm transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Run Agent
                </>
              )}
            </button>

            {(result || error) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-2.5"
              >
                Clear
              </button>
            )}

            <div className="ml-auto text-[11px] text-zinc-600 font-mono">
              {config?.label} · {config?.ghl_location_id}
            </div>
          </div>
        </form>
      </div>

      {/* Right: Output */}
      <div>
        {loading && (
          <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
            <p className="text-sm text-zinc-500">Agent running… (10–30s)</p>
            <p className="text-xs text-zinc-700 font-mono">
              {clientId} · {new Date().toLocaleTimeString()}
            </p>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-0">
            {/* Terminal output */}
            <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1e1e1e] bg-[#111]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[10px] text-zinc-600 font-mono ml-2">
                  demm-os · run/{result.run_id?.slice(0, 8)}
                </span>
                <span className="ml-auto text-[10px] text-amber-500/60 font-mono">
                  {result.credits_remaining?.toLocaleString()} credits left
                </span>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <pre className="terminal-output text-green-400 text-xs leading-relaxed whitespace-pre-wrap">
                  {result.response}
                </pre>
              </div>
            </div>

            {/* Parsed action record */}
            <ActionRecord raw={result.response} />
          </div>
        )}

        {!loading && !result && !error && (
          <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[200px]">
            <Terminal className="w-8 h-8 text-zinc-700" />
            <p className="text-sm text-zinc-600">
              Agent output will appear here
            </p>
            <p className="text-xs text-zinc-700">
              Fill in the task and hit Run Agent
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
