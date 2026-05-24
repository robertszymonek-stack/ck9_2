import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import StickyCTA from "./components/StickyCTA";
import HomePage from "./pages/HomePage";
import ServicePricingPage from "./pages/ServicePricingPage";
import PowerGuidePage from "./pages/PowerGuidePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";

type Route =
  | "home"
  | "service-pricing"
  | "power-guide"
  | "privacy-policy"
  | "terms";

function getRouteFromHash(): Route {
  const hash = window.location.hash || "";
  if (hash.startsWith("#/cennik-uslug")) return "service-pricing";
  if (hash.startsWith("#/poradnik-mocy")) return "power-guide";
  if (hash.startsWith("#/polityka-prywatnosci")) return "privacy-policy";
  if (hash.startsWith("#/regulamin")) return "terms";
  return "home";
}

export default function App() {
  const [route, setRoute] = useState<Route>("home");

  useEffect(() => {
    const updateRoute = () => setRoute(getRouteFromHash());
    updateRoute();
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  useEffect(() => {
    if (route !== "home") return;
    const hash = window.location.hash;
    if (!hash || hash.startsWith("#/")) return;

    window.setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }, [route]);

  return (
    <div className="min-h-screen bg-white pb-16 text-slate-900 lg:pb-0">
      <Nav route={route} />
      {route === "home" && <HomePage />}
      {route === "service-pricing" && <ServicePricingPage />}
      {route === "power-guide" && <PowerGuidePage />}
      {route === "privacy-policy" && <PrivacyPolicyPage />}
      {route === "terms" && <TermsPage />}
      <Footer />
      {route === "home" && <StickyCTA />}
    </div>
  );
}
