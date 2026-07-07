import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../utils/api';

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    gender: '',
    stock: ''
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return alert('Please select an image');

    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('gender', formData.gender);
    data.append('stock', formData.stock);
    data.append('image', image);

    try {
      const res = await fetch(getApiUrl('/api/products'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        body: data
      });

      const responseData = await res.json();

      if (res.ok) {
        alert('Product created successfully!');
        navigate('/shop');
      } else {
        alert(responseData.message || 'Error creating product');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <h2 style={{ color: '#f97316', marginBottom: '20px' }}>
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          required
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="description"
          placeholder="Description"
          required
          rows="4"
          value={formData.description}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          required
          value={formData.price}
          onChange={handleChange}
          style={inputStyle}
        />

        <select
          name="category"
          required
          value={formData.category}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Select Category</option>
          <option value="shirt">Shirt</option>
          <option value="t-shirt">T-Shirt</option>
          <option value="hoodie">Hoodie</option>
          <option value="pants">Pants</option>
          <option value="shoes">Shoes</option>
          <option value="jacket">Jacket</option>
        </select>

        <select
          name="gender"
          required
          value={formData.gender}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Select Gender</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
        </select>

        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          required
          value={formData.stock}
          onChange={handleChange}
          style={inputStyle}
        />

        <div style={uploadBoxStyle}>
          <label style={{ display: 'block', marginBottom: '10px', color: '#a1a1aa' }}>
            Upload Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImage(e.target.files[0])}
            style={{ color: '#fff' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn"
          style={{ marginTop: '10px' }}
        >
          {loading ? 'Uploading & Creating...' : 'Publish Product'}
        </button>
      </form>
    </div>
  );
};

const pageStyle = {
  maxWidth: '600px',
  margin: '40px auto',
  background: '#18181b',
  padding: '40px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.05)'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const inputStyle = {
  padding: '12px',
  background: '#09090b',
  border: '1px solid #27272a',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '15px',
  outline: 'none'
};

const uploadBoxStyle = {
  padding: '15px',
  border: '1px dashed #f97316',
  borderRadius: '8px'
};

export default AddProduct;