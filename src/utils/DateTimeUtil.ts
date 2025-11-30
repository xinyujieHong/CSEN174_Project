/**
 * Utility class for date and time operations
 */
export class DateTimeUtil {
  /**
   * Formats date to readable string (e.g., "Jan 15, 2025")
   */
  static formatDate(date: Date | string): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  }

  /**
   * Formats time to 12-hour format (e.g., "2:30 PM")
   */
  static formatTime(time: string): string {
    if (!time || typeof time !== 'string') {
      return 'Invalid Time';
    }
    
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(time)) {
      return 'Invalid Time';
    }

    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  /**
   * Gets relative time string (e.g., "2 hours ago", "in 3 days")
   */
  static getRelativeTime(date: Date | string): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }

      const now = new Date();
      const diffMs = dateObj.getTime() - now.getTime();
      const diffSec = Math.floor(Math.abs(diffMs) / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      const isPast = diffMs < 0;
      const prefix = isPast ? '' : 'in ';
      const suffix = isPast ? ' ago' : '';

      if (diffSec < 60) {
        return isPast ? 'just now' : 'in a moment';
      } else if (diffMin < 60) {
        return `${prefix}${diffMin} minute${diffMin !== 1 ? 's' : ''}${suffix}`;
      } else if (diffHour < 24) {
        return `${prefix}${diffHour} hour${diffHour !== 1 ? 's' : ''}${suffix}`;
      } else if (diffDay < 7) {
        return `${prefix}${diffDay} day${diffDay !== 1 ? 's' : ''}${suffix}`;
      } else {
        return this.formatDate(dateObj);
      }
    } catch {
      return 'Invalid Date';
    }
  }

  /**
   * Checks if date is today
   */
  static isToday(date: Date | string): boolean {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return false;
      }
      const today = new Date();
      return (
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
      );
    } catch {
      return false;
    }
  }

  /**
   * Checks if date is within a given number of days
   */
  static isWithinDays(date: Date | string, days: number): boolean {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return false;
      }
      if (typeof days !== 'number' || days < 0) {
        return false;
      }
      const now = new Date();
      const diffMs = dateObj.getTime() - now.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= days;
    } catch {
      return false;
    }
  }

  /**
   * Combines date and time into a single Date object
   */
  static combineDateAndTime(date: Date | string, time: string): Date | null {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return null;
      }

      const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
      if (!timeRegex.test(time)) {
        return null;
      }

      const [hours, minutes] = time.split(':').map(Number);
      const combined = new Date(dateObj);
      combined.setHours(hours, minutes, 0, 0);
      return combined;
    } catch {
      return null;
    }
  }

  /**
   * Gets day of week from date
   */
  static getDayOfWeek(date: Date | string): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[dateObj.getDay()];
    } catch {
      return 'Invalid Date';
    }
  }

  /**
   * Validates if a datetime is at least X hours in the future
   */
  static isAtLeastHoursAhead(date: Date | string, hours: number): boolean {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return false;
      }
      if (typeof hours !== 'number' || hours < 0) {
        return false;
      }
      const now = new Date();
      const diffMs = dateObj.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours >= hours;
    } catch {
      return false;
    }
  }
}
