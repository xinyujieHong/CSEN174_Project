# CampusPool Unit Test Documentation

## Overview

This project includes comprehensive unit tests for the CampusPool carpooling application. The test suite covers 5 utility classes with over 25 tests per class, totaling 150+ individual test cases.

## Test Structure

### Utility Classes Tested

1. **UserValidator** (`/utils/UserValidator.ts`)
   - Email validation
   - Password strength validation
   - University email verification
   - Username validation
   - Phone number validation
   - Input sanitization

2. **ProfileValidator** (`/utils/ProfileValidator.ts`)
   - College name validation
   - Major field validation
   - Graduation year validation
   - Car model validation
   - Car capacity validation
   - License plate validation
   - Profile completeness validation

3. **CarpoolRequestValidator** (`/utils/CarpoolRequestValidator.ts`)
   - Destination validation
   - Future date validation
   - Time format validation
   - Passenger count validation
   - Request type validation
   - Request completeness validation
   - Urgency detection

4. **MessageHandler** (`/utils/MessageHandler.ts`)
   - Message content validation
   - Message status validation
   - Message filtering and sorting
   - Conversation grouping
   - Unread message counting
   - Message sanitization

5. **DateTimeUtil** (`/utils/DateTimeUtil.ts`)
   - Date formatting
   - Time formatting (12-hour)
   - Relative time calculation
   - Date comparison utilities
   - Date/time combination
   - Day of week calculation

## Test Coverage

Each class has comprehensive tests covering:

### Normal Cases
- Valid inputs that should pass validation
- Typical use cases
- Expected data ranges

### Edge Cases
- Boundary values (minimum/maximum lengths)
- Empty values
- Single-item arrays
- Exact boundary conditions
- Special characters

### Invalid Cases
- Wrong data types (null, undefined, numbers as strings)
- Exceeding maximum lengths
- Below minimum lengths
- Invalid formats
- Out-of-range values
- Malformed data

## Running the Tests

### Prerequisites
```bash
npm install --save-dev jest ts-jest @types/jest
```

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Specific Test File
```bash
npm test UserValidator.test.ts
```

## Test Statistics

- **Total Classes Tested**: 5
- **Total Test Suites**: 5
- **Total Tests**: 150+
- **Tests per Class**: 25-30

### Breakdown by Class

1. **UserValidator**: 30 tests
   - isValidEmail: 5 tests
   - isValidPassword: 5 tests
   - isUniversityEmail: 5 tests
   - isValidUsername: 5 tests
   - isValidPhoneNumber: 5 tests
   - sanitizeInput: 5 tests

2. **ProfileValidator**: 30 tests
   - isValidCollegeName: 5 tests
   - isValidMajor: 5 tests
   - isValidGraduationYear: 5 tests
   - isValidCarModel: 5 tests
   - isValidCarCapacity: 5 tests
   - isValidLicensePlate: 5 tests
   - isValidBio: 5 tests
   - isCompleteProfileWithoutCar: 5 tests
   - isCompleteProfileWithCar: 5 tests

3. **CarpoolRequestValidator**: 30 tests
   - isValidDestination: 5 tests
   - isValidFutureDate: 5 tests
   - isValidTimeFormat: 5 tests
   - isValidPassengerCount: 5 tests
   - isValidRequestType: 5 tests
   - isValidNotes: 5 tests
   - isValidCarpoolRequest: 5 tests
   - getDaysUntilCarpool: 5 tests
   - isUrgentRequest: 5 tests

4. **MessageHandler**: 30 tests
   - isValidMessageContent: 5 tests
   - isValidMessageStatus: 5 tests
   - filterMessagesByStatus: 5 tests
   - getPendingRequests: 5 tests
   - sortMessagesByTimestamp: 5 tests
   - groupMessagesByConversation: 5 tests
   - countUnreadMessages: 5 tests
   - sanitizeMessageContent: 5 tests
   - canSendMessage: 5 tests

5. **DateTimeUtil**: 30 tests
   - formatDate: 5 tests
   - formatTime: 5 tests
   - getRelativeTime: 5 tests
   - isToday: 5 tests
   - isWithinDays: 5 tests
   - combineDateAndTime: 5 tests
   - getDayOfWeek: 5 tests
   - isAtLeastHoursAhead: 5 tests

## Test Framework

The tests use **Jest** with **ts-jest** for TypeScript support. Jest is the industry-standard testing framework for React/TypeScript applications.

### Key Features Used
- `describe()` blocks for grouping related tests
- `test()` or `it()` for individual test cases
- `expect()` assertions with matchers like:
  - `toBe()` - strict equality
  - `toEqual()` - deep equality
  - `toHaveLength()` - array/string length
  - `toContain()` - array/string contains
  - `toBeGreaterThan()` / `toBeLessThan()` - numeric comparisons
  - `toBeNull()` - null checks

## Integration with CI/CD

These tests can be integrated into continuous integration pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm test -- --coverage --ci
```

## Future Enhancements

Potential additions to the test suite:
- Component tests using React Testing Library
- Integration tests for full user flows
- E2E tests using Playwright or Cypress
- Performance tests for large datasets
- Snapshot tests for UI components

## Contributing

When adding new utility functions:
1. Create the utility function/class
2. Add corresponding test file in `__tests__` directory
3. Ensure at least 5 tests per function
4. Cover normal, edge, and invalid cases
5. Run tests to ensure they pass
6. Update this documentation

## Notes

- All validation functions handle null/undefined inputs gracefully
- String inputs are typically trimmed before validation
- Edge cases focus on boundary conditions (min/max lengths)
- Invalid cases test type safety and error handling
- Tests are deterministic and can run in any order
