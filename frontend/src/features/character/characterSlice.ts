import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createCharacter, deleteCharacter, listCharacters, updateCharacter} from "./characterThunk";
import {createErrorsList} from "../../miscellaneous";

type ErrorPayload = {
    [key: string]: string[]
}

type Character = {
    id: number
    name: string
    story: number
    color: string
}

type CharacterState = {
    characters: Character[]
    loading: {
        list: boolean
        create: boolean
        update: boolean
        delete: boolean
    }
    errors: {
        list: string
        create: string[]
        update: string[]
        delete: string
    }
}

const initialState: CharacterState = {
    characters: [],
    loading: {
        list: false,
        create: false,
        update: false,
        delete: false
    },
    errors: {
        list: '',
        delete: '',
        create: [],
        update: []
    }
}

const characterSlice = createSlice({
    name: 'character',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listCharacters.pending, (state) => {
            state.loading.list = true
            state.errors.list = ''
        })
        builder.addCase(listCharacters.fulfilled, (state, action: PayloadAction<Character[]>) => {
            state.characters = action.payload
            state.loading.list = false
        })
        builder.addCase(listCharacters.rejected, (state) => {
            state.loading.list = false
        })
        builder.addCase(createCharacter.pending, (state) => {
            state.loading.create = true
            state.errors.create = []
        })
        builder.addCase(createCharacter.fulfilled, (state, action: PayloadAction<Character>) => {
            state.loading.create = false
            state.characters = [action.payload, ...state.characters]
        })
        builder.addCase(createCharacter.rejected, (state, action) => {
            state.loading.create = false

            if (action.payload) {
                state.errors.create = createErrorsList(action.payload)
            } else {
                state.errors.create = action.error.message ? [action.error.message] : []
            }
        })
        builder.addCase(updateCharacter.pending, (state) => {
            state.loading.update = true
            state.errors.update = []
        })
        builder.addCase(updateCharacter.fulfilled, (state) => {
            state.loading.update = false
        })
        builder.addCase(updateCharacter.rejected, (state, action) => {
            state.loading.update = false

            if (action.payload) {
                state.errors.update = createErrorsList(action.payload)
            } else {
                state.errors.update = action.error.message ? [action.error.message] : []
            }
        })
        builder.addCase(deleteCharacter.pending, (state) => {
            state.loading.delete = true
            state.errors.delete = ''
        })
        builder.addCase(deleteCharacter.fulfilled, (state) => {
            state.loading.delete = false
        })
        builder.addCase(deleteCharacter.rejected, (state, action) => {
            state.loading.delete = false
            state.errors.delete = action.error.message ? action.error.message : ''
        })
    }
})

export default characterSlice.reducer
