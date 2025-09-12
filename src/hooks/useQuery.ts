'use client'
import { Query } from '@/types/api';
import { useState } from 'react'

const useQuery = (initial: Query): [Query, (newQuery: Query) => void, () => void] => {
    const [query, setQuery] = useState(initial);

    const updateQuery = (newQuery: Query) => {
        setQuery((prev: Query) => ({
            ...prev,
            ...newQuery
        }));
    }

    const resetQuery = () => {
        setQuery(initial);
    }
    return [query, updateQuery, resetQuery];
}

export default useQuery;