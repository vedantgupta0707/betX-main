import {configureStore, combineReducers} from '@reduxjs/toolkit';
import userReducer from '../actions/userSlice';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import matchReducer from '../actions/matchSlice';


const rootReducer = combineReducers({
    user: userReducer,
    match: matchReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export const persistor = persistStore(store);