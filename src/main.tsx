
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find root element");
  const div = document.createElement("div");
  div.id = "root";
  document.body.appendChild(div);
}

const root = createRoot(rootElement ?? document.getElementById("root")!);

try {
  root.render(<App />);
} catch (error) {
  console.error("Failed to render app:", error);
}
