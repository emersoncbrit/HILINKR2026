import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingHero from '@/components/landing/LandingHero';
import LandingProblem from '@/components/landing/LandingProblem';
import LandingSolution from '@/components/landing/LandingSolution';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingSteps from '@/components/landing/LandingSteps';
import LandingPositioning from '@/components/landing/LandingPositioning';
import LandingCTA from '@/components/landing/LandingCTA';
import LandingFAQ from '@/components/landing/LandingFAQ';
import LandingFooter from '@/components/landing/LandingFooter';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingNavbar />
      <LandingHero />
      <LandingProblem />
      <LandingSolution />
      <LandingFeatures />
      <LandingSteps />
      <LandingPositioning />
      <LandingCTA />
      <LandingFAQ />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
