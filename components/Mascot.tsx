
import React, { useEffect, useState, useCallback } from 'react';
import { useSound } from '../contexts/SoundContext';
import { useUser } from '../contexts/UserContext';

export type MascotEmotion = 'idle' | 'thinking' | 'happy' | 'sad';

interface MascotProps {
  emotion: MascotEmotion;
  className?: string;
  size?: number;
}

const MESSAGES = [
  "Cố lên nhé! 💪",
  "Bé giỏi quá! 🌟",
  "Uống nước chút không? 🥤",
  "Học vui quá! 🎉",
  "Chào bạn nhỏ! 👋",
  "Tớ là Cú Mèo thông thái! 🦉",
  "Tuyệt vời! ✨",
  "Cùng khám phá nào! 🚀",
  "Đừng bỏ cuộc nhé! ❤️",
  "Phúc Nguyên cố lên! ❤️"
];

const Mascot: React.FC<MascotProps> = ({ emotion, className = '', size = 120 }) => {
  const [blink, setBlink] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const { playSound } = useSound();
  const { equippedAccessories } = useUser();

  // Get equipped accessory IDs
  const hatId = equippedAccessories?.hat;
  const glassesId = equippedAccessories?.glasses;
  const outfitId = equippedAccessories?.outfit;
  const bgId = equippedAccessories?.background;

  // Hiệu ứng chớp mắt tự động
  useEffect(() => {
    if (emotion !== 'idle') return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, [emotion]);

  // Tự động nói chuyện ngẫu nhiên (hiếm khi)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% cơ hội mỗi 10s
        showRandomMessage();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const showRandomMessage = useCallback(() => {
    const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setMessage(randomMsg);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const handleClick = () => {
    if (isJumping) return;
    playSound('click');
    setIsJumping(true);
    showRandomMessage();
    setTimeout(() => setIsJumping(false), 500);
  };

  // Màu sắc
  const bodyColor = '#3b82f6'; // Blue-500
  const bellyColor = '#bfdbfe'; // Blue-200
  const beakColor = '#f59e0b'; // Amber-500
  const feetColor = '#f59e0b'; // Amber-500

  // Animation classes based on emotion
  let animationClass = '';
  if (isJumping) {
    animationClass = 'animate-bounce-fun';
  } else {
    switch (emotion) {
      case 'happy':
        animationClass = 'animate-bounce';
        break;
      case 'thinking':
        animationClass = 'animate-pulse';
        break;
      case 'sad':
        animationClass = '';
        break;
      default:
        animationClass = 'animate-[float_3s_ease-in-out_infinite]';
    }
  }

  // Render glasses as SVG
  const renderGlasses = () => {
    if (!glassesId) return null;

    switch (glassesId) {
      case 'glasses_cool':
        // Cool sunglasses - dark rectangles
        return (
          <g>
            {/* Left lens */}
            <rect x="45" y="70" width="30" height="20" rx="5" fill="#1a1a1a" opacity="0.9" />
            {/* Right lens */}
            <rect x="125" y="70" width="30" height="20" rx="5" fill="#1a1a1a" opacity="0.9" />
            {/* Bridge */}
            <rect x="75" y="78" width="50" height="4" rx="2" fill="#1a1a1a" opacity="0.9" />
            {/* Left arm */}
            <rect x="40" y="78" width="8" height="3" rx="1.5" fill="#1a1a1a" opacity="0.9" />
            {/* Right arm */}
            <rect x="152" y="78" width="8" height="3" rx="1.5" fill="#1a1a1a" opacity="0.9" />
            {/* Reflection shine */}
            <ellipse cx="52" cy="75" rx="3" ry="2" fill="white" opacity="0.4" />
            <ellipse cx="132" cy="75" rx="3" ry="2" fill="white" opacity="0.4" />
          </g>
        );

      case 'glasses_nerd':
        // Nerd glasses - circular frames
        return (
          <g>
            {/* Left frame */}
            <circle cx="70" cy="80" r="22" fill="none" stroke="#2c3e50" strokeWidth="3" />
            {/* Right frame */}
            <circle cx="130" cy="80" r="22" fill="none" stroke="#2c3e50" strokeWidth="3" />
            {/* Bridge */}
            <line x1="92" y1="80" x2="108" y2="80" stroke="#2c3e50" strokeWidth="3" />
            {/* Left arm */}
            <path d="M48 80 Q40 78 36 80" stroke="#2c3e50" strokeWidth="2" fill="none" />
            {/* Right arm */}
            <path d="M152 80 Q160 78 164 80" stroke="#2c3e50" strokeWidth="2" fill="none" />
          </g>
        );

      case 'glasses_star':
        // Star-shaped glasses
        return (
          <g>
            {/* Left star */}
            <path d="M70 65 L73 75 L83 75 L75 82 L78 92 L70 85 L62 92 L65 82 L57 75 L67 75 Z" fill="#ffd700" stroke="#f59e0b" strokeWidth="2" />
            {/* Right star */}
            <path d="M130 65 L133 75 L143 75 L135 82 L138 92 L130 85 L122 92 L125 82 L117 75 L127 75 Z" fill="#ffd700" stroke="#f59e0b" strokeWidth="2" />
            {/* Bridge */}
            <rect x="83" y="78" width="34" height="3" rx="1.5" fill="#f59e0b" />
          </g>
        );

      case 'glasses_heart':
        // Heart-shaped glasses
        return (
          <g>
            {/* Left heart */}
            <path d="M70 65 C65 60 55 60 50 70 C50 78 70 90 70 90 C70 90 90 78 90 70 C90 60 80 60 75 65 L70 70 Z" fill="#ec4899" opacity="0.8" stroke="#db2777" strokeWidth="2" />
            {/* Right heart */}
            <path d="M130 65 C125 60 115 60 110 70 C110 78 130 90 130 90 C130 90 150 78 150 70 C150 60 140 60 135 65 L130 70 Z" fill="#ec4899" opacity="0.8" stroke="#db2777" strokeWidth="2" />
            {/* Bridge */}
            <rect x="90" y="78" width="20" height="3" rx="1.5" fill="#db2777" />
          </g>
        );

      default:
        return null;
    }
  };

  // Render hat as SVG
  const renderHat = () => {
    if (!hatId) return null;

    switch (hatId) {
      case 'hat_crown':
        // Golden crown
        return (
          <g>
            {/* Crown base */}
            <path d="M50 35 L60 50 L70 40 L80 50 L90 40 L100 50 L110 40 L120 50 L130 40 L140 50 L150 35 L145 25 L55 25 Z" fill="#ffd700" stroke="#f59e0b" strokeWidth="2" />
            {/* Jewels */}
            <circle cx="70" cy="35" r="4" fill="#ef4444" />
            <circle cx="100" cy="35" r="4" fill="#3b82f6" />
            <circle cx="130" cy="35" r="4" fill="#10b981" />
            {/* Shine */}
            <path d="M80 28 L82 32 L78 32 Z" fill="#fff" opacity="0.6" />
          </g>
        );

      case 'hat_wizard':
        // Wizard hat
        return (
          <g>
            {/* Hat cone */}
            <path d="M100 10 L130 45 L70 45 Z" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" />
            {/* Hat brim */}
            <ellipse cx="100" cy="45" rx="35" ry="8" fill="#6d28d9" />
            {/* Stars decoration */}
            <path d="M100 25 L101 27 L103 27 L101.5 28.5 L102 30 L100 29 L98 30 L98.5 28.5 L97 27 L99 27 Z" fill="#ffd700" />
            <path d="M85 35 L86 36 L87 36 L86.3 36.7 L86.5 38 L85 37 L83.5 38 L83.7 36.7 L83 36 L84 36 Z" fill="#ffd700" />
          </g>
        );

      case 'hat_party':
        // Party hat
        return (
          <g>
            {/* Hat */}
            <path d="M100 15 L125 48 L75 48 Z" fill="#ec4899" stroke="#db2777" strokeWidth="2" />
            {/* Stripes */}
            <path d="M100 15 L110 35 L90 35 Z" fill="#f97316" opacity="0.6" />
            {/* Pom pom */}
            <circle cx="100" cy="12" r="6" fill="#fbbf24" />
            <circle cx="98" cy="10" r="2.5" fill="#fef3c7" opacity="0.8" />
          </g>
        );

      case 'hat_pirate':
        // Pirate hat
        return (
          <g>
            {/* Hat */}
            <path d="M60 35 Q100 25 140 35 L145 50 L55 50 Z" fill="#1f2937" stroke="#111827" strokeWidth="2" />
            {/* Skull */}
            <circle cx="100" cy="38" r="6" fill="white" />
            <rect x="95" y="44" width="10" height="4" fill="white" />
            <line x1="96" y1="46" x2="96" y2="48" stroke="#1f2937" strokeWidth="1" />
            <line x1="100" y1="46" x2="100" y2="48" stroke="#1f2937" strokeWidth="1" />
            <line x1="104" y1="46" x2="104" y2="48" stroke="#1f2937" strokeWidth="1" />
          </g>
        );

      case 'hat_detective':
        // Detective hat
        return (
          <g>
            {/* Hat top */}
            <ellipse cx="100" cy="35" rx="28" ry="12" fill="#8b4513" stroke="#654321" strokeWidth="2" />
            {/* Hat brim */}
            <ellipse cx="100" cy="45" rx="40" ry="8" fill="#a0522d" stroke="#654321" strokeWidth="2" />
            {/* Hat band */}
            <rect x="70" y="38" width="60" height="5" rx="2" fill="#1f2937" />
          </g>
        );

      default:
        return null;
    }
  };

  // Render outfit accessories
  const renderOutfit = () => {
    if (!outfitId) return null;

    switch (outfitId) {
      case 'outfit_superhero':
        // Superhero cape
        return (
          <g>
            {/* Cape */}
            <path d="M30 100 Q20 130 35 170 L50 168 Q40 130 45 100 Z" fill="#ef4444" opacity="0.9" />
            <path d="M170 100 Q180 130 165 170 L150 168 Q160 130 155 100 Z" fill="#ef4444" opacity="0.9" />
            {/* Cape shine */}
            <path d="M38 110 Q35 130 40 150" stroke="#fca5a5" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M162 110 Q165 130 160 150" stroke="#fca5a5" strokeWidth="2" fill="none" opacity="0.5" />
            {/* Logo on chest */}
            <circle cx="100" cy="125" r="12" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
            <path d="M100 117 L103 125 L100 133 L97 125 Z" fill="#ef4444" />
          </g>
        );

      case 'outfit_scientist':
        // Lab coat
        return (
          <g>
            {/* Lab coat */}
            <rect x="65" y="120" width="70" height="60" rx="5" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="2" />
            {/* Buttons */}
            <circle cx="100" cy="135" r="2.5" fill="#64748b" />
            <circle cx="100" cy="150" r="2.5" fill="#64748b" />
            <circle cx="100" cy="165" r="2.5" fill="#64748b" />
            {/* Pocket */}
            <rect x="75" y="145" width="15" height="12" rx="2" fill="white" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Pen */}
            <rect x="83" y="145" width="2" height="10" fill="#3b82f6" />
          </g>
        );

      case 'outfit_artist':
        // Artist smock with paint
        return (
          <g>
            {/* Smock */}
            <rect x="68" y="118" width="64" height="58" rx="4" fill="#e0e7ff" opacity="0.9" stroke="#818cf8" strokeWidth="2" />
            {/* Paint splashes */}
            <circle cx="80" cy="135" r="4" fill="#ef4444" opacity="0.8" />
            <circle cx="95" cy="145" r="3.5" fill="#fbbf24" opacity="0.8" />
            <circle cx="110" cy="138" r="3" fill="#10b981" opacity="0.8" />
            <circle cx="120" cy="150" r="4" fill="#3b82f6" opacity="0.8" />
            <circle cx="90" cy="160" r="3" fill="#a855f7" opacity="0.8" />
          </g>
        );

      case 'outfit_chef':
        // Chef apron
        return (
          <g>
            {/* Apron */}
            <path d="M75 115 L125 115 L130 180 L70 180 Z" fill="white" opacity="0.95" stroke="#94a3b8" strokeWidth="2" />
            {/* Neck strap */}
            <path d="M75 115 Q85 105 100 105 Q115 105 125 115" stroke="#94a3b8" strokeWidth="3" fill="none" />
            {/* Pocket */}
            <rect x="85" y="140" width="30" height="20" rx="3" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Utensils in pocket */}
            <line x1="93" y1="140" x2="93" y2="155" stroke="#64748b" strokeWidth="1.5" />
            <line x1="100" y1="140" x2="100" y2="158" stroke="#64748b" strokeWidth="2" />
            <line x1="107" y1="140" x2="107" y2="155" stroke="#64748b" strokeWidth="1.5" />
          </g>
        );

      default:
        return null;
    }
  };

  // Render background effect
  const renderBackground = () => {
    if (!bgId) return null;

    switch (bgId) {
      case 'bg_rainbow':
        return (
          <g opacity="0.3">
            <path d="M0 100 Q50 80 100 100 Q150 120 200 100 L200 200 L0 200 Z" fill="url(#rainbowGradient)" />
            <defs>
              <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="20%" stopColor="#f97316" />
                <stop offset="40%" stopColor="#fbbf24" />
                <stop offset="60%" stopColor="#10b981" />
                <stop offset="80%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </g>
        );

      case 'bg_stars':
        return (
          <g opacity="0.4">
            {[...Array(8)].map((_, i) => (
              <path
                key={i}
                d={`M${20 + i * 25} ${30 + (i % 3) * 50} L${22 + i * 25} ${35 + (i % 3) * 50} L${27 + i * 25} ${35 + (i % 3) * 50} L${24 + i * 25} ${38 + (i % 3) * 50} L${25 + i * 25} ${43 + (i % 3) * 50} L${20 + i * 25} ${40 + (i % 3) * 50} L${15 + i * 25} ${43 + (i % 3) * 50} L${16 + i * 25} ${38 + (i % 3) * 50} L${13 + i * 25} ${35 + (i % 3) * 50} L${18 + i * 25} ${35 + (i % 3) * 50} Z`}
                fill="#fbbf24"
              />
            ))}
          </g>
        );

      case 'bg_forest':
        return (
          <g opacity="0.25">
            <rect x="0" y="150" width="200" height="50" fill="#22c55e" />
            <polygon points="30,150 40,130 50,150" fill="#16a34a" />
            <polygon points="70,160 80,140 90,160" fill="#16a34a" />
            <polygon points="110,155 120,135 130,155" fill="#16a34a" />
            <polygon points="150,165 160,145 170,165" fill="#16a34a" />
          </g>
        );

      case 'bg_ocean':
        return (
          <g opacity="0.3">
            <path d="M0 120 Q50 115 100 120 Q150 125 200 120 L200 200 L0 200 Z" fill="#60a5fa" />
            <path d="M0 140 Q50 135 100 140 Q150 145 200 140 L200 200 L0 200 Z" fill="#3b82f6" />
            <circle cx="40" cy="100" r="3" fill="white" opacity="0.6" />
            <circle cx="80" cy="110" r="2.5" fill="white" opacity="0.6" />
            <circle cx="130" cy="95" r="3.5" fill="white" opacity="0.6" />
            <circle cx="160" cy="105" r="2" fill="white" opacity="0.6" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}
      </style>

      {/* Speech Bubble */}
      {message && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white border-2 border-blue-500 text-blue-800 px-4 py-2 rounded-2xl shadow-lg whitespace-nowrap z-50 animate-fade-in-up">
          <span className="font-bold text-sm md:text-base">{message}</span>
          <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-blue-500 rotate-45"></div>
        </div>
      )}

      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-xl transition-all duration-500 cursor-pointer ${animationClass}`}
        onClick={handleClick}
      >
        {/* Background accessories - rendered first (behind everything) */}
        {renderBackground()}

        {/* Outfit accessories - rendered before body parts */}
        {renderOutfit()}

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
        <path d="M80 110 Q100 120 120 110" stroke={bodyColor} strokeWidth="3" fill="none" opacity="0.5" />
        <path d="M80 130 Q100 140 120 130" stroke={bodyColor} strokeWidth="3" fill="none" opacity="0.5" />
        <path d="M90 150 Q100 155 110 150" stroke={bodyColor} strokeWidth="3" fill="none" opacity="0.5" />

        {/* Mắt (Tròng trắng) */}
        <circle cx="70" cy="80" r="25" fill="white" stroke={bodyColor} strokeWidth="2" />
        <circle cx="130" cy="80" r="25" fill="white" stroke={bodyColor} strokeWidth="2" />

        {/* Con ngươi (Thay đổi theo cảm xúc) - only show if no sunglasses */}
        {glassesId !== 'glasses_cool' && (
          <>
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
                    <animate attributeName="cy" values="80;75;80" dur="1s" repeatCount="indefinite" begin="0.1s" />
                  )}
                </circle>
                <circle cx="75" cy="75" r="3" fill="white" />
                <circle cx="135" cy="75" r="3" fill="white" />
              </>
            )}
          </>
        )}

        {/* Glasses - rendered on top of eyes */}
        {renderGlasses()}

        {/* Mỏ */}
        <path d="M90 100 L110 100 L100 115 Z" fill={beakColor} />

        {/* Cánh */}
        {emotion === 'happy' || isJumping ? (
          // Cánh giơ lên
          <>
            <path d="M30 120 Q10 90 30 80" stroke={bodyColor} strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M170 120 Q190 90 170 80" stroke={bodyColor} strokeWidth="10" strokeLinecap="round" fill="none" />
          </>
        ) : (
          // Cánh khép
          <>
            <path d="M30 110 Q20 140 40 150" stroke={bodyColor} strokeWidth="0" fill={bodyColor} />
            <ellipse cx="35" cy="130" rx="15" ry="30" fill={bodyColor} transform="rotate(10 35 130)" />
            <ellipse cx="165" cy="130" rx="15" ry="30" fill={bodyColor} transform="rotate(-10 165 130)" />
          </>
        )}

        {/* Hat - rendered last (on top of everything) */}
        {renderHat()}
      </svg>
    </div>
  );
};

export default Mascot;
