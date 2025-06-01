import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/api/axios';
import { useAuthStore } from '@/stores/authStore';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // 固定账号密码验证
    if (username === 'sleep' && password === '123456') {
      useAuthStore.getState().login('fake-token', { id: 'fake-id', name: 'sleep' });
      router.push('/Sleep1');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', { username, password });
      useAuthStore.getState().login(response.data.token, response.data.user);
      router.push('/Sleep1');
    } catch (err) {
      setError('Invalid username or password');
      setTimeout(() => setError(''), 3000); // 3秒后自动清除错误信息
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 to-blue-800">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* 登录卡片 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/70">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 用户名输入框 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa fa-user text-white/50"></i>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 w-full bg-white/5 border border-white/20 rounded-lg py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* 密码输入框 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa fa-lock text-white/50"></i>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full bg-white/5 border border-white/20 rounded-lg py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-300 text-sm flex items-center">
                <i className="fa fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all transform hover:-translate-y-1 hover:shadow-lg"
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <i className="fa fa-circle-o-notch fa-spin mr-2"></i>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* 底部链接 */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Don't have an account? <a href="#" className="text-white hover:text-white/80 font-medium">Contact support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}    







