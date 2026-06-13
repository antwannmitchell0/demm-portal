// All API calls route through /api/* proxy routes (server-side → VM).
// Browser never touches the GCP VM directly — no CORS or mixed-content issues.

export interface CreditsResponse {
  client_id: string;
  balance: number;
}

export interface Run {
  run_id: string;
  timestamp: string;
  task: string;
  credits_used: number;
  status: string;
}

export interface RunAgentParams {
  client_id: string;
  ghl_location_id: string;
  task: string;
  contact_name?: string;
  contact_phone?: string;
  outreach_reason?: string;
  memory?: boolean;
}

export interface RunAgentResponse {
  response: string;
  credits_remaining: number;
  run_id: string;
}

export async function getCredits(clientId: string): Promise<CreditsResponse> {
  const res = await fetch(`/api/credits/${clientId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Credits fetch failed: ${res.status}`);
  return res.json();
}

export async function getRuns(clientId: string): Promise<Run[]> {
  const res = await fetch(`/api/runs/${clientId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Runs fetch failed: ${res.status}`);
  const data = await res.json();
  return data.runs || [];
}

export async function runAgent(params: RunAgentParams): Promise<RunAgentResponse> {
  const res = await fetch('/api/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || `Agent run failed: ${res.status}`);
  }
  return res.json();
}

export const CLIENT_CONFIG: Record<string, { label: string; ghl_location_id: string }> = {
  greater_begreat: {
    label: 'GREATER (BeGreat)',
    ghl_location_id: '2UNuEJ0AYFnEBAjznEmh',
  },
  softer_app: {
    label: 'SOFTER',
    ghl_location_id: 'S2bMtQM1kqU8tPl1MCoF',
  },
};
