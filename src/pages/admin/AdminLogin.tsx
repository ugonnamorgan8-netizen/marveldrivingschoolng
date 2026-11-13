import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useNoIndex } from "@/hooks/use-no-index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Lock } from "lucide-react";

const MAX_ATTEMPTS = 5;
const LOCK_MS = 60_000;
const LOCK_KEY = "mds_admin_lock";

/** Client-side throttle on top of Supabase's server-side auth rate limits. */
const readLock = (): { fails: number; until: number } => {
  try {
    return JSON.parse(sessionStorage.getItem(LOCK_KEY) || "") || { fails: 0, until: 0 };
  } catch {
    return { fails: 0, until: 0 };
  }
};
const writeLock = (v: { fails: number; until: number }) => {
  try {
    sessionStorage.setItem(LOCK_KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
};

const AdminLogin = () => {
  useNoIndex();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading, signOut } = useAdminAuth();
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [loading, user, isAdmin, navigate]);

  const lock = readLock();
  const lockedFor = Math.max(0, lock.until - now);
  useEffect(() => {
    if (lockedFor <= 0) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [lockedFor]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedFor > 0) return;
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setSubmitting(false);
    if (error) {
      const fails = readLock().fails + 1;
      const until = fails >= MAX_ATTEMPTS ? Date.now() + LOCK_MS : 0;
      writeLock({ fails: fails >= MAX_ATTEMPTS ? 0 : fails, until });
      setNow(Date.now());
      // Generic message: never reveal whether the email exists.
      toast({ title: "Sign in failed", description: "Invalid email or password.", variant: "destructive" });
      return;
    }
    writeLock({ fails: 0, until: 0 });
    setPassword("");
    toast({ title: "Welcome back", description: "Loading dashboard…" });
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setSubmitting(false);
    // Same response whether or not the account exists.
    toast({
      title: "Check your email",
      description: "If that address belongs to an admin, a reset link is on its way.",
    });
    setMode("signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{mode === "signin" ? "Admin Sign In" : "Reset Password"}</h1>
              <p className="text-sm text-muted-foreground">Marvel Driving School</p>
            </div>
          </div>

          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium mb-2">Email</label>
                <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required autoComplete="username" maxLength={254} />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium mb-2">Password</label>
                <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  required autoComplete="current-password" maxLength={128} />
              </div>
              <Button type="submit" className="w-full" disabled={submitting || lockedFor > 0}>
                {lockedFor > 0
                  ? `Too many attempts — wait ${Math.ceil(lockedFor / 1000)}s`
                  : submitting
                    ? "Signing in…"
                    : "Sign In"}
              </Button>
              <button type="button" onClick={() => setMode("forgot")}
                className="block w-full text-center text-sm text-primary hover:underline font-medium">
                Forgot password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgot} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter your admin email and we'll send you a link to choose a new password.
              </p>
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium mb-2">Email</label>
                <Input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required autoComplete="username" maxLength={254} />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Sending…" : "Send reset link"}
              </Button>
              <button type="button" onClick={() => setMode("signin")}
                className="block w-full text-center text-sm text-primary hover:underline font-medium">
                Back to sign in
              </button>
            </form>
          )}

          {user && !isAdmin && !loading && (
            <div className="mt-4 text-center space-y-2">
              <p className="text-sm text-destructive">This account does not have admin access.</p>
              <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
            </div>
          )}

          <Link to="/" className="mt-6 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to website
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
