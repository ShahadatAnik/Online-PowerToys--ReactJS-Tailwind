import React from "react";

export default function Home() {
    const link = [
        {
            name: "Line To Space Converter",
            path: "/LineToSpaceConverter",
            bg: "",
            hover: "hover:bg-blue-700",
            rotate: "origin-bottom rotate-12",
        },
        {
            name: "02",
            path: "/LineToSpaceConverter",
            bg: "",
            hover: "hover:bg-red-700",
            rotate: "origin-top-left rotate-20",
        },
        {
            name: "03",
            path: "/LineToSpaceConverter",
            bg: "",
            hover: "hover:bg-green-700",
            rotate: "origin-top-left rotate-30",
        },
        {
            name: "04",
            path: "/LineToSpaceConverter",
            bg: "",
            hover: "hover:bg-yellow-700",
            rotate: "origin-top-left rotate-40",
        },
    ];
    return (
        <div className="grid h-screen grid-cols-2 place-content-center gap-4">
            {link.map((item) => (
                <a
                    href={item.path}
                    className={`m-4 rounded-md p-16 text-center font-bold text-white duration-300 ${item.bg} ${item.hover} ${item.rotate} duration-900 transform transition ease-in-out`}
                >
                    {item.name}
                </a>
            ))}
        </div>
    );
}
