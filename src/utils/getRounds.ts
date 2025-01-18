export const getRounds = (player: any): number => {
  let rounds = 3;

  const experience =
    (player.Test_caps || 0) +
    (player.ODI_caps || 0) +
    (player.T20_caps || 0) +
    (player.IPL_caps || 0);

  rounds += parseFloat((experience / 100).toFixed(0));

  return Math.max(3, Math.min(rounds, 5));
};
