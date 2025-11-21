import React from 'react';
import Mascot from './Mascot';

interface LoadingViewProps {
  message?: string;
  subMessage?: string;
}

const LoadingView: React.FC<LoadingViewProps> = ({
  message = "Đang tải...",
  subMessage = "Bé đợi một chút nhé! 🚀"
}) => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fade-in">
      <div className="relative">
        <Mascot emotion="thinking" size={150} className="animate-bounce-fun" />
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-black/10 rounded-full blur-md animate-pulse"></div>
      </div>
      <h2 className="mt-8 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse text-center px-4">
        {message}
      </h2>
      <p className="text-gray-500 mt-2 font-medium animate-bounce text-center px-4">
        {subMessage}
      </p>
    </div>
  );
};

export default LoadingView;