// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Интерфейс для контекста
interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string, type: string) => Promise<void>;
  logout: () => void;
}

// Создаем контекст с пустыми значениями
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Интерфейс для пропсов провайдера контекста
interface AuthProviderProps {
  children: ReactNode;
}

// Провайдер контекста
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (email: string, password: string, type: string) => {
    // Ваш код для входа, который учитывает тип пользователя
    // Например, запрос к серверу и установка состояния
    // const response = await fetch('/login', { method: 'POST', body: JSON.stringify({ email, password, type }) });
    setIsAuthenticated(true); // Установите состояние в true при успешном входе
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
