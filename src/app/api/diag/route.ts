import { NextResponse } from "next/server";
import { publishCmd, getRetainedState } from "@/lib/mqttOnce";

export async function GET() {
  try {
    const state = await getRetainedState(); // proves we can connect + read retained
    return NextResponse.json({ ok: true, via: process.env.MQTT_URL, state });
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      via: process.env.MQTT_URL,
      error: e?.message || String(e),
    }, { status: 500 });
  }
}
