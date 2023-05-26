import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toast } from "./components/Toast";
import "./assets/css/animated-back.css";

import Loader from "./utils/Loader";

const NotFoundPage = lazy(() => import("./utils/NotFound"));

const Home = lazy(() => import("./components/Home"));
const LineToSpaceConvert = lazy(() =>
	import("./components/LineToSpaceConvert")
);
const WordCharLineCounter = lazy(() =>
	import("./components/WordCharLineCounter")
);

const AgeCalculator = lazy(() => import("./components/AgeCalculator"));

function App() {
	return (
		<div
			className="bg-dark -mt-2"
			style={{
				fontFamily: "Arthemis",
			}}
		>
			<div id="stars" className="-z-50 h-1/2 overflow-hidden"></div>
			<div id="stars2" className="-z-50 h-1/2 overflow-hidden"></div>
			<div id="stars3" className="-z-50 h-1/2 overflow-hidden"></div>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route
						path="/*"
						element={
							<Suspense fallback={<Loader />}>
								<NotFoundPage />
							</Suspense>
						}
					/>
					<Route
						path="/LineToSpaceConverter"
						element={
							<Suspense fallback={<Loader />}>
								<LineToSpaceConvert />
							</Suspense>
						}
					/>
					<Route
						path="/WordCharLineCounter"
						element={
							<Suspense fallback={<Loader />}>
								<WordCharLineCounter />
							</Suspense>
						}
					/>
					<Route
						path="/AgeCalculator"
						element={
							<Suspense fallback={<Loader />}>
								<AgeCalculator />
							</Suspense>
						}
					/>
					// test route
					<Route
						path="/test"
						element={
							<Suspense fallback={<Loader />}>
								<Loader />
							</Suspense>
						}
					/>
				</Routes>
				<Toast />
			</BrowserRouter>
		</div>
	);
}

export default App;
