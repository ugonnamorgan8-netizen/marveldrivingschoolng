import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AnalyticsTracker from "./components/AnalyticsTracker";
import { BookingProvider } from "./components/BookingDialog";

const BlogPost = lazy(() => import("./pages/BlogPost"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminEnrollments = lazy(() => import("./pages/admin/AdminEnrollments"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminResetPassword = lazy(() => import("./pages/admin/AdminResetPassword"));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BookingProvider>
      <BrowserRouter>
        <AnalyticsTracker />
        <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminEnrollments />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
      </BookingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
