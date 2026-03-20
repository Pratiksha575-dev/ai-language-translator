import React, { useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { HistoryContext } from "./HistoryContext";
import { sentenceBleu } from "bleu-score";

export default function AnalyticsScreen() {
  const { history } = useContext(HistoryContext);

  const [selectedLang, setSelectedLang] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  /* BLEU */
  const calculateBleu = (ref, cand) => {
    try {
      if (!ref || !cand) return 0;
      return sentenceBleu([ref.split(" ")], cand.split(" "));
    } catch {
      return 0;
    }
  };

  /* FILTER ONLY RESEARCH */
  const filteredData = useMemo(() => {
    let data = Array.isArray(history)
      ? history.filter(h => h?.mode === "research")
      : [];

    if (selectedLang !== "all") {
      data = data.filter(h => h?.targetLang === selectedLang);
    }

    const now = Date.now();

    if (timeFilter === "7d") {
      data = data.filter(
        h => h?.timestamp && now - h.timestamp < 7 * 24 * 60 * 60 * 1000
      );
    }

    console.log("FILTERED DATA:", data);
    return data;
  }, [history, selectedLang, timeFilter]);

  /* STATS */
  const apiStats = {};

  filteredData.forEach(item => {
    if (!item?.results) return;

    const google = item.results.find(r => r.name === "Google");

    item.results.forEach(r => {
      if (!r?.name) return;

      if (!apiStats[r.name]) {
        apiStats[r.name] = {
          totalTime: 0,
          count: 0,
          bleuTotal: 0
        };
      }

      apiStats[r.name].totalTime += r.time || 0;
      apiStats[r.name].count += 1;

      if (google && r.name !== "Google") {
        apiStats[r.name].bleuTotal += calculateBleu(
          google.text,
          r.text
        );
      }
    });
  });

  /* METRICS */
  const metrics = Object.keys(apiStats).map(api => {
    const count = apiStats[api].count;

    return {
      api,
      avgTime: count ? apiStats[api].totalTime / count : 0,
      avgBleu:
        api === "Google"
          ? 1
          : count
          ? apiStats[api].bleuTotal / count
          : 0
    };
  });

  if (metrics.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          No research analytics yet
        </Text>
      </View>
    );
  }

  /* KPI */
  const bestAPI = metrics.reduce((a, b) =>
    a.avgTime < b.avgTime ? a : b
  );

  const bestAccuracy = metrics.reduce((a, b) =>
    a.avgBleu > b.avgBleu ? a : b
  );

  return (
    <ScrollView style={styles.container}>

      {/* FILTERS */}
      <View style={styles.filterRow}>
        <TouchableOpacity onPress={() => setSelectedLang("all")}>
          <Text style={styles.filter}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedLang("hi")}>
          <Text style={styles.filter}>Hindi</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTimeFilter("7d")}>
          <Text style={styles.filter}>Last 7 Days</Text>
        </TouchableOpacity>
      </View>

      {/* KPI */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiText}>Total</Text>
          <Text style={styles.kpiValue}>
            {filteredData.length}
          </Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiText}>Fastest</Text>
          <Text style={styles.kpiValue}>
            {bestAPI.api}
          </Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiText}>Best BLEU</Text>
          <Text style={styles.kpiValue}>
            {bestAccuracy.api}
          </Text>
        </View>
      </View>

      {/* BAR VISUAL */}
      <Text style={styles.title}>Avg Response Time</Text>

      {metrics.map((m, i) => (
        <View key={i} style={{ marginBottom: 12 }}>
          <Text style={{ color: "white" }}>
            {m.api} ({Math.round(m.avgTime)} ms)
          </Text>

          <View
            style={{
              height: 10,
              width: Math.min(m.avgTime * 2, 300),
              backgroundColor: "#36A2EB",
              borderRadius: 5,
              marginTop: 4
            }}
          />
        </View>
      ))}

      {/* USAGE */}
      <Text style={styles.title}>API Usage</Text>

      {metrics.map((m, i) => (
        <Text key={i} style={{ color: "white", marginBottom: 5 }}>
          {m.api}: {apiStats[m.api].count} times
        </Text>
      ))}

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
    fontSize: 16
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10
  },
  filter: {
    color: "white",
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 8
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
  }
});