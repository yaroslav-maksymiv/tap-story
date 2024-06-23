export type PaginationLinks = {
  next: string | null
  previous: string | null
}

export type PaginatedResponse<T> = {
    links: PaginationLinks
    total: number
    page: number
    page_size: number
    results: T[]
    loadMore?: boolean
    save?: boolean
}

export type ConfigType = {
    headers: {
        'Content-Type': string
        Accept: string
        Authorization?: string
    }
}