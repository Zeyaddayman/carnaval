import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { CartItemWithProduct } from '@/types/cart'

interface LocalCartState {
    items: CartItemWithProduct[]
}

const initialState: LocalCartState = {
    items: [],
}

if (typeof window !== "undefined") {
    const localCart = window.localStorage.getItem("localCart")

    if (localCart) initialState.items = JSON.parse(localCart)
}

export const LocalCartSlice = createSlice({
    name: 'localCart',
    initialState,
    reducers: {
        addItemToLocalCart: (state, action: PayloadAction<CartItemWithProduct>) => {
            const existingItem = state.items.find(item => item.productId === action.payload.id)

            if (existingItem) {
                existingItem.quantity = action.payload.quantity
            } else {
                state.items.push(action.payload)
            }
            localStorage.setItem("localCart", JSON.stringify(state.items));
        },
        updateItemQtyInLocalCart: (state, action: PayloadAction<{ id: string, quantity: number }>) => {
            const existingItem = state.items.find(item => item.productId === action.payload.id)

            if (existingItem) {
                existingItem.quantity = action.payload.quantity
            }

            localStorage.setItem("localCart", JSON.stringify(state.items));
        },
        removeItemFromLocalCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.productId !== action.payload)
            localStorage.setItem("localCart", JSON.stringify(state.items));
        }
    }
})

export const {
    addItemToLocalCart,
    updateItemQtyInLocalCart,
    removeItemFromLocalCart

} = LocalCartSlice.actions

export const selectLocalCart = (state: RootState) => state.localCart

export default LocalCartSlice.reducer