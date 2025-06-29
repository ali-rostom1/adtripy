import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
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
} from "lucide-react"
import { useAuthStore } from "../../store/AuthStore"

const BookingNavbar = () => {
  const { user, logout } = useAuthStore()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  const dropdownRef = useRef(null)

  // Create user display name
  const userDisplayName = user ? `${user.firstName} ${user.lastName}` : "Account"

  // Update the handleLogout function
  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem("auth-storage")
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
      })
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed:", error)
      localStorage.removeItem("auth-storage")
      window.location.reload()
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
  }

  const DropdownMenu = ({ trigger, children, isOpen, onToggle }) => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
      >
        {trigger}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {children}
        </div>
      )}
    </div>
  )

  const DropdownItem = ({ to, children, icon: Icon, onClick }) => (
    <Link
      to={to}
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
      onClick={() => {
        setOpenDropdown(null)
        if (onClick) onClick()
      }}
    >
      {Icon && <Icon className="w-4 h-4 mr-3" />}
      {children}
    </Link>
  )

  const DropdownLabel = ({ children }) => (
    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-1">
      {children}
    </div>
  )

  const DropdownSeparator = () => <div className="border-t border-gray-100 my-1" />

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/logoAdtripy.png"
                alt="AdTripy Logo"
                className="w-[140px] transition-all duration-300"
              />
            </Link>

            {/* Desktop Navigation - Updated with proper links */}
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
                <DropdownLabel>Stay Options</DropdownLabel>
                <DropdownItem to="/stays">Browse All Stays</DropdownItem>
                <DropdownItem to="/stays/create">List Your Property</DropdownItem>
                <DropdownSeparator />
                <DropdownItem to="/stays?type=luxury">Luxury Collection</DropdownItem>
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
                <DropdownLabel>Car Options</DropdownLabel>
                <DropdownItem to="/cars">Browse All Cars</DropdownItem>
                <DropdownItem to="/cars/create">List Your Vehicle</DropdownItem>
                <DropdownSeparator />
                <DropdownItem to="/cars?type=luxury">Premium Vehicles</DropdownItem>
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
                <DropdownItem to="/experiences">Browse All Experiences</DropdownItem>
                <DropdownItem to="/experiences/create">Host an Experience</DropdownItem>
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
                <DropdownItem to="/destinations/europe">Europe</DropdownItem>
                <DropdownItem to="/destinations/asia">Asia</DropdownItem>
                <DropdownItem to="/destinations/americas">Americas</DropdownItem>
              </DropdownMenu>
            </div>

            {/* Right Side Actions - Updated with user name */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Search */}
              <button className="p-2 rounded-lg transition-all duration-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                <Search className="w-4 h-4" />
              </button>

              {/* Language/Currency */}
              <DropdownMenu
                trigger={<Globe className="w-4 h-4" />}
                isOpen={openDropdown === "language"}
                onToggle={() => toggleDropdown("language")}
              >
                <DropdownLabel>Language & Currency</DropdownLabel>
                <DropdownItem to="#">English (USD)</DropdownItem>
                <DropdownItem to="#">Français (EUR)</DropdownItem>
              </DropdownMenu>

              {/* User Account - Updated to show user name */}
              <DropdownMenu
                trigger={
                  <>
                    <User className="w-4 h-4 mr-2" />
                    {userDisplayName}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                }
                isOpen={openDropdown === "account"}
                onToggle={() => toggleDropdown("account")}
              >
                {!user ? (
                  <>
                    <DropdownItem to="/login">Sign In</DropdownItem>
                    <DropdownItem to="/register">Create Account</DropdownItem>
                  </>
                ) : (
                  <>
                    <DropdownLabel>Welcome, {user.firstName}!</DropdownLabel>
                    <DropdownItem to="/profile" icon={User}>
                      My Profile
                    </DropdownItem>
                    <DropdownItem to="/bookings" icon={Calendar}>
                      My Bookings
                    </DropdownItem>
                    <DropdownItem to="/favorites" icon={Heart}>
                      Favorites
                    </DropdownItem>
                    <DropdownItem to="/profile/update" icon={Settings}>
                      Settings
                    </DropdownItem>
                    <DropdownSeparator />
                    <div
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <X className="w-4 h-4 mr-3" />
                      Logout
                    </div>
                  </>
                )}
              </DropdownMenu>

              {/* Only show logout button if user is logged in */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="rounded-md border border-green-600 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-green-600 cursor-pointer hover:text-white hover:bg-green-600 focus:text-white focus:bg-green-700 focus:border-green-700"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg transition-colors duration-300 text-gray-700 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Updated with proper links and user info */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
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
              {/* User greeting if logged in */}
              {user && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-500">Welcome back,</p>
                  <p className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Navigation Sections - Updated with proper links */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Accommodation
                  </h3>
                  <div className="space-y-2 ml-6">
                    <Link
                      to="/stays"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Browse All Stays
                    </Link>
                    <Link
                      to="/stays/create"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      List Your Property
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    Car Rental
                  </h3>
                  <div className="space-y-2 ml-6">
                    <Link
                      to="/cars"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Browse All Cars
                    </Link>
                    <Link
                      to="/cars/create"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      List Your Vehicle
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Compass className="w-4 h-4 mr-2" />
                    Experiences
                  </h3>
                  <div className="space-y-2 ml-6">
                    <Link
                      to="/experiences"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Browse All Experiences
                    </Link>
                    <Link
                      to="/experiences/create"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Host an Experience
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Destinations
                  </h3>
                  <div className="space-y-2 ml-6">
                    <Link
                      to="/destinations/europe"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Europe
                    </Link>
                    <Link
                      to="/destinations/asia"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Asia
                    </Link>
                    <Link
                      to="/destinations/americas"
                      className="block text-gray-600 hover:text-gray-900 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Americas
                    </Link>
                  </div>
                </div>
              </div>

              {/* User Actions - Updated to show different options when logged in */}
              <div className="border-t pt-4 space-y-3">
                {!user ? (
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                )}


              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BookingNavbar
