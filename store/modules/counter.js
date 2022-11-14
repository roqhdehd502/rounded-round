import { createSlice } from '@reduxjs/toolkit';


const initialState = { 
    value: 0,
}; // 초기 상태 정의

const CounterSlice = createSlice({
    name: 'Counter',

    initialState,

    reducers: {
        increment: state => { 
            state.value += 1 
        },
        decrement: state => { 
            state.value -= 1 
        },
    },
});

export const { 
    increment, 
    decrement, 
} = CounterSlice.actions; // 액션 생성함수

export default CounterSlice.reducer; // 리듀서