'use client'
import { useRouter } from 'next/navigation'

const Sleep1 = () => {
  const router = useRouter()

  // 打印日志辅助调试
  const handleNavigate = (path: string) => {
    console.log(`尝试跳转到: ${path}`)
    router.push(path)
  }

  return (
    <div className="flex min-h-screen">
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部标签 */}
        <div className="bg-pink-200 p-6 text-center text-3xl font-bold">
          垃圾智能分类系统
        </div>

        {/* 侧边标签和主内容 */}
        <div className="flex flex-1">
          {/* 侧边标签 - 带调试日志的按钮 */}
          <div className="bg-blue-100 w-30 p-4">
           
            <button 
              onClick={() => handleNavigate('/Picture1')}
              className="w-full my-2 py-2 bg-white border rounded hover:bg-blue-50"
            >
              图片识别
            </button>
            <button 
              onClick={() => handleNavigate('/Judge')}
              className="w-full my-2 py-2 bg-white border rounded hover:bg-blue-50"
            >
              判断精灵
            </button>
            <button 
              onClick={() => handleNavigate('/History1')}
              className="w-full my-2 py-2 bg-white border rounded hover:bg-blue-50"
            >
              历史数据
            </button>
          </div>

          {/* 主内容区域 - 显示当前路由信息 */}
          <div className="flex-1 p-6 bg-gray-50">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">当前页面: Sleep1</h2>
              <p className="text-gray-600">点击左侧按钮导航到不同功能模块</p>
              <p className="text-gray-500 mt-4">
                提示: 若点击无反应，请检查控制台是否有错误
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sleep1