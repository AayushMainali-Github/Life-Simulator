import { StyleSheet, Text, SafeAreaView, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "../../Styles/Global";
import Nav from "../../Components/Nav/Nav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { relH, relW } from "../../constants/relative";
import { Fonts } from "../../constants/fonts";
import { Colors } from "../../constants/colors";
import { GetNetworthHistory, getNetworth } from "../../LocalStorage/NetWorth";
import { formatMoney } from "../../Utilities/format";
import { updateInterval } from "../../LocalStorage/User";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

const Profile = (props: Props) => {
  const [networth, setNetworth] = useState<number>(0);
  const [percent, setPercent] = useState<number>(0);
  const [pieData, setPieData] = useState<Array<pieDataItem>>([]);
  const update = async () => {
    const networthData = await getNetworth();
    const history = await GetNetworthHistory();
    setNetworth(networthData.Total);
    setPercent((networthData.Total / history[0] - 1) * 100);

    //pie chart
    const data: Array<pieDataItem> = [];
    data.push({ value: networthData.Balance, color: Colors.blue });
    data.push({ value: networthData.Business, color: Colors.red });
    data.push({ value: networthData.Stocks, color: Colors.violet });
    data.push({ value: networthData.Crypto, color: Colors.orange });
    data.push({ value: networthData.Commodity, color: Colors.pink });
    data.push({ value: networthData.Forex, color: Colors.green });
    setPieData(data);
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
      <Nav navigation={props.navigation} screen="Profile" />
      <Text style={styles.head}>Your Net Worth</Text>
      <View style={styles.body}>
        <Text style={styles.bodyTop}>{formatMoney(networth)}</Text>
        <View style={styles.bodyBottom}>
          {percent < 0 ? (
            <Image style={styles.bodyBottomImg} source={require("../../assets/Investment/red.png")} />
          ) : (
            <Image style={styles.bodyBottomImg} source={require("../../assets/Investment/green.png")} />
          )}
          <Text style={{ ...styles.bodyBottomText, color: percent < 0 ? Colors.red : Colors.green }}>{formatMoney(Math.abs(percent), true)}% (Last 7 days)</Text>
        </View>
      </View>
      <View style={styles.chart}>
        <PieChart data={pieData} />
      </View>
      <View style={styles.bottom}>
        <View style={styles.bottomItem}>
          <View style={{ ...styles.bottomItemColor, backgroundColor: Colors.blue }} />
          <Text style={styles.bottomItemTxt}>Balance</Text>
        </View>
        <View style={styles.bottomItem}>
          <View style={{ ...styles.bottomItemColor, backgroundColor: Colors.violet }} />
          <Text style={styles.bottomItemTxt}>Stocks</Text>
        </View>
        <View style={styles.bottomItem}>
          <View style={{ ...styles.bottomItemColor, backgroundColor: Colors.red }} />
          <Text style={styles.bottomItemTxt}>Business</Text>
        </View>
        <View style={styles.bottomItem}>
          <View style={{ ...styles.bottomItemColor, backgroundColor: Colors.orange }} />
          <Text style={styles.bottomItemTxt}>Crypto</Text>
        </View>
        <View style={styles.bottomItem}>
          <View style={{ ...styles.bottomItemColor, backgroundColor: Colors.pink }} />
          <Text style={styles.bottomItemTxt}>Commodity</Text>
        </View>
        <View style={styles.bottomItem}>
          <View style={{ ...styles.bottomItemColor, backgroundColor: Colors.green }} />
          <Text style={styles.bottomItemTxt}>Forex</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  head: {
    includeFontPadding: false,
    fontFamily: Fonts.Poppins[600],
    fontSize: relW(28),
    marginTop: relH(15),
    marginLeft: relW(20),
  },
  body: {
    flexDirection: "row",
    marginTop: relH(5),
    marginLeft: relW(20),
  },
  bodyTop: {
    includeFontPadding: false,
    fontFamily: Fonts.Signika[700],
    fontSize: relW(24),
  },
  bodyBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: relH(5),
  },
  bodyBottomImg: {
    height: relH(14),
    width: relH(14),
    marginBottom: relH(1),
  },
  bodyBottomText: {
    includeFontPadding: false,
    fontFamily: Fonts.Signika[700],
    fontSize: relW(12),
    color: Colors.red,
  },
  chart: {
    marginTop: relH(50),
    alignItems: "center",
  },
  bottom: {
    marginTop: relH(30),
    flexDirection: "row",
    marginHorizontal: relW(35),
    justifyContent: "center",
    gap: relW(25),
    flexWrap: "wrap",
  },
  bottomItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: relW(5),
  },
  bottomItemTxt: {
    fontFamily: Fonts.Roboto[500],
    fontSize: relW(20),
  },
  bottomItemColor: {
    height: relH(20),
    width: relH(20),
    borderRadius: 9999,
    backgroundColor: Colors.red,
  },
});
