import { Dimensions } from "react-native";

export const windowWidth: number = Dimensions.get("window").width;
export const windowHeight: number = Dimensions.get("window").height;
const designHeight: number = 844;
const designWidth: number = 390;

const relW = (num: number): number => {
  return (windowWidth / designWidth) * num;
};
const relH = (num: number): number => {
  return (windowHeight / designHeight) * num;
};

export { relH, relW };
