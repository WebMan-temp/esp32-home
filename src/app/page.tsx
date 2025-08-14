"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type State = { relays:number[]; pwm:number; online?:boolean };

export default function Home(){
  const [s, setS] = useState<State>({ relays:[0,0,0,0], pwm:0, online:false });
  const refresh = async()=>{ const r = await fetch("/api/state"); if(r.ok) setS(await r.json()); };
  useEffect(()=>{ refresh(); },[]);
  const setRelay = async(i:number,on:boolean)=>{ await fetch("/api/relay",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({ch:i+1,on:on?1:0})}); refresh(); };

  return (
    <main className="min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Home Control {s.online?"✅":"⛔"}</h1>
        <Card><CardContent className="pt-6 space-y-3">
          <h2 className="text-lg font-semibold">Relays</h2>
          {s.relays.map((r,i)=> (
            <div key={i} className="flex items-center justify-between">
              <div>Relay {i+1}: <b>{r?"ON":"OFF"}</b></div>
              <div className="flex gap-2">
                <Button variant={r?"default":"secondary"} onClick={()=>setRelay(i,true)}>ON</Button>
                <Button variant={!r?"default":"secondary"} onClick={()=>setRelay(i,false)}>OFF</Button>
              </div>
            </div>
          ))}
        </CardContent></Card>
        {/* <Card><CardContent className="pt-6 space-y-3">
          <h2 className="text-lg font-semibold">PWM (LED Dimmer)</h2>
          <Slider value={[s.pwm]} min={0} max={255} step={1} onValueChange={(v)=>setPwm(v[0])} />
          <div>Value: <b>{s.pwm}</b></div>
        </CardContent></Card> */}
        <Button variant="secondary" onClick={refresh}>Refresh</Button>
      </div>
    </main>
  );
}