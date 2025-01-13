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
});
