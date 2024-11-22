import prisma from '../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  const userId = session?.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await prisma.cart.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId, productId, quantity },
  });

  try {
    switch (req.method) {
      case 'GET': {
        const cart = await prisma.cart.findMany({
          where: { userId },
          include: { Product: true },
        });
        return res.status(200).json(cart);
      }

      case 'POST': {
        const { productId, quantity } = req.body;
        await prisma.cart.upsert({
          where: { userId_productId: { userId, productId } },
          update: { quantity: { increment: quantity } },
          create: { userId, productId, quantity },
        });
        const updatedCart = await prisma.cart.findMany({ where: { userId } });
        return res.status(201).json(updatedCart);
      }

      case 'PUT': {
        const { productId, quantity } = req.body;
        if (quantity <= 0) {
          await prisma.cart.delete({
            where: { userId_productId: { userId, productId } },
          });
        } else {
          await prisma.cart.update({
            where: { userId_productId: { userId, productId } },
            data: { quantity },
          });
        }
        const updatedCart = await prisma.cart.findMany({ where: { userId } });
        return res.status(200).json(updatedCart);
      }

      case 'DELETE': {
        const { productId } = req.body;
        await prisma.cart.delete({
          where: { userId_productId: { userId, productId } },
        });
        const updatedCart = await prisma.cart.findMany({ where: { userId } });
        return res.status(200).json(updatedCart);
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
