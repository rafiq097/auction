export const getPlusPrice = (x: number): number => {
    if (x < 100) return 5;
    else if (x < 200) return 10;
    else if (x < 1000) return 20;
    else if(x < 1500) return 25;
    else return 50;
  };
  