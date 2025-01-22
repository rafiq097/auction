import { atom } from "recoil";

const userAtom = atom<any>({
  key: "userAtom",
  default: null,
});

export default userAtom;
