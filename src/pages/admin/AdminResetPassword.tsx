import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useNoIndex } from "@/hooks/use-no-index";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { KeyRound, Loader2 } from "lucide-react";

const MIN_LENGTH = 12;

const passwordProblem = (pw: string, confirm: string): string | null => {
  if (pw.length < MIN_LENGTH) return `Use at least ${MIN_LENGTH} characters.`;
  if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw) || !/\d/.test(pw)) {
    return "Include upper-case and lower-case letters and a number.";
  }
  if (pw !== confirm) return "The two passwords don't match.";
  return null;
};

/** Landing page for the password-reset email link. */
const AdminResetPassword = () => {
  useNoIndex();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // supabase-js reads the recovery token from the URL and opens a short-lived session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady((prev) => prev ?? !!session);
    });
    const t = window.setTimeout(() => setReady((prev) => prev ?? false), 4000);
    return () => {
      subscription.unsubscribe();
      window.clearTimeout(t);
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = passwordProblem(password, confirm);
    if (problem) {
      toast({ title: "Choose a stronger password", description: problem, variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      toast({ title: "Could not update password", description: error.message, variant: "destructive" });
      return;
    }
    await supabase.auth.signOut();
    toast({ title: "Password updated", description: "Please sign in with your new password." });
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Choose a new password</h1>
              <p className="text-sm text-muted-foreground">Marvel Driving School admin</p>
            </div>
          </div>

          {ready === null ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : ready === false ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">This reset link is invalid or has expired.</p>
              <Button asChild variant="outline"><Link to="/admin/login">Request a new link</Link></Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium mb-2">New password</label>
                <Input id="new-password" type="password" autoComplete="new-password" required minLength={MIN_LENGTH}
                  maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">
                  At least {MIN_LENGTH} characters, with upper- and lower-case letters and a number.
                </p>
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">Confirm password</label>
                <Input id="confirm-password" type="password" autoComplete="new-password" required maxLength={128}
                  value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Saving…" : "Update password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminResetPassword;
