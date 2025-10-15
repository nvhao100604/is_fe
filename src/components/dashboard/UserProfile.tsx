'use client'
import React, { useState, useCallback } from 'react';
import { Button } from '../common/Button';
import { useAccount } from '../providers/ProtectedProvider';
import { userService } from '@/services/user.service';
import { TOASTIFY_ERROR, TOASTIFY_INFO, TOASTIFY_SUCCESS, useToastify } from '@/store/Toastify';

// =================================================================
// 1. INTERFACES - Định nghĩa kiểu dữ liệu dựa trên DTO của bạn
// =================================================================
interface IUserDTO {
  userId?: number;
  userName?: string;
  userGender?: 'MALE' | 'FEMALE' | 'OTHER';
  userDateOfBirth?: string; // Sử dụng string để dễ quản lý trong input type="date"
  userAddress?: string;
  userPhone?: string;
  userCreatedAt?: string;
  userUpdatedAt?: string;
}

interface IAccountDTO {
  accountId?: number;
  userId?: number;
  accountUsername?: string;
  accountEmail?: string;
  accountIsLocked?: boolean;
  accountLockedTime?: string;
  accountLastLogin?: string;
  accountCreatedAt?: string;
  accountUpdatedAt?: string;
}

// =================================================================
// 2. MAIN COMPONENT - UserProfile
// =================================================================
export const UserProfile = () => {
    const toastify = useToastify();
    const [isSaving, setIsSaving] = useState(false);
  const userContext = useAccount();

  // State để quản lý tab nào đang được chọn
  const [activeTab, setActiveTab] = useState<'user' | 'account'>('user');
  
  // State để quản lý trạng thái chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);

  // State để lưu trữ dữ liệu đang được chỉnh sửa
  const [editData, setEditData] = useState<{ user: IUserDTO; account: IAccountDTO }>({
    user: {
      userName: userContext.user?.userName,
      userGender: userContext.user?.userGender as IUserDTO['userGender'],
      userDateOfBirth: userContext.user?.userDateOfBirth,
      userAddress: userContext.user?.userAddress,
      userPhone: userContext.user?.userPhone,
    },
    account: {
      accountEmail: userContext.accountEmail,
      // Các trường account khác bạn có thể lấy từ context nếu có
    },
  });

  // =================================================================
  // 3. EVENT HANDLERS - Xử lý các sự kiện
  // =================================================================

  const handleSave = useCallback(async () => {
    // Bắt đầu quá trình lưu, bật trạng thái loading
    setIsSaving(true);

    try {
        if (activeTab === 'user') {
            // Log dữ liệu sẽ gửi đi để debug
            console.log('Attempting to save User data:', editData.user);

            // Gọi API để cập nhật user
            const response = await userService.updateUser(editData.user);

            // Kiểm tra kết quả từ API
            if (response && response.success) { // Giả sử API trả về { success: true, ... }
                toastify.notify("User information updated successfully!", TOASTIFY_SUCCESS );
                setIsEditing(false);
                // TODO: Cập nhật lại context hoặc state chính với dữ liệu mới nếu cần
            } else {
                // Ném lỗi nếu API trả về thất bại có chủ đích
                throw new Error(response.message || 'Failed to update user information.');
            }

        } else { // activeTab === 'account'
            // Log dữ liệu sẽ gửi đi để debug
            console.log('Attempting to save Account data:', editData.account);

            // TODO: Tạo một accountService tương tự như userService để gọi API cập nhật account
            // const response = await accountService.updateAccount(editData.account);
            // if (response && response.success) {
            //     toastify("Account information updated successfully!", { type: TOASTIFY_SUCCESS });
            //     setIsEditing(false);
            // } else {
            //     throw new Error(response.message || 'Failed to update account information.');
            // }

            // Code tạm thời trong khi chờ accountService
            toastify.notify("Account saving is not implemented yet.",  TOASTIFY_INFO );
              }
          } catch (error) {
              // Bắt lỗi từ API call hoặc lỗi mạng
              console.error("Failed to save data:", error);
              
              // Hiển thị thông báo lỗi cho người dùng
              const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
              toastify.notify(errorMessage, TOASTIFY_ERROR );

          } finally {
              // Dù thành công hay thất bại, luôn tắt trạng thái loading
              setIsSaving(false);
          }
      }, [activeTab, editData, toastify, setIsEditing, setIsSaving]); // <-- Thêm các dependency mới

  const handleCancel = useCallback(() => {
    // Reset lại dữ liệu về trạng thái ban đầu từ context
    setEditData({
      user: {
        userName: userContext.user?.userName,
        userGender: userContext.user?.userGender as IUserDTO['userGender'],
        userDateOfBirth: userContext.user?.userDateOfBirth,
        userAddress: userContext.user?.userAddress,
        userPhone: userContext.user?.userPhone,
      },
      account: {
        accountEmail: userContext.accountEmail,
      },
    });
    setIsEditing(false);
  }, [userContext]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, section: 'user' | 'account') => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  }, []);
  
  // =================================================================
  // 4. RENDER HELPER FUNCTIONS - Các hàm render UI phụ
  // =================================================================

  const renderInputField = (label: string, name: keyof IUserDTO | keyof IAccountDTO, value: any, section: 'user' | 'account', type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={(e) => handleChange(e, section)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[42px] flex items-center">{value || 'N/A'}</p>
      )}
    </div>
  );

  // =================================================================
  // 5. JSX TO RENDER - Giao diện chính của component
  // =================================================================

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Profile Management</h2>
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

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('user')}
            className={`${
              activeTab === 'user'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            User Information
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`${
              activeTab === 'account'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Account Information
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'user' && (
          // User DTO Tab
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-medium text-gray-800">User Details</h3>
            {renderInputField('Full Name', 'userName', editData.user.userName, 'user')}
            {renderInputField('Phone Number', 'userPhone', editData.user.userPhone, 'user')}
            {renderInputField('Address', 'userAddress', editData.user.userAddress, 'user')}
            {renderInputField('Date of Birth', 'userDateOfBirth', editData.user.userDateOfBirth, 'user', 'date')}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                {isEditing ? (
                    <select 
                        name="userGender" 
                        value={editData.user.userGender || ''} 
                        onChange={(e) => handleChange(e, 'user')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[42px] flex items-center">
                        {userContext.user?.userGender === 'MALE' ? 'Male' : userContext.user?.userGender === 'FEMALE' ? 'Female' : 'Other'}
                    </p>
                )}
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          // Account DTO Tab
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-medium text-gray-800">Account Details</h3>
            {/* {renderInputField('Email', 'accountEmail', editData.account.accountEmail, 'account', 'email')} */}
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{userContext.accountEmail}</p>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{userContext.accountUsername}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mr-2 ${userContext.accountIsLocked ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className={`text-sm font-medium ${userContext.accountIsLocked ? 'text-red-700' : 'text-green-700'}`}>
                    {userContext.accountIsLocked ? `Locked` : 'Active'}
                    {userContext.accountLockedTime && ` at ${new Date(userContext.accountLockedTime).toLocaleString()}`}
                    </span>
                </div>
            </div>
             {userContext.accountLastLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Login
                </label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {new Date(userContext.accountLastLogin).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex space-x-3 pt-4 border-t border-gray-200 mt-6">
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

// Thêm một chút CSS để có hiệu ứng chuyển tab mượt hơn
// Bạn có thể thêm vào file global CSS của mình
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
*/