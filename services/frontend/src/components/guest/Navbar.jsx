import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Search,
  Menu,
  User,
  Globe,
  Calendar,
  MapPin,
  Car,
  Home,
  Compass,
  Phone,
  Heart,
  Settings,
  X,
} from "lucide-react";
import { useAuthStore } from "../../store/AuthStore";

const BookingNavbar = () => {
  const logout = useAuthStore((state) => state.logout);

  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Add glass effect when scrolled
      setIsScrolled(currentScrollY > 50);

      // Hide/show navbar on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout action from AuthStore
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const DropdownMenu = ({ trigger, children, isOpen, onToggle }) => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
          isScrolled
            ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            : "text-white/90 hover:text-white hover:bg-white/10"
        }`}
      >
        {trigger}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {children}
        </div>
      )}
    </div>
  );

  const DropdownItem = ({ href, children, icon: Icon }) => (
    <a
      href={href}
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
      onClick={() => setOpenDropdown(null)}
    >
      {Icon && <Icon className="w-4 h-4 mr-3" />}
      {children}
    </a>
  );

  const DropdownLabel = ({ children }) => (
    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-1">
      {children}
    </div>
  );

  const DropdownSeparator = () => (
    <div className="border-t border-gray-100 my-1" />
  );

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
            : "bg-transparent py-4"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-7xl mx-auto px-4 pt-2 pb-2 sm:px-6 lg:px-1">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="" className="flex items-center space-x-2">
              <img
                src={
                  isScrolled
                    ? "https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/logoAdtripy.png"
                    : "https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/whiteLogo.png"
                }
                alt="LuxeStay Logo"
                className="w-[140px] transition-all duration-300"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Accommodation Dropdown */}
              <DropdownMenu
                trigger={
                  <>
                    <Home className="w-4 h-4 mr-2" />
                    Accommodation
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                }
                isOpen={openDropdown === "accommodation"}
                onToggle={() => toggleDropdown("accommodation")}
              >
                <DropdownLabel>Stay Types</DropdownLabel>
                <DropdownItem href="/hotels">Hotels & Resorts</DropdownItem>
                <DropdownItem href="/apartments">
                  Apartments & Condos
                </DropdownItem>
                <DropdownItem href="/villas">Villas & Houses</DropdownItem>
                <DropdownItem href="/unique">Unique Stays</DropdownItem>
                <DropdownSeparator />
                <DropdownItem href="/luxury">Luxury Collection</DropdownItem>
              </DropdownMenu>

              {/* Car Rental Dropdown */}
              <DropdownMenu
                trigger={
                  <>
                    <Car className="w-4 h-4 mr-2" />
                    Car Rental
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                }
                isOpen={openDropdown === "cars"}
                onToggle={() => toggleDropdown("cars")}
              >
                <DropdownLabel>Vehicle Types</DropdownLabel>
                <DropdownItem href="/cars/economy">Economy Cars</DropdownItem>
                <DropdownItem href="/cars/luxury">Luxury Vehicles</DropdownItem>
                <DropdownItem href="/cars/suv">SUVs & Trucks</DropdownItem>
                <DropdownItem href="/cars/electric">
                  Electric Vehicles
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem href="/cars/long-term">
                  Long-term Rentals
                </DropdownItem>
              </DropdownMenu>

              {/* Experiences Dropdown */}
              <DropdownMenu
                trigger={
                  <>
                    <Compass className="w-4 h-4 mr-2" />
                    Experiences
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                }
                isOpen={openDropdown === "experiences"}
                onToggle={() => toggleDropdown("experiences")}
              >
                <DropdownLabel>Activity Types</DropdownLabel>
                <DropdownItem href="/experiences/tours">
                  Guided Tours
                </DropdownItem>
                <DropdownItem href="/experiences/adventure">
                  Adventure Sports
                </DropdownItem>
                <DropdownItem href="/experiences/cultural">
                  Cultural Experiences
                </DropdownItem>
                <DropdownItem href="/experiences/food">
                  Food & Wine
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem href="/experiences/premium">
                  Premium Experiences
                </DropdownItem>
              </DropdownMenu>

              {/* Destinations Dropdown */}
              <DropdownMenu
                trigger={
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Destinations
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                }
                isOpen={openDropdown === "destinations"}
                onToggle={() => toggleDropdown("destinations")}
              >
                <DropdownLabel>Popular Destinations</DropdownLabel>
                <DropdownItem href="/destinations/europe">Europe</DropdownItem>
                <DropdownItem href="/destinations/asia">Asia</DropdownItem>
                <DropdownItem href="/destinations/americas">
                  Americas
                </DropdownItem>
                <DropdownItem href="/destinations/africa">Africa</DropdownItem>
                <DropdownSeparator />
                <DropdownItem href="/destinations/trending">
                  Trending Now
                </DropdownItem>
              </DropdownMenu>
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Search */}
              <button
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isScrolled
                    ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                <Search className="w-4 h-4" />
              </button>
              {/* Language/Currency */}
              <DropdownMenu
                trigger={<Globe className="w-4 h-4" />}
                isOpen={openDropdown === "language"}
                onToggle={() => toggleDropdown("language")}
              >
                <DropdownLabel>Language & Currency</DropdownLabel>
                <DropdownItem href="#">English (USD)</DropdownItem>
                <DropdownItem href="#">Français (EUR)</DropdownItem>
                <DropdownItem href="#">Español (EUR)</DropdownItem>
                <DropdownItem href="#">Deutsch (EUR)</DropdownItem>
              </DropdownMenu>
          
              <DropdownMenu
                trigger={
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Account
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                }
                isOpen={openDropdown === "account"}
                onToggle={() => toggleDropdown("account")}
              >
                <DropdownItem href="/signin">Sign In</DropdownItem>
                <DropdownItem href="/signup">Create Account</DropdownItem>
                <DropdownSeparator />
                <DropdownItem href="/bookings" icon={Calendar}>
                  My Bookings
                </DropdownItem>
                <DropdownItem href="/favorites" icon={Heart}>
                  Favorites
                </DropdownItem>
                <DropdownItem href="/profile" icon={Settings}>
                  Profile Settings
                </DropdownItem>
              </DropdownMenu>
              <button
                onClick={handleLogout}
                className="rounded-md border border-white py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-white cursor-pointer hover:text-white hover:bg-green-600 hover:border-green-600 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Navigation Sections */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Accommodation
                  </h3>
                  <div className="space-y-2 ml-6">
                    <a
                      href="/hotels"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Hotels & Resorts
                    </a>
                    <a
                      href="/apartments"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Apartments
                    </a>
                    <a
                      href="/villas"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Villas & Houses
                    </a>
                    <a
                      href="/unique"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Unique Stays
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    Car Rental
                  </h3>
                  <div className="space-y-2 ml-6">
                    <a
                      href="/cars/economy"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Economy Cars
                    </a>
                    <a
                      href="/cars/luxury"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Luxury Vehicles
                    </a>
                    <a
                      href="/cars/suv"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      SUVs & Trucks
                    </a>
                    <a
                      href="/cars/electric"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Electric Vehicles
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Compass className="w-4 h-4 mr-2" />
                    Experiences
                  </h3>
                  <div className="space-y-2 ml-6">
                    <a
                      href="/experiences/tours"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Guided Tours
                    </a>
                    <a
                      href="/experiences/adventure"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Adventure Sports
                    </a>
                    <a
                      href="/experiences/cultural"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Cultural
                    </a>
                    <a
                      href="/experiences/food"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Food & Wine
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Destinations
                  </h3>
                  <div className="space-y-2 ml-6">
                    <a
                      href="/destinations/europe"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Europe
                    </a>
                    <a
                      href="/destinations/asia"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Asia
                    </a>
                    <a
                      href="/destinations/americas"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Americas
                    </a>
                    <a
                      href="/destinations/africa"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                    >
                      Africa
                    </a>
                  </div>
                </div>
              </div>

              {/* User Actions */}
              <div className="border-t pt-4 space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-600 to-red-600 text-white py-2 rounded-lg font-semibold hover:from-red-700 hover:to-red-700 transition-all duration-300"
                >
                  Logout
                </button>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <button className="flex items-center px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <Globe className="w-4 h-4 mr-1" />
                    EN/USD
                  </button>
                  <button className="flex items-center px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <Phone className="w-4 h-4 mr-1" />
                    Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingNavbar;
