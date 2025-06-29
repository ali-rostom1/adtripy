import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import axios from "axios";

export default function BecomeHostForm() {
  const [formData, setFormData] = useState({
    business_name: "",
    tax_id: "",
    bank_account: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token, setUser } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AUTH_API_URL}/api/v1/become-host`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the user in store with new role
      const currentUser = useAuthStore.getState().user;
      setUser({
        ...currentUser,
        roles: [...(currentUser.roles || []), "host"]
      });

      // Redirect to create stay page
      navigate('/stays/create');
    } catch (err) {
      console.error("Error becoming host:", err);
      setError(err.response?.data?.message || "Failed to upgrade to host status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Become a Host</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Business Name</label>
          <input
            type="text"
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Tax ID</label>
          <input
            type="text"
            name="tax_id"
            value={formData.tax_id}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Bank Account</label>
          <input
            type="text"
            name="bank_account"
            value={formData.bank_account}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Format: XXXX-XXXX-XXXX-XXXX"
          />
          <p className="text-sm text-gray-500 mt-1">
            Your banking information is encrypted and secure.
          </p>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg text-white font-medium transition duration-200 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? 'Processing...' : 'Submit Host Application'}
          </button>
        </div>
      </form>
    </div>
  );
}