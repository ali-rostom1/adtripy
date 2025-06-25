import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/AuthStore";

export default function Dashboard() {
  const { user } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Dashboard
        </h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">User Information:</h3>
          <p>
            <span className="font-medium">Name:</span> {user?.firstName}{" "}
            {user?.lastName}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-medium">Email Verified:</span>
            {user?.email_verified_at ? (
              <span className="text-green-600">✓ Verified</span>
            ) : (
              <span className="text-red-600">✗ Not Verified</span>
            )}
          </p>
          <p>
            <span className="font-medium">Phone:</span>{" "}
            {user?.phone || "Not provided"}
          </p>
          <p>
            <span className="font-medium">Phone Verified:</span>
            {user?.phone_verified_at ? (
              <span className="text-green-600">✓ Verified</span>
            ) : (
              <span className="text-red-600">✗ Not Verified</span>
            )}
          </p>
        </div>

        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
