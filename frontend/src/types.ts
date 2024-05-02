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
}

export type ConfigType = {
    headers: {
        'Content-Type': string
        Accept: string
        Authorization?: string
    }
}