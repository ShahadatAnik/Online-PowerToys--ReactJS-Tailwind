import React from "react";
import Wave from "../utils/Wave";
import "../assets/css/wave.css";

export default function Home() {
    const link = [
        {
            name: "Line To Space Converter",
            path: "/LineToSpaceConverter",
            bg: "",
            hover: "hover:ring-green-400 hover:text-green-400",
            rotate: "",
        },
        {
            name: "Line To Space Converter",
            path: "/LineToSpaceConverter",
            bg: "",
            hover: "hover:ring-indigo-400 hover:text-indigo-400",

            rotate: "",
        },
        {
            name: "Line To Space Converter",
            path: "/LineToSpaceConverter",
            bg: "",
            hover: "hover:ring-pink-400 hover:text-pink-400",

            rotate: "",
        },
        {
            name: "Line To Space Converter",
            path: "/LineToSpaceConverter",
            bg: "",
            hover: "hover:ring-red-400 hover:text-red-400",

            rotate: "",
        },
    ];
    return (
        <div
            style={{
                fontFamily: "Arthemis",
            }}
        >
            <div class="inner-header flex">
                <div className="flex-1 text-2xl text-orange-400 lg:text-8xl">
                    Online PowerToys
                </div>
            </div>
            <Wave />
            <div className="grid grid-cols-2 place-content-center gap-4 bg-transparent ">
                {link.map((item) => (
                    <a
                        href={item.path}
                        className={`duration-900 duration-900 duration-900 duration-900 m-4 
                        rounded-full p-16 text-center text-xl 
                        font-bold text-white
                        transition   ease-in-out  hover:ring-4 lg:text-5xl ${item.bg} ${item.hover} ${item.rotate} `}
                    >
                        {item.name}
                    </a>
                ))}
            </div>
        </div>
    );
}
