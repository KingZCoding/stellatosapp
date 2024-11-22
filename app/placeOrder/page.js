'use client';

import { useState, useEffect } from 'react';
import '../../styles/placeOrder.css';
import { Container, Card, Button, Form } from 'react-bootstrap';

export default function PlaceOrderPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);

  // Custom notification function
  const showNotification = (message) => {
    const notificationContainer = document.getElementById(
      'notification-container'
    );

    if (notificationContainer) {
      const notification = document.createElement('div');
      notification.className = 'custom-notification';
      notification.innerText = message;

      notificationContainer.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000); // Remove notification after 3 seconds
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(data.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
        setProducts(data);

        // Initialize quantities for each product
        const initialQuantities = {};
        data.forEach((product) => {
          initialQuantities[product.id] = 1; // Default quantity is 1
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  const addToCart = async (product) => {
    const quantity = quantities[product.id] || 1;
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const updatedCart = await response.json();
      setCart(updatedCart); // Optional: Update local state if needed
      showNotification(`${product.name} (${quantity}) added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Could not add to cart. Please try again.');
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : [];

  return (
    <div className="place-order-container">
      {/* Notification container */}
      <div id="notification-container" className="notification-container"></div>

      <h1 className="text-center">Place Your Order</h1>

      {/* Category Buttons */}
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${
              selectedCategory === category ? 'active' : ''
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Display */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <h3>{product.name}</h3>
            <p>Price: ${product.price.toFixed(2)}</p>
            <Form.Group className="quantity-group">
              <Form.Label>Quantity:</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantities[product.id] || 1}
                onChange={(e) =>
                  handleQuantityChange(
                    product.id,
                    parseInt(e.target.value) || 1
                  )
                }
              />
            </Form.Group>
            <button
              className="add-to-cart-button"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {selectedCategory && filteredProducts.length === 0 && (
        <p className="text-center no-products-message">
          No products available in this category.
        </p>
      )}
    </div>
  );
}
