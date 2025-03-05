
import React, { useState } from 'react';
import { toast } from 'sonner';
import AnimatedSection from './AnimatedSection';

// Mock calendar data
const generateCalendarDays = () => {
  const days = [];
  const currentDate = new Date(2025, 2, 1); // March 1, 2025
  
  // Generate 14 days from March 1
  for (let i = 0; i < 14; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + i);
    
    // March 7 is Cyclone Alfred day
    const isCycloneDay = date.getDate() === 7 && date.getMonth() === 2;
    
    days.push({
      date,
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      weekday: date.toLocaleString('default', { weekday: 'short' }),
      slots: isCycloneDay ? [] : generateTimeSlots(date),
      isCycloneDay
    });
  }
  
  return days;
};

const generateTimeSlots = (date: Date) => {
  // Generate 8 time slots from 8:00 AM to 4:00 PM
  const slots = [];
  const startHour = 8;
  
  for (let i = 0; i < 8; i++) {
    const hour = startHour + i;
    slots.push({
      time: `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`.replace('0:00', '12:00'),
      available: Math.random() > 0.3 // 70% chance of being available
    });
  }
  
  return slots;
};

const BookingCalendar = () => {
  const calendarDays = generateCalendarDays();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !name || !phone) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success(`Appointment booked for ${selectedDate.toLocaleDateString()} at ${selectedTime}`);
      setSelectedDate(null);
      setSelectedTime(null);
      setName('');
      setPhone('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="booking" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 z-0"></div>
      
      <div className="section-container relative z-10">
        <AnimatedSection>
          <h2 className="section-heading text-center">BOOK YOUR SLOT</h2>
        </AnimatedSection>
        
        <AnimatedSection delay={200}>
          <p className="section-text text-center mb-12">
            Schedule a consultation or service—Cyclone Alfred prep slots are limited.
          </p>
        </AnimatedSection>
        
        <AnimatedSection delay={400} className="max-w-4xl mx-auto">
          <div className="glass-card">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-arw-navy mb-4">Select Date</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => !day.isCycloneDay && handleDateSelect(day.date)}
                    className={`
                      p-3 rounded-md text-center transition-all duration-300
                      ${day.isCycloneDay 
                        ? 'bg-red-100 text-red-800 cursor-not-allowed' 
                        : selectedDate && selectedDate.getTime() === day.date.getTime()
                          ? 'bg-arw-navy text-white ring-2 ring-arw-blue ring-offset-2'
                          : 'bg-white hover:bg-gray-50 text-arw-navy border border-gray-200'
                      }
                    `}
                    disabled={day.isCycloneDay}
                  >
                    <p className="text-xs font-medium">{day.weekday}</p>
                    <p className="text-lg font-bold my-1">{day.day}</p>
                    <p className="text-xs">{day.month}</p>
                    {day.isCycloneDay && (
                      <p className="text-xs mt-1 bg-red-200 rounded px-1 py-0.5">Cyclone Alfred</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {selectedDate && (
              <div className="mb-8 animate-fade-in">
                <h3 className="text-xl font-bold text-arw-navy mb-4">Select Time</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {calendarDays
                    .find(day => day.date.getTime() === selectedDate.getTime())?.slots
                    .map((slot, index) => (
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
                          {slot.available ? 'Available' : 'Unavailable'}
                        </p>
                      </button>
                    ))
                  }
                </div>
              </div>
            )}
            
            {selectedDate && selectedTime && (
              <form onSubmit={handleSubmit} className="grid gap-4 animate-fade-in">
                <h3 className="text-xl font-bold text-arw-navy mb-2">Your Details</h3>
                
                <div>
                  <label htmlFor="booking-name" className="block text-sm font-medium text-arw-navy mb-1">Name</label>
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
                  <label htmlFor="booking-phone" className="block text-sm font-medium text-arw-navy mb-1">Phone</label>
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
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default BookingCalendar;
