'use client';

export default function CartItem({ item, setCart }) {
  const handleRemove = async () => {
    try {
      const response = await fetch(`/api/cart/${item.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      setCart((prevCart) =>
        prevCart.filter((cartItem) => cartItem.id !== item.id)
      );
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleQuantityChange = async (quantity) => {
    if (quantity <= 0) {
      handleRemove();
      return;
    }

    try {
      const response = await fetch(`/api/cart/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item quantity');
      }

      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity } : cartItem
        )
      );
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  return (
    <div className="cart-item">
      <h3>{item.name}</h3>
      <p>Price: ${item.price.toFixed(2)}</p>
      <div className="quantity-controls">
        <button onClick={() => handleQuantityChange(item.quantity - 1)}>
          -
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => handleQuantityChange(item.quantity + 1)}>
          +
        </button>
      </div>
      <button onClick={handleRemove} className="remove-button">
        Remove
      </button>
    </div>
  );
}
