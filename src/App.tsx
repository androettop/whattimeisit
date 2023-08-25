import React from "react";
import {
  NO_COUNTRY,
  get6PMTimezone,
  getCountryOfTimezone,
  getTimeOfTimezone,
} from "./helpers/dates";
import { phrases } from "./helpers/phrases";

function App() {
  const timezone = get6PMTimezone();
  const country = getCountryOfTimezone(timezone);
  const time = country === NO_COUNTRY ? "18:00" : getTimeOfTimezone(timezone);

  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  // split the phrase into an array of parts
  const parts = randomPhrase.split("%");

  const isArgMode = ['argentina', 'falkland islands'].includes(country.toLowerCase());

  
  // create an array of JSX elements
  const elements = parts.map((part, index) => {
    // if the part is even, it's a string
    if (index % 2 === 0) {
      return <span key={index}>{part}</span>;
    }
    // if the part is odd, it's a placeholder
    else {
      // replace the placeholder with the corresponding value
      switch (part) {
        case "time":
          return <span className="accent">{time}</span>;
        case "country":
          return <span className="accent">{country}</span>;
        default:
          return null;
      }
    }
  });

  return (
    <div className={`message-container ${isArgMode ? 'arg' : ''}`}>
      <h2 className="accent">What time is it?</h2>
      <h1>{elements}</h1>
    </div>
  );
}

export default App;
