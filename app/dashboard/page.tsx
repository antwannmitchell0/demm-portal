'use client';

import { useState, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
import { ChevronDown } from 'lucide-react';
import { CLIENT_CONFIG } from '@/lib/demm-api';
import CreditsWidget from '@/components/CreditsWidget';
import DemmChat from '@/components/DemmChat';
import RunHistory from '@/components/RunHistory';

type TabId = 'chat' | 'history';

const CLIENT_IDS = Object.keys(CLIENT_CONFIG) as string[];

export default function DashboardPage() {
  const [clientId, setClientId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('demm_client_id') || CLIENT_IDS[0];
    }
    return CLIENT_IDS[0];
  });
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Hydrate from localStorage after mount
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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] bg-[#0d0d0d] px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          {/* Wordmark */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-lg font-bold tracking-wider">
              <span className="text-amber-500">DEMM</span>
              <span className="text-white"> OS</span>
            </span>
          </div>

          {/* Client Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-amber-500/50 rounded-md px-3 py-1.5 text-sm text-zinc-300 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
              {currentClient?.label || clientId}
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 ml-1" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-xl z-50 overflow-hidden">
                {CLIENT_IDS.map((id) => (
                  <button
                    key={id}
                    onClick={() => selectClient(id)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#2a2a2a] ${
                      id === clientId
                        ? 'text-amber-500 bg-amber-500/5'
                        : 'text-zinc-300'
                    }`}
                  >
                    {CLIENT_CONFIG[id]?.label || id}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <CreditsWidget clientId={clientId} />
          <div className="border-l border-[#2a2a2a] pl-4">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8 ring-1 ring-amber-500/30',
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-6 max-w-6xl mx-auto w-full">
        {/* Tab nav */}
        <div className="flex gap-1 mb-6 border-b border-[#2a2a2a]">
          {(['chat', 'history'] as TabId[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-amber-500 border-amber-500'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              {tab === 'chat' ? 'Agent Chat' : 'Run History'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'chat' && (
          <DemmChat clientId={clientId} />
        )}
        {activeTab === 'history' && (
          <RunHistory clientId={clientId} />
        )}
      </main>

      {/* Click-outside handler for dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
}
