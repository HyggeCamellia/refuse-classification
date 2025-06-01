import { create } from 'zustand'

interface RecognitionState {
  result: {
      details: any; category: string; confidence: number 
} | null
  isLoading: boolean
  error: string | null
  setResult: (result: { category: string; confidence: number } | null) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useRecognitionStore = create<RecognitionState>((set) => ({
  result: null,
  isLoading: false,
  error: null,
// 为了解决类型不匹配问题，当传入 result 时，补充 details 属性
setResult: (result) => set({ result: result ? { details: null, ...result } : null }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))