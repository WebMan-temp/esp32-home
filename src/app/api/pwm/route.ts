import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { publishCmd } from "@/lib/mqttOnce";

export async function POST(req: NextRequest){
  const session = await getServerSession();
  if(!session) return NextResponse.json({ error:"unauthorized" }, { status:401 });
  const { value } = await req.json();
  const v = Math.max(0, Math.min(255, Number(value)));
  const topic = `home/${process.env.MQTT_DEVICE_ID}/cmd/pwm`;
  await publishCmd(topic, String(v));
  return NextResponse.json({ ok:true });
}