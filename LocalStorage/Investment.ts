import AsyncStorage from "@react-native-async-storage/async-storage";
import Investment from "../Database/Investment.json";

export const historyCap = 180;

interface Investment {
  price: number;
  total: number;
  history: Array<number>;
  favorite: 0 | 1;
}

//initialize
export const InitializeInvestments = async () => {
  let investments: Record<string, Record<string, Investment>> = {};
  const types: ["Commodity", "Forex", "Stocks", "Crypto"] = ["Commodity", "Forex", "Stocks", "Crypto"];
  //generate data
  for (let i = 0; i < types.length; i++) {
    investments[types[i]] = {};
    const obj: Record<string, { price: number; total: number }> = Investment[types[i]];
    const objKeys = Object.keys(obj);
    for (let j = 0; j < objKeys.length; j++) {
      investments[types[i]][objKeys[j]] = {
        price: obj[objKeys[j]].price,
        total: obj[objKeys[j]].total,
        history: GenerateHistory(obj[objKeys[j]].price),
        favorite: 0,
      };
    }
  }
  //store
  await AsyncStorage.setItem("investment", JSON.stringify(investments));
};

//favorite
export const SetInvestmentsFavorite = async (bool: boolean, type: "Commodity" | "Forex" | "Stocks" | "Crypto", name: string) => {
  const investments = await AsyncStorage.getItem("investment");
  if (!investments) return null;
  const data = JSON.parse(investments);
  data[type][name].favorite = Number(bool);
  await AsyncStorage.setItem("investment", JSON.stringify(data));
};

//fetch
export const GetInvestments = async (type: "Commodity" | "Forex" | "Stocks" | "Crypto"): Promise<Record<string, Investment> | null> => {
  const investments = await AsyncStorage.getItem("investment");
  if (!investments) return null;
  else return JSON.parse(investments)[type];
};

export const GetInvestment = async (type: "Commodity" | "Forex" | "Stocks" | "Crypto", name: string): Promise<Investment | null> => {
  const investments = await AsyncStorage.getItem("investment");
  if (!investments) return null;
  else return JSON.parse(investments)[type][name];
};

export const GetInvestmentsOwned = async (type: "Commodity" | "Forex" | "Stocks" | "Crypto", name: string): Promise<number> => {
  const user = await AsyncStorage.getItem("user");
  if (!user) return 0;
  return JSON.parse(user).investment[type][name] || 0;
};

//set
export const SetInvestmentsOwned = async (type: "Commodity" | "Forex" | "Stocks" | "Crypto", name: string, amount: number) => {
  const user = await AsyncStorage.getItem("user");
  if (!user) return;
  let userData = JSON.parse(user);
  userData.investment[type][name] = amount;
  await AsyncStorage.setItem("user", JSON.stringify(userData));
};

//updates
export const UpdatePrices = async () => {
  let investments: Record<string, Record<string, Investment>> | null = JSON.parse((await AsyncStorage.getItem("investment")) || "null");
  if (!investments) return;
  const types: ["Commodity", "Forex", "Stocks", "Crypto"] = ["Commodity", "Forex", "Stocks", "Crypto"];
  //generate data
  for (let i = 0; i < types.length; i++) {
    const obj: Record<string, { price: number; total: number; history: Array<number>; favorite: 0 | 1 }> = investments[types[i]];
    const objKeys = Object.keys(obj);
    for (let j = 0; j < objKeys.length; j++) {
      const history = obj[objKeys[j]].history;
      const newPrice = GenerateNextPrice(history);
      history.shift();
      investments[types[i]][objKeys[j]] = {
        price: newPrice,
        total: obj[objKeys[j]].total,
        history: [...history, newPrice],
        favorite: obj[objKeys[j]].favorite,
      };
    }
  }
  //store
  await AsyncStorage.setItem("investment", JSON.stringify(investments));
};

const probabilities: Array<number> = [];
for (let i = 0; i < 2500; i++) probabilities.push(0);
for (let i = 0; i < 200; i++) probabilities.push(1);
for (let i = 0; i < 150; i++) probabilities.push(2);
for (let i = 0; i < 80; i++) probabilities.push(3);
for (let i = 0; i < 45; i++) probabilities.push(4);
for (let i = 0; i < 20; i++) probabilities.push(5);
for (let i = 0; i < 4; i++) probabilities.push(6);
for (let i = 0; i < 1; i++) probabilities.push(7);

export const GenerateHistory = (price: number): Array<number> => {
  const retArray = [price];
  for (let i = 0; i < historyCap - 1; i++) {
    retArray.push(GenerateNextPrice(retArray));
  }
  return retArray.reverse();
};

export const GenerateNextPrice = (prices: Array<number>): number => {
  //constants
  const totalPrices = prices.length;
  const currentPrice = prices[totalPrices - 1];
  const last = prices.slice(0, Math.ceil(Math.random() * historyCap));
  let average = 0;
  for (let i = 0; i < last.length; i++) {
    average += (i + 1) * last[i];
  }
  average = average / ((last.length * (last.length + 1)) / 2);

  //get random change
  const random = Math.ceil(Math.random() * 100);
  const randomIntChange = probabilities[Math.floor(Math.random() * probabilities.length)];
  let randomChange;
  if (currentPrice > average) randomChange = random <= 55 ? "" : "-";
  else if (currentPrice == average) randomChange = random <= 50 ? "" : "-";
  else randomChange = random <= 45 ? "" : "-";
  return currentPrice + currentPrice * (Number(`${randomChange}${randomIntChange}.${Math.floor(Math.random() * 100)}`) / 100);
};
