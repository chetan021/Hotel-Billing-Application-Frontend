import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
                                         isAuthenticated,
                                         children,
                                         requiredRole = null
                                       }) {
  // Get user from localStorage
  const userData = localStorage.getItem("user");
  let user = null;

  try {
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (error) {
    console.error("Failed to parse user:", error);
  }

  // Check if authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if role is required and user has it
  if (requiredRole && user && user.role !== requiredRole) {
    return (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 p-6 rounded text-center">
          <h2 className="text-2xl font-bold text-red-300 mb-2">Access Denied</h2>
          <p className="text-red-200">
            You need {requiredRole} role to access this page.
          </p>
          <p className="text-gray-300 text-sm mt-2">Your role: {user?.role || "GUEST"}</p>
        </div>
    );
  }

  return children;
}
