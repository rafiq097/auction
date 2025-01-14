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
  batters: number;
  bowlers: number;
  wks: number;
  allr: number;
  overseas: number;
};

export const userTeamAtom = atom<Team>({
  key: "userTeamState",
  default: {
    name: "",
    spent: 0,
    remaining: 120,
    players: [],
    batters: 0,
    bowlers: 0,
    wks: 0,
    allr: 0,
    overseas: 0,
  },

  effects: [
    ({ onSet, setSelf }) => {
      const savedTeam = localStorage.getItem("team");
      if (savedTeam) {
        try {
          setSelf(JSON.parse(savedTeam));
        } catch (error) {
          console.error("Error parsing localStorage teams data:", error);
        }
      }

      onSet((newValue) => {
        try {
          localStorage.setItem("team", JSON.stringify(newValue));
        } catch (error) {
          console.error("Error saving teams data to localStorage:", error);
        }
      });

      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === "team") {
          setSelf(JSON.parse(event.newValue || "{}"));
        }
      };

      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    },
  ],

});
