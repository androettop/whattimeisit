import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import momentData from "moment-timezone/data/meta/latest.json";
import { MAGIC_NUMBER, NO_COUNTRY } from "./consts";

dayjs.extend(timezone);
dayjs.extend(utc);

const zones = momentData.zones as Record<string, { countries: string[] }>;
const countries = momentData.countries as Record<
  string,
  { name: string; zones: string[] }
>;
const zonesNames = Object.keys(zones);

export const get6PMTimezone = () => {
  const addedCountries: string[] = [];
  const timezones = zonesNames.filter((name) => {
    const time = dayjs().tz(name).format("HH");
    const zone = zones[name] || { countries: [""] };
    const country = countries[zone.countries?.[0]]?.name || NO_COUNTRY;

    // Filter Etc/ timezones
    if (name.startsWith("Etc/")) {
      return false;
    }

    // Filter sad timezones
    if (time !== MAGIC_NUMBER) {
      return false;
    }

    // Filter countries that are already added
    if (addedCountries.includes(country)) {
      return false;
    }

    addedCountries.push(country);
    return true;
  });

  const randomTimezone =
    timezones[Math.floor(Math.random() * timezones.length)];
  return randomTimezone;
};

export const getTimeOfTimezone = (timezone: string) => {
  const time = dayjs().tz(timezone).format("HH:mm");

  return time;
};

export const getCountryOfTimezone = (timezone: string) => {
  const zone = zones[timezone] || { countries: [""] };
  const country = countries[zone.countries?.[0]]?.name || NO_COUNTRY;

  if (country.toLocaleLowerCase() === "falkland islands") {
    return "Islas Malvinas";
  }

  return country;
};