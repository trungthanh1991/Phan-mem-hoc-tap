
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
        return (
          <g>
            <rect x="45" y="70" width="30" height="20" rx="5" fill="#1a1a1a" opacity="0.9" />
            <rect x="125" y="70" width="30" height="20" rx="5" fill="#1a1a1a" opacity="0.9" />
            <rect x="75" y="78" width="50" height="4" rx="2" fill="#1a1a1a" opacity="0.9" />
            <rect x="40" y="78" width="8" height="3" rx="1.5" fill="#1a1a1a" opacity="0.9" />
            <rect x="152" y="78" width="8" height="3" rx="1.5" fill="#1a1a1a" opacity="0.9" />
            <ellipse cx="52" cy="75" rx="3" ry="2" fill="white" opacity="0.4" />
            <ellipse cx="132" cy="75" rx="3" ry="2" fill="white" opacity="0.4" />
          </g>
        );

      case 'glasses_nerd':
        return (
          <g>
            <circle cx="70" cy="80" r="22" fill="none" stroke="#2c3e50" strokeWidth="3" />
            <circle cx="130" cy="80" r="22" fill="none" stroke="#2c3e50" strokeWidth="3" />
            <line x1="92" y1="80" x2="108" y2="80" stroke="#2c3e50" strokeWidth="3" />
            <path d="M48 80 Q40 78 36 80" stroke="#2c3e50" strokeWidth="2" fill="none" />
            <path d="M152 80 Q160 78 164 80" stroke="#2c3e50" strokeWidth="2" fill="none" />
          </g>
        );

      case 'glasses_star':
        return (
          <g>
            <path d="M70 65 L73 75 L83 75 L75 82 L78 92 L70 85 L62 92 L65 82 L57 75 L67 75 Z" fill="#ffd700" stroke="#f59e0b" strokeWidth="2" />
            <path d="M130 65 L133 75 L143 75 L135 82 L138 92 L130 85 L122 92 L125 82 L117 75 L127 75 Z" fill="#ffd700" stroke="#f59e0b" strokeWidth="2" />
            <rect x="83" y="78" width="34" height="3" rx="1.5" fill="#f59e0b" />
          </g>
        );

      case 'glasses_heart':
        return (
          <g>
            <path d="M70 65 C65 60 55 60 50 70 C50 78 70 90 70 90 C70 90 90 78 90 70 C90 60 80 60 75 65 L70 70 Z" fill="#ec4899" opacity="0.8" stroke="#db2777" strokeWidth="2" />
            <path d="M130 65 C125 60 115 60 110 70 C110 78 130 90 130 90 C130 90 150 78 150 70 C150 60 140 60 135 65 L130 70 Z" fill="#ec4899" opacity="0.8" stroke="#db2777" strokeWidth="2" />
            <rect x="90" y="78" width="20" height="3" rx="1.5" fill="#db2777" />
          </g>
        );

      case 'glasses_3d':
        return (
          <g>
            <rect x="48" y="72" width="26" height="18" rx="3" fill="#dc2626" opacity="0.7" stroke="#991b1b" strokeWidth="2" />
            <rect x="126" y="72" width="26" height="18" rx="3" fill="#06b6d4" opacity="0.7" stroke="#0891b2" strokeWidth="2" />
            <rect x="74" y="79" width="52" height="4" rx="2" fill="#1f2937" />
            <rect x="42" y="79" width="8" height="3" rx="1.5" fill="#1f2937" />
            <rect x="150" y="79" width="8" height="3" rx="1.5" fill="#1f2937" />
          </g>
        );

      case 'glasses_monocle':
        return (
          <g>
            <circle cx="130" cy="80" r="18" fill="none" stroke="#92400e" strokeWidth="3" />
            <circle cx="130" cy="80" r="16" fill="white" opacity="0.3" />
            <path d="M148 80 Q155 75 160 78" stroke="#92400e" strokeWidth="2" fill="none" strokeDasharray="2,2" />
            <ellipse cx="135" cy="75" rx="4" ry="3" fill="white" opacity="0.6" />
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
        return (
          <g>
            <path d="M50 35 L60 50 L70 40 L80 50 L90 40 L100 50 L110 40 L120 50 L130 40 L140 50 L150 35 L145 25 L55 25 Z" fill="#ffd700" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="70" cy="35" r="4" fill="#ef4444" />
            <circle cx="100" cy="35" r="4" fill="#3b82f6" />
            <circle cx="130" cy="35" r="4" fill="#10b981" />
            <path d="M80 28 L82 32 L78 32 Z" fill="#fff" opacity="0.6" />
          </g>
        );

      case 'hat_wizard':
        return (
          <g>
            <path d="M100 10 L130 45 L70 45 Z" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" />
            <ellipse cx="100" cy="45" rx="35" ry="8" fill="#6d28d9" />
            <path d="M100 25 L101 27 L103 27 L101.5 28.5 L102 30 L100 29 L98 30 L98.5 28.5 L97 27 L99 27 Z" fill="#ffd700" />
            <path d="M85 35 L86 36 L87 36 L86.3 36.7 L86.5 38 L85 37 L83.5 38 L83.7 36.7 L83 36 L84 36 Z" fill="#ffd700" />
          </g>
        );

      case 'hat_party':
        return (
          <g>
            <path d="M100 15 L125 48 L75 48 Z" fill="#ec4899" stroke="#db2777" strokeWidth="2" />
            <path d="M100 15 L110 35 L90 35 Z" fill="#f97316" opacity="0.6" />
            <circle cx="100" cy="12" r="6" fill="#fbbf24" />
            <circle cx="98" cy="10" r="2.5" fill="#fef3c7" opacity="0.8" />
          </g>
        );

      case 'hat_pirate':
        return (
          <g>
            <path d="M60 35 Q100 25 140 35 L145 50 L55 50 Z" fill="#1f2937" stroke="#111827" strokeWidth="2" />
            <circle cx="100" cy="38" r="6" fill="white" />
            <rect x="95" y="44" width="10" height="4" fill="white" />
            <line x1="96" y1="46" x2="96" y2="48" stroke="#1f2937" strokeWidth="1" />
            <line x1="100" y1="46" x2="100" y2="48" stroke="#1f2937" strokeWidth="1" />
            <line x1="104" y1="46" x2="104" y2="48" stroke="#1f2937" strokeWidth="1" />
          </g>
        );

      case 'hat_detective':
        return (
          <g>
            <ellipse cx="100" cy="35" rx="28" ry="12" fill="#8b4513" stroke="#654321" strokeWidth="2" />
            <ellipse cx="100" cy="45" rx="40" ry="8" fill="#a0522d" stroke="#654321" strokeWidth="2" />
            <rect x="70" y="38" width="60" height="5" rx="2" fill="#1f2937" />
          </g>
        );

      case 'hat_santa':
        return (
          <g>
            <path d="M75 50 L100 15 L125 50 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
            <ellipse cx="100" cy="50" rx="28" ry="6" fill="white" />
            <circle cx="100" cy="12" r="7" fill="white" />
            <circle cx="98" cy="10" r="2" fill="#f3f4f6" />
          </g>
        );

      case 'hat_cowboy':
        return (
          <g>
            <ellipse cx="100" cy="48" rx="45" ry="10" fill="#92400e" stroke="#78350f" strokeWidth="2" />
            <ellipse cx="100" cy="35" rx="25" ry="18" fill="#b45309" stroke="#92400e" strokeWidth="2" />
            <path d="M90 28 Q100 32 110 28" stroke="#78350f" strokeWidth="2" fill="none" />
            <rect x="75" y="38" width="50" height="4" rx="2" fill="#451a03" />
          </g>
        );

      case 'hat_graduate':
        return (
          <g>
            <rect x="65" y="35" width="70" height="4" rx="1" fill="#1f2937" stroke="#111827" strokeWidth="2" />
            <ellipse cx="100" cy="42" rx="20" ry="10" fill="#374151" stroke="#1f2937" strokeWidth="2" />
            <line x1="100" y1="35" x2="100" y2="28" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="100" cy="27" r="3" fill="#fbbf24" />
            <path d="M100 30 L105 35 M100 30 L95 35" stroke="#fbbf24" strokeWidth="1.5" />
          </g>
        );

      case 'hat_ninja':
        return (
          <g>
            <rect x="55" y="45" width="90" height="8" rx="2" fill="#1f2937" stroke="#111827" strokeWidth="1.5" />
            <rect x="145" y="43" width="15" height="3" rx="1.5" fill="#374151" />
            <rect x="145" y="50" width="15" height="3" rx="1.5" fill="#374151" />
            <circle cx="100" cy="49" r="2.5" fill="#ef4444" />
          </g>
        );

      case 'hat_chef':
        return (
          <g>
            <ellipse cx="85" cy="28" rx="12" ry="15" fill="white" stroke="#d1d5db" strokeWidth="2" />
            <ellipse cx="100" cy="25" rx="13" ry="17" fill="white" stroke="#d1d5db" strokeWidth="2" />
            <ellipse cx="115" cy="28" rx="12" ry="15" fill="white" stroke="#d1d5db" strokeWidth="2" />
            <rect x="75" y="42" width="50" height="8" rx="2" fill="white" stroke="#d1d5db" strokeWidth="2" />
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
        return (
          <g>
            <path d="M30 100 Q20 130 35 170 L50 168 Q40 130 45 100 Z" fill="#ef4444" opacity="0.9" />
            <path d="M170 100 Q180 130 165 170 L150 168 Q160 130 155 100 Z" fill="#ef4444" opacity="0.9" />
            <path d="M38 110 Q35 130 40 150" stroke="#fca5a5" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M162 110 Q165 130 160 150" stroke="#fca5a5" strokeWidth="2" fill="none" opacity="0.5" />
            <circle cx="100" cy="125" r="12" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
            <path d="M100 117 L103 125 L100 133 L97 125 Z" fill="#ef4444" />
          </g>
        );

      case 'outfit_scientist':
        return (
          <g>
            <rect x="65" y="120" width="70" height="60" rx="5" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="100" cy="135" r="2.5" fill="#64748b" />
            <circle cx="100" cy="150" r="2.5" fill="#64748b" />
            <circle cx="100" cy="165" r="2.5" fill="#64748b" />
            <rect x="75" y="145" width="15" height="12" rx="2" fill="white" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="83" y="145" width="2" height="10" fill="#3b82f6" />
          </g>
        );

      case 'outfit_artist':
        return (
          <g>
            <rect x="68" y="118" width="64" height="58" rx="4" fill="#e0e7ff" opacity="0.9" stroke="#818cf8" strokeWidth="2" />
            <circle cx="80" cy="135" r="4" fill="#ef4444" opacity="0.8" />
            <circle cx="95" cy="145" r="3.5" fill="#fbbf24" opacity="0.8" />
            <circle cx="110" cy="138" r="3" fill="#10b981" opacity="0.8" />
            <circle cx="120" cy="150" r="4" fill="#3b82f6" opacity="0.8" />
            <circle cx="90" cy="160" r="3" fill="#a855f7" opacity="0.8" />
          </g>
        );

      case 'outfit_chef':
        return (
          <g>
            <path d="M75 115 L125 115 L130 180 L70 180 Z" fill="white" opacity="0.95" stroke="#94a3b8" strokeWidth="2" />
            <path d="M75 115 Q85 105 100 105 Q115 105 125 115" stroke="#94a3b8" strokeWidth="3" fill="none" />
            <rect x="85" y="140" width="30" height="20" rx="3" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="93" y1="140" x2="93" y2="155" stroke="#64748b" strokeWidth="1.5" />
            <line x1="100" y1="140" x2="100" y2="158" stroke="#64748b" strokeWidth="2" />
            <line x1="107" y1="140" x2="107" y2="155" stroke="#64748b" strokeWidth="1.5" />
          </g>
        );

      case 'outfit_doctor':
        return (
          <g>
            <rect x="65" y="115" width="70" height="65" rx="5" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="100" cy="130" r="2.5" fill="#64748b" />
            <circle cx="100" cy="145" r="2.5" fill="#64748b" />
            <circle cx="100" cy="160" r="2.5" fill="#64748b" />
            <path d="M85 125 Q83 135 85 145" stroke="#475569" strokeWidth="3" fill="none" />
            <circle cx="85" cy="147" r="4" fill="#475569" />
            <rect x="110" y="135" width="15" height="15" rx="2" fill="white" stroke="#cbd5e1" strokeWidth="1.5" />
            <path d="M117.5 138 L117.5 147 M113 142.5 L122 142.5" stroke="#ef4444" strokeWidth="2" />
          </g>
        );

      case 'outfit_astronaut':
        return (
          <g>
            <rect x="68" y="118" width="64" height="60" rx="5" fill="#f3f4f6" opacity="0.95" stroke="#9ca3af" strokeWidth="2" />
            <rect x="85" y="130" width="30" height="35" rx="3" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
            <circle cx="92" cy="140" r="2.5" fill="#ef4444" />
            <circle cx="100" cy="140" r="2.5" fill="#fbbf24" />
            <circle cx="108" cy="140" r="2.5" fill="#10b981" />
            <ellipse cx="100" cy="155" rx="8" ry="6" fill="#3b82f6" opacity="0.8" />
            <path d="M68 130 Q60 135 60 145" stroke="#6b7280" strokeWidth="3" fill="none" />
            <path d="M132 130 Q140 135 140 145" stroke="#6b7280" strokeWidth="3" fill="none" />
          </g>
        );

      case 'outfit_police':
        return (
          <g>
            <rect x="68" y="118" width="64" height="60" rx="5" fill="#1e3a8a" opacity="0.9" stroke="#1e40af" strokeWidth="2" />
            <circle cx="100" cy="135" r="2.5" fill="#fbbf24" />
            <circle cx="100" cy="150" r="2.5" fill="#fbbf24" />
            <circle cx="100" cy="165" r="2.5" fill="#fbbf24" />
            <path d="M85 135 L80 140 L85 145 L90 140 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="85" cy="140" r="2" fill="#1e3a8a" />
            <rect x="70" y="120" width="12" height="6" rx="1" fill="#3b82f6" opacity="0.7" />
            <rect x="118" y="120" width="12" height="6" rx="1" fill="#3b82f6" opacity="0.7" />
          </g>
        );

      case 'outfit_firefighter':
        return (
          <g>
            <rect x="68" y="118" width="64" height="60" rx="5" fill="#fbbf24" opacity="0.9" stroke="#f59e0b" strokeWidth="2" />
            <rect x="68" y="140" width="64" height="4" fill="#d1d5db" opacity="0.9" />
            <rect x="68" y="160" width="64" height="4" fill="#d1d5db" opacity="0.9" />
            <line x1="100" y1="118" x2="100" y2="178" stroke="#6b7280" strokeWidth="3" />
            <circle cx="100" cy="125" r="2" fill="#9ca3af" />
            <circle cx="100" cy="140" r="2" fill="#9ca3af" />
            <circle cx="100" cy="155" r="2" fill="#9ca3af" />
            <circle cx="100" cy="170" r="2" fill="#9ca3af" />
            <rect x="110" y="130" width="18" height="15" rx="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
            <path d="M119 135 L119 142 M115 138.5 L123 138.5" stroke="#dc2626" strokeWidth="2" />
          </g>
        );

      case 'outfit_pilot':
        return (
          <g>
            <rect x="68" y="118" width="64" height="60" rx="5" fill="#1e40af" opacity="0.9" stroke="#1e3a8a" strokeWidth="2" />
            <circle cx="100" cy="135" r="2.5" fill="#fbbf24" />
            <circle cx="100" cy="150" r="2.5" fill="#fbbf24" />
            <path d="M75 140 Q80 135 85 135 L90 135 L95 140 L100 140 L105 140 L110 135 L115 135 Q120 135 125 140"
              fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="100" cy="139" r="3" fill="#1e40af" stroke="#fbbf24" strokeWidth="1" />
            <rect x="68" y="120" width="15" height="8" rx="2" fill="#fbbf24" opacity="0.9" />
            <line x1="70" y1="122" x2="81" y2="122" stroke="#f59e0b" strokeWidth="1" />
            <rect x="117" y="120" width="15" height="8" rx="2" fill="#fbbf24" opacity="0.9" />
            <line x1="119" y1="122" x2="130" y2="122" stroke="#f59e0b" strokeWidth="1" />
          </g>
        );

      case 'outfit_ninja':
        return (
          <g>
            <rect x="68" y="118" width="64" height="60" rx="5" fill="#1f2937" opacity="0.95" stroke="#111827" strokeWidth="2" />
            <rect x="68" y="145" width="64" height="6" fill="#dc2626" />
            <rect x="95" y="145" width="10" height="12" fill="#991b1b" />
            <path d="M100 148 L102 150 L100 152 L98 150 Z" fill="#9ca3af" />
            <rect x="75" y="125" width="20" height="15" rx="2" fill="#374151" opacity="0.8" />
            <rect x="105" y="125" width="20" height="15" rx="2" fill="#374151" opacity="0.8" />
          </g>
        );

      case 'outfit_wizard':
        return (
          <g>
            <path d="M70 118 L70 180 L85 178 L90 170 Q100 165 110 170 L115 178 L130 180 L130 118 Z"
              fill="#7c3aed" opacity="0.9" stroke="#6d28d9" strokeWidth="2" />
            <path d="M80 130 L81 132 L83 132 L81.5 133.5 L82 135 L80 134 L78 135 L78.5 133.5 L77 132 L79 132 Z" fill="#fbbf24" />
            <path d="M115 140 L116 142 L118 142 L116.5 143.5 L117 145 L115 144 L113 145 L113.5 143.5 L112 142 L114 142 Z" fill="#fbbf24" />
            <rect x="80" y="145" width="40" height="5" rx="2" fill="#1f2937" />
            <circle cx="100" cy="147.5" r="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
          </g>
        );

      case 'outfit_vampire':
        return (
          <g>
            <path d="M25 120 Q20 145 30 175 L45 172 Q35 145 40 120 Z" fill="#7f1d1d" opacity="0.9" stroke="#450a0a" strokeWidth="2" />
            <path d="M175 120 Q180 145 170 175 L155 172 Q165 145 160 120 Z" fill="#7f1d1d" opacity="0.9" stroke="#450a0a" strokeWidth="2" />
            <rect x="75" y="120" width="50" height="55" rx="3" fill="#1f2937" opacity="0.95" stroke="#111827" strokeWidth="2" />
            <path d="M95 128 L90 130 L95 132 L100 130 Z" fill="#dc2626" />
            <path d="M105 128 L110 130 L105 132 L100 130 Z" fill="#dc2626" />
            <circle cx="100" cy="130" r="2" fill="#991b1b" />
          </g>
        );

      default:
        return null;
    }
  };

  // Render background effect
  const renderBackground = () => {
    if (!bgId) return null;

    // Helper for full size rect
    const FullBg = ({ fill }: { fill: string }) => (
      <rect x="0" y="0" width="200" height="200" fill={fill} />
    );

    switch (bgId) {
      // === THIÊN NHIÊN ===
      case 'bg_rainbow':
        return (
          <g>
            <defs>
              <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#bfdbfe" /> {/* Sky blue */}
                <stop offset="100%" stopColor="#eff6ff" />
              </linearGradient>
              <linearGradient id="rainbowArc" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="20%" stopColor="#f97316" />
                <stop offset="40%" stopColor="#fbbf24" />
                <stop offset="60%" stopColor="#10b981" />
                <stop offset="80%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <FullBg fill="url(#rainbowGrad)" />
            {/* Rainbow arc */}
            <path d="M-20 180 Q100 -20 220 180" stroke="url(#rainbowArc)" strokeWidth="40" fill="none" opacity="0.5" />
            {/* Clouds */}
            <circle cx="30" cy="40" r="20" fill="white" opacity="0.8" />
            <circle cx="50" cy="50" r="25" fill="white" opacity="0.8" />
            <circle cx="160" cy="30" r="15" fill="white" opacity="0.8" />
            <circle cx="180" cy="40" r="20" fill="white" opacity="0.8" />
          </g>
        );

      case 'bg_stars':
        return (
          <g>
            <FullBg fill="#1e1b4b" /> {/* Dark blue space */}
            {[...Array(20)].map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 200}
                cy={Math.random() * 200}
                r={Math.random() * 2 + 1}
                fill="#fbbf24"
                opacity={Math.random() * 0.5 + 0.5}
              />
            ))}
            <circle cx="180" cy="30" r="15" fill="#fef3c7" opacity="0.9" /> {/* Moon */}
          </g>
        );

      case 'bg_forest':
        return (
          <g>
            <FullBg fill="#dcfce7" /> {/* Light green sky */}
            {/* Trees background */}
            <path d="M0 120 L20 80 L40 120 Z" fill="#16a34a" opacity="0.6" />
            <path d="M30 130 L50 90 L70 130 Z" fill="#15803d" opacity="0.7" />
            <path d="M160 120 L180 80 L200 120 Z" fill="#16a34a" opacity="0.6" />
            <path d="M130 130 L150 90 L170 130 Z" fill="#15803d" opacity="0.7" />
            {/* Ground */}
            <rect x="0" y="120" width="200" height="80" fill="#22c55e" />
            <path d="M0 120 Q50 110 100 120 Q150 130 200 120 L200 200 L0 200 Z" fill="#16a34a" opacity="0.5" />
          </g>
        );

      case 'bg_ocean':
        return (
          <g>
            <FullBg fill="#bae6fd" /> {/* Sky */}
            <rect x="0" y="100" width="200" height="100" fill="#3b82f6" /> {/* Deep ocean */}
            <path d="M0 100 Q50 90 100 100 Q150 110 200 100 L200 200 L0 200 Z" fill="#60a5fa" /> {/* Waves */}
            <path d="M0 120 Q50 110 100 120 Q150 130 200 120 L200 200 L0 200 Z" fill="#2563eb" opacity="0.5" />
            <circle cx="150" cy="40" r="15" fill="#fbbf24" opacity="0.9" /> {/* Sun */}
            {/* Bubbles */}
            <circle cx="20" cy="150" r="3" fill="white" opacity="0.4" />
            <circle cx="180" cy="160" r="4" fill="white" opacity="0.4" />
          </g>
        );

      case 'bg_sunset':
        return (
          <g>
            <defs>
              <linearGradient id="sunsetFull" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b0764" />
                <stop offset="40%" stopColor="#be185d" />
                <stop offset="70%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
            <FullBg fill="url(#sunsetFull)" />
            <circle cx="100" cy="140" r="40" fill="#fbbf24" opacity="0.8" /> {/* Setting sun */}
            <path d="M0 160 Q100 150 200 160 L200 200 L0 200 Z" fill="#7c2d12" opacity="0.8" /> {/* Ground silhouette */}
          </g>
        );

      case 'bg_galaxy':
        return (
          <g>
            <FullBg fill="#0f172a" />
            <defs>
              <radialGradient id="galaxyCenter" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="200" height="200" fill="url(#galaxyCenter)" />
            {[...Array(30)].map((_, i) => (
              <circle key={i} cx={Math.random() * 200} cy={Math.random() * 200} r={Math.random() * 1.5} fill="white" opacity={Math.random()} />
            ))}
            <ellipse cx="100" cy="100" rx="80" ry="20" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.3" transform="rotate(15 100 100)" />
          </g>
        );

      case 'bg_volcano':
        return (
          <g>
            <FullBg fill="#fef2f2" />
            <path d="M0 200 L80 100 L120 100 L200 200 Z" fill="#7f1d1d" /> {/* Volcano base */}
            <path d="M80 100 L100 130 L120 100" fill="#ef4444" /> {/* Lava */}
            <path d="M100 100 L100 50" stroke="#713f12" strokeWidth="10" strokeLinecap="round" opacity="0.5" /> {/* Smoke */}
            <circle cx="90" cy="40" r="10" fill="#a8a29e" opacity="0.6" />
            <circle cx="110" cy="30" r="15" fill="#a8a29e" opacity="0.6" />
          </g>
        );

      case 'bg_snow':
        return (
          <g>
            <FullBg fill="#e0f2fe" />
            <path d="M0 150 Q50 140 100 150 Q150 160 200 150 L200 200 L0 200 Z" fill="white" />
            {[...Array(20)].map((_, i) => (
              <circle key={i} cx={Math.random() * 200} cy={Math.random() * 200} r={Math.random() * 2 + 1} fill="white" opacity="0.8" />
            ))}
            <circle cx="170" cy="40" r="10" fill="#fef9c3" opacity="0.8" />
          </g>
        );

      case 'bg_sakura':
        return (
          <g>
            <FullBg fill="#fdf2f8" />
            <path d="M-20 0 L50 80 L-20 100 Z" fill="#78350f" opacity="0.6" /> {/* Branch */}
            {[...Array(15)].map((_, i) => (
              <g key={i} transform={`translate(${Math.random() * 200}, ${Math.random() * 200})`}>
                <circle r="3" fill="#fbcfe8" />
                <circle cx="2" cy="2" r="3" fill="#fbcfe8" />
                <circle cx="-2" cy="2" r="3" fill="#fbcfe8" />
              </g>
            ))}
          </g>
        );

      case 'bg_desert':
        return (
          <g>
            <FullBg fill="#fff7ed" />
            <circle cx="160" cy="40" r="20" fill="#fbbf24" />
            <path d="M0 140 Q50 120 100 140 Q150 160 200 140 L200 200 L0 200 Z" fill="#fdba74" />
            <path d="M0 160 Q50 140 100 160 Q150 180 200 160 L200 200 L0 200 Z" fill="#fb923c" />
            {/* Cactus */}
            <path d="M30 150 L30 120 M30 135 L40 125 M30 135 L20 125" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
          </g>
        );

      // === XE CỘ (Vẽ đường phố + Xe phía sau) ===
      case 'bg_racecar':
      case 'bg_police_car':
      case 'bg_fire_truck':
      case 'bg_ambulance':
      case 'bg_taxi':
      case 'bg_bus':
      case 'bg_truck':
      case 'bg_tractor':
        return (
          <g>
            <FullBg fill="#e2e8f0" /> {/* Sky/City bg */}
            {/* City skyline */}
            <rect x="20" y="80" width="30" height="60" fill="#94a3b8" />
            <rect x="60" y="60" width="40" height="80" fill="#cbd5e1" />
            <rect x="110" y="90" width="30" height="50" fill="#94a3b8" />
            <rect x="150" y="50" width="30" height="90" fill="#cbd5e1" />
            {/* Road */}
            <rect x="0" y="140" width="200" height="60" fill="#475569" />
            <line x1="0" y1="170" x2="200" y2="170" stroke="white" strokeWidth="2" strokeDasharray="20,10" />

            {/* Specific Vehicle Silhouette in background - MOVED TO SIDES */}
            {bgId === 'bg_racecar' && <text x="10" y="170" fontSize="50">🏎️</text>}
            {bgId === 'bg_police_car' && <text x="140" y="170" fontSize="50">🚓</text>}
            {bgId === 'bg_fire_truck' && <text x="10" y="170" fontSize="50">🚒</text>}
            {bgId === 'bg_ambulance' && <text x="140" y="170" fontSize="50">🚑</text>}
            {bgId === 'bg_taxi' && <text x="10" y="170" fontSize="50">🚕</text>}
            {bgId === 'bg_bus' && <text x="140" y="170" fontSize="50">🚌</text>}
            {bgId === 'bg_truck' && <text x="10" y="170" fontSize="50">🚚</text>}
            {bgId === 'bg_tractor' && <text x="140" y="170" fontSize="50">🚜</text>}
          </g>
        );

      // === PHƯƠNG TIỆN KHÁC ===
      case 'bg_metro':
      case 'bg_train':
        return (
          <g>
            <FullBg fill="#f1f5f9" />
            {/* Tracks */}
            <rect x="0" y="140" width="200" height="10" fill="#713f12" />
            <rect x="0" y="160" width="200" height="10" fill="#713f12" />
            <line x1="0" y1="145" x2="200" y2="145" stroke="#d1d5db" strokeWidth="2" />
            <line x1="0" y1="165" x2="200" y2="165" stroke="#d1d5db" strokeWidth="2" />
            {/* Train - Moved to side */}
            {bgId === 'bg_metro' ? <text x="5" y="150" fontSize="50">🚇</text> : <text x="5" y="150" fontSize="50">🚂</text>}
          </g>
        );

      case 'bg_airplane':
      case 'bg_helicopter':
      case 'bg_rocket':
      case 'bg_ufo':
        return (
          <g>
            <FullBg fill="#bfdbfe" /> {/* Sky */}
            {/* Clouds */}
            <path d="M20 150 Q40 130 60 150 T100 150" fill="white" opacity="0.6" />
            <path d="M120 40 Q140 20 160 40 T200 40" fill="white" opacity="0.6" />

            {/* Flying Object - MOVED HIGHER */}
            {bgId === 'bg_airplane' && <text x="130" y="50" fontSize="45">✈️</text>}
            {bgId === 'bg_helicopter' && <text x="20" y="50" fontSize="45">🚁</text>}
            {bgId === 'bg_rocket' && <text x="130" y="50" fontSize="45">🚀</text>}
            {bgId === 'bg_ufo' && <text x="20" y="50" fontSize="45">🛸</text>}
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

        {/* Outfit accessories - rendered ON TOP of body */}
        {renderOutfit()}

        {/* Mắt (Tròng trắng) */}
        <circle cx="70" cy="80" r="25" fill="white" stroke={bodyColor} strokeWidth="2" />
        <circle cx="130" cy="80" r="25" fill="white" stroke={bodyColor} strokeWidth="2" />

        {/* Con ngươi (Thay đổi theo cảm xúc) - only show if no sunglasses */}
        {glassesId !== 'glasses_cool' && (
          <>
            {emotion === 'happy' ? (
              <>
                <path d="M55 80 Q70 65 85 80" stroke="#1e3a8a" strokeWidth="4" fill="none" />
                <path d="M115 80 Q130 65 145 80" stroke="#1e3a8a" strokeWidth="4" fill="none" />
              </>
            ) : emotion === 'sad' ? (
              <>
                <circle cx="70" cy="85" r="5" fill="#1e3a8a" />
                <circle cx="130" cy="85" r="5" fill="#1e3a8a" />
                <path d="M45 65 Q70 85 95 65" fill={bodyColor} opacity="0.3" />
                <path d="M105 65 Q130 85 155 65" fill={bodyColor} opacity="0.3" />
              </>
            ) : blink ? (
              <>
                <line x1="50" y1="80" x2="90" y2="80" stroke="#1e3a8a" strokeWidth="4" />
                <line x1="110" y1="80" x2="150" y2="80" stroke="#1e3a8a" strokeWidth="4" />
              </>
            ) : (
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
          <>
            <path d="M30 120 Q10 90 30 80" stroke={bodyColor} strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M170 120 Q190 90 170 80" stroke={bodyColor} strokeWidth="10" strokeLinecap="round" fill="none" />
          </>
        ) : (
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
