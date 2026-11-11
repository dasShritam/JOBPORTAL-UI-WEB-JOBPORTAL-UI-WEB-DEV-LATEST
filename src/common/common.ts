import moment from "moment";
import { ChangeEvent, useEffect, useRef, useState } from "react";
const halfMonthList: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const fullMonthList: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const createData = (input: any, isValueNumber: boolean = false) => {
  return input?.map((e: any, i: any) => {
    return {
      label: e,
      value: isValueNumber ? i : e,
    };
  });
};
export const createDataWithId = (
  input: any,
  isValueNumber: boolean = false
) => {
  return input?.map((e: any) => {
    return {
      label: e.value,
      value: isValueNumber ? e.id : e.value,
    };
  });
};
export const createSingleData = (input: any) => {
  return {
    label: input,
    value: input,
  };
};

export const GetFutureYears = (
  number: number,
  isSelect: boolean = true
): number[] => {
  const currentYear = new Date().getFullYear();
  const yearList: number[] = [currentYear];
  for (let index = 1; index < number; index++) {
    yearList.push(currentYear + index);
  }
  return isSelect ? createData(yearList) : yearList;
};

export const GetMonths = (
  year: number,
  isHalfMonth: boolean = false,
  isSelect: boolean = true
): string[] => {
  const currentYear = new Date().getFullYear();
  const monthList = isHalfMonth ? [...halfMonthList] : [...fullMonthList];

  if (currentYear == year) {
    const currentMonth = new Date().getMonth();
    monthList.splice(0, currentMonth);
  }
  return isSelect ? createData(monthList) : monthList;
};

export const GetDaysInMonth = (
  year: number,
  monthName: string,
  monthNumber: number = 0,
  isSelect: boolean = true,
  isValidate: boolean = true
): string[] => {
  let monthIndex =
    monthNumber !== 0
      ? monthNumber + 1
      : monthName?.length > 3
      ? fullMonthList.indexOf(monthName) + 1
      : halfMonthList.indexOf(monthName) + 1;

  const noOfDays = new Date(year, monthIndex, 0).getDate();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const days: string[] = [];

  const startIndex = isValidate
    ? currentYear == year && monthIndex == currentMonth
      ? new Date().getDate()
      : 1
    : 1;

  for (let index = startIndex; index <= noOfDays; index++) {
    const day = index <= 9 ? `0${index}` : index.toString();
    days.push(day);
  }
  return isSelect ? createData(days) : days;
};

export const GetYearOfExp = (years: number, isSelect: boolean = true) => {
  const yearList: string[] = ["0 Year", "1 Year"];
  for (let index = 2; index < years + 1; index++) {
    yearList.push(index + " Years");
  }
  return isSelect ? createData(yearList) : yearList;
};

export const GetMonthOfExp = (isSelect: boolean = true) => {
  const monthList: string[] = ["0 Month", "1 Month"];
  for (let index = 2; index < 12; index++) {
    monthList.push(index + " Months");
  }
  return isSelect ? createData(monthList) : monthList;
};

export const GetPastYears = (
  futureYears: number = 0,
  isSelect: boolean = true
) => {
  const previous = 50;
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - previous;
  let yearList: string[] = [];
  for (let index = 1; index <= previous + futureYears; index++) {
    yearList.push((startYear + index).toString());
  }
  return isSelect ? createData(yearList) : yearList;
};

export const GetAllMonths = (
  isHalfMonth: boolean = true,
  isSelect: boolean = true,
  isValueNumber: boolean = false
): string[] | any | any => {
  const currentYear = new Date().getFullYear();
  const monthList = isHalfMonth ? [...halfMonthList] : [...fullMonthList];

  return isSelect ? createData(monthList, isValueNumber) : monthList;
};

export const GetMonthNameFromTimeStamp = (
  timeStamp: number,
  isHalfMonth: boolean = true,
  isNumberRequired: boolean = false
): any => {
  if (!timeStamp || timeStamp == 0) return "";

  const month = new Date(timeStamp * 1000).getMonth();
  const monthList = isHalfMonth ? [...halfMonthList] : [...fullMonthList];
  return month >= 0 && month < 12
    ? isNumberRequired
      ? month
      : monthList[month]
    : "";
};

