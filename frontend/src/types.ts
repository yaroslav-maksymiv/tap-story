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