
import { supabase } from '@/integrations/supabase/client';

export interface BookingData {
  name: string;
  phone: string;
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
    
    return data || [];
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
