// app/page.tsx
import Hero from "@/components/sections/CinematicHero";
import About from "@/components/sections/About";
import Portfolio from "@/components/sections/Portfolio";
import Services from "@/components/sections/Services";
import Packages from "@/components/sections/Packages";
import Contact from "@/components/sections/Contact";
import { StackedSection } from "@/components/ui/StackedSection";

export default function Home() {
  return (
    <>
      <StackedSection index={0}><Hero /></StackedSection>
      <StackedSection index={1}><About /></StackedSection>
      <StackedSection index={2}><Portfolio /></StackedSection>
      <StackedSection index={3}><Services /></StackedSection>
      <StackedSection index={4}><Packages /></StackedSection>
      <Contact />
    </>
  );
}