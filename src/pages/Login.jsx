import React, { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Hero_Nav_Bar from "../components/Hero_Nav_Bar";
import { apiRequest, saveAuthSession } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {

  event.preventDefault();

  setLoading(true);

  setError("");

  try {

    const response =
      await apiRequest(
        "/auth/login",
        {
          method: "POST",

          body: JSON.stringify(
            form
          ),
        }
      );

    saveAuthSession({

      token:
        response.data.token,

      user:
        response.data.user,
    });

    const role =
      response.data.user.role;

    if (role === "customer") {

      navigate(
        "/booking",
        {
          replace: true,
        }
      );

    } else if (
      role === "driver"
    ) {

      navigate(
        "/driverhome",
        {
          replace: true,
        }
      );

    } else if (
      role === "manager"
    ) {

      navigate(
        "/mangerdashboard",
        {
          replace: true,
        }
      );

    } else {

      navigate("/", {
        replace: true,
      });
    }

  } catch (err) {

    setError(err.message);

  } finally {

    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <Hero_Nav_Bar />

      <main className="flex min-h-[calc(100vh-9rem)] pt-20">
        <div className="flex w-full flex-col md:flex-row">
          <section className="relative hidden min-h-[calc(100vh-9rem)] w-1/2 overflow-hidden bg-[radial-gradient(circle_at_20%_30%,#1e293b_0%,#0f172a_100%)] md:flex md:items-center md:justify-center md:p-10 lg:p-12">
            <div
              className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{
                backgroundImage:
                  "url('/images/landing/hero-analytics.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="absolute left-[-5rem] top-1/4 h-1 w-96 rotate-45 bg-gradient-to-r from-transparent via-orange-400/40 to-transparent blur-xl" />
            <div className="absolute bottom-1/3 right-[-5rem] h-1 w-96 -rotate-12 bg-gradient-to-r from-transparent via-orange-400/30 to-transparent blur-xl" />

            <div className="relative z-10 max-w-lg text-center">
              <div className="mb-8 inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
                <Truck className="h-12 w-12 text-orange-400" />
              </div>

              <h1 className="mb-6 text-5xl font-bold leading-tight text-white">
                Welcome back to ShipEase.
              </h1>

              <p className="mb-10 text-lg leading-8 text-slate-300">
                Sign in after email verification to access your protected
                role-based dashboard and continue your logistics workflow.
              </p>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <span className="mb-1 block text-2xl font-semibold text-orange-400">
                    Verified
                  </span>
                  <span className="text-sm text-slate-400">
                    Email-gated access
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <span className="mb-1 block text-2xl font-semibold text-orange-400">
                    Role-based
                  </span>
                  <span className="text-sm text-slate-400">
                    Customer, driver, manager
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="flex min-h-[calc(100vh-9rem)] w-full items-center justify-center bg-white p-6 md:w-1/2 md:p-10 lg:p-16">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <h2 className="mb-2 text-4xl font-bold text-[#0b1c30]">
                  Sign in to ShipEase
                </h2>
                <p className="text-base text-slate-500">
                  Access your dashboard and keep your logistics flow moving.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label
                    className="text-sm font-semibold uppercase tracking-[0.05em] text-[#0b1c30]"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@shipease.com"
                      className="w-full rounded-xl bg-slate-100 py-3 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-slate-800/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      className="text-sm font-semibold uppercase tracking-[0.05em] text-[#0b1c30]"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <span className="text-sm font-medium text-[#9d4300]">
                      Verified users only
                    </span>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="********"
                      className="w-full rounded-xl bg-slate-100 py-3 pl-12 pr-12 text-base text-slate-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-slate-800/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-3 text-slate-500">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-[#fd761a] focus:ring-[#fd761a]"
                    />
                    Remember me
                  </label>
                  <span className="text-slate-500">Secure sign in</span>
                </div>

                {error ? (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 text-lg font-semibold text-white shadow-[0_0_15px_rgba(253,118,26,0.25)] transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_0_25px_rgba(253,118,26,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span>{loading ? "Signing In..." : "Sign In"}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>

                <div className="grid gap-3 pt-1 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <ShieldCheck className="mb-2 h-5 w-5 text-[#fd761a]" />
                    <p className="text-sm font-medium text-slate-700">
                      Protected access
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <Zap className="mb-2 h-5 w-5 text-[#fd761a]" />
                    <p className="text-sm font-medium text-slate-700">
                      Faster dispatch
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <Truck className="mb-2 h-5 w-5 text-[#fd761a]" />
                    <p className="text-sm font-medium text-slate-700">
                      Live shipment view
                    </p>
                  </div>
                </div>
              </form>

              <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Don&apos;t have an account?
                </p>
                <Link
                  to="/register"
                  className="mt-3 inline-block font-semibold text-slate-900 transition hover:text-[#fd761a]"
                >
                  Create one now
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-12">
          <div className="text-lg font-bold text-slate-900">ShipEase</div>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="#"
              className="text-sm text-slate-500 transition-colors hover:text-orange-500"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-slate-500 transition-colors hover:text-orange-500"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-slate-500 transition-colors hover:text-orange-500"
            >
              Cookie Policy
            </a>
            <a
              href="#"
              className="text-sm text-slate-500 transition-colors hover:text-orange-500"
            >
              Security
            </a>
          </div>
          <div className="text-sm text-slate-600">
            Copyright 2024 ShipEase Logistics. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
