import moment from "moment-timezone";
import momentData from "moment-timezone/data/meta/latest.json";

const zones = momentData.zones as Record<string, { countries: string[] }>;
const countries = momentData.countries as Record<
  string,
  { name: string; zones: string[] }
>;
const zonesNames = Object.keys(zones);

export const NO_COUNTRY = "Narnia";

export const get6PMTimezone = () => {
  const timezones = zonesNames.filter((name) => {
    const time = moment().tz(name).format("HH");

    return !name.startsWith("Etc/") && time === "18";
  });

  const randomTimezone =
    timezones[Math.floor(Math.random() * timezones.length)];
  return randomTimezone;
};

export const getTimeOfTimezone = (timezone: string) => {
  const time = moment().tz(timezone).format("HH:mm");

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
