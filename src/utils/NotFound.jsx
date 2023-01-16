import React from "react";

export default function NotFound() {
    return (
        <div className="flex h-screen items-center justify-center">
            NotFound page
            <p className="text-clip text-center ">
                Sorry, the page you are looking for does not exist.
            </p>
            <button className="" onClick={() => window.history.back()}>
                Go Back
            </button>
        </div>
    );
}
