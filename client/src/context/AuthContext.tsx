import React, { createContext, useContext, useState, ReactNode } from 'react';

// Интерфейс для контекста
interface AuthContextType {
  isAuthenticated: boolean;
  userId: number | null;
  userType: string | null;
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
  const [userId, setUserId] = useState<number | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  const login = async (email: string, password: string, type: string) => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', { // Убедитесь, что URL правильный
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      // Установка данных в состояние
      setIsAuthenticated(true);
      setUserId(data.userId); // Предполагается, что сервер возвращает userId
      setUserType(data.userType); // Предполагается, что сервер возвращает userType
    } catch (error) {
      console.error('Login error', error);
      throw error; // Бросаем ошибку дальше, чтобы она могла быть поймана в Login.tsx
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setUserType(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, userType, login, logout }}>
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
