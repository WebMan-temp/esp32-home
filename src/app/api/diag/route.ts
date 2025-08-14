import { NextResponse } from "next/server";
import { getRetainedState } from "@/lib/mqttOnce";

export async function GET() {
  try {
    const state = await getRetainedState(); // proves we can connect + read retained
    return NextResponse.json({ ok: true, via: process.env.MQTT_URL, state });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({
      ok: false,
      via: process.env.MQTT_URL,
      error: errorMessage,
    }, { status: 500 });
  }
}
