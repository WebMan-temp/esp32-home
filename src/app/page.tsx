"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

type State = { relays:number[]; pwm:number; online?:boolean };

export default function Home(){
  const { data: session, status } = useSession();
  const [s, setS] = useState<State>({ relays:[0,0,0,0], pwm:0, online:false });
  const [error, setError] = useState<string>("");
  
  const refresh = async()=>{ 
    try {
      const r = await fetch("/api/state"); 
      if(r.ok) {
        setS(await r.json());
        setError("");
      } else {
        setError("Failed to fetch state");
      }
    } catch {
      setError("Network error");
    }
  };
  
  useEffect(()=>{ 
    if (session) {
      refresh(); 
    }
  },[session]);
  
  const setRelay = async(i:number,on:boolean)=>{
    try {
      await fetch("/api/relay",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({ch:i+1,on:on?1:0})
      }); 
      refresh(); 
    } catch {
      setError("Failed to set relay");
    }
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <main className="min-h-screen p-6 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </main>
    );
  }

  // Show signin prompt if not authenticated
  if (!session) {
    return (
      <main className="min-h-screen p-6 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="mb-4">You need to sign in to access the home control panel.</p>
          <Button onClick={() => window.location.href = "/signin"}>
            Go to Sign In
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Home Control {s.online?"✅":"⛔"}</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
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
      <PWAInstallPrompt />
    </main>
  );
}