"use client";

import { useClientOnly } from "@/hooks/useClientOnly";

interface FloatingParticlesProps {
  count?: number;
  className?: string;
  colors?: string[];
}

const ClientOnlyAnimations = ({ 
  count = 20, 
  className = "",
  colors = ['#D2B48C', '#B8956A'] 
}: FloatingParticlesProps) => {
  const isClient = useClientOnly();

  if (!isClient) {
    return null; // لا نعرض شيئاً أثناء SSR
  }

  return (
    <>
      {/* Floating Particles - Client Side Only */}
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-1 h-1 rounded-full animate-ping opacity-30 ${className}`}
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${(i * 7 + 10) % 90}%`,
            top: `${(i * 11 + 5) % 85}%`,
            animationDelay: `${(i * 0.3) % 5}s`,
            animationDuration: `${2 + (i * 0.2) % 3}s`
          }}
        ></div>
      ))}
    </>
  );
};

export default ClientOnlyAnimations;
