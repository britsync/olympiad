/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    dark: '#020617',
                    DEFAULT: '#0f172a',
                    light: '#1e293b',
                },
                gold: {
                    DEFAULT: '#fbbf24',
                    glow: '#f59e0b',
                },
                obsidian: '#0a0a0a',
            },
            animation: {
                'glow-pulse': 'glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                glow: {
                    '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)' },
                    '50%': { opacity: 0.8, boxShadow: '0 0 40px rgba(251, 191, 36, 0.8)' },
                }
            }
        },
    },
    plugins: [],
}
