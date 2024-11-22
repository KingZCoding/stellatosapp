'use client';

export default function ProductCard({ product }) {
  const addToCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Could not add to cart. Please try again.');
    }
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>Price: ${product.price.toFixed(2)}</p>
      <button onClick={addToCart} className="add-to-cart-button">
        Add to Cart
      </button>
    </div>
  );
}
