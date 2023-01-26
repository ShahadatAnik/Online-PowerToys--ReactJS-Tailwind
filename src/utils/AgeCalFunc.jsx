import React from "react";

export default function AgeCalFunc() {
    // calculate age in years, months, days, hours, minutes, seconds
    const from = new Date(from);
    const to = new Date(to);
    const diff = to - from;

    const years = Math.floor(diff / 1000 / 60 / 60 / 24 / 365);
    const months = Math.floor((diff / 1000 / 60 / 60 / 24 / 365 - years) * 12);
    const days = Math.floor(
        (diff / 1000 / 60 / 60 / 24 / 365 - years - months / 12) * 365
    );
    const hours = Math.floor(
        (diff / 1000 / 60 / 60 / 24 / 365 - years - months / 12 - days / 365) *
            24
    );
    const minutes = Math.floor(
        (diff / 1000 / 60 / 60 / 24 / 365 -
            years -
            months / 12 -
            days / 365 -
            hours / 24) *
            60
    );
    const seconds = Math.floor(
        (diff / 1000 / 60 / 60 / 24 / 365 -
            years -
            months / 12 -
            days / 365 -
            hours / 24 -
            minutes / 60) *
            60
    );

    return {
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
    };
}
