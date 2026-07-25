import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { fetchProduct, clearProduct } from '../redux/slices/productSlice';
import ProductActions from '../components/products/ProductActions';
import Loader from '../components/common/Loader';
import { formatPrice } from '../utils/helpers';
import { productAPI } from '../services';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product: productData, loading: productLoading } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(0);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    dispatch(fetchProduct(id));
    return () => dispatch(clearProduct());
  }, [dispatch, id]);

  const productItem = productData;
  const isLoading = productLoading;

  const onSubmitReview = async (data) => {
    if (!isAuthenticated) {
      toast.error('Please login to leave a review');
      return;
    }
    try {
      await productAPI.addReview(id, data);
      toast.success('Review submitted');
      reset();
      dispatch(fetchProduct(id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (isLoading) return <Loader fullScreen />;
  if (!productItem) return <div className="text-center py-16">Product not found</div>;

  const images = productItem.images?.length > 0
    ? productItem.images
    : [{ url: 'https://via.placeholder.com/500x500?text=No+Image' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
            <img
              src={images[selectedImage]?.url}
              alt={productItem.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-primary-600 font-medium uppercase text-sm">{productItem.category}</p>
          <h1 className="text-3xl font-bold mt-2">{productItem.name}</h1>
          <p className="text-gray-500 mt-1">Brand: {productItem.brand}</p>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={i < Math.round(productItem.ratings) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {productItem.ratings?.toFixed(1)} ({productItem.numReviews} reviews)
            </span>
          </div>

          <p className="text-3xl font-bold text-primary-600 mt-6">
            {formatPrice(productItem.price)}
          </p>

          <p className="text-gray-600 mt-4 leading-relaxed">{productItem.description}</p>

          <div className="mt-4">
            {productItem.stock > 0 ? (
              <span className="text-green-600 font-medium">{productItem.stock} in stock</span>
            ) : (
              <span className="text-red-500 font-medium">Out of stock</span>
            )}
          </div>

          <div className="mt-8">
            <ProductActions product={productItem} />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {isAuthenticated && (user?.role === 'user' || user?.role === 'admin') && (
          <form onSubmit={handleSubmit(onSubmitReview)} className="card mb-8 max-w-xl">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <select {...register('rating', { required: true })} className="input-field">
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                {...register('comment', { required: true })}
                rows={3}
                className="input-field"
                placeholder="Share your experience..."
              />
            </div>
            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        )}

        <div className="space-y-4">
          {productItem.reviews?.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          ) : (
            productItem.reviews?.map((review) => (
              <div key={review._id} className="card">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{review.name}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={14}
                        className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
