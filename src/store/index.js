import {combineReducers, configureStore} from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import orderCartReducer from './reducers/cart';
import orderReducer from './reducers/order';
import performanceReducer from './reducers/performance';
import retailerReducer from './reducers/retailer';
import returnsReducer from './reducers/returns';
import orderCartPromotionalReducer from './reducers/cartPromotional';

const rootReducer = combineReducers({
  auth: authReducer,
  retailer: retailerReducer,
  performance: performanceReducer,
  order: orderReducer,
  cart: orderCartReducer,
  cartPromotional: orderCartPromotionalReducer,
  returns: returnsReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
