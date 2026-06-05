import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import LoadingProvider from './contexts/Loading.tsx';
import PopupProvider from './contexts/PopupContext.tsx';

createRoot(document.getElementById('root')!).render(
    <PopupProvider>
        <LoadingProvider>
            <App />
        </LoadingProvider>
    </PopupProvider>

)