export const GetYearFromTimeStamp = (timeStamp: number): number | string => {
  if (!timeStamp || timeStamp == 0) return "";
  return new Date(timeStamp * 1000).getFullYear();
};

export const GetDayFromTimeStamp = (timeStamp: number): string => {
  if (!timeStamp || timeStamp == 0) return "";
  let day = new Date(timeStamp * 1000).getDate();
  return day <= 9 ? `0${day}` : day.toString();
};

export const GetTimeFromTimeStamp = (timeStamp: number): string => {
  if (!timeStamp || timeStamp == 0) return "";
  let timestamp = timeStamp * 1000;
  let time = new Date(timestamp).toLocaleTimeString();
  return time;
};

export const bytesToMegabytes = (bytes: number): number => {
  const megabytes = Math.ceil(bytes / 1024 / 1024);
  return megabytes;
};

export const GetDisplayDateFromTimeStamp = (timeStamp: any) => {
  if (timeStamp) {
    const today = new Date().toLocaleDateString();
    const incomingDate = new Date(timeStamp * 1000).toLocaleDateString();
    if (today == incomingDate) return "Today";
    return `${GetDayFromTimeStamp(timeStamp)} ${GetMonthNameFromTimeStamp(
      timeStamp
    )}, ${GetYearFromTimeStamp(timeStamp)} `;
  }
  return "NA";
};

export const GetFutureOrPastMonths = (
  year: number | string,
  data: any,
  isPast: boolean = false
) => {
  const currentYear = new Date().getFullYear();
  let returnData: any = [];
  if (year === currentYear) {
    const completedMonths = new Date().getMonth();
    if (isPast) {
      returnData = data.slice(0, completedMonths + 1);
    } else {
      for (let i = completedMonths + 1; i < data.length; i++) {
        returnData.push(data[i]);
      }
    }
  }
  return returnData;
};

export const daysComparision = (postDate: any) => {
  const date1 = new Date(parseInt(postDate));
  const date2 = new Date();
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return diffDays - 1;
};
export const getRandomNumber = (length: number): number => {
  return Math.floor(Math.random() * length + 1);
};

const isValidTimestamp = (timestamp: number): boolean => {
  if (timestamp?.toString().length === 13) {
    // 13-digit number, assume it's in milliseconds
    return true;
  } else if (timestamp.toString().length === 10) {
    // 10-digit number, assume it's in seconds
    return false;
  } else {
    // Invalid timestamp
    return false;
  }
};

