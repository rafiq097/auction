import { atom } from "recoil";

export type Player = {
  name: string;
  role: string;
  base: number;
  country: string;
  type: string;
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
});
