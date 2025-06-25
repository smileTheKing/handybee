# Lib Directory

This directory contains utility functions, hooks, and shared code used throughout the application.

## Directory Structure

- `hooks/`: Custom React hooks
  - `use-mobile.ts`: Hook for mobile device detection
- `utils/`: Utility functions and helpers
- `api/`: API-related functions and services

## Usage

Import utilities using the following pattern:
```typescript
import { utilityName } from '@/lib/utils/utilityName'
import { useHookName } from '@/lib/hooks/useHookName'
import { apiFunction } from '@/lib/api/apiFunction'
```

## Best Practices

1. Keep utility functions pure and focused
2. Document complex functions with JSDoc comments
3. Use TypeScript for all utilities
4. Follow the established naming conventions
5. Place shared business logic in appropriate subdirectories 