import { configureStore } from '@reduxjs/toolkit'
import localCartReducer from './features/localCartSlice'
import { UserSessionApi } from './features/userSessionApi'

export const makeStore = () => {
    return configureStore({
        reducer: {
            localCart: localCartReducer,
            [UserSessionApi.reducerPath]: UserSessionApi.reducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(UserSessionApi.middleware)
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']