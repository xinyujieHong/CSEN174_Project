import { DateTimeUtil } from '../DateTimeUtil';

describe('DateTimeUtil', () => {
  describe('formatDate', () => {
    test('should format dates correctly', () => {
      const date = new Date('2025-01-15');
      const formatted = DateTimeUtil.formatDate(date);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2025');
    });

    test('should handle date strings', () => {
      const formatted = DateTimeUtil.formatDate('2025-03-20');
      expect(formatted).toContain('Mar');
      expect(formatted).toContain('20');
      expect(formatted).toContain('2025');
    });

    test('should handle invalid dates', () => {
      expect(DateTimeUtil.formatDate('invalid-date')).toBe('Invalid Date');
      expect(DateTimeUtil.formatDate('')).toBe('Invalid Date');
    });

    test('should handle edge cases', () => {
      const newYear = new Date('2025-01-01');
      expect(DateTimeUtil.formatDate(newYear)).toContain('Jan');
      
      const endOfYear = new Date('2025-12-31');
      expect(DateTimeUtil.formatDate(endOfYear)).toContain('Dec');
    });

    test('should handle invalid input types', () => {
      expect(DateTimeUtil.formatDate(null as any)).toBe('Invalid Date');
      expect(DateTimeUtil.formatDate(undefined as any)).toBe('Invalid Date');
      expect(DateTimeUtil.formatDate(123 as any)).toBe('Invalid Date');
    });
  });

  describe('formatTime', () => {
    test('should format time to 12-hour format', () => {
      expect(DateTimeUtil.formatTime('14:30')).toBe('2:30 PM');
      expect(DateTimeUtil.formatTime('09:15')).toBe('9:15 AM');
      expect(DateTimeUtil.formatTime('00:00')).toBe('12:00 AM');
      expect(DateTimeUtil.formatTime('12:00')).toBe('12:00 PM');
    });

    test('should handle edge cases', () => {
      expect(DateTimeUtil.formatTime('23:59')).toBe('11:59 PM');
      expect(DateTimeUtil.formatTime('0:00')).toBe('12:00 AM');
      expect(DateTimeUtil.formatTime('1:05')).toBe('1:05 AM');
    });

    test('should handle invalid time formats', () => {
      expect(DateTimeUtil.formatTime('25:00')).toBe('Invalid Time');
      expect(DateTimeUtil.formatTime('12:60')).toBe('Invalid Time');
      expect(DateTimeUtil.formatTime('invalid')).toBe('Invalid Time');
      expect(DateTimeUtil.formatTime('')).toBe('Invalid Time');
    });

    test('should handle invalid input types', () => {
      expect(DateTimeUtil.formatTime(null as any)).toBe('Invalid Time');
      expect(DateTimeUtil.formatTime(undefined as any)).toBe('Invalid Time');
      expect(DateTimeUtil.formatTime(123 as any)).toBe('Invalid Time');
    });

    test('should pad minutes with zero', () => {
      expect(DateTimeUtil.formatTime('14:05')).toBe('2:05 PM');
      expect(DateTimeUtil.formatTime('9:00')).toBe('9:00 AM');
    });
  });

  describe('getRelativeTime', () => {
    test('should return "just now" for very recent dates', () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 30000); // 30 seconds ago
      expect(DateTimeUtil.getRelativeTime(recent)).toBe('just now');
    });

    test('should return minutes ago for recent past', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
      expect(DateTimeUtil.getRelativeTime(fiveMinutesAgo)).toContain('minute');
      expect(DateTimeUtil.getRelativeTime(fiveMinutesAgo)).toContain('ago');
    });

    test('should return hours ago for past hours', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 3600000);
      expect(DateTimeUtil.getRelativeTime(twoHoursAgo)).toContain('hour');
      expect(DateTimeUtil.getRelativeTime(twoHoursAgo)).toContain('ago');
    });

    test('should return future relative time', () => {
      const now = new Date();
      const inTwoHours = new Date(now.getTime() + 2 * 3600000);
      expect(DateTimeUtil.getRelativeTime(inTwoHours)).toContain('in');
      expect(DateTimeUtil.getRelativeTime(inTwoHours)).toContain('hour');
    });

    test('should handle edge cases', () => {
      const now = new Date();
      const future = new Date(now.getTime() + 30000); // 30 seconds future
      expect(DateTimeUtil.getRelativeTime(future)).toBe('in a moment');
    });

    test('should handle invalid dates', () => {
      expect(DateTimeUtil.getRelativeTime('invalid-date')).toBe('Invalid Date');
    });

    test('should format absolute date for dates over a week', () => {
      const now = new Date();
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 3600000);
      const result = DateTimeUtil.getRelativeTime(twoWeeksAgo);
      expect(result).not.toContain('ago');
      expect(result).not.toBe('Invalid Date');
    });
  });

  describe('isToday', () => {
    test('should return true for today', () => {
      const today = new Date();
      expect(DateTimeUtil.isToday(today)).toBe(true);
    });

    test('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(DateTimeUtil.isToday(yesterday)).toBe(false);
    });

    test('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(DateTimeUtil.isToday(tomorrow)).toBe(false);
    });

    test('should handle date strings', () => {
      const today = new Date();
      expect(DateTimeUtil.isToday(today.toISOString())).toBe(true);
    });

    test('should handle edge cases', () => {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      expect(DateTimeUtil.isToday(startOfToday)).toBe(true);

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      expect(DateTimeUtil.isToday(endOfToday)).toBe(true);
    });

    test('should handle invalid dates', () => {
      expect(DateTimeUtil.isToday('invalid-date')).toBe(false);
      expect(DateTimeUtil.isToday(null as any)).toBe(false);
    });
  });

  describe('isWithinDays', () => {
    test('should return true for dates within range', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(DateTimeUtil.isWithinDays(tomorrow, 7)).toBe(true);

      const threeDaysLater = new Date();
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);
      expect(DateTimeUtil.isWithinDays(threeDaysLater, 5)).toBe(true);
    });

    test('should return false for dates outside range', () => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 8);
      expect(DateTimeUtil.isWithinDays(nextWeek, 7)).toBe(false);
    });

    test('should return false for past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(DateTimeUtil.isWithinDays(yesterday, 7)).toBe(false);
    });

    test('should handle edge cases', () => {
      const today = new Date();
      expect(DateTimeUtil.isWithinDays(today, 0)).toBe(true);
      expect(DateTimeUtil.isWithinDays(today, -1)).toBe(false); // Negative days
    });

    test('should handle invalid inputs', () => {
      expect(DateTimeUtil.isWithinDays('invalid-date', 7)).toBe(false);
      expect(DateTimeUtil.isWithinDays(new Date(), NaN)).toBe(false);
    });
  });

  describe('combineDateAndTime', () => {
    test('should combine date and time correctly', () => {
      const date = new Date('2025-01-15');
      const combined = DateTimeUtil.combineDateAndTime(date, '14:30');
      expect(combined).not.toBeNull();
      expect(combined!.getHours()).toBe(14);
      expect(combined!.getMinutes()).toBe(30);
    });

    test('should handle date strings', () => {
      const combined = DateTimeUtil.combineDateAndTime('2025-01-15', '09:00');
      expect(combined).not.toBeNull();
      expect(combined!.getHours()).toBe(9);
      expect(combined!.getMinutes()).toBe(0);
    });

    test('should handle edge cases', () => {
      const date = new Date('2025-01-15');
      const midnight = DateTimeUtil.combineDateAndTime(date, '0:00');
      expect(midnight!.getHours()).toBe(0);

      const endOfDay = DateTimeUtil.combineDateAndTime(date, '23:59');
      expect(endOfDay!.getHours()).toBe(23);
      expect(endOfDay!.getMinutes()).toBe(59);
    });

    test('should return null for invalid inputs', () => {
      expect(DateTimeUtil.combineDateAndTime('invalid-date', '14:30')).toBeNull();
      expect(DateTimeUtil.combineDateAndTime(new Date(), 'invalid-time')).toBeNull();
      expect(DateTimeUtil.combineDateAndTime(new Date(), '25:00')).toBeNull();
    });

    test('should not modify original date', () => {
      const date = new Date('2025-01-15');
      const originalTime = date.getTime();
      DateTimeUtil.combineDateAndTime(date, '14:30');
      expect(date.getTime()).toBe(originalTime);
    });
  });

  describe('getDayOfWeek', () => {
    test('should return correct day of week', () => {
      const monday = new Date('2025-01-27'); // This is a Monday
      expect(DateTimeUtil.getDayOfWeek(monday)).toBe('Monday');

      const sunday = new Date('2025-02-02'); // This is a Sunday
      expect(DateTimeUtil.getDayOfWeek(sunday)).toBe('Sunday');
    });

    test('should handle date strings', () => {
      const result = DateTimeUtil.getDayOfWeek('2025-01-27');
      expect(result).toBe('Monday');
    });

    test('should handle edge cases', () => {
      const newYear = new Date('2025-01-01');
      const day = DateTimeUtil.getDayOfWeek(newYear);
      expect(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']).toContain(day);
    });

    test('should handle invalid dates', () => {
      expect(DateTimeUtil.getDayOfWeek('invalid-date')).toBe('Invalid Date');
      expect(DateTimeUtil.getDayOfWeek(null as any)).toBe('Invalid Date');
    });

    test('should return full day names', () => {
      const date = new Date('2025-01-27');
      const day = DateTimeUtil.getDayOfWeek(date);
      expect(day.length).toBeGreaterThan(3); // Full name, not abbreviation
    });
  });

  describe('isAtLeastHoursAhead', () => {
    test('should return true for dates sufficiently in future', () => {
      const now = new Date();
      const fourHoursLater = new Date(now.getTime() + 4 * 3600000);
      expect(DateTimeUtil.isAtLeastHoursAhead(fourHoursLater, 2)).toBe(true);
    });

    test('should return false for dates not far enough in future', () => {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 3600000);
      expect(DateTimeUtil.isAtLeastHoursAhead(oneHourLater, 2)).toBe(false);
    });

    test('should return false for past dates', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 3600000);
      expect(DateTimeUtil.isAtLeastHoursAhead(oneHourAgo, 2)).toBe(false);
    });

    test('should handle edge cases', () => {
      const now = new Date();
      const exactlyTwoHours = new Date(now.getTime() + 2 * 3600000);
      expect(DateTimeUtil.isAtLeastHoursAhead(exactlyTwoHours, 2)).toBe(true);

      expect(DateTimeUtil.isAtLeastHoursAhead(now, 0)).toBe(true);
    });

    test('should handle invalid inputs', () => {
      expect(DateTimeUtil.isAtLeastHoursAhead('invalid-date', 2)).toBe(false);
      expect(DateTimeUtil.isAtLeastHoursAhead(new Date(), -1)).toBe(false);
      expect(DateTimeUtil.isAtLeastHoursAhead(new Date(), NaN)).toBe(false);
    });

    test('should handle date strings', () => {
      const now = new Date();
      const future = new Date(now.getTime() + 5 * 3600000);
      expect(DateTimeUtil.isAtLeastHoursAhead(future.toISOString(), 3)).toBe(true);
    });
  });
});
