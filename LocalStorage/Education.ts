import AsyncStorage from "@react-native-async-storage/async-storage";

export const getEducation = async (type: "Diploma" | "Bachelor" | "Master" | "Phd"): Promise<Array<string>> => {
  const user = await AsyncStorage.getItem("user");
  if (!user) return [];
  else return JSON.parse(user).education[type];
};

export const addEducation = async (type: "Diploma" | "Bachelor" | "Master" | "Phd", name: string) => {
  const user = await AsyncStorage.getItem("user");
  if (!user) return;
  const data = JSON.parse(user);
  data.education[type].push(name);
  await AsyncStorage.setItem("user", JSON.stringify(data));
};

export const getEducationEnrolled = async () => {
  const user = await AsyncStorage.getItem("user");
  if (!user) return { enrolled: false, data: {} };
  const userData = JSON.parse(user);
  return userData.currentEducation;
};

export const setEducationEnrolled = async (enrolled: boolean, data?: { type: "Diploma" | "Bachelor" | "Master" | "Phd"; name: string; time: number }) => {
  if (enrolled && !data) return;
  const user = await AsyncStorage.getItem("user");
  if (!user) return;
  const userData = JSON.parse(user);
  if (enrolled) userData.currentEducation = { enrolled, data };
  else userData.currentEducation = { enrolled, data: {} };
  await AsyncStorage.setItem("user", JSON.stringify(userData));
};

export const UpdateEducation = async () => {
  const data = await getEducationEnrolled();
  if (!data.enrolled || JSON.stringify(data.data) == "{}") return;
  //@ts-ignore
  if (data.data.time <= 1) {
    await setEducationEnrolled(false);
    //@ts-ignore
    await addEducation(data.data.type, data.data.name);
  } else {
    //@ts-ignore
    data.data.time--;
    //@ts-ignore
    await setEducationEnrolled(true, data.data);
  }
};
