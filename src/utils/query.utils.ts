import { Query } from "@/types/api";

const handleQuery = (query: Query) => {
    const newQuery = query;
    Object.keys(newQuery).forEach(key => {
        const element = newQuery[key];
        if (element === null) {
            delete newQuery[key];
        }
    })
    return newQuery;
}

const QueryToParams = (query: Query): string => {
    const handledQuery = handleQuery(query)
    const queryString = new URLSearchParams(handledQuery as any).toString()
    // console.log("check query: ", queryString)

    return queryString
}

export { handleQuery, QueryToParams }