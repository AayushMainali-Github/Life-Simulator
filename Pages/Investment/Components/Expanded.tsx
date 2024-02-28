import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { relH, relW } from "../../../constants/relative";
import { Colors } from "../../../constants/colors";
import { LineChart, lineDataItem } from "react-native-gifted-charts";
import { GetInvestment, GetInvestmentsOwned, SetInvestmentsFavorite, SetInvestmentsOwned, historyCap } from "../../../LocalStorage/Investment";
import { formatMoney } from "../../../Utilities/format";
import { Fonts } from "../../../constants/fonts";
import { addBalance, getBalance, updateInterval } from "../../../LocalStorage/User";

interface Props {
  type: "Commodity" | "Forex" | "Stocks" | "Crypto";
  name: string;
  setExpand: Dispatch<SetStateAction<JSX.Element | null>>;
}
interface GraphData {
  startFillColor: string;
  endFillColor: string;
  color: string;
  yAxisOffset: number;
  maxValue: number;
  data: Array<lineDataItem>;
}

const Expanded = (props: Props) => {
  //data
  const [gData, setgData] = useState<GraphData>();
  const [total, setTotal] = useState<number>(0);
  const [currentPrice, setPrice] = useState<number>(0);
  const [currentOwned, setOwned] = useState<number>(0);
  const [favorited, setFavorited] = useState<boolean>(false);

  //inputs
  const [buy, setBuy] = useState<string>("0");
  const [sell, setSell] = useState<string>("0");

  //update
  const update = async () => {
    const data = await GetInvestment(props.type, props.name);
    if (!data) return;
    const history = data.history;

    //graph data
    const max = Math.max(...history) * 1.05;
    const min = Math.min(...history) * 0.95;
    const color = history[0] - history[history.length - 1] > 0 ? Colors.red : Colors.greenA;
    const tempGraphData: Array<lineDataItem> = [];
    history.forEach((e) => {
      tempGraphData.push({ value: e });
    });
    setgData({
      color,
      startFillColor: color,
      endFillColor: color,
      maxValue: max - min,
      yAxisOffset: min,
      data: tempGraphData,
    });

    //other data
    setFavorited(data.favorite == 1);
    setPrice(history[history.length - 1]);
    setTotal(data.total);
    setOwned(await GetInvestmentsOwned(props.type, props.name));
  };

  //max
  const showBuyMax = async () => {
    const data = await GetInvestment(props.type, props.name);
    if (!data) return;
    const price = data.price;
    const owned = await GetInvestmentsOwned(props.type, props.name);
    const balance = await getBalance();
    let canBuy = balance / price;
    if (canBuy > total - owned) setBuy((total - owned).toFixed(8));
    else setBuy(Number(canBuy.toFixed(8)) > canBuy ? (canBuy - 0.00000001 < 0 ? 0 : canBuy - 0.00000001).toFixed(8) : canBuy.toFixed(8));
  };

  const showSellMax = async () => {
    const owned = await GetInvestmentsOwned(props.type, props.name);
    setSell(Number(owned.toFixed(8)) > owned ? (owned - 0.00000001 < 0 ? 0 : owned - 0.00000001).toFixed(8) : owned.toFixed(8));
  };

  //buy sell
  let active = false;
  const onBuy = async () => {
    //check if already ran
    if (active) return;
    active = true;
    setBuy("0");

    //get data
    const data = await GetInvestment(props.type, props.name);
    if (!data) return;
    const price = data.price;
    const owned = await GetInvestmentsOwned(props.type, props.name);
    const balance = await getBalance();
    const amount = Number(buy);

    //check conditons
    if (Number.isNaN(amount) || !Number.isFinite(amount) || amount == 0) return Alert.alert("Cannot Buy", "Invalid Amount");
    if (amount > total - owned) return Alert.alert("Cannot Buy", `This much ${props.name} is not available.`);
    if (amount * price > balance) return Alert.alert("Cannot Buy", `You don't have enough money to buy this much ${props.name}`);

    //update data
    await SetInvestmentsOwned(props.type, props.name, owned + amount);
    await addBalance(-(amount * price));

    //set states
    setOwned(owned + amount);
    active = false;
  };

  const onSell = async () => {
    //check if already ran
    if (active) return;
    active = true;
    setSell("0");

    //get data
    const data = await GetInvestment(props.type, props.name);
    if (!data) return;
    const price = data.price;
    const owned = await GetInvestmentsOwned(props.type, props.name);
    const amount = Number(sell);

    //check conditons
    if (Number.isNaN(amount) || !Number.isFinite(amount) || amount == 0) return Alert.alert("Cannot Sell", "Invalid Amount");
    if (amount > owned) return Alert.alert("Cannot Sell", `This much ${props.name} is not owned`);

    //update data
    await SetInvestmentsOwned(props.type, props.name, owned - amount);
    await addBalance(amount * price);

    //set states
    setOwned(owned - amount);
    active = false;
  };

  //favorite
  let fActive = false;
  const favorite = async () => {
    if (fActive) return;
    fActive = true;
    await SetInvestmentsFavorite(!favorited, props.type, props.name);
    setFavorited(!favorited);
    fActive = false;
  };

  useEffect(() => {
    (async () => await update())();
    const interval = setInterval(update, updateInterval);
    return () => clearInterval(interval);
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Pressable
            onPress={() => {
              props.setExpand(null);
            }}
          >
            <Image style={styles.topButton} source={require("../../../assets/Global/back.png")} />
          </Pressable>
          <Text style={styles.topText}>{props.name}</Text>
          <Pressable onPress={favorite}>
            {favorited ? (
              <Image style={styles.topButton} source={require("../../../assets/Global/heartDark.png")} />
            ) : (
              <Image style={styles.topButton} source={require("../../../assets/Global/heartLight.png")} />
            )}
          </Pressable>
        </View>
        <View style={styles.graph}>
          <LineChart
            {...gData}
            height={relH(200)}
            width={relW(299.5)}
            initialSpacing={0}
            endSpacing={0}
            spacing={relW((2.5 * 120) / historyCap)}
            showVerticalLines
            verticalLinesSpacing={relW(49.5)}
            dataPointsColor="rgba(0,0,0,0)"
            noOfSections={4}
            areaChart
            startOpacity={0.2}
            endOpacity={0.1}
            yAxisThickness={relW(1)}
            thickness={relW(1)}
            rulesType="solid"
            yAxisExtraHeight={0}
            adjustToWidth
            hideYAxisText
            scrollToEnd
          />
        </View>
        <View style={{ ...styles.desc, backgroundColor: `${gData?.color || Colors.yellow}4A` }}>
          <Text style={styles.texts}>
            Price: <Text style={{ fontFamily: Fonts.Signika[700] }}>{formatMoney(currentPrice)}</Text>
          </Text>
          <Text style={styles.texts}>
            Available: <Text style={{ fontFamily: Fonts.Signika[700] }}>{formatMoney(total - currentOwned, true)}</Text>
          </Text>
          <Text style={styles.texts}>
            Owned: <Text style={{ fontFamily: Fonts.Signika[700] }}>{formatMoney(currentOwned, true)}</Text>
          </Text>
        </View>
        <View style={styles.buySell}>
          <View style={styles.left}>
            <View style={styles.leftTop}>
              <Text style={{ ...styles.leftTopTxt, color: Colors.greenA }}>Buy</Text>
              <Pressable onPress={showBuyMax} style={{ ...styles.leftTopButton, backgroundColor: Colors.greenA }}>
                <Text style={styles.leftTopButtonTxt}>Max</Text>
              </Pressable>
            </View>
            <TextInput onChangeText={setBuy} value={buy} keyboardType="number-pad" style={{ ...styles.leftInput, borderColor: Colors.greenA }} />
          </View>
          <Pressable onPress={onBuy}>
            <Image style={styles.rightImg} source={require("../../../assets/Investment/buy.png")} />
          </Pressable>
        </View>
        <View style={styles.buySell}>
          <View style={styles.left}>
            <View style={styles.leftTop}>
              <Text style={{ ...styles.leftTopTxt, color: Colors.red }}>Sell</Text>
              <Pressable onPress={showSellMax} style={{ ...styles.leftTopButton, backgroundColor: Colors.red }}>
                <Text style={styles.leftTopButtonTxt}>Max</Text>
              </Pressable>
            </View>
            <TextInput onChangeText={setSell} value={sell} keyboardType="number-pad" style={{ ...styles.leftInput, borderColor: Colors.red }} />
          </View>
          <Pressable onPress={onSell}>
            <Image style={styles.rightImg} source={require("../../../assets/Investment/sell.png")} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Expanded;

const styles = StyleSheet.create({
  container: {
    marginTop: relH(32),
    alignSelf: "center",
    width: relW(371),
    height: relH(635),
    borderWidth: relW(1),
    borderRadius: 25,
    backgroundColor: Colors.yellow,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: relW(12),
    marginTop: relH(10),
  },
  topButton: {
    width: relH(30),
    height: relH(30),
  },
  topText: {
    fontFamily: Fonts.Inter[700],
    fontSize: relW(22),
    includeFontPadding: false,
  },
  graph: {
    paddingLeft: relW(24),
    marginTop: relH(35),
  },
  desc: {
    borderRadius: 12,
    alignSelf: "center",
    alignItems: "center",
    width: relW(320),
    paddingVertical: relH(12),
    gap: relH(6),
    marginBottom: relH(45),
  },
  texts: {
    fontFamily: Fonts.Signika[500],
    fontSize: relW(17),
    includeFontPadding: false,
  },
  buySell: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: relW(20),
    marginBottom: relH(20),
  },
  left: {
    width: relW(250),
    gap: relH(6),
  },
  leftTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftTopTxt: {
    fontFamily: Fonts.Roboto[700],
    fontSize: relW(18),
    includeFontPadding: false,
  },
  leftTopButton: {
    paddingVertical: relH(2.5),
    paddingHorizontal: relW(10),
    borderRadius: relW(4),
  },
  leftTopButtonTxt: {
    color: Colors.white,
    fontFamily: Fonts.Roboto[700],
    fontSize: relW(14),
    includeFontPadding: false,
  },
  leftInput: {
    width: relW(250),
    borderWidth: relW(1),
    borderRadius: relW(8),
    height: relH(40),
    paddingHorizontal: relW(10),
    fontFamily: Fonts.Signika[400],
    includeFontPadding: false,
  },
  rightImg: {
    width: relW(40),
    height: relW(40),
  },
});
