import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // 导入 BrowserRouter 和 Routes 组件
import Picture1 from "./picture1/page";// 导入 Picture1 组件
import Judge from "./judge/page";
import History1 from "./History1/page";
import Seaach1 from "./Seach1/page";
const page = () => {
    const menuItems = [
        { label: '搜索识别', link: '/Seach1' },
        { label: '图片识别', link: '/Picture1' },
        { label: '判断精灵', link: '/Judge' },
        { label: '历史数据', link: '/History' },
    ];
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/搜索识别" element={<Seaach1 />} />
                    <Route path="/图片识别" element={<Picture1 />} />
                    <Route path="/判断精灵" element={<Judge />} />
                    <Route path="/历史数据" element={<History1 />} />
                </Routes>
            </div>
        </Router>
    );
};

export default page;