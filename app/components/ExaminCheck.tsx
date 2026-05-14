import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CheckTask {
  id: number;
  value: string;
}

const TO_CHECK_LIST: CheckTask[] = [
  { id: 1, value: "poziom oleju w silniku" },
  { id: 2, value: "poziom płynu chłodzącego" },
  { id: 3, value: "poziom płynu hamulcowego" },
  { id: 4, value: "działanie sygnału dźwiękowego" },
  { id: 5, value: "działanie świateł pozycyjnych" },
  { id: 6, value: "działanie świateł mijania" },
  { id: 7, value: "działanie świateł drogowych" },
  { id: 8, value: "działanie świateł hamowania STOP" },
  { id: 9, value: "działanie świateł kierunkowskazów" },
  { id: 10, value: "działanie świateł awaryjnych" },
  { id: 11, value: "działanie podświetlenia tablicy rejestracyjnej" },
];

export default function ExaminCheckComponent() {
  const [task1, setTask1] = useState("");
  const [task2, setTask2] = useState("");

  function randomizeTasks() {
    const firstIndex = Math.floor(Math.random() * TO_CHECK_LIST.length);

    let secondIndex = Math.floor(Math.random() * TO_CHECK_LIST.length);

    while (secondIndex === firstIndex) {
      secondIndex = Math.floor(Math.random() * TO_CHECK_LIST.length);
    }

    setTask1(TO_CHECK_LIST[firstIndex].value);
    setTask2(TO_CHECK_LIST[secondIndex].value);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Egzamin Check</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Zadanie 1</Text>

        <Text style={styles.taskText}>{task1 || "Kliknij losowanie"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Zadanie 2</Text>

        <Text style={styles.taskText}>{task2 || "Kliknij losowanie"}</Text>
      </View>

      <Pressable
        onPress={randomizeTasks}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>Losuj pytania</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#0F172A",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "00000",
    textAlign: "center",
    marginBottom: 32,
  },

  card: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  label: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 8,
  },

  taskText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 12,
  },

  buttonPressed: {
    backgroundColor: "#2563EB",
  },

  buttonText: {
    color: "00000",
    fontSize: 18,
    fontWeight: "700",
  },
});
