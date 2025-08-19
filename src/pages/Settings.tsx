import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function updateEmail() {
    setLoading(true);
    setMsg(null);
    setErr(null);
    const { error } = await supabase.auth.updateUser({ email });
    if (error) setErr(error.message);
    else setMsg("Email update requested. Check your inbox to confirm.");
    setLoading(false);
  }

  async function updatePassword() {
    setLoading(true);
    setMsg(null);
    setErr(null);
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) setErr(error.message);
    else setMsg("Password updated.");
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">Settings</h1>
      <GlassCard variant="hover" className="p-6 space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Update Email</label>
          <div className="flex gap-2 mt-1">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="new@email.com" />
            <Button onClick={updateEmail} disabled={loading || !email}>Update</Button>
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Update Password</label>
          <div className="flex gap-2 mt-1">
            <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" />
            <Button onClick={updatePassword} disabled={loading || !pw}>Update</Button>
          </div>
        </div>
        {msg && <div className="text-success">{msg}</div>}
        {err && <div className="text-destructive">{err}</div>}
      </GlassCard>
    </div>
  );
}
