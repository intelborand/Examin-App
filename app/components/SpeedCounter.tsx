import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ResultListComponent from "./ResultList";

export default function SpeedCalculator() {
  const [distance, setDistance] = useState("28");
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [liveMs, setLiveMs] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const pressInTimeRef = useRef<number | null>(null);
  const startDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  const startTimer = useCallback(() => {
    const dist = parseFloat(distance);
    if (!dist || dist <= 0) return;

    pressInTimeRef.current = Date.now();

    startDelayRef.current = setTimeout(() => {
      setIsHolding(true);
      setLiveMs(0);
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        setLiveMs(Date.now() - (startTimeRef.current ?? Date.now()));
      }, 50);

      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 40,
        bounciness: 2,
      }).start();
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }, 150);
  }, [distance, scaleAnim, bgAnim]);

  const stopTimer = useCallback(() => {
    if (startDelayRef.current) {
      clearTimeout(startDelayRef.current);
      startDelayRef.current = null;
    }

    if (!isHolding) return;

    const elapsed = Date.now() - (startTimeRef.current ?? Date.now());

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // touch delay
    if (elapsed < 300) {
      setIsHolding(false);
      setLiveMs(0);
      startTimeRef.current = null;

      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }).start();
      Animated.timing(bgAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      return;
    }

    const dist = parseFloat(distance);
    setIsHolding(false);
    setElapsedMs(elapsed);

    if (dist > 0 && elapsed > 0) {
      const mps = dist / (elapsed / 1000);
      setSpeed(mps);
      setResults((prev) => [(mps * 3.6).toFixed(2), ...prev]);
    }

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
    Animated.timing(bgAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isHolding, distance, scaleAnim, bgAnim]);

  const handleReset = () => {
    setElapsedMs(null);
    setSpeed(null);
    setLiveMs(0);
    setIsHolding(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${s}.${String(centis).padStart(2, "0")} s`;
  };

  const buttonBg = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#2563eb", "#1d4ed8"],
  });

  const distValid = parseFloat(distance) > 0;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Odległość (m)</Text>
          <TextInput
            style={styles.input}
            value={distance}
            onChangeText={(v) => {
              setDistance(v);
              handleReset();
            }}
            keyboardType="numeric"
            placeholder="np. 30"
            placeholderTextColor="#9ca3af"
            returnKeyType="done"
          />
        </View>

        <View style={styles.timerBox}>
          <Text style={styles.timerValue}>
            {isHolding
              ? formatTime(liveMs)
              : elapsedMs !== null
                ? formatTime(elapsedMs)
                : "0.00 s"}
          </Text>
          <Text style={styles.timerLabel}>
            {isHolding ? "liczę..." : elapsedMs !== null ? "czas" : "gotowy"}
          </Text>
        </View>

        {/* Current result */}

        {speed !== null && elapsedMs !== null && (
          <View
            style={isHolding ? styles.resultCardNotActive : styles.resultCard}
          >
            <Row
              label="km/h"
              value={(speed * 3.6).toFixed(2)}
              color={speed * 3.6 >= 30 ? "#16a34a" : "#dc2626"}
            />
            <View style={styles.divider} />
            <Row label="Odległość" value={`${parseFloat(distance)} м`} />
            <Row label="Czas" value={formatTime(elapsedMs)} />
          </View>
        )}

        <Animated.View
          style={[
            styles.buttonOuter,
            { backgroundColor: buttonBg },
            !distValid && styles.buttonDisabled,
          ]}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
              style={styles.button}
              onPressIn={startTimer}
              onPressOut={stopTimer}
              onLongPress={() => {}}
              delayLongPress={100000}
              disabled={!distValid}
              android_disableSound={true}
            >
              <Text style={styles.buttonText}>
                {isHolding ? "LICZĘ" : "TRZYMAJ"}
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>

        {!distValid && (
          <Text style={styles.hint}>Wprowadż odległość, żeby zacząć </Text>
        )}

        {(elapsedMs !== null || speed !== null) && (
          <Pressable onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetText}>Nowy pomiar</Text>
          </Pressable>
        )}

        {speed !== null && <ResultListComponent results={results} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Row({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text
        style={[
          styles.rowValue,
          color ? { color, fontSize: 80, fontWeight: "800" } : null,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    alignSelf: "stretch",
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 48,
    gap: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  section: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    color: "#111827",
  },
  timerBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  timerValue: {
    fontSize: 42,
    fontWeight: "700",
    color: "#111827",
  },
  timerLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  buttonOuter: {
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  button: {
    paddingVertical: 50,
    alignItems: "center",
    gap: 2,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  buttonSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  hint: {
    textAlign: "center",
    fontSize: 13,
    color: "#9ca3af",
    marginTop: -8,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    padding: 16,
    gap: 10,
  },
  resultCardNotActive: {
    opacity: 0.5,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    padding: 16,
    gap: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginVertical: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  rowValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },

  resetBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  resetText: {
    fontSize: 14,
    color: "#9ca3af",
  },
});
