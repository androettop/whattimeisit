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
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();
  const [isAiMode, setIsAiMode] = useState<boolean>(false);
  const [timezone, setTimezone] = useState<string>(get6PMTimezone());
  const [randomPhrase, setRandomPhrase] = useState<string>("");
  const [isArgMode, setIsArgMode] = useState<boolean>(false);
  const intervalId = useRef<number | null>(null);

  const phraseParts = buildMessageObject(randomPhrase);

  const handleChangePhraseAndTimezone = useStaticHandler(
    (forceAi?: boolean) => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }

      const country = getCountryOfTimezone(timezone);
      const time =
        country === NO_COUNTRY
          ? `${MAGIC_NUMBER}:00`
          : getTimeOfTimezone(timezone);

      setIsArgMode(
        ["argentina", "islas malvinas"].includes(country.toLowerCase()),
      );
      setTimezone(get6PMTimezone());

      const currentLanguage = i18n.language || "en";
      const newPhrase = applyParamsToPhrase(getRandomPhrase(currentLanguage), {
        country,
        time,
      });

      const useAiMode = typeof forceAi === "undefined" ? isAiMode : forceAi;

      if (useAiMode) {
        intervalId.current = typewriter(newPhrase, setRandomPhrase);
      } else {
        setRandomPhrase(newPhrase);
      }
    },
  );

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

  const handleToggleAiMode = () => {
    handleChangePhraseAndTimezone(!isAiMode);
    setIsAiMode(!isAiMode);
  };

  const handleChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("handleChangeLanguage");
    console.log(e.target.value);
    console.log(i18n.language);
    console.log(i18n);
    i18n.changeLanguage(e.target.value);
    handleChangePhraseAndTimezone();
  };

  return (
    <div
      className={`container ${isArgMode ? "argMode" : ""} ${isAiMode ? "aiMode" : ""}`}
    >
      <div className="language-selector">
        <label htmlFor="language-select">{t("changeLanguage")}</label>
        <select
          id="language-select"
          onChange={handleChangeLanguage}
          value={i18n.language}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
      <div className={`message-container`}>
        <h2 className="accent">{t("whatTimeIsIt")}</h2>
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
          onClick={() => handleChangePhraseAndTimezone()}
        >
          <span dangerouslySetInnerHTML={{ __html: t("hitOrClick") }}></span>
        </p>
      </div>
      <footer>
        <span>
          <a href="#" onClick={handleToggleAiMode}>
            {isAiMode ? t("disableAiMode") : t("enableAiMode")}
          </a>
        </span>
        <span className="divider">|</span>
        <span>
          {t("share")}:
          <a
            href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwhattimeisit.surge.sh%2F&t=What%20time%20is%20it%3F"
            target="_blank"
            rel="noreferrer"
          >
            {t("facebook")}
          </a>
          <a
            href="https://twitter.com/intent/tweet?source=https%3A%2F%2Fwhattimeisit.surge.sh%2F&text=What%20time%20is%20it%3F:%20whattimeisit.surge.sh"
            target="_blank"
            rel="noreferrer"
          >
            {t("twitter")}
          </a>
        </span>
        <span className="divider">|</span>
        <span>
          {t("source")}:
          <a
            href="https://github.com/androettop/whattimeisit"
            target="_blank"
            rel="noreferrer"
          >
            {t("github")}
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
