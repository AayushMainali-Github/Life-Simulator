import AsyncStorage from "@react-native-async-storage/async-storage";
import { addBalance } from "./User";

export const getEmploymentEnrolled = async () => {
  const user = await AsyncStorage.getItem("user");
  if (!user) return { enrolled: false, data: {} };
  const userData = JSON.parse(user);
  return userData.currentJob;
};

export const setEmploymentEnrolled = async (enrolled: boolean, data?: { type: "Intern" | "Junior" | "Senior" | "Executive"; name: string; pay: number }) => {
  if (enrolled && !data) return;
  const user = await AsyncStorage.getItem("user");
  if (!user) return;
  const userData = JSON.parse(user);
  if (enrolled) userData.currentJob = { enrolled, data };
  else userData.currentJob = { enrolled, data: {} };
  await AsyncStorage.setItem("user", JSON.stringify(userData));
};

export const UpdateEmployment = async () => {
  const data = await getEmploymentEnrolled();
  if (!data.enrolled || JSON.stringify(data.data) == "{}") return;
  await addBalance(data.data.pay);
};
