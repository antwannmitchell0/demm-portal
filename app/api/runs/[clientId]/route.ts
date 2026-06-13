import { NextRequest, NextResponse } from 'next/server';

const VM_BASE = process.env.DEMM_API_URL || 'http://34.138.159.127:8005';
const SECRET = process.env.DEMM_CLIENT_SECRET || '';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  try {
    const res = await fetch(`${VM_BASE}/runs/${clientId}`, {
      headers: { 'X-Client-Secret': SECRET },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'VM unreachable' }, { status: 502 });
  }
}
