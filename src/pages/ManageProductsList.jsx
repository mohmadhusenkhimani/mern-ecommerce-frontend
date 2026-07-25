import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

import Loader from "../components/common/Loader";
import { productAPI } from "../services";
import { formatPrice } from "../utils/helpers";


const ManageProductsList = () => {
  const { user } = useSelector((state) => state.auth);

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      let response;

      if (user?.role === "admin") {
        response = await productAPI.getAll({
          limit: 100,
        });
      } else {
        response = await productAPI.getAll({
          seller: user?._id,
          limit: 100,
        });
      }

      setProducts(response.data.products || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
  !window.confirm(
    "Are you sure you want to permanently delete this product?"
  )
)
  return;

    try {
      await productAPI.delete(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">

  <div>
   <h1 className="text-3xl font-bold">
  📦 Product Management
</h1>

    <p className="text-gray-500">
  Total Products : <b>{products.length}</b>
</p>

    <p className="text-gray-500 mt-2">
      {user?.role === "admin"
        ? "Manage all products"
        : "Manage your products"}
    </p>
  </div>

  <Link
    to="/manage-products/new"
    className="btn-primary flex items-center gap-2"
  >
    <FiPlus />
    Add Product
  </Link>

</div>
<div className="mb-6">
  <input
    type="text"
    placeholder="Search product by name..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full md:w-96 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

<div className="mb-6">
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
    <h3 className="text-lg font-semibold text-blue-700">
      Total Products
    </h3>
    <p className="text-3xl font-bold text-blue-900">
      {products.length}
    </p>
  </div>
</div>

        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">

  <table className="min-w-full divide-y divide-gray-200">

    <thead className="bg-blue-600 text-white">

      <tr>

        <th className="px-6 py-3 text-center">No.</th>
<th className="px-6 py-3 text-left">Image</th>

        <th className="px-6 py-3 text-left">Product</th>

      <th className="px-6 py-3 text-left">Category</th>

<th className="px-6 py-3 text-left">Brand</th>

<th className="px-6 py-3 text-left">Price</th>

        <th className="px-6 py-3 text-left">Stock</th>
<th className="px-6 py-3 text-left">Created</th>

       {user?.role === "admin" && (
  <th className="px-6 py-3 text-left">
    Seller
  </th>
)}

<th className="px-6 py-3 text-center">
  Actions
</th>

      </tr>

    </thead>

    <tbody>

      {products.length === 0 ? (

        <tr>

          <td
  colSpan="6"
  className="text-center py-8"
>
  <div className="py-10">

    <h2 className="text-2xl font-semibold text-gray-700">
      No Products Found
    </h2>

    <p className="text-gray-500 mt-2">
      Create your first product by clicking Add Product.
    </p>

  </div>
</td>

        </tr>

      ) : (

        products
  .filter((product) =>
    product.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  )
  .map((product, index) => (
<tr
  key={product._id}
  className="border-b hover:bg-blue-50 transition duration-200"
>

  <td className="px-6 py-4 text-center">
    {index + 1}
  </td>
  <td className="px-6 py-4">
    <img
      src={
        product.images?.[0]?.url ||
        "https://via.placeholder.com/60"
      }
      alt={product.name}
      className="w-16 h-16 rounded-lg object-cover border shadow-sm"
    />
  </td>

  <td className="px-6 py-4 font-medium">
    {product.name}
  </td>

  <td className="px-6 py-4">
  {product.category}
</td>

<td className="px-6 py-4">
  {product.brand}
</td>

<td className="px-6 py-4">
  {formatPrice(product.price)}
</td>

 <td className="px-6 py-4">
  {product.stock > 10 ? (
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
      {product.stock} In Stock
    </span>
  ) : product.stock > 0 ? (
    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
      {product.stock} Low Stock
    </span>
  ) : (
    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
      Out of Stock
    </span>
  )}
</td>
<td className="px-6 py-4">
  {new Date(product.createdAt).toLocaleDateString()}
</td>
  {user?.role === "admin" && (
  <td className="px-6 py-4">
    {product.seller?.name || "N/A"}
  </td>
)}


  <td className="px-6 py-4">

    <div className="flex justify-center gap-2">

      <Link
        to={`/manage-products/edit/${product._id}`}
        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
      >
        <FiEdit />
      </Link>

      <button
        onClick={() => handleDelete(product._id)}
        className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
      >
        <FiTrash2 />
      </button>

    </div>

  </td>

</tr>

        ))

      )}

    </tbody>

  </table>
</div>

<div className="mt-6 flex justify-between items-center">

  <p className="text-gray-500">
    Showing {products.length} Products
  </p>

  <Link
    to="/manage-products/new"
    className="btn-primary"
  >
    + Add New Product
  </Link>

</div>

    </div>
  );
};

export default ManageProductsList;