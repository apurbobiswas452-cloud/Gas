"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

// ─── Intersection Observer Hook ───────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Fade-in Section Wrapper ──────────────────────────────────────────────────
function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={`transition-all duration-700 ease-out ${className} ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const services = [
  { 
    id: "engine-diagnostics",
    title: "Engine Diagnostics", 
    description: "Dealership-grade electronic diagnostic scans and engine calibration to pinpoint anomalies and restore peak performance.",
    details: "Using state-of-the-art diagnostic computers, we read factory fault codes, check live engine sensor outputs, calibrate electronic controls, and ensure your vehicle runs with factory-certified precision.",
    icon: (
      <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25zM9 9.75l2.25 2.25L15 8.25" />
      </svg>
    )
  },
  { 
    id: "general-repair",
    title: "General Repair", 
    description: "Complete vehicle repairs from suspension and steering overhaul to drive-shaft and electrical systems maintenance.",
    details: "No repair is too complex. Our senior mechanics handle complex system overhauls, cooling system restorations, oil leak remedies, and mechanical maintenance using OEM parts.",
    icon: (
      <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 1113.5 17.25l-1.83-1.83m0 0l-7.07-7.07A4.24 4.24 0 1110.6 2.5l7.07 7.07m-6.25 5.6l-5.6-5.6" />
      </svg>
    )
  },
  { 
    id: "scheduled-maintenance",
    title: "Scheduled Maintenance", 
    description: "Interval services matching manufacturer specs, including synthetic fluid flushes, filters, spark plugs, and multipoint inspections.",
    details: "Stay ahead of breakdowns with tailored schedules. We manage oil changes, spark plug replacements, air filter flushes, and perform absolute 50-point system inspections.",
    icon: (
      <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    )
  },
  { 
    id: "precision-detailing",
    title: "Precision Detailing", 
    description: "Premium exterior paint correction, nano-ceramic coating, leather hydration, and high-gloss interior polishing.",
    details: "Transform your vehicle's aesthetic. We offer multi-stage paint correction, top-tier ceramic coatings for scratch/UV protection, and exhaustive interior deep cleaning.",
    icon: (
      <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l5.096-.813a2 2 0 001.077-.543l5.244-5.244a2 2 0 000-2.828l-2.828-2.828a2 2 0 00-2.828 0l-5.244 5.244a2 2 0 00-.543 1.077zM3 3l7.5 7.5M21 3l-7.5 7.5M3 21l7.5-7.5" />
      </svg>
    )
  },
  { 
    id: "ac-service",
    title: "AC Diagnostics & Repair", 
    description: "Refrigerant recharge, leak detection, compressor maintenance, and cabin climate comfort optimization.",
    details: "Ensure reliable cabin cooling. We carry out precision leak diagnostics using modern dye detection, recover/recharge coolant to spec, and refresh blowers.",
    icon: (
      <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M12 12l6.36-6.36M12 12l-6.36 6.36M12 12L5.64 5.64M12 12l6.36 6.36" />
      </svg>
    )
  },
  { 
    id: "brake-repair",
    title: "Advanced Brake System", 
    description: "Brake pad, rotor and caliper replacement, master cylinder diagnostics, and performance brake fluid flushes.",
    details: "Your safety is our top priority. We inspect friction surfaces, machine rotors to remove scoring, fit premium low-dust pads, and carry out air-purges on brake lines.",
    icon: (
      <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    )
  },
  { 
    id: "tire-replacement",
    title: "Performance Tires", 
    description: "High-end tire fitting, digital wheel balancing, and precise geometry alignment for optimal handling.",
    details: "Maximize grip and longevity. We align steering angles, balance assemblies with high-spec machines, and recommend high-performance tires suitable for your car.",
    icon: (
      <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <path strokeLinecap="round" d="M12 3v6M12 15v6M3 12h6M15 12h6" />
      </svg>
    )
  },
  { 
    id: "car-painting",
    title: "Custom Painting & Restoration", 
    description: "Premium computer-matched paint finishes, scratch removal, and factory-level gloss restoration inside sterile spray booths.",
    details: "Restore or redesign your car's exterior paintwork. We use elite multi-layered painting techniques, premium clear coats, and sterile heating environments to achieve a mirror finish.",
    icon: (
      <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122l9.39-9.39a1.5 1.5 0 112.122 2.122l-9.39 9.39a1.5 1.5 0 11-2.122-2.122zM9.53 16.122a3 3 0 10-4.242 4.242 3 3 0 004.242-4.242z" />
      </svg>
    )
  },
];

const highlights = [
  { title: "Elite Technicians", desc: "Certified automotive engineers trained to handle high-end European and luxury brands." },
  { title: "Modern Diagnostics", desc: "Equipped with diagnostic hardware capable of reading full module graphs." },
  { title: "Guaranteed Performance", desc: "Every service is backed by our guarantee of reliability and premium quality." },
  { title: "Sincere Transparency", desc: "No hidden charges. Clear work estimates and digital logs shared before any repair." },
];

const galleryImages = [
  { id: 0, src: "/gallery-engine.png", title: "Piston & Calibration Studio", category: "Engine Work" },
  { id: 1, src: "/gallery-detailing.png", title: "Multistage Paint Correction", category: "Detailing" },
  { id: 2, src: "/gallery-diagnostic.png", title: "ECU Tuning & Scan Centre", category: "Diagnostics" },
  { id: 3, src: "/gallery-painting.png", title: "Sterile Custom Paint Booth", category: "Painting" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", phone: "", email: "", model: "", service: "engine-diagnostics", message: "" });
  const [errors, setErrors] = useState({ name: false, phone: false, email: false, model: false });
  const [scrolled, setScrolled] = useState(false);

  // Admin states
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  // Scroll detection for navbar opacity change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu or lightbox is open
  useEffect(() => {
    const shouldLock = mobileMenuOpen || lightboxIndex !== null || showAdminModal;
    document.body.style.overflow = shouldLock ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen, lightboxIndex, showAdminModal]);

  const fetchBookings = () => {
    setAdminLoading(true);
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => { setBookingsList(data); setAdminLoading(false); })
      .catch((err) => { console.error(err); setAdminLoading(false); });
  };

  const deleteBooking = (id?: string) => {
    if (!id && !confirm("Are you sure you want to delete all bookings?")) return;
    const url = id ? `/api/bookings?id=${id}` : "/api/bookings";
    fetch(url, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchBookings())
      .catch((err) => console.error(err));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasName = formValues.name.trim() !== "";
    const hasPhone = formValues.phone.trim() !== "";
    const hasEmail = formValues.email.trim() !== "" && formValues.email.includes("@");
    const hasModel = formValues.model.trim() !== "";

    if (!hasName || !hasPhone || !hasEmail || !hasModel) {
      setErrors({ name: !hasName, phone: !hasPhone, email: !hasEmail, model: !hasModel });
      return;
    }

    setBookingLoading(true);

    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formValues.name,
        phone: formValues.phone,
        email: formValues.email,
        model: formValues.model,
        service: formValues.service,
        message: formValues.message,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setBookingLoading(false);
        setBookingSubmitted(true);

        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

        const isConfigured =
          serviceId && serviceId !== "your_service_id_here" &&
          templateId && templateId !== "your_template_id_here" &&
          publicKey && publicKey !== "your_public_key_here";

        if (isConfigured) {
          const templateParams = {
            to_email: process.env.NEXT_PUBLIC_RECEIVER_EMAIL || "aditayadasd@gmail.com",
            from_name: formValues.name,
            from_phone: formValues.phone,
            from_email: formValues.email,
            vehicle_model: formValues.model,
            service_type: formValues.service,
            message: formValues.message,
          };
          emailjs.send(serviceId, templateId, templateParams, publicKey).catch(console.error);
        }
      })
      .catch((error) => {
        console.error("Inquiry error:", error);
        setBookingLoading(false);
        setBookingSubmitted(true);
      });
  };

  const handleLightboxNav = (direction: "prev" | "next") => {
    if (lightboxIndex === null) return;
    if (direction === "prev") {
      setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : galleryImages.length - 1));
    } else {
      setLightboxIndex((prev) => (prev !== null && prev < galleryImages.length - 1 ? prev + 1 : 0));
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft") handleLightboxNav("prev");
      if (e.key === "ArrowRight") handleLightboxNav("next");
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex]);

  return (
    <main className="min-h-screen bg-darkest text-slate-100 selection:bg-blue-500/30 selection:text-white">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${scrolled ? "bg-darkest/90 backdrop-blur-xl border-white/8 shadow-glass" : "bg-transparent border-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand */}
          <a href="#" className="flex items-center gap-2 group min-w-0 flex-shrink" id="nav-brand">
            <span className="text-base sm:text-xl lg:text-2xl font-black tracking-widest text-gradient-metallic bg-clip-text truncate">
              GRAND AUTO
            </span>
            <span className="hidden sm:inline text-base sm:text-xl lg:text-2xl font-black tracking-widest text-gradient-metallic">
              SERVICES
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-full flex-shrink-0">
              GAS
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {["About", "Services", "Why Us", "Gallery", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors whitespace-nowrap"
                id={`link-${item.toLowerCase().replace(" ", "-")}`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:01751777777" className="px-4 py-2 text-xs font-semibold tracking-wider text-slate-300 hover:text-white bg-slate-900 border border-white/10 hover:border-blue-500/50 rounded-full transition-all duration-300" id="btn-call-header">
              01751-777777
            </a>
            <a href="#contact" className="px-4 py-2 text-xs font-semibold tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all duration-300 shadow-neon" id="btn-book-header">
              Book Now
            </a>
          </div>

          {/* Mobile: call + hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <a href="tel:01751777777" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-400 bg-blue-600/10 border border-blue-500/20 rounded-full" id="mobile-call-btn">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Call</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle Navigation"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-darkest/98 backdrop-blur-2xl border-t border-white/5"
            >
              <div className="px-6 pt-6 pb-8 flex flex-col gap-5">
                {[
                  { label: "About", href: "#about" },
                  { label: "Services", href: "#services" },
                  { label: "Why Choose Us", href: "#why-choose-us" },
                  { label: "Gallery", href: "#gallery" },
                  { label: "Contact", href: "#contact" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-base font-semibold text-slate-300 hover:text-white border-b border-white/5 pb-5 transition-colors"
                  >
                    {link.label}
                    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 w-full text-center py-3.5 text-sm font-bold tracking-wider text-white bg-blue-600 rounded-2xl shadow-neon"
                  id="mobile-btn-book"
                >
                  Book an Appointment
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-darkest pt-16 sm:pt-20" id="hero">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-darkest via-darkest/85 to-darkest/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-darkest via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-blue-900/10 mix-blend-color z-10" />
          <img
            src="/hero-car.png"
            alt="Luxury Car Workshop"
            className="w-full h-full object-cover object-center opacity-40 scale-105 animate-pulse-slow"
          />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-600/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-indigo-600/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-950/20 backdrop-blur-md text-[10px] sm:text-xs font-semibold tracking-widest text-blue-400 uppercase mb-6 sm:mb-8 shadow-glassGlow">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping flex-shrink-0" />
                Chattogram's Premier Automotive Atelier
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="text-4xl xs:text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-none mb-6 sm:mb-8 text-gradient-metallic"
            >
              GRAND AUTO <br />
              <span className="text-gradient-blue">SERVICES</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="text-base sm:text-lg xl:text-xl text-slate-400 max-w-2xl leading-relaxed mb-8 sm:mb-12"
            >
              Chattogram's most trusted automotive repair and service center. Elite dealership craftsmanship, clinical mechanics, and state-of-the-art diagnostics for ultimate road confidence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="flex flex-col xs:flex-row gap-4 items-stretch xs:items-center"
            >
              <a
                href="#contact"
                className="px-6 sm:px-8 py-4 text-center text-sm font-bold tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all duration-300 shadow-neon hover:shadow-neonStrong hover:-translate-y-0.5"
                id="hero-btn-book"
              >
                Schedule Premium Service
              </a>
              <a
                href="tel:01751777777"
                className="px-6 sm:px-8 py-4 text-center text-sm font-bold tracking-wider text-slate-200 hover:text-white bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-slate-300/30 rounded-full transition-all duration-300 backdrop-blur hover:-translate-y-0.5"
                id="hero-btn-call"
              >
                Call 01751-777777
              </a>
            </motion.div>

            {/* Stats Strip */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-md"
            >
              {[
                { value: "15+", label: "Years" },
                { value: "5K+", label: "Cars Serviced" },
                { value: "98%", label: "Retention Rate" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-blue-400">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Scroll</span>
          <div className="w-[1.5px] h-8 sm:h-10 bg-gradient-to-b from-blue-500 to-transparent relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-3 bg-white animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-32 relative bg-darkest overflow-hidden border-t border-white/5" id="about">
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Info */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <FadeInSection>
                <span className="text-xs font-bold tracking-[0.4em] text-blue-500 uppercase">THE GAS BENCHMARK</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mt-3">
                  One-Stop Premium Car Care in Chattogram
                </h2>
                <p className="text-slate-400 text-base sm:text-lg leading-relaxed mt-4">
                  Grand Auto Services (GAS) is built to deliver dealership-level capabilities with independent, personalized care. We handle high-performance engines, premium cabin climate systems, absolute frame alignments, and flawless detail works.
                </p>
              </FadeInSection>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Certified Mechanics", desc: "Specialists trained to understand complex European and luxury automotive modules." },
                  { title: "Precision Diagnostics", desc: "Cutting-edge scanners that identify system anomalies immediately." },
                  { title: "Original Spares", desc: "Strict adherence to OEM guidelines, utilizing authentic factory parts." },
                  { title: "Guaranteed Satisfaction", desc: "Transparent operations, visual diagnostics, and comprehensive service guarantees." },
                ].map((item, i) => (
                  <FadeInSection key={item.title} delay={i * 80}>
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all duration-300 h-full">
                      <h4 className="font-bold text-white text-sm sm:text-base mb-2">{item.title}</h4>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </FadeInSection>
                ))}
              </div>
            </div>

            {/* Stats Board */}
            <div className="lg:col-span-5">
              <FadeInSection delay={150}>
                <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950 p-6 sm:p-8 shadow-glass overflow-hidden">
                  <div className="absolute inset-0 bg-radialGlow pointer-events-none" />

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-6 relative z-10 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Workshop Metrics
                  </h3>

                  <div className="space-y-5 sm:space-y-8 relative z-10">
                    {[
                      { label: "Experience In Luxury", value: "15+ Years" },
                      { label: "Cars Serviced", value: "5,000+" },
                      { label: "Certified Diagnostics", value: "100% Exact" },
                      { label: "Client Retainer Rate", value: "98%" },
                    ].map((metric, i) => (
                      <div key={metric.label} className={`flex justify-between items-center ${i < 3 ? "pb-4 sm:pb-5 border-b border-white/5" : ""}`}>
                        <span className="text-xs sm:text-sm text-slate-400">{metric.label}</span>
                        <span className="text-2xl sm:text-3xl font-black text-blue-400">{metric.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-blue-400 leading-relaxed relative z-10">
                    <strong>Did you know?</strong> We operate with specialized lifts and computerized systems engineered specifically for sports, prestige, and heavy utility SUVs.
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-32 bg-darkest/90 relative border-t border-white/5" id="services">
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeInSection>
            <div className="max-w-3xl mb-14 sm:mb-20">
              <span className="text-xs font-bold tracking-[0.4em] text-blue-500 uppercase">PROFESSIONAL AUTOMOTIVE SUITE</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mt-4 mb-4 sm:mb-6">
                Complete Services Engineered with Precision
              </h2>
              <p className="text-slate-400 text-sm sm:text-base lg:text-lg">
                We deploy advanced technical solutions to service, repair, and maintain luxury and premium passenger vehicles. Tap any card to view full scope details.
              </p>
            </div>
          </FadeInSection>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const isOpen = activeService === index;
              return (
                <motion.article
                  key={service.id}
                  layout
                  onClick={() => setActiveService(isOpen ? null : index)}
                  className={`group cursor-pointer rounded-2xl sm:rounded-3xl border border-white/5 p-5 sm:p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    isOpen
                      ? "bg-slate-900 border-blue-500/50 shadow-glassGlow sm:col-span-2"
                      : "bg-white/5 hover:bg-white/10 hover:border-white/20"
                  }`}
                  id={`service-card-${service.id}`}
                >
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div>
                    <div className="mb-4 sm:mb-6 inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-slate-950 border border-white/5 text-blue-400 shadow-neon">
                      {service.icon}
                    </div>

                    <h3 className="text-base sm:text-xl font-bold text-white tracking-tight mb-2 sm:mb-3">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-3 sm:mb-4">
                      {service.description}
                    </p>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-slate-300 border-t border-white/10 pt-4 mt-2 leading-relaxed space-y-2"
                        >
                          <p className="font-semibold text-blue-400">Includes:</p>
                          <p>{service.details}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-4 sm:mt-6 flex items-center justify-between text-xs font-bold text-blue-400 uppercase tracking-widest pt-2">
                    <span>{isOpen ? "Close Scope" : "View Details"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-90 text-white" : "group-hover:translate-x-1"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ──────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-32 bg-darkest relative border-t border-white/5" id="why-choose-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div className="lg:col-span-5 space-y-5 sm:space-y-6">
              <FadeInSection>
                <span className="text-xs font-bold tracking-[0.4em] text-blue-500 uppercase">WHY CHOOSE GAS</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mt-3">
                  Engineering trust at every diagnostic layer
                </h2>
                <p className="text-slate-400 text-base sm:text-lg leading-relaxed mt-4">
                  We bridge the gap between expensive dealership franchises and local garages. Our clients trust us for complete clarity, advanced facilities, and robust mechanical work.
                </p>

                <div className="mt-6 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-blue-600/5 border border-blue-500/10 flex items-start gap-4">
                  <span className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-blue-600/10 text-blue-400 flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">Unmatched Local Integrity</h4>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">Based in Chattogram, we are the go-to automotive repair and detailing atelier for car collectors and daily drivers.</p>
                  </div>
                </div>
              </FadeInSection>
            </div>

            {/* Right grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {highlights.map((item, idx) => (
                <FadeInSection key={idx} delay={idx * 80}>
                  <div className="p-6 sm:p-8 rounded-2xl sm:rounded-[32px] border border-white/5 bg-white/5 hover:bg-slate-900 hover:border-blue-500/20 transition-all duration-300 h-full">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-3 sm:mb-4">0{idx + 1} //</span>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-32 bg-darkest/90 relative border-t border-white/5" id="gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeInSection>
            <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
              <span className="text-xs font-bold tracking-[0.4em] text-blue-500 uppercase">INSIDE THE ATELIER</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mt-4 mb-4 sm:mb-6">
                Showcase of Quality & Precision
              </h2>
              <p className="text-slate-400 text-sm sm:text-base lg:text-lg">
                Explore static frames capturing diagnostics, detailing layers, engine calibrations, and painting booth projects in our facility.
              </p>
            </div>
          </FadeInSection>

          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((image, idx) => (
              <FadeInSection key={image.id} delay={idx * 60}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/5 bg-slate-950 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full"
                  id={`gallery-item-${image.id}`}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-darkest via-transparent to-transparent opacity-80 z-10" />
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3 sm:p-6 relative z-20">
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-blue-400 uppercase">{image.category}</span>
                    <h3 className="text-xs sm:text-base font-bold text-white mt-1 group-hover:text-blue-300 transition-colors leading-tight">{image.title}</h3>
                  </div>
                </motion.button>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/97 backdrop-blur-md p-4"
            onClick={() => setLightboxIndex(null)}
            id="lightbox-modal"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-3 text-slate-400 hover:text-white rounded-full bg-white/5 border border-white/10 z-10"
              aria-label="Close lightbox"
              id="lightbox-close"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleLightboxNav("prev"); }}
              className="absolute left-2 sm:left-6 p-2.5 sm:p-3 text-slate-400 hover:text-white rounded-full bg-white/5 border border-white/10 z-10"
              aria-label="Previous image"
              id="lightbox-prev"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div
              className="max-w-5xl w-full flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={galleryImages[lightboxIndex].src}
                alt={galleryImages[lightboxIndex].title}
                className="max-h-[65vh] sm:max-h-[70vh] w-auto object-contain rounded-xl sm:rounded-2xl border border-white/10 shadow-neonStrong"
              />
              <div className="text-center space-y-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-blue-400 uppercase">{galleryImages[lightboxIndex].category}</span>
                <h3 className="text-base sm:text-xl font-bold text-white">{galleryImages[lightboxIndex].title}</h3>
                <p className="text-xs text-slate-400">Image {lightboxIndex + 1} of {galleryImages.length}</p>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); handleLightboxNav("next"); }}
              className="absolute right-2 sm:right-6 p-2.5 sm:p-3 text-slate-400 hover:text-white rounded-full bg-white/5 border border-white/10 z-10"
              aria-label="Next image"
              id="lightbox-next"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Contact & Booking ──────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-32 bg-darkest relative border-t border-white/5" id="contact">
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              <FadeInSection>
                <span className="text-xs font-bold tracking-[0.4em] text-blue-500 uppercase">REACH OUR GARAGE</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mt-3">
                  Connect for Elite Solutions
                </h2>
              </FadeInSection>

              <FadeInSection delay={80}>
                <div className="space-y-3 sm:space-y-4">
                  <a
                    href="tel:01751777777"
                    className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 bg-white/5 hover:border-blue-500/30 transition-all duration-300"
                    id="contact-phone-card"
                  >
                    <span className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-600/10 text-blue-400 flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold">Direct Telephone</span>
                      <span className="block text-lg sm:text-xl font-bold text-white mt-1 hover:text-blue-400 transition-colors">01751-777777</span>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/8801751777777"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 bg-white/5 hover:border-green-500/30 transition-all duration-300"
                    id="contact-whatsapp-card"
                  >
                    <span className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-green-600/10 text-green-400 flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold">WhatsApp</span>
                      <span className="block text-lg sm:text-xl font-bold text-white mt-1 hover:text-green-400 transition-colors">Chat with Us</span>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 bg-white/5">
                    <span className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-600/10 text-blue-400 flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold">Workshop Location</span>
                      <span className="block text-lg sm:text-xl font-bold text-white mt-1">Chattogram, Bangladesh</span>
                    </div>
                  </div>
                </div>
              </FadeInSection>

              {/* HUD Map */}
              <FadeInSection delay={160}>
                <div className="rounded-2xl sm:rounded-[32px] border border-white/10 bg-slate-950 p-4 sm:p-6 relative overflow-hidden shadow-glass" id="contact-map-hud">
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-blue-600/15 border border-blue-500/20 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                    <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">GPS Active</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mb-3 sm:mb-4">
                    <span>LOC: 22.3569°N / 91.7832°E</span>
                    <span>SYS: ONLINE</span>
                  </div>

                  <div className="relative h-36 sm:h-48 rounded-xl sm:rounded-2xl bg-darkest border border-white/5 flex items-center justify-center overflow-hidden">
                    <div className="absolute w-[180px] sm:w-[200px] h-[180px] sm:h-[200px] border border-blue-500/5 rounded-full" />
                    <div className="absolute w-[120px] sm:w-[140px] h-[120px] sm:h-[140px] border border-blue-500/10 rounded-full" />
                    <div className="absolute w-[60px] sm:w-[80px] h-[60px] sm:h-[80px] border border-blue-500/20 rounded-full" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:16px_16px]" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent origin-center animate-spin" style={{ animationDuration: "8s" }} />
                    <div className="absolute flex flex-col items-center">
                      <span className="relative flex h-3 w-3 sm:h-4 sm:w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 sm:h-4 sm:w-4 bg-blue-500 border-2 border-white shadow-neon" />
                      </span>
                      <span className="mt-2 text-[9px] font-extrabold tracking-widest text-white uppercase bg-slate-950 px-2 py-0.5 border border-white/10 rounded-md shadow-glass">
                        GAS HQ
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 text-[10px] font-mono text-slate-400 flex justify-between items-center">
                    <span>SECTOR: CHATTOGRAM CITY</span>
                    <span>SIGNAL: STABLE</span>
                  </div>
                </div>
              </FadeInSection>
            </div>

            {/* Booking Form */}
            <FadeInSection delay={80} className="lg:col-span-7">
              <div className="rounded-2xl sm:rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-950/80 p-6 sm:p-8 lg:p-10 shadow-glass relative" id="contact-booking-form">
                <div className="absolute inset-0 bg-radialGlow pointer-events-none rounded-2xl sm:rounded-[2rem]" />

                <span className="text-xs font-bold tracking-[0.4em] text-blue-500 uppercase relative z-10">BOOK AN APPOINTMENT</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 mb-6 sm:mb-8 relative z-10">Send a Service Inquiry</h3>

                {bookingSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 sm:py-16 text-center space-y-4 sm:space-y-6 relative z-10"
                  >
                    <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-neon">
                      <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl sm:text-2xl font-bold text-white">Inquiry Received!</h4>
                      <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed px-4">
                        Thank you, <strong className="text-white">{formValues.name}</strong>. Your appointment request for a <strong className="text-white">{formValues.model}</strong> has been logged. We will call you back within 2 hours.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setBookingSubmitted(false);
                        setFormValues({ name: "", phone: "", email: "", model: "", service: "engine-diagnostics", message: "" });
                      }}
                      className="px-5 sm:px-6 py-2.5 text-xs font-bold tracking-widest text-slate-300 hover:text-white bg-slate-900 border border-white/10 hover:border-blue-500/30 rounded-full transition-all duration-300"
                      id="btn-new-inquiry"
                    >
                      Send Another Inquiry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5 relative z-10">
                    {/* Row 1: Name + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="space-y-2">
                        <label htmlFor="form-name" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name <span className="text-red-400">*</span></label>
                        <input
                          id="form-name"
                          name="name"
                          type="text"
                          value={formValues.name}
                          onChange={handleInputChange}
                          placeholder="e.g. John Doe"
                          className={`w-full rounded-xl sm:rounded-2xl border ${errors.name ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-blue-500/50"} bg-slate-950/80 px-4 sm:px-5 py-3 sm:py-4 text-slate-100 placeholder:text-slate-600 outline-none transition focus:ring-2 focus:ring-blue-500/10 text-sm`}
                        />
                        {errors.name && <p className="text-xs text-red-400 mt-1 font-semibold">Please enter your name.</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="form-phone" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number <span className="text-red-400">*</span></label>
                        <input
                          id="form-phone"
                          name="phone"
                          type="tel"
                          value={formValues.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. 01751-777777"
                          className={`w-full rounded-xl sm:rounded-2xl border ${errors.phone ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-blue-500/50"} bg-slate-950/80 px-4 sm:px-5 py-3 sm:py-4 text-slate-100 placeholder:text-slate-600 outline-none transition focus:ring-2 focus:ring-blue-500/10 text-sm`}
                        />
                        {errors.phone && <p className="text-xs text-red-400 mt-1 font-semibold">Please enter your phone number.</p>}
                      </div>
                    </div>

                    {/* Row 2: Email + Vehicle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="space-y-2">
                        <label htmlFor="form-email" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address <span className="text-red-400">*</span></label>
                        <input
                          id="form-email"
                          name="email"
                          type="email"
                          value={formValues.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className={`w-full rounded-xl sm:rounded-2xl border ${errors.email ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-blue-500/50"} bg-slate-950/80 px-4 sm:px-5 py-3 sm:py-4 text-slate-100 placeholder:text-slate-600 outline-none transition focus:ring-2 focus:ring-blue-500/10 text-sm`}
                        />
                        {errors.email && <p className="text-xs text-red-400 mt-1 font-semibold">Please enter a valid email.</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="form-model" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle Model & Year <span className="text-red-400">*</span></label>
                        <input
                          id="form-model"
                          name="model"
                          type="text"
                          value={formValues.model}
                          onChange={handleInputChange}
                          placeholder="e.g. BMW M3 2024"
                          className={`w-full rounded-xl sm:rounded-2xl border ${errors.model ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-blue-500/50"} bg-slate-950/80 px-4 sm:px-5 py-3 sm:py-4 text-slate-100 placeholder:text-slate-600 outline-none transition focus:ring-2 focus:ring-blue-500/10 text-sm`}
                        />
                        {errors.model && <p className="text-xs text-red-400 mt-1 font-semibold">Please specify your vehicle model.</p>}
                      </div>
                    </div>

                    {/* Service Type */}
                    <div className="space-y-2">
                      <label htmlFor="form-service" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Type Required</label>
                      <select
                        id="form-service"
                        name="service"
                        value={formValues.service}
                        onChange={handleInputChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-slate-950 px-4 sm:px-5 py-3 sm:py-4 text-slate-100 outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-sm appearance-none cursor-pointer"
                      >
                        {services.map((svc) => (
                          <option key={svc.id} value={svc.id} className="bg-slate-950 text-slate-200">
                            {svc.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label htmlFor="form-message" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Describe Symptoms or Requirements</label>
                      <textarea
                        id="form-message"
                        name="message"
                        rows={4}
                        value={formValues.message}
                        onChange={handleInputChange}
                        placeholder="e.g. Engine indicator light is active, check engine codes..."
                        className="w-full resize-none rounded-xl sm:rounded-2xl border border-white/10 bg-slate-950/80 px-4 sm:px-5 py-3 sm:py-4 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-sm"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 px-6 py-4 text-sm font-bold text-white shadow-neon hover:shadow-neonStrong transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      id="form-submit"
                    >
                      {bookingLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Logging Inquiry...
                        </span>
                      ) : (
                        "Submit Service Inquiry"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-[#030304] px-4 sm:px-6 py-12 sm:py-16 text-slate-500" id="footer">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 md:gap-12 justify-between items-start mb-12 sm:mb-16">
            <div className="space-y-4 max-w-sm">
              <span className="text-lg sm:text-xl font-black tracking-widest text-white block">GRAND AUTO SERVICES</span>
              <p className="text-sm leading-relaxed text-slate-400">
                Premium, dealership-level service standards for discerning car owners. Located in the heart of Chattogram.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3 pt-2">
                {[
                  { name: "Facebook", href: "#", icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /> },
                  { name: "Instagram", href: "#", icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></> },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/30 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {social.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 w-full md:w-auto">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Sitemap</h4>
                <ul className="space-y-2.5 text-sm">
                  {[["Home", "#"], ["About Us", "#about"], ["Services", "#services"]].map(([label, href]) => (
                    <li key={label}><a href={href} className="hover:text-white transition-colors">{label}</a></li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Workshop</h4>
                <ul className="space-y-2.5 text-sm">
                  {[["Why Choose Us", "#why-choose-us"], ["Gallery", "#gallery"], ["Inquire", "#contact"]].map(([label, href]) => (
                    <li key={label}><a href={href} className="hover:text-white transition-colors">{label}</a></li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Hours</h4>
                <ul className="space-y-2.5 text-sm">
                  <li><span className="text-slate-300">Sat – Thu</span><br /><span className="text-xs">9:00 AM – 9:00 PM</span></li>
                  <li><span className="text-slate-300">Friday</span><br /><span className="text-xs">2:00 PM – 9:00 PM</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-600">
            <span>© 2026 Grand Auto Services (GAS). All rights reserved.</span>
            <span className="flex gap-4 sm:gap-6 flex-wrap justify-center">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              <button
                onClick={() => { setShowAdminModal(true); fetchBookings(); }}
                className="hover:text-slate-400 cursor-pointer font-bold text-blue-500 bg-transparent border-none outline-none p-0"
              >
                Admin
              </button>
            </span>
          </div>
        </div>
      </footer>

      {/* ── WhatsApp Floating Button ───────────────────────────────────────── */}
      <motion.a
        href="https://wa.me/8801751777777"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-green-500 hover:bg-green-400 text-white shadow-lg hover:shadow-green-500/40 flex items-center justify-center transition-shadow duration-300"
        style={{ width: "52px", height: "52px" }}
        aria-label="Chat on WhatsApp"
        id="whatsapp-float-btn"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787" />
        </svg>
      </motion.a>

      {/* ── Admin Dashboard Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showAdminModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
            onClick={() => setShowAdminModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 w-full max-w-4xl max-h-[88vh] overflow-y-auto shadow-glassGlow relative my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAdminModal(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 border border-white/10 transition-colors"
                aria-label="Close admin dashboard"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-5 sm:pb-6 mb-5 sm:mb-6">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 tracking-[0.3em] uppercase">GAS CONTROL PANEL</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">Booking Inquiries</h3>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={fetchBookings}
                    className="px-4 py-2 text-xs font-bold tracking-wider text-slate-300 hover:text-white bg-slate-950 border border-white/5 rounded-full transition-all duration-300"
                  >
                    Refresh
                  </button>
                  {bookingsList.length > 0 && (
                    <button
                      onClick={() => deleteBooking()}
                      className="px-4 py-2 text-xs font-bold tracking-wider text-red-400 hover:text-red-300 bg-red-950/20 border border-red-500/20 rounded-full transition-all duration-300"
                    >
                      Delete All
                    </button>
                  )}
                </div>
              </div>

              {adminLoading ? (
                <div className="py-16 sm:py-20 text-center flex flex-col items-center justify-center gap-3">
                  <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm text-slate-400">Fetching inquiries...</span>
                </div>
              ) : bookingsList.length === 0 ? (
                <div className="py-16 sm:py-20 text-center text-slate-500 border border-dashed border-white/5 rounded-2xl bg-white/5">
                  <p className="text-base">No bookings logged in the system.</p>
                  <p className="text-xs mt-1 text-slate-600">Submissions from the booking form will appear here in real-time.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto -mx-2 sm:mx-0">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-slate-400">
                          <th className="pb-3 font-semibold font-mono px-2">Date</th>
                          <th className="pb-3 font-semibold font-mono px-2">Customer</th>
                          <th className="pb-3 font-semibold font-mono px-2">Vehicle & Service</th>
                          <th className="pb-3 font-semibold font-mono px-2">Message</th>
                          <th className="pb-3 font-semibold text-right font-mono px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {bookingsList.map((bk) => (
                          <tr key={bk.id} className="group hover:bg-white/5 transition-colors">
                            <td className="py-4 pr-3 text-xs text-slate-400 font-mono px-2">
                              {new Date(bk.createdAt).toLocaleDateString()} <br />
                              {new Date(bk.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </td>
                            <td className="py-4 pr-3 px-2">
                              <span className="font-bold text-white block">{bk.name}</span>
                              <span className="text-xs text-blue-400 block">{bk.phone || "—"}</span>
                              <span className="text-xs text-slate-400 block">{bk.email}</span>
                            </td>
                            <td className="py-4 pr-3 px-2">
                              <span className="text-slate-200 block font-semibold">{bk.model}</span>
                              <span className="text-xs text-blue-400 font-mono block">
                                {services.find((s) => s.id === bk.service)?.title || bk.service}
                              </span>
                            </td>
                            <td className="py-4 pr-3 text-slate-300 max-w-[160px] sm:max-w-[200px] truncate px-2" title={bk.message}>
                              {bk.message || <span className="text-slate-600 italic">No message</span>}
                            </td>
                            <td className="py-4 text-right px-2">
                              <button
                                onClick={() => deleteBooking(bk.id)}
                                className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-white bg-red-950/20 hover:bg-red-600 border border-red-500/20 hover:border-red-600 rounded-full transition-all duration-200"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 font-mono pt-4 border-t border-white/5">
                    <span>Total Inquiries: {bookingsList.length}</span>
                    <span>System Status: Active</span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
