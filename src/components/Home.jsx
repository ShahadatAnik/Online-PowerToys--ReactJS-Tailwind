import React from "react";
import Wave from "../utils/Wave";
import "../assets/css/wave.css";

export default function Home() {
    const link = [
        {
            name: "Line To Space Converter",
            path: "/LineToSpaceConverter",
            hover: "green",
        },
        {
            name: "Line To Space Converter",
            path: "/LineToSpaceConverter",
            hover: "indigo",
        },
        {
            name: "Line To Space Converter",
            path: "/LineToSpaceConverter",
            hover: "pink",
        },
        {
            name: "Line To Space Converter",
            path: "/LineToSpaceConverter",
            hover: "red",
        },
    ];
    return (
        <div
            style={{
                fontFamily: "Arthemis",
            }}
        >
            <div class="inner-header lg:h-50 flex h-96">
                <div className="flex-1 text-6xl text-orange-400 lg:text-8xl">
                    Online PowerToys
                </div>
            </div>
            <Wave />
            <div className="grid grid-cols-2 place-content-center gap-2 bg-transparent ">
                {link.map((item) => (
                    <a
                        href={item.path}
                        className={`duration-900 translate m-4 translate-x-0 rounded-full p-16 text-center text-2xl font-bold text-white transition ease-in-out hover:ring-4 lg:text-5xl hover:ring-${item.hover}-400 hover:text-${item.hover}-400`}
                    >
                        {item.name}
                    </a>
                ))}
            </div>
        </div>
    );
}
