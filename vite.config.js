


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Set import alias for src directory
    },
  },
  server: {
    port: 5173, // You can change the port if needed
  },
});
