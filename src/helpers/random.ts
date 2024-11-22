import { phrases } from "./phrases";

export const getRandomPhrase = (): string => {
    return phrases[Math.floor(Math.random() * phrases.length)]
}