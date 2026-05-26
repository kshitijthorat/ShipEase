import React, { useState } from "react";
import { ArrowRight, Lock, Mail, User, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Hero_Nav_Bar from "../components/Hero_Nav_Bar";
import { apiRequest } from "../utils/auth";

const roles = [
  { value: "customer", label: "Customer" },
  { value: "driver", label: "Driver" },
  { value: "manager", label: "Manager" },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setMessage(response.message || "Verification OTP sent to your email.");
      navigate("/verify-otp", {
        replace: true,
        state: {
          email: form.email,
          role: form.role,
        },
      });
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
                  "url('/images/landing/hero-logistics.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="relative z-10 max-w-lg text-center">
              <div className="mb-8 inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
                <Truck className="h-12 w-12 text-orange-400" />
              </div>

              <h1 className="mb-6 text-5xl font-bold leading-tight text-white">
                Create your ShipEase account.
              </h1>

              <p className="text-lg leading-8 text-slate-300">
                Register once, verify your email with OTP, and access the right
                dashboard for your role in the logistics workflow.
              </p>
            </div>
          </section>

          <section className="flex min-h-[calc(100vh-9rem)] w-full items-center justify-center bg-white p-6 md:w-1/2 md:p-10 lg:p-16">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <h2 className="mb-2 text-4xl font-bold text-[#0b1c30]">
                  Create an account
                </h2>
                <p className="text-base text-slate-500">
                  Register, verify your email, and continue to your dashboard.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label
                    className="text-sm font-semibold uppercase tracking-[0.05em] text-[#0b1c30]"
                    htmlFor="name"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full rounded-xl bg-slate-100 py-3 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-slate-800/20"
                    />
                  </div>
                </div>

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
                  <label
                    className="text-sm font-semibold uppercase tracking-[0.05em] text-[#0b1c30]"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl bg-slate-100 py-3 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-slate-800/20"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold uppercase tracking-[0.05em] text-[#0b1c30]">
                    Join as
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {roles.map((role) => (
                      <label key={role.value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={form.role === role.value}
                          onChange={handleChange}
                          className="peer hidden"
                        />
                        <div className="rounded-xl border border-slate-200 p-4 text-center text-sm font-medium text-slate-600 transition peer-checked:border-[#fd761a] peer-checked:bg-orange-50 peer-checked:text-[#9d4300] hover:bg-slate-50">
                          {role.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {error ? (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </p>
                ) : null}

                {message ? (
                  <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                    {message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 text-lg font-semibold text-white shadow-[0_0_15px_rgba(253,118,26,0.25)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span>{loading ? "Sending OTP..." : "Create Account"}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?
                </p>
                <Link
                  to="/login"
                  className="mt-3 inline-block font-semibold text-slate-900 transition hover:text-[#fd761a]"
                >
                  Sign in instead
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
