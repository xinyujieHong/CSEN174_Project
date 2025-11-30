/**
 * Utility class for validating carpool request data
 */
export class CarpoolRequestValidator {
  /**
   * Validates destination string
   */
  static isValidDestination(destination: string): boolean {
    if (!destination || typeof destination !== 'string') {
      return false;
    }
    const trimmed = destination.trim();
    return trimmed.length >= 3 && trimmed.length <= 200;
  }

  /**
   * Validates date is in the future
   */
  static isValidFutureDate(date: Date | string): boolean {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return false;
      }
      return dateObj.getTime() > Date.now();
    } catch {
      return false;
    }
  }

  /**
   * Validates time format (HH:MM)
   */
  static isValidTimeFormat(time: string): boolean {
    if (!time || typeof time !== 'string') {
      return false;
    }
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  /**
   * Validates number of passengers (1-7)
   */
  static isValidPassengerCount(count: number): boolean {
    if (typeof count !== 'number' || isNaN(count)) {
      return false;
    }
    return count >= 1 && count <= 7;
  }

  /**
   * Validates request type
   */
  static isValidRequestType(type: string): boolean {
    const validTypes = ['request', 'offer'];
    return validTypes.includes(type);
  }

  /**
   * Validates notes/description
   */
  static isValidNotes(notes: string, maxLength: number = 500): boolean {
    if (typeof notes !== 'string') {
      return false;
    }
    return notes.length <= maxLength;
  }

  /**
   * Validates complete carpool request
   */
  static isValidCarpoolRequest(request: {
    destination?: string;
    date?: Date | string;
    time?: string;
    passengers?: number;
    type?: string;
  }): boolean {
    return (
      !!request.destination &&
      this.isValidDestination(request.destination) &&
      !!request.date &&
      this.isValidFutureDate(request.date) &&
      !!request.time &&
      this.isValidTimeFormat(request.time) &&
      request.passengers !== undefined &&
      this.isValidPassengerCount(request.passengers) &&
      !!request.type &&
      this.isValidRequestType(request.type)
    );
  }

  /**
   * Calculates days until carpool date
   */
  static getDaysUntilCarpool(date: Date | string): number {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffTime = dateObj.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Checks if carpool request is urgent (within 24 hours)
   */
  static isUrgentRequest(date: Date | string): boolean {
    const days = this.getDaysUntilCarpool(date);
    return days <= 1 && days >= 0;
  }
}
