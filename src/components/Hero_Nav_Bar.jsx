import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Hero_Nav_Bar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 
      ${scrolled
                    ? "bg-white shadow-sm border-b border-gray-200"
                    : "bg-white/70 backdrop-blur-md border-b border-gray-200"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* LOGO */}
                <Link to="/herosection" className="flex items-center gap-3 font-bold text-lg">
                    <img
                        src="/images/screen.svg"
                        alt="ShipEase logo"
                        className="h-10 w-10 rounded-md object-contain"
                    />
                    <span>ShipEase</span>
                </Link>

                {/* LINKS */}
                

                {/* BUTTONS */}
                <div className="flex gap-3">
                    <Link to="/login" className="px-4 py-2 text-sm text-gray-600 hover:text-black">
                        Login
                    </Link>
                    <Link to="/register" className="px-4 py-2 bg-[#004ac6] text-white rounded-lg shadow-sm hover:scale-105 transition">
                        Register
                    </Link>
                </div>

            </div>
        </nav>
    );
}
