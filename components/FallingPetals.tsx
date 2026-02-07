import React, { useEffect, useState } from 'react';

const FallingPetals: React.FC = () => {
  const [petals, setPetals] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPetals((prev) => {
        const newPetals = [...prev, Math.random()];
        if (newPetals.length > 30) newPetals.shift(); // Reduced count for mobile performance
        return newPetals;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((seed, i) => (
        <div
          key={i}
          className="absolute text-rose-300/60"
          style={{
            left: `${seed * 100}%`,
            top: '-20px',
            fontSize: `${Math.random() * 15 + 10}px`,
            animation: `fall ${Math.random() * 5 + 5}s linear forwards, sway ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
          }}
        >
          🌸
        </div>
      ))}
      <style>{`
        @keyframes fall {
          to { top: 120%; }
        }
        @keyframes sway {
          from { transform: translateX(0) rotate(0deg); }
          to { transform: translateX(30px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default FallingPetals;