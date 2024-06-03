/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [require('autoprefixer'), require('tailwindcss'), require('postcss-import')]
};
module.exports = config;
