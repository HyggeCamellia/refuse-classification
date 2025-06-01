// stores/recognitionStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import { HistoryItem } from '@/types/history'

interface RecognitionState {
  history: HistoryItem[]
  fetchHistory: () => Promise<void>
  deleteHistoryItem: (id: string) => Promise<void>
  // 其他状态和方法...
}

export const useRecognitionStore = create<RecognitionState>()(
  persist(
    (set, get) => ({
      history: [],
      
      fetchHistory: async () => {
        try {
          // 实际项目中替换为真实API调用
          const mockData: HistoryItem[] = [
            {
              id: '1',
              query: '塑料瓶',
              category: 'recyclable',
              confidence: 0.95,
              timestamp: new Date().toISOString()
            },
            {
              id: '2',
              query: '电池',
              category: 'harmful',
              confidence: 0.98,
              timestamp: new Date(Date.now() - 86400000).toISOString()
            }
          ]
          
          // 模拟API响应延迟
          await new Promise(resolve => setTimeout(resolve, 500))
          set({ history: mockData })
        } catch (error) {
          console.error('获取历史记录失败', error)
          throw error
        }
      },
      
      deleteHistoryItem: async (id: string) => {
        try {
          // 实际项目中替换为真实API调用
          await new Promise(resolve => setTimeout(resolve, 300))
          
          // 更新本地状态
          set({ history: get().history.filter(item => item.id !== id) })
        } catch (error) {
          console.error('删除历史记录失败', error)
          throw error
        }
      },
      
      // 其他方法...
    }),
    {
      name: 'recognition-storage',
      partialize: (state) => ({ history: state.history }),
    }
  )
)