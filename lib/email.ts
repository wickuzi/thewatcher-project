// src/lib/email.ts
import emailjs from '@emailjs/nodejs';

const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const templateId = process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const publicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const privateKey = process.env.EMAILJS_PRIVATE_KEY || '';

interface SendEmailParams {
  username: string;  // Changed from to_name to match template
  to_email: string;
  message: string;
  subject: string;
  from_name?: string;
  reply_to?: string;
}

export const sendWelcomeEmail = async (params: SendEmailParams) => {
  // Validate configuration
  const missingConfig = [];
  if (!serviceId) missingConfig.push('EMAILJS_SERVICE_ID');
  if (!templateId) missingConfig.push('EMAILJS_TEMPLATE_ID');
  if (!publicKey) missingConfig.push('EMAILJS_PUBLIC_KEY');
  if (!privateKey) missingConfig.push('EMAILJS_PRIVATE_KEY');
  
  if (missingConfig.length > 0) {
    const errorMsg = `Missing EmailJS configuration: ${missingConfig.join(', ')}`;
    console.error(errorMsg);
    return { 
      success: false, 
      error: errorMsg
    };
  }

  // Validate input parameters
  if (!params.to_email || !params.to_email.trim()) {
    const errorMsg = 'Recipient email address is required';
    console.error(errorMsg);
    return {
      success: false,
      error: errorMsg
    };
  }

  try {
    const emailData = {
      ...params,
      // Make sure username is included for the template
      username: params.username,
      from_name: params.from_name || 'Tu Aplicación',
      reply_to: params.reply_to || 'noreply@tuaplicacion.com',
    };

    console.log('Sending email with data:', {
      serviceId: serviceId ? '***' : 'missing',
      templateId: templateId ? '***' : 'missing',
      emailData: {
        ...emailData,
        to_email: emailData.to_email ? '***' : 'missing',
      },
      hasPublicKey: !!publicKey,
      hasPrivateKey: !!privateKey
    });

    const response = await emailjs.send(
      serviceId,
      templateId,
      emailData,
      {
        publicKey,
        privateKey,
      }
    );
    
    console.log('Email sent successfully:', response);
    return { success: true, data: response };
  } catch (error: any) {
    let errorMessage = 'Unknown error';
    let errorDetails: any = {};
    
    if (error?.response) {
      // Handle EmailJS response errors
      errorMessage = error.response.text || error.message || 'Unknown EmailJS error';
      errorDetails = {
        status: error.response.status,
        text: error.response.text,
        headers: error.response.headers
      };
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    }
    
    console.error('Error al enviar el correo:', {
      error: errorMessage,
      serviceId: serviceId ? '***' : 'missing',
      templateId: templateId ? '***' : 'missing',
      hasPublicKey: !!publicKey,
      hasPrivateKey: !!privateKey,
      to_email: params.to_email ? '***' : 'missing',
      username: params.username ? '***' : 'not provided',
      details: errorDetails
    });
    
    return { 
      success: false, 
      error: `Failed to send email: ${errorMessage}`,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    };
  }
};