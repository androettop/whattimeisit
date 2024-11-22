import { v4 as uuid } from "uuid";
import { phrases } from "./phrases";

export type MessagePart = {
  id: string;
  accent: boolean;
  value: string;
};

export const getRandomPhrase = (): string => {
  return phrases[Math.floor(Math.random() * phrases.length)];
};

export const applyParamsToPhrase = (
  _phrase: string,
  params: Record<string, string>,
): string => {
  // prepare the phrase
  let phrase = _phrase.trim();
  for (const [key, value] of Object.entries(params)) {
    phrase = phrase.replace(`%${key}%`, `#${value}#`);
  }

  return phrase;
};

export const buildMessageObject = (phrase: string): MessagePart[] => {
  const result: MessagePart[] = [];

  // prepare the parts
  let currentPart: MessagePart = {
    id: uuid(),
    accent: false,
    value: "",
  };

  result.push(currentPart);

  // "#" means create a new part with !currentPart.accent
  for (let i = 0; i < phrase.length; i++) {
    if (phrase[i] === "#") {
      // ignore the last character to avoid creating an empty part
      if (i === phrase.length - 1) {
        continue;
      }
      currentPart = {
        id: uuid(),
        accent: !currentPart.accent,
        value: "",
      };
      result.push(currentPart);
    } else {
      currentPart.value += phrase[i];
    }
  }

  return result;
};
