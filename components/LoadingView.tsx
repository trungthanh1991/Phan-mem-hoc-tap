
import React from 'react';
import Spinner from './Spinner';

interface LoadingViewProps {
  message?: string;
  subMessage?: string;
}

const LoadingView: React.FC<LoadingViewProps> = ({ message = "Đang tạo câu hỏi...", subMessage = "Bé chờ một chút xíu nhé!" }) => (
    <div className="flex flex-col items-center justify-center text-center">
        <Spinner />
        <h2 className="text-2xl font-semibold text-secondary-dark mt-4">{message}</h2>
        <p className="text-secondary">{subMessage}</p>
    </div>
);

export default LoadingView;