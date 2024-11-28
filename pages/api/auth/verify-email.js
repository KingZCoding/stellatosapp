import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.redirect('/auth?error=invalid_method');
  }

  const { token } = req.query;

  if (!token) {
    return res.redirect('/auth?error=missing_token');
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return res.redirect('/auth?error=invalid_token');
    }

    // Update user verification status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verifiedAt: new Date(),
        verificationToken: null,
        updatedAt: new Date(),
      },
    });

    return res.redirect('/auth?verified=true');
  } catch (error) {
    console.error('Verification error:', error);
    return res.redirect('/auth?error=verification_failed');
  }
}
