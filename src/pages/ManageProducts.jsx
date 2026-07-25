import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiArrowLeft } from 'react-icons/fi';
import Loader from '../components/common/Loader';
import { CATEGORIES } from '../utils/helpers';
import { productAPI } from '../services';
import { useSelector } from 'react-redux';

const ManageProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [images, setImages] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await productAPI.getOne(id);
      reset({
        name: data.product.name,
        description: data.product.description,
        price: data.product.price,
        category: data.product.category,
        brand: data.product.brand,
        stock: data.product.stock,
      });
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/manage-products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, images: images.length > 0 ? images : undefined };

      if (isEdit) {
        await productAPI.update(id, payload);
        toast.success('Product updated successfully');
      } else {
        await productAPI.create(payload);
        toast.success('Product created successfully');
      }
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/sales/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* <Link to="/sales/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6">
        <FiArrowLeft /> Back to Dashboard
      </Link> */}

      <Link
        to={user?.role === "admin" ? "/admin/dashboard" : "/sales/dashboard"}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6"
      >
        <FiArrowLeft /> Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-8">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="input-field"
            placeholder="Product name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className="input-field"
            placeholder="Product description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price (₹)</label>
            <input
              type="number"
              {...register('price', { required: 'Price is required', min: 0 })}
              className="input-field"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stock</label>
            <input
              type="number"
              {...register('stock', { required: 'Stock is required', min: 0 })}
              className="input-field"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select {...register('category', { required: 'Category is required' })} className="input-field">
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <input
              {...register('brand', { required: 'Brand is required' })}
              className="input-field"
              placeholder="Brand name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Product Images {isEdit && '(leave empty to keep existing)'}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="input-field"
          />
          <p className="text-xs text-gray-500 mt-1">Upload up to 5 images (max 5MB each)</p>
        </div>

        <button type="submit" className="w-full btn-primary">
          {isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default ManageProducts;
