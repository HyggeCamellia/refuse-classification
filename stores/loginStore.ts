import { create } from 'zustand';
import axios from 'axios';

// 定义类型
interface LoginStore {
  error: string | null;
  loading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  resetError: () => void;
}

export const useLoginStore = create<LoginStore>((set) => ({
  error: null,
  loading: false,
  login: async (credentials) => {
    try {
      set({ loading: true });
      // 这里替换为你的实际登录 API 调用
// 引入 axios 库，解决找不到 axios 名称的问题
await axios.post('/api/login', credentials);
      set({ error: null });
    } catch (err) {
      set({ error: '登录失败，请检查凭证' });
    } finally {
      set({ loading: false });
    }
  },
  resetError: () => set({ error: null })
}));