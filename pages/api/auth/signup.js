import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // Check if the email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique verification token
    const verificationToken = Math.random().toString(36).substr(2, 12);

    // Create the user in the database with null verifiedAt
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verifiedAt: null, // Explicitly set verifiedAt to null until verification
      },
    });

    // Set up the Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service provider
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
      subject: 'Verify Your Email - Stellatos Market',
      html: `
        <h1>Welcome to Stellatos Market, ${name}!</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>If you did not sign up, you can safely ignore this email.</p>
      `,
    });

    res.status(201).json({ message: 'User created successfully. Please verify your email.' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
}
