import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Inbox, FileText, Image as ImageIcon, MessageSquareQuote, Settings, LogOut, Loader2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/admin", label: "Enrollments", icon: Inbox, end: true },
  { to: "/admin/blog", label: "Blog Posts", icon: FileText },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login", { replace: true });
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border">
        <div className="p-6 border-b border-border">
          <Link to="/" className="block">
            <span className="text-lg font-bold text-foreground">Marvel Admin</span>
            <p className="text-xs text-muted-foreground mt-0.5">Marvel Driving School</p>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border space-y-2">
          <p className="text-xs text-muted-foreground px-2 truncate">{user.email}</p>
          <Button variant="outline" size="sm" className="w-full" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/admin" className="font-bold">Marvel Admin</Link>
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      <main className="flex-1 md:ml-0 pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto" key={location.pathname}>
          <Outlet />
        </div>
        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border grid grid-cols-4 z-40">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2.5 text-xs gap-1 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="md:hidden h-16" />
      </main>
    </div>
  );
};

export default AdminLayout;