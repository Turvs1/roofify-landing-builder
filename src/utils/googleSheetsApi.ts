
/**
 * Utility for sending data to Google Sheets
 */

// The URL with the provided Google Apps Script ID
const SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbyYPBAvBCS7CMBe_pP0zp6wRMnQ7iV6ANFes1AE60crAgAVPsW_gaUyBHaS_vuxiTwytA/exec";

interface BookingData {
  name: string;
  phone: string;
  date: string;
  time: string;
}

export const sendToGoogleSheets = async (bookingData: BookingData): Promise<boolean> => {
  try {
    // Using no-cors mode as Google Apps Script typically returns CORS errors
    // This means we won't get a proper response object to check status
    const response = await fetch(SHEETS_API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });
    
    // Since we're using no-cors, we won't get a proper response to check
    // We're assuming it worked if no error was thrown
    return true;
  } catch (error) {
    console.error("Error sending data to Google Sheets:", error);
    return false;
  }
};
