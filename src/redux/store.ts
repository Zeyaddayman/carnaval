import { configureStore } from '@reduxjs/toolkit'
import localCartReducer from './features/localCartSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            localCart: localCartReducer,
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']