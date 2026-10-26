import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ReaderDesignLab } from './components/ReaderDesignLab';
import './index.css';
import './reader-design-lab.css';
import './reading-journey.css';
import './recommend-intro.css';
import './start-arrival.css';
import './difficulty-picker.css';
import './reading-home.css';
import './companion-select.css';

const isReaderLab = new URLSearchParams(window.location.search).has('reader-lab');

createRoot(document.getElementById('root')!).render(
  isReaderLab ? <ReaderDesignLab /> : <App />
);
