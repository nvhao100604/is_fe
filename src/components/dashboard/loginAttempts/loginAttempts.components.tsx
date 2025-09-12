import { LoginAttemptQuery } from "@/types/api";
import { LoginAttemptDTO } from "@/types/response/login_attempt.response.dto";

const Header = ({ totalElements, successRate }: { totalElements: number, successRate: () => number }) => {
    return (
        <>
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <div className="w-8 h-8 mr-3 text-blue-600 flex items-center justify-center">
                                🛡️
                            </div>
                            Login Attempts Dashboard
                        </h1>
                        <p className="text-gray-600 mt-2">Monitor and analyze login activities across your system</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                            <span className="text-sm text-gray-500">Total Attempts</span>
                            <div className="text-2xl font-bold text-gray-900">{totalElements}</div>
                        </div>
                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                            <span className="text-sm text-gray-500">Success Rate</span>
                            <div className="text-2xl font-bold text-green-600">{successRate()}%</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const AttemptsTable = ({
    loading,
    attempts
}: { loading: boolean, attempts: LoginAttemptDTO[] }) => {

    const getStatusBadge = (success: boolean) => {
        return success ? (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="mr-1">✅</span>
                Success
            </div>
        ) : (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <span className="mr-1">❌</span>
                Failed
            </div>
        );
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                IP Address
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User Agent
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Failure Reason
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created At
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Device
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="flex items-center justify-center">
                                        <span className="text-2xl animate-spin mr-3">🔄</span>
                                        <span className="text-gray-500">Loading attempts...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : attempts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    <div className="text-6xl mb-4">📋</div>
                                    <div className="text-lg font-medium">No login attempts found</div>
                                    <div className="text-sm">Try adjusting your search or filter criteria</div>
                                </td>
                            </tr>
                        ) : (
                            attempts.map((attempt) => (
                                <tr key={attempt.attemptId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-mono text-sm text-gray-900">
                                            {attempt.attemptIpAddress}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="mr-1">
                                                {attempt.attemptUserAgent ? "👁️" : "🚫"}
                                            </span>
                                            <span className="text-sm text-gray-900">
                                                {attempt.attemptUserAgent ? "Detected" : "Not detected"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(attempt.attemptSuccess)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                            {attempt.attemptFailureReason || (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-mono">
                                            {new Date(attempt.attemptCreatedAt).toLocaleDateString('vi-VN')} <br />
                                            <span className="text-xs text-gray-500">
                                                {new Date(attempt.attemptCreatedAt).toLocaleTimeString('vi-VN')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                            {attempt.trustDeviceName || (
                                                <span className="text-gray-400">Unknown</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

interface TableHeaderProps {
    attempts: LoginAttemptDTO[],
    currentPage: number,
    pageSize: number,
    totalElements: number,
    handlePageSizeChange: (e: any) => void
}
const TableHeader = ({
    attempts,
    currentPage,
    pageSize,
    totalElements,
    handlePageSizeChange
}: TableHeaderProps) => {
    return (
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-600">
                Showing {attempts.length > 0 ? ((currentPage - 1) * pageSize + 1) : 0}-{Math.min(currentPage * pageSize, totalElements)} of {totalElements} attempts
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="border border-gray-200 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>
        </div>
    )
}

interface AttemptsPaginationProps {
    loading: boolean,
    currentPage: number,
    totalPages: number,
    handlePageChange: (page: number) => void
}

const AttemptsPagination = ({
    loading,
    currentPage,
    totalPages,
    handlePageChange
}: AttemptsPaginationProps) => {
    const getPaginationButtons = () => {
        const buttons = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === i
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border hover:bg-gray-50'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };

    return (
        <>
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1 || loading}
                            className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                    </div>

                    <div className="flex items-center gap-1">
                        {getPaginationButtons()}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages || loading}
                            className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

interface FilterPanelProps {
    showFilters: boolean,
    filters: LoginAttemptQuery
    loading: boolean,
    handleChange: (e: any) => void,
    applyFilter: () => void,
    clearFilter: () => void
}

const FilterPanel = ({
    showFilters,
    filters,
    loading,
    handleChange,
    applyFilter,
    clearFilter
}: FilterPanelProps) => {
    return (
        <>
            {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="inline-block w-4 mr-2">✅</span>
                                Login Status
                            </label>
                            <select
                                value={String(filters.attemptSuccess ?? "")}
                                name="attemptSuccess"
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Attempts</option>
                                <option value="true">Successful Only</option>
                                <option value="false">Failed Only</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="inline-block w-4 mr-2">📅</span>
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate || ""}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="inline-block w-4 mr-2">📅</span>
                                End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate || ""}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={applyFilter}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            Apply Filters
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
        </>
    )
}

const AttemptsSearch = ({ searchTerm, setSearchTerm }: {
    searchTerm: string, setSearchTerm: (e: any) => void
}) => {
    return (
        <>
            <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                    🔍
                </div>
                <input
                    type="text"
                    placeholder="Search by IP address, device, or failure reason..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>
        </>
    )
}

const FilterControl = ({ showFilters, setShowFilters, applyFilter, loading }: {
    showFilters: boolean, setShowFilters: () => void, applyFilter: () => void, loading: boolean
}) => {
    return (
        <>
            {/* Filter Toggle */}
            <button
                onClick={setShowFilters}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${showFilters
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
            >
                <span className="mr-2">🔧</span>
                Filters
            </button>

            {/* Refresh Button */}
            <button
                onClick={applyFilter}
                disabled={loading}
                className="flex items-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
                <span className={`mr-2 ${loading ? 'animate-spin' : ''}`}>🔄</span>
                Refresh
            </button>
        </>
    )
}

const ErrorDisplay = ({ error, fetchLoginAttempts }: { error: string, fetchLoginAttempts: () => void }) => {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                <span>{error}</span>
                <button
                    onClick={fetchLoginAttempts}
                    className="ml-auto bg-red-200 hover:bg-red-300 px-3 py-1 rounded text-sm"
                >
                    Retry
                </button>
            </div>
        </div>
    )
}

export {
    Header,
    AttemptsTable,
    TableHeader,
    AttemptsPagination,
    FilterPanel,
    AttemptsSearch,
    FilterControl,
    ErrorDisplay
}