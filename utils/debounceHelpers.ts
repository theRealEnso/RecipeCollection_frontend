import { useCallback, useEffect, useState } from "react";

// define debounce function (helper)
export const debounce = <T,>(func: (value: T) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (value: T) => { // the returned debounced function that wraps the original function that was passed in and accepts the original arguments. Not executed yet
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            //func and delay are "remembered" here due to closures
            func(value);
        }, delay)
    };
};

// writing another function / custom hook that returns a debounced input
export const useDebouncedInput = <T,>(
    value: T, 
    delay: number, 
    debounceFn: <X,>(func: (value: X) => void, delay: number) => (value: X) => void,
    ) => {
    const [debouncedInput, setDebouncedInput] = useState<T>(value); //  debouncedInput === searchInput
    
    // our function that debounces the searchInput
    const debouncedSetter = useCallback(debounceFn((value: T) => {
        setDebouncedInput(value);
    }, delay), [delay, debounceFn]);

    useEffect(() => {
        debouncedSetter(value);
    }, [value, debouncedSetter]);

    // return a debounced input
    return debouncedInput;
};