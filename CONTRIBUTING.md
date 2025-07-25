# Contributing to FPL Fixture Difficulty Table

🎉 **Thank you for your interest in contributing to the FPL Fixture Difficulty Table!** 🎉

We welcome contributions from the Fantasy Premier League community and appreciate your help in making this tool better for everyone. This guide will help you get started with contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:
- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, nationality, personal appearance, race, religion
- Sexual identity and orientation

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.0 or higher
- **npm**, **yarn**, or **pnpm** package manager
- **Git** for version control
- A **GitHub account**
- Basic knowledge of **React**, **TypeScript**, and **CSS**

### First-Time Contributors

New to open source? Here are some great first contribution ideas:
- 🐛 Fix typos in documentation
- 📝 Improve code comments
- 🎨 Enhance CSS styling
- 🧪 Add test cases
- 🌐 Improve accessibility
- 📱 Enhance mobile responsiveness

Look for issues labeled `good first issue` or `help wanted`!

## 💻 Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/fpl-fixture-difficulty-table.git
cd fpl-fixture-difficulty-table

# Add the original repository as upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/fpl-fixture-difficulty-table.git
```

### 2. Install Dependencies

```bash
# Install project dependencies
npm install
# or
yarn install
# or
pnpm install
```

### 3. Start Development Server

```bash
# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

### 4. Verify Setup

```bash
# Run tests to ensure everything is working
npm test

# Run linting
npm run lint

# Build the project
npm run build
```

## 🛠️ How to Contribute

### Types of Contributions

We welcome various types of contributions:

#### 🐛 **Bug Reports**
- Found a bug? Please report it!
- Use the bug report template
- Include steps to reproduce
- Provide browser/device information

#### ✨ **Feature Requests**
- Have an idea for improvement?
- Use the feature request template
- Explain the use case and benefits
- Consider implementation complexity

#### 🔧 **Code Contributions**
- Bug fixes
- New features
- Performance improvements
- Refactoring
- Test coverage improvements

#### 📝 **Documentation**
- README improvements
- Code comments
- API documentation
- Tutorial content
- Translation (future)

#### 🎨 **Design & UX**
- UI improvements
- Accessibility enhancements
- Mobile responsiveness
- Dark mode refinements

### Contribution Workflow

1. **Check existing issues** - Avoid duplicate work
2. **Create/comment on issue** - Discuss your approach
3. **Fork and create branch** - Use descriptive branch names
4. **Make changes** - Follow coding standards
5. **Test thoroughly** - Ensure all tests pass
6. **Submit pull request** - Use the PR template
7. **Address feedback** - Collaborate on improvements
8. **Celebrate** - Your contribution is merged! 🎉

## 🔄 Pull Request Process

### Before Submitting

- [ ] **Sync with upstream**: `git pull upstream main`
- [ ] **Create feature branch**: `git checkout -b feature/your-feature-name`
- [ ] **Follow coding standards** (see below)
- [ ] **Add/update tests** for your changes
- [ ] **Update documentation** if needed
- [ ] **Run all tests**: `npm test`
- [ ] **Run linting**: `npm run lint`
- [ ] **Build successfully**: `npm run build`

### Branch Naming Convention

Use descriptive branch names:
```
feature/team-comparison-mode
bugfix/search-filter-debounce
enhancement/dark-mode-colors
docs/api-documentation
test/fixture-table-coverage
```

### Commit Message Format

Use conventional commits:
```
feat: add team comparison functionality
fix: resolve search filter debounce issue
docs: update API documentation
test: add fixture table test coverage
style: improve dark mode color contrast
refactor: optimize data processing utils
```

### Pull Request Template

When creating a PR, please include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 📏 Coding Standards

### TypeScript

```typescript
// ✅ Good: Use proper typing
interface TeamFixture {
  team: Team;
  fixtures: ProcessedFixture[];
  averageDifficulty: number;
}

// ❌ Avoid: Using 'any' type
const data: any = fetchData();

// ✅ Good: Proper error handling
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('API call failed:', error);
  throw new Error('Failed to fetch data');
}
```

