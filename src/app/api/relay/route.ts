import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { publishCmd } from "@/lib/mqttOnce";

export async function POST(req: NextRequest){
  const session = await getServerSession();
  if(!session) return NextResponse.json({ error:"unauthorized" }, { status:401 });
  const { ch, on } = await req.json();
  if(ch<1||ch>4|| (on!==0 && on!==1)) return NextResponse.json({ error:"bad params" }, { status:400 });
  const topic = `home/${process.env.MQTT_DEVICE_ID}/cmd/relay/${ch}`;
  await publishCmd(topic, String(on));
  return NextResponse.json({ ok:true });
}