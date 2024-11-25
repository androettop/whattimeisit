import { useCallback, useEffect, useRef, useState } from "react";
import {
  get6PMTimezone,
  getCountryOfTimezone,
  getTimeOfTimezone,
} from "./helpers/dates";
import { phrases } from "./helpers/phrases";
import { MAGIC_NUMBER, NO_COUNTRY } from "./helpers/consts";
import {
  applyParamsToPhrase,
  buildMessageObject,
  getRandomPhrase,
} from "./helpers/phraseProcessing";
import { throttle } from "./helpers/throttle";
import { typewriter } from "./helpers/typewriter";
import useStaticHandler from "./hooks/useStaticHandler";

function App() {
  const [isAiMode, setIsAiMode] = useState<boolean>(false);
  const [timezone, setTimezone] = useState<string>(get6PMTimezone());
  const [randomPhrase, setRandomPhrase] = useState<string>("");
  const [isArgMode, setIsArgMode] = useState<boolean>(false);
  const intervalId = useRef<number | null>(null);

  const phraseParts = buildMessageObject(randomPhrase);

  const handleChangePhraseAndTimezone = useStaticHandler(() => {
    const country = getCountryOfTimezone(timezone);

    const time =
      country === NO_COUNTRY
        ? `${MAGIC_NUMBER}:00`
        : getTimeOfTimezone(timezone);

    setIsArgMode(
      ["argentina", "islas malvinas"].includes(country.toLowerCase()),
    );
    setTimezone(get6PMTimezone());

    const newPhrase = applyParamsToPhrase(getRandomPhrase(), { country, time });
    if (isAiMode) {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
      intervalId.current = typewriter(newPhrase, setRandomPhrase);
    } else {
      setRandomPhrase(newPhrase);
    }
  });

  const throttledHandleChangePhraseAndTimezone = throttle(
    handleChangePhraseAndTimezone,
    50,
  );

  useEffect(() => {
    handleChangePhraseAndTimezone();

    const phraseChangeHandler = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        throttledHandleChangePhraseAndTimezone();
      }
    };
    window.addEventListener("keydown", phraseChangeHandler);

    return () => {
      window.removeEventListener("keydown", phraseChangeHandler);
    };
  }, []);

  const handleEnableAiMode = () => {
    setIsAiMode(!isAiMode);
    handleChangePhraseAndTimezone(!isAiMode);
  };

  return (
    <div
      className={`container ${isArgMode ? "argMode" : ""} ${isAiMode ? "aiMode" : ""}`}
    >
      <div className={`message-container`}>
        <h2 className="accent">What time is it?</h2>
        <h1>
          {phraseParts.map((part) => (
            <span key={part.id} className={part.accent ? "accent" : ""}>
              {part.value}
            </span>
          ))}
        </h1>
        <p
          className="change-phrase"
          role="button"
          tabIndex={0}
          onClick={() => handleChangePhraseAndTimezone(isAiMode)}
        >
          Hit <span className="change-btn">Space</span> or Click
        </p>
      </div>
      <footer>
        <span>
          <a href="#" onClick={handleEnableAiMode}>
            ✨ {isAiMode ? "Disable" : "Enable"} AI Mode
          </a>
        </span>
        <span className="divider">|</span>
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
        <span className="divider">|</span>
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
