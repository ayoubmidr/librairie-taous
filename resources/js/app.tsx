import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

const appName = document.getElementsByTagName('title')[0]?.innerText ?? 'Librairie Taous';

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const app = (
            <HelmetProvider>
                <App {...props} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: { fontFamily: 'Inter, sans-serif' },
                        success: { iconTheme: { primary: '#1a4731', secondary: '#fff' } },
                    }}
                />
            </HelmetProvider>
        );

        if (import.meta.env.SSR) {
            hydrateRoot(el, app);
        } else {
            createRoot(el).render(app);
        }
    },
    progress: { color: '#c9a84c', showSpinner: false },
});
