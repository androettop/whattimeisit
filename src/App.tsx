import React from "react";
import {
  get6PMTimezone,
  getCountryOfTimezone,
  getTimeOfTimezone,
} from "./helpers/dates";
import { phrases } from "./helpers/phrases";
import { MAGIC_NUMBER, NO_COUNTRY } from "./helpers/consts";

function App() {
  const timezone = get6PMTimezone();
  const country = getCountryOfTimezone(timezone);
  const time =
    country === NO_COUNTRY ? `${MAGIC_NUMBER}:00` : getTimeOfTimezone(timezone);

  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

  const parts = randomPhrase.split("%");

  const isArgMode = ["argentina", "islas malvinas"].includes(
    country.toLowerCase(),
  );

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
          return (
            <span key={index} className="accent">
              {time}
            </span>
          );
        case "country":
          return (
            <span key={index} className="accent">
              {country}
            </span>
          );
        default:
          return null;
      }
    }
  });

  return (
    <div className={`container ${isArgMode ? "argMode" : ""}`}>
      <div className={`message-container`}>
        <h2 className="accent">What time is it?</h2>
        <h1>{elements}</h1>
      </div>
      <footer>
        <span>
          Share:
          <a
            href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwhattimeisit.surge.sh%2F&t=What%20time%20is%20it%3F"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com/intent/tweet?source=https%3A%2F%2Fwhattimeisit.surge.sh%2F&text=What%20time%20is%20it%3F:%20whattimeisit.surge.sh"
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </a>
        </span>
        <span>|</span>
        <span>
          Source:
          <a
            href="https://github.com/androettop/whattimeisit"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
