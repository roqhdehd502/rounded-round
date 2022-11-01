import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as counterActions from '../../store/modules/counter';


Test.layout = "L1";
export default function Test() {
    const dispatch = useDispatch();
    const value = useSelector(({ counter }) => counter.value);

    const plus = useCallback(( value ) => {
        dispatch(counterActions.increment());
    }, [dispatch]);

    const minus = useCallback(( value ) => {
        dispatch(counterActions.decrement());
    }, [dispatch]);

    return (
        <div>
            <h1>Counter</h1>
            <button onClick={() => minus(value)}>-</button>
            <span>{value}</span>
            <button onClick={() => plus(value)}>+</button>
        </div>
    );
}