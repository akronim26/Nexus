# Contributing Guidelines

Thank you for your interest in contributing to Nexus! This document provides guidelines and instructions for contributors.



## Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/BlocSoc-iitr/Nexus
   cd Nexus
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```


## Development Workflow

### Branch Naming

- `feat/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation updates
- `refactor/code-improvement` - Code refactoring
- `chore/maintenance-task` - Maintenance tasks



### Pull Request Process

1. **Create a Feature Branch**

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, well-documented code
   - Follow existing code style
   - Add tests for new features
   - Update documentation if needed

3. **Test Your Changes**

   ```bash
   npm run lint          # Check for linting errors
   npm run format:check  # Check code formatting
   npm run type-check    # Check TypeScript types
   npm run build         # Ensure project builds
   ```

4. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feat/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Provide proper type annotations
- Avoid `any` types when possible
- Use meaningful variable and function names

### Code Style

- Use Prettier for formatting (automatic via pre-commit hooks)
- Follow ESLint rules
- Use consistent naming conventions:
  - `camelCase` for variables and functions
  - `PascalCase` for classes and types
  - `UPPER_SNAKE_CASE` for constants



## Testing Guidelines

While we're setting up the testing framework, please:

- Test your changes manually
- Ensure the MCP server starts without errors
- Verify tools work as expected with Claude Desktop

## Documentation

- Update README.md for new features


## Questions?

If you have questions about contributing:

1. Check existing issues and PRs
2. Create a new issue with the "question" label
3. Be specific about what you're trying to achieve

Thank you for contributing!
