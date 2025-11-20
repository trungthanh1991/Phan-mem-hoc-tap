
import React, { useEffect, useState } from 'react';

export type MascotEmotion = 'idle' | 'thinking' | 'happy' | 'sad';

interface MascotProps {
  emotion: MascotEmotion;
  className?: string;
  size?: number;
}

const Mascot: React.FC<MascotProps> = ({ emotion, className = '', size = 120 }) => {
  const [blink, setBlink] = useState(false);

  // Hiệu ứng chớp mắt tự động
  useEffect(() => {
    if (emotion !== 'idle') return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, [emotion]);

  // Màu sắc
  const bodyColor = '#3b82f6'; // Blue-500
  const bellyColor = '#bfdbfe'; // Blue-200
  const beakColor = '#f59e0b'; // Amber-500
  const feetColor = '#f59e0b'; // Amber-500

  // Animation classes based on emotion
  let animationClass = '';
  switch (emotion) {
    case 'happy':
      animationClass = 'animate-bounce';
      break;
    case 'thinking':
      animationClass = 'animate-pulse';
      break;
    case 'sad':
      animationClass = ''; // Có thể thêm animation rung nhẹ nếu muốn
      break;
    default:
      animationClass = 'animate-[float_3s_ease-in-out_infinite]';
  }

  return (
    <div className={`relative inline-block ${animationClass} ${className}`} style={{ width: size, height: size }}>
       <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}
      </style>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl transition-all duration-500"
      >
        {/* Chân */}
        <path d="M70 170 L60 190 L80 190 Z" fill={feetColor} />
        <path d="M130 170 L120 190 L140 190 Z" fill={feetColor} />

        {/* Thân */}
        <ellipse cx="100" cy="110" rx="70" ry="80" fill={bodyColor} />

        {/* Tai */}
        <path d="M40 60 L30 30 L70 50 Z" fill={bodyColor} />
        <path d="M160 60 L170 30 L130 50 Z" fill={bodyColor} />

        {/* Bụng */}
        <ellipse cx="100" cy="130" rx="45" ry="50" fill={bellyColor} />
        
        {/* Họa tiết lông bụng */}
        <path d="M80 110 Q100 120 120 110" stroke={bodyColor} strokeWidth="3" fill="none" opacity="0.5"/>
        <path d="M80 130 Q100 140 120 130" stroke={bodyColor} strokeWidth="3" fill="none" opacity="0.5"/>
        <path d="M90 150 Q100 155 110 150" stroke={bodyColor} strokeWidth="3" fill="none" opacity="0.5"/>

        {/* Mắt (Tròng trắng) */}
        <circle cx="70" cy="80" r="25" fill="white" stroke={bodyColor} strokeWidth="2" />
        <circle cx="130" cy="80" r="25" fill="white" stroke={bodyColor} strokeWidth="2" />

        {/* Con ngươi (Thay đổi theo cảm xúc) */}
        {emotion === 'happy' ? (
          // Mắt cười ^^
          <>
            <path d="M55 80 Q70 65 85 80" stroke="#1e3a8a" strokeWidth="4" fill="none" />
            <path d="M115 80 Q130 65 145 80" stroke="#1e3a8a" strokeWidth="4" fill="none" />
          </>
        ) : emotion === 'sad' ? (
            // Mắt buồn --
            <>
             <circle cx="70" cy="85" r="5" fill="#1e3a8a" />
             <circle cx="130" cy="85" r="5" fill="#1e3a8a" />
             {/* Mí mắt sụp xuống */}
             <path d="M45 65 Q70 85 95 65" fill={bodyColor} opacity="0.3" />
             <path d="M105 65 Q130 85 155 65" fill={bodyColor} opacity="0.3" />
            </>
        ) : blink ? (
          // Nhắm mắt
          <>
            <line x1="50" y1="80" x2="90" y2="80" stroke="#1e3a8a" strokeWidth="4" />
            <line x1="110" y1="80" x2="150" y2="80" stroke="#1e3a8a" strokeWidth="4" />
          </>
        ) : (
          // Mở mắt bình thường
          <>
            <circle cx="70" cy="80" r={emotion === 'thinking' ? 8 : 10} fill="#1e3a8a">
                {emotion === 'thinking' && (
                    <animate attributeName="cy" values="80;75;80" dur="1s" repeatCount="indefinite" />
                )}
            </circle>
            <circle cx="130" cy="80" r={emotion === 'thinking' ? 8 : 10} fill="#1e3a8a">
                 {emotion === 'thinking' && (
                    <animate attributeName="cy" values="80;75;80" dur="1s" repeatCount="indefinite" begin="0.1s"/>
                )}
            </circle>
            <circle cx="75" cy="75" r="3" fill="white" />
            <circle cx="135" cy="75" r="3" fill="white" />
          </>
        )}

        {/* Mỏ */}
        <path d="M90 100 L110 100 L100 115 Z" fill={beakColor} />

        {/* Cánh */}
        {emotion === 'happy' ? (
            // Cánh giơ lên
            <>
                <path d="M30 120 Q10 90 30 80" stroke={bodyColor} strokeWidth="10" strokeLinecap="round" fill="none" />
                <path d="M170 120 Q190 90 170 80" stroke={bodyColor} strokeWidth="10" strokeLinecap="round" fill="none" />
            </>
        ) : (
            // Cánh khép
            <>
                <path d="M30 110 Q20 140 40 150" stroke={bodyColor} strokeWidth="0" fill={bodyColor} />
                <ellipse cx="35" cy="130" rx="15" ry="30" fill={bodyColor} transform="rotate(10 35 130)"/>
                <ellipse cx="165" cy="130" rx="15" ry="30" fill={bodyColor} transform="rotate(-10 165 130)"/>
            </>
        )}
      </svg>
    </div>
  );
};

export default Mascot;
