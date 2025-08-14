// lib/mqttOnce.ts
import mqtt, { IClientOptions, MqttClient } from "mqtt";

const URL = process.env.MQTT_URL!;
const USER = process.env.MQTT_USER!;
const PASS = process.env.MQTT_PASS!;
const DEVICE_ID = process.env.MQTT_DEVICE_ID!;
const INSECURE = process.env.MQTT_INSECURE_TLS === "1";

function connectOnce(): Promise<MqttClient> {
  const opts: IClientOptions = {
    username: USER,
    password: PASS,
    reconnectPeriod: 0,
    connectTimeout: 10_000,
    protocolVersion: 4, // MQTT v3.1.1 (widely supported)
    clean: true,
    resubscribe: false,
  };

  // TLS leniency for testing only
  if (URL.startsWith("wss://")) {
    (opts as any).wsOptions = { rejectUnauthorized: !INSECURE };
  } else if (URL.startsWith("mqtts://")) {
    (opts as any).rejectUnauthorized = !INSECURE;
  }

  return new Promise((resolve, reject) => {
    const c = mqtt.connect(URL, opts);
    const t = setTimeout(() => {
      try { c.end(true); } catch {}
      reject(new Error("MQTT connect timeout (10s)"));
    }, 11_000);

    c.once("connect", () => { clearTimeout(t); resolve(c); });
    c.once("error", (e) => { clearTimeout(t); try { c.end(true); } catch {} ; reject(e); });
  });
}

export async function publishCmd(topic: string, payload: string) {
  const c = await connectOnce();
  await new Promise<void>((resolve, reject) =>
    c.publish(topic, payload, { qos: 1 }, (e) => (e ? reject(e) : resolve()))
  );
  c.end(true);
}

export async function getRetainedState(): Promise<any> {
  const c = await connectOnce();
  const topic = `home/${DEVICE_ID}/state`;
  return await new Promise((resolve, reject) => {
    const to = setTimeout(() => { try { c.end(true); } catch {} ; reject(new Error("No retained state within 3s")); }, 3000);
    c.subscribe(topic, { qos: 1 }, (err) => {
      if (err) { clearTimeout(to); c.end(true); reject(err); }
    });
    c.on("message", (t, msg) => {
      if (t === topic) {
        clearTimeout(to);
        try { resolve(JSON.parse(msg.toString())); }
        catch { resolve({ raw: msg.toString() }); }
        c.end(true);
      }
    });
  });
}
