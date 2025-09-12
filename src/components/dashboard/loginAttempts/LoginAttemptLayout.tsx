'use client'
import React, { useEffect, useState, useCallback } from "react";
import { LoginAttemptDTO } from "@/types/response/login_attempt.response.dto";
import { PageDTO } from "@/types/response/page.response.dto";
import { APIResponse, defaultQuery, LoginAttemptQuery } from "@/types/api";
import { AttemptsPagination, AttemptsSearch, AttemptsTable, ErrorDisplay, FilterControl, FilterPanel, Header, TableHeader } from "./loginAttempts.components";

function LoginAttemptsDashboard() {
  const [attempts, setAttempts] = useState<LoginAttemptDTO[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // State cho UI
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<LoginAttemptQuery>(defaultQuery);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const fetchLoginAttempts = useCallback(async () => {
    setLoading(true);
    setError(null);
    // try {
    //   console.log('Fetching data with:', { filters, currentPage, pageSize, searchTerm });

    //   // Tạo filter object với search term
    //   const apiFilter: LoginAttemptFilter = {
    //     ...filters,
    //     // Nếu có search term, có thể thêm logic search ở đây
    //     // Hoặc để backend handle search through existing filters
    //   };

    //   const response: APIResponse<PageDTO<LoginAttemptDTO>> = await loginAttemptService.filter(
    //     apiFilter,
    //     currentPage - 1, // Backend thường dùng 0-indexed
    //     pageSize
    //   );


    //   if (response.success && response.data.content) {
    //     let filteredData = response.data.content || [];

    //     // Client-side search filter nếu backend không support
    //     if (searchTerm.trim()) {
    //       filteredData = filteredData.filter(attempt =>
    //         attempt.attemptIpAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         (attempt.trustDeviceName && attempt.trustDeviceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    //         (attempt.attemptFailureReason && attempt.attemptFailureReason.toLowerCase().includes(searchTerm.toLowerCase()))
    //       );
    //     }

    //     setAttempts(filteredData);
    //     setTotalElements(response.data.totalElements || 0);
    //     setTotalPages(response.data.totalPages || 0);
    //   } else {
    //     throw new Error(response.message || 'Failed to fetch data');
    //   }
    // } catch (err: any) {
    //   console.error('Error fetching login attempts:', err);
    //   setError(err.message || 'Failed to load login attempts');
    //   setAttempts([]);
    //   setTotalElements(0);
    //   setTotalPages(0);
    // } finally {
    //   setLoading(false);
    // }
  }, [currentPage, pageSize, searchTerm]);

  const applyFilter = () => {
    fetchLoginAttempts();
  };

  const clearFilter = () => {
    // setFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };
  const handleFilterChange = (e: any) => {

  }
  // Calculate success rate
  const successRate = useCallback(() => {
    return attempts.length > 0
      ? Math.round((attempts.filter(a => a.attemptSuccess).length / attempts.length) * 100)
      : 0
  }, [attempts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Header totalElements={totalElements} successRate={successRate} />
        {error &&
          <ErrorDisplay
            error={error}
            fetchLoginAttempts={fetchLoginAttempts}
          />}
        <div className="bg-white rounded-xl shadow-sm border mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <AttemptsSearch searchTerm={searchTerm}
              setSearchTerm={(e) => setSearchTerm(e.target.value)}
            />
            <FilterControl
              showFilters={showFilters}
              setShowFilters={() => setShowFilters(!showFilters)}
              applyFilter={applyFilter}
              loading={loading}
            />
          </div>
          <FilterPanel
            filters={filters}
            loading={loading}
            showFilters={showFilters}
            handleChange={handleFilterChange}
            applyFilter={applyFilter}
            clearFilter={clearFilter}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <TableHeader
            attempts={attempts}
            currentPage={currentPage}
            pageSize={pageSize}
            totalElements={totalElements}
            handlePageSizeChange={(e) => handlePageSizeChange(Number(e.target.value))}
          />
          <AttemptsTable
            attempts={attempts}
            loading={loading}
          />
          <AttemptsPagination
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginAttemptsDashboard