import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Theme } from '../types';
import { THEMES, getThemeById, isThemeUnlocked } from '../themes';
import { useUser } from './UserContext';

interface ThemeContextType {
    currentTheme: Theme;
    availableThemes: Theme[];
    changeTheme: (themeId: string) => void;
    unlockTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'sanChoiTriTue_currentTheme';
const UNLOCKED_THEMES_KEY = 'sanChoiTriTue_unlockedThemes';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { earnedBadges } = useUser();
    const [currentThemeId, setCurrentThemeId] = useState<string>('default');
    const [unlockedThemeIds, setUnlockedThemeIds] = useState<string[]>(['default']);

    // Load theme từ localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        const savedUnlocked = localStorage.getItem(UNLOCKED_THEMES_KEY);

        if (savedTheme) {
            setCurrentThemeId(savedTheme);
        }
        if (savedUnlocked) {
            try {
                setUnlockedThemeIds(JSON.parse(savedUnlocked));
            } catch (e) {
                console.error('Failed to parse unlocked themes');
            }
        }
    }, []);

    // Auto-unlock themes khi có badge mới
    useEffect(() => {
        const newlyUnlocked: string[] = [];
        THEMES.forEach(theme => {
            if (!unlockedThemeIds.includes(theme.id) && isThemeUnlocked(theme.id, earnedBadges)) {
                newlyUnlocked.push(theme.id);
            }
        });

        if (newlyUnlocked.length > 0) {
            const updatedUnlocked = [...unlockedThemeIds, ...newlyUnlocked];
            setUnlockedThemeIds(updatedUnlocked);
            localStorage.setItem(UNLOCKED_THEMES_KEY, JSON.stringify(updatedUnlocked));
        }
    }, [earnedBadges, unlockedThemeIds]);

    // Apply theme vào document root
    useEffect(() => {
        const theme = getThemeById(currentThemeId);
        const root = document.documentElement;

        // Set CSS variables
        root.style.setProperty('--color-primary', theme.colors.primary);
        root.style.setProperty('--color-secondary', theme.colors.secondary);
        root.style.setProperty('--color-accent', theme.colors.accent);
        root.style.setProperty('--color-background', theme.colors.background);
        root.style.setProperty('--gradient-from', theme.colors.gradient.from);
        root.style.setProperty('--gradient-to', theme.colors.gradient.to);

        // Save to localStorage
        localStorage.setItem(THEME_STORAGE_KEY, currentThemeId);
    }, [currentThemeId]);

    const changeTheme = (themeId: string) => {
        if (unlockedThemeIds.includes(themeId)) {
            setCurrentThemeId(themeId);
        }
    };

    const unlockTheme = (themeId: string) => {
        if (!unlockedThemeIds.includes(themeId)) {
            const updated = [...unlockedThemeIds, themeId];
            setUnlockedThemeIds(updated);
            localStorage.setItem(UNLOCKED_THEMES_KEY, JSON.stringify(updated));
        }
    };

    const availableThemes = THEMES.map(theme => ({
        ...theme,
        isUnlocked: unlockedThemeIds.includes(theme.id)
    }));

    const value = {
        currentTheme: getThemeById(currentThemeId),
        availableThemes,
        changeTheme,
        unlockTheme
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
