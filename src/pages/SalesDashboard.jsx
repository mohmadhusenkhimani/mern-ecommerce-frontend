import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import Loader from '../components/common/Loader';
import { formatPrice } from '../utils/helpers';
import { productAPI, orderAPI } from '../services';
import { useSelector } from 'react-redux';
import { dashboardAPI } from '../services';
import { getOrderStatusColor } from '../utils/helpers';

const SalesDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashboardRes, productsRes, ordersRes] = await Promise.all([
        dashboardAPI.getSales(),
        productAPI.getAll({ seller: user?._id, limit: 50 }),
        orderAPI.getSales(),
      ]);
      setStats(dashboardRes.data.stats);
      setProducts(productsRes.data.products);
      setOrders(ordersRes.data.orders);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Sales Dashboard</h1>
        <Link to="/manage-products/new" className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Product
        </Link>
      </div>

      <div className="flex gap-2 mb-8 border-b">
        {['overview', 'products', 'orders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold">{stats?.totalProducts}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-primary-600">{formatPrice(stats?.totalSales || 0)}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600">Items Sold</p>
              <p className="text-2xl font-bold">{stats?.totalItemsSold}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{stats?.totalOrders}</p>
            </div>
          </div>

          {stats?.lowStockProducts?.length > 0 && (
            <div className="card">
              <h3 className="font-bold mb-4 text-orange-600">Low Stock Alert</h3>
              <div className="space-y-2">
                {stats.lowStockProducts.map((p) => (
                  <div key={p._id} className="flex justify-between items-center py-2 border-b">
                    <span>{p.name}</span>
                    <span className="text-orange-600 font-medium">{p.stock} left</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'products' && (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3">Product</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/40'}
                        alt=""
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3">{formatPrice(product.price)}</td>
                  <td className="py-3">{product.stock}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link to={`/manage-products/edit/${product._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <FiEdit />
                      </Link>
                      <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-gray-600">No orders containing your products yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="card">
                <div className="flex justify-between mb-3">
                  <p className="font-semibold">{order.user?.name}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
                {order.orderItems.map((item, i) => (
                  <div key={i} className="text-sm text-gray-600">
                    {item.name} × {item.quantity} — {formatPrice(item.price * item.quantity)}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
