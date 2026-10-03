import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LoginGate } from './components/LoginGate';
import './index.css';

// इन्स्टल प्रम्प्ट छिट्टै आउन सक्छ, त्यसैले एप लोड हुनुअघि नै समात्ने
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); (window as any).__pwaPrompt = e; window.dispatchEvent(new Event('pwa-ready')); });

createRoot(document.getElementById('root')!).render(<LoginGate>{(v) => <App key={v} />}</LoginGate>);
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
