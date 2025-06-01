// types/recognition.ts
export interface RecognitionResult {
    category: string
    confidence: number
    details: { name: string; confidence: number }[] // 改为必需属性
  }