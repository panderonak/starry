import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { ANIMALS, STORAGE_KEY } from "@/app/config";

export const useUsername = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const generateUsername = () => {
      const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];

      return `${word}-${nanoid(5)}`;
    };

    const stores = localStorage.getItem(STORAGE_KEY);

    if (stores) return setUsername(stores);

    const generatedUsername = generateUsername();

    localStorage.setItem(STORAGE_KEY, generatedUsername);

    setUsername(generatedUsername);
  }, []);

  return { username };
};
