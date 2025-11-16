import { useCallback, useEffect, useRef, useState } from "react";
import {
  get6PMTimezone,
  getCountryOfTimezone,
  getTimeOfTimezone,
} from "./helpers/dates";
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

      const currentLanguage = i18n.language;
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
    handleTitleUpdate();
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

  const handleTitleUpdate = () => {
    window.document.title = t("whatTimeIsIt");
  };

  const handleChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
    handleTitleUpdate();
    handleChangePhraseAndTimezone();
  };

  return (
    <div
      className={`container ${isArgMode ? "argMode" : ""} ${isAiMode ? "aiMode" : ""}`}
    >
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
          {t("hit")} <span className="change-btn">{t("space")}</span>{" "}
          {t("click")}
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
          {t("changeLanguage")}:
          <select
            className="language-select"
            onChange={handleChangeLanguage}
            value={i18n.language}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="it">Italiano</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="pt">Português</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="sim">Simlish</option>
          </select>
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
