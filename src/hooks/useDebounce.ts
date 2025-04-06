import { useState, useEffect } from "react";

export default function useDebounce<T>(
	value: T,
	delayInMilliseconds: number,
): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delayInMilliseconds);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delayInMilliseconds]);

	return debouncedValue;
}
