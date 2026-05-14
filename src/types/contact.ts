interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
//   newsletter_subscription?: boolean;
}

export class ContactService {
  private apiBaseUrl = 'http://localhost:8000/api';

  async sendMessage(contactData: ContactFormData): Promise<{ success: boolean; error?: string }> {
    // Validate contact data
    const validation = this.validateContactData(contactData);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    try {
      // Save contact to Django backend
      const response = await fetch(`${this.apiBaseUrl}/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject,
          message: contactData.message,
        //   newsletter_subscription: contactData.newsletter_subscription || false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error saving contact:', errorData);
        return {
          success: false,
          error: 'Failed to send message. Please try again.'
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Unexpected error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  private validateContactData(data: ContactFormData): { isValid: boolean; error?: string } {
    if (!data.name?.trim()) {
      return { isValid: false, error: 'Name is required' };
    }

    if (!data.email?.trim()) {
      return { isValid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { isValid: false, error: 'Please enter a valid email' };
    }

    if (!data.subject?.trim()) {
      return { isValid: false, error: 'Subject is required' };
    }

    if (!data.message?.trim()) {
      return { isValid: false, error: 'Message is required' };
    }

    if (data.message.trim().length < 10) {
      return { isValid: false, error: 'Message must be at least 10 characters long' };
    }

    if (data.message.trim().length > 5000) {
      return { isValid: false, error: 'Message must be less than 5000 characters' };
    }

    return { isValid: true };
  }

  // Utility methods for contact form
  getSubjectSuggestions(): string[] {
    return [
      'Project Inquiry',
      'Technical Support',
      'Business Partnership',
      'Freelance Opportunity',
      'General Question',
      'Bug Report',
      'Feature Request'
    ];
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  formatMessage(data: ContactFormData): string {
    return `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}


Sent: ${new Date().toISOString()}
    `.trim();
    }
    // The comment below was position above Sent: ${new Date().toISOString()}
    // Newsletter Subscription: ${data.newsletter_subscription ? 'Yes' : 'No'} 
}

// Export singleton instance
export const contactService = new ContactService();
