
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      'f2c0c734-4180-49ac-a788-7e75d2fa94d2.lovableproject.com',
      'f0b0929c-40da-4a6e-8388-27939d670694.lovableproject.com',
      'daf03993-c2aa-4fbe-9e2d-d9e4679623f1.lovableproject.com',
      'aad631cf-53c9-4dae-943e-d3e8d68c6cdd.lovableproject.com',
      'e0449b97-61d7-4159-819f-8ecf3552b370.lovableproject.com',
      'localhost'
    ]
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
