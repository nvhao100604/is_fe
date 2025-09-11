import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UIState {
    label: string,
    path: string
}
export interface NavigationState {
    currentState: UIState,
    previousState: UIState,
    isLoading: boolean
}

const defaultState: UIState = {
    label: "Home",
    path: '/'
}
const initialState: NavigationState = {
    currentState: defaultState,
    previousState: defaultState,
    isLoading: false
}

export const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        switchState: (state, action: PayloadAction<UIState>) => {
            state.previousState = state.currentState
            state.currentState = action.payload
        },
        backState: (state) => {
            state.previousState = state.currentState
            state.currentState = state.previousState
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
        },
    },
})

// Action creators are generated for each case reducer function
export const { switchState, backState, incrementByAmount } = navigationSlice.actions

export default navigationSlice.reducer