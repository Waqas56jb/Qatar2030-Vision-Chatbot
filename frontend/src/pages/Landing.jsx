import { Link } from 'react-router-dom'
import HeroSection from '../components/landing/HeroSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import AboutSection from '../components/landing/AboutSection'
import VisionPillarsSection from '../components/landing/VisionPillarsSection'
import StrategiesSection from '../components/landing/StrategiesSection'
import StatisticsSection from '../components/landing/StatisticsSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import FAQSection from '../components/landing/FAQSection'
import CTASection from '../components/landing/CTASection'

const Landing = () => {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <VisionPillarsSection />
      <StrategiesSection />
      <StatisticsSection />
      <HowItWorksSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}

export default Landing