export function getDateDifference(postDate) {
  let postDateTime: any = null;
  if (isValidTimestamp(postDate)) {
    postDateTime = new Date(postDate);
  } else {
    postDateTime = new Date(postDate * 1000);
  }

  const today = new Date();
  const timeDiff = Math.abs(today.getTime() - postDateTime.getTime());
  const diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
  const diffYears = today.getFullYear() - postDateTime.getFullYear();
  const diffMonths =
    today.getMonth() - postDateTime.getMonth() + diffYears * 12;

  return diffDays === 0
    ? "Today"
    : diffDays === 1
    ? "1 day ago"
    : diffDays < 30
    ? `${diffDays} days ago`
    : diffDays < 365
    ? `${Math.floor(diffDays / 30)} ${
        Math.floor(diffDays / 30) === 1 ? "month" : "months"
      } ago`
    : `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
}

export const Content = (text, limit) => {
  const maxLength = limit;
  const trimmedText =
    text?.length > maxLength ? text?.substring(0, maxLength) + "..." : text;
  return trimmedText;
};

export function formatNumberToSalary(num) {
  if (num < 1000) {
    return num + "";
  } else if (num >= 1000 && num < 100000) {
    return " " + (num / 1000).toFixed(1) + " K ";
  } else if (num >= 100000 && num < 10000000) {
    return " " + (num / 100000).toFixed(1) + " Lakh ";
  } else if (num >= 10000000) {
    return " " + (num / 10000000).toFixed(1) + " Cr ";
  }
}

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const options: any = { month: "short", year: "numeric" };
  const formattedMonthYear = date.toLocaleDateString("en-US", options);

  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const formattedDay = `${day}${suffix}`;

  const month = formattedMonthYear.split(" ")[0];
  const year = formattedMonthYear.split(" ")[1];

  return `${formattedDay}-${month}-${year}`;
};

export const getTimestampToDate = (
  timestamp,
  dateInput: Date | null = null
) => {
  const date = dateInput ?? new Date(timestamp * 1000);
  const options: any = { month: "short", year: "numeric" };
  const formattedMonthYear = date.toLocaleDateString("en-US", options);

  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const formattedDay = `${day}${suffix}`;

  const month = formattedMonthYear.split(" ")[0];
  const year = formattedMonthYear.split(" ")[1];

  return `${formattedDay} ${month} ${year}`;
};

function getOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  } else {
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
}

export function getTimeStampForTime(timeStr) {
  const [hours, minutes] = timeStr.split(":");
  const dateObj = new Date();
  dateObj.setHours(hours);
  dateObj.setMinutes(minutes);
  return new Date(dateObj);
}

export function past_timestamp(day: number) {
  const date = new Date();
  date.setDate(date.getDate() - day);
  return Math.floor(+date / 1000);
}

export function convertformatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const options: any = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    // second: "numeric",
    hour12: true,
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate;
}

export function convertformatTimestampByNaushad(timestamp: number): string {
  const date = new Date(timestamp);
  const options: any = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate;
}

export const openInNewTab = (url: any) => {
  window.open(url, "_blank");
};

export const convertHtmlToText = (input: any) => {
  const parser = new DOMParser();

  const data = parser.parseFromString(input, "text/html");

  return data.body.textContent;
};

export const convertTo12HourFormat = (timestamp: string): string => {
  const date = new Date(`2000-01-01T${timestamp}`);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours %= 12;
  hours = hours || 12;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const StateWiesPlaces = (arr: string[]) => {
  let states = arr?.map((e) => {
      return e?.split(", ")[1];
    }),
    outputArray: any = [];
  const uniqueState: any = Array?.from(new Set(states));
  for (let i = 0; i < uniqueState?.length; ++i) {
    outputArray?.push(
      `${uniqueState[i]}: ` +
        arr
          ?.filter((str) => str?.includes(uniqueState[i]))
          ?.map((str) => str?.replace(`, ${uniqueState[i]}`, ""))
          ?.join(", ")
    );
  }
  return outputArray;
};

export const customStyles = {
  option: (styles, state) => ({
    ...styles,
    cursor: "pointer",
  }),
};

export function convertNumberToWeekday(number) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (number >= 0 && number <= 6) {
    return weekdays[number];
  } else {
    return "Invalid number";
  }
}

export const convert_date_unix_ts = (date: Date) => {
  return Math.floor(+new Date(date) / 1000);
};

export function formatExperience(months) {
  if (months <= 0) {
    return "No experience";
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years > 0 && remainingMonths > 0) {
    return `${years} year ${remainingMonths} month${
      remainingMonths !== 1 ? "s" : ""
    }`;
  } else if (years > 0) {
    return `${years} year${years !== 1 ? "s" : ""}`;
  } else {
    return `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
  }
}

export function convertSecondsToHours(seconds) {
  const hours = Math.floor(seconds / 3600); // Calculate the whole hours
  const minutes = Math.floor((seconds % 3600) / 60); // Calculate the remaining minutes
  const remainingSeconds = seconds % 60; // Calculate the remaining seconds

  let timeString = `${hours}h ${minutes}m`;
  if (remainingSeconds > 0) {
    timeString += ` ${remainingSeconds}s`;
  }

  return timeString;
}

export function formatExperience1(months) {
  if (months <= 0) {
    return "0 years";
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years > 0 && remainingMonths > 0) {
    return `${years} year ${remainingMonths} month${
      remainingMonths !== 1 ? "s" : ""
    }`;
  } else if (years > 0) {
    return `${years} year${years !== 1 ? "s" : ""}`;
  } else {
    return `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
  }
}
