import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../redux/slices/authSlice';
import { clearCartState } from '../../redux/slices/cartSlice';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { products: wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(clearCartState());
    navigate('/');
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
    }`;

  const canManageProducts = user?.role === 'admin' || user?.role === 'sales_person';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">ShopHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
            {canManageProducts && (
              <NavLink to="/manage-products" className={navLinkClass}>Manage Products</NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>
            )}
            {user?.role === 'sales_person' && (
              <NavLink to="/sales/dashboard" className={navLinkClass}>Dashboard</NavLink>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (user?.role === 'user' || user?.role === 'admin') && (
              <>
                <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-primary-600">
                  <FiHeart size={22} />
                  {wishlistItems?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600">
                  <FiShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <FiUser size={18} />
                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </div>
            )}

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              <NavLink to="/" end className={navLinkClass} onClick={() => setMobileOpen(false)}>Home</NavLink>
              <NavLink to="/products" className={navLinkClass} onClick={() => setMobileOpen(false)}>Products</NavLink>
              {canManageProducts && (
                <NavLink to="/manage-products" className={navLinkClass} onClick={() => setMobileOpen(false)}>Manage Products</NavLink>
              )}
              {user?.role === 'admin' && (
                <NavLink to="/admin/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>Admin</NavLink>
              )}
              {user?.role === 'sales_person' && (
                <NavLink to="/sales/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
              )}
              {isAuthenticated ? (
                <>
                  <NavLink to="/profile" className={navLinkClass} onClick={() => setMobileOpen(false)}>Profile</NavLink>
                  <NavLink to="/orders" className={navLinkClass} onClick={() => setMobileOpen(false)}>Orders</NavLink>
                  <button onClick={handleLogout} className="w-full btn-secondary text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block btn-outline text-center" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="block btn-primary text-center" onClick={() => setMobileOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
