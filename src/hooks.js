import { useCallback, useEffect, useRef, useState } from 'react';

export function useKeyPresses(keyHandlers) {
	const [keysPressed, setKeysPressed] = useState({});

	useEffect(() => {
		function downHandler({ key }) {
			const handlers = keyHandlers[key];
			if (handlers && !keysPressed[key]) {
				setKeysPressed(oldKeysPressed => ({
					...oldKeysPressed,
					[key]: true,
				}));
				handlers.onDown?.();
			}
		}

		function upHandler({ key }) {
			const handlers = keyHandlers[key];
			if (handlers && keysPressed[key]) {
				setKeysPressed(oldKeysPressed => ({
					...oldKeysPressed,
					[key]: false,
				}));
				handlers.onUp?.();
			}
		}

		window.addEventListener('keydown', downHandler);
		window.addEventListener('keyup', upHandler);
		return () => {
			window.removeEventListener('keydown', downHandler);
			window.removeEventListener('keyup', upHandler);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [keyHandlers]);

	return keysPressed;
}

export function useRepeatable(fn, { delay = 500, interval = 20, maxRepeats = 0 } = {}) {
	const timeout = useRef(null);
	const repeatCount = useRef(0);

	const loopingFn = useCallback(() => {
		fn();
		if (!maxRepeats || ++repeatCount.current < maxRepeats) {
			timeout.current = setTimeout(loopingFn, interval);
		}
	}, [fn, interval, maxRepeats]);

	const onPress = useCallback(() => {
		if (timeout.current) return;
		timeout.current = setTimeout(loopingFn, delay);
	}, [loopingFn, delay]);

	const onRelease = useCallback(() => {
		clearTimeout(timeout.current);
		timeout.current = null;
		if (!maxRepeats || repeatCount.current < maxRepeats) fn();
		repeatCount.current = 0;
	}, [fn, maxRepeats]);

	return [onPress, onRelease];
}
