import News from "./components/News";
import NewsDetail from "./components/NewsDetail";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<News />} />
      <Route path="/news/:id" element={<NewsDetail />} />
    </Routes>
  );
}

export default App;
