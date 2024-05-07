import {PaginatedResponse} from "./types";
import {PayloadAction} from "@reduxjs/toolkit";

export const createErrorsList = (payload: any): string[] => {
    let errorsList: string[] = []
    for (const [key, values] of Object.entries(payload)) {
        for (const value of (values as string[])) {
            errorsList.push(value.charAt(0).toUpperCase() + value.slice(1))
        }
    }
    return errorsList
}

type PaginationState = {
    total: number | null
    page: number | null
    nextLink: string | null
    previousLink: string | null
    loading: boolean
    hasMore: boolean
}

export const savePaginatedResponseToState = <S extends PaginationState, T>(state: S, action: PayloadAction<PaginatedResponse<T>>): void => {
    const payload = action.payload
    state.loading = false
    state.total = payload.total
    state.page = payload.page
    state.nextLink = payload.links.next
    state.previousLink = payload.links.previous
    state.hasMore = !!payload.links.next
}