import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import SalesDashboard from './pages/SalesDashboard';
import ManageProducts from './pages/ManageProducts';
import ManageProductsList from "./pages/ManageProductsList";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<Orders />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
          </Route>
{/* 
          <Route element={<ProtectedRoute allowedRoles={['sales_person', 'admin']} />}>
            <Route path="sales/dashboard" element={<SalesDashboard />} />
            <Route path="manage-products" element={<SalesDashboard />} />
            <Route path="manage-products/new" element={<ManageProducts />} />
            <Route path="manage-products/edit/:id" element={<ManageProducts />} />
          </Route> */}

        <Route element={<ProtectedRoute allowedRoles={['sales_person', 'admin']} />}>
          <Route path="sales/dashboard" element={<SalesDashboard />} />
          <Route path="manage-products" element={<ManageProductsList />} />
          <Route path="manage-products/new" element={<ManageProducts />} />
          <Route path="manage-products/edit/:id" element={<ManageProducts />} />
        </Route>
                </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
}

export default App;
