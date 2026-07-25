import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchCart, clearCartState } from "../redux/slices/cartSlice";
import { getMe } from "../redux/slices/authSlice";
import Loader from "../components/common/Loader";
import { formatPrice } from "../utils/helpers";
import { orderAPI, paymentAPI } from "../services";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart || {});
  const auth = useSelector((state) => state.auth || {});

  const items = Array.isArray(cart.items) ? cart.items : [];
  const totalAmount = cart.totalAmount || 0;

  const user = auth.user || null;

  const addresses = Array.isArray(user?.addresses)
    ? user.addresses
    : [];

  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress =
        addresses.find((a) => a.isDefault) || addresses[0];

      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      }
    }
  }, [addresses]);

  useEffect(() => {
    if (cart.loading) return;

    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items, cart.loading, navigate]);

  if (!user) {
    return <Loader fullScreen />;
  }

  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    const address = addresses.find(
      (a) => a._id === selectedAddress
    );

    if (!address) {
      toast.error("Please select a valid address");
      return;
    }

    setLoading(true);

    try {
      const { data: orderData } = await orderAPI.create({
        shippingAddress: address,
      });

      const orderId = orderData.order._id;

      const { data: paymentData } =
        await paymentAPI.createOrder({
          orderId,
        });

      const razorpay = new window.Razorpay({
        key: paymentData.key,
        amount: paymentData.razorpayOrder.amount,
        currency: paymentData.razorpayOrder.currency,
        order_id: paymentData.razorpayOrder.id,
        name: "ShopHub",
        description: "Order Payment",

        handler: async (response) => {
          try {
            await paymentAPI.verify({
              razorpay_order_id:
                response.razorpay_order_id,
              razorpay_payment_id:
                response.razorpay_payment_id,
              razorpay_signature:
                response.razorpay_signature,
              orderId,
            });

            dispatch(clearCartState());

            toast.success("Payment Successful");

            navigate("/orders");
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: user.name,
          email: user.email,
        },

        theme: {
          color: "#2563eb",
        },
      });

      razorpay.open();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Payment Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">

          <div className="card mb-6">

            <h2 className="text-xl font-bold mb-4">
              Shipping Address
            </h2>

            {addresses.length === 0 ? (
              <>
                <p>No address found.</p>

                <button
                  onClick={() => navigate("/profile")}
                  className="btn-outline mt-3"
                >
                  Add Address
                </button>
              </>
            ) : (
              addresses.map((address) => (
                <label
                  key={address._id}
                  className="block border rounded-lg p-4 mb-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={
                      selectedAddress === address._id
                    }
                    onChange={() =>
                      setSelectedAddress(address._id)
                    }
                  />

                  <span className="ml-2">
                    {address.fullName}
                  </span>

                  <p className="text-sm text-gray-600">
                    {address.addressLine1},{" "}
                    {address.city},{" "}
                    {address.state}
                  </p>
                </label>
              ))
            )}

          </div>

          <div className="card">

            <h2 className="text-xl font-bold mb-4">
              Order Items
            </h2>

            {items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between py-3 border-b"
                >
                  <div>
                    <p>{item.product.name}</p>

                    <small>
                      Qty : {item.quantity}
                    </small>
                  </div>

                  <strong>
                    {formatPrice(
                      item.price * item.quantity
                    )}
                  </strong>
                </div>
              ))
            )}

          </div>

        </div>

        <div className="card h-fit">

          <h2 className="text-xl font-bold mb-4">
            Payment Summary
          </h2>

          <div className="flex justify-between mb-3">
            <span>Total</span>

            <strong>
              {formatPrice(totalAmount)}
            </strong>
          </div>

          <button
            onClick={handlePayment}
            disabled={
              loading || !selectedAddress
            }
            className="btn-primary w-full"
          >
            {loading
              ? "Processing..."
              : "Pay with Razorpay"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Checkout;