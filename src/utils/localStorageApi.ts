
/**
 * Utility for storing booking data in local storage
 */

export interface BookingData {
  name: string;
  phone: string;
  date: string;
  time: string;
  createdAt: string;
}

const STORAGE_KEY = 'arw_bookings';

export const saveBookingToLocalStorage = (bookingData: Omit<BookingData, 'createdAt'>): boolean => {
  try {
    // Add timestamp to booking
    const bookingWithTimestamp: BookingData = {
      ...bookingData,
      createdAt: new Date().toISOString()
    };

    // Get existing bookings
    const existingBookingsJSON = localStorage.getItem(STORAGE_KEY);
    const existingBookings: BookingData[] = existingBookingsJSON 
      ? JSON.parse(existingBookingsJSON) 
      : [];
    
    // Add new booking
    existingBookings.push(bookingWithTimestamp);
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingBookings));
    
    console.log('Booking saved to local storage:', bookingWithTimestamp);
    return true;
  } catch (error) {
    console.error('Error saving booking to local storage:', error);
    return false;
  }
};

export const getBookingsFromLocalStorage = (): BookingData[] => {
  try {
    const bookingsJSON = localStorage.getItem(STORAGE_KEY);
    return bookingsJSON ? JSON.parse(bookingsJSON) : [];
  } catch (error) {
    console.error('Error retrieving bookings from local storage:', error);
    return [];
  }
};

export const clearBookingsFromLocalStorage = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing bookings from local storage:', error);
    return false;
  }
};
