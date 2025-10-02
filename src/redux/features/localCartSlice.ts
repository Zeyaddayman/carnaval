import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { CartItem } from '@/types/cart'

interface LocalCartState {
    items: CartItem[]
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
        addItemToLocalCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id)

            if (existingItem) {
                existingItem.qty = action.payload.qty
            } else {
                state.items.push(action.payload)
            }
            localStorage.setItem("localCart", JSON.stringify(state.items));
        },
        updateItemQtyInLocalCart: (state, action: PayloadAction<{ id: string, qty: number }>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id)

            if (existingItem) {
                existingItem.qty = action.payload.qty
            }
        },
        removeItemFromLocalCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload)
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