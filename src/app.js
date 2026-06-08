// src/app.js
const env = process.env.ENVIRONMENT || 'development';

console.log("=================================");
console.log("🚀 Uruchamianie aplikacji w trybie: " + env.toUpperCase());
console.log("📅 Data: " + new Date().toISOString()); // Bezpieczny format ISO, nie wymaga locales
console.log("✅ Aplikacja działa poprawnie!");
console.log("=================================");
