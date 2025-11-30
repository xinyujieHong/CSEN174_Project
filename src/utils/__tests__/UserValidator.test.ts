import { UserValidator } from '../UserValidator';

describe('UserValidator', () => {
  describe('isValidEmail', () => {
    test('should validate correct email format', () => {
      expect(UserValidator.isValidEmail('test@example.com')).toBe(true);
      expect(UserValidator.isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(UserValidator.isValidEmail('student@university.edu')).toBe(true);
    });

    test('should reject invalid email formats', () => {
      expect(UserValidator.isValidEmail('invalid.email')).toBe(false);
      expect(UserValidator.isValidEmail('@example.com')).toBe(false);
      expect(UserValidator.isValidEmail('test@')).toBe(false);
      expect(UserValidator.isValidEmail('test @example.com')).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(UserValidator.isValidEmail('')).toBe(false);
      expect(UserValidator.isValidEmail('a@b.c')).toBe(true); // Minimum valid
    });

    test('should handle invalid input types', () => {
      expect(UserValidator.isValidEmail(null as any)).toBe(false);
      expect(UserValidator.isValidEmail(undefined as any)).toBe(false);
      expect(UserValidator.isValidEmail(123 as any)).toBe(false);
    });

    test('should trim whitespace before validation', () => {
      expect(UserValidator.isValidEmail('  test@example.com  ')).toBe(true);
    });
  });

  describe('isValidPassword', () => {
    test('should validate strong passwords', () => {
      expect(UserValidator.isValidPassword('Password123')).toBe(true);
      expect(UserValidator.isValidPassword('MyP@ssw0rd')).toBe(true);
      expect(UserValidator.isValidPassword('Abc12345')).toBe(true);
    });

    test('should reject weak passwords', () => {
      expect(UserValidator.isValidPassword('short1A')).toBe(false); // Too short
      expect(UserValidator.isValidPassword('alllowercase123')).toBe(false); // No uppercase
      expect(UserValidator.isValidPassword('ALLUPPERCASE123')).toBe(false); // No lowercase
      expect(UserValidator.isValidPassword('NoNumbers')).toBe(false); // No numbers
    });

    test('should handle edge cases', () => {
      expect(UserValidator.isValidPassword('Abcdefg1')).toBe(true); // Exactly 8 chars
      expect(UserValidator.isValidPassword('')).toBe(false);
    });

    test('should handle invalid input types', () => {
      expect(UserValidator.isValidPassword(null as any)).toBe(false);
      expect(UserValidator.isValidPassword(undefined as any)).toBe(false);
      expect(UserValidator.isValidPassword(12345678 as any)).toBe(false);
    });

    test('should handle very long passwords', () => {
      const longPassword = 'A1' + 'a'.repeat(1000);
      expect(UserValidator.isValidPassword(longPassword)).toBe(true);
    });
  });

  describe('isUniversityEmail', () => {
    test('should validate university emails', () => {
      expect(UserValidator.isUniversityEmail('student@university.edu')).toBe(true);
      expect(UserValidator.isUniversityEmail('john.doe@college.edu')).toBe(true);
    });

    test('should reject non-university emails', () => {
      expect(UserValidator.isUniversityEmail('test@gmail.com')).toBe(false);
      expect(UserValidator.isUniversityEmail('user@company.org')).toBe(false);
    });

    test('should handle case insensitivity', () => {
      expect(UserValidator.isUniversityEmail('STUDENT@UNIVERSITY.EDU')).toBe(true);
      expect(UserValidator.isUniversityEmail('student@university.EDU')).toBe(true);
    });

    test('should reject invalid email formats', () => {
      expect(UserValidator.isUniversityEmail('notanemail.edu')).toBe(false);
      expect(UserValidator.isUniversityEmail('@university.edu')).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(UserValidator.isUniversityEmail('')).toBe(false);
      expect(UserValidator.isUniversityEmail('  student@uni.edu  ')).toBe(true);
    });
  });

  describe('isValidUsername', () => {
    test('should validate correct usernames', () => {
      expect(UserValidator.isValidUsername('john_doe')).toBe(true);
      expect(UserValidator.isValidUsername('user123')).toBe(true);
      expect(UserValidator.isValidUsername('Student_2024')).toBe(true);
    });

    test('should reject invalid usernames', () => {
      expect(UserValidator.isValidUsername('ab')).toBe(false); // Too short
      expect(UserValidator.isValidUsername('a'.repeat(21))).toBe(false); // Too long
      expect(UserValidator.isValidUsername('user-name')).toBe(false); // Invalid character
      expect(UserValidator.isValidUsername('user name')).toBe(false); // Space
    });

    test('should handle edge cases', () => {
      expect(UserValidator.isValidUsername('abc')).toBe(true); // Minimum length
      expect(UserValidator.isValidUsername('a'.repeat(20))).toBe(true); // Maximum length
      expect(UserValidator.isValidUsername('')).toBe(false);
    });

    test('should handle invalid input types', () => {
      expect(UserValidator.isValidUsername(null as any)).toBe(false);
      expect(UserValidator.isValidUsername(undefined as any)).toBe(false);
      expect(UserValidator.isValidUsername(123 as any)).toBe(false);
    });

    test('should trim whitespace', () => {
      expect(UserValidator.isValidUsername('  username  ')).toBe(true);
    });
  });

  describe('isValidPhoneNumber', () => {
    test('should validate phone numbers with various formats', () => {
      expect(UserValidator.isValidPhoneNumber('1234567890')).toBe(true);
      expect(UserValidator.isValidPhoneNumber('(123) 456-7890')).toBe(true);
      expect(UserValidator.isValidPhoneNumber('123-456-7890')).toBe(true);
    });

    test('should reject invalid phone numbers', () => {
      expect(UserValidator.isValidPhoneNumber('123456789')).toBe(false); // Too short
      expect(UserValidator.isValidPhoneNumber('12345678901')).toBe(false); // Too long
      expect(UserValidator.isValidPhoneNumber('abcdefghij')).toBe(false); // Not numbers
    });

    test('should handle edge cases', () => {
      expect(UserValidator.isValidPhoneNumber('')).toBe(false);
      expect(UserValidator.isValidPhoneNumber('0000000000')).toBe(true);
    });

    test('should handle invalid input types', () => {
      expect(UserValidator.isValidPhoneNumber(null as any)).toBe(false);
      expect(UserValidator.isValidPhoneNumber(undefined as any)).toBe(false);
      expect(UserValidator.isValidPhoneNumber(1234567890 as any)).toBe(false);
    });

    test('should handle phone numbers with country code', () => {
      expect(UserValidator.isValidPhoneNumber('+1 (123) 456-7890')).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    test('should trim whitespace', () => {
      expect(UserValidator.sanitizeInput('  hello  ')).toBe('hello');
      expect(UserValidator.sanitizeInput('test\n')).toBe('test');
    });

    test('should limit length to maxLength', () => {
      const longString = 'a'.repeat(300);
      expect(UserValidator.sanitizeInput(longString, 100)).toBe('a'.repeat(100));
    });

    test('should handle edge cases', () => {
      expect(UserValidator.sanitizeInput('')).toBe('');
      expect(UserValidator.sanitizeInput('a', 1)).toBe('a');
      expect(UserValidator.sanitizeInput('ab', 1)).toBe('a');
    });

    test('should handle invalid input types', () => {
      expect(UserValidator.sanitizeInput(null as any)).toBe('');
      expect(UserValidator.sanitizeInput(undefined as any)).toBe('');
      expect(UserValidator.sanitizeInput(123 as any)).toBe('');
    });

    test('should use default maxLength of 255', () => {
      const input = 'a'.repeat(300);
      expect(UserValidator.sanitizeInput(input).length).toBe(255);
    });
  });
});
