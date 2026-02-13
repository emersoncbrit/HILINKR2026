import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { AppLayout } from "@/components/AppLayout";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import Campaigns from "./pages/Campaigns";
import MiniSite from "./pages/MiniSite";
import Sales from "./pages/Sales";
import Hub from "./pages/Hub";
import HubPublic from "./pages/HubPublic";
import AICopy from "./pages/AICopy";
import Tutorial from "./pages/Tutorial";
import VendaMais from "./pages/VendaMais";
import SejaAfiliado from "./pages/SejaAfiliado";
import TemplateStories from "./pages/TemplateStories";
import LinkBio from "./pages/LinkBio";
import LinkBioPublic from "./pages/LinkBioPublic";
import Leads from "./pages/Leads";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/c/:slug" element={<MiniSite />} />
            <Route path="/hub/:slug" element={<HubPublic />} />
            <Route path="/loja/:slug" element={<HubPublic />} />
            <Route path="/bio/:slug" element={<LinkBioPublic />} />
            <Route path="/dashboard" element={<AppLayout><Index /></AppLayout>} />
            <Route path="/products" element={<AppLayout><Products /></AppLayout>} />
            <Route path="/campaigns" element={<AppLayout><Campaigns /></AppLayout>} />
            <Route path="/sales" element={<AppLayout><Sales /></AppLayout>} />
            <Route path="/hub" element={<AppLayout><Hub /></AppLayout>} />
            <Route path="/leads" element={<AppLayout><Leads /></AppLayout>} />
            <Route path="/link-bio" element={<AppLayout><LinkBio /></AppLayout>} />
            <Route path="/ai-copy" element={<AppLayout><AICopy /></AppLayout>} />
            <Route path="/tutorial" element={<AppLayout><Tutorial /></AppLayout>} />
            <Route path="/venda-mais" element={<AppLayout><VendaMais /></AppLayout>} />
            <Route path="/seja-afiliado" element={<AppLayout><SejaAfiliado /></AppLayout>} />
            <Route path="/template-stories" element={<AppLayout><TemplateStories /></AppLayout>} />
            <Route path="/account" element={<AppLayout><Account /></AppLayout>} />
            <Route path="/admin" element={<AppLayout><Admin /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
