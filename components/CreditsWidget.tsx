'use client';

import { useState, useEffect, useCallback } from 'react';
import { Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { getCredits } from '@/lib/demm-api';

interface Props {
  clientId: string;
}

export default function CreditsWidget({ clientId }: Props) {
  const [balance, setBalance] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCredits = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCredits(clientId);
      setBalance(data.balance);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load credits');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchCredits();
    const interval = setInterval(fetchCredits, 30_000);
    return () => clearInterval(interval);
  }, [fetchCredits]);

  const isLow = balance !== null && balance < 100;

  return (
    <div className="flex items-center gap-2">
      {error ? (
        <div className="flex items-center gap-1.5 text-red-400 text-xs">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Credits error</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono ${
              isLow
                ? 'bg-red-950/50 border border-red-800/60 text-red-400'
                : 'bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-300'
            }`}
          >
            {isLow ? (
              <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
            ) : (
              <Zap className="w-3 h-3 text-amber-500 flex-shrink-0" />
            )}
            <span>
              {balance === null ? '—' : balance.toLocaleString()}{' '}
              <span className="text-zinc-500">credits</span>
            </span>
            {isLow && (
              <span className="ml-1 text-red-400 font-semibold">LOW</span>
            )}
          </div>

          {lastUpdated && (
            <span className="text-[10px] text-zinc-600 hidden sm:inline">
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}

          <button
            onClick={fetchCredits}
            disabled={loading}
            className="text-zinc-600 hover:text-amber-500 transition-colors"
            title="Refresh credits"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
