// src/app/api/contact/route.ts
import { type NextRequest } from 'next/server';
import { unstable_after as after } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // Validation
  if (!name || !email || !message) {
    return Response.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    // Use the after function to perform non-blocking operations
    // after the response has been sent to the client
    after(async () => {
      // This would be where you'd actually send the email or save to a database
      console.log('Processing contact form submission from:', email);
      console.log(`From: ${name} <${email}>`);
      console.log(`Message: ${message}`);
      
      // In a real application, you'd call your email service or DB here
      // await sendEmail({to: 'your-email@example.com', from: email, subject: `Contact from ${name}`, body: message});
    });

    return Response.json(
      { success: true, message: 'Your message has been received' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return Response.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}