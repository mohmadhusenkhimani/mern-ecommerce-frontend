import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/common/Loader';
import { formatPrice, formatDate, getOrderStatusColor } from '../utils/helpers';
import { orderAPI } from '../services';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getMy();
      setOrders(data.orders);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-gray-600 mb-8">Start shopping to see your orders here</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="card">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Order ID: {order._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img
                    src={item.image || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">
                  Deliver to: {order.shippingAddress.fullName}, {order.shippingAddress.city}
                </p>
              </div>
              <p className="text-lg font-bold text-primary-600">
                Total: {formatPrice(order.totalAmount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
