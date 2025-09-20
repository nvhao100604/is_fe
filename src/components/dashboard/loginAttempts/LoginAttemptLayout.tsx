'use client'
import React, { useEffect, useState, useCallback } from "react";
import { LoginAttemptDTO } from "@/types/response/login_attempt.response.dto";
import { PageDTO, tempData } from "@/types/response/page.response.dto";
import { LoginAttemptQuery, tempLoginAttempts } from "@/types/api";
import { AttemptsPagination, AttemptsTable, ErrorDisplay, FilterControl, FilterPanel, Header, TableHeader } from "./loginAttempts.components";
import { loginAttemptServices } from "@/services/login_attempt.service";
import { FormatDate } from "@/utils";

function LoginAttemptsDashboard() {
  const [data, setData] = useState<PageDTO<LoginAttemptDTO> | null>(null)
  const [filters, setFilters] = useState<LoginAttemptQuery>(tempLoginAttempts)
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { content: attempts, totalPages, totalElements } = data ?? tempData
  const [error, setError] = useState<string | null>(null);
  // Fetch data from API
  useEffect(() => {
    applyFilter()
  }, [filters])

  const applyFilter = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await loginAttemptServices.getLoginAttemptsByFilter(filters, { responseDelay: 0 })
      console.log(response)
      if (response.success) {
        setData(response.data)
      } else {
        setError(response.errors)
      }
    } catch (error) {
      setError(error as any)
    } finally {
      setLoading(false)
    }
  }


  const handleChangeData = (e: any) => {
    console.log("check type: ", e.target.type)
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: (e.target.type === "date") ? FormatDate(e.target.value) : e.target.value
    }))
  }
  const clearFilter = () => setFilters(tempLoginAttempts)

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage
    }))
  };

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
        {/* {error &&
          <ErrorDisplay
            error={error}
            fetchLoginAttempts={applyFilter}
          />} */}
        <div className="bg-white rounded-xl shadow-sm border mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* <AttemptsSearch searchTerm={filters.}
              setSearchTerm={ }
            /> */}
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
            handleChange={handleChangeData}
            applyFilter={applyFilter}
            clearFilter={clearFilter}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <TableHeader
            attempts={attempts}
            currentPage={filters.page}
            pageSize={filters.size}
            totalElements={totalElements}
            handlePageSizeChange={handlePageChange}
          />
          <AttemptsTable
            attempts={attempts}
            loading={loading}
          />
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

export default LoginAttemptsDashboard