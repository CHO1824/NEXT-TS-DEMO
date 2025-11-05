// app/api/order/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  // 여기서 실제로는 DB 저장/결제 연동 등을 수행
  const orderId = `FB-${Date.now().toString(36).toUpperCase()}`;
  return NextResponse.json({ ok: true, orderId, received: body ?? {} }, { status: 200 });
}