### React Components

```tsx
// ✅ Good: Functional component with proper typing
interface Props {
  teams: Team[];
  onTeamSelect: (teamId: number) => void;
}

const TeamSelector: React.FC<Props> = ({ teams, onTeamSelect }) => {
  // Component implementation
};

// ✅ Good: Use React.memo for performance
export default React.memo(TeamSelector);
```

### CSS/Styling

```css
/* ✅ Good: Use CSS custom properties */
.component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

/* ✅ Good: Mobile-first responsive design */
.component {
  padding: 1rem;
}

@media (min-width: 768px) {
  .component {
    padding: 2rem;
  }
}
```

### Code Organization

```
src/
├── components/
│   ├── ComponentName/
│   │   ├── ComponentName.tsx
│   │   ├── ComponentName.css
│   │   ├── ComponentName.test.tsx
│   │   └── index.ts
│   └── index.ts
├── hooks/
├── services/
├── utils/
└── types/
```

## 🧪 Testing Guidelines

### Test Types

1. **Unit Tests**: Test individual components/functions
2. **Integration Tests**: Test component interactions
3. **Accessibility Tests**: Ensure WCAG compliance
4. **Performance Tests**: Monitor performance regressions

### Writing Tests

```typescript
// ✅ Good: Descriptive test names
describe('TeamSelector', () => {
  it('should filter teams based on search input', () => {
    // Test implementation
  });

  it('should call onTeamSelect when team is clicked', () => {
    // Test implementation
  });
});

// ✅ Good: Test accessibility
it('should be accessible to screen readers', () => {
  render(<TeamSelector teams={mockTeams} onTeamSelect={mockFn} />);
  expect(screen.getByRole('combobox')).toBeInTheDocument();
  expect(screen.getByLabelText('Select teams')).toBeInTheDocument();
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- TeamSelector.test.tsx
```

## 📚 Documentation

### Code Documentation

```typescript
/**
 * Calculates the average difficulty for a team's fixtures
 * @param fixtures - Array of processed fixtures
 * @param gameweekRange - Number of gameweeks to consider
 * @returns Average difficulty rating (1-5)
 */
export function calculateAverageDifficulty(
  fixtures: ProcessedFixture[],
  gameweekRange: number
): number {
  // Implementation
}
```

### Component Documentation

```tsx
/**
 * TeamSelector component for filtering teams in the fixture table
 * 
 * @example
 * ```tsx
 * <TeamSelector
 *   teams={teams}
 *   selectedTeams={[1, 2, 3]}
 *   onSelectionChange={handleTeamSelection}
 * />
 * ```
 */
interface TeamSelectorProps {
  /** Array of available teams */
  teams: Team[];
  /** Currently selected team IDs */
  selectedTeams: number[];
  /** Callback when selection changes */
  onSelectionChange: (teamIds: number[]) => void;
}
```

## 🐛 Issue Guidelines

### Bug Reports

When reporting bugs, please include:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
- Device: [e.g. iPhone6]

**Additional context**
Add any other context about the problem here.
```

### Feature Requests

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request.
```

### Issue Labels

We use these labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `documentation` - Improvements or additions to documentation
- `question` - Further information is requested
- `wontfix` - This will not be worked on

## 🎨 Design Guidelines

### UI/UX Principles

1. **Accessibility First**: WCAG AA compliance
2. **Mobile Responsive**: Mobile-first design approach
3. **Performance**: Fast loading and smooth interactions
4. **Consistency**: Follow established design patterns
5. **User-Centered**: Focus on FPL manager needs

### Color Scheme

```css
/* Light Theme */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #111827;
  --text-secondary: #6b7280;
}

/* Dark Theme */
[data-theme="dark"] {
  --primary-color: #60a5fa;
  --secondary-color: #94a3b8;
  --success-color: #34d399;
  --warning-color: #fbbf24;
  --error-color: #f87171;
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
}
```

