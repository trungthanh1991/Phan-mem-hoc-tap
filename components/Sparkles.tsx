
import React, { useEffect, useState, useMemo } from 'react';

// Utility function to generate random values
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

interface Sparkle {
    id: number;
    top: string;
    left: string;
    size: string;
    delay: string;
    duration: string;
    color: string;
}

// Custom hook to manage sparkles
const useSparkles = (count = 30) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const colors = ['#FFD700', '#FFAC33', '#FFFFFF', '#FFD700'];
      return Array.from({ length: count }).map((_, index) => ({
        id: index,
        top: `${random(0, 100)}%`,
        left: `${random(0, 100)}%`,
        size: `${random(8, 20)}px`,
        delay: `${Math.random() * 2}s`,
        duration: `${random(800, 1500)}ms`,
        color: colors[random(0, 4)]
      }));
    };
    setSparkles(generateSparkles());
  }, [count]);

  return sparkles;
};

const Sparkles: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sparkles = useSparkles(40);

  return (
    <div className="relative w-full h-full">
      {sparkles.map(sparkle => (
        <span
          key={sparkle.id}
          className="sparkle"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: sparkle.color,
            animationDelay: sparkle.delay,
            animationDuration: sparkle.duration
          }}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Sparkles;