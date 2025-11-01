import React from 'react';
import { Badge } from '../types';
import Card from './Card';

const BadgeUnlockCard: React.FC<{ badge: Badge }> = ({ badge }) => {
    return (
        <Card className="bg-gradient-to-br from-yellow-300 to-amber-400 border-2 border-yellow-500 flex items-center p-4 space-x-4 animate-fade-in-up">
            <div className="flex-shrink-0 bg-white/30 p-3 rounded-full">
                <badge.icon className="h-12 w-12 text-yellow-800" />
            </div>
            <div>
                <h4 className="text-lg font-bold text-amber-900">HUY HIỆU MỚI!</h4>
                <p className="font-semibold text-amber-800">{badge.name}</p>
            </div>
        </Card>
    );
};

export default BadgeUnlockCard;