### Typography

```css
/* Font Stack */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
               'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}

/* Typography Scale */
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
```

## 🚀 Performance Guidelines

### Code Splitting

```typescript
// ✅ Good: Lazy load components
const TeamSelector = React.lazy(() => import('./TeamSelector'));

// ✅ Good: Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <TeamSelector />
</Suspense>
```

### Memoization

```typescript
// ✅ Good: Memoize expensive calculations
const processedFixtures = useMemo(() => {
  return processFixtureData(fixtures, gameweekRange);
}, [fixtures, gameweekRange]);

// ✅ Good: Memoize callback functions
const handleTeamSelect = useCallback((teamId: number) => {
  setSelectedTeams(prev => [...prev, teamId]);
}, []);
```

### Bundle Optimization

- Keep bundle size under 500KB (gzipped)
- Use tree shaking for unused code
- Optimize images and assets
- Implement code splitting for routes

## 🌐 Internationalization (Future)

While not currently implemented, we plan to support multiple languages:

```typescript
// Future i18n structure
interface Translations {
  common: {
    loading: string;
    error: string;
    retry: string;
  };
  table: {
    team: string;
    fixtures: string;
    difficulty: string;
  };
}
```

## 🔒 Security Guidelines

### Input Validation

```typescript
// ✅ Good: Validate user inputs
function validateGameweekRange(start: number, end: number): boolean {
  return start >= 1 && end <= 38 && start <= end;
}

// ✅ Good: Sanitize data from API
function sanitizeTeamName(name: string): string {
  return name.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}
```

### API Security

- Never expose API keys in client code
- Use HTTPS for all API calls
- Implement rate limiting
- Validate all API responses

## 📱 Mobile Guidelines

### Touch Targets

- Minimum 44px touch target size
- Adequate spacing between interactive elements
- Consider thumb-friendly navigation

### Performance

- Optimize for slower mobile connections
- Minimize JavaScript bundle size
- Use efficient CSS animations
- Implement proper loading states

## 🤖 Automation

### GitHub Actions

We use GitHub Actions for:
- Continuous Integration (CI)
- Automated testing
- Code quality checks
- Deployment

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["stylelint --fix", "prettier --write"]
  }
}
```

## 📊 Analytics & Monitoring

### Performance Monitoring

- Bundle size tracking
- Core Web Vitals monitoring
- Error tracking and reporting
- User experience metrics

### Code Quality

- Test coverage reporting
- Code complexity analysis
- Dependency vulnerability scanning
- Performance regression detection

## 🎓 Learning Resources

### React & TypeScript
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

### Accessibility
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref)
- [A11y Project](https://www.a11yproject.com)
- [WebAIM](https://webaim.org)

### Performance
- [Web.dev Performance](https://web.dev/performance)
- [React Performance](https://reactjs.org/docs/optimizing-performance.html)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- CHANGELOG.md for significant contributions
- GitHub releases for major features
- Social media shoutouts (with permission)

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: maintainers@fpl-fixture-table.com
- **Discord**: [Community Server](https://discord.gg/fpl-fixture-table) (future)

### Response Times

We aim to respond to:
- Security issues: Within 24 hours
- Bug reports: Within 48 hours
- Feature requests: Within 1 week
- Pull requests: Within 3-5 days

## 🙏 Thank You

Thank you for taking the time to contribute to the FPL Fixture Difficulty Table! Your contributions help make this tool better for the entire Fantasy Premier League community.

Every contribution, no matter how small, is valued and appreciated. Whether you're fixing a typo, adding a feature, or helping with documentation, you're making a difference.

**Happy coding, and may your FPL team bring you many green arrows! 📈⚽**

---

*This contributing guide is a living document and will be updated as the project evolves. If you have suggestions for improvements, please open an issue or submit a pull request.*