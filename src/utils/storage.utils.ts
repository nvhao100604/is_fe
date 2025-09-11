
const setItemWithKey = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data))
}

const getItemWithKey = (key: string) => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(key)
    if (!data) return null
    return JSON.parse(data as string)
}

const clearAllKey = () => {
    localStorage.clear()
}
export { setItemWithKey, getItemWithKey, clearAllKey }