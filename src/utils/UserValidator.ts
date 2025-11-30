/**
 * Utility class for validating user data and authentication inputs
 */
export class UserValidator {
  /**
   * Validates email format
   */
  static isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Validates password strength
   * Requirements: at least 8 characters, one uppercase, one lowercase, one number
   */
  static isValidPassword(password: string): boolean {
    if (!password || typeof password !== 'string') {
      return false;
    }
    if (password.length < 8) {
      return false;
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber;
  }

  /**
   * Validates university email (must end with .edu)
   */
  static isUniversityEmail(email: string): boolean {
    if (!this.isValidEmail(email)) {
      return false;
    }
    return email.toLowerCase().trim().endsWith('.edu');
  }

  /**
   * Validates username (3-20 alphanumeric characters)
   */
  static isValidUsername(username: string): boolean {
    if (!username || typeof username !== 'string') {
      return false;
    }
    const trimmed = username.trim();
    if (trimmed.length < 3 || trimmed.length > 20) {
      return false;
    }
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(trimmed);
  }

  /**
   * Validates phone number (10 digits, optional formatting)
   */
  static isValidPhoneNumber(phone: string): boolean {
    if (!phone || typeof phone !== 'string') {
      return false;
    }
    // Remove all non-digit characters
    const hasCountryCode = phone.trim().startsWith('+');
    const digits = phone.replace(/\D/g, '');

    if (hasCountryCode) {
      return digits.length === 11;
    }
    return digits.length === 10;
  }

  /**
   * Sanitizes user input by trimming whitespace and limiting length
   */
  static sanitizeInput(input: string, maxLength: number = 255): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    return input.trim().substring(0, maxLength);
  }
}
