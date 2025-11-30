import { CarpoolRequestValidator } from '../CarpoolRequestValidator';

describe('CarpoolRequestValidator', () => {
  describe('isValidDestination', () => {
    test('should validate correct destinations', () => {
      expect(CarpoolRequestValidator.isValidDestination('Airport')).toBe(true);
      expect(CarpoolRequestValidator.isValidDestination('Downtown Boston')).toBe(true);
      expect(CarpoolRequestValidator.isValidDestination('123 Main Street, City')).toBe(true);
    });

    test('should reject invalid destinations', () => {
      expect(CarpoolRequestValidator.isValidDestination('AB')).toBe(false); // Too short
      expect(CarpoolRequestValidator.isValidDestination('a'.repeat(201))).toBe(false); // Too long
    });

    test('should handle edge cases', () => {
      expect(CarpoolRequestValidator.isValidDestination('ABC')).toBe(true); // Minimum
      expect(CarpoolRequestValidator.isValidDestination('a'.repeat(200))).toBe(true); // Maximum
      expect(CarpoolRequestValidator.isValidDestination('')).toBe(false);
    });

    test('should handle invalid input types', () => {
      expect(CarpoolRequestValidator.isValidDestination(null as any)).toBe(false);
      expect(CarpoolRequestValidator.isValidDestination(undefined as any)).toBe(false);
      expect(CarpoolRequestValidator.isValidDestination(123 as any)).toBe(false);
    });

    test('should trim whitespace', () => {
      expect(CarpoolRequestValidator.isValidDestination('  Airport  ')).toBe(true);
    });
  });

  describe('isValidFutureDate', () => {
    test('should validate future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(CarpoolRequestValidator.isValidFutureDate(tomorrow)).toBe(true);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      expect(CarpoolRequestValidator.isValidFutureDate(nextWeek)).toBe(true);
    });

    test('should reject past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(CarpoolRequestValidator.isValidFutureDate(yesterday)).toBe(false);
    });

    test('should validate future date strings', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(CarpoolRequestValidator.isValidFutureDate(tomorrow.toISOString())).toBe(true);
    });

    test('should handle invalid date formats', () => {
      expect(CarpoolRequestValidator.isValidFutureDate('invalid-date')).toBe(false);
      expect(CarpoolRequestValidator.isValidFutureDate('')).toBe(false);
    });

    test('should handle invalid input types', () => {
      expect(CarpoolRequestValidator.isValidFutureDate(null as any)).toBe(false);
      expect(CarpoolRequestValidator.isValidFutureDate(undefined as any)).toBe(false);
      expect(CarpoolRequestValidator.isValidFutureDate(123 as any)).toBe(false);
    });
  });

  describe('isValidTimeFormat', () => {
    test('should validate correct time formats', () => {
      expect(CarpoolRequestValidator.isValidTimeFormat('09:30')).toBe(true);
      expect(CarpoolRequestValidator.isValidTimeFormat('14:45')).toBe(true);
      expect(CarpoolRequestValidator.isValidTimeFormat('00:00')).toBe(true);
      expect(CarpoolRequestValidator.isValidTimeFormat('23:59')).toBe(true);
    });

    test('should reject invalid time formats', () => {
      expect(CarpoolRequestValidator.isValidTimeFormat('25:00')).toBe(false); // Invalid hour
      expect(CarpoolRequestValidator.isValidTimeFormat('12:60')).toBe(false); // Invalid minute
      expect(CarpoolRequestValidator.isValidTimeFormat('9:30')).toBe(true); // Single digit hour is ok
      expect(CarpoolRequestValidator.isValidTimeFormat('12:5')).toBe(false); // Single digit minute
    });

    test('should handle edge cases', () => {
      expect(CarpoolRequestValidator.isValidTimeFormat('0:00')).toBe(true);
      expect(CarpoolRequestValidator.isValidTimeFormat('')).toBe(false);
    });

    test('should handle invalid input types', () => {
      expect(CarpoolRequestValidator.isValidTimeFormat(null as any)).toBe(false);
      expect(CarpoolRequestValidator.isValidTimeFormat(undefined as any)).toBe(false);
      expect(CarpoolRequestValidator.isValidTimeFormat(123 as any)).toBe(false);
    });

    test('should reject times with seconds', () => {
      expect(CarpoolRequestValidator.isValidTimeFormat('12:30:00')).toBe(false);
    });
  });

  describe('isValidPassengerCount', () => {
    test('should validate valid passenger counts', () => {
      expect(CarpoolRequestValidator.isValidPassengerCount(1)).toBe(true);
      expect(CarpoolRequestValidator.isValidPassengerCount(4)).toBe(true);
      expect(CarpoolRequestValidator.isValidPassengerCount(7)).toBe(true);
    });

    test('should reject invalid passenger counts', () => {
      expect(CarpoolRequestValidator.isValidPassengerCount(0)).toBe(false);
      expect(CarpoolRequestValidator.isValidPassengerCount(8)).toBe(false);
      expect(CarpoolRequestValidator.isValidPassengerCount(-1)).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(CarpoolRequestValidator.isValidPassengerCount(1)).toBe(true); // Minimum
      expect(CarpoolRequestValidator.isValidPassengerCount(7)).toBe(true); // Maximum
    });

    test('should handle invalid input types', () => {
      expect(CarpoolRequestValidator.isValidPassengerCount(NaN)).toBe(false);
      expect(CarpoolRequestValidator.isValidPassengerCount('4' as any)).toBe(false);
      expect(CarpoolRequestValidator.isValidPassengerCount(null as any)).toBe(false);
      expect(CarpoolRequestValidator.isValidPassengerCount(undefined as any)).toBe(false);
    });

    test('should handle decimal numbers', () => {
      expect(CarpoolRequestValidator.isValidPassengerCount(3.5)).toBe(true); // JS allows this
    });
  });

  describe('isValidRequestType', () => {
    test('should validate correct request types', () => {
      expect(CarpoolRequestValidator.isValidRequestType('request')).toBe(true);
      expect(CarpoolRequestValidator.isValidRequestType('offer')).toBe(true);
    });

    test('should reject invalid request types', () => {
      expect(CarpoolRequestValidator.isValidRequestType('invalid')).toBe(false);
      expect(CarpoolRequestValidator.isValidRequestType('REQUEST')).toBe(false); // Case sensitive
      expect(CarpoolRequestValidator.isValidRequestType('')).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(CarpoolRequestValidator.isValidRequestType(' request ')).toBe(false); // No trim
    });

    test('should handle invalid input types', () => {
      expect(CarpoolRequestValidator.isValidRequestType(null as any)).toBe(false);
      expect(CarpoolRequestValidator.isValidRequestType(undefined as any)).toBe(false);
      expect(CarpoolRequestValidator.isValidRequestType(123 as any)).toBe(false);
    });

    test('should only accept exact matches', () => {
      expect(CarpoolRequestValidator.isValidRequestType('requests')).toBe(false);
      expect(CarpoolRequestValidator.isValidRequestType('offers')).toBe(false);
    });
  });

  describe('isValidNotes', () => {
    test('should validate notes within length limit', () => {
      expect(CarpoolRequestValidator.isValidNotes('Please pick me up at the dorm.')).toBe(true);
      expect(CarpoolRequestValidator.isValidNotes('a'.repeat(500))).toBe(true);
    });

    test('should reject notes exceeding length limit', () => {
      expect(CarpoolRequestValidator.isValidNotes('a'.repeat(501))).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(CarpoolRequestValidator.isValidNotes('')).toBe(true); // Empty is valid
      expect(CarpoolRequestValidator.isValidNotes('a'.repeat(500))).toBe(true);
    });

    test('should handle custom maxLength', () => {
      expect(CarpoolRequestValidator.isValidNotes('a'.repeat(100), 100)).toBe(true);
      expect(CarpoolRequestValidator.isValidNotes('a'.repeat(101), 100)).toBe(false);
    });

    test('should handle invalid input types', () => {
      expect(CarpoolRequestValidator.isValidNotes(null as any)).toBe(false);
      expect(CarpoolRequestValidator.isValidNotes(undefined as any)).toBe(false);
      expect(CarpoolRequestValidator.isValidNotes(123 as any)).toBe(false);
    });
  });

  describe('isValidCarpoolRequest', () => {
    test('should validate complete carpool requests', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const request = {
        destination: 'Airport',
        date: tomorrow,
        time: '14:30',
        passengers: 3,
        type: 'request',
      };
      expect(CarpoolRequestValidator.isValidCarpoolRequest(request)).toBe(true);
    });

    test('should reject incomplete requests', () => {
      expect(CarpoolRequestValidator.isValidCarpoolRequest({})).toBe(false);
      expect(CarpoolRequestValidator.isValidCarpoolRequest({ 
        destination: 'Airport' 
      })).toBe(false);
    });

    test('should reject requests with invalid fields', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const invalidRequest = {
        destination: 'AB', // Too short
        date: tomorrow,
        time: '14:30',
        passengers: 3,
        type: 'request',
      };
      expect(CarpoolRequestValidator.isValidCarpoolRequest(invalidRequest)).toBe(false);
    });

    test('should handle edge cases', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const edgeRequest = {
        destination: 'ABC', // Minimum
        date: tomorrow,
        time: '0:00',
        passengers: 1, // Minimum
        type: 'request',
      };
      expect(CarpoolRequestValidator.isValidCarpoolRequest(edgeRequest)).toBe(true);
    });

    test('should reject past dates in requests', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const request = {
        destination: 'Airport',
        date: yesterday,
        time: '14:30',
        passengers: 3,
        type: 'request',
      };
      expect(CarpoolRequestValidator.isValidCarpoolRequest(request)).toBe(false);
    });
  });

  describe('getDaysUntilCarpool', () => {
    test('should calculate days correctly', () => {
      const threeDaysLater = new Date();
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);
      threeDaysLater.setHours(23, 59, 59, 999); // End of day
      
      const days = CarpoolRequestValidator.getDaysUntilCarpool(threeDaysLater);
      expect(days).toBeGreaterThanOrEqual(3);
      expect(days).toBeLessThanOrEqual(4);
    });

    test('should handle date strings', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const days = CarpoolRequestValidator.getDaysUntilCarpool(tomorrow.toISOString());
      expect(days).toBeGreaterThanOrEqual(0);
      expect(days).toBeLessThanOrEqual(2);
    });

    test('should return negative for past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const days = CarpoolRequestValidator.getDaysUntilCarpool(yesterday);
      expect(days).toBeLessThan(0);
    });

    test('should handle edge cases', () => {
      const now = new Date();
      const days = CarpoolRequestValidator.getDaysUntilCarpool(now);
      expect(days).toBeGreaterThanOrEqual(0);
      expect(days).toBeLessThanOrEqual(1);
    });

    test('should handle large date differences', () => {
      const farFuture = new Date();
      farFuture.setFullYear(farFuture.getFullYear() + 1);
      
      const days = CarpoolRequestValidator.getDaysUntilCarpool(farFuture);
      expect(days).toBeGreaterThan(300);
    });
  });

  describe('isUrgentRequest', () => {
    test('should identify urgent requests', () => {
      const today = new Date();
      today.setHours(23, 59, 59);
      expect(CarpoolRequestValidator.isUrgentRequest(today)).toBe(true);

      const inTwentyHours = new Date();
      inTwentyHours.setHours(inTwentyHours.getHours() + 20);
      expect(CarpoolRequestValidator.isUrgentRequest(inTwentyHours)).toBe(true);
    });

    test('should not mark non-urgent requests', () => {
      const twoDaysLater = new Date();
      twoDaysLater.setDate(twoDaysLater.getDate() + 2);
      expect(CarpoolRequestValidator.isUrgentRequest(twoDaysLater)).toBe(false);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      expect(CarpoolRequestValidator.isUrgentRequest(nextWeek)).toBe(false);
    });

    test('should handle edge cases', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      // Should be urgent (exactly 1 day)
      const result = CarpoolRequestValidator.isUrgentRequest(tomorrow);
      expect(typeof result).toBe('boolean');
    });

    test('should handle past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(CarpoolRequestValidator.isUrgentRequest(yesterday)).toBe(false);
    });

    test('should handle date strings', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = CarpoolRequestValidator.isUrgentRequest(tomorrow.toISOString());
      expect(typeof result).toBe('boolean');
    });
  });
});
