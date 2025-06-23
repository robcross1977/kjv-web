# KJV Web - End-to-End Testing with Playwright

This directory contains comprehensive Playwright tests for the KJV Web application, specifically focusing on the last reference tracking system.

## 🚀 Quick Start

### Prerequisites

- Development server running on `localhost:3000`
- Playwright installed (already done)

### Running Tests

```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode (recommended for development)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test basic-navigation.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed
```

## 📁 Test Files

### `basic-navigation.spec.ts`

**Purpose**: Verify core app functionality works

- Homepage redirect to John 1:1
- Direct navigation to Bible references
- Basic UI components (Tools, Bookmark buttons)
- Bible verse display

**Run first** to ensure the app is working before testing advanced features.

### `last-reference-tracking.spec.ts`

**Purpose**: Comprehensive testing of the last reference tracking system

- Unauthenticated user flow (no API calls, default navigation)
- Authenticated user flow (auto-save, restore, persistence)
- Authentication state transitions
- Integration with tools and bookmarks
- Error handling and edge cases
- Performance tests

## 🧪 Test Scenarios Covered

### 1. Unauthenticated Users

- ✅ Default navigation to John 1:1
- ✅ No unnecessary API calls
- ✅ Direct URL navigation works
- ✅ No reference saving

### 2. Authenticated Users

- ✅ Auto-save with 1-second debounce
- ✅ Reference restoration after refresh
- ✅ Cross-session persistence
- ✅ URL priority over saved references
- ✅ Rapid navigation handling

### 3. Authentication Flow

- ✅ Login/logout state transitions
- ✅ Tools activation based on auth
- ✅ Graceful fallbacks

### 4. Error Handling

- ✅ Malformed URLs
- ✅ Network failures
- ✅ Rapid refreshes

### 5. Performance

- ✅ Auto-save performance
- ✅ Debounce effectiveness

## 🔧 Test Utilities

### `LastReferenceTestUtils` Class

Provides helper methods for testing:

- `clearBrowserData()` - Reset between tests
- `navigateToReference(book, chapter, verse?)` - Navigate to Bible references
- `waitForAutoSave()` - Wait for debounced save
- `expectCurrentReference(book, chapter, verse?)` - Verify page content
- `simulateLogin()/simulateLogout()` - Mock authentication
- `setupNetworkMonitoring()` - Track API calls

## 🎯 Authentication Testing

**Note**: Current tests use mock authentication since we don't have a test Auth0 environment set up. The tests:

1. **Mock login** by setting localStorage values
2. **Verify behavior** based on authentication state
3. **Test transitions** between authenticated/unauthenticated states

For production testing, you would:

- Set up Auth0 test environment
- Use real authentication flows
- Test with actual user accounts

## 📊 Test Reports

After running tests:

- HTML report: `playwright-report/index.html`
- Screenshots of failures: `test-results/`
- Video recordings (if enabled): `test-results/`

```bash
# View test report
npx playwright show-report
```

## 🛠️ Debugging Tests

### UI Mode (Recommended)

```bash
npm run test:e2e:ui
```

- Visual test runner
- Step through tests
- Inspect page state
- Time travel debugging

### Debug Mode

```bash
npm run test:e2e:debug
```

- Runs in headed mode
- Pauses before each action
- Allows manual inspection

### Browser Developer Tools

```bash
npx playwright test --headed --debug
```

- Opens browser with DevTools
- Set breakpoints in test code
- Inspect network requests

## 🔍 What Tests Verify

### API Call Monitoring

Tests monitor network requests to ensure:

- **No 401 spam** when unauthenticated
- **Proper debouncing** of save requests
- **Correct API endpoints** are called
- **Expected request/response flow**

### State Management

Tests verify:

- **Authentication state** detection
- **Reference persistence** across sessions
- **Optimistic updates** work correctly
- **Error recovery** mechanisms

### User Experience

Tests ensure:

- **Fast navigation** without delays
- **Proper fallbacks** when errors occur
- **Intuitive behavior** matches expectations
- **Performance** meets standards

## 🚨 Common Issues

### Test Failures

1. **Development server not running**

   ```bash
   npm run dev
   ```

2. **Port conflicts** - Check if localhost:3000 is available

3. **Authentication issues** - Tests use mock auth, ensure real Auth0 isn't interfering

4. **Network timeouts** - Increase timeout in playwright.config.ts if needed

### Debugging Tips

1. **Run single test** to isolate issues
2. **Use --headed mode** to see what's happening
3. **Check browser console** for JavaScript errors
4. **Verify database state** if tests modify data

## 📈 Extending Tests

### Adding New Test Cases

1. **Create new test file** or add to existing
2. **Use LastReferenceTestUtils** for common operations
3. **Follow naming convention**: `feature-name.spec.ts`
4. **Include both positive and negative test cases**

### Testing New Features

1. **Authentication tests** - Use mock login/logout
2. **API tests** - Monitor network requests
3. **UI tests** - Check component visibility/interaction
4. **Performance tests** - Measure timing and resource usage

## 🎯 Success Criteria

Tests pass when:

- ✅ **No unnecessary API calls** for unauthenticated users
- ✅ **Proper authentication** detection and handling
- ✅ **Reference tracking** works end-to-end
- ✅ **Error scenarios** are handled gracefully
- ✅ **Performance** meets expectations
- ✅ **User experience** is smooth and intuitive

Run the tests and watch them validate your entire last reference tracking system automatically! 🎉
