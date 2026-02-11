# Testing Guide

This directory contains unit tests for the Todo application using Jest and Supertest.

## Test Structure

```
tests/
├── setup.js       # Database setup and teardown
├── api.test.js    # API endpoint tests
└── README.md      # This file
```

## Running Tests Locally

### Prerequisites

1. Ensure PostgreSQL is running
2. Test database exists or DATABASE_URL is configured in `.env`

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage report

```bash
npm run test:coverage
```

## Running Tests in CI/CD

For CI/CD pipelines, use:

```bash
npm run test:ci
```

This will run tests with:
- CI mode (optimized for CI environments)
- Coverage reporting
- Automatic exit after completion

## Test Coverage

The test suite covers:

### API Endpoint Tests
- ✅ GET /health - Health check endpoint
- ✅ GET / - Main page rendering
- ✅ POST /todos - Create new todo
- ✅ POST /todos/:id/complete - Toggle completion status
- ✅ POST /todos/:id/delete - Delete todo
- ✅ GET /api/todos - JSON API for todos

### Model Tests
- ✅ Create todo with all fields
- ✅ Read todo by ID
- ✅ Update todo
- ✅ Delete todo
- ✅ Find many with ordering
- ✅ Default values validation
- ✅ Auto-increment ID validation

### Edge Cases
- ✅ Empty task handling
- ✅ Whitespace-only tasks
- ✅ Task trimming
- ✅ Non-existent todo handling
- ✅ Multiple todos ordering

## Coverage Thresholds

The test suite enforces minimum coverage:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## CI/CD Integration Example

### GitHub Actions

```yaml
- name: Install dependencies
  run: npm ci

- name: Setup test database
  run: |
    psql -c 'CREATE DATABASE tododb_test;' -U postgres

- name: Run database migrations
  run: npx prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL_TEST }}

- name: Run tests
  run: npm run test:ci
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL_TEST }}
```

### Jenkins Pipeline

```groovy
stage('Test') {
    steps {
        sh 'npm ci'
        sh 'npm run test:ci'
    }
    post {
        always {
            publishHTML(target: [
                reportDir: 'coverage',
                reportFiles: 'index.html',
                reportName: 'Coverage Report'
            ])
        }
    }
}
```

### GitLab CI

```yaml
test:
  stage: test
  script:
    - npm ci
    - npm run test:ci
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

## Adding New Tests

To add new tests:

1. Create a new test file in `tests/` directory ending with `.test.js`
2. Import required dependencies:

```javascript
const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
```

3. Write test suites using Jest syntax:

```javascript
describe('Feature name', () => {
  it('should do something', async () => {
    // Arrange
    const input = 'test';

    // Act
    const result = await someFunction(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

## Database Setup in Tests

Tests automatically clean up the database:
- `beforeAll`: Cleans database before all tests
- `afterEach`: Cleans database after each test
- `afterAll`: Disconnects Prisma client

This ensures tests run in isolation and don't affect each other.

## Troubleshooting

### Tests fail with database connection error

Ensure PostgreSQL is running and DATABASE_URL is correctly set in `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/tododb"
```

### Coverage report not generating

Install dependencies first:

```bash
npm install
```

### Tests timing out

Increase Jest timeout in `jest.config.js`:

```javascript
module.exports = {
  testTimeout: 10000,
};
```
