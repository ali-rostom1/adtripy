import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/AuthStore";
import BecomeHostForm from "../../../components/host/BecomeHostForm";
import BookingNavbar from "../../../components/guest/Navbar";


export default function BecomeHostPage() {
  const { user, token, isHost } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!user || !token) {
      navigate('/login?redirect=/become-host');
      return;
    }

    // Redirect if already a host
    if (isHost()) {
      navigate('/stays/create');
    }
  }, [user, token, isHost, navigate]);

  return (
    <>
      <BookingNavbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Become a Host on AdTripy
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Share your luxury accommodations with travelers from around the world. 
              Complete the form below to apply for host status.
            </p>
          </div>
          
          <BecomeHostForm />
          
          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Benefits of being a host</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h4 className="font-medium text-lg mb-2">Extra Income</h4>
                <p className="text-gray-600">Earn money by sharing your property with guests.</p>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h4 className="font-medium text-lg mb-2">Full Control</h4>
                <p className="text-gray-600">Set your own prices, availability, and house rules.</p>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h4 className="font-medium text-lg mb-2">Global Exposure</h4>
                <p className="text-gray-600">Reach millions of travelers looking for unique stays.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}