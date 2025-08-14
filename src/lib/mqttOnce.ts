import mqtt, { IClientOptions } from "mqtt";

const WSS_URL = process.env.MQTT_WSS_URL!; // e.g., wss://<host>:8084/mqtt
const USER = process.env.MQTT_USER!;
const PASS = process.env.MQTT_PASS!;
const DEVICE_ID = process.env.MQTT_DEVICE_ID!;

function connectOnce(): Promise<mqtt.MqttClient> {
  const opts: IClientOptions = { username: USER, password: PASS, reconnectPeriod: 0, connectTimeout: 5000 }; // WSS by URL
  return new Promise((res, rej) => {
    const c = mqtt.connect(WSS_URL, opts);
    c.once("connect", () => res(c));
    c.once("error", (e) => { try{c.end(true);}catch{}; rej(e); });
    setTimeout(()=>rej(new Error("timeout")), 7000);
  });
}

export async function publishCmd(topic: string, payload: string) {
  const c = await connectOnce();
  await new Promise<void>((resolve, reject) => c.publish(topic, payload, { qos: 1 }, (e)=> e?reject(e):resolve()));
  c.end(true);
}

export async function getRetainedState(): Promise<any> {
  const c = await connectOnce();
  const topic = `home/${DEVICE_ID}/state`;
  return await new Promise((resolve, reject) => {
    const to = setTimeout(()=>{ try{c.end(true);}catch{}; reject(new Error("no state")); }, 3000);
    c.subscribe(topic, { qos: 1 }, (err) => { if(err){ clearTimeout(to); c.end(true); reject(err); } });
    c.on("message", (t, msg) => { if (t===topic) { clearTimeout(to); const s = JSON.parse(msg.toString()); c.end(true); resolve(s); } });
  });
}