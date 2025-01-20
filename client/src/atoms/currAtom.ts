import { atom } from "recoil";

export const currAtom = atom<number>({
  key: "currAtom",
  default: 0,
  effects: [
    ({ onSet, setSelf }) => {
      const curr = localStorage.getItem("curr");
      if (curr) {
        try {
          setSelf(JSON.parse(curr));
        } catch (error) {
          console.error("Error parsing localStorage curr data:", error);
        }
      }

      onSet((newValue) => {
        try {
          localStorage.setItem("curr", JSON.stringify(newValue));
        } catch (error) {
          console.error("Error saving curr data to localStorage:", error);
        }
      });

      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === "curr") {
          setSelf(JSON.parse(event.newValue || "0"));
        }
      };

      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    },
  ],
});
