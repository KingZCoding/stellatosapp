import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  try {
    // Retrieve session
    const session = await getServerSession(req, res, authOptions);
    console.log('Session:', session);

    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized: No session found' });
    }

    const userId = session.user.id;

    switch (req.method) {
      case 'GET': {
        try {
          // Fetch the user's cart
          const cart = await prisma.cart.findMany({
            where: { userId },
            include: { Product: true },
          });
          console.log('Cart retrieved:', cart);
          return res.status(200).json(cart);
        } catch (error) {
          console.error('Error fetching cart:', error);
          return res
            .status(500)
            .json({ message: 'Failed to retrieve cart items' });
        }
      }

      case 'POST': {
        const { productId, quantity } = req.body;

        // Validate input
        if (!productId || typeof productId !== 'number') {
          return res.status(400).json({ message: 'Invalid product ID' });
        }
        if (!quantity || typeof quantity !== 'number') {
          return res.status(400).json({ message: 'Invalid quantity' });
        }

        try {
          // Upsert cart item
          await prisma.cart.upsert({
            where: { userId_productId: { userId, productId } },
            update: { quantity: { increment: quantity } },
            create: { userId, productId, quantity },
          });

          // Fetch updated cart
          const updatedCart = await prisma.cart.findMany({
            where: { userId },
          });
          console.log('Updated Cart:', updatedCart);
          return res.status(201).json(updatedCart);
        } catch (error) {
          console.error('Error adding/updating cart:', error);
          return res
            .status(500)
            .json({ message: 'Failed to add/update cart item' });
        }
      }

      case 'PUT': {
        const { productId, quantity } = req.body;

        // Validate input
        if (!productId || typeof productId !== 'number') {
          return res.status(400).json({ message: 'Invalid product ID' });
        }
        if (quantity < 0) {
          return res.status(400).json({ message: 'Quantity cannot be negative' });
        }

        try {
          if (quantity === 0) {
            // Remove item from cart if quantity is 0
            await prisma.cart.delete({
              where: { userId_productId: { userId, productId } },
            });
          } else {
            // Update cart item quantity
            await prisma.cart.update({
              where: { userId_productId: { userId, productId } },
              data: { quantity },
            });
          }

          // Fetch updated cart
          const updatedCart = await prisma.cart.findMany({
            where: { userId },
          });
          console.log('Updated Cart:', updatedCart);
          return res.status(200).json(updatedCart);
        } catch (error) {
          console.error('Error updating cart:', error);
          return res
            .status(500)
            .json({ message: 'Failed to update cart item' });
        }
      }

      case 'DELETE': {
        const { productId } = req.body;

        // Validate input
        if (!productId || typeof productId !== 'number') {
          return res.status(400).json({ message: 'Invalid product ID' });
        }

        try {
          // Delete cart item
          await prisma.cart.delete({
            where: { userId_productId: { userId, productId } },
          });

          // Fetch updated cart
          const updatedCart = await prisma.cart.findMany({
            where: { userId },
          });
          console.log('Updated Cart after delete:', updatedCart);
          return res.status(200).json(updatedCart);
        } catch (error) {
          console.error('Error deleting cart item:', error);
          return res
            .status(500)
            .json({ message: 'Failed to delete cart item' });
        }
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res
          .status(405)
          .end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in /api/cart:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
