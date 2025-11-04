# Contributing to MediReturn

First off, thank you for considering contributing to MediReturn! It's people like you that make MediReturn such a great tool for the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- ✅ Be respectful and inclusive
- ✅ Welcome newcomers and help them get started
- ✅ Accept constructive criticism gracefully
- ✅ Focus on what is best for the community
- ❌ No harassment or trolling
- ❌ No offensive or inappropriate content

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**How to Submit a Good Bug Report:**

1. **Use a clear and descriptive title**
2. **Describe the exact steps to reproduce the problem**
3. **Provide specific examples**
4. **Describe the behavior you observed and expected**
5. **Include screenshots if possible**
6. **Specify your environment** (OS, Browser, Node version, etc.)

**Bug Report Template:**

```markdown
**Description:**
A clear description of the bug.

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior:**
What you expected to happen.

**Actual Behavior:**
What actually happened.

**Screenshots:**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 10, macOS 12.0]
- Browser: [e.g., Chrome 96, Firefox 94]
- Node Version: [e.g., 18.0.0]
- npm Version: [e.g., 8.0.0]

**Additional Context:**
Any other relevant information.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

**How to Submit a Good Enhancement Suggestion:**

1. **Use a clear and descriptive title**
2. **Provide a step-by-step description** of the suggested enhancement
3. **Explain why this enhancement would be useful**
4. **List any similar features** in other applications

**Feature Request Template:**

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like:**
A clear description of what you want to happen.

**Describe alternatives you've considered:**
Any alternative solutions or features you've considered.

**Additional Context:**
Add any other context or screenshots about the feature request.
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- MongoDB 6+
- Git
- Code Editor (VS Code recommended)

### Setup Instructions

1. **Fork the repository**

Click the "Fork" button at the top right of the repository page.

2. **Clone your fork**

```bash
git clone https://github.com/YOUR_USERNAME/medireturn.git
cd medireturn
```

3. **Add upstream remote**

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/medireturn.git
```

4. **Install dependencies**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

5. **Set up environment variables**

```bash
# Backend .env
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend .env
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your configuration
```

6. **Start development servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🔄 Pull Request Process

### Before Submitting

1. **Create a new branch**

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

2. **Make your changes**

- Write clean, readable code
- Follow the coding standards
- Add comments for complex logic
- Update documentation if needed

3. **Test your changes**

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

4. **Commit your changes**

```bash
git add .
git commit -m "feat: add amazing feature"
```

5. **Keep your branch updated**

```bash
git fetch upstream
git rebase upstream/main
```

6. **Push to your fork**

```bash
git push origin feature/your-feature-name
```

### Submitting Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit the pull request

**PR Template:**

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally

## Screenshots (if applicable)
Add screenshots here.
```

### Review Process

1. At least one maintainer will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge your PR

## 💻 Coding Standards

### JavaScript/React

- Use **ES6+** syntax
- Use **functional components** over class components
- Use **hooks** for state and side effects
- Follow **Airbnb JavaScript Style Guide**

**Examples:**

```javascript
// ✅ Good
const MyComponent = ({ name }) => {
  const [count, setCount] = useState(0);
  
  return <div>Hello {name}</div>;
};

// ❌ Bad
class MyComponent extends Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

### File Naming

- **Components**: PascalCase (`UserProfile.jsx`)
- **Utilities**: camelCase (`formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`)

### Component Structure

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

// 2. Component
const MyComponent = ({ prop1, prop2 }) => {
  // 3. Hooks
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  
  // 4. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 5. Handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 6. Render
  return (
    <div>
      <Button onClick={handleClick}>Click Me</Button>
    </div>
  );
};

// 7. Export
export default MyComponent;
```

### Backend Structure

```javascript
// Controller example
exports.createResource = async (req, res) => {
  try {
    // 1. Validation
    const { field1, field2 } = req.body;
    
    // 2. Business logic
    const resource = await Resource.create({ field1, field2 });
    
    // 3. Response
    res.status(201).json({
      success: true,
      data: resource
    });
  } catch (error) {
    // 4. Error handling
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

## 📝 Commit Messages

Follow the **Conventional Commits** specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(auth): add password reset functionality"

# Bug fix
git commit -m "fix(map): resolve marker positioning issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Multiple changes
git commit -m "feat(dashboard): add statistics cards

- Add total collections card
- Add points earned card
- Add leaderboard widget"
```

## 🧪 Testing

### Backend Tests

```javascript
// Example test
describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const res = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
    
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(userData.email);
  });
});
```

### Frontend Tests

```javascript
// Example test
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click Me</Button>);
  const buttonElement = screen.getByText(/click me/i);
  expect(buttonElement).toBeInTheDocument();
});
```

## 📚 Documentation

When adding features, please update:

- **README.md** - If adding major features
- **API Documentation** - If adding/modifying endpoints
- **Code Comments** - For complex logic
- **Component Props** - Document all props

### JSDoc Comments

```javascript
/**
 * Calculate user points based on collected quantity
 * @param {number} quantity - Quantity in kg
 * @param {boolean} isFirstCollection - Whether this is user's first collection
 * @returns {number} Total points earned
 */
const calculatePoints = (quantity, isFirstCollection) => {
  let points = quantity * 10;
  if (isFirstCollection) points += 50;
  return points;
};
```

## 🎨 UI/UX Guidelines

- Follow **Material Design** principles
- Maintain **consistent spacing** (use Tailwind classes)
- Ensure **accessibility** (ARIA labels, keyboard navigation)
- Test on **multiple devices** and screen sizes
- Use **semantic HTML** elements

## 🔍 Code Review Checklist

Before submitting your PR, review:

- [ ] Code follows project style guidelines
- [ ] No console.logs or debug code
- [ ] All variables have meaningful names
- [ ] Functions are small and focused
- [ ] No hardcoded values (use constants)
- [ ] Error handling is implemented
- [ ] Code is properly commented
- [ ] Tests are added/updated
- [ ] Documentation is updated
- [ ] No merge conflicts
- [ ] Passes all linting checks

## 🆘 Getting Help

If you need help:

1. **Check Documentation** - README, API docs
2. **Search Issues** - Someone may have asked before
3. **Ask in Discussions** - GitHub Discussions
4. **Contact Maintainers** - Via email or GitHub

## 🎉 Recognition

Contributors will be recognized in:

- **README.md** - Contributors section
- **CHANGELOG.md** - Release notes
- **GitHub** - Contributor badge

## 📞 Contact

- **Email**: contribute@medireturn.com
- **GitHub Discussions**: [Link]
- **Discord**: [Link]

---

**Thank you for contributing to MediReturn! Together, we're making India healthier and safer.** 💚