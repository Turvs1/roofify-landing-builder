
import { supabase } from '@/integrations/supabase/client';

export interface BookingData {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
}

export interface EnquiryData {
  name: string;
  phone: string;
  email: string;
  service: string;
  budget: string;
}

export const saveBookingToSupabase = async (bookingData: BookingData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .insert([bookingData]);
    
    if (error) {
      console.error('Error saving booking to Supabase:', error);
      return false;
    }
    
    console.log('Booking saved to Supabase:', bookingData);
    
    // Send email notification via edge function
    try {
      const response = await supabase.functions.invoke('send-form-notification', {
        body: {
          table: 'bookings',
          record: bookingData
        }
      });
      
      console.log('Edge function response for booking:', response);
      
      if (response.error) {
        console.error("Edge function error:", response.error);
      }
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);
      // We don't want to fail the booking if only the notification fails
    }
    
    return true;
  } catch (error) {
    console.error('Error saving booking to Supabase:', error);
    return false;
  }
};

export const saveEnquiryToSupabase = async (enquiryData: EnquiryData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('enquiries')
      .insert([enquiryData]);
    
    if (error) {
      console.error('Error saving enquiry to Supabase:', error);
      return false;
    }
    
    console.log('Enquiry saved to Supabase:', enquiryData);
    return true;
  } catch (error) {
    console.error('Error saving enquiry to Supabase:', error);
    return false;
  }
};

export const getBookingsFromSupabase = async (): Promise<BookingData[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error retrieving bookings from Supabase:', error);
      return [];
    }
    
    // Ensure all records have the required fields according to BookingData interface
    const bookingsWithEmail = data?.map(booking => ({
      name: booking.name,
      phone: booking.phone,
      email: booking.email || '', // Provide default empty string if email is null
      date: booking.date,
      time: booking.time
    })) || [];
    
    return bookingsWithEmail;
  } catch (error) {
    console.error('Error retrieving bookings from Supabase:', error);
    return [];
  }
};

export const getEnquiriesFromSupabase = async (): Promise<EnquiryData[]> => {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error retrieving enquiries from Supabase:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error retrieving enquiries from Supabase:', error);
    return [];
  }
};
