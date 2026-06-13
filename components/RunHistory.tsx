'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Zap, RefreshCw, Loader2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { getRuns, Run } from '@/lib/demm-api';

interface Props {
  clientId: string;
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  if (s === 'success' || s === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-green-400 bg-green-950/40 border border-green-800/40 px-2 py-0.5 rounded-full font-mono">
        <CheckCircle className="w-2.5 h-2.5" />
        {status}
      </span>
    );
  }
  if (s === 'failed' || s === 'error') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-red-400 bg-red-950/40 border border-red-800/40 px-2 py-0.5 rounded-full font-mono">
        <XCircle className="w-2.5 h-2.5" />
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-900/40 border border-zinc-800 px-2 py-0.5 rounded-full font-mono">
      {status}
    </span>
  );
}

function formatTs(ts: string): string {
  try {
    return new Date(ts).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return ts;
  }
}

export default function RunHistory({ clientId }: Props) {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRuns = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRuns(clientId);
      setRuns(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load runs');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-lg overflow-hidden">
      {/* Table header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a2a]">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Recent Runs
        </span>
        <button
          onClick={fetchRuns}
          disabled={loading}
          className="text-zinc-600 hover:text-amber-500 transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-5 py-3 text-sm text-red-400 border-b border-[#2a2a2a]">
          <AlertTriangle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}

      {loading && !runs.length ? (
        <div className="flex items-center justify-center gap-2 py-12 text-zinc-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading runs…</span>
        </div>
      ) : runs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
          <Clock className="w-8 h-8 text-zinc-800" />
          <p className="text-sm text-zinc-600">No runs yet.</p>
          <p className="text-xs text-zinc-700">Run the agent from the Chat tab to see history here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Time
                </th>
                <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">
                  Task
                </th>
                <th className="text-right px-5 py-2.5 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">
                  <Zap className="w-3 h-3 inline mr-1" />
                  Credits
                </th>
                <th className="text-center px-5 py-2.5 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {runs.map((run) => (
                <tr
                  key={run.run_id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3 text-xs text-zinc-500 font-mono whitespace-nowrap">
                    {formatTs(run.timestamp)}
                  </td>
                  <td className="px-5 py-3 text-xs text-zinc-300 max-w-[300px]">
                    <span
                      className="block truncate"
                      title={run.task}
                    >
                      {run.task}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-xs font-mono text-amber-500/80">
                      {run.credits_used ?? '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <StatusBadge status={run.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
