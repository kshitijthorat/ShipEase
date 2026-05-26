import React from "react";
import { Link, Navigate } from "react-router-dom";
import { BarChart3, LogOut, MapPinned, ShieldCheck, Truck } from "lucide-react";
import { clearAuthSession, getAuthSession } from "../utils/auth";

const dashboardContent = {
  customer: {
    title: "Customer Dashboard",
    summary: "Create shipment requests, track deliveries, and review proof of delivery in one place.",
    cards: [
      "Book new shipments",
      "Track live status updates",
      "Access proof of delivery",
    ],
  },
  driver: {
    title: "Driver Dashboard",
    summary: "Manage assigned jobs, update shipment status, and stay visible for route operations.",
    cards: [
      "View assigned shipments",
      "Update delivery status",
      "Manage availability and regions",
    ],
  },
  manager: {
    title: "Manager Dashboard",
    summary: "Verify drivers, assign shipments, monitor deliveries, and oversee transport operations securely.",
    cards: [
      "Review shipments",
      "Assign drivers",
      "Monitor overall activity",
    ],
  },
};

export default function Dashboard() {
  const session = getAuthSession();

  if (!session?.user) {
    return <Navigate to="/login" replace />;
  }

  const { user } = session;
  const content = dashboardContent[user.role] || dashboardContent.customer;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/herosection" className="flex items-center gap-3 font-bold text-lg">
            <img
              src="/images/screen.svg"
              alt="ShipEase logo"
              className="h-10 w-10 object-contain"
            />
            <span>ShipEase</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              clearAuthSession();
              window.location.href = "/login";
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_100%)] p-8 text-white shadow-xl">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-blue-200">
            Role-based access
          </p>
          <h1 className="mb-2 text-4xl font-bold">{content.title}</h1>
          <p className="max-w-2xl text-blue-100">{content.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
              Signed in as {user.name}
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
              {user.email}
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm capitalize">
              {user.role}
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <ShieldCheck className="mb-3 h-8 w-8 text-[#fd761a]" />
            <h2 className="mb-2 text-xl font-semibold">Verified Access</h2>
            <p className="text-slate-500">
              Your email is verified and your protected session is active.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Truck className="mb-3 h-8 w-8 text-[#fd761a]" />
            <h2 className="mb-2 text-xl font-semibold">Operations Ready</h2>
            <p className="text-slate-500">{content.cards[0]}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <BarChart3 className="mb-3 h-8 w-8 text-[#fd761a]" />
            <h2 className="mb-2 text-xl font-semibold">Workflow View</h2>
            <p className="text-slate-500">{content.cards[1]}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <MapPinned className="h-6 w-6 text-[#fd761a]" />
            <h2 className="text-2xl font-semibold">What this role can do</h2>
          </div>
          <ul className="space-y-3 text-slate-600">
            {content.cards.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
