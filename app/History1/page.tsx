// app/History/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRecognitionStore } from '@/stores/recognitionStore'
import { format } from 'date-fns'

// 定义 HistoryItem 类型
type HistoryItem = {
  id: string
  query: string
  category: string
  confidence: number
  timestamp: string
}

// 垃圾分类类别映射
const GARBAGE_CATEGORIES = {
  recyclable: { name: '可回收物', icon: '♻️', color: 'text-blue-500' },
  harmful: { name: '有害垃圾', icon: '⚠️', color: 'text-red-500' },
  kitchen: { name: '湿垃圾', icon: '🍃', color: 'text-green-500' },
  other: { name: '干垃圾', icon: '🗑️', color: 'text-gray-500' },
} as const;

const History = () => {
  // 直接从 store 中获取状态
  const recognitionStore = useRecognitionStore();
  const [localHistory, setLocalHistory] = useState<HistoryItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 从本地存储加载历史记录
  const loadFromLocalStorage = () => {
    try {
      const storedHistory = localStorage.getItem('garbageRecognitionHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        
        // 确保历史记录是数组类型
        if (Array.isArray(parsedHistory)) {
          return parsedHistory;
        }
      }
    } catch (err) {
      console.error('解析本地存储历史记录失败:', err);
    }
    return [];
  };

  // 保存历史记录到本地存储
  const saveToLocalStorage = (historyData: HistoryItem[]) => {
    try {
      localStorage.setItem('garbageRecognitionHistory', JSON.stringify(historyData));
    } catch (err) {
      console.error('保存到本地存储失败:', err);
    }
  };

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 尝试从 store 获取历史记录
        if (recognitionStore.history && recognitionStore.history.length > 0) {
          setLocalHistory(recognitionStore.history);
        } 
        // 如果 store 中没有历史记录，尝试从本地存储加载
        else {
          const storedHistory = loadFromLocalStorage();
          if (storedHistory.length > 0) {
            setLocalHistory(storedHistory);
            // 如果 store 有 setHistory 方法，更新 store
            if (typeof recognitionStore.setHistory === 'function') {
              recognitionStore.setHistory(storedHistory);
            }
          }
        }
      } catch (err: any) {
        setError(err.message || '获取历史数据失败');
      } finally {
        setIsLoading(false);
      }
    }

    loadHistory();
  }, [recognitionStore]);

  const handleDelete = (id: string) => {
    if (!confirm('确定要删除这条历史记录吗？')) return;
    
    setDeletingId(id);
    try {
      // 更新本地状态
      const updatedHistory = localHistory.filter(item => item.id !== id);
      setLocalHistory(updatedHistory);
      
      // 更新本地存储
      saveToLocalStorage(updatedHistory);
      
      // 如果 store 有 setHistory 方法，更新 store
      if (typeof recognitionStore.setHistory === 'function') {
        recognitionStore.setHistory(updatedHistory);
      }
    } catch (err: any) {
      setError(err.message || '删除历史记录失败');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-blue-500">📜</span>
          识别历史记录
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-lg p-6 flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : localHistory.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center py-16">
            <div className="text-gray-300 mb-4 text-6xl">
              📜
            </div>
            <p className="text-gray-600 text-lg">暂无识别历史记录</p>
            <p className="text-gray-400 mt-2">开始垃圾分类识别后，记录将显示在这里</p>
          </div>
        ) : (
          <div className="space-y-4">
            {localHistory.map((item) => {
              // 处理可能的类别值
              const categoryKey = Object.keys(GARBAGE_CATEGORIES).includes(item.category)
                ? item.category as keyof typeof GARBAGE_CATEGORIES
                : 'other';
              
              const categoryInfo = GARBAGE_CATEGORIES[categoryKey];
              
              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className={`text-xl ${categoryInfo.color}`}>
                        {categoryInfo.icon}
                      </span>
                      <div>
                        <h3 className="font-medium text-gray-800">{item.query}</h3>
                        <p className="text-sm text-gray-500">
                          {categoryInfo.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm')}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        置信度: {Math.round(item.confidence * 100)}%
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="text-red-500 hover:text-red-700 text-sm transition-colors disabled:opacity-50 flex items-center"
                    >
                      {deletingId === item.id ? (
                        <>
                          <span className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-red-500 mr-1"></span>
                          删除中
                        </>
                      ) : (
                        <>
                          <span className="mr-1">🗑️</span>
                          删除
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default History