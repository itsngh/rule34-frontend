"use client";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

declare global {
	interface Window {
		Gradient: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	}
}

const StripeCanvas: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "stripe-gradient.js";
		script.async = true;

		script.onload = () => {
			setIsLoaded(true);
		};

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	useEffect(() => {
		const darkColors = ["#084843", "#3C2E69", "#253974"];
		const lightColors = ["#0BD8B6", "#BAA7FF", "#9EB1FF"];

		if (isLoaded && canvasRef.current) {
			new window.Gradient({
				canvas: canvasRef.current,
				colors: resolvedTheme == "dark" ? darkColors : lightColors,
				// wireframe: true,
			});

			// gradient.start(); // Start the animation

			// // Cleanup when the component is unmounted
			// return () => {
			// 	gradient.stop();
			// };
		}
	}, [isLoaded, resolvedTheme]);

	if (!isLoaded) {
		return <></>;
	}

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: "fixed",
				height: "100vh",
				top: "0",
				left: "0",
				zIndex: "-1",
			}}
		/>
	);
};

export default StripeCanvas;
