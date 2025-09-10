import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Redirect to the main Passpoint website
    window.location.href = "https://mypasspoint.com/";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Redirecting to Passpoint...</p>
      </div>
    </div>
  );
};

export default Index;
