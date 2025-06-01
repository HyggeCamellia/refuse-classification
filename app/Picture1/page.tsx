// app/Picture1/page.tsx
'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRecognitionStore } from '@/stores/recognitionStore'
import { RecognitionResult } from '@/types/recognition'

// 定义垃圾类别映射（类别ID → 显示名称、图标、颜色）
const GARBAGE_CATEGORIES: Record<string, { name: string; icon: string; color: string }> = {
  recyclable: { name: '可回收物', icon: 'fa-recycle', color: 'blue' },
  harmful: { name: '有害垃圾', icon: 'fa-exclamation-triangle', color: 'red' },
  kitchen: { name: '湿垃圾', icon: 'fa-leaf', color: 'green' },
  other: { name: '干垃圾', icon: 'fa-trash', color: 'gray' },
}

const Picture1 = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  // 从状态管理中获取所有需要的状态和方法
  const { 
    result, 
    isLoading, 
    error, // 新增获取error状态
    setResult, 
    setIsLoading, 
    setError 
  } = useRecognitionStore()

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // 处理图片识别
  const handleRecognize = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setResult(null)
    setError(null) // 清空之前的错误

    try {
      // 准备FormData
      const formData = new FormData()
      formData.append('image', selectedFile)

      // 模拟API响应（实际项目中替换为真实API）
      setTimeout(() => {
        const categories = ['recyclable', 'harmful', 'kitchen', 'other']
        const randomCategory = categories[Math.floor(Math.random() * categories.length)]
        const confidence = 0.7 + Math.random() * 0.3 // 70%-100%

        setResult({
          category: randomCategory,
          confidence: parseFloat(confidence.toFixed(2)),
        })
        setIsLoading(false)
      }, 1500)
    } catch (err: any) {
      console.error('识别失败:', err)
      setError('识别失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">垃圾分类识别</h1>

        {/* 上传区域 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {previewUrl ? (
              // 已选择图片，显示预览
              <div className="mb-6">
                <img 
                  src={previewUrl} 
                  alt="预览" 
                  className="max-h-64 mx-auto rounded-lg shadow-md object-contain"
                />
              </div>
            ) : (
              // 未选择图片，显示提示
              <div className="text-gray-500 mb-6">
                <i className="fa fa-image text-5xl mb-3"></i>
                <p>拖拽图片到此处或点击选择图片</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={handleFileChange}
            />
            <label 
              htmlFor="image-upload" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full cursor-pointer transition-colors"
            >
              选择图片
            </label>
          </div>
        </div>

        {/* 识别按钮 */}
        <div className="text-center mb-8">
          <button
            onClick={handleRecognize}
            disabled={!selectedFile || isLoading}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-full shadow-md transition-all 
                        ${!selectedFile || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <i className="fa fa-circle-o-notch fa-spin mr-2"></i>
                识别中...
              </span>
            ) : selectedFile ? (
              '开始识别'
            ) : (
              '请先选择图片'
            )}
          </button>
        </div>

        {/* 错误提示 - 现在可以正确显示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">识别结果</h2>
            
            {/* 根据垃圾类别动态设置样式 */}
            {GARBAGE_CATEGORIES[result.category] && (
              <div className={`border-2 border-${GARBAGE_CATEGORIES[result.category].color}-500 rounded-lg p-6 bg-${GARBAGE_CATEGORIES[result.category].color}-50`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <i 
                      className={`fa ${GARBAGE_CATEGORIES[result.category].icon} text-4xl text-${GARBAGE_CATEGORIES[result.category].color}-500 mr-4`}
                    ></i>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {GARBAGE_CATEGORIES[result.category].name}
                      </h3>
                      <p className="text-gray-600">适合投放至相应分类垃圾桶</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <span className="text-2xl font-bold text-gray-800">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                </div>
                
                {/* 置信度进度条 */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>识别置信度</span>
                    <span>{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`bg-${GARBAGE_CATEGORIES[result.category].color}-500 h-2.5 rounded-full`}
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* 垃圾分类说明 */}
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">分类说明:</h4>
                  <p className="text-gray-600 text-sm">
                    {result.category === 'recyclable' 
                      ? '可回收物主要包括废纸、塑料、玻璃、金属和布料五大类。' 
                      : result.category === 'harmful' 
                        ? '有害垃圾含有对人体健康有害的重金属、有毒的物质或者对环境造成现实危害或者潜在危害的废弃物。' 
                      : result.category === 'kitchen' 
                        ? '湿垃圾即易腐垃圾，指食材废料、剩菜剩饭、过期食品、瓜皮果核、花卉绿植、中药药渣等易腐的生物质生活废弃物。' 
                      : '干垃圾即其它垃圾，指除可回收物、有害垃圾、湿垃圾以外的其它生活废弃物。'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Picture1