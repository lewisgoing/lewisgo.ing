# Code Assistant Guidelines

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier
- `npm run format:check` - Check formatting

## Code Style
- TypeScript with strict null checks enabled
- React functional components with hooks
- Imports: React first, then third-party, then internal (using @ aliases)
- PascalCase for component files, camelCase for utilities
- Prettier config: 2 spaces, single quotes, 100 char line length
- Use absolute imports with path aliases (@/components, @/utils, etc.)
- Error handling: Optional chaining, fallback values, and try/catch
- Components structure: imports → type definitions → logic → JSX return
- Props should be fully typed with TypeScript interfaces

## File Organization
- Component types defined near components or in dedicated type files
- Follow existing folder structure in src/
- Place reusable components in appropriate directories (ui, shared, layout)
- Feature-specific components go in features/ subdirectories

When making changes, match the existing code style and patterns in the file.