'use client'

import { useState } from 'react'
import TrainingDiary from './components/json/page'
import AIAssistant from './components/llm/page'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('json')

  const menuItems = [
    {
      name: '训练日记',
      key: 'json'
    },
    {
      name: 'AI助手',
      key: 'llm'
    }
  ]

  const renderContent = () => {
    if (activeTab === 'json') {
      return <TrainingDiary />
    }
    if (activeTab === 'llm') {
      return <AIAssistant />
    }
    return <TrainingDiary />
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 顶部导航 */}
      <div className="navbar bg-base-200">
        <div className="flex-1">
          <div className="tabs tabs-boxed bg-base-300">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`tab ${activeTab === item.key ? 'tab-active' : ''}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 p-4">
        {renderContent()}
      </div>
    </div>
  )
}

export default Dashboard