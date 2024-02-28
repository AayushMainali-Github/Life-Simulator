import { StyleSheet, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "../../Styles/Global";
import Nav from "../../Components/Nav/Nav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Choose from "./Components/Choose";
import Status from "./Components/Status";
import { getEmploymentEnrolled } from "../../LocalStorage/Employment";
import { updateInterval } from "../../LocalStorage/User";

type Props = NativeStackScreenProps<RootStackParamList, "Employment">;

const Employment = (props: Props) => {
  const [status, setStatus] = useState<JSX.Element | null>(null);

  const update = async () => {
    const data = await getEmploymentEnrolled();
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
      <Nav navigation={props.navigation} screen="Employment" />
      {status || <Choose />}
    </SafeAreaView>
  );
};

export default Employment;

const styles = StyleSheet.create({});
