import { useEffect, useState } from "react"
import Navbar from "../../components/guest/Navbar"

export default function EnhancedLandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize page load animation
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // All the existing useEffect hooks remain the same
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed")
        }
      })
    }, observerOptions)

    document.querySelectorAll(".scroll-reveal").forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const animateCounter = (element) => {
    const target = Number.parseInt(element.getAttribute("data-target"))
    const duration = 2000
    const increment = target / (duration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      element.textContent = Math.floor(current).toLocaleString() + (target >= 1000 ? "+" : "")
    }, 16)
  }

  useEffect(() => {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target)
          counterObserver.unobserve(entry.target)
        }
      })
    })

    document.querySelectorAll(".counter").forEach((counter) => {
      counterObserver.observe(counter)
    })

    return () => counterObserver.disconnect()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX / window.innerWidth
      const mouseY = e.clientY / window.innerHeight

      document.querySelectorAll(".parallax").forEach((element) => {
        const speed = element.getAttribute("data-speed") || 0.5
        const x = (mouseX - 0.5) * speed * 50
        const y = (mouseY - 0.5) * speed * 50
        element.style.transform = `translate(${x}px, ${y}px)`
      })
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const searchInputs = document.querySelectorAll("input, select")

    const handleFocus = function () {
      this.parentElement.classList.add("animate-glow")
    }

    const handleBlur = function () {
      this.parentElement.classList.remove("animate-glow")
    }

    searchInputs.forEach((input) => {
      input.addEventListener("focus", handleFocus)
      input.addEventListener("blur", handleBlur)
    })

    return () => {
      searchInputs.forEach((input) => {
        input.removeEventListener("focus", handleFocus)
        input.removeEventListener("blur", handleBlur)
      })
    }
  }, [])

  useEffect(() => {
    const handleCardEnter = function () {
      this.style.transform = "perspective(1000px) rotateY(5deg) rotateX(5deg) translateZ(50px)"
    }

    const handleCardLeave = function () {
      this.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)"
    }

    const cards = document.querySelectorAll(".card-3d")
    cards.forEach((card) => {
      card.addEventListener("mouseenter", handleCardEnter)
      card.addEventListener("mouseleave", handleCardLeave)
    })

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", handleCardEnter)
        card.removeEventListener("mouseleave", handleCardLeave)
      })
    }
  }, [])

  // Enhanced typewriter effect
  useEffect(() => {
    const typewriterElements = document.querySelectorAll(".typewriter")

    typewriterElements.forEach((element, index) => {
      const text = element.textContent
      element.textContent = ""
      element.style.opacity = "1"

      setTimeout(() => {
        let i = 0
        const typeInterval = setInterval(() => {
          if (i < text.length) {
            element.textContent += text.charAt(i)
            i++
          } else {
            clearInterval(typeInterval)
            element.classList.add("typing-complete")
          }
        }, 50)
      }, index * 800)
    })
  }, [isLoaded])

  // Staggered text animation
  useEffect(() => {
    const staggeredElements = document.querySelectorAll(".stagger-text")

    staggeredElements.forEach((element) => {
      const words = element.textContent.split(" ")
      element.innerHTML = words
        .map((word, index) => `<span class="word-animate" style="animation-delay: ${index * 0.1}s">${word}</span>`)
        .join(" ")
    })
  }, [isLoaded])

  useEffect(() => {
    document.body.style.opacity = "0"
    document.body.style.transition = "opacity 0.5s ease-in-out"

    setTimeout(() => {
      document.body.style.opacity = "1"
    }, 100)
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    const button = e.currentTarget
    const input = button.parentElement.querySelector('input[type="email"]')

    if (input && input.value && input.value.includes("@")) {
      button.innerHTML = "✓ Subscribed!"
      button.classList.add("animate-bounce")
      input.value = ""

      setTimeout(() => {
        button.innerHTML = "Subscribe Now"
        button.classList.remove("animate-bounce")
      }, 3000)
    } else {
      input.classList.add("animate-bounce")
      input.style.borderColor = "#ef4444"

      setTimeout(() => {
        input.classList.remove("animate-bounce")
        input.style.borderColor = ""
      }, 1000)
    }
  }

  const handleBooking = (e) => {
    e.preventDefault()

    const button = e.currentTarget
    const originalText = button.textContent
    button.innerHTML =
      '<div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"></div>'
    button.disabled = true

    setTimeout(() => {
      button.innerHTML = "✓ Booking Confirmed!"
      button.classList.add("animate-pulse")

      setTimeout(() => {
        button.innerHTML = originalText
        button.disabled = false
        button.classList.remove("animate-pulse")
      }, 2000)
    }, 1500)
  }

  return (
    <div className="font-sans overflow-x-hidden">
      {/* Enhanced CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wordSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) rotateX(90deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
          }
        }

        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(16, 185, 129, 0.3);
          }
          50% {
            text-shadow: 0 0 20px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.4);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-bottom {
          animation: slideInFromBottom 0.8s ease-out forwards;
          opacity: 0;
        }

        .word-animate {
          display: inline-block;
          animation: wordSlideIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .typewriter {
          opacity: 0;
          border-right: 2px solid #10b981;
          animation: blink 1s infinite;
        }

        .typing-complete {
          border-right: none;
        }

        @keyframes blink {
          0%, 50% {
            border-color: #10b981;
          }
          51%, 100% {
            border-color: transparent;
          }
        }

        .text-glow {
          animation: textGlow 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-1500 { animation-delay: 1.5s; }

        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }

        .scroll-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .animate-glow {
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
        }
      `}</style>

      <Navbar />

      {/* Enhanced Hero Section with Advanced Text Animations */}
      <section className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay loop muted playsInline className="w-screen h-screen object-cover object-center">
            <source src="https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/videoBg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/30 sm:bg-black/25 lg:bg-black/30"></div>
        </div>

        <div className="relative h-screen z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-20 pb-20 sm:pt-24 sm:pb-24 md:pt-28 md:pb-28 lg:pt-32 lg:pb-32 xl:pt-30 xl:pb-30">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
              <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light leading-tight mb-4 sm:mb-6 md:mb-4 tracking-tight">
                <span className="typewriter animate-fade-in-up delay-300">Escape the ordinary.</span>
                <span className="block font-medium bg-gradient-to-r from-white xl:text-6xl to-gray-300 bg-clip-text text-transparent animate-fade-in-left delay-700">
                  <span className="typewriter">Discover extraordinary.</span>
                </span>
              </h1>

              <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-8 sm:mb-10 md:mb-12 text-gray-200 leading-relaxed max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
                <p className="stagger-text animate-fade-in-up delay-1000 font-light text-base sm:text-lg md:text-xl lg:text-2xl xl:text-lg">
                  Step into a curated collection of the world's most breathtaking vacation homes. From secluded mountain
                  retreats to oceanfront sanctuaries.
                </p>
              </div>

              {/* Enhanced Search Component with Staggered Animation */}
              <div className="animate-fade-in-scale delay-1500 mb-8 sm:mb-10 md:mb-12">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl">
                  <form className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="md:col-span-1 lg:col-span-1 animate-slide-in-bottom delay-100">
                      <label className="block text-sm font-medium text-white/90 mb-2">Where</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search destinations"
                          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
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

                    <div className="md:col-span-1 lg:col-span-1 animate-slide-in-bottom delay-200">
                      <label className="block text-sm font-medium text-white/90 mb-2">Check-in</label>
                      <input
                        type="date"
                        className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div className="md:col-span-1 lg:col-span-1 animate-slide-in-bottom delay-300">
                      <label className="block text-sm font-medium text-white/90 mb-2">Check-out</label>
                      <input
                        type="date"
                        className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div className="md:col-span-1 lg:col-span-1 animate-slide-in-bottom delay-500">
                      <label className="block text-sm font-medium text-white/90 mb-2">Guests</label>
                      <select className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300">
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

                    <div className="md:col-span-2 lg:col-span-1 flex items-end animate-slide-in-bottom delay-700">
                      <button
                        type="submit"
                        className="w-full bg-white text-black hover:bg-gray-100 transition-all duration-300 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-xl"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                  <div className="mt-6 pt-6 border-t border-white/20 animate-fade-in-up delay-1000">
                    <div className="flex flex-wrap gap-3">
                      <span className="text-sm text-white/80 font-medium">Popular:</span>
                      {["Beachfront", "Mountain View", "City Center", "Luxury Villa"].map((tag, index) => (
                        <button
                          key={tag}
                          className={`px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white transition-all duration-300 animate-fade-in-up delay-${1200 + index * 100}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2 animate-fade-in-up delay-1500">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-white/90">Price Range</label>
                      <span className="text-sm text-white/70">$50 - $500+ per night</span>
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

        {/* Enhanced floating elements with better animations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="block sm:hidden">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/40 rounded-full animate-float"></div>
            <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-float delay-1000"></div>
          </div>

          <div className="hidden sm:block">
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 rounded-full animate-float"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/60 rounded-full animate-float delay-500"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/30 rounded-full animate-float delay-1000"></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white/50 rounded-full animate-float delay-1500"></div>
            <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-white/40 rounded-full animate-float delay-200"></div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 md:h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
      </section>

      {/* Enhanced About Section with Scroll-triggered Animations */}
      <section
        className="py-24 px-4 md:px-8 lg:px-16 relative bg-cover bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: "url('https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/homeBg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-white/90"></div>

        {/* Enhanced floating background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-100/30 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-green-200/20 rounded-full blur-lg animate-float delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-50/40 rounded-full blur-2xl animate-float delay-500"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-green-100/25 rounded-full blur-xl animate-float delay-1500"></div>

          <div className="absolute top-1/3 left-1/5 w-2 h-2 bg-green-400/60 rounded-full animate-float delay-300"></div>
          <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-green-500/50 rounded-full animate-float delay-700"></div>
          <div className="absolute bottom-1/3 left-2/3 w-2.5 h-2.5 bg-green-300/40 rounded-full animate-float delay-1200"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-12 mb-6 gap-12 items-center">
            <div className="col-span-12 lg:col-span-6 space-y-8">
              <div className="inline-flex items-center space-x-3 scroll-reveal">
                <div className="w-12 h-[1px] bg-gradient-to-r from-green-600 to-green-400"></div>
                <span className="text-green-700 text-sm font-bold tracking-[0.2em] uppercase">Our Mission</span>
                <div className="w-12 h-[1px] bg-gradient-to-r from-green-400 to-transparent"></div>
              </div>

              <div className="space-y-4 scroll-reveal">
                <h2 className="stagger-text text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 leading-[0.9] tracking-tight">
                  make
                </h2>
                <h2 className="stagger-text text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[0.9] tracking-tight">
                  your <span className="italic font-light text-green-700 text-glow">trip booked</span>
                </h2>
                <h2 className="stagger-text text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 leading-[0.9] tracking-tight">
                  in one place
                </h2>
              </div>

              <p className="scroll-reveal text-2xl text-gray-600 font-light leading-relaxed italic">
                Your journey to digital excellence starts here.
              </p>
            </div>

            <div className="col-span-12 lg:col-span-6 space-y-8">
              <div className="space-y-6 scroll-reveal">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-green-600 to-green-400 rounded-full"></div>
                  <p className="text-lg text-gray-700 leading-relaxed font-light">
                    We believe in transforming travel visions into reality. From cars to stays to unforgettable
                    experiences — we make every journey possible.
                  </p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-green-400 to-green-200 rounded-full"></div>
                  <p className="text-lg text-gray-700 leading-relaxed font-light">
                    With smart planning and seamless solutions, we create travel experiences that inspire. Excellence
                    isn't just our goal — it's what we deliver, every step of the journey.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 scroll-reveal">
                <div className="text-center">
                  <div className="counter text-3xl font-bold text-green-700" data-target="250">
                    0
                  </div>
                  <div className="text-sm text-gray-600 font-medium tracking-wider uppercase">collaborators</div>
                </div>
                <div className="text-center">
                  <div className="counter text-3xl font-bold text-green-700" data-target="15">
                    0
                  </div>
                  <div className="text-sm text-gray-600 font-medium tracking-wider uppercase">Years</div>
                </div>
                <div className="text-center">
                  <div className="counter text-3xl font-bold text-green-700" data-target="98">
                    0
                  </div>
                  <div className="text-sm text-gray-600 font-medium tracking-wider uppercase">Success</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced images grid with hover animations */}
          <div className="grid grid-cols-12 gap-8 mb-16">
            <div className="col-span-12 lg:col-span-7 scroll-reveal">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent rounded-3xl"></div>
                <img
                  src="https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/exp.jpg"
                  alt="Modern office interior"
                  className="w-full h-[500px] object-cover rounded-3xl shadow-2xl transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-3xl"
                />
                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-green-700 font-semibold text-sm tracking-wider">EXCELLENCE</span>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 space-y-6">
              <div className="relative group scroll-reveal">
                <img
                  src="https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/sahra2.jpg"
                  alt="Modern building exterior"
                  className="w-full h-[240px] object-cover rounded-2xl shadow-xl transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
              <div className="relative group scroll-reveal">
                <img
                  src="https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/picine.jpg"
                  alt="Modern architecture"
                  className="w-full h-[240px] object-cover rounded-2xl shadow-xl transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl"
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

      {/* Rest of the sections remain the same but with enhanced scroll-reveal animations */}
      <section className="relative py-16 border border-t-green-600 bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-green-50/60 to-green-100/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/2 -right-40 w-72 h-72 bg-gradient-to-bl from-green-100/40 to-green-50/20 rounded-full blur-3xl animate-float delay-1000"></div>
        </div>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <div className="inline-flex items-center space-x-4 mb-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-green-600"></div>
              <span className="text-green-700 text-sm font-semibold tracking-[0.3em] uppercase">Curated Offers</span>
              <div className="w-16 h-px bg-gradient-to-r from-green-600 to-transparent"></div>
            </div>

            <h2 className="stagger-text text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Exclusive <span className="font-semibold text-green-700 italic text-glow">Collection</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              Handpicked luxury experiences designed for the discerning traveler
            </p>
          </div>

          {/* Enhanced cards with staggered animations */}
          <div className="flex flex-row gap-8 overflow-x-auto overflow-y-hidden scroll-smooth pb-4">
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                title: "Lamborghini Huracán",
                description:
                  "Experience automotive excellence with our premium supercar collection and white-glove service.",
                price: "$899",
                period: "/day",
                rating: "4.9 • 156 reviews",
                delay: "delay-100",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                title: "Private Helicopter Tour",
                description: "Soar above breathtaking landscapes with champagne service and professional photography.",
                price: "$1,299",
                period: "/tour",
                rating: "4.8 • 89 reviews",
                delay: "delay-200",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                title: "Oceanfront Villa",
                description: "Stunning villa with infinity pool, private beach access, and world-class amenities.",
                price: "$2,450",
                period: "/night",
                rating: "4.9 • 234 reviews",
                delay: "delay-300",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                title: "Luxury Yacht Charter",
                description: "Set sail with professional crew, gourmet dining, and access to exclusive destinations.",
                price: "$3,500",
                period: "/day",
                rating: "4.9 • 67 reviews",
                delay: "delay-500",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                title: "Premium Wine Tasting",
                description: "Exclusive vineyard tours with sommelier-guided tastings of rare vintage wines.",
                price: "$299",
                period: "/person",
                rating: "4.7 • 143 reviews",
                delay: "delay-700",
              },
            ].map((card, index) => (
              <div key={index} className={`flex-shrink-0 w-80 scroll-reveal ${card.delay}`}>
                <div className="card-3d bg-white border border-green-100 hover:border-green-200 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(16,185,129,0.1)] group">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={card.image || "/placeholder.svg"}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <button className="bg-white/95 backdrop-blur-sm p-2 border border-green-200 hover:bg-green-50 transition-all duration-300 transform hover:scale-110">
                        <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          <div key={i} className="w-1 h-1 bg-green-600 rounded-full"></div>
                        ))}
                      </div>
                      <span className="text-gray-500 text-xs font-light">{card.rating}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight group-hover:text-green-700 transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 font-light leading-relaxed">{card.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-light text-gray-900">{card.price}</span>
                        <span className="text-gray-500 text-sm font-light">{card.period}</span>
                      </div>
                      <button className="bg-green-700 text-white px-6 py-2.5 text-sm font-medium tracking-wider uppercase hover:bg-green-800 transition-all duration-300 border border-green-700 transform hover:scale-105">
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 scroll-reveal">
            <button className="inline-flex items-center space-x-3 bg-white border-2 border-green-700 text-green-700 px-10 py-4 font-medium tracking-wider uppercase text-sm hover:bg-green-700 hover:text-white transition-all duration-500 transform hover:scale-105">
              <span>View Complete Collection</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Continue with the rest of your sections... */}
      {/* I'll keep the remaining sections as they were but add scroll-reveal classes */}

      <section className="bg-black text-white py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-bl from-green-400/15 to-green-500/8 rounded-full blur-3xl animate-float delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 scroll-reveal">
              <div className="inline-flex items-center space-x-3">
                <div className="w-12 h-[1px] bg-gradient-to-r from-green-500 to-green-400"></div>
                <span className="text-green-600 text-sm font-bold tracking-[0.2em] uppercase">Become a Host</span>
                <div className="w-12 h-[1px] bg-gradient-to-r from-green-400 to-transparent"></div>
              </div>

              <div className="space-y-4">
                <h2 className="stagger-text text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[0.9] tracking-tight">
                  Ready to
                </h2>
                <h2 className="stagger-text text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[0.9] tracking-tight">
                  <span className="italic font-light text-green-600 text-glow">share</span> your
                </h2>
                <h2 className="stagger-text text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[0.9] tracking-tight">
                  extraordinary space?
                </h2>
              </div>

              <div className="space-y-6 scroll-reveal">
                <p className="text-xl text-gray-300 font-light leading-relaxed">
                  Transform your property into a premium destination. Join our exclusive network of luxury hosts and
                  start earning with unparalleled support.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      title: "Premium Listing Exposure",
                      description: "Showcase your property to discerning travelers worldwide",
                    },
                    {
                      title: "24/7 Concierge Support",
                      description: "Dedicated support team handling guest communications",
                    },
                    {
                      title: "Guaranteed Income Protection",
                      description: "Comprehensive insurance and damage protection coverage",
                    },
                  ].map((feature, index) => (
                    <div key={index} className={`flex items-start space-x-4 scroll-reveal delay-${(index + 1) * 100}`}>
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">{feature.title}</h4>
                        <p className="text-gray-400 font-light">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-8 scroll-reveal">
                <button className="group relative inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 text-black px-8 py-4 font-bold tracking-wider uppercase text-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <span className="relative z-10">Start Hosting Today</span>
                  <svg
                    className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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

            <div className="relative scroll-reveal">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-3xl transform rotate-3"></div>
                <img
                  src="https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/exp1.jpg"
                  alt="Become a Host"
                  className="relative w-full object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-3xl"></div>
              </div>
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-float"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-green-400/30 rounded-full blur-lg animate-float delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section - keeping existing structure but adding scroll animations */}
      <section className="bg-gray-50 py-14 border-t-green-500 px-4 md:px-8 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-green-100/20 to-green-200/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-bl from-green-50/30 to-green-100/15 rounded-full blur-3xl animate-float delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 scroll-reveal">
            <div className="inline-flex items-center space-x-3 mb-8">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-green-600"></div>
              <span className="text-green-700 text-sm font-bold tracking-[0.2em] uppercase">Our Partners</span>
              <div className="w-16 h-[1px] bg-gradient-to-r from-green-600 to-transparent"></div>
            </div>

            <h2 className="stagger-text text-5xl md:text-5xl lg:text-5xl font-light text-gray-900 leading-[0.9] tracking-tight mb-6">
              Trusted by <span className="italic font-light text-green-700 text-glow">Industry</span>
            </h2>
            <h2 className="stagger-text text-4xl md:text-4xl lg:text-4xl font-bold text-gray-900 leading-[0.9] tracking-tight mb-8">
              Leaders
            </h2>

            <p className="text-xl text-gray-600 font-light leading-relaxed italic max-w-3xl mx-auto">
              Collaborating with premium brands across automotive, hospitality, and experiential sectors.
            </p>
          </div>

          {/* Enhanced partner cards with staggered animations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            {[
              {
                image: "https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/exp1.jpg",
                title: "Premium Experiences",
                description:
                  "Creating unforgettable moments with event agencies and experience curators who define luxury in their respective fields.",
                partners: ["LuxEvents Global", "Prestige Experiences", "Elite Curation"],
                delay: "delay-100",
              },
              {
                image: "https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/cars.jpg",
                title: "Automotive Excellence",
                description:
                  "Partnering with luxury car dealerships and automotive brands to create exceptional digital experiences that drive performance.",
                partners: ["BMW Group", "Mercedes-Benz", "Porsche"],
                delay: "delay-300",
              },
              {
                image: "https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/hotel1.jpg",
                title: "Luxury Hospitality",
                description:
                  "Elevating hospitality brands with sophisticated digital solutions and seamless booking experiences that exceed expectations.",
                partners: ["Marriott International", "Hilton Worldwide", "Four Seasons Hotels"],
                delay: "delay-500",
              },
            ].map((card, index) => (
              <div key={index} className={`group cursor-pointer scroll-reveal ${card.delay}`}>
                <div className="bg-white rounded-none border border-gray-200 hover:border-green-300 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={card.image || "/placeholder.svg"}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                    <div className="absolute bottom-6 left-6">
                      <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{card.title}</h3>
                      <div className="w-16 h-[1px] bg-white/60"></div>
                    </div>
                  </div>

                  <div className="p-8">
                    <p className="text-gray-600 leading-relaxed mb-8 font-light">{card.description}</p>

                    <div className="space-y-3">
                      {card.partners.map((partner, partnerIndex) => (
                        <div
                          key={partnerIndex}
                          className="flex items-center justify-between py-3 border-b border-gray-100 group-hover:border-green-100 transition-colors duration-300"
                        >
                          <span className="font-medium text-gray-800">{partner}</span>
                          <div className="w-2 h-2 bg-green-600 rounded-full opacity-60"></div>
                        </div>
                      ))}
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
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section with enhanced animations */}
      <section className="bg-white py-14 px-4 md:px-8 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-gradient-to-br from-green-50/40 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/4 animate-float"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-2/3 bg-gradient-to-tl from-green-100/30 to-transparent rounded-full blur-3xl transform translate-x-1/3 translate-y-1/4 animate-float delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-start mb-14 scroll-reveal">
            <div className="inline-flex items-center space-x-3 mb-8">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-green-600"></div>
              <span className="text-green-700 text-sm font-bold tracking-[0.2em] uppercase">Get In Touch</span>
              <div className="w-16 h-[1px] bg-gradient-to-r from-green-600 to-transparent"></div>
            </div>

            <h2 className="stagger-text text-2xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-[0.9] tracking-tight mb-6">
              Contact Us <span className="italic font-light text-green-700 text-glow">Now</span>
            </h2>
            <p className="text-2xl text-gray-600 font-light leading-relaxed italic max-w-3xl">
              Ready to transform your vision into reality? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            {/* Enhanced Contact Form */}
            <div className="space-y-8 scroll-reveal">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Send us a message</h3>
                <div className="w-20 h-[1px] bg-green-600 mb-8"></div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 scroll-reveal delay-100">
                    <label className="text-sm font-medium text-gray-700 tracking-wider uppercase">First Name</label>
                    <input
                      type="text"
                      className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 focus:border-green-600 focus:ring-0 bg-transparent text-lg font-light placeholder-gray-400 transition-all duration-300"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2 scroll-reveal delay-200">
                    <label className="text-sm font-medium text-gray-700 tracking-wider uppercase">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 focus:border-green-600 focus:ring-0 bg-transparent text-lg font-light placeholder-gray-400 transition-all duration-300"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {["Email Address", "Company", "Project Type"].map((field, index) => (
                  <div key={field} className={`space-y-2 scroll-reveal delay-${300 + index * 100}`}>
                    <label className="text-sm font-medium text-gray-700 tracking-wider uppercase">{field}</label>
                    {field === "Project Type" ? (
                      <select className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 focus:border-green-600 focus:ring-0 bg-transparent text-lg font-light text-gray-700 transition-all duration-300">
                        <option value="">Select a service</option>
                        <option value="automotive">Automotive Solutions</option>
                        <option value="experiences">Premium Experiences</option>
                        <option value="hospitality">Luxury Hospitality</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <input
                        type={field === "Email Address" ? "email" : "text"}
                        className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 focus:border-green-600 focus:ring-0 bg-transparent text-lg font-light placeholder-gray-400 transition-all duration-300"
                        placeholder={
                          field === "Email Address" ? "john@example.com" : field === "Company" ? "Your Company" : ""
                        }
                      />
                    )}
                  </div>
                ))}

                <div className="space-y-2 scroll-reveal delay-700">
                  <label className="text-sm font-medium text-gray-700 tracking-wider uppercase">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 focus:border-green-600 focus:ring-0 bg-transparent text-lg font-light placeholder-gray-400 resize-none transition-all duration-300"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>

                <div className="pt-8 scroll-reveal delay-1000">
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

            {/* Enhanced Contact Information */}
            <div className="space-y-12 scroll-reveal delay-300">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Get in touch</h3>
                <div className="w-20 h-[1px] bg-green-600 mb-8"></div>
              </div>

              <div className="space-y-8">
                {[
                  {
                    icon: "office",
                    title: "Visit Our Office",
                    content: "123 Business District\nPremium Tower, Floor 15\nNew York, NY 10001",
                    image: "https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/office.webp",
                  },
                  {
                    icon: "phone",
                    title: "Call Us",
                    content: "+1 (555) 123-4567\n+1 (555) 987-6543",
                    extra: "Mon - Fri, 9AM - 6PM EST",
                  },
                  {
                    icon: "email",
                    title: "Email Us",
                    content: "hello@yourcompany.com\nprojects@yourcompany.com",
                  },
                ].map((contact, index) => (
                  <div key={index} className={`group scroll-reveal delay-${400 + index * 100}`}>
                    <div className="border border-gray-200 p-8 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start space-x-4">
                        {contact.image ? (
                          <div className="relative h-64 overflow-hidden flex-1">
                            <img
                              src={contact.image || "/placeholder.svg"}
                              alt={contact.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-6 left-6">
                              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{contact.title}</h3>
                              <div className="w-16 h-[1px] bg-white/60"></div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 border-2 border-green-600 flex items-center justify-center group-hover:bg-green-600 transition-all duration-300">
                              <svg
                                className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                {contact.icon === "phone" ? (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                ) : (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                )}
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-2">{contact.title}</h4>
                              <p className="text-gray-600 font-light leading-relaxed whitespace-pre-line">
                                {contact.content}
                              </p>
                              {contact.extra && <p className="text-sm text-gray-500 mt-2">{contact.extra}</p>}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-gray-200 scroll-reveal delay-700">
                <h4 className="text-lg font-bold text-gray-900 mb-6">Follow Us</h4>
                <div className="flex space-x-4">
                  {["twitter", "linkedin", "pinterest"].map((social, index) => (
                    <a
                      key={social}
                      href="#"
                      className={`w-12 h-12 border-2 border-gray-300 hover:border-green-600 flex items-center justify-center group transition-all duration-300 animate-fade-in-up delay-${800 + index * 100}`}
                    >
                      <svg
                        className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {social === "twitter" && (
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        )}
                        {social === "linkedin" && (
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        )}
                        {social === "pinterest" && (
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                        )}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 -right-32 w-80 h-80 bg-gradient-to-tl from-green-800/15 to-green-900/8 rounded-full blur-3xl animate-float delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20">
            <div className="grid md:grid-cols-12 gap-12 mb-16">
              <div className="md:col-span-5 scroll-reveal">
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-px bg-gradient-to-r from-green-600 to-transparent"></div>
                    <img src="https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/whiteLogo.png" alt="adtripy Logo" className="w-[200px]" />
                  </div>
                  <div className="w-20 h-px bg-green-600 mb-6"></div>
                </div>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed font-light max-w-md">
                  Discover extraordinary vacation rentals around the world. Experience luxury, comfort, and
                  unforgettable memories with our curated collection of premium properties.
                </p>

                <div className="space-y-4">
                  <h4 className="text-white font-medium text-sm tracking-wider uppercase mb-4">Connect With Us</h4>
                  <div className="flex space-x-4">
                    {["twitter", "facebook", "linkedin", "pinterest"].map((social, index) => (
                      <a
                        key={social}
                        href="#"
                        className={`w-12 h-12 border border-green-700 hover:border-green-600 flex items-center justify-center hover:bg-green-700/10 transition-all duration-300 group animate-fade-in-up delay-${100 + index * 100}`}
                      >
                        <svg
                          className="w-5 h-5 text-green-600 group-hover:text-green-300 transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {social === "twitter" && (
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          )}
                          {social === "facebook" && (
                            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                          )}
                          {social === "linkedin" && (
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          )}
                          {social === "pinterest" && (
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                          )}
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Discover",
                    links: ["Luxury Villas", "Beach Houses", "Mountain Retreats", "City Apartments", "Private Islands"],
                  },
                  {
                    title: "Services",
                    links: ["Concierge Service", "Private Chef", "Transportation", "Event Planning", "Spa & Wellness"],
                  },
                  {
                    title: "Company",
                    links: ["About Us", "Careers", "Press", "Partnerships", "Contact"],
                  },
                ].map((section, index) => (
                  <div key={section.title} className={`scroll-reveal delay-${200 + index * 100}`}>
                    <h3 className="text-white font-semibold text-lg mb-6 tracking-tight">{section.title}</h3>
                    <div className="w-8 h-px bg-green-600 mb-6"></div>
                    <ul className="space-y-4">
                      {section.links.map((link, linkIndex) => (
                        <li key={link} className={`animate-fade-in-up delay-${300 + index * 100 + linkIndex * 50}`}>
                          <a
                            href="#"
                            className="text-gray-400 hover:text-green-600 transition-colors duration-300 font-light"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="border-t border-gray-800 pt-12 mb-12 scroll-reveal">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-light text-white mb-4 tracking-tight">
                    Stay <span className="font-semibold text-green-600 text-glow">Informed</span>
                  </h3>
                  <p className="text-gray-400 font-light leading-relaxed">
                    Subscribe to our newsletter for exclusive offers, luxury travel insights, and curated property
                    recommendations.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 bg-transparent border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-green-600 transition-colors duration-300 font-light"
                  />
                  <button
                    onClick={handleSubscribe}
                    className="bg-green-700 text-white px-8 py-3 font-medium tracking-wider uppercase text-sm hover:bg-green-600 transition-all duration-300 border border-green-700 transform hover:scale-105"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-800 pt-8 scroll-reveal">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-8">
                  <p className="text-gray-400 font-light">© 2025 Adtripy. All rights reserved.</p>
                  <div className="hidden md:flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-float"></div>
                    <span className="text-gray-500 text-sm font-light">Premium Travel Experiences</span>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link, index) => (
                    <a
                      key={link}
                      href="#"
                      className={`text-gray-400 hover:text-green-600 transition-colors duration-300 font-light text-sm animate-fade-in-up delay-${100 + index * 100}`}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Elegant Decorative Element */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-3 animate-float">
              <div className="w-6 h-px bg-green-600"></div>
              <div className="w-1.5 h-1.5 border border-green-600 rotate-45"></div>
              <div className="w-6 h-px bg-green-600"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
