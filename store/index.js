import { createWrapper } from 'next-redux-wrapper';

import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import reducer from './modules';


const makeStore = (context) => configureStore({ 
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat(logger),
    devTools: process.env.NODE_ENV !== 'production',
});

export const wrapper = createWrapper(makeStore, {
    debug: process.env.NODE_ENV !== 'production',
});