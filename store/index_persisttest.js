import { createWrapper } from 'next-redux-wrapper';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import logger from 'redux-logger';

import { rootReducer, persistedReducer } from './modules';


const makeConfiguredStore = (reducer) => configureStore({ 
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV !== 'production',
});

const makeStore = () => {
    const isServer = typeof(window) === 'undefined';

    if (isServer) {
        return makeConfiguredStore(rootReducer);
    } else {
        const store = makeConfiguredStore(persistedReducer);
        let persistor = persistStore(store);
        return { persistor, ...store };
    }
};

export const wrapper = createWrapper(makeStore, { debug: process.env.NODE_ENV !== 'production' });