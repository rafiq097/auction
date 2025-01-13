import { atom } from "recoil";

export type Player = {
  name: string;
  role: string;
  base: number;
  country: string;
  type: string;
  price: number;
};

export type Team = {
  name: string;
  spent: number;
  remaining: number;
  players: Player[];
};

export const teamsAtom = atom<Team[]>({
  key: "teamsState",
  default: [
    {
      name: "RCB",
      spent: 0,
      remaining: 120,
      players: [],
    },
    {
      name: "MI",
      spent: 0,
      remaining: 120,
      players: [],
    },
    {
      name: "CSK",
      spent: 0,
      remaining: 120,
      players: [],
    },
    {
      name: "DC",
      spent: 0,
      remaining: 120,
      players: [],
    },
    {
      name: "KKR",
      spent: 0,
      remaining: 120,
      players: [],
    },
    {
      name: "SRH",
      spent: 0,
      remaining: 120,
      players: [],
    },
    {
      name: "RR",
      spent: 0,
      remaining: 120,
      players: [],
    },
    {
      name: "PBKS",
      spent: 0,
      remaining: 120,
      players: [],
    },
    {
      name: "LSG",
      spent: 0,
      remaining: 120,
      players: [],
    },
    {
      name: "GT",
      spent: 0,
      remaining: 120,
      players: [],
    },
  ],

  effects: [
    ({ onSet, setSelf }) => {
      const savedTeams = localStorage.getItem("teams");
      if (savedTeams) {
        try {
          setSelf(JSON.parse(savedTeams));
        } catch (error) {
          console.error("Error parsing localStorage teams data:", error);
        }
      }

      onSet((newValue) => {
        try {
          localStorage.setItem("teams", JSON.stringify(newValue));
        } catch (error) {
          console.error("Error saving teams data to localStorage:", error);
        }
      });

      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === "teams") {
          setSelf(JSON.parse(event.newValue || "[]"));
        }
      };

      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    },
  ],
});
