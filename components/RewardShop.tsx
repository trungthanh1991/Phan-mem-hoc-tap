import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import { useSound } from '../contexts/SoundContext';
import { SHOP_ITEMS } from '../constants';
import Card from './Card';
import Button from './Button';
import Mascot from './Mascot';
import { ShopItem, AccessoryType } from '../types';

const RewardShop: React.FC = () => {
    const { setGameState } = useGame();
    const { stars, ownedAccessories, equippedAccessories, buyAccessory, equipAccessory } = useUser();
    const { playSound } = useSound();
    const [selectedCategory, setSelectedCategory] = useState<AccessoryType | 'all'>('all');

    const categories: { id: AccessoryType | 'all'; name: string; icon: string }[] = [
        { id: 'all', name: 'Tất Cả', icon: '🛍️' },
        { id: 'hat', name: 'Mũ', icon: '🎩' },
        { id: 'glasses', name: 'Kính', icon: '👓' },
        { id: 'outfit', name: 'Trang Phục', icon: '👕' },
        { id: 'background', name: 'Phông Nền', icon: '🌈' },
    ];

    const filteredItems = selectedCategory === 'all'
        ? SHOP_ITEMS
        : SHOP_ITEMS.filter(item => item.type === selectedCategory);

    const handleBuy = (item: ShopItem) => {
        const success = buyAccessory(item.id, item.price);
        if (success) {
            playSound('badge');
        } else {
            playSound('wrong');
        }
    };

    const handleEquip = (item: ShopItem) => {
        equipAccessory(item.id, item.type);
        playSound('click');
    };

    const isOwned = (itemId: string) => ownedAccessories.includes(itemId);
    const isEquipped = (itemId: string) => Object.values(equippedAccessories).includes(itemId);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
            {/* Back Button */}
            <div className="mb-4">
                <button
                    onClick={() => {
                        setGameState('subject_selection');
                        playSound('click');
                    }}
                    className="text-primary hover:underline bg-white/50 rounded-full px-3 py-1 backdrop-blur-sm font-medium"
                >
                    ← Quay lại
                </button>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 animate-pulse mb-2">
                    🛒 Cửa Hàng Đổi Quà
                </h1>
                <p className="text-lg text-gray-600 font-medium">Trang trí cho bạn Cú Mèo thông thái!</p>

                {/* Mascot Preview */}
                <div className="mt-6 flex justify-center">
                    <div className="bg-blue-50 p-6 rounded-full border-4 border-blue-200 shadow-inner">
                        <Mascot emotion="happy" size={160} />
                    </div>
                </div>
            </div>

            {/* Stars Display */}
            <Card className="mb-6 bg-gradient-to-r from-yellow-100 to-amber-100 border-4 border-yellow-400">
                <div className="flex items-center justify-center gap-3">
                    <span className="text-5xl animate-bounce">⭐</span>
                    <div>
                        <p className="text-sm text-gray-600 font-medium">Sao của bé:</p>
                        <p className="text-4xl font-bold text-yellow-600">{stars}</p>
                    </div>
                </div>
            </Card>

            {/* Category Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => {
                            setSelectedCategory(category.id);
                            playSound('click');
                        }}
                        className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all transform hover:scale-110 ${selectedCategory === category.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110'
                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-purple-400'
                            }`}
                    >
                        <span className="mr-1">{category.icon}</span>
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Shop Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                    <Card
                        key={item.id}
                        className={`relative overflow-hidden transition-all transform hover:scale-105 ${isEquipped(item.id)
                            ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-green-500 shadow-2xl'
                            : isOwned(item.id)
                                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300'
                                : 'bg-white border-2 border-gray-200'
                            }`}
                    >
                        {/* Equipped Badge */}
                        {isEquipped(item.id) && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                                ✓ Đang đeo
                            </div>
                        )}

                        {/* Item Display */}
                        <div className="text-center">
                            <div className="text-7xl mb-3 animate-float">{item.icon}</div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{item.description}</p>

                            {/* Price / Actions */}
                            {isOwned(item.id) ? (
                                <div className="space-y-2">
                                    {isEquipped(item.id) ? (
                                        <div className="text-green-600 font-bold flex items-center justify-center gap-1">
                                            <span className="text-2xl">✓</span> Đang sử dụng
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => handleEquip(item)}
                                            variant="success"
                                            className="w-full"
                                            disableSound={true}
                                        >
                                            🎨 Đeo Ngay
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-yellow-600 font-bold text-xl">
                                        <span>⭐</span>
                                        <span>{item.price}</span>
                                    </div>
                                    <Button
                                        onClick={() => handleBuy(item)}
                                        variant="primary"
                                        className={`w-full ${stars < item.price ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={stars < item.price}
                                        disableSound={true}
                                    >
                                        {stars < item.price ? '❌ Chưa đủ sao' : '🛒 Mua Ngay'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
                <Card className="text-center py-12">
                    <p className="text-3xl mb-2">🔍</p>
                    <p className="text-gray-600 font-medium">Không có vật phẩm nào trong danh mục này.</p>
                </Card>
            )}

            {/* Tips */}
            <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300">
                <p className="text-center text-sm text-gray-700 font-medium">
                    💡 <span className="font-bold">Mẹo:</span> Làm bài tập đúng để kiếm thêm sao! Mỗi câu đúng = 1 ⭐
                </p>
            </Card>
        </div>
    );
};

export default RewardShop;
