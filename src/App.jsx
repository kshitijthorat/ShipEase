import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import HeroSection from "./pages/HeroSection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import BookingPage from "./pages/BookingPage";
import BookingDetails from "./pages/BookingDetailsPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import MyBookingsDashboard from "./pages/MyBookingsDashboard";
import DriverHomePage from "./pages/DriverHomePage";
import DriverDashboard from "./pages/DriverDashboard";
import BookingDetailsUser from "./pages/BookingDetailsUser";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerBookingDetails from "./pages/ManagerBookingDetails";
import RegisterDriver from "./pages/RegisterDriver";
import DriverShipments from "./pages/DriverShipments";
import ManagerReports from "./pages/ManagerReports";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/herosection" replace />} />
        <Route path="/herosection" element={<HeroSection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/booking-details" element={<BookingDetailsPage />} />
          <Route path="/mybookingsdashboard" element={<MyBookingsDashboard />} />
          <Route path="/driverhome" element={<DriverHomePage />} />
          <Route path="/driverdashboard" element={<DriverDashboard />} />
          <Route path="/bookingdetailsuser/:id" element={<BookingDetailsUser />} />
          <Route path="/mangerdashboard" element={<ManagerDashboard />} />
          <Route path="/manager/booking/:id" element={<ManagerBookingDetails />} />
          <Route path="/manager/register-driver" element={<RegisterDriver />} />
          <Route path="/driver/shipments" element={<DriverShipments />} />
          <Route path="/manager/reports" element={<ManagerReports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
