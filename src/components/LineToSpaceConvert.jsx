import { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import BackBtn from "../utils/BackBtn";
import Button from "../utils/Button";

export default function LineToSpaceConvert() {
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setText(text.replace(/\n/g, " "));
            toast.success("Text Converted", {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }, 500);
    };

    function copyToClipboard() {
        navigator.clipboard.writeText(text);

        toast.success("Text Copied", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "black-background",
        });
    }

    return (
        <>
            <BackBtn />
            <form
                className="flex h-screen flex-col items-center justify-center"
                onSubmit={onSubmit}
            >
                <div className="mb-4 flex w-4/5 flex-row items-center font-bold text-orange-400 lg:w-3/4">
                    <div
                        className="flex-1 text-left text-2xl lg:text-6xl"
                        style={{
                            fontFamily: "Arthemis",
                        }}
                    >
                        Line to Space Converter
                    </div>
                    <div
                        className="flex-none items-center text-right"
                        onClick={copyToClipboard}
                        // data-bs-toggle="tooltip"
                        // title="Copy to Clipboard"
                    >
                        <svg
                            className="w-8 cursor-pointer fill-orange-400 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:fill-orange-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3 16V4C3 2.89543 3.89543 2 5 2H15M9 22H18C19.1046 22 20 21.1046 20 20V8C20 6.89543 19.1046 6 18 6H9C7.89543 6 7 6.89543 7 8V20C7 21.1046 7.89543 22 9 22Z"
                                stroke="#000000"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </div>
                </div>
                <textarea
                    className="h-2/3 w-4/5 resize-none rounded-md p-2 text-lg duration-300 focus:caret-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400 lg:w-3/4"
                    placeholder="Enter text here to convert"
                    value={text}
                    required
                    // autoFocus
                    onChange={(e) => setText(e.target.value)}
                />
                <Button
                    type="Submit"
                    extraClassName="mt-3 w-2/3 lg:w-2/5"
                    isLoading={isLoading}
                    text="Convert"
                />
                <ToastContainer
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    draggable={false}
                />
            </form>
        </>
    );
}
