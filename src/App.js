import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./assets/css/animated-back.css";

const NotFoundPage = lazy(() => import("./utils/NotFound"));

const Home = lazy(() => import("./components/Home"));
const LineToSpaceConvert = lazy(() =>
    import("./components/LineToSpaceConvert")
);
const WordCharLineCounter = lazy(() =>
    import("./components/WordCharLineCounter")
);

function App() {
    return (
        <div className="bg-dark -mt-2">
            <div id="stars" className="-z-50 h-1/2 overflow-hidden"></div>
            <div id="stars2" className="-z-50 h-1/2 overflow-hidden"></div>
            <div id="stars3" className="-z-50 h-1/2 overflow-hidden"></div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/*"
                        element={
                            <Suspense fallback={<div>Loading</div>}>
                                <NotFoundPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/LineToSpaceConverter"
                        element={
                            <Suspense fallback={<div>Loading</div>}>
                                <LineToSpaceConvert />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/WordCharLineCounter"
                        element={
                            <Suspense fallback={<div>Loading</div>}>
                                <WordCharLineCounter />
                            </Suspense>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
