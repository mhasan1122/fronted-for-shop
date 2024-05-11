import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import your CSS file here

interface Product {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

const Product: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [product_name, setProductName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false); // Add this state variable

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8081/shop');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/shop', {
        product_name,
        quantity,
        price,
      });
      const newProduct: Product = response.data;
      setProducts([...products, newProduct]);
      setProductName('');
      setQuantity(0);
      setPrice(0);
      setShowAddPopup(false); // Close the popup after adding product
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Function to toggle the visibility of the Add Product popup
  const toggleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    try {
      const response = await axios.put(`http://localhost:8081/shop/${editingProduct.id}`, {
        product_name: editingProduct.product_name,
        quantity: editingProduct.quantity,
        price: editingProduct.price,
      });
      const updatedProduct: Product = response.data;
      const updatedProducts = products.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        product_name: e.target.value,
      });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        quantity: parseInt(e.target.value),
      });
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        price: parseFloat(e.target.value),
      });
    }
  };

  return (
    <div>
      <h1>Products</h1>
      <div>
        <h2>Add Product</h2>
        <button onClick={toggleAddPopup}>Add Product</button>
        {showAddPopup && ( // Conditionally render the popup
          <div className="popup">
            <form onSubmit={handleProductSubmit}>
              <label>
                Product Name:
                <input
                  type="text"
                  value={product_name}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </label> <br />
              <label>
                Quantity:
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </label> <br />
              <label>
                Price:
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                />
              </label>
              <button type="submit">Add</button>
            </form>
          </div>
        )}
      </div>
      <div>
        <h2>Product List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th> 
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  {editingProduct && editingProduct.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.product_name}
                      onChange={handleProductNameChange}
                    />
                  ) : (
                    product.product_name
                  )}
                </td>
                <td>
                  {editingProduct && editingProduct.id === product.id ? (
                    <input
                      type="number"
                      value={editingProduct.quantity}
                      onChange={handleQuantityChange}
                    />
                  ) : (
                    product.quantity
                  )}
                </td>
                <td>
                  {editingProduct && editingProduct.id === product.id ? (
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={handlePriceChange}
                    />
                  ) : (
                    product.price
                  )}
                </td>
                <td>
                  {editingProduct && editingProduct.id === product.id ? (
                    <button onClick={handleSaveEdit}>Save</button>
                  ) : (
                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;
