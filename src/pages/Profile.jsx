import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getMe } from '../redux/slices/authSlice';
import { getRoleLabel } from '../utils/helpers';
import { userAPI } from '../services';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { register: registerProfile, handleSubmit: handleProfileSubmit } = useForm();
  const { register: registerAddress, handleSubmit: handleAddressSubmit, reset: resetAddress } = useForm();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const onUpdateProfile = async (data) => {
    try {
      await userAPI.updateProfile(data);
      dispatch(getMe());
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const onAddAddress = async (data) => {
    try {
      await userAPI.addAddress({ ...data, isDefault: data.isDefault === 'true' });
      dispatch(getMe());
      resetAddress();
      setShowAddressForm(false);
      toast.success('Address added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add address');
    }
  };

  const onDeleteAddress = async (addressId) => {
    try {
      await userAPI.deleteAddress(addressId);
      dispatch(getMe());
      toast.success('Address deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="space-y-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Account Information</h2>
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p><span className="text-gray-600">Role:</span> <span className="font-medium">{getRoleLabel(user.role)}</span></p>
          </div>
          <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                defaultValue={user.name}
                {...registerProfile('name')}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                defaultValue={user.email}
                {...registerProfile('email')}
                className="input-field"
              />
            </div>
            <button type="submit" className="btn-primary">Update Profile</button>
          </form>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Saved Addresses</h2>
            <button onClick={() => setShowAddressForm(!showAddressForm)} className="btn-outline text-sm">
              {showAddressForm ? 'Cancel' : 'Add Address'}
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddressSubmit(onAddAddress)} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input {...registerAddress('fullName', { required: true })} placeholder="Full Name" className="input-field" />
                <input {...registerAddress('phone', { required: true })} placeholder="Phone" className="input-field" />
                <input {...registerAddress('addressLine1', { required: true })} placeholder="Address Line 1" className="input-field md:col-span-2" />
                <input {...registerAddress('addressLine2')} placeholder="Address Line 2" className="input-field md:col-span-2" />
                <input {...registerAddress('city', { required: true })} placeholder="City" className="input-field" />
                <input {...registerAddress('state', { required: true })} placeholder="State" className="input-field" />
                <input {...registerAddress('postalCode', { required: true })} placeholder="Postal Code" className="input-field" />
                <select {...registerAddress('isDefault')} className="input-field" defaultValue="false">
                  <option value="false">Not Default</option>
                  <option value="true">Set as Default</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">Save Address</button>
            </form>
          )}

          {user.addresses?.length === 0 ? (
            <p className="text-gray-600">No addresses saved yet.</p>
          ) : (
            <div className="space-y-3">
              {user.addresses.map((address) => (
                <div key={address._id} className="flex justify-between items-start p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">
                      {address.fullName}
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">Default</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {address.addressLine1}, {address.city}, {address.state} - {address.postalCode}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteAddress(address._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
