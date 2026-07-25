import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { addToCart } from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';

const ProductActions = ({ product, showCart = true, showWishlist = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { products: wishlistProducts } = useSelector((state) => state.wishlist);

  const isInWishlist = wishlistProducts?.some((p) => p._id === product._id);
  const canShop = user?.role === 'user' || user?.role === 'admin';

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!canShop) {
      toast.info('Only customers can add items to cart');
      return;
    }
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!canShop) {
      toast.info('Only customers can use wishlist');
      return;
    }
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="flex gap-2">
      {showWishlist && canShop && (
        <button
          onClick={handleWishlist}
          className={`p-2 rounded-lg border transition-colors ${
            isInWishlist
              ? 'bg-red-50 border-red-200 text-red-500'
              : 'border-gray-200 hover:border-red-200 hover:text-red-500'
          }`}
        >
          <FiHeart size={20} className={isInWishlist ? 'fill-red-500' : ''} />
        </button>
      )}
      {showCart && canShop && (
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="btn-primary flex items-center gap-2 flex-1 justify-center"
        >
          <FiShoppingCart size={18} />
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductActions;
