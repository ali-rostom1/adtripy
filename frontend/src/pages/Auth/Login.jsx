import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      // Change the redirect destination from dashboard to guest page
      navigate("/guest");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-r-full ">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/bggreen.jpg"
            alt="Login Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-black/20">
          {/* Decorative elements */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-white rounded-full opacity-60"></div>
          <div className="absolute top-32 left-32 w-2 h-2 bg-white rounded-full opacity-40"></div>
          <div className="absolute bottom-40 right-20 w-6 h-6 bg-teal-400 rounded-full opacity-70"></div>
          <div className="absolute bottom-60 right-40 w-3 h-3 bg-teal-300 rounded-full opacity-50"></div>

          {/* Content area */}
          <div className="flex flex-col gap-4 h-full p-12">
            {/* Top section - Logo */}
            <div className="flex-shrink-0">
              <img
                src="https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/whiteLogo.png"
                alt="ADTRIPY Logo"
                className="w-[200px]"
              />
            </div>

            {/* Bottom section - Description */}
            <div className="flex-shrink-0 bg-black/30 border border-white p-4 max-w-lg">
              <p className="text-white text-7xl font-light">
                Let's make your dream trip happen.
              </p>
            </div>

            {/* Bottom section - Description */}
            <div className="flex-shrink-0 p-4 max-w-lg">
              <p className="text-white text-2xl font-light">
                Create an account to unlock exclusive deals, faster bookings,
                and personalized travel inspiration.
              </p>
            </div>

            <div className="flex-shrink-0 mt-4 max-w-lg">
              <div className="border-t border-white pt-6">
                <p className="text-white text-sm font-light uppercase tracking-widest mb-4 text-center">
                  Trusted Partners
                </p>

                <div className="grid grid-cols-4 gap-6 items-center justify-items-center ">
                  {/* Sponsor logos - replace with actual logo paths */}
                  <div className="h-8 w-16 bg-black/30 rounded flex items-center justify-center">
                    <span className="text-white text-sm font-light">HOTEL</span>
                  </div>

                  <div className="h-8 w-16 bg-black/30 rounded flex items-center justify-center">
                    <span className="text-white text-sm font-light">RIAD</span>
                  </div>

                  <div className="h-8 w-16 bg-black/30 rounded flex items-center justify-center">
                    <span className="text-white text-sm font-light">TOURS</span>
                  </div>

                  <div className="h-8 w-16 bg-black/30 rounded flex items-center justify-center">
                    <span className="text-white text-sm font-light">
                      TRAVEL
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex  justify-center">
              <img
                src="https://fileupload-adtripy.s3.eu-west-3.amazonaws.com/logoAdtripy.png"
                alt="Login Background"
                className="w-[250px] h-full object-cover"
              />
            </div>
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Register here
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">or</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
