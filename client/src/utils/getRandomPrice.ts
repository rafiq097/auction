import { CR } from "./getCR";

export const getRandomPrice = (player: {
  Country: string;
  Age: number;
  Test_caps?: number;
  ODI_caps?: number;
  T20_caps?: number;
  IPL_caps?: number;
  Last_IPL_played?: number;
  Capped?: string;
  Base: number;
}): number => {
  let randomPrice = CR(player.Base);

  let totalCaps = player.IPL_caps || 0;
  randomPrice += totalCaps * 0.1;

  let last = player.Last_IPL_played || 0;
  if (last >= 7) {
    randomPrice *= 1.2;
  }

  randomPrice *= Math.random() * (1.7 - 1.2) + 1.2;
  if (player.Age >= 35) randomPrice *= 0.5;
  else if (player.Age >= 30) randomPrice *= 0.75;
  else if (player.Age >= 25) randomPrice *= 0.8;
  else randomPrice *= 0.7;

  if (randomPrice > 40) randomPrice *= 0.5;
  if (randomPrice > 30) randomPrice *= 0.7;
  if (randomPrice >= 20) randomPrice *= 0.8;
  if (randomPrice >= 20) randomPrice *= 0.9;
  if (randomPrice >= 20) randomPrice *= 0.9;
  if (randomPrice <= 15) randomPrice *= 0.8;
  if (randomPrice <= 10) randomPrice *= 0.9;

  randomPrice = Math.round(randomPrice * 4) / 4;
  randomPrice = parseFloat(randomPrice.toFixed(2));

  return randomPrice;
};
