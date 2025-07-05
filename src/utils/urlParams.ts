import { useSearchParams } from "react-router-dom"

export const useURLParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const updateURLParams = (updates: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key)
      } else {
        newParams.set(key, String(value))
      }
    })

    setSearchParams(newParams, { replace: true })
  }

  const getURLParam = (key: string): string | null => {
    return searchParams.get(key)
  }

  const getAllURLParams = (): Record<string, string> => {
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  }

  return {
    searchParams,
    updateURLParams,
    getURLParam,
    getAllURLParams,
  }
}
