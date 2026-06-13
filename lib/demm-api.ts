const BASE_URL = process.env.NEXT_PUBLIC_DEMM_API_URL || 'http://34.138.159.127:8005';
const CLIENT_SECRET = process.env.DEMM_CLIENT_SECRET || '';

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
  const res = await fetch(`${BASE_URL}/credits/${clientId}`, {
    headers: { 'X-Client-Secret': CLIENT_SECRET },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Credits fetch failed: ${res.status}`);
  return res.json();
}

export async function getRuns(clientId: string): Promise<Run[]> {
  const res = await fetch(`${BASE_URL}/runs/${clientId}`, {
    headers: { 'X-Client-Secret': CLIENT_SECRET },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Runs fetch failed: ${res.status}`);
  const data = await res.json();
  return data.runs || [];
}

export async function runAgent(params: RunAgentParams): Promise<RunAgentResponse> {
  const res = await fetch(`${BASE_URL}/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Secret': CLIENT_SECRET,
    },
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
