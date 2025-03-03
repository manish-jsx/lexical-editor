# Security Updates

## Latest Security Fixes

This document outlines the security vulnerabilities that were addressed in the latest update.

### Fixed Vulnerabilities

1. **bl** (≤1.2.2) - Moderate severity
   - Memory Exposure in bl
   - Remote Memory Exposure in bl
   - Fixed by upgrading to version 6.0.0

2. **esbuild** (≤0.24.2) - Moderate severity
   - Development server vulnerability allowing any website to send requests and read responses
   - Fixed by upgrading to version 0.24.5

3. **semver** (≤5.7.1) - High severity
   - Regular Expression Denial of Service vulnerabilities
   - Fixed by upgrading to version 7.6.0

### How to Apply These Updates

If you're using this package as a dependency in your project, you can ensure these fixes are applied by:

1. Adding resolutions to your project's package.json:
```json
"resolutions": {
  "semver": "^7.6.0",
  "bl": "^6.0.0",
  "esbuild": "^0.24.5"
}
```

2. Running dependency resolution:
```bash
npm install
# or if using yarn
yarn install
```

## Reporting Security Issues

If you discover a security vulnerability within this package, please send an email to [your-email@example.com](mailto:your-email@example.com). All security vulnerabilities will be promptly addressed.

## Security Best Practices When Using This Package

1. Always keep your dependencies updated.
2. Use environment variables for sensitive information as outlined in the .env.example file.
3. Never expose your Neon database connection string or Vercel Blob tokens on the client-side.
4. Implement proper authentication and authorization when integrating this editor into your application.
