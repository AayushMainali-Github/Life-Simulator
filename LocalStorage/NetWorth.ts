import { getBusiness } from "./Business";
import { GetInvestments, GetInvestmentsOwned } from "./Investment";
import Business from "../Database/Business.json";
import { getBalance } from "./User";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Networth {
  Total: number;
  Balance: number;
  Business: number;
  Forex: number;
  Crypto: number;
  Commodity: number;
  Stocks: number;
}

export const getNetworth = async (): Promise<Networth> => {
  const data: Networth = {
    Total: 0,
    Balance: 0,
    Business: 0,
    Forex: 0,
    Crypto: 0,
    Commodity: 0,
    Stocks: 0,
  };
  //investments
  const typesI: ["Commodity", "Forex", "Stocks", "Crypto"] = ["Commodity", "Forex", "Stocks", "Crypto"];
  for (let i = 0; i < typesI.length; i++) {
    const investments = await GetInvestments(typesI[i]);
    if (!investments) continue;
    const keys = Object.keys(investments);
    const values = Object.values(investments);
    for (let j = 0; j < keys.length; j++) {
      const owned = await GetInvestmentsOwned(typesI[i], keys[j]);
      data[typesI[i]] += owned * values[j].price;
    }
    data.Total += data[typesI[i]];
  }

  //business
  const typesB: ["TierA", "TierB", "TierC", "TierD"] = ["TierA", "TierB", "TierC", "TierD"];
  for (let i = 0; i < typesB.length; i++) {
    const business = await getBusiness(typesB[i]);
    for (let j = 0; j < business.length; j++) {
      //@ts-ignore
      data.Business += Business[typesB[i]][business[j]].cost;
    }
  }
  data.Total += data.Business;

  //balance
  data.Balance += await getBalance();
  data.Total += data.Balance;

  return data;
};

export const UpdateNetworth = async () => {
  const data = await AsyncStorage.getItem("networth");
  if (!data) return;
  const parsedData: Array<number> = JSON.parse(data);
  parsedData.shift();
  parsedData.push((await getNetworth()).Total);
  await AsyncStorage.setItem("networth", JSON.stringify(parsedData));
};

export const GetNetworthHistory = async (): Promise<Array<number>> => {
  const data = await AsyncStorage.getItem("networth");
  if (!data) return [0, 0, 0, 0, 0, 0, 0];
  return JSON.parse(data);
};
