import prisma from '../../../lib/prisma';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new verification token
    const verificationToken = Math.random().toString(36).substr(2, 12);

    // Update the user's token in the database
    await prisma.user.update({
      where: { email },
      data: { verificationToken },
    });

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construct the verification URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verifyEmail?token=${verificationToken}`;

    // Send the verification email
    await transporter.sendMail({
      from: `"Stellatos Market" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Resend Verification Email - Stellatos Market',
      html: `
        <h1>Verify Your Email</h1>
        <p>Hi ${user.name},</p>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>If you did not request this email, please ignore it.</p>
      `,
    });

    res.status(200).json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error in resendVerificationEmail:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
