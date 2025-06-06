
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { format, addMonths, subMonths, startOfMonth, addDays, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { saveBookingToSupabase, getBookingsFromSupabase } from '../utils/supabaseApi';
import { supabase } from '@/integrations/supabase/client';

// Types for our calendar data
interface TimeSlot {
  time: string;
  available: boolean;
}

interface Booking {
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
}

const BookingCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Function to check if a date is March 7, 2025 (Cyclone Alfred day)
  const isCycloneDay = (date: Date) => {
    return date.getDate() === 7 && date.getMonth() === 2 && date.getFullYear() === 2025;
  };
  
  // Generate time slots for the selected date
  const generateTimeSlots = (selectedDate: Date, existingBookings: Booking[]): TimeSlot[] => {
    // Generate 8 time slots from 8:00 AM to 4:00 PM
    const slots: TimeSlot[] = [];
    const startHour = 8;
    
    // Format date string to match the format stored in Supabase (e.g., "3/1/2025")
    const formattedDate = `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`;
    
    for (let i = 0; i < 8; i++) {
      const hour = startHour + i;
      const time = `${hour === 12 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
      
      // Check if this slot is already booked
      const isBooked = existingBookings.some(booking => 
        booking.date === formattedDate && booking.time === time
      );
      
      slots.push({
        time,
        available: !isBooked // Only unavailable if actually booked in Supabase
      });
    }
    
    return slots;
  };
  
  // Navigate to previous month
  const previousMonth = () => {
    setMonth(subMonths(month, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setMonth(addMonths(month, 1));
  };
  
  // Fetch bookings from Supabase and set up calendar
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const fetchedBookings = await getBookingsFromSupabase();
        console.log('Fetched bookings:', fetchedBookings);
        setBookings(fetchedBookings);
        
        // If a date is selected, generate time slots for it
        if (date) {
          const slots = isCycloneDay(date) ? [] : generateTimeSlots(date, fetchedBookings);
          setAvailableTimeSlots(slots);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load calendar data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
    
    // Set up subscription to real-time booking updates
    const channel = supabase
      .channel('bookings-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'bookings' }, 
        async (payload) => {
          console.log('New booking received:', payload);
          // Refresh bookings when new booking is made
          const fetchedBookings = await getBookingsFromSupabase();
          setBookings(fetchedBookings);
          
          // Update available time slots for selected date
          if (date) {
            const slots = isCycloneDay(date) ? [] : generateTimeSlots(date, fetchedBookings);
            setAvailableTimeSlots(slots);
          }
          
          // Clear selection if the selected slot was just booked
          if (date && selectedTime) {
            const formattedSelectedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            const isSelectedSlotBooked = fetchedBookings.some(booking => 
              booking.date === formattedSelectedDate && booking.time === selectedTime
            );
            
            if (isSelectedSlotBooked) {
              toast.info('The slot you selected was just booked by someone else');
              setSelectedTime(null);
            }
          }
        })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [date, selectedTime]);
  
  // Handle date selection from calendar
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    
    setDate(selectedDate);
    setSelectedTime(null);
    
    if (isCycloneDay(selectedDate)) {
      setAvailableTimeSlots([]);
      toast.info('March 7, 2025 is Cyclone Alfred day. No appointments available.');
    } else {
      const slots = generateTimeSlots(selectedDate, bookings);
      setAvailableTimeSlots(slots);
    }
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedTime || !name || !phone || !email) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format date for better readability
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      
      // Check once more if the slot is still available (in case someone else booked it)
      const currentBookings = await getBookingsFromSupabase();
      const isSlotTaken = currentBookings.some(booking => 
        booking.date === formattedDate && booking.time === selectedTime
      );
      
      if (isSlotTaken) {
        toast.error("This slot was just booked by someone else. Please select another time.");
        
        // Refresh available time slots
        const slots = isCycloneDay(date) ? [] : generateTimeSlots(date, currentBookings);
        setAvailableTimeSlots(slots);
        setSelectedTime(null);
        return;
      }
      
      // Save booking to Supabase
      const success = await saveBookingToSupabase({
        name,
        phone,
        email,
        date: formattedDate,
        time: selectedTime
      });
      
      if (success) {
        toast.success(`Appointment booked for ${formattedDate} at ${selectedTime}`);
        // Reset form
        setDate(new Date());
        setSelectedTime(null);
        setName('');
        setPhone('');
        setEmail('');
        // Refresh available time slots
        const updatedBookings = await getBookingsFromSupabase();
        setBookings(updatedBookings);
      } else {
        toast.error("Failed to save booking. Please try again.");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 z-0"></div>
      
      <AnimatedSection>
        <h2 className="section-heading text-center">BOOK YOUR SLOT</h2>
      </AnimatedSection>
      
      <AnimatedSection delay={200}>
        <p className="section-text text-center mb-12">
          Schedule a consultation or service—limited slots available.
        </p>
      </AnimatedSection>
      
      <AnimatedSection delay={400} className="max-w-4xl mx-auto">
        <div className="glass-card">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-arw-blue"></div>
              <p className="ml-3 text-arw-navy">Loading available slots...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-arw-navy mb-4">Select Date</h3>
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center justify-between w-full mb-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={previousMonth}
                      className="border-arw-navy text-arw-navy hover:text-arw-blue hover:border-arw-blue"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h4 className="text-lg font-semibold">
                      {format(month, 'MMMM yyyy')}
                    </h4>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={nextMonth}
                      className="border-arw-navy text-arw-navy hover:text-arw-blue hover:border-arw-blue"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    month={month}
                    onMonthChange={setMonth}
                    className="rounded-md border p-3 pointer-events-auto"
                    disabled={(currentDate) => {
                      // Disable dates before today
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return currentDate < today;
                    }}
                    modifiers={{
                      cyclone: [new Date(2025, 2, 7)], // March 7, 2025
                    }}
                    modifiersClassNames={{
                      cyclone: "bg-red-100 text-red-800 opacity-75",
                    }}
                  />
                  
                  {isCycloneDay(date) && (
                    <div className="w-full bg-red-100 text-red-800 p-3 rounded-md mt-4 text-center">
                      <p className="font-medium">Cyclone Alfred Day</p>
                      <p className="text-sm">No appointments available on March 7, 2025.</p>
                    </div>
                  )}
                </div>
              </div>
              
              {date && availableTimeSlots.length > 0 && (
                <div className="mb-8 animate-fade-in">
                  <h3 className="text-xl font-bold text-arw-navy mb-4">Select Time for {format(date, 'MMMM d, yyyy')}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availableTimeSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        className={`
                          p-3 rounded-md text-center transition-all duration-300
                          ${!slot.available 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : selectedTime === slot.time
                              ? 'bg-arw-blue text-white'
                              : 'bg-white hover:bg-gray-50 text-arw-navy border border-gray-200'
                          }
                        `}
                        disabled={!slot.available}
                      >
                        <p className="font-medium">{slot.time}</p>
                        <p className="text-xs mt-1">
                          {slot.available ? 'Available' : 'Booked'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {date && selectedTime && (
                <form onSubmit={handleSubmit} className="grid gap-4 animate-fade-in">
                  <h3 className="text-xl font-bold text-arw-navy mb-2">Your Details</h3>
                  
                  <div>
                    <label htmlFor="booking-name" className="block text-sm font-medium text-arw-navy mb-1">Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="booking-name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="booking-email" className="block text-sm font-medium text-arw-navy mb-1">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      id="booking-email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="booking-phone" className="block text-sm font-medium text-arw-navy mb-1">Phone <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      id="booking-phone"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="button-secondary w-full relative overflow-hidden"
                      disabled={isSubmitting}
                    >
                      <span className={`inline-block transition-all duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                        RESERVE NOW
                      </span>
                      {isSubmitting && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </AnimatedSection>
    </section>
  );
};

export default BookingCalendar;
