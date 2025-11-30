/**
 * Utility class for validating profile data
 */
export class ProfileValidator {
  /**
   * Validates college/university name
   */
  static isValidCollegeName(name: string): boolean {
    if (!name || typeof name !== 'string') {
      return false;
    }
    const trimmed = name.trim();
    return trimmed.length >= 2 && trimmed.length <= 100;
  }

  /**
   * Validates major field
   */
  static isValidMajor(major: string): boolean {
    if (!major || typeof major !== 'string') {
      return false;
    }
    const trimmed = major.trim();
    return trimmed.length >= 2 && trimmed.length <= 50;
  }

  /**
   * Validates graduation year (must be between current year and 10 years in the future)
   */
  static isValidGraduationYear(year: number): boolean {
    if (typeof year !== 'number' || isNaN(year)) {
      return false;
    }
    const currentYear = new Date().getFullYear();
    return year >= currentYear && year <= currentYear + 10;
  }

  /**
   * Validates car model string
   */
  static isValidCarModel(model: string): boolean {
    if (!model || typeof model !== 'string') {
      return false;
    }
    const trimmed = model.trim();
    return trimmed.length >= 2 && trimmed.length <= 50;
  }

  /**
   * Validates car capacity (1-8 passengers)
   */
  static isValidCarCapacity(capacity: number): boolean {
    if (typeof capacity !== 'number' || isNaN(capacity)) {
      return false;
    }
    return capacity >= 1 && capacity <= 8;
  }

  /**
   * Validates license plate (2-10 alphanumeric characters)
   */
  static isValidLicensePlate(plate: string): boolean {
    if (!plate || typeof plate !== 'string') {
      return false;
    }
    const trimmed = plate.trim().replace(/[\s-]/g, '');
    if (trimmed.length < 2 || trimmed.length > 10) {
      return false;
    }
    return /^[A-Z0-9]+$/i.test(trimmed);
  }

  /**
   * Validates bio/description length
   */
  static isValidBio(bio: string, maxLength: number = 500): boolean {
    if (typeof bio !== 'string') {
      return false;
    }
    return bio.length <= maxLength;
  }

  /**
   * Validates complete profile for user without car
   */
  static isCompleteProfileWithoutCar(profile: {
    college?: string;
    major?: string;
    graduationYear?: number;
  }): boolean {
    return (
      !!profile.college &&
      this.isValidCollegeName(profile.college) &&
      !!profile.major &&
      this.isValidMajor(profile.major) &&
      !!profile.graduationYear &&
      this.isValidGraduationYear(profile.graduationYear)
    );
  }

  /**
   * Validates complete profile for user with car
   */
  static isCompleteProfileWithCar(profile: {
    college?: string;
    major?: string;
    graduationYear?: number;
    carModel?: string;
    carCapacity?: number;
    licensePlate?: string;
  }): boolean {
    return (
      this.isCompleteProfileWithoutCar(profile) &&
      !!profile.carModel &&
      this.isValidCarModel(profile.carModel) &&
      !!profile.carCapacity &&
      this.isValidCarCapacity(profile.carCapacity) &&
      !!profile.licensePlate &&
      this.isValidLicensePlate(profile.licensePlate)
    );
  }
}
