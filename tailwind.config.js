import flowbitePlugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem'
			// screens: {
			// 	'2xl': '1400px'
			// }
		},
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: '#64748B',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: '#0074CD',
					hover: '#2996E9'
				},
				secondary: {
					DEFAULT: '#FFD93E',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: '#FF473D',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				},
				bluejum: { DEFAULT: '#002153', light: '#37467e', lighter: '#646fab' },
				yellowjum: { DEFAULT: '#FFCF00', light: '#caa100', lighter: '#977600' },
				redjum: { DEFAULT: '#CF0821', light: '#f43d3a', lighter: '#ff6055' },
				blackjum: { DEFAULT: '#000000', light: '#303030', lighter: '#5e5e5e' }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				firava: ['Firava']
			},
			keyframes: {
				'marquee-left': {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(calc(-100% - var(--gap)))' }
				},
				'marquee-up': {
					from: { transform: 'translateY(0)' },
					to: { transform: 'translateY(calc(-100% - var(--gap)))' }
				}
			},
			animation: {
				'marquee-left': 'marquee-left var(--duration, 40s) linear infinite',
				'marquee-up': 'marquee-up var(--duration, 40s) linear infinite'
			}
		}
	},
	plugins: [flowbitePlugin, require('tailwindcss-animate')]
};

export default config;
