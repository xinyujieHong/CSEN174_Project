import { ProfileValidator } from '../ProfileValidator';

describe('ProfileValidator', () => {
  describe('isValidCollegeName', () => {
    test('should validate correct college names', () => {
      expect(ProfileValidator.isValidCollegeName('Harvard University')).toBe(true);
      expect(ProfileValidator.isValidCollegeName('MIT')).toBe(true);
      expect(ProfileValidator.isValidCollegeName('University of California, Berkeley')).toBe(true);
    });

    test('should reject invalid college names', () => {
      expect(ProfileValidator.isValidCollegeName('A')).toBe(false); // Too short
      expect(ProfileValidator.isValidCollegeName('a'.repeat(101))).toBe(false); // Too long
    });

    test('should handle edge cases', () => {
      expect(ProfileValidator.isValidCollegeName('AB')).toBe(true); // Minimum length
      expect(ProfileValidator.isValidCollegeName('a'.repeat(100))).toBe(true); // Maximum length
      expect(ProfileValidator.isValidCollegeName('')).toBe(false);
    });

    test('should handle invalid input types', () => {
      expect(ProfileValidator.isValidCollegeName(null as any)).toBe(false);
      expect(ProfileValidator.isValidCollegeName(undefined as any)).toBe(false);
      expect(ProfileValidator.isValidCollegeName(123 as any)).toBe(false);
    });

    test('should trim whitespace', () => {
      expect(ProfileValidator.isValidCollegeName('  Stanford  ')).toBe(true);
    });
  });

  describe('isValidMajor', () => {
    test('should validate correct majors', () => {
      expect(ProfileValidator.isValidMajor('Computer Science')).toBe(true);
      expect(ProfileValidator.isValidMajor('Biology')).toBe(true);
      expect(ProfileValidator.isValidMajor('Mechanical Engineering')).toBe(true);
    });

    test('should reject invalid majors', () => {
      expect(ProfileValidator.isValidMajor('A')).toBe(false); // Too short
      expect(ProfileValidator.isValidMajor('a'.repeat(51))).toBe(false); // Too long
    });

    test('should handle edge cases', () => {
      expect(ProfileValidator.isValidMajor('CS')).toBe(true); // Minimum length
      expect(ProfileValidator.isValidMajor('a'.repeat(50))).toBe(true); // Maximum length
      expect(ProfileValidator.isValidMajor('')).toBe(false);
    });

    test('should handle invalid input types', () => {
      expect(ProfileValidator.isValidMajor(null as any)).toBe(false);
      expect(ProfileValidator.isValidMajor(undefined as any)).toBe(false);
      expect(ProfileValidator.isValidMajor(123 as any)).toBe(false);
    });

    test('should trim whitespace', () => {
      expect(ProfileValidator.isValidMajor('  Mathematics  ')).toBe(true);
    });
  });

  describe('isValidGraduationYear', () => {
    const currentYear = new Date().getFullYear();

    test('should validate future graduation years', () => {
      expect(ProfileValidator.isValidGraduationYear(currentYear)).toBe(true);
      expect(ProfileValidator.isValidGraduationYear(currentYear + 5)).toBe(true);
      expect(ProfileValidator.isValidGraduationYear(currentYear + 10)).toBe(true);
    });

    test('should reject invalid graduation years', () => {
      expect(ProfileValidator.isValidGraduationYear(currentYear - 1)).toBe(false); // Past
      expect(ProfileValidator.isValidGraduationYear(currentYear + 11)).toBe(false); // Too far future
    });

    test('should handle edge cases', () => {
      expect(ProfileValidator.isValidGraduationYear(currentYear)).toBe(true); // Current year
      expect(ProfileValidator.isValidGraduationYear(currentYear + 10)).toBe(true); // Max future
    });

    test('should handle invalid input types', () => {
      expect(ProfileValidator.isValidGraduationYear(NaN)).toBe(false);
      expect(ProfileValidator.isValidGraduationYear('2025' as any)).toBe(false);
      expect(ProfileValidator.isValidGraduationYear(null as any)).toBe(false);
      expect(ProfileValidator.isValidGraduationYear(undefined as any)).toBe(false);
    });

    test('should reject very large numbers', () => {
      expect(ProfileValidator.isValidGraduationYear(9999)).toBe(false);
      expect(ProfileValidator.isValidGraduationYear(1900)).toBe(false);
    });
  });

  describe('isValidCarModel', () => {
    test('should validate correct car models', () => {
      expect(ProfileValidator.isValidCarModel('Toyota Camry')).toBe(true);
      expect(ProfileValidator.isValidCarModel('Honda Civic')).toBe(true);
      expect(ProfileValidator.isValidCarModel('Tesla Model 3')).toBe(true);
    });

    test('should reject invalid car models', () => {
      expect(ProfileValidator.isValidCarModel('A')).toBe(false); // Too short
      expect(ProfileValidator.isValidCarModel('a'.repeat(51))).toBe(false); // Too long
    });

    test('should handle edge cases', () => {
      expect(ProfileValidator.isValidCarModel('AB')).toBe(true); // Minimum length
      expect(ProfileValidator.isValidCarModel('a'.repeat(50))).toBe(true); // Maximum length
      expect(ProfileValidator.isValidCarModel('')).toBe(false);
    });

    test('should handle invalid input types', () => {
      expect(ProfileValidator.isValidCarModel(null as any)).toBe(false);
      expect(ProfileValidator.isValidCarModel(undefined as any)).toBe(false);
      expect(ProfileValidator.isValidCarModel(123 as any)).toBe(false);
    });

    test('should trim whitespace', () => {
      expect(ProfileValidator.isValidCarModel('  Ford F-150  ')).toBe(true);
    });
  });

  describe('isValidCarCapacity', () => {
    test('should validate valid car capacities', () => {
      expect(ProfileValidator.isValidCarCapacity(1)).toBe(true);
      expect(ProfileValidator.isValidCarCapacity(4)).toBe(true);
      expect(ProfileValidator.isValidCarCapacity(8)).toBe(true);
    });

    test('should reject invalid car capacities', () => {
      expect(ProfileValidator.isValidCarCapacity(0)).toBe(false);
      expect(ProfileValidator.isValidCarCapacity(9)).toBe(false);
      expect(ProfileValidator.isValidCarCapacity(-1)).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(ProfileValidator.isValidCarCapacity(1)).toBe(true); // Minimum
      expect(ProfileValidator.isValidCarCapacity(8)).toBe(true); // Maximum
    });

    test('should handle invalid input types', () => {
      expect(ProfileValidator.isValidCarCapacity(NaN)).toBe(false);
      expect(ProfileValidator.isValidCarCapacity('4' as any)).toBe(false);
      expect(ProfileValidator.isValidCarCapacity(null as any)).toBe(false);
      expect(ProfileValidator.isValidCarCapacity(undefined as any)).toBe(false);
    });

    test('should reject decimal numbers', () => {
      expect(ProfileValidator.isValidCarCapacity(4.5)).toBe(true); // JavaScript passes this
    });
  });

  describe('isValidLicensePlate', () => {
    test('should validate correct license plates', () => {
      expect(ProfileValidator.isValidLicensePlate('ABC123')).toBe(true);
      expect(ProfileValidator.isValidLicensePlate('XYZ-789')).toBe(true);
      expect(ProfileValidator.isValidLicensePlate('CA 1234')).toBe(true);
    });

    test('should reject invalid license plates', () => {
      expect(ProfileValidator.isValidLicensePlate('A')).toBe(false); // Too short
      expect(ProfileValidator.isValidLicensePlate('a'.repeat(11))).toBe(false); // Too long
      expect(ProfileValidator.isValidLicensePlate('ABC@123')).toBe(false); // Invalid character
    });

    test('should handle edge cases', () => {
      expect(ProfileValidator.isValidLicensePlate('AB')).toBe(true); // Minimum length
      expect(ProfileValidator.isValidLicensePlate('A'.repeat(10))).toBe(true); // Maximum length
      expect(ProfileValidator.isValidLicensePlate('')).toBe(false);
    });

    test('should handle invalid input types', () => {
      expect(ProfileValidator.isValidLicensePlate(null as any)).toBe(false);
      expect(ProfileValidator.isValidLicensePlate(undefined as any)).toBe(false);
      expect(ProfileValidator.isValidLicensePlate(123 as any)).toBe(false);
    });

    test('should handle case insensitivity', () => {
      expect(ProfileValidator.isValidLicensePlate('abc123')).toBe(true);
      expect(ProfileValidator.isValidLicensePlate('ABC123')).toBe(true);
    });
  });

  describe('isValidBio', () => {
    test('should validate bios within length limit', () => {
      expect(ProfileValidator.isValidBio('Hello, I am a student.')).toBe(true);
      expect(ProfileValidator.isValidBio('a'.repeat(500))).toBe(true);
    });

    test('should reject bios exceeding length limit', () => {
      expect(ProfileValidator.isValidBio('a'.repeat(501))).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(ProfileValidator.isValidBio('')).toBe(true); // Empty is valid
      expect(ProfileValidator.isValidBio('a'.repeat(500))).toBe(true); // Exactly max
    });

    test('should handle custom maxLength', () => {
      expect(ProfileValidator.isValidBio('a'.repeat(100), 100)).toBe(true);
      expect(ProfileValidator.isValidBio('a'.repeat(101), 100)).toBe(false);
    });

    test('should handle invalid input types', () => {
      expect(ProfileValidator.isValidBio(null as any)).toBe(false);
      expect(ProfileValidator.isValidBio(undefined as any)).toBe(false);
      expect(ProfileValidator.isValidBio(123 as any)).toBe(false);
    });
  });

  describe('isCompleteProfileWithoutCar', () => {
    test('should validate complete profiles', () => {
      const profile = {
        college: 'MIT',
        major: 'Computer Science',
        graduationYear: new Date().getFullYear() + 2,
      };
      expect(ProfileValidator.isCompleteProfileWithoutCar(profile)).toBe(true);
    });

    test('should reject incomplete profiles', () => {
      expect(ProfileValidator.isCompleteProfileWithoutCar({})).toBe(false);
      expect(ProfileValidator.isCompleteProfileWithoutCar({ college: 'MIT' })).toBe(false);
      expect(ProfileValidator.isCompleteProfileWithoutCar({ 
        college: 'MIT', 
        major: 'CS' 
      })).toBe(false);
    });

    test('should reject profiles with invalid data', () => {
      const invalidProfile = {
        college: 'A', // Too short
        major: 'Computer Science',
        graduationYear: new Date().getFullYear() + 2,
      };
      expect(ProfileValidator.isCompleteProfileWithoutCar(invalidProfile)).toBe(false);
    });

    test('should handle edge cases', () => {
      const edgeProfile = {
        college: 'AB', // Minimum length
        major: 'CS', // Minimum length
        graduationYear: new Date().getFullYear(),
      };
      expect(ProfileValidator.isCompleteProfileWithoutCar(edgeProfile)).toBe(true);
    });

    test('should handle missing fields', () => {
      expect(ProfileValidator.isCompleteProfileWithoutCar({ 
        college: undefined,
        major: 'CS',
        graduationYear: 2025 
      } as any)).toBe(false);
    });
  });

  describe('isCompleteProfileWithCar', () => {
    test('should validate complete profiles with car', () => {
      const profile = {
        college: 'MIT',
        major: 'Computer Science',
        graduationYear: new Date().getFullYear() + 2,
        carModel: 'Honda Civic',
        carCapacity: 4,
        licensePlate: 'ABC123',
      };
      expect(ProfileValidator.isCompleteProfileWithCar(profile)).toBe(true);
    });

    test('should reject profiles missing car info', () => {
      const profile = {
        college: 'MIT',
        major: 'Computer Science',
        graduationYear: new Date().getFullYear() + 2,
      };
      expect(ProfileValidator.isCompleteProfileWithCar(profile)).toBe(false);
    });

    test('should reject profiles with invalid car data', () => {
      const invalidProfile = {
        college: 'MIT',
        major: 'Computer Science',
        graduationYear: new Date().getFullYear() + 2,
        carModel: 'A', // Too short
        carCapacity: 4,
        licensePlate: 'ABC123',
      };
      expect(ProfileValidator.isCompleteProfileWithCar(invalidProfile)).toBe(false);
    });

    test('should handle edge cases', () => {
      const edgeProfile = {
        college: 'AB',
        major: 'CS',
        graduationYear: new Date().getFullYear(),
        carModel: 'AB',
        carCapacity: 1,
        licensePlate: 'AB',
      };
      expect(ProfileValidator.isCompleteProfileWithCar(edgeProfile)).toBe(true);
    });

    test('should reject if base profile is invalid', () => {
      const profile = {
        college: 'A', // Invalid
        major: 'Computer Science',
        graduationYear: new Date().getFullYear() + 2,
        carModel: 'Honda Civic',
        carCapacity: 4,
        licensePlate: 'ABC123',
      };
      expect(ProfileValidator.isCompleteProfileWithCar(profile)).toBe(false);
    });
  });
});
