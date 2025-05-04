import Hero from "@/components/home/Hero";
import PopularTools from "@/components/home/PopularTools";
import ToolCategories from "@/components/home/ToolCategories";
import ToolDemo from "@/components/home/ToolDemo";
import Features from "@/components/home/Features";
import RecentTools from "@/components/home/RecentTools";
import Newsletter from "@/components/home/Newsletter";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);

    // Set document title
    document.title = "AllTooly - All-in-One Online Tools";
  }, []);

  return (
    <>
      <Hero />
      <PopularTools />
      <ToolCategories />
      {/* <ToolDemo /> */}
      <Features />
      <RecentTools />
      <Newsletter />
    </>
  );
};

export default Home;
