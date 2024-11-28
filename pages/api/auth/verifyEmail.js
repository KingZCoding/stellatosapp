import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token) {
    console.error('No token provided in query.');
    return res.status(400).json({ message: 'Verification token is required.' });
  }

  try {
    console.log('Received token:', token);

    // Find the user using the token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      console.error('Invalid or expired token.');
      return res.status(404).json({ message: 'Invalid or expired token.' });
    }

    // Ensure the user hasn't already been verified
    if (user.verifiedAt) {
      console.log('User is already verified.');
      return res
        .status(400)
        .json({ message: 'This email has already been verified.' });
    }

    // Update the user to mark them as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        verifiedAt: new Date(), // Mark as verified
        verificationToken: null, // Clear the token after successful verification
      },
    });

    console.log(`User with ID ${updatedUser.id} successfully verified.`);

    // Redirect the user to the login page (or any success page)
    res.writeHead(302, { Location: '/auth' });
    res.end();
  } catch (error) {
    console.error('Error in verifyEmail handler:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
}
