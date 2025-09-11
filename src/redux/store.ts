import { configureStore } from '@reduxjs/toolkit'
import navigationReducer from '@/redux/slices/navigationSlices'
import authReducer from '@/redux/slices/authSlices'

export const store = configureStore({
    reducer: {
        navigation: navigationReducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch