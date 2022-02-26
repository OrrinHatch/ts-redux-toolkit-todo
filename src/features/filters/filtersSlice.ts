import { AnyAction } from 'redux';

export type StatusIndex = 'All' | 'Active' | 'Completed'


export const StatusFilters: { [k in StatusIndex]: string} = {
    All: 'all',
    Active: 'active',
    Completed: 'completed',
};

export const transformStatus = function(key: string) {
    switch(key) {
        case 'All':
            return '所有'
        case 'Active':
            return '正在进行中'
        case 'Completed':
            return '已完成'
        default:
            return '所有'
    }
}

export interface FiltersState {
    status:  string;
    colors: string[]
}

const initialState: FiltersState = {
    status: StatusFilters.All,
    colors: []
}

export const colorFilterChanged = (color: string, changeType: 'added' | 'removed') => {
    return {
        type: 'filters/colorFilterChanged',
        payload: { color, changeType }
    }
}

export default function filtersReducer(state = initialState, action: AnyAction) {
    switch(action.type) {
        case 'filters/statusFilterChanged': {
            return {
                // 同样, 要复制的嵌套层次少了一层
                ...state,
                // 并将 status 字段替换成新值
                status: action.payload
            }
        }
        case 'filters/colorFilterChanged': {
            let { color, changeType } = action.payload
            const { colors } = state
            switch (changeType) {
                case 'added': {
                    if(colors.includes(color)) {
                        return state
                    }
                    return {
                        ...state,
                        colors: state.colors.concat(color),
                    }
                }
                case 'removed': {
                    return {
                        ...state,
                        colors: state.colors.filter((existingColor) => existingColor !== color)
                    }
                }
                default:
                    return state
            }
        }
        default:
            // 如果这个reducer不能识别action, 或者没有
            // 关心这个具体的动作,原样返回现有状态
            return state
    }
}