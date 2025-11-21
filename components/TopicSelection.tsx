
import React, { useState, useEffect } from 'react';
import { TOPICS, QUIZ_LENGTH } from '../constants';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import Card from './Card';
import { ClockIcon, StarIcon } from './icons';

const TopicSelection: React.FC = () => {
    const { selectedSubject, handleTopicSelect, handleBackToSubjects, error, handleStartExam } = useGame();
    const { getWeakestTopicId, stats } = useUser();
    const [recommendedTopicId, setRecommendedTopicId] = useState<string | null>(null);

    useEffect(() => {
        if (selectedSubject) {
            const weakestId = getWeakestTopicId(selectedSubject.id);
            setRecommendedTopicId(weakestId);
        }
    }, [selectedSubject, getWeakestTopicId]);

    if (!selectedSubject) {
        return null;
    }

    const hasBgImage = !!selectedSubject.backgroundImage;

    const bgStyle = hasBgImage
        ? {
            backgroundImage: `url(${selectedSubject.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }
        : {};

    // Lấy thống kê cho môn học hiện tại
    const currentSubjectStats = stats[selectedSubject.id] || {};

    // Topic emojis mapping
    const topicEmojis: { [key: string]: string } = {
        'Cộng trừ trong phạm vi 1000': '➕➖',
        'Nhân chia trong bảng 2-10': '✖️➗',
        'Hình học cơ bản': '📐',
        'Xem đồng hồ': '⏰',
        'Giải toán có lời văn': '📝',
        'Đo lường (mét, gam)': '📏',
        'So sánh (lớn hơn, nhỏ hơn, bằng)': '⚖️',

        // Tiếng Việt
        'Từ vựng': '📖',
        'Ngữ pháp cơ bản': '✏️',
        'Đọc hiểu đoạn văn ngắn': '📚',
        'Viết câu đơn giản': '✍️',
        'Luyện đọc': '🗣️',
        'Luyện viết': '📝',

        // Tự nhiên & Xã hội
        'Con vật': '🐾',
        'Cây cối': '🌳',
        'Gia đình và bạn bè': '👨‍👩‍👧‍👦',
        'Môi trường xung quanh': '🏡',

        // Tiếng Anh
        'Alphabet': '🔤',
        'Numbers (1-20)': '🔢',
        'Colors': '🎨',
        'Family': '👪',
        'Animals': '🐶',
        'Food & Drinks': '🍎',
        'Tập đọc': '📖',
        'Nghe đọc': '👂'
    };

    return (
        <div
            className="text-center min-h-screen w-full py-8 px-4 relative"
            style={bgStyle}
        >
            {hasBgImage && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-0"></div>
            )}

            <div className="relative z-10 bg-transparent max-w-7xl mx-auto">

                <button
                    onClick={handleBackToSubjects}
                    className="text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-bold px-6 py-3 rounded-full shadow-cartoon hover:shadow-cartoon-hover transform hover:scale-105 transition-all mb-6"
                >
                    ⬅️ Quay lại chọn môn
                </button>

                <div className="mb-8">
                    <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-3 animate-float">
                        📚 {selectedSubject.name}
                    </h2>

                    <p className="text-2xl text-gray-700 font-semibold">
                        🤔 Bé muốn ôn tập chủ đề nào nhỉ?
                    </p>
                </div>

                {recommendedTopicId && (
                    <Card
                        className="bg-gradient-to-r from-blue-400 to-cyan-400 border-4 border-blue-500 text-white text-left px-6 py-4 mb-8 flex items-center gap-4 animate-bounce-fun max-w-2xl mx-auto"
                        role="alert"
                    >
                        <span className="text-4xl animate-wiggle">💡</span>
                        <div>
                            <p className="font-bold text-lg">🎯 GỢI Ý CHO BÉ!</p>
                            <span className="font-semibold text-base">
                                Bé nên luyện thêm chủ đề được đánh dấu ⭐ bên dưới nhé!
                            </span>
                        </div>
                    </Card>
                )}

                {error && (
                    <Card
                        className="bg-red-100 border-4 border-red-500 text-red-800 text-left px-6 py-4 mb-8 font-bold"
                        role="alert"
                    >
                        ⚠️ {error}
                    </Card>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TOPICS[selectedSubject.id].map((topic, index) => {
                        const isRecommended = topic.id === recommendedTopicId;
                        const topicStat = currentSubjectStats[topic.id];

                        const totalCorrect = topicStat?.totalCorrect || 0;
                        const masteryLevel = Math.min((totalCorrect / 50) * 100, 100);

                        const isMastered = masteryLevel >= 100;
                        const emoji = topicEmojis[topic.name] || '📚';

                        return (
                            <Card
                                key={topic.id}
                                onClick={() => handleTopicSelect(topic)}
                                className={`relative flex flex-col justify-between text-gray-800 text-lg font-bold bg-white hover:bg-gradient-to-br from-white to-blue-50 transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 min-h-[180px] ${isRecommended ? 'ring-4 ring-offset-4 ring-yellow-400 animate-pulse' : ''
                                    }`}
                                style={{
                                    animationDelay: `${index * 0.05}s`
                                }}
                            >
                                {isRecommended && (
                                    <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-black px-4 py-2 rounded-full shadow-cartoon z-20 animate-bounce-fun">
                                        ⭐ GỢI Ý
                                    </div>
                                )}
                                {isMastered && (
                                    <div className="absolute -top-3 -left-3 text-yellow-400 z-20 drop-shadow-lg animate-wiggle">
                                        <StarIcon className="h-10 w-10 fill-current" />
                                    </div>
                                )}

                                {/* Emoji badge */}
                                <div className="text-5xl mb-3 animate-float">
                                    {emoji}
                                </div>

                                <div className="mb-4 z-10 relative leading-tight">
                                    {topic.name}
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-3 mt-auto overflow-hidden border-2 border-gray-300">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-1000 ${isMastered ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse' : 'bg-gradient-to-r from-green-400 to-blue-500'}`}
                                        style={{ width: `${masteryLevel}%` }}
                                    ></div>
                                </div>
                                <div className="text-sm text-right mt-2 text-gray-600 font-semibold">
                                    ✅ {totalCorrect} câu đúng
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-12 border-t-4 border-dashed border-purple-300 pt-8">
                    <h3 className="text-3xl font-bold text-purple-700 mb-6 animate-bounce-fun">
                        🎯 Hoặc thử sức với...
                    </h3>

                    <Card
                        onClick={handleStartExam}
                        className="flex flex-col md:flex-row items-center justify-center gap-4 text-white text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 transform hover:scale-110 max-w-md mx-auto transition-all duration-300 py-8 animate-rainbow-pulse"
                    >
                        <ClockIcon className="h-12 w-12 animate-bounce-fun" />
                        <div>
                            <div>⏱️ Bài Thi Thử</div>
                            <div className="text-lg font-semibold">Tổng Hợp Kiến Thức</div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TopicSelection;
