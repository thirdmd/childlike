import { supabase } from './supabaseClient';

interface ContactMessageData {
  name: string;
  email: string;
  message: string;
}

interface WaitlistData {
  email: string;
  source?: string;
}

interface SubmissionResult {
  success: boolean;
  error?: string;
}

export async function submitContactMessage(data: ContactMessageData): Promise<SubmissionResult> {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: data.name,
          email: data.email,
          message: data.message,
        }
      ]);

    if (error) {
      console.error('Error submitting contact message:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit message'
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error submitting contact message:', err);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.'
    };
  }
}

export async function joinWaitlist(data: WaitlistData): Promise<SubmissionResult> {
  try {
    const { error } = await supabase
      .from('waitlist_signups')
      .insert([
        {
          email: data.email,
          source: data.source || 'contact_page',
        }
      ]);

    if (error) {
      console.error('Error joining waitlist:', error);
      return {
        success: false,
        error: error.message || 'Failed to join waitlist'
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error joining waitlist:', err);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.'
    };
  }
}
