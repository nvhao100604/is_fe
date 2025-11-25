'use client'
import { PageDTO, tempData } from "@/types/response/page.response.dto";
import { TrustDeviceDTO } from "@/types/response/trust_device.response.dto";
import { trustDeviceServices } from "@/services/trust_device.service";
import { tempTrustDevice, TrustDeviceQuery } from "@/types/api";
import React, { useEffect, useState } from "react";
import { AttemptsPagination } from "./loginAttempts/loginAttempts.components";
import { FormatDate } from "@/utils";

export default function TrustDevicesDashboard() {
  const [data, setData] = useState<PageDTO<TrustDeviceDTO> | null>(null)
  const [filters, setFilters] = useState<TrustDeviceQuery>(tempTrustDevice)
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { content: devices, totalPages, totalElements } = data ?? tempData
  const [error, setError] = useState<string | null>(null);
  // Fetch data from API
  useEffect(() => {
    applyFilter()
  }, [])

  const applyFilter = async () => {
    try {
      setLoading(true)
      setError(null)
      // console.log("Check filters: ", filters)
      const response = await trustDeviceServices.getTrustDeviceByFilter(filters, { responseDelay: 0 })
      // console.log(response)
      if (response.success) {
        setData(response.data)
      } else {
        setError(response.errors)
      }
    } catch (error) {
      setError((error as any).message)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeData = (e: any) => {
    // console.log("check type: ", e.target.type)
    // console.log("check value type: ", typeof e.target.value)
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: (e.target.type === "date") ? FormatDate(e.target.value) : e.target.value
    }))
  }
  const clearFilter = () => setFilters(tempTrustDevice)

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage
    }))
  };

  const getStatusBadge = (isActive: boolean, label: string) => {
    return isActive ? (
      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <span className="mr-1">✅</span>
        {label}
      </div>
    ) : (
      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <span className="mr-1">❌</span>
        {label.replace('Active', 'Inactive').replace('Verified', 'Unverified')}
      </div>
    );
  };
  // Calculate statistics
  const activeDevices = devices.filter(d => d.deviceIsActive).length;
  const verifiedDevices = devices.filter(d => d.deviceIsVerified).length;
  const activeRate = devices.length > 0 ? Math.round((activeDevices / devices.length) * 100) : 0;
  const verifiedRate = devices.length > 0 ? Math.round((verifiedDevices / devices.length) * 100) : 0;

  const deleteTrustDevice = async (trustDeviceId: number) => {
    try {
      setLoading(true);
      const response = await trustDeviceServices.deleteTrustDevice(trustDeviceId);
      if (response.success) {
        console.log("Delete success:", response.data);
        setData(response.data)
      } else {
        setError(response.errors);
      }
    } catch (error) {
      setError((error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 mr-3 text-green-600 flex items-center justify-center">
                  📱
                </div>
                Trust Devices Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage and monitor trusted devices across your system</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <span className="text-sm text-gray-500">Total Devices</span>
                <div className="text-2xl font-bold text-gray-900">{totalElements}</div>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <span className="text-sm text-gray-500">Active Rate</span>
                <div className="text-2xl font-bold text-green-600">{activeRate}%</div>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <span className="text-sm text-gray-500">Verified Rate</span>
                <div className="text-2xl font-bold text-blue-600">{verifiedRate}%</div>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <span className="text-sm text-gray-500">This Page</span>
                <div className="text-2xl font-bold text-purple-600">{devices.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span>{error}</span>
              <button
                onClick={applyFilter}
                className="ml-auto bg-red-200 hover:bg-red-300 px-3 py-1 rounded text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm border mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                🔍
              </div>
              <input
                type="text"
                name="deviceName"
                placeholder="Search by device name..."
                value={filters.deviceName ?? ""}
                onChange={handleChangeData}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${showFilters
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <span className="mr-2">🔧</span>
              Query
            </button>

            {/* Refresh Button */}
            <button
              onClick={applyFilter}
              disabled={loading}
              className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <span className={`mr-2 ${loading ? 'animate-spin' : ''}`}>🔄</span>
              Refresh
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-block w-4 mr-2">🟢</span>
                    Device Status
                  </label>
                  <select
                    name="deviceIsActive"
                    value={filters.deviceIsActive === undefined ? "" : String(filters.deviceIsActive)}
                    onChange={handleChangeData}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">All Devices</option>
                    <option value="true">Active Only</option>
                    <option value="false">Inactive Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-block w-4 mr-2">🔐</span>
                    Verification Status
                  </label>
                  <select
                    name="deviceIsVerified"
                    value={filters.deviceIsVerified === undefined ? "" : String(filters.deviceIsVerified)}
                    onChange={handleChangeData}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">All Devices</option>
                    <option value="true">Verified Only</option>
                    <option value="false">Unverified Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-block w-4 mr-2">📅</span>
                    From Date
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={filters.fromDate.toString() || ""}
                    onChange={handleChangeData}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-block w-4 mr-2">📅</span>
                    To Date
                  </label>
                  <input
                    name="toDate"
                    type="date"
                    value={filters.toDate.toString() || ""}
                    onChange={handleChangeData}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={applyFilter}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Apply Query
                </button>
                <button
                  onClick={clearFilter}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Table Header with Pagination Info */}
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing {devices.length > 0 ? ((filters.page - 1) * filters.size + 1) : 0}-{Math.min(filters.page * filters.size, totalElements)} of {totalElements} devices
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                name="size"
                value={filters.size}
                onChange={handleChangeData}
                className="border border-gray-200 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-green-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-2xl animate-spin mr-3">🔄</span>
                        <span className="text-gray-500">Loading devices...</span>
                      </div>
                    </td>
                  </tr>
                ) : devices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="text-6xl mb-4">📱</div>
                      <div className="text-lg font-medium">No trust devices found</div>
                      <div className="text-sm">Try adjusting your search or filter criteria</div>
                    </td>
                  </tr>
                ) : (
                  devices.map((device) => (
                    <tr key={device.trustDeviceId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {device.trustDeviceName}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {device.deviceUserAgent}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono text-sm text-gray-900">
                          {device.deviceIpAddress}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center">
                          <span className="mr-1">📍</span>
                          {device.deviceLocation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(device.deviceIsActive, 'Active')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(device.deviceIsVerified, 'Verified')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">
                          {new Date(device.deviceCreatedAt).toLocaleDateString('vi-VN')} <br />
                          <span className="text-xs text-gray-500">
                            {new Date(device.deviceCreatedAt).toLocaleTimeString('vi-VN')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {/* <button
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs"
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded text-xs"
                            title={device.deviceIsActive ? "Deactivate" : "Activate"}
                          >
                            {device.deviceIsActive ? "🔴" : "🟢"}
                          </button>
                          <button
                            className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded text-xs"
                            title={device.deviceIsVerified ? "Unverify" : "Verify"}
                          >
                            {device.deviceIsVerified ? "🔓" : "🔒"}
                          </button> */}
                          <button onClick={() => deleteTrustDevice(device.trustDeviceId)} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded text-xs" title="Delete Device">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <AttemptsPagination
            loading={loading}
            currentPage={filters.page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}