import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

import { composeWithDevTools } from '@redux-devtools/extension';
import rootReducer from './reducer'
// import { sayHiOnDispatch, includeMeaningOfLife } from './exampleAddons/enhancers';
// import { loggerMiddleware } from './exampleAddons/middleware'


// const composedEnhancer = compose(sayHiOnDispatch, includeMeaningOfLife)


const composedEnhancer = composeWithDevTools(
    // example: 在这里添加任何你想使用的中间件
    applyMiddleware(thunk),
     // 可以在这里添加其他增强器(如果有的话)
    // sayHiOnDispatch,
    // includeMeaningOfLife
)

const store = createStore(rootReducer, composedEnhancer)

export type AppDispatch = typeof store.dispatch;
export type RootState = typeof store.getState

export default store;