import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export default async function handler(req, res) {
  console.log('Request body:', req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verifiedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${verificationToken}`;

    // Send verification email
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

    return res.status(201).json({
      message: 'Account created successfully. Please verify your email.',
      success: true
    });

  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ 
      message: 'Internal server error.',
      success: false
    });
  }
}
