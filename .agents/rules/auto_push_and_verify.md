# Continuous Delivery & Production Integrity Rule

Always follow these rules whenever code or configuration files are modified:
1. **Pre-push Verification:** Always run `npm run build` or `npm test` to ensure there are no syntax, import, bundle, or asset errors that could break production.
2. **Auto-Push to Production:** After validating that the build succeeds with zero errors, automatically stage all modified files, commit with a descriptive message, and push directly to `origin main`.
3. **Never push broken code:** If the build or tests fail, fix the issues immediately before pushing.
