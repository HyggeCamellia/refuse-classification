// stores/recognitionStore.ts
import { create } from 'zustand'

interface State {
  result: { category: string; confidence: number; details?: { name: string; confidence: number }[] } | null
  error: string | null
  setResult: (result: { category: string; confidence: number; details?: { name: string; confidence: number }[] } | null) => void
  setError: (error: string | null) => void
}

export const Store = create<State>((set) => ({
  result: null,
  error: null,
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
}))