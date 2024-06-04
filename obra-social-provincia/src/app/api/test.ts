import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log("test route");
  return NextResponse.json({ message: "test route" });
}