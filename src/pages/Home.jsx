import AboutUsSection from "../components/Home/AboutUsSection";
import ContactUsSection from "../components/Home/ContactUsSection";
import Footer from "../components/Home/Footer";
import HeroSection from "../components/Home/HeroSection";
import ServicesOverview from "../components/Home/ServicesOverview";

function Home() {
  return (
    <>
      <HeroSection />
      <ServicesOverview />
      <AboutUsSection />
      <ContactUsSection />
      <Footer />
    </>
  );
}

export default Home;
