export const getRandomPrice = (x: {
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
    let price = x.Base;
  
    if (x.Age < 25) {
      price *= 1.1;
    } else if (x.Age < 35) {
      price *= 1.3;
    }
  
    const totalCaps = (x.Test_caps || 0) + (x.ODI_caps || 0) + (x.T20_caps || 0) + (x.IPL_caps || 0);
    price += totalCaps * 0.5;
  
    if (x.IPL_caps && x.IPL_caps > 50 && Last_IPL_played == 2024) {
      price *= 1.5;
    }
  
    return price;
  };
  