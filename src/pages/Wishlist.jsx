import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { fetchWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Loader from '../components/common/Loader';
import { formatPrice } from '../utils/helpers';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error);
    }
  };

  if (loading && products.length === 0) return <Loader fullScreen />;

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <FiHeart size={48} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-gray-600 mb-8">Save items you love for later</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="card p-0 overflow-hidden">
            <Link to={`/products/${product._id}`}>
              <img
                src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </Link>
            <div className="p-4">
              <Link to={`/products/${product._id}`} className="font-semibold hover:text-primary-600 line-clamp-2">
                {product.name}
              </Link>
              <p className="text-primary-600 font-bold mt-2">{formatPrice(product.price)}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  className="btn-primary flex-1 text-sm"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(product._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
