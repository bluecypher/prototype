import { combineReducers } from 'redux';
import profileReducer from './profileReducer';
import languageReducer from './languageReducer';

const rootReducer = combineReducers({
    profileReducer,
    languageReducer
})

export default rootReducer;