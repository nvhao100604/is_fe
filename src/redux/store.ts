import { configureStore } from '@reduxjs/toolkit'
import navigationReducer from '@/redux/slices/navigationSlices'
import authReducer from '@/redux/slices/authSlices'
import { setupInterceptors } from '@/config/axios'
import { setupInterceptor } from '../../middleware'

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

setupInterceptors(store.dispatch, store.getState)
setupInterceptor(store.dispatch, store.getState)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch