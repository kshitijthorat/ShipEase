import React, { useMemo, useState } from "react";
import { ArrowRight, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Hero_Nav_Bar from "../components/Hero_Nav_Bar";
import { apiRequest, saveAuthSession } from "../utils/auth";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = useMemo(() => location.state?.email || "", [location.state]);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(
    initialEmail ? `We sent a verification code to ${initialEmail}.` : ""
  );

  const handleVerify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      saveAuthSession({
        token: response.data.token,
        user: response.data.user,
      });

      navigate("/booking", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");

    try {
      const response = await apiRequest("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setMessage(response.message || "A new OTP has been sent.");
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <Hero_Nav_Bar />

      <main className="flex min-h-[calc(100vh-9rem)] items-center justify-center px-6 pt-20">
        <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 md:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-[#fd761a]">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="mb-2 text-4xl font-bold">Verify your email</h1>
            <p className="text-slate-500">
              Enter the 6-digit OTP to activate your ShipEase account and
              continue to your dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleVerify}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold uppercase tracking-[0.05em] text-[#0b1c30]"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl bg-slate-100 py-3 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-slate-800/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="otp"
                className="text-sm font-semibold uppercase tracking-[0.05em] text-[#0b1c30]"
              >
                OTP Code
              </label>
              <input
                id="otp"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit OTP"
                className="w-full rounded-xl bg-slate-100 px-4 py-3 text-center text-2xl tracking-[0.5em] text-slate-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-slate-800/20"
              />
            </div>

            {message ? (
              <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
                {message}
              </p>
            ) : null}

            {error ? (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 text-lg font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{loading ? "Verifying..." : "Verify and Continue"}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || !email}
              className="inline-flex items-center gap-2 font-semibold text-[#9d4300] transition hover:text-[#fd761a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Sending..." : "Resend OTP"}
            </button>

            <Link
              to="/login"
              className="text-sm text-slate-500 transition hover:text-slate-800"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
