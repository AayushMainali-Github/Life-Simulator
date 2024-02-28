import AsyncStorage from "@react-native-async-storage/async-storage";
import {  InitializeInvestments } from "./Investment";

export const initializeUser = async (): Promise<boolean> => {
  const initialBalance = 10000;

  //check if already exists
  const status = await checkUserStatus();
  if (status == 1) return false;

  //user data
  const data = {
    balance: initialBalance,
    date: new Date(new Date().toDateString()).getTime(),
    businesses: {
      TierA: [],
      TierB: [],
      TierC: [],
      TierD: [],
    },
    education: {
      Diploma: [],
      Bachelor: [],
      Master: [],
      Phd: [],
    },
    investment: {
      Stocks: {},
      Crypto: {},
      Forex: {},
      Commodity: {},
    },
    currentJob: {
      enrolled: false,
      data: {},
    },
    currentEducation: {
      enrolled: false,
      data: {},
    },
  };

  //store data
  await AsyncStorage.setItem("user", JSON.stringify(data));
  await InitializeInvestments();

  //networth
  await AsyncStorage.setItem("networth", JSON.stringify([initialBalance, initialBalance, initialBalance, initialBalance, initialBalance, initialBalance, initialBalance]));

  return true;
};

// Statuses:
// 0 -> No User Registered
// 1 -> User Registered
export const checkUserStatus = async (): Promise<0 | 1> => {
  const user = await AsyncStorage.getItem("user");
  if (user) return 1;
  else return 0;
};

//balance
export const getBalance = async (): Promise<number> => {
  const user = await AsyncStorage.getItem("user");
  if (user) return JSON.parse(user).balance;
  else return 0;
};

export const addBalance = async (balance: number) => {
  let user = await AsyncStorage.getItem("user");
  if (user) {
    let data = JSON.parse(user);
    data.balance += balance;
    await AsyncStorage.setItem("user", JSON.stringify(data));
  }
};

//date
export const getDate = async (): Promise<number> => {
  const user = await AsyncStorage.getItem("user");
  if (user) return JSON.parse(user).date;
  else return 0;
};

export const UpdateDate = async () => {
  let user = await AsyncStorage.getItem("user");
  if (user) {
    let data = JSON.parse(user);
    data.date += 24 * 60 * 60 * 1000;
    await AsyncStorage.setItem("user", JSON.stringify(data));
  }
};

export const dateInterval = 10000; //milliseconds
export const balanceInterval = 500; //milliseconds
export const updateInterval = 2000; //milliseconds
