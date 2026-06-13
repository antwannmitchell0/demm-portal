import { NextRequest, NextResponse } from 'next/server';

const VM_BASE = process.env.DEMM_API_URL || 'http://34.138.159.127:8005';
const SECRET = process.env.DEMM_CLIENT_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${VM_BASE}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Secret': SECRET,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ detail: 'VM unreachable' }, { status: 502 });
  }
}
