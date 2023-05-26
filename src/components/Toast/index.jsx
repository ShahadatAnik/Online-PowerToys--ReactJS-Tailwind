import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastBody = ({ text }) => (
	<div
		className="flex items-center"
		// onClick={() => navigator.clipboard.writeText(text.split(" ")[0])}
	>
		<div className="flex-1">
			<p className="text-sm font-medium text-gray-900">{text}</p>
		</div>
		<div className="ml-4 flex-shrink-0">
			<button className="inline-flex text-orange-400 transition duration-150 ease-in-out hover:text-orange-500 focus:text-orange-500 focus:outline-none">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-5"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
					/>
				</svg>
			</button>
		</div>
	</div>
);

const successToast = (text) => toast.success(<ToastBody {...{ text }} />);
const warningToast = (text) => toast.warn(<ToastBody {...{ text }} />);
const errorToast = (text) => toast.error(<ToastBody {...{ text }} />);

const showToast = ({ status, message }) => {
	console.log(status, message);
	switch (status) {
		case "create":
			successToast(message);
			break;
		case "update":
			successToast(message);
			break;
		case "delete":
			errorToast(message);
			break;
		case "error":
			errorToast(message);
			break;
		case "warning":
			warningToast(message);
			break;
	}
};

const DefaultConfig = {
	position: "top-right",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	closeButton: false,
};

const Toast = () => {
	return (
		<ToastContainer
			style={{ width: "auto" }}
			transition={Slide}
			{...DefaultConfig}
		/>
	);
};

export { Toast, showToast, successToast, warningToast, errorToast };
