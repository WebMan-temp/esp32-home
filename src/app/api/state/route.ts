import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getRetainedState } from "@/lib/mqttOnce";

export async function GET(){
  const session = await getServerSession();
  if(!session) return NextResponse.json({ error:"unauthorized" }, { status:401 });
  try { const s = await getRetainedState(); return NextResponse.json(s); }
  catch { return NextResponse.json({ relays:[0,0,0,0], pwm:0, online:false }); }
}