import { combineReducers } from 'redux';
import profileReducer from './profileReducer';
import languageReducer from './languageReducer';
import navReducer from './navReducer';

const rootReducer = combineReducers({
    profileReducer,
    languageReducer,
    navReducer
})

export default rootReducer;