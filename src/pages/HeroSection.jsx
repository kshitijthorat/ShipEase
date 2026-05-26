import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero_Nav_Bar from "../components/Hero_Nav_Bar";
import { ContainerTruckCanvas } from "../components/ContainerTruckCanvas";
import { Link } from "react-router-dom";


gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.from(heroRef.current, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      }

      gsap.to(".floating-img", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      if (featuresRef.current) {
        gsap.from(featuresRef.current, {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
          },
          y: 100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      }

      gsap.to(".parallax", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-x-hidden bg-[#faf8ff] font-sans text-[#191b23]">
      <Hero_Nav_Bar />

      <div className="pt-24">
        <section
          ref={heroRef}
          className="relative flex min-h-screen items-center overflow-hidden px-6"
        >
          <div className="absolute inset-0 -z-20">
            <img
              src="/images/landing/hero-logistics.jpg"
              className="parallax h-full w-full object-cover"
              alt="Logistics warehouse operations background"
            />
          </div>

          <div className="absolute inset-0 -z-10 bg-white/85" />

          <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
            <div className="space-y-6">
              <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-medium text-[#004ac6]">
                INTRA-CITY TRANSPORT MANAGEMENT
              </span>

              <h1 className="text-6xl font-bold leading-tight">
                Digitize Local Logistics.
                <br />
                <span className="bg-gradient-to-r from-[#004ac6] to-[#006e2f] bg-clip-text text-transparent">
                  Track Every Shipment.
                </span>
              </h1>

              <p className="max-w-xl text-lg text-[#434655]">
                ShipEase is a web-based transport and logistics management
                system that helps small and medium transport businesses manage
                booking, drivers, tracking, and delivery updates from one
                centralized platform.
              </p>

              <p className="max-w-xl text-base text-[#5d6273]">
                Built for operations across Pune, Mumbai, and Navi Mumbai, it
                replaces manual coordination with a faster and more transparent
                workflow for customers, drivers, and managers.
              </p>

              <div className="flex gap-4">
                <button className="rounded-lg bg-[#004ac6] px-6 py-3 text-white shadow-md transition hover:scale-105">
                  Explore Platform
                </button>

                <button className="rounded-lg border border-gray-300 px-6 py-3 transition hover:bg-gray-50">
                  View Modules
                </button>
              </div>
            </div>

            <div className="relative hidden md:block">
              <img
                src="/images/landing/hero-analytics.jpg"
                className="floating-img ml-auto w-[80%] rounded-2xl shadow-2xl"
                alt="Analytics and logistics planning"
              />

              <img
                src="/images/landing/business-warehouse.jpg"
                className="floating-img absolute bottom-0 left-0 w-[60%] rounded-2xl shadow-2xl"
                alt="Warehouse supply chain operations"
              />
            </div>
          </div>
        </section>

        <div className="relative w-full">
          <ContainerTruckCanvas />
        </div>

        <section ref={featuresRef} className="bg-white py-32 px-6">
          <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
            <img
              src="/images/landing/business-warehouse.jpg"
              className="rounded-2xl shadow-2xl"
              alt="Warehouse team and inventory operations"
            />

            <div className="space-y-6">
              <h2 className="text-5xl font-bold">
                Built for Customers,
                <br />
                <span className="text-[#004ac6]">Drivers, and Managers.</span>
              </h2>

              <p className="text-[#434655]">
                The platform is designed to digitize transport operations,
                simplify shipment booking, improve communication, and provide
                secure role-based access across the full delivery workflow.
              </p>

              <ul className="space-y-3 text-[#434655]">
                <li>
                  Secure login, registration, and role-based access for every
                  user type
                </li>
                <li>
                  Real-time shipment tracking, status updates, notifications,
                  and proof of delivery
                </li>
                <li>
                  Driver profile management, region selection, assignment, and
                  availability handling
                </li>
              </ul>
              <Link to="/login">
              <button className="rounded-lg bg-black px-6 py-3 text-white transition hover:scale-105">
                See How It Works
              </button>
              </Link>
              
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#004ac6] to-[#2563eb] px-6 py-32 text-center text-white">
          <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-5xl font-bold">
              Ready to modernize your transport operations?
            </h2>

            <p className="text-lg text-blue-100">
              Replace manual coordination with a centralized logistics system
              for booking, tracking, communication, and delivery management.
            </p>

            <Link to="/register">
              <button className="rounded-xl bg-green-400 px-8 py-4 text-black transition hover:scale-105">
                Get Started with ShipEase
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
