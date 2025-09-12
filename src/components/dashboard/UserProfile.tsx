'use client'
import React, { useState } from 'react';
import { Button } from '../common/Button';
import { useAccount } from '../providers/ProtectedProvider';

export const UserProfile = () => {
  const user = useAccount()
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user.user?.userName,
    phone: user.user?.userPhone,
    email: user.accountEmail
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving user data:', editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      fullName: user.user?.userName,
      phone: user.user?.userPhone,
      email: user.accountEmail
    });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        {!isEditing && (
          <Button
            variant="secondary"
            onClick={() => setIsEditing(true)}
            className="text-sm px-4 py-2"
          >
            Edit
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.user?.userName?.charAt(0).toUpperCase()}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="fullName"
              value={editData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.user?.userName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.accountUsername}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={editData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.accountEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
            {user.user?.userGender === 'MALE' ? 'Male' : user.user?.userGender === 'FEMALE' ? 'Female' : 'Other'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Status
          </label>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${user.accountIsLocked ? 'bg-red-500' : 'bg-green-500'
              }`}></div>
            <span className={`text-sm font-medium ${user.accountIsLocked ? 'text-red-700' : 'text-green-700'
              }`}>
              {user.accountIsLocked ? 'Locked' : 'Active'}
            </span>
          </div>
        </div>

        {user.accountLastLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Login
            </label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
              {new Date(user.accountLastLogin).toLocaleString()}
            </p>
          </div>
        )}

        {isEditing && (
          <div className="flex space-x-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button variant="secondary" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};