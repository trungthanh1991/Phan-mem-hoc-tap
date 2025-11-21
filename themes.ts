import { Theme } from './types';

export const THEMES: Theme[] = [
    {
        id: 'default',
        name: '🌈 Cầu Vồng Mặc Định',
        description: 'Theme ban đầu với màu sắc tươi sáng',
        unlockRequirement: 'none',
        isUnlocked: true,
        colors: {
            primary: '#3b82f6', // blue-500
            secondary: '#8b5cf6', // violet-500
            accent: '#f59e0b', // amber-500
            background: '#f0f9ff', // blue-50
            gradient: { from: '#93c5fd', to: '#c7d2fe' } // blue-300 to indigo-300
        }
    },
    {
        id: 'sunset',
        name: '🌅 Hoàng Hôn Ấm Áp',
        description: 'Màu sắc ấm áp của hoàng hôn',
        unlockRequirement: 'first_quiz',
        isUnlocked: false,
        colors: {
            primary: '#f97316', // orange-500
            secondary: '#ec4899', // pink-500
            accent: '#fbbf24', // amber-400
            background: '#fff7ed', // orange-50
            gradient: { from: '#fdba74', to: '#fda4af' } // orange-300 to pink-300
        }
    },
    {
        id: 'forest',
        name: '🌲 Rừng Xanh Mát',
        description: 'Màu xanh tươi mát của thiên nhiên',
        unlockRequirement: 'perfect_score',
        isUnlocked: false,
        colors: {
            primary: '#10b981', // green-500
            secondary: '#14b8a6', // teal-500
            accent: '#84cc16', // lime-500
            background: '#f0fdf4', // green-50
            gradient: { from: '#6ee7b7', to: '#5eead4' } // green-300 to teal-300
        }
    },
    {
        id: 'ocean',
        name: '🌊 Đại Dương Xanh',
        description: 'Màu xanh biển sâu thẳm',
        unlockRequirement: 'marathon_runner',
        isUnlocked: false,
        colors: {
            primary: '#0ea5e9', // sky-500
            secondary: '#06b6d4', // cyan-500
            accent: '#3b82f6', // blue-500
            background: '#f0f9ff', // sky-50
            gradient: { from: '#7dd3fc', to: '#67e8f9' } // sky-300 to cyan-300
        }
    },
    {
        id: 'lavender',
        name: '💜 Hoa Oải Hương',
        description: 'Màu tím pastel nhẹ nhàng',
        unlockRequirement: 'perfectionist',
        isUnlocked: false,
        colors: {
            primary: '#a855f7', // purple-500
            secondary: '#d946ef', // fuchsia-500
            accent: '#ec4899', // pink-500
            background: '#faf5ff', // purple-50
            gradient: { from: '#d8b4fe', to: '#f0abfc' } // purple-300 to fuchsia-300
        }
    },
    {
        id: 'cherry',
        name: '🍒 Hoa Anh Đào',
        description: 'Màu hồng ngọt ngào của hoa anh đào',
        unlockRequirement: 'quiz_pro_25',
        isUnlocked: false,
        colors: {
            primary: '#f43f5e', // rose-500
            secondary: '#ec4899', // pink-500
            accent: '#fb7185', // rose-400
            background: '#fff1f2', // rose-50
            gradient: { from: '#fda4af', to: '#f9a8d4' } // pink-300 to rose-300
        }
    },
    {
        id: 'golden',
        name: '✨ Vàng Hoàng Gia',
        description: 'Màu vàng sang trọng của hoàng gia',
        unlockRequirement: 'quiz_master_50',
        isUnlocked: false,
        colors: {
            primary: '#eab308', // yellow-500
            secondary: '#f59e0b', // amber-500
            accent: '#fbbf24', // amber-400
            background: '#fefce8', // yellow-50
            gradient: { from: '#fde047', to: '#fcd34d' } // yellow-300 to amber-300
        }
    },
    {
        id: 'midnight',
        name: '🌙 Bầu Trời Đêm',
        description: 'Màu tối huyền bí của đêm',
        unlockRequirement: 'all_rounder',
        isUnlocked: false,
        colors: {
            primary: '#6366f1', // indigo-500
            secondary: '#8b5cf6', // violet-500
            accent: '#a855f7', // purple-500
            background: '#eef2ff', // indigo-50
            gradient: { from: '#a5b4fc', to: '#c4b5fd' } // indigo-300 to violet-300
        }
    },
    {
        id: 'fire',
        name: '🔥 Ngọn Lửa Nhiệt Huyết',
        description: 'Màu đỏ rực rỡ của ngọn lửa',
        unlockRequirement: 'perfect_streak_3',
        isUnlocked: false,
        colors: {
            primary: '#dc2626', // red-600
            secondary: '#ea580c', // orange-600
            accent: '#f97316', // orange-500
            background: '#fef2f2', // red-50
            gradient: { from: '#fca5a5', to: '#fdba74' } // red-300 to orange-300
        }
    },
    {
        id: 'diamond',
        name: '💎 Kim Cương Lấp Lánh',
        description: 'Màu xanh ngọc quý giá',
        unlockRequirement: 'grand_master_20',
        isUnlocked: false,
        colors: {
            primary: '#06b6d4', // cyan-500
            secondary: '#14b8a6', // teal-500
            accent: '#22d3ee', // cyan-400
            background: '#ecfeff', // cyan-50
            gradient: { from: '#67e8f9', to: '#5eead4' } // cyan-300 to teal-300
        }
    }
];

// Helper function để lấy theme theo ID
export const getThemeById = (themeId: string): Theme => {
    return THEMES.find(t => t.id === themeId) || THEMES[0];
};

// Helper function để check xem theme đã unlock chưa
export const isThemeUnlocked = (themeId: string, earnedBadges: string[]): boolean => {
    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) return false;
    if (theme.unlockRequirement === 'none') return true;
    return earnedBadges.includes(theme.unlockRequirement);
};
