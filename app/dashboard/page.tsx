'use client';

import { useState, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
import { ChevronDown, Cpu, Clock } from 'lucide-react';
import { CLIENT_CONFIG } from '@/lib/demm-api';
import CreditsWidget from '@/components/CreditsWidget';
import AgentConsole from '@/components/AgentConsole';
import RunHistory from '@/components/RunHistory';

type TabId = 'console' | 'activity';

const CLIENT_IDS = Object.keys(CLIENT_CONFIG) as string[];

export default function DashboardPage() {
  const [clientId, setClientId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('demm_client_id') || CLIENT_IDS[0];
    }
    return CLIENT_IDS[0];
  });
  const [activeTab, setActiveTab] = useState<TabId>('console');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('demm_client_id');
    if (stored && CLIENT_IDS.includes(stored)) {
      setClientId(stored);
    }
  }, []);

  const selectClient = (id: string) => {
    setClientId(id);
    localStorage.setItem('demm_client_id', id);
    setDropdownOpen(false);
  };

  const currentClient = CLIENT_CONFIG[clientId];

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#161616] bg-[#0a0a0a] px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-5">
          {/* Wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-base font-bold tracking-widest">
              <span className="text-amber-500">DEMM</span>
              <span className="text-white"> OS</span>
            </span>
          </div>

          <div className="w-px h-4 bg-[#222]" />

          {/* Client Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:bg-[#131313] rounded-md px-2.5 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
              <span className="font-medium">{currentClient?.label || clientId}</span>
              <ChevronDown className="w-3 h-3 text-zinc-600 ml-0.5" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg shadow-2xl z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-[#1a1a1a]">
                  <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">
                    Active Clients
                  </p>
                </div>
                {CLIENT_IDS.map((id) => (
                  <button
                    key={id}
                    onClick={() => selectClient(id)}
                    className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2.5 hover:bg-[#131313] ${
                      id === clientId ? 'text-amber-500' : 'text-zinc-400'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${id === clientId ? 'bg-amber-500' : 'bg-zinc-700'}`} />
                    {CLIENT_CONFIG[id]?.label || id}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <CreditsWidget clientId={clientId} />
          <div className="w-px h-4 bg-[#222]" />
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-7 h-7 ring-1 ring-amber-500/20',
              },
            }}
          />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-6 max-w-5xl mx-auto w-full">
        {/* Tab nav */}
        <div className="flex gap-1 mb-6">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium tracking-wide rounded-md transition-all ${
              activeTab === 'console'
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                : 'text-zinc-600 hover:text-zinc-400 border border-transparent'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Agent Console
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium tracking-wide rounded-md transition-all ${
              activeTab === 'activity'
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                : 'text-zinc-600 hover:text-zinc-400 border border-transparent'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Activity Log
          </button>
        </div>

        {activeTab === 'console' && <AgentConsole clientId={clientId} />}
        {activeTab === 'activity' && <RunHistory clientId={clientId} />}
      </main>

      {dropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
}
