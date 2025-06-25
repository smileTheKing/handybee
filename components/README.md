# Components Directory

This directory contains all React components used in the application, organized by feature and functionality.

## Directory Structure

- `auth/`: Authentication-related components (login forms, auth providers, etc.)
- `layout/`: Layout components (headers, sidebars, navigation, etc.)
- `forms/`: Form components for data input and submission
- `dashboard/`: Dashboard-specific components
- `ui/`: Reusable UI components (buttons, inputs, cards, etc.)

## Usage

Import components using the following pattern:
```typescript
import { ComponentName } from '@/components/[category]/ComponentName'
```

## Best Practices

1. Keep components focused and single-responsibility
2. Use TypeScript for all components
3. Include proper prop types and documentation
4. Follow the established naming conventions
5. Place shared components in the `ui` directory 