import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import  type {Color} from '../type'

export enum StatusFilters {
    all = 'all',
    active = 'active',
    completed = 'completed'
}

export type ChangeType = 'added' | 'removed'

interface FiltersState {
    status: StatusFilters;
    colors: Array<Color>
}

const initialState: FiltersState = {
    status: StatusFilters.all,
    colors: []
}

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        statusFilterChanged(state, action: PayloadAction<StatusFilters>) {
            state.status = action.payload
        },
        colorFilterChanged: {
            reducer(state, action: PayloadAction<{ color: Color, changeType: ChangeType}>) {
                let { color, changeType } = action.payload
                const { colors } = state
                switch (changeType) {
                    case 'added': {
                        if(!colors.includes(color)) {
                            colors.push(color)
                        }
                        break
                    }
                    case 'removed': {
                        state.colors = colors.filter( existingColor => existingColor !== color)
                        break
                    }
                    default:
                        return
                }
            },
            prepare(color: Color, changeType: ChangeType) {
                return {
                    payload: { color, changeType}
                }
            }
        }
    }
})

export const { colorFilterChanged, statusFilterChanged } = filtersSlice.actions

export default filtersSlice.reducer