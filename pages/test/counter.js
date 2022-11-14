import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as CounterActions from '../../store/modules/Counter';


Counter.layout = "L1";
export default function Counter() {
    const dispatch = useDispatch();
    const value = useSelector(({ counter }) => counter.value);

    const plus = useCallback(( value ) => {
        dispatch(CounterActions.increment());
    }, [dispatch]);

    const minus = useCallback(( value ) => {
        dispatch(CounterActions.decrement());
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