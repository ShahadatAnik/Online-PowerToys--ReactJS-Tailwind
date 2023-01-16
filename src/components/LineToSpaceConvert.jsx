import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ButtonCustom({
    isLoading = true,
    isDisabled = false,
    extraClassName = "",
    type = "",
    text = "Submit",
    ...rest
}) {
    var defaultButton =
        "flex items-center justify-center rounded-full bg-orange-400 py-2 px-4 font-bold text-white button-lg";
    var hoverButton = "hover:bg-orange-700";
    var transformButton = "transform duration-300 ease-in-out hover:scale-110";
    var focusedButton = "focus:outline-none focus:ring-2 focus:ring-orange-600";
    var disabledButton = "";

    if (isLoading) {
        disabledButton = "cursor-not-allowed opacity-50";
    } else {
        disabledButton = "cursor-pointer";
    }

    var className =
        defaultButton +
        " " +
        hoverButton +
        " " +
        transformButton +
        " " +
        disabledButton +
        " " +
        // focusedButton +
        // " " +
        extraClassName;

    return (
        <button type={type} className={className} {...rest}>
            {isLoading ? (
                <>
                    <svg
                        aria-hidden="true"
                        className="mr-2 h-6 w-6 animate-spin fill-orange-400 stroke-2 text-gray-200 dark:text-gray-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    Processing...
                </>
            ) : (
                text
            )}
        </button>
    );
}

export default function LineToSpaceConvert() {
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setText(text.replace(/\n/g, " "));
        }, 300);
    };

    function copyToClipboard() {
        navigator.clipboard.writeText(text);

        toast.success("Text Copied", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    return (
        <form
            className="flex h-screen flex-col items-center justify-center"
            onSubmit={onSubmit}
        >
            <div className="mb-4 flex w-3/4 flex-row items-center font-bold text-orange-400">
                <div className="flex-1 text-left sm:text-2xl lg:text-4xl">
                    Line to Space Converter
                </div>
                <div
                    className="flex-none items-center text-right"
                    onClick={copyToClipboard}
                >
                    <svg
                        className="w-8 cursor-pointer fill-orange-400"
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
                className="h-2/3 w-3/4 resize-none rounded-md p-2 text-lg duration-300 focus:caret-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400"
                placeholder="Enter text here"
                value={text}
                required
                onChange={(e) => setText(e.target.value)}
            />
            <ButtonCustom
                type="Submit"
                extraClassName="mt-3 w-1/4 text-lg"
                isLoading={isLoading}
                text="Convert"
            />
            <ToastContainer
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable={false}
                className="text-lg"
            />
        </form>
    );
}