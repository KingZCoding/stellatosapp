'use client';

import { useState, useEffect } from 'react';
import CartItem from './CartItem';
import '../../styles/cart.css';

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []);

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. Add some items to place an order.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} setCart={setCart} />
          ))}
        </div>
      )}
    </div>
  );
}
