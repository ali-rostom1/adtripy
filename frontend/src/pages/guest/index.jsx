import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/guest/Navbar"; // Import the Navbar component

export default function index() {
  // Scroll reveal animation
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".scroll-reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Counter animation function
  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute("data-target"));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent =
        Math.floor(current).toLocaleString() + (target >= 1000 ? "+" : "");
    }, 16);
  };

  // Counter animation observer
  useEffect(() => {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    });

    document.querySelectorAll(".counter").forEach((counter) => {
      counterObserver.observe(counter);
    });

    return () => counterObserver.disconnect();
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      document.querySelectorAll(".parallax").forEach((element) => {
        const speed = element.getAttribute("data-speed") || 0.5;
        const x = (mouseX - 0.5) * speed * 50;
        const y = (mouseY - 0.5) * speed * 50;
        element.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Enhanced search form
  useEffect(() => {
    const searchInputs = document.querySelectorAll("input, select");

    const handleFocus = function () {
      this.parentElement.classList.add("animate-glow");
    };

    const handleBlur = function () {
      this.parentElement.classList.remove("animate-glow");
    };

    searchInputs.forEach((input) => {
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);
    });

    return () => {
      searchInputs.forEach((input) => {
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("blur", handleBlur);
      });
    };
  }, []);

  // Enhanced card hover effects
  useEffect(() => {
    const handleCardEnter = function () {
      this.style.transform =
        "perspective(1000px) rotateY(5deg) rotateX(5deg) translateZ(50px)";
    };

    const handleCardLeave = function () {
      this.style.transform =
        "perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    };

    const cards = document.querySelectorAll(".card-3d");
    cards.forEach((card) => {
      card.addEventListener("mouseenter", handleCardEnter);
      card.addEventListener("mouseleave", handleCardLeave);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", handleCardEnter);
        card.removeEventListener("mouseleave", handleCardLeave);
      });
    };
  }, []);

  // Page load animation
  useEffect(() => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease-in-out";

    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 100);
  }, []);

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    const button = e.currentTarget;
    const input = button.parentElement.querySelector('input[type="email"]');

    if (input && input.value && input.value.includes("@")) {
      // Success animation
      button.innerHTML = "✓ Subscribed!";
      button.classList.add("animate-bounce");
      input.value = "";

      setTimeout(() => {
        button.innerHTML = "Subscribe Now";
        button.classList.remove("animate-bounce");
      }, 3000);
    } else {
      // Error animation
      input.classList.add("animate-bounce");
      input.style.borderColor = "#ef4444";

      setTimeout(() => {
        input.classList.remove("animate-bounce");
        input.style.borderColor = "";
      }, 1000);
    }
  };

  // Handle booking
  const handleBooking = (e) => {
    e.preventDefault();

    // Create loading state
    const button = e.currentTarget;
    const originalText = button.textContent;
    button.innerHTML =
      '<div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"></div>';
    button.disabled = true;

    // Simulate booking process
    setTimeout(() => {
      button.innerHTML = "✓ Booking Confirmed!";
      button.classList.add("animate-pulse");

      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        button.classList.remove("animate-pulse");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="font-sans overflow-x-hidden">
      {/* Replace the nav element with the Navbar component */}
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video autoPlay loop muted playsInline className="w-screen h-screen object-cover object-center">
            <source src="/assets/video/videoBg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/30 sm:bg-black/25 lg:bg-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-screen z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-20 pb-20 sm:pt-24 sm:pb-24 md:pt-28 md:pb-28 lg:pt-32 lg:pb-32 xl:pt-30 xl:pb-30">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
              {/* Main Heading - Responsive */}
              <h1 className="hero-content animate-fade-in-up delay-300 text-2xl sm:text-3xl md:text-3xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light leading-tight mb-4 sm:mb-6 md:mb-4 tracking-tight">
                Escape the ordinary.
                <span className="hero-content animate-fade-in-left delay-600 block font-medium bg-gradient-to-r from-white xl:text-6xl to-gray-300 bg-clip-text text-transparent">
                  Discover extraordinary.
                </span>
              </h1>

              {/* Description Text - Responsive */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-8 sm:mb-10 md:mb-12 text-gray-200 leading-relaxed max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
                <p className="hero-content animate-fade-in-up delay-900 font-light text-base sm:text-lg md:text-xl lg:text-2xl xl:text-lg ">
                  Step into a curated collection of the world's most
                  breathtaking vacation homes. From secluded mountain retreats
                  to oceanfront sanctuaries.
                </p>
              </div>

              {/* Search Component */}
              <div className="hero-content animate-fade-in-scale delay-1500 mb-8 sm:mb-10 md:mb-12 ">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl">
                  {/* Search Form */}
                  <form className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Location */}
                    <div className="md:col-span-1 lg:col-span-1">
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Where
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search destinations"
                          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                        />
                        <svg
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 12.414a6 6 0 111.414-1.414l4.243 4.243a1 1 0 01-1.414 1.414z"
                          ></path>
                        </svg>
                      </div>
                    </div>

                    {/* Check-in */}
                    <div className="md:col-span-1 lg:col-span-1">
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Check-in
                      </label>
                      <input
                        type="date"
                        className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                      />
                    </div>

                    {/* Check-out */}
                    <div className="md:col-span-1 lg:col-span-1">
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Check-out
                      </label>
                      <input
                        type="date"
                        className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                      />
                    </div>

                    {/* Guests */}
                    <div className="md:col-span-1 lg:col-span-1">
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Guests
                      </label>
                      <select className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent">
                        <option value="1" className="bg-gray-800">
                          1 Guest
                        </option>
                        <option value="2" className="bg-gray-800">
                          2 Guests
                        </option>
                        <option value="3" className="bg-gray-800">
                          3 Guests
                        </option>
                        <option value="4" className="bg-gray-800">
                          4 Guests
                        </option>
                        <option value="5" className="bg-gray-800">
                          5+ Guests
                        </option>
                      </select>
                    </div>

                    {/* Search Button */}
                    <div className="md:col-span-2 lg:col-span-1 flex items-end">
                      <button
                        type="submit"
                        className="w-full bg-white text-black hover:bg-gray-100 transition-all duration-300 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-xl"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          ></path>
                        </svg>
                        Search
                      </button>
                    </div>
                  </form>

                  {/* Quick Filters */}
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="flex flex-wrap gap-3">
                      <span className="text-sm text-white/80 font-medium">
                        Popular:
                      </span>
                      <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white transition-colors">
                        Beachfront
                      </button>
                      <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white transition-colors">
                        Mountain View
                      </button>
                      <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white transition-colors">
                        City Center
                      </button>
                      <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white transition-colors">
                        Luxury Villa
                      </button>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-white/90">
                        Price Range
                      </label>
                      <span className="text-sm text-white/70">
                        $50 - $500+ per night
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="50"
                        max="500"
                        defaultValue="250"
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced floating elements - Responsive */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Mobile: Fewer, smaller particles */}
          <div className="block sm:hidden">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
            <div
              className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          {/* Tablet and up: More particles */}
          <div className="hidden sm:block">
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 rounded-full animate-pulse"></div>
            <div
              className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/60 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-1/4 left-1/3 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/30 rounded-full animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute top-1/2 right-1/4 w-1 h-1 bg-white/50 rounded-full animate-pulse"
              style={{ animationDelay: "3s" }}
            ></div>
            <div
              className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-white/40 rounded-full animate-pulse"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 md:h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
      </section>

      <section className="relative bg-white py-24 px-4 md:px-8 lg:px-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/src/assets/img/homeBg.jpg"
            alt="Background"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-white/80"></div>
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          {/* Elegant Content Section */}
          <div className="grid grid-cols-12 mb-6 gap-12 items-center">
            {/* Left Content */}
            <div className="col-span-12 lg:col-span-6 space-y-8">
              {/* Mission Badge */}
              <div className="inline-flex items-center space-x-3">
                <div className="w-12 h-[1px] bg-gradient-to-r from-green-600 to-green-400"></div>
                <span className="text-green-700 text-sm font-bold tracking-[0.2em] uppercase">
                  Our Mission
                </span>
                <div className="w-12 h-[1px] bg-gradient-to-r from-green-400 to-transparent"></div>
              </div>

              {/* Luxury Heading */}
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 leading-[0.9] tracking-tight">
                  make
                </h2>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[0.9] tracking-tight">
                  your{" "}
                  <span className="italic font-light text-green-700">
                    trip booked
                  </span>
                </h2>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 leading-[0.9] tracking-tight">
                  in one place
                </h2>
              </div>

              {/* Elegant Subheading */}
              <p className="text-2xl text-gray-600 font-light leading-relaxed italic">
                Your journey to digital excellence starts here.
              </p>
            </div>

            {/* Right Content */}
            <div className="col-span-12 lg:col-span-6 space-y-8">
              {/* Premium Text Blocks */}
              <div className="space-y-6">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-green-600 to-green-400 rounded-full"></div>
                  <p className="text-lg text-gray-700 leading-relaxed font-light">
                    We believe in transforming travel visions into reality. From
                    cars to stays to unforgettable experiences — we make every
                    journey possible.
                  </p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-green-400 to-green-200 rounded-full"></div>
                  <p className="text-lg text-gray-700 leading-relaxed font-light">
                    With smart planning and seamless solutions, we create travel
                    experiences that inspire. Excellence isn’t just our goal —
                    it’s what we deliver, every step of the journey.
                  </p>
                </div>
              </div>

              {/* Luxury Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">250+</div>
                  <div className="text-sm text-gray-600 font-medium tracking-wider uppercase">
                    collaborators
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">15+</div>
                  <div className="text-sm text-gray-600 font-medium tracking-wider uppercase">
                    Years
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">98%</div>
                  <div className="text-sm text-gray-600 font-medium tracking-wider uppercase">
                    Success
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Grid Layout */}
          <div className="grid grid-cols-12 gap-8 mb-16">
            {/* Left Column - Large Image */}
            <div className="col-span-12 lg:col-span-7">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent rounded-3xl"></div>
                <img
                  src="/src/assets/img/exp.jpg"
                  alt="Modern office interior"
                  className="w-full h-[500px] object-cover rounded-3xl shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full">
                  <span className="text-green-700 font-semibold text-sm tracking-wider">
                    EXCELLENCE
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Stacked Images */}
            <div className="col-span-12 lg:col-span-5 space-y-6">
              <div className="relative group">
                <img
                  src="/src/assets/img/sahra2.jpg"
                  alt="Modern building exterior"
                  className="w-full h-[240px] object-cover rounded-2xl shadow-xl transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
              <div className="relative group">
                <img
                  src="/src/assets/img/picine.jpg"
                  alt="Modern architecture"
                  className="w-full h-[240px] object-cover rounded-2xl shadow-xl transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="flex justify-center mt-16">
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-14 border border-t-green-500 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 mb-8">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-green-600"></div>
              <span className="text-green-700 text-sm font-bold tracking-[0.2em] uppercase">
                Our Partners
              </span>
              <div className="w-16 h-[1px] bg-gradient-to-r from-green-600 to-transparent"></div>
            </div>

            <h2 className="text-5xl md:text-5xl lg:text-5xl font-light text-gray-900 leading-[0.9] tracking-tight mb-6">
              Trusted by{" "}
              <span className="italic font-light text-green-700">Industry</span>
            </h2>
            <h2 className="text-4xl md:text-4xl lg:text-4xl font-bold text-gray-900 leading-[0.9] tracking-tight mb-8">
              Leaders
            </h2>

            <p className="text-xl text-gray-600 font-light leading-relaxed italic max-w-3xl mx-auto">
              Collaborating with premium brands across automotive, hospitality,
              and experiential sectors.
            </p>
          </div>

          {/* Premium Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {/* Automotive Sector */}
            <div className="group">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center mb-6">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Automotive Excellence
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed mb-6">
                    Partnering with luxury car dealerships and automotive brands
                    to create exceptional digital experiences.
                  </p>
                </div>

                {/* Client Logos Placeholder */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-gray-400 font-medium text-sm">
                      BMW
                    </span>
                  </div>
                  <div className="h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-gray-400 font-medium text-sm">
                      Mercedes
                    </span>
                  </div>
                  <div className="h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-gray-400 font-medium text-sm">
                      Audi
                    </span>
                  </div>
                  <div className="h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-gray-400 font-medium text-sm">
                      Porsche
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Experiences Sector */}
            <div className="group">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center mb-6">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Premium Experiences
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed mb-6">
                    Creating unforgettable moments with event agencies and
                    experience curators worldwide.
                  </p>
                </div>

                {/* Client Logos Placeholder */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-gray-400 font-medium text-sm">
                      EventCorp
                    </span>
                  </div>
                  <div className="h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-gray-400 font-medium text-sm">
                      LuxEvents
                    </span>
                  </div>
                  <div className="h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-gray-400 font-medium text-sm">
                      Prestige
                    </span>
                  </div>
                  <div className="h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-gray-400 font-medium text-sm">
                      Elite
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hospitality Sector */}
            <div className="group">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center mb-6">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Luxury Hospitality
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed mb-6">
                    Elevating hospitality brands with sophisticated digital
                    solutions and booking experiences.
                  </p>
                </div>

                {/* Client Logos Placeholder */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-gray-400 font-medium text-sm">
                      Marriott
                    </span>
                  </div>
                  <div className="h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-gray-400 font-medium text-sm">
                      Hilton
                    </span>
                  </div>
                  <div className="h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-gray-400 font-medium text-sm">
                      Ritz
                    </span>
                  </div>
                  <div className="h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-gray-400 font-medium text-sm">
                      Four Seasons
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="flex justify-center mt-16">
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="relative py-32 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 scroll-reveal">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              Featured <span className="gradient-text">Luxury Stays</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Handpicked extraordinary properties that redefine luxury and
              comfort
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Large Featured Card */}
            <div className="lg:row-span-2 scroll-reveal">
              <div className="relative group overflow-hidden rounded-3xl hover-scale card-3d h-full min-h-[600px]">
                <img
                  src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Featured property"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-6 left-6">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ Featured
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400">★★★★★</div>
                      <span className="text-white/90 text-sm">
                        (4.9) • 127 reviews
                      </span>
                    </div>
                    <button className="text-white hover:text-red-400 transition-colors">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Modern Desert Oasis
                  </h3>
                  <p className="text-white/80 mb-4">
                    Stunning architectural masterpiece with infinity pool and
                    panoramic mountain views
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-black text-white">
                        $850
                      </span>
                      <span className="text-white/80 text-lg">/night</span>
                    </div>
                    <button
                      onClick={handleBooking}
                      className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Smaller Cards */}
            <div className="space-y-8">
              <div className="scroll-reveal">
                <div className="relative group overflow-hidden rounded-3xl hover-scale card-3d h-72">
                  <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      Coastal Villa
                    </h3>
                    <p className="text-white/80 text-sm mb-2">
                      Beachfront luxury with private beach access
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">
                        $620/night
                      </span>
                      <button className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-all">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="scroll-reveal">
                <div className="relative group overflow-hidden rounded-3xl hover-scale card-3d h-72">
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      Mountain Retreat
                    </h3>
                    <p className="text-white/80 text-sm mb-2">
                      Alpine luxury with ski-in, ski-out access
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">
                        $750/night
                      </span>
                      <button className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-all">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Additional property cards here - similar structure to above */}
            {/* For brevity, only showing one example */}
            <div className="scroll-reveal">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover-scale card-3d">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Property"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-all">
                      <svg
                        className="w-5 h-5 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-yellow-400 text-sm">★★★★★</div>
                    <span className="text-gray-500 text-sm">4.8 (92)</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Urban Penthouse
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Downtown luxury with rooftop terrace
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-gray-900">
                        $420
                      </span>
                      <span className="text-gray-500">/night</span>
                    </div>
                    <button
                      onClick={handleBooking}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Repeat similar structure for other property cards */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-3xl font-black">LuxeStay</div>
              </div>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Discover extraordinary vacation rentals around the world.
                Experience luxury, comfort, and unforgettable memories.
              </p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                {/* Additional social media links */}
              </div>
            </div>

            {/* Footer navigation columns */}
            <div>
              <h3 className="text-xl font-bold mb-6">Discover</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <Link
                    to="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Luxury Villas
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Beach Houses
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Mountain Retreats
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    City Apartments
                  </Link>
                </li>
              </ul>
            </div>

            {/* Additional footer columns */}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-lg">
              © 2025 LuxeStay. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <Link
                to="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
