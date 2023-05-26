import { useEffect, useState } from "react";
import { showToast } from "./Toast";

import BackBtn from "../utils/BackBtn";

export default function AgeCalculator() {
	const [text, setText] = useState("");
	const [from, setFrom] = useState();
	const [to, setTo] = useState(new Date());

	const TOyear = new Date(to)?.getFullYear();
	const TOmonth =
		new Date(to)?.getMonth() + 1 < 10
			? `0${new Date(to)?.getMonth() + 1}`
			: new Date(to)?.getMonth() + 1;
	const TOday =
		new Date(to)?.getDate() < 10
			? `0${new Date(to)?.getDate()}`
			: new Date(to)?.getDate();

	function copyToClipboard() {
		navigator.clipboard.writeText(text);
		showToast({ status: "create", message: "Text Copied" });
	}
	var years,
		leftOutMonthsFromYears,
		leftOutDaysFromYearsAndMonths,
		months,
		leftOutDaysFromMonths,
		weeks,
		leftOutDaysFromWeeks,
		days,
		hours,
		minutes,
		seconds;

	useEffect(() => {
		setText(
			`${years} years ${leftOutMonthsFromYears} months ${leftOutDaysFromYearsAndMonths} days.\n${months} months ${leftOutDaysFromMonths} days.\n${weeks} weeks ${leftOutDaysFromWeeks} days.\n${days} days.\n${hours} hours.\n${minutes} minutes.\n${seconds} seconds.`
		);
	}, [from, to]);

	// age calculator
	function calculateAge() {
		const diff = new Date(to) - new Date(from);

		if (diff < 0) {
			showToast({
				status: "error",
				message: "From Date should be older than to date",
			});
			return;
		}

		// {years} years {leftOutMonthsFromYears} months {leftOutDaysFromYearsAndMonths} days
		years = Math.floor(diff / 1000 / 60 / 60 / 24 / 365);
		leftOutMonthsFromYears = Math.floor(
			(diff / 1000 / 60 / 60 / 24 / 365 - years) * 12
		);
		leftOutDaysFromYearsAndMonths = Math.floor(
			(diff / 1000 / 60 / 60 / 24 / 365 -
				years -
				leftOutMonthsFromYears / 12) *
				365
		);

		// or {months} months {leftOutDaysFromMonths} days
		months = Math.floor((diff / 1000 / 60 / 60 / 24 / 365) * 12);
		leftOutDaysFromMonths = Math.floor(
			(diff / 1000 / 60 / 60 / 24 / 365 - months / 12) * 365
		);

		// or {weeks} weeks {leftOutDaysFromWeeks} days
		weeks = Math.floor(diff / 1000 / 60 / 60 / 24 / 7);
		leftOutDaysFromWeeks = Math.floor((diff / 1000 / 60 / 60 / 24) % 7);

		// or {days} days
		days = Math.floor(diff / 1000 / 60 / 60 / 24);

		// or {hours} hours
		hours = Math.floor(diff / 1000 / 60 / 60);

		// or {minutes} minutes
		minutes = Math.floor(diff / 1000 / 60);

		// or {seconds} seconds
		seconds = Math.floor(diff / 1000);

		return (
			<div className="flex flex-col text-2xl lg:w-3/4 lg:text-4xl ">
				<p className="mb-2">
					{years} years {leftOutMonthsFromYears} months{" "}
					{leftOutDaysFromYearsAndMonths} days
				</p>
				<p className="mb-2">
					or {months} months {leftOutDaysFromMonths} days
				</p>
				<p className="mb-2">
					or {weeks} weeks {leftOutDaysFromWeeks} days
				</p>
				<p className="mb-2">or {days} days</p>
				<p className="mb-2">or {hours} hours</p>
				<p className="mb-2">or {minutes} minutes</p>
				<p>or {seconds} seconds</p>
			</div>
		);
	}

	return (
		<>
			<BackBtn />

			<div className="mt-20 flex h-screen flex-col items-center lg:mt-5">
				<div className="mb-4 flex w-4/5 flex-row items-center p-4 font-bold text-orange-400 lg:w-3/4">
					<div className="flex-1 text-left text-2xl lg:text-6xl">
						Age Calculator
					</div>
					<div
						className="flex-none items-center text-right"
						onClick={copyToClipboard}
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
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				</div>

				<div className="flex flex-col text-2xl lg:w-3/4 lg:flex-row lg:text-4xl ">
					<div className="mr-1 flex grow flex-col p-4">
						<label className="font-semibold">From</label>
						<input
							className="grow rounded-sm p-2 lg:p-4"
							type="date"
							onChange={(e) => {
								setFrom(e.target.value);
							}}
						/>
					</div>
					<div className="ml-1 flex grow flex-col p-4">
						<label className="font-semibold">To</label>
						<input
							className="grow rounded-sm p-2 lg:p-4"
							type="date"
							value={`${TOyear}-${TOmonth}-${TOday}`}
							onChange={(e) => {
								setTo(e.target.value);
							}}
						/>
					</div>
				</div>

				{from && to && (
					<div className="flex w-2/3 flex-col items-center text-2xl lg:w-3/4 lg:flex-row lg:text-4xl">
						{calculateAge()}
					</div>
				)}
			</div>
		</>
	);
}
