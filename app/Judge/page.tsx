// app/Judge/page.tsx
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

// 定义常见垃圾物品及其分类（简化版）
const GARBAGE_ITEMS: Record<string, string> = {
  // 可回收物
  "纸": "recyclable",
  "纸板": "recyclable",
  "塑料": "recyclable",
  "玻璃": "recyclable",
  "金属": "recyclable",
  "布料": "recyclable",
  "报纸": "recyclable",
  "纸箱": "recyclable",
  "塑料瓶": "recyclable",
  "玻璃瓶": "recyclable",
  "易拉罐": "recyclable",
  "衣服": "recyclable",
  
  // 有害垃圾
  "电池": "harmful",
  "油漆": "harmful",
  "药品": "harmful",
  "灯泡": "harmful",
  "化妆品": "harmful",
  "杀虫剂": "harmful",
  "温度计": "harmful",
  
  // 湿垃圾
  "剩菜": "kitchen",
  "剩饭": "kitchen",
  "果皮": "kitchen",
  "骨头": "kitchen",
  "蔬菜": "kitchen",
  "水果": "kitchen",
  "茶叶": "kitchen",
  "咖啡渣": "kitchen",
  
  // 干垃圾
  "纸巾": "other",
  "烟头": "other",
  "陶瓷": "other",
  "灰土": "other",
  "卫生纸": "other",
  "纸尿裤": "other",
  "大骨头": "other",
}

const Judge = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { result, setResult, error, setError } = useRecognitionStore()

  // 处理搜索框内容变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // 处理智能识别
  const handleRecognize = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      // 准备请求数据
      const requestData = {
        query: searchQuery
      }

      // 调用API（这里使用模拟数据，实际项目中替换为真实API）
      setTimeout(() => {
        // 简单的关键词匹配逻辑
        let matchedCategory: string = 'other' // 默认设为干垃圾
        
        // 查找最具体的匹配项
        Object.keys(GARBAGE_ITEMS).forEach(item => {
          if (searchQuery.includes(item)) {
            matchedCategory = GARBAGE_ITEMS[item]
          }
        })
        
        // 没有明确匹配时使用通用分类规则
        if (searchQuery.includes('纸') || searchQuery.includes('塑料') || searchQuery.includes('玻璃') || 
            searchQuery.includes('金属') || searchQuery.includes('布料')) {
          matchedCategory = 'recyclable'
        } else if (searchQuery.includes('电池') || searchQuery.includes('药品') || searchQuery.includes('油漆')) {
          matchedCategory = 'harmful'
        } else if (searchQuery.includes('剩菜') || searchQuery.includes('剩饭') || searchQuery.includes('果皮')) {
          matchedCategory = 'kitchen'
        }

        // 确保details数组结构正确
        const details = Object.keys(GARBAGE_CATEGORIES).map(cat => ({
          name: cat,
          confidence: cat === matchedCategory ? 0.9 : 0.1
        }))

        setResult({
          category: matchedCategory,
          confidence: 0.9, // 简化为固定值，实际应根据模型返回
           // 确保每个元素都包含name和confidence
        })
        setIsLoading(false)
      }, 800)

    } catch (err: any) {
      console.error('识别失败:', err)
      setError('识别失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 处理按键事件（回车触发搜索）
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRecognize()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">垃圾分类智能识别</h1>

        {/* 搜索框区域 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="输入垃圾名称，例如：塑料瓶、苹果皮..."
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              onClick={handleRecognize}
              disabled={isLoading || !searchQuery.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors 
                          ${isLoading || !searchQuery.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              {isLoading ? (
                <i className="fa fa-circle-o-notch fa-spin"></i>
              ) : (
                <i className="fa fa-search"></i>
              )}
            </button>
          </div>
          
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              查询物品: <span className="font-medium">{searchQuery}</span>
            </p>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* 识别结果 */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">分类结果</h2>
            
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
                      <p className="text-gray-600">"{searchQuery}" 属于{GARBAGE_CATEGORIES[result.category].name}</p>
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
                    <span>分类置信度</span>
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
                  <h4 className="font-medium text-gray-800 mb-2">投放建议:</h4>
                  <p className="text-gray-600 text-sm">
                    {result.category === 'recyclable' 
                      ? '请投放至蓝色可回收物垃圾桶。可回收物主要包括废纸、塑料、玻璃、金属和布料五大类。' 
                      : result.category === 'harmful' 
                        ? '请投放至红色有害垃圾桶。有害垃圾含有对人体健康有害的重金属、有毒的物质或者对环境造成现实危害或者潜在危害的废弃物。' 
                        : result.category === 'kitchen' 
                          ? '请投放至绿色湿垃圾桶。湿垃圾即易腐垃圾，指食材废料、剩菜剩饭、过期食品、瓜皮果核、花卉绿植、中药药渣等易腐的生物质生活废弃物。' 
                          : '请投放至灰色干垃圾桶。干垃圾即其它垃圾，指除可回收物、有害垃圾、湿垃圾以外的其它生活废弃物。'}
                  </p>
                </div>
                
                {/* 分类详情 */}
                {result.details && result.details.length > 0 && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">分类可能性:</h4>
                    <div className="space-y-2">
                      {result.details.map((detail: { name: string | number; confidence: number }, index: React.Key | null | undefined) => (
                        <div key={index} className="flex items-center">
                          <span className="w-24 text-sm font-medium">
                            {GARBAGE_CATEGORIES[detail.name]?.name || detail.name}
                          </span>
                          <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-${GARBAGE_CATEGORIES[detail.name]?.color || 'gray'}-500 h-2 rounded-full`}
                              style={{ width: `${detail.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="w-12 text-sm text-right">{(detail.confidence * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Judge