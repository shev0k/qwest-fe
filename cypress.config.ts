import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Adjust to your local development server URL
    supportFile: 'cypress/support/e2e.ts', // Path to your support file
  },
});
