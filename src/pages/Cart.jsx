import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { fetchCart, updateCartItem, removeFromCart } from '../redux/slices/cartSlice';
import Loader from '../components/common/Loader';
import { formatPrice } from '../utils/helpers';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = async (productId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    try {
      await dispatch(updateCartItem({ productId, quantity: newQty })).unwrap();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error);
    }
  };

  if (loading && items.length === 0) return <Loader fullScreen />;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some products to get started</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product._id} className="card flex gap-4">
              <img
                src={item.product.images?.[0]?.url || 'https://via.placeholder.com/100'}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <Link to={`/products/${item.product._id}`} className="font-semibold hover:text-primary-600">
                  {item.product.name}
                </Link>
                <p className="text-primary-600 font-bold mt-1">{formatPrice(item.price)}</p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                      className="p-2 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="px-4 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                      className="p-2 hover:bg-gray-100"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <FiTrash2 size={16} /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 border-b pb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
          </div>
          <div className="flex justify-between mt-4 text-lg font-bold">
            <span>Total</span>
            <span className="text-primary-600">{formatPrice(totalAmount)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full btn-primary mt-6"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
