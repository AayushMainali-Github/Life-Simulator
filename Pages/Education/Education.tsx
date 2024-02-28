import { StyleSheet, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "../../Styles/Global";
import Nav from "../../Components/Nav/Nav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Choose from "./Components/Choose";
import { getEducationEnrolled } from "../../LocalStorage/Education";
import Status from "./Components/Status";
import { updateInterval } from "../../LocalStorage/User";

type Props = NativeStackScreenProps<RootStackParamList, "Education">;

const Education = (props: Props) => {
  const [status, setStatus] = useState<JSX.Element | null>(null);

  const update = async () => {
    const data = await getEducationEnrolled();
    if (data.enrolled && JSON.stringify(data.data) != "{}") {
      if (status == null) setStatus(<Status {...data.data} />);
    } else setStatus(null);
  };
  useEffect(() => {
    (async () => {
      await update();
    })();
    const interval = setInterval(update, updateInterval);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={globalStyles.container}>
      <Nav navigation={props.navigation} screen="Education" />
      {status || <Choose />}
    </SafeAreaView>
  );
};

export default Education;

const styles = StyleSheet.create({});
