import Sleep1 from "./Sleep1/page";
// 由于 Router 被声明但未使用，移除 Router 导入
import { Route, Routes } from "react-router-dom";



const PageSimple = () => {
    return (
        <>
        
                <Routes>
                <Route path="/Sleep1" element={<Sleep1 />} />
                </Routes>


        </>


    )
}
export default PageSimple;