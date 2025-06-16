"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/guest/Navbar";

export default function EnhancedLandingPage() {
  // All the existing useEffect hooks remain the same
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

  const animateCounter = (element) => {
    const target = Number.parseInt(element.getAttribute("data-target"));
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

  useEffect(() => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease-in-out";

    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 100);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const button = e.currentTarget;
    const input = button.parentElement.querySelector('input[type="email"]');

    if (input && input.value && input.value.includes("@")) {
      button.innerHTML = "✓ Subscribed!";
      button.classList.add("animate-bounce");
      input.value = "";

      setTimeout(() => {
        button.innerHTML = "Subscribe Now";
        button.classList.remove("animate-bounce");
      }, 3000);
    } else {
      input.classList.add("animate-bounce");
      input.style.borderColor = "#ef4444";

      setTimeout(() => {
        input.classList.remove("animate-bounce");
        input.style.borderColor = "";
      }, 1000);
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();

    const button = e.currentTarget;
    const originalText = button.textContent;
    button.innerHTML =
      '<div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"></div>';
    button.disabled = true;

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
      <Navbar />

      {/* Hero Section - Keep as is */}
      <section className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-screen h-screen object-cover object-center"
          >
            <source src="/src/assets/video/videoBg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/30 sm:bg-black/25 lg:bg-black/30"></div>
        </div>

        <div className="relative h-screen z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-20 pb-20 sm:pt-24 sm:pb-24 md:pt-28 md:pb-28 lg:pt-32 lg:pb-32 xl:pt-30 xl:pb-30">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
              <h1 className="hero-content animate-fade-in-up delay-300 text-2xl sm:text-3xl md:text-3xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light leading-tight mb-4 sm:mb-6 md:mb-4 tracking-tight">
                Escape the ordinary.
                <span className="hero-content animate-fade-in-left delay-600 block font-medium bg-gradient-to-r from-white xl:text-6xl to-gray-300 bg-clip-text text-transparent">
                  Discover extraordinary.
                </span>
              </h1>

              <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-8 sm:mb-10 md:mb-12 text-gray-200 leading-relaxed max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
                <p className="hero-content animate-fade-in-up delay-900 font-light text-base sm:text-lg md:text-xl lg:text-2xl xl:text-lg ">
                  Step into a curated collection of the world's most
                  breathtaking vacation homes. From secluded mountain retreats
                  to oceanfront sanctuaries.
                </p>
              </div>

              {/* Search Component - Keep existing search form */}
              <div className="hero-content animate-fade-in-scale delay-1500 mb-8 sm:mb-10 md:mb-12 ">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl">
                  <form className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-5 gap-4">
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

                    <div className="md:col-span-1 lg:col-span-1">
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Check-in
                      </label>
                      <input
                        type="date"
                        className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-1 lg:col-span-1">
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Check-out
                      </label>
                      <input
                        type="date"
                        className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                      />
                    </div>

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

        <div className="absolute inset-0 pointer-events-none">
          <div className="block sm:hidden">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
            <div
              className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

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

      {/* Enhanced About Section with Background Elements */}
      <section
        className="py-24 px-4 md:px-8 lg:px-16 relative bg-cover bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: "url('/src/assets/img/homeBg.jpg')",
        }}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-white/90"></div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Geometric shapes */}
          <div
            className="absolute top-20 left-10 w-32 h-32 bg-green-100/30 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-40 right-20 w-24 h-24 bg-green-200/20 rounded-full blur-lg animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-50/40 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute bottom-20 right-1/3 w-28 h-28 bg-green-100/25 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "6s" }}
          ></div>

          {/* Floating dots */}
          <div
            className="absolute top-1/3 left-1/5 w-2 h-2 bg-green-400/60 rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-green-500/50 rounded-full animate-bounce"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute bottom-1/3 left-2/3 w-2.5 h-2.5 bg-green-300/40 rounded-full animate-bounce"
            style={{ animationDelay: "5s" }}
          ></div>

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 gap-4 h-full">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border border-green-200"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Content remains the same */}
          <div className="grid grid-cols-12 mb-6 gap-12 items-center">
            <div className="col-span-12 lg:col-span-6 space-y-8">
              <div className="inline-flex items-center space-x-3">
                <div className="w-12 h-[1px] bg-gradient-to-r from-green-600 to-green-400"></div>
                <span className="text-green-700 text-sm font-bold tracking-[0.2em] uppercase">
                  Our Mission
                </span>
                <div className="w-12 h-[1px] bg-gradient-to-r from-green-400 to-transparent"></div>
              </div>

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

              <p className="text-2xl text-gray-600 font-light leading-relaxed italic">
                Your journey to digital excellence starts here.
              </p>
            </div>

            <div className="col-span-12 lg:col-span-6 space-y-8">
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
                    experiences that inspire. Excellence isn't just our goal —
                    it's what we deliver, every step of the journey.
                  </p>
                </div>
              </div>

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

          {/* Images grid remains the same */}
          <div className="grid grid-cols-12 gap-8 mb-16">
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

          <div className="flex justify-center mt-16">
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
          </div>
        </div>
      </section>

      <section className="relative py-16 border border-t-green-600 bg-white overflow-hidden">
        {/* Elegant Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle gradient orbs */}
          <div
            className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-green-50/60 to-green-100/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-1/2 -right-40 w-72 h-72 bg-gradient-to-bl from-green-100/40 to-green-50/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "6s" }}
          ></div>

          {/* Elegant line patterns */}
          <div className="absolute top-1/4 left-1/6 w-px h-16 bg-gradient-to-b from-transparent via-green-200/50 to-transparent"></div>
          <div className="absolute bottom-1/3 right-1/5 w-px h-20 bg-gradient-to-b from-transparent via-green-200/40 to-transparent"></div>

          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          ></div>
        </div>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-4 mb-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-green-600"></div>
              <span className="text-green-700 text-sm font-semibold tracking-[0.3em] uppercase">
                Curated Offers
              </span>
              <div className="w-16 h-px bg-gradient-to-r from-green-600 to-transparent"></div>
            </div>

            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Exclusive{" "}
              <span className="font-semibold text-green-700 italic">
                Collection
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              Handpicked luxury experiences designed for the discerning traveler
            </p>
          </div>

          {/* Luxury Cards Row */}
          <div
            className="flex flex-row gap-8 overflow-x-auto overflow-y-hidden scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Luxury Car Card */}
            <div className="flex-shrink-0 w-80">
              <div className="bg-white border border-green-100 hover:border-green-200 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(16,185,129,0.1)] group">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Luxury Sports Car"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  <div className="absolute top-4 right-4">
                    <button className="bg-white/95 backdrop-blur-sm p-2 border border-green-200 hover:bg-green-50 transition-all duration-300">
                      <svg
                        className="w-4 h-4 text-green-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 bg-green-600 rounded-full"
                        ></div>
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs font-light">
                      4.9 • 156 reviews
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                    Lamborghini Huracán
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 font-light leading-relaxed">
                    Experience automotive excellence with our premium supercar
                    collection and white-glove service.
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-light text-gray-900">
                        $899
                      </span>
                      <span className="text-gray-500 text-sm font-light">
                        /day
                      </span>
                    </div>
                    <button className="bg-green-700 text-white px-6 py-2.5 text-sm font-medium tracking-wider uppercase hover:bg-green-800 transition-all duration-300 border border-green-700">
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Helicopter Experience Card */}
            <div className="flex-shrink-0 w-80">
              <div className="bg-white border border-green-100 hover:border-green-200 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(16,185,129,0.1)] group">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Helicopter Tour"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4"></div>
                  <div className="absolute top-4 right-4">
                    <button className="bg-white/95 backdrop-blur-sm p-2 border border-green-200 hover:bg-green-50 transition-all duration-300">
                      <svg
                        className="w-4 h-4 text-green-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 bg-green-600 rounded-full"
                        ></div>
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs font-light">
                      4.8 • 89 reviews
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                    Private Helicopter Tour
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 font-light leading-relaxed">
                    Soar above breathtaking landscapes with champagne service
                    and professional photography.
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-light text-gray-900">
                        $1,299
                      </span>
                      <span className="text-gray-500 text-sm font-light">
                        /tour
                      </span>
                    </div>
                    <button className="bg-green-700 text-white px-6 py-2.5 text-sm font-medium tracking-wider uppercase hover:bg-green-800 transition-all duration-300 border border-green-700">
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Luxury Villa Card */}
            <div className="flex-shrink-0 w-80">
              <div className="bg-white border border-green-100 hover:border-green-200 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(16,185,129,0.1)] group">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Luxury Villa"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4"></div>
                  <div className="absolute top-4 right-4">
                    <button className="bg-white/95 backdrop-blur-sm p-2 border border-green-200 hover:bg-green-50 transition-all duration-300">
                      <svg
                        className="w-4 h-4 text-green-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 bg-green-600 rounded-full"
                        ></div>
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs font-light">
                      4.9 • 234 reviews
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                    Oceanfront Villa
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 font-light leading-relaxed">
                    Stunning villa with infinity pool, private beach access, and
                    world-class amenities.
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-light text-gray-900">
                        $2,450
                      </span>
                      <span className="text-gray-500 text-sm font-light">
                        /night
                      </span>
                    </div>
                    <button className="bg-green-700 text-white px-6 py-2.5 text-sm font-medium tracking-wider uppercase hover:bg-green-800 transition-all duration-300 border border-green-700">
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Yacht Charter Card */}
            <div className="flex-shrink-0 w-80">
              <div className="bg-white border border-green-100 hover:border-green-200 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(16,185,129,0.1)] group">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Luxury Yacht"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4"></div>
                  <div className="absolute top-4 right-4">
                    <button className="bg-white/95 backdrop-blur-sm p-2 border border-green-200 hover:bg-green-50 transition-all duration-300">
                      <svg
                        className="w-4 h-4 text-green-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 bg-green-600 rounded-full"
                        ></div>
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs font-light">
                      4.9 • 67 reviews
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                    Luxury Yacht Charter
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 font-light leading-relaxed">
                    Set sail with professional crew, gourmet dining, and access
                    to exclusive destinations.
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-light text-gray-900">
                        $3,500
                      </span>
                      <span className="text-gray-500 text-sm font-light">
                        /day
                      </span>
                    </div>
                    <button className="bg-green-700 text-white px-6 py-2.5 text-sm font-medium tracking-wider uppercase hover:bg-green-800 transition-all duration-300 border border-green-700">
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Wine Tasting Card */}
            <div className="flex-shrink-0 w-80">
              <div className="bg-white border border-green-100 hover:border-green-200 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(16,185,129,0.1)] group">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Wine Tasting"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4"></div>
                  <div className="absolute top-4 right-4">
                    <button className="bg-white/95 backdrop-blur-sm p-2 border border-green-200 hover:bg-green-50 transition-all duration-300">
                      <svg
                        className="w-4 h-4 text-green-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 bg-green-600 rounded-full"
                        ></div>
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs font-light">
                      4.7 • 143 reviews
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                    Premium Wine Tasting
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 font-light leading-relaxed">
                    Exclusive vineyard tours with sommelier-guided tastings of
                    rare vintage wines.
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-light text-gray-900">
                        $299
                      </span>
                      <span className="text-gray-500 text-sm font-light">
                        /person
                      </span>
                    </div>
                    <button className="bg-green-700 text-white px-6 py-2.5 text-sm font-medium tracking-wider uppercase hover:bg-green-800 transition-all duration-300 border border-green-700">
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add CSS to hide scrollbar for webkit browsers */}
          <style jsx>{`
            .flex::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Elegant View More Button */}
          <div className="text-center mt-16">
            <button className="inline-flex items-center space-x-3 bg-white border-2 border-green-700 text-green-700 px-10 py-4 font-medium tracking-wider uppercase text-sm hover:bg-green-700 hover:text-white transition-all duration-500">
              <span>View Complete Collection</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>

          {/* Elegant Decorative Element */}
          <div className="flex justify-center mt-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-px bg-green-600"></div>
              <div className="w-2 h-2 border border-green-600 rotate-45"></div>
              <div className="w-8 h-px bg-green-600"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">
        {/* Sophisticated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large gradient orbs */}
          <div
            className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-bl from-green-400/15 to-green-500/8 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute -bottom-24 left-1/3 w-64 h-64 bg-gradient-to-tr from-green-600/25 to-green-400/12 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "8s" }}
          ></div>

          {/* Floating geometric elements with parallax */}
          <div
            className="parallax-host absolute top-20 left-1/4 w-6 h-6 bg-green-400/30 rotate-45"
            data-speed="0.5"
          ></div>
          <div
            className="parallax-host absolute bottom-32 right-1/5 w-4 h-4 bg-green-500/40 rotate-45"
            data-speed="0.3"
          ></div>
          <div
            className="parallax-host absolute top-2/3 left-1/6 w-8 h-8 bg-green-300/25 rotate-45"
            data-speed="0.7"
          ></div>

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>

          {/* Animated dots */}
          <div
            className="absolute top-1/4 right-1/3 w-2 h-2 bg-green-400/60 rounded-full animate-ping"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-green-500/50 rounded-full animate-ping"
            style={{ animationDelay: "6s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center space-x-3">
                <div className="w-12 h-[1px] bg-gradient-to-r from-green-500 to-green-400"></div>
                <span className="text-green-600 text-sm font-bold tracking-[0.2em] uppercase">
                  Become a Host
                </span>
                <div className="w-12 h-[1px] bg-gradient-to-r from-green-400 to-transparent"></div>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[0.9] tracking-tight">
                  Ready to
                </h2>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[0.9] tracking-tight">
                  <span className="italic font-light text-green-600">
                    share
                  </span>{" "}
                  your
                </h2>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[0.9] tracking-tight">
                  extraordinary space?
                </h2>
              </div>

              {/* Description */}
              <div className="space-y-6">
                <p className="text-xl text-gray-300 font-light leading-relaxed">
                  Transform your property into a premium destination. Join our
                  exclusive network of luxury hosts and start earning with
                  unparalleled support.
                </p>

                {/* Feature Points */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">
                        Premium Listing Exposure
                      </h4>
                      <p className="text-gray-400 font-light">
                        Showcase your property to discerning travelers worldwide
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">
                        24/7 Concierge Support
                      </h4>
                      <p className="text-gray-400 font-light">
                        Dedicated support team handling guest communications
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">
                        Guaranteed Income Protection
                      </h4>
                      <p className="text-gray-400 font-light">
                        Comprehensive insurance and damage protection coverage
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <button className="group relative inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 text-black px-8 py-4 font-bold tracking-wider uppercase text-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <span className="relative z-10">Start Hosting Today</span>
                  <svg
                    className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>

                <button className="group inline-flex items-center justify-center space-x-3 border-2 border-green-400 text-green-600 px-8 py-4 font-semibold tracking-wider uppercase text-sm hover:bg-green-400 hover:text-black transition-all duration-300">
                  <span>Learn More</span>
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Content - Visual Elements */}
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-3xl transform rotate-3"></div>
                <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all duration-500">
                  {/* Stats Cards */}
                  <div className="space-y-6">
                    {/* Earnings Card */}
                    <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 rounded-2xl p-6 border border-green-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-green-600 font-semibold text-sm tracking-wider uppercase">
                          Monthly Earnings
                        </h4>
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">
                        $12,450
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 text-sm">↗ +23%</span>
                        <span className="text-gray-400 text-sm">
                          vs last month
                        </span>
                      </div>
                    </div>

                    {/* Bookings Card */}
                    <div className="bg-gradient-to-r from-green-600/10 to-green-500/5 rounded-2xl p-6 border border-green-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-green-600 font-semibold text-sm tracking-wider uppercase">
                          Active Bookings
                        </h4>
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">
                        28
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 text-sm">
                          95% occupancy
                        </span>
                      </div>
                    </div>

                    {/* Rating Card */}
                    <div className="bg-gradient-to-r from-green-400/10 to-green-600/5 rounded-2xl p-6 border border-green-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-green-600 font-semibold text-sm tracking-wider uppercase">
                          Guest Rating
                        </h4>
                        <div className="flex text-yellow-400">★★★★★</div>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">
                        4.9
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">
                          Based on 247 reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-green-600 text-black px-4 py-2 rounded-full text-sm font-bold shadow-2xl">
                    ⭐ Superhost
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
              <div
                className="absolute -bottom-6 -right-6 w-12 h-12 bg-green-400/30 rounded-full blur-lg animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="flex justify-center mt-16">
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Partners Section with Background Elements */}
      <section className="bg-gray-50 py-14 border-t-green-500 px-4 md:px-8 lg:px-16 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large floating shapes */}
          <div
            className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-green-100/20 to-green-200/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-bl from-green-50/30 to-green-100/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute -bottom-32 left-1/3 w-72 h-72 bg-gradient-to-tr from-green-200/15 to-green-300/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "8s" }}
          ></div>

          {/* Floating geometric elements */}
          <div
            className="absolute top-20 left-1/4 w-4 h-4 bg-green-300/40 rotate-45 animate-spin"
            style={{ animationDuration: "20s" }}
          ></div>
          <div
            className="absolute bottom-40 right-1/5 w-6 h-6 bg-green-400/30 rotate-45 animate-spin"
            style={{ animationDuration: "25s", animationDelay: "5s" }}
          ></div>
          <div
            className="absolute top-2/3 left-1/6 w-3 h-3 bg-green-500/35 rotate-45 animate-spin"
            style={{ animationDuration: "15s", animationDelay: "10s" }}
          ></div>

          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section content remains the same */}
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

          {/* Cards grid - keeping existing structure */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            {/* Experience Card */}
            <div className="group cursor-pointer">
              <div className="bg-white rounded-none border border-gray-200 hover:border-green-300 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src="/src/assets/img/exp1.jpg"
                    alt="Premium Experiences"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                      Premium Experiences
                    </h3>
                    <div className="w-16 h-[1px] bg-white/60"></div>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-gray-600 leading-relaxed mb-8 font-light">
                    Creating unforgettable moments with event agencies and
                    experience curators who define luxury in their respective
                    fields.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 group-hover:border-green-100 transition-colors duration-300">
                      <span className="font-medium text-gray-800">
                        LuxEvents Global
                      </span>
                      <div className="w-2 h-2 bg-green-600 rounded-full opacity-60"></div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 group-hover:border-green-100 transition-colors duration-300">
                      <span className="font-medium text-gray-800">
                        Prestige Experiences
                      </span>
                      <div className="w-2 h-2 bg-green-600 rounded-full opacity-60"></div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="font-medium text-gray-800">
                        Elite Curation
                      </span>
                      <div className="w-2 h-2 bg-green-600 rounded-full opacity-60"></div>
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8">
                  <div className="flex items-center text-green-700 font-medium text-sm tracking-wider uppercase group-hover:text-green-800 transition-colors duration-300">
                    <span>View Projects</span>
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Automotive Card */}
            <div className="group cursor-pointer">
              <div className="bg-white rounded-none border border-gray-200 hover:border-green-300 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src="/src/assets/img/cars.jpg"
                    alt="Automotive Excellence"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                      Automotive Excellence
                    </h3>
                    <div className="w-16 h-[1px] bg-white/60"></div>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-gray-600 leading-relaxed mb-8 font-light">
                    Partnering with luxury car dealerships and automotive brands
                    to create exceptional digital experiences that drive
                    performance.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 group-hover:border-green-100 transition-colors duration-300">
                      <span className="font-medium text-gray-800">
                        BMW Group
                      </span>
                      <div className="w-2 h-2 bg-green-600 rounded-full opacity-60"></div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 group-hover:border-green-100 transition-colors duration-300">
                      <span className="font-medium text-gray-800">
                        Mercedes-Benz
                      </span>
                      <div className="w-2 h-2 bg-green-600 rounded-full opacity-60"></div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="font-medium text-gray-800">Porsche</span>
                      <div className="w-2 h-2 bg-green-600 rounded-full opacity-60"></div>
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8">
                  <div className="flex items-center text-green-700 font-medium text-sm tracking-wider uppercase group-hover:text-green-800 transition-colors duration-300">
                    <span>View Projects</span>
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Hospitality Card */}
            <div className="group cursor-pointer">
              <div className="bg-white rounded-none border border-gray-200 hover:border-green-300 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src="/src/assets/img/hotel1.jpg"
                    alt="Luxury Hospitality"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                      Luxury Hospitality
                    </h3>
                    <div className="w-16 h-[1px] bg-white/60"></div>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-gray-600 leading-relaxed mb-8 font-light">
                    Elevating hospitality brands with sophisticated digital
                    solutions and seamless booking experiences that exceed
                    expectations.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 group-hover:border-green-100 transition-colors duration-300">
                      <span className="font-medium text-gray-800">
                        Marriott International
                      </span>
                      <div className="w-2 h-2 bg-green-600 rounded-full opacity-60"></div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 group-hover:border-green-100 transition-colors duration-300">
                      <span className="font-medium text-gray-800">
                        Hilton Worldwide
                      </span>
                      <div className="w-2 h-2 bg-green-600 rounded-full opacity-60"></div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="font-medium text-gray-800">
                        Four Seasons Hotels
                      </span>
                      <div className="w-2 h-2 bg-green-600 rounded-full opacity-60"></div>
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8">
                  <div className="flex items-center text-green-700 font-medium text-sm tracking-wider uppercase group-hover:text-green-800 transition-colors duration-300">
                    <span>View Projects</span>
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-16">
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section with Background Elements */}
      <section className="bg-white py-14 px-4 md:px-8 lg:px-16 relative overflow-hidden">
        {/* Sophisticated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large organic shapes */}
          <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-gradient-to-br from-green-50/40 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/4"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-2/3 bg-gradient-to-tl from-green-100/30 to-transparent rounded-full blur-3xl transform translate-x-1/3 translate-y-1/4"></div>

          {/* Floating elements with different animations */}
          <div
            className="absolute top-32 right-1/4 w-8 h-8 bg-green-200/40 rounded-full animate-float"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute bottom-1/3 left-1/5 w-6 h-6 bg-green-300/30 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-2/3 right-1/6 w-4 h-4 bg-green-400/50 rounded-full animate-float"
            style={{ animationDelay: "4s" }}
          ></div>

          {/* Subtle line patterns */}
          <div className="absolute top-1/4 left-1/3 w-32 h-px bg-gradient-to-r from-transparent via-green-200/50 to-transparent transform rotate-45"></div>
          <div className="absolute bottom-1/3 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-green-300/40 to-transparent transform -rotate-45"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Contact content remains the same */}
          <div className="text-start mb-14">
            <div className="inline-flex items-center space-x-3 mb-8">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-green-600"></div>
              <span className="text-green-700 text-sm font-bold tracking-[0.2em] uppercase">
                Get In Touch
              </span>
              <div className="w-16 h-[1px] bg-gradient-to-r from-green-600 to-transparent"></div>
            </div>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-[0.9] tracking-tight mb-6">
              Contact Us{" "}
              <span className="italic font-light text-green-700">Now</span>
            </h2>
            <p className="text-2xl text-gray-600 font-light leading-relaxed italic max-w-3xl ">
              Ready to transform your vision into reality? We'd love to hear
              from you.
            </p>
          </div>

          {/* Contact Grid - keeping existing structure but with enhanced styling */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Send us a message
                </h3>
                <div className="w-20 h-[1px] bg-green-600 mb-8"></div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 tracking-wider uppercase">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 focus:border-green-600 focus:ring-0 bg-transparent text-lg font-light placeholder-gray-400 transition-colors duration-300"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 tracking-wider uppercase">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 focus:border-green-600 focus:ring-0 bg-transparent text-lg font-light placeholder-gray-400 transition-colors duration-300"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wider uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 focus:border-green-600 focus:ring-0 bg-transparent text-lg font-light placeholder-gray-400 transition-colors duration-300"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wider uppercase">
                    Company
                  </label>
                  <input
                    type="text"
                    className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 focus:border-green-600 focus:ring-0 bg-transparent text-lg font-light placeholder-gray-400 transition-colors duration-300"
                    placeholder="Your Company"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wider uppercase">
                    Project Type
                  </label>
                  <select className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 focus:border-green-600 focus:ring-0 bg-transparent text-lg font-light text-gray-700 transition-colors duration-300">
                    <option value="">Select a service</option>
                    <option value="automotive">Automotive Solutions</option>
                    <option value="experiences">Premium Experiences</option>
                    <option value="hospitality">Luxury Hospitality</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wider uppercase">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 focus:border-green-600 focus:ring-0 bg-transparent text-lg font-light placeholder-gray-400 resize-none transition-colors duration-300"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-green-500 text-white px-12 py-4 font-semibold tracking-wider uppercase text-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    <span className="relative z-10">Send Message</span>
                    <svg
                      className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Information - keeping existing structure */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Get in touch
                </h3>
                <div className="w-20 h-[1px] bg-green-600 mb-8"></div>
              </div>

              <div className="space-y-8">
                <div className="group">
                  <div className="border border-gray-200 p-8 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start space-x-4">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src="/src/assets/img/office.webp"
                          alt="Office Location"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                        <div className="absolute bottom-6 left-6">
                          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                            Visit Our Office
                          </h3>
                          <div className="w-16 h-[1px] bg-white/60"></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          Visit Our Office
                        </h4>
                        <p className="text-gray-600 font-light leading-relaxed">
                          123 Business District
                          <br />
                          Premium Tower, Floor 15
                          <br />
                          New York, NY 10001
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="border border-gray-200 p-8 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 border-2 border-green-600 flex items-center justify-center group-hover:bg-green-600 transition-all duration-300">
                        <svg
                          className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          Call Us
                        </h4>
                        <p className="text-gray-600 font-light leading-relaxed">
                          +1 (555) 123-4567
                          <br />
                          +1 (555) 987-6543
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Mon - Fri, 9AM - 6PM EST
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="border border-gray-200 p-8 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 border-2 border-green-600 flex items-center justify-center group-hover:bg-green-600 transition-all duration-300">
                        <svg
                          className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          Email Us
                        </h4>
                        <p className="text-gray-600 font-light leading-relaxed">
                          hello@yourcompany.com
                          <br />
                          projects@yourcompany.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  Follow Us
                </h4>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-12 h-12 border-2 border-gray-300 hover:border-green-600 flex items-center justify-center group transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 border-2 border-gray-300 hover:border-green-600 flex items-center justify-center group transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 border-2 border-gray-300 hover:border-green-600 flex items-center justify-center group transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white relative overflow-hidden">
        {/* Elegant Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle gradient orbs */}
          <div
            className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute bottom-0 -right-32 w-80 h-80 bg-gradient-to-tl from-green-800/15 to-green-900/8 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>

          {/* Elegant line patterns */}
          <div className="absolute top-1/4 left-1/6 w-px h-24 bg-gradient-to-b from-transparent via-green-700/30 to-transparent"></div>
          <div className="absolute bottom-1/3 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-green-700/20 to-transparent"></div>

          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Footer Content */}
          <div className="py-20">
            <div className="grid md:grid-cols-12 gap-12 mb-16">
            {/* Brand Section */}
            <div className="md:col-span-5">
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-px bg-gradient-to-r from-green-600 to-transparent"></div>
                        <img 
                            src="/src/assets/img/whiteLogo.png" 
                            alt="adtripy Logo" 
                            className="w-[200px]"
                        />
                    </div>
                    <div className="w-20 h-px bg-green-600 mb-6"></div>
                </div>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed font-light max-w-md">
                    Discover extraordinary vacation rentals around the world.
                    Experience luxury, comfort, and unforgettable memories with
                    our curated collection of premium properties.
                </p>

                {/* Social Media */}}
                <div className="space-y-4">
                  <h4 className="text-white font-medium text-sm tracking-wider uppercase mb-4">
                    Connect With Us
                  </h4>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="w-12 h-12 border border-green-700 hover:border-green-600 flex items-center justify-center hover:bg-green-700/10 transition-all duration-300 group"
                    >
                      <svg
                        className="w-5 h-5 text-green-600 group-hover:text-green-300 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 border border-green-700 hover:border-green-600 flex items-center justify-center hover:bg-green-700/10 transition-all duration-300 group"
                    >
                      <svg
                        className="w-5 h-5 text-green-600 group-hover:text-green-300 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 border border-green-700 hover:border-green-600 flex items-center justify-center hover:bg-green-700/10 transition-all duration-300 group"
                    >
                      <svg
                        className="w-5 h-5 text-green-600 group-hover:text-green-300 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 border border-green-700 hover:border-green-600 flex items-center justify-center hover:bg-green-700/10 transition-all duration-300 group"
                    >
                      <svg
                        className="w-5 h-5 text-green-600 group-hover:text-green-300 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Navigation Columns */}
              <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Discover */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-6 tracking-tight">
                    Discover
                  </h3>
                  <div className="w-8 h-px bg-green-600 mb-6"></div>
                  <ul className="space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        Luxury Villas
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        Beach Houses
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        Mountain Retreats
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        City Apartments
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        Private Islands
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-6 tracking-tight">
                    Services
                  </h3>
                  <div className="w-8 h-px bg-green-600 mb-6"></div>
                  <ul className="space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        Concierge Service
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        Private Chef
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        Transportation
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        Event Planning
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        Spa & Wellness
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-6 tracking-tight">
                    Company
                  </h3>
                  <div className="w-8 h-px bg-green-600 mb-6"></div>
                  <ul className="space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        Careers
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        Press
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        Partnerships
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                      >
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="border-t border-gray-800 pt-12 mb-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-light text-white mb-4 tracking-tight">
                    Stay{" "}
                    <span className="font-semibold text-green-600">
                      Informed
                    </span>
                  </h3>
                  <p className="text-gray-400 font-light leading-relaxed">
                    Subscribe to our newsletter for exclusive offers, luxury
                    travel insights, and curated property recommendations.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 bg-transparent border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-green-600 transition-colors duration-300 font-light"
                  />
                  <button className="bg-green-700 text-white px-8 py-3 font-medium tracking-wider uppercase text-sm hover:bg-green-600 transition-all duration-300 border border-green-700">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-8">
                  <p className="text-gray-400 font-light">
                    © 2025 LuxeStay. All rights reserved.
                  </p>
                  <div className="hidden md:flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-500 text-sm font-light">
                      Premium Travel Experiences
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light text-sm"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light text-sm"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light text-sm"
                  >
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Elegant Decorative Element */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-px bg-green-600"></div>
              <div className="w-1.5 h-1.5 border border-green-600 rotate-45"></div>
              <div className="w-6 h-px bg-green-600"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
