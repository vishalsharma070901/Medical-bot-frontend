import "./App.css";
import MainSidebar from "@/Main/SideBar/MainSidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSidebar />} />
        <Route path="/chat/:id" element={<MainSidebar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
