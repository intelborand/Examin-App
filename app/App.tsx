import { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExaminCheckComponent from "./components/ExaminCheck";
import SpeedCalculator from "./components/SpeedCounter";

const MODES = [
  { key: "Examin", label: "Egzamin", icon: "📋" },
  { key: "Prędkość", label: "Prędkość", icon: "⚡" },
];

export default function App() {
  const [mode, setMode] = useState("");

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ExaminCheck</Text>
        <Text style={styles.headerSub}>panel instruktora</Text>
      </View>

      {/* Mode tabs */}
      {mode === "" && (
        <View style={styles.menuContainer}>
          <Text style={styles.menuLabel}>Wybierz tryb</Text>
          <View style={styles.cards}>
            {MODES.map((m) => (
              <ModeCard
                key={m.key}
                icon={m.icon}
                label={m.label}
                onPress={() => setMode(m.key)}
              />
            ))}
          </View>
        </View>
      )}

      {/* Back button when mode selected */}
      {mode !== "" && (
        <View style={styles.topBar}>
          <Pressable style={styles.backBtn} onPress={() => setMode("")}>
            <Text style={styles.backBtnText}>← Wróć</Text>
          </Pressable>
          <Text style={styles.topBarTitle}>
            {MODES.find((m) => m.key === mode)?.icon}{" "}
            {MODES.find((m) => m.key === mode)?.label}
          </Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {mode === "Prędkość" && <SpeedCalculator />}
        {mode === "Examin" && <ExaminCheckComponent />}
      </View>
    </SafeAreaView>
  );
}

function ModeCard({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <Pressable
        style={styles.cardInner}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardLabel}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9eaec",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 1,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9eaec",
    gap: 12,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  menuLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9ca3af",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  cards: {
    flexDirection: "row",
    gap: 14,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardInner: {
    paddingVertical: 28,
    alignItems: "center",
    gap: 10,
  },
  cardIcon: {
    fontSize: 36,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  placeholderIcon: {
    fontSize: 48,
    opacity: 0.3,
  },
  placeholderText: {
    fontSize: 15,
    color: "#9ca3af",
    fontWeight: "500",
  },
});
