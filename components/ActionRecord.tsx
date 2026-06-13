'use client';

import { CheckCircle, User, Phone, MessageSquare, Zap, Clock } from 'lucide-react';

interface Props {
  raw: string;
}

interface ParsedRecord {
  [key: string]: string;
}

function parseActionRecord(text: string): ParsedRecord | null {
  const start = text.indexOf('---DEMM_ACTION_RECORD---');
  const end = text.indexOf('---END_RECORD---');
  if (start === -1 || end === -1) return null;

  const block = text.slice(start + '---DEMM_ACTION_RECORD---'.length, end).trim();
  const record: ParsedRecord = {};

  for (const line of block.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (key && value) {
      record[key] = value;
    }
  }

  return Object.keys(record).length > 0 ? record : null;
}

const FIELD_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  action: { label: 'Action Taken', icon: CheckCircle },
  contact: { label: 'Contact', icon: User },
  contact_name: { label: 'Contact Name', icon: User },
  phone: { label: 'Phone', icon: Phone },
  message: { label: 'Message Sent', icon: MessageSquare },
  task: { label: 'Task', icon: CheckCircle },
  credits_used: { label: 'Credits Used', icon: Zap },
  timestamp: { label: 'Timestamp', icon: Clock },
  status: { label: 'Status', icon: CheckCircle },
};

export default function ActionRecord({ raw }: Props) {
  const record = parseActionRecord(raw);
  if (!record) return null;

  return (
    <div className="mt-4 border border-amber-500/30 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-amber-500" />
        <span className="text-amber-500 text-xs font-semibold tracking-widest uppercase">
          Action Record
        </span>
      </div>

      {/* Fields */}
      <div className="bg-[#0f0f0f] divide-y divide-[#1e1e1e]">
        {Object.entries(record).map(([key, value]) => {
          const meta = FIELD_META[key.toLowerCase()] || null;
          const Icon = meta?.icon || CheckCircle;
          const label = meta?.label || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <div key={key} className="flex items-start gap-3 px-4 py-3">
              <Icon className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-0.5">
                  {label}
                </div>
                <div className="text-sm text-zinc-200 font-mono leading-relaxed break-words">
                  {value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
