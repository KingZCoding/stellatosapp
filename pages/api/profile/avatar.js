import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle file uploads
  },
};

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const avatarDir = path.join(process.cwd(), 'public', 'avatars');

    // Ensure the avatar directory exists
    if (!fs.existsSync(avatarDir)) {
      fs.mkdirSync(avatarDir, { recursive: true });
    }

    const userId = session.user.id;
    const fileName = `${userId}-${Date.now()}.png`; // Unique file name based on user ID and timestamp
    const filePath = path.join(avatarDir, fileName);

    // Write file to the avatars directory
    const writeStream = fs.createWriteStream(filePath);
    req.pipe(writeStream);

    writeStream.on('finish', async () => {
      // Update user's avatar in the database
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { image: `/avatars/${fileName}` }, // Save path relative to `public`
      });

      return res.status(200).json({
        message: 'Avatar updated successfully!',
        user: updatedUser,
      });
    });

    writeStream.on('error', (err) => {
      console.error('Error writing file:', err);
      return res.status(500).json({ message: 'Error uploading avatar' });
    });
  } catch (error) {
    console.error('Error handling avatar upload:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
