'use client';

import { useState, useEffect } from 'react';
import '../../styles/cart.css';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      setCart(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateCart = async (productId, quantity) => {
    try {
      const method = quantity === 0 ? 'DELETE' : 'PUT';
      const response = await fetch('/api/cart', {
        method,
        headers: { 'Content-Type': 'application/json', 'user-id': '12345' },
        body: JSON.stringify({ productId, quantity }),
      });
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return <p>Loading your cart...</p>;
  }

  return (
    <div className="cart-page-container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. Add some items to place an order.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.productId} className="cart-item">
              <strong>{item.name}</strong> - ${item.price.toFixed(2)} x{' '}
              {item.quantity}
              <div>
                <button
                  onClick={() => updateCart(item.productId, item.quantity - 1)}
                >
                  -
                </button>
                <button
                  onClick={() => updateCart(item.productId, item.quantity + 1)}
                >
                  +
                </button>
                <button onClick={() => updateCart(item.productId, 0)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
