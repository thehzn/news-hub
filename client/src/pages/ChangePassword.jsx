import { useState } from 'react';
import useAxios from '../hooks/axios';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
    const navigate = useNavigate();
    const axios =useAxios();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ loading: false, error: 'New passwords do not match.', success: '' });
      return;
    }

    try {
      const {data} = await axios.post(
      '/admin/changepass', 
      { 
        currentPassword: formData.currentPassword, 
        newPassword: formData.newPassword 
      },
     
    );
    if(data.success){
        setStatus({ loading: false, error: '', success: 'Password updated successfully!' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    
    }

      } catch (err) {
      setStatus({ 
        loading: false, 
        error: err.response?.data?.message || 'Something went wrong. Please try again.', 
        success: '' 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Change Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your current password and choose a new one.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        
          {status.error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
              {status.error}
            </div>
          )}
          {status.success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm border border-green-200">
              {status.success}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                name="currentPassword"
                type="password"
                required
                value={formData.currentPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                name="newPassword"
                type="password"
                required
                value={formData.newPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={status.loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                status.loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
            >
              {status.loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
           <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Discard and go back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}