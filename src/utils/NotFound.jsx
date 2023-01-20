import React from "react";

export default function NotFound() {
    return (
        <div
            className="flex h-screen flex-col items-center justify-center space-y-10"
            style={{
                fontFamily: "Arthemis",
            }}
        >
            <h1 className="text-6xl font-bold lg:text-8xl">Not Found Page</h1>
            <hr
                className="w-3/4 rounded-lg border-2 border-orange-300 lg:w-1/4
            "
            />

            <p className="text-3xl font-bold text-white lg:text-6xl">
                You have reached in wrong page.
            </p>
            <a
                className="rounded-full bg-orange-300 py-4 px-8 text-xl font-bold text-white hover:bg-orange-400 "
                href="/"
            >
                Go To Home
            </a>
        </div>
    );
}
