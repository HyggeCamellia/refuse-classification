'use client'

import { useState } from 'react'

const Sleep1 = () => {
    const [count, setCount] = useState(0);

    return (
        <div className="flex min-h-screen">
            {/* 主内容区域 */}
            <div className="flex-1 flex flex-col">
                {/* 顶部标签 */}
                <div className="bg-pink-200 p-6 text-center">
                    垃圾智能分类系统
                </div>

                {/* 侧边标签和主内容 */}
                <div className="flex flex-1">
                    {/* 侧边标签 */}
                    <div className="bg-blue-100 w-30 p-4">
                        <div className="mb-36 ">
                            <button>搜索识别</button>
                        </div>
                        <div className="mb-36">
                            <button>图片识别</button>
                        </div>
                        <div className="mb-36">
                            <button>判断精灵</button>
                        </div>
                        <div className="mb-36">
                            <button>历史数据</button>
                        </div>
                    </div>

                    {/* 主内容 */}
                    <div className="flex-1 p-4">
                        <div className="bg-gray-200 w-100 h-100">
                            <div className="bg-gray-300 w-100 h-100">
                                <div className="bg-gray-400 w-100 h-100">
                                    <div className="bg-pink-300 w-20 h-100 ">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sleep1;