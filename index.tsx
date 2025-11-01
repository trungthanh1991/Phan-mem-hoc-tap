import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GameProvider } from './contexts/GameContext';
import { UserProvider } from './contexts/UserContext';
import { SpeechProvider } from './contexts/SpeechContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Không tìm thấy phần tử gốc để gắn kết ứng dụng");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <UserProvider>
      <GameProvider>
        <SpeechProvider>
          <App />
        </SpeechProvider>
      </GameProvider>
    </UserProvider>
  </React.StrictMode>
);