// components/Loading.tsx
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-full h-24 overflow-hidden">
        <div className="animate-race absolute left-0">
          <img src="/car-icon.png" alt="Loading Car" className="h-24" /> {/* Increased size */}
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold text-primary">Loading...</p>

      <style jsx>{`
        @keyframes race {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100vw);
          }
        }

        .animate-race {
          animation: race 8s linear infinite; /* Increased speed */
        }
      `}</style>
    </div>
  );
}
