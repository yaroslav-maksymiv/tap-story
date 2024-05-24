import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {listEpisodes, singleEpisode} from "./episodeThunk";

type Episode = {
    id: number,
    title: string,
    story: number
}

type EpisodeState = {
    loading: {
        list: boolean
        single: boolean
    }
    episodes: Episode[]
    episode: Episode | null
    error: string
}

const initialState: EpisodeState = {
    loading: {
        list: false,
        single: false
    },
    episodes: [],
    episode: null,
    error: ''
}

const episodeSlice = createSlice({
    name: 'episode',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listEpisodes.pending, (state) => {
            state.loading.list = true
            state.error = ''
        })
        builder.addCase(listEpisodes.fulfilled, (state, action: PayloadAction<Episode[]>) => {
            state.episodes = action.payload
            state.loading.list = false
        })
        builder.addCase(listEpisodes.rejected, (state) => {
            state.loading.list = false
        })
        builder.addCase(singleEpisode.pending, (state) => {
            state.loading.single = true
            state.error = ''
        })
        builder.addCase(singleEpisode.fulfilled, (state, action: PayloadAction<Episode>) => {
            state.episode = action.payload
            state.loading.single = false
        })
        builder.addCase(singleEpisode.rejected, (state) => {
            state.loading.single = false
        })
    }
})

export default episodeSlice.reducer