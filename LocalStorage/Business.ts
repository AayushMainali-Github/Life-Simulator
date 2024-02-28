import AsyncStorage from "@react-native-async-storage/async-storage";
import Business from "../Database/Business.json";
import { addBalance } from "./User";

export const getBusiness = async (type: "TierA" | "TierB" | "TierC" | "TierD"): Promise<Array<string>> => {
  const user = await AsyncStorage.getItem("user");
  if (!user) return [];
  else return JSON.parse(user).businesses[type];
};

export const addBusiness = async (type: "TierA" | "TierB" | "TierC" | "TierD", name: string) => {
  const user = await AsyncStorage.getItem("user");
  if (!user) return;
  const data = JSON.parse(user);
  data.businesses[type].push(name);
  await AsyncStorage.setItem("user", JSON.stringify(data));
};

export const UpdateBusiness = async () => {
  const tiers = ["TierA", "TierB", "TierC", "TierD"];
  const user = await AsyncStorage.getItem("user");
  if (!user) return;
  const data = JSON.parse(user);
  for (let i = 0; i < tiers.length; i++) {
    const businesses = data.businesses[tiers[i]];
    for (let j = 0; j < businesses.length; j++) {
      //@ts-ignore
      await addBalance(Business[tiers[i]][businesses[j]].income);
    }
  }
};
