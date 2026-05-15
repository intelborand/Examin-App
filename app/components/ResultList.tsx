import { StyleSheet, Text, View } from "react-native";

export default function ResultListComponent({
  results,
}: {
  results: string[];
}) {
  if (results.length === 0) return null;

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>#</Text>
        <Text style={styles.headerCell}>km/h</Text>
        <Text style={styles.headerCell}>Wynik</Text>
      </View>
      {results.map((res, index) => {
        const speed = parseFloat(res);
        const isGood = speed >= 30;
        return (
          <View
            key={index}
            style={[styles.row, index % 2 === 0 && styles.rowAlt]}
          >
            <Text style={styles.cell}>{results.length - index}</Text>
            <Text style={[styles.cell, styles.cellBold]}>{res}</Text>
            <Text
              style={[styles.cell, { color: isGood ? "#16a34a" : "#dc2626" }]}
            >
              {isGood ? "✓ OK" : "✗ Za wolno"}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerCell: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  rowAlt: {
    backgroundColor: "#f9fafb",
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
  },
  cellBold: {
    fontWeight: "700",
  },
});
