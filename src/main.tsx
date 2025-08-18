
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Restored for full application styling

console.log('🧪 main.tsx is loading...');

const rootElement = document.getElementById("root");
console.log('🧪 Root element found:', rootElement);

if (!rootElement) {
  console.error("Failed to find root element");
  const div = document.createElement("div");
  div.id = "root";
  document.body.appendChild(div);
  console.log('🧪 Created root element dynamically');
}

console.log('🧪 About to create React root...');
const root = createRoot(rootElement ?? document.getElementById("root")!);
console.log('🧪 React root created successfully');

try {
  console.log('🧪 About to render App component...');
  root.render(<App />);
  console.log('🧪 App component rendered successfully');
} catch (error) {
  console.error("Failed to render app:", error);
}
