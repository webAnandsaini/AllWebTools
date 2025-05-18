import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";


const Hero = () => {


  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 pb-20 bg-gradient-to-b from-[#f5f7ff] to-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 w-64 h-64 rounded-full bg-blue-50 opacity-70"></div>
        <div className="absolute -left-16 top-1/2 w-96 h-96 rounded-full bg-purple-50 opacity-60"></div>
        <div className="absolute right-0 bottom-0 w-72 h-72 rounded-full bg-green-50 opacity-50"></div>

        {/* Cubes and shapes */}
        <div className="absolute top-16 left-10 w-8 h-8 rounded bg-teal-200 rotate-12 opacity-60"></div>
        <div className="absolute top-20 right-10 w-10 h-10 rounded-xl bg-purple-200 -rotate-12 opacity-60"></div>
        <div className="absolute bottom-16 left-32 w-12 h-12 rounded-full bg-orange-200 opacity-70"></div>
        <div className="absolute bottom-24 right-1/4 w-6 h-6 rounded-sm bg-blue-200 rotate-45 opacity-60"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12 justify-center">
          {/* Text content */}
          <div className="lg:w-4/5 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
              All your <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">design tools</span>
              <br />in one place
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Start growing your business by creating stunning tools for text analysis, design, image editing, SEO, development and much more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a href="#all-categories" className="btn-primary px-8 py-3 text-base rounded-full">Explore Now</a>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 lg:mt-12">
              {/* <div className="flex justify-center lg:justify-start">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i key={i} className="fas fa-star text-yellow-400 text-sm"></i>
                  ))}
                </div>
              </div> */}

              {/* <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <img src="https://via.placeholder.com/80x24" alt="G2 Crowd" className="h-6 opacity-70" />
                <img src="https://via.placeholder.com/80x24" alt="Capterra" className="h-6 opacity-70" />
                <img src="https://via.placeholder.com/80x24" alt="SourceForge" className="h-6 opacity-70" />
              </div> */}

              <div className="mt-10 md:mt-20 pt-8 border-t border-gray-200">
                <p className="text-center text-sm text-gray-500 mb-3">
                  Trusted by <span className="font-semibold">25M+</span> users and <span className="font-semibold">100k+</span> high-end companies
                </p>
                {/* <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mt-4">
                  <img src="https://via.placeholder.com/80x24" alt="Stanford" className="h-6 opacity-60" />
                  <img src="https://via.placeholder.com/80x24" alt="Meta" className="h-6 opacity-60" />
                  <img src="https://via.placeholder.com/80x24" alt="Booking.com" className="h-6 opacity-60" />
                  <img src="https://via.placeholder.com/80x24" alt="Nike" className="h-6 opacity-60" />
                  <img src="https://via.placeholder.com/80x24" alt="Hootsuite" className="h-6 opacity-60" />
                </div> */}
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
};

export default Hero;
