import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { formatPrice } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
    >
      <Link to={`/products/${product._id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <p className="text-xs text-primary-600 font-medium uppercase tracking-wide">
            {product.category}
          </p>
          <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-primary-600">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mt-2">
            <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
            <span className="text-sm text-gray-600">
              {product.ratings?.toFixed(1) || '0.0'} ({product.numReviews || 0})
            </span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.stock <= 0 ? (
              <span className="text-xs text-red-500 font-medium">Out of Stock</span>
            ) : (
              <span className="text-xs text-green-600 font-medium">In Stock</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
