import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from "react-native";
import { HistoryContext } from "./HistoryContext";

export default function AnalyticsScreen() {
  const { history } = useContext(HistoryContext);


  /* ALL DATA */
  const data = useMemo(() => {
    return Array.isArray(history) ? history : [];
  }, [history]);

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          No analytics yet
        </Text>
      </View>
    );
  }

  /* ================= API STATS ================= */
  const apiStats = {};

  data.forEach(item => {
    if (!item?.results) return;

    const google = item.results.find(r => r.name === "Google");

    item.results.forEach(r => {
      if (!r?.name) return;
      
      if (
        r.name =="Image Translation" || 
        r.name =="Image Explanation" ||
        r.name =="Result"
      ) return;


      if (!apiStats[r.name]) {
        apiStats[r.name] = {
          totalTime: 0,
          count: 0
        };
      }

      apiStats[r.name].totalTime += r.time || 0;
      apiStats[r.name].count += 1;

    });
  });

  const metrics = Object.keys(apiStats)
  .filter(api =>
    api !== "Image Translation" &&
    api !== "Image Explanation" &&
    api !== "Result"
  )
  .map(api => {
    const count = apiStats[api].count;

    return {
      api,
      avgTime: count ? apiStats[api].totalTime / count : 0
    };
  });

  /* ================= INPUT TYPE ================= */
  const inputStats = { text: 0, audio: 0, image: 0 };

  data.forEach(item => {
    if (item.inputType) {
      inputStats[item.inputType]++;
    }
  });

  /* ================= IMAGE MODE ================= */
  const imageStats = { translate: 0, explain: 0 };

  data.forEach(item => {
    if (item.inputType === "image" && item.imageMode) {
      imageStats[item.imageMode]++;
    }
  });

  /* ================= COMPARE MODE ================= */
  let compareCount = 0;
  data.forEach(item => {
    if (item.compareMode) compareCount++;
  });

  /* ================= BEST API ================= */
 const bestAPI = metrics.length
  ? metrics.reduce((a, b) => (a.avgTime < b.avgTime ? a : b))
  : { api: "-" };

  /* ================= TOTAL INPUT ================= */
  const totalInputs =
    inputStats.text + inputStats.audio + inputStats.image;

  return (
    <ScrollView style={styles.container}>

      {/* KPI */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiText}>Total</Text>
          <Text style={styles.kpiValue}>{data.length}</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiText}>Fastest API</Text>
          <Text style={styles.kpiValue}>{bestAPI.api}</Text>
        </View>

      </View>

      {/* API PERFORMANCE */}
      <Text style={styles.title}>API Performance</Text>

      {metrics.map((m, i) => (
        <View key={i} style={{ marginBottom: 12 }}>
          <Text style={{ color: "white" }}>
            {m.api} ({Math.round(m.avgTime)} ms )
          </Text>

          <View style={styles.barBg}>
            <View
              style={{
                height: "100%",
                width: `${Math.min(m.avgTime / 5, 100)}%`,
                backgroundColor: "#36A2EB",
                borderRadius: 10
              }}
            />
          </View>
        </View>
      ))}

      {/* INPUT DISTRIBUTION */}
      <Text style={styles.title}>Input Distribution</Text>

      {["text", "audio", "image"].map(type => {
        const percent = totalInputs
          ? (inputStats[type] / totalInputs) * 100
          : 0;

        return (
          <View key={type} style={{ marginBottom: 10 }}>
            <Text style={{ color: "white" }}>
              {type.toUpperCase()} ({Math.round(percent)}%)
            </Text>

            <View style={styles.barBg}>
              <View
                style={{
                  height: "100%",
                  width: `${percent}%`,
                  backgroundColor:
                    type === "text"
                      ? "#4CAF50"
                      : type === "audio"
                      ? "#FF9800"
                      : "#2196F3",
                  borderRadius: 10
                }}
              />
            </View>
          </View>
        );
      })}

      {/* IMAGE MODE */}
      <Text style={styles.title}>Image Mode</Text>

      <Text style={styles.statText}>
        Translate: {imageStats.translate}
      </Text>
      <Text style={styles.statText}>
        Explain: {imageStats.explain}
      </Text>

      {/* COMPARE MODE */}
      <Text style={styles.title}>Compare Mode Usage</Text>

      <Text style={styles.statText}>
        Used: {compareCount} times
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 50
  },
  title: {
    color: "white",
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "bold"
  },
  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  kpiCard: {
    backgroundColor: "#1f1f1f",
    padding: 10,
    borderRadius: 10,
    width: "30%",
    alignItems: "center"
  },
  kpiText: {
    color: "#aaa",
    fontSize: 12
  },
  kpiValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  barBg: {
    height: 10,
    backgroundColor: "#333",
    borderRadius: 10,
    marginTop: 5
  },
  statText: {
    color: "white",
    marginBottom: 5
  },
  insightCard: {
    backgroundColor: "#1f1f1f",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  insightText: {
    color: "#00ffcc"
  }
});