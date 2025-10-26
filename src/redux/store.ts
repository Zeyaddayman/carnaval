import { configureStore } from '@reduxjs/toolkit'
import localCartReducer from './features/localCartSlice'
import { userCartApi } from './features/userCartApi'
import { userSessionApi } from './features/userSessionApi'
import { userWishlistApi } from './features/userWishlistApi'

export const makeStore = () => {
    return configureStore({
        reducer: {
            localCart: localCartReducer,
            [userCartApi.reducerPath]: userCartApi.reducer,
            [userSessionApi.reducerPath]: userSessionApi.reducer,
            [userWishlistApi.reducerPath]: userWishlistApi.reducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(userCartApi.middleware, userSessionApi.middleware, userWishlistApi.middleware)
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']