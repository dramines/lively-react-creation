
/**
 * Service for handling email operations
 */

const EMAIL_API_URL = 'https://tazart.tn/testemail.php';

interface EmailPayload {
  to: string;
  subject: string;
  content: string;
}

/**
 * Send email using the Tazart API
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param content - Email content
 * @returns Promise with the API response
 */
export const sendEmail = async (to: string, subject: string, content: string): Promise<any> => {
  try {
    const response = await fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to,
        subject,
        content
      } as EmailPayload)
    });

    if (!response.ok) {
      throw new Error(`Email sending failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Pre-configured email recipients based on client type
export const EMAIL_RECIPIENTS = {
  B2C: 'erzerino2@gmail.com',
  B2B: 'erzerino2@gmail.com'
};

/**
 * Format selected dates for email content
 * @param selectedDates - Array of selected date objects
 * @returns Formatted string with date selections
 */
export const formatSelectedDatesForEmail = (selectedDates: { id: string, name: string }[]): string => {
  if (!selectedDates.length) return 'Aucune date sélectionnée';
  
  return selectedDates.map(date => `- ${date.name}`).join('\n');
};
