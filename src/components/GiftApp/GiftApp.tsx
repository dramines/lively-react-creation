import React, { useState, useEffect } from "react";

const GiftApp = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-white-100">
      {isLoading ? (
        <div className="flex flex-col items-center">
          <div
            className="w-10 h-10 border-4 border-gray-300 border-t-[#591C1C] 
                       rounded-full animate-spin"
          ></div>
          <p className="mt-3 text-gray-500 font-medium">Loading...</p>
        </div>
      ) : (
        <h1 className="text-3xl font-bold text-[#591C1C]">Hello App</h1>
      )}
    </div>
  );
};

export default GiftApp;
