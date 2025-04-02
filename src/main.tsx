import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const container = document.getElementById("root");
if (container) {
  // 创建根节点
  const root = createRoot(container);
  // 渲染应用
  root.render(<App />);
}
