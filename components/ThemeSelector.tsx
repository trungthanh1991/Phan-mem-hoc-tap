import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import Card from './Card';
import Button from './Button';
import { CheckCircleIcon, LockIcon, PaintBrushIcon } from './icons';
import { BADGES } from '../constants';

const ThemeSelector: React.FC = () => {
    const { currentTheme, availableThemes, changeTheme } = useTheme();
    const { handleBackToSubjects } = useGame();
    const [selectedTheme, setSelectedTheme] = useState(currentTheme.id);

    const handleApplyTheme = () => {
        changeTheme(selectedTheme);
    };

    const getBadgeName = (unlockRequirement: string) => {
        if (unlockRequirement === 'none') return 'Có sẵn ngay';
        const badge = BADGES.find(b => b.id === unlockRequirement);
        return badge ? badge.name : unlockRequirement;
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-6 animate-fade-in-up">
            <div className="mb-6">
                <button onClick={handleBackToSubjects} className="text-primary hover:underline mb-4">
                    &larr; Quay lại
                </button>
                <div className="flex items-center gap-3 mb-2">
                    <PaintBrushIcon className="h-10 w-10 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">Tùy Chỉnh Giao Diện</h1>
                </div>
                <p className="text-xl text-secondary">Chọn theme yêu thích của bé! Mở khóa thêm nhiều theme bằng cách hoàn thành thử thách.</p>
            </div>

            {/* Theme hiện tại */}
            <Card className="mb-6 bg-gradient-to-r p-6" style={{
                backgroundImage: `linear-gradient(to right, ${currentTheme.colors.gradient.from}, ${currentTheme.colors.gradient.to})`
            }}>
                <div className="flex items-center gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                        <PaintBrushIcon className="h-8 w-8" style={{ color: currentTheme.colors.primary }} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white opacity-90">Theme hiện tại</p>
                        <h2 className="text-2xl font-bold text-white">{currentTheme.name}</h2>
                        <p className="text-white opacity-80">{currentTheme.description}</p>
                    </div>
                </div>
            </Card>

            {/* Danh sách themes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableThemes.map((theme) => {
                    const isSelected = selectedTheme === theme.id;
                    const isCurrentTheme = currentTheme.id === theme.id;

                    return (
                        <Card
                            key={theme.id}
                            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${isSelected ? 'ring-4 ring-primary shadow-2xl' : 'hover:shadow-xl'
                                } ${!theme.isUnlocked ? 'opacity-60' : ''}`}
                            onClick={() => theme.isUnlocked && setSelectedTheme(theme.id)}
                        >
                            {/* Theme preview gradient */}
                            <div
                                className="h-32 -m-6 mb-4 rounded-t-xl flex items-center justify-center relative overflow-hidden"
                                style={{
                                    backgroundImage: `linear-gradient(135deg, ${theme.colors.gradient.from}, ${theme.colors.gradient.to})`
                                }}
                            >
                                {/* Lock overlay */}
                                {!theme.isUnlocked && (
                                    <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
                                        <LockIcon className="h-12 w-12 text-white" />
                                    </div>
                                )}

                                {/* Current theme badge */}
                                {isCurrentTheme && (
                                    <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                        <span>Đang dùng</span>
                                    </div>
                                )}

                                {/* Color palette preview */}
                                <div className="flex gap-2">
                                    <div className="w-10 h-10 rounded-full shadow-lg" style={{ backgroundColor: theme.colors.primary }} />
                                    <div className="w-10 h-10 rounded-full shadow-lg" style={{ backgroundColor: theme.colors.secondary }} />
                                    <div className="w-10 h-10 rounded-full shadow-lg" style={{ backgroundColor: theme.colors.accent }} />
                                </div>
                            </div>

                            {/* Theme info */}
                            <div className="p-4 pt-0">
                                <h3 className="text-xl font-bold text-secondary-dark mb-1">{theme.name}</h3>
                                <p className="text-sm text-secondary mb-3">{theme.description}</p>

                                {/* Unlock status */}
                                <div className="flex items-center justify-between">
                                    {theme.isUnlocked ? (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                                            ✓ Đã mở khóa
                                        </span>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                                                <LockIcon className="h-3 w-3" />
                                                Chưa mở khóa
                                            </span>
                                            <span className="text-xs text-secondary">
                                                Cần: {getBadgeName(theme.unlockRequirement)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Select button */}
                                    {theme.isUnlocked && (
                                        <button
                                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${isSelected
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedTheme(theme.id);
                                            }}
                                        >
                                            {isSelected ? 'Đã chọn' : 'Chọn'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Apply button */}
            {selectedTheme !== currentTheme.id && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
                    <Button
                        onClick={handleApplyTheme}
                        variant="primary"
                        className="shadow-2xl px-8 py-4 text-lg font-bold"
                    >
                        Áp Dụng Theme
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ThemeSelector;
