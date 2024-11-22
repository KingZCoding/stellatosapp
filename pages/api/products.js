export default function handler(req, res) {
  const products = [
    { id: 1, name: "Apples", price: 2.99, category: "Fruits" },
    { id: 2, name: "Oranges", price: 3.49, category: "Fruits" },
    { id: 3, name: "Tomatoes", price: 1.99, category: "Vegetables" },
    { id: 4, name: "Milk", price: 2.49, category: "Dairy" },
  ];

  res.status(200).json(products);
}
