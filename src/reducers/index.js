import { combineReducers } from 'redux';
import routes from './routesReducers';
import formReducer from './formReducers';
// ... other reducers

export default combineReducers({
  routes,
  formReducer
  // ... other reducers
});