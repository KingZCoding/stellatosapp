import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  // Validate request payload
  if (!name || !email || !password) {
    console.error('Missing fields in request body:', { name, email, password });
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    if (typeof password !== 'string') {
      console.error('Invalid password format:', password);
      return res.status(400).json({ message: 'Invalid password format' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error in sign-up process:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
