import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch } from 'react-icons/fi';
import { fetchProducts, fetchCategories, setFilters, setPage } from '../redux/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import { CATEGORIES } from '../utils/helpers';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, page, pages, filters } = useSelector((state) => state.products);
  const [searchInput, setSearchInput] = useState(filters.keyword);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page,
      limit: 12,
      ...(filters.keyword && { keyword: filters.keyword }),
      ...(filters.category && { category: filters.category }),
      ...(filters.brand && { brand: filters.brand }),
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
    };
    dispatch(fetchProducts(params));
  }, [dispatch, page, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ keyword: searchInput }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="card h-fit">
          <h3 className="font-semibold mb-4">Filters</h3>

          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input-field pr-10"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FiSearch />
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <input
                type="text"
                placeholder="Filter by brand"
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-2">Min Price</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setSearchInput('');
                dispatch(setFilters({ keyword: '', category: '', brand: '', minPrice: '', maxPrice: '' }));
              }}
              className="w-full btn-secondary text-sm"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {loading ? (
            <Loader fullScreen />
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No products found</p>
              <p className="text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination
                page={page}
                pages={pages}
                onPageChange={(newPage) => {
                  dispatch(setPage(newPage));
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
