import Hero from "../components/Hero";
import Stats from "../components/Stats";
import AuthorizedBrands from "../components/AuthorizedBrands";
import ProblemsSection from "../components/ProblemsSection";
import PowerSelection from "../components/PowerSelection";
import MidCTA from "../components/MidCTA";
import Packages from "../components/Packages";
import PricingExtras from "../components/PricingExtras";
import Process from "../components/Process";
import Warranty from "../components/Warranty";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";

export default function HomePage() {
  return (
    <main>
      {/* 1. Above the fold — obietnica + CTA */}
      <Hero />
      <Stats />

      {/* 2. Zaufanie — autoryzacja 7 marek */}
      <AuthorizedBrands />

      {/* 3. Problemy klientów — budowanie empatii */}
      <ProblemsSection />

      {/* 4. Dobór mocy — edukacja + pozycjonowanie eksperckie */}
      <PowerSelection />

      {/* 5. CTA pośrednie — złap niezdecydowanych */}
      <MidCTA />

      {/* 6. Modele i ceny — twarde dane */}
      <Packages />
      <PricingExtras />

      {/* 7. Jak to działa — proces krok po kroku */}
      <Process />

      {/* 8. Gwarancje — tabela marek */}
      <Warranty />

      {/* 9. Social proof — opinie tuż przed formularzem */}
      <Testimonials />

      {/* 10. FAQ — ostatnie wątpliwości */}
      <FAQ />

      {/* 11. Formularz — konwersja */}
      <Contact />
    </main>
  );
}
