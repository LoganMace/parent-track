import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useEntries } from "@/context/EntriesContext";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function HomeScreen() {
  const { entries } = useEntries();
  const sortedEntries = [...(entries || [])].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
  const recentEntry = sortedEntries[0];
  const totalEntries = entries?.length || 0;
  const uniqueCategories = new Set(entries?.map((entry) => entry.favorite))
    .size;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <ThemedView style={styles.welcomeSection}>
            <ThemedText style={styles.welcomeTitle}>
              Welcome to Parent Track
            </ThemedText>
            <ThemedText style={styles.welcomeText}>
              Record and cherish your children's favorite things as they change
              over time.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.statsSection}>
            <ThemedView style={styles.statCard}>
              <IconSymbol name="number" size={24} color="#4FD1C5" />
              <ThemedText style={styles.statNumber}>{totalEntries}</ThemedText>
              <ThemedText style={styles.statLabel}>Total Entries</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statCard}>
              <IconSymbol name="tag" size={24} color="#4FD1C5" />
              <ThemedText style={styles.statNumber}>
                {uniqueCategories}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Categories</ThemedText>
            </ThemedView>
          </ThemedView>

          {recentEntry && (
            <ThemedView style={styles.recentSection}>
              <ThemedText style={styles.sectionTitle}>
                Most Recent Entry
              </ThemedText>
              <ThemedView style={styles.recentCard}>
                <ThemedText style={styles.recentDate}>
                  {recentEntry.date.toLocaleDateString()}
                </ThemedText>
                <ThemedText style={styles.recentCategory}>
                  Favorite {recentEntry.favorite}
                </ThemedText>
                <ThemedText style={styles.recentAnswer} numberOfLines={2}>
                  {recentEntry.answer}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}

          <ThemedView style={styles.tipsSection}>
            <ThemedText style={styles.sectionTitle}>Quick Tips</ThemedText>
            <ThemedView style={styles.tipCard}>
              <IconSymbol name="plus.circle" size={20} color="#4FD1C5" />
              <ThemedText style={styles.tipText}>
                Create new entries to track your children's changing favorites
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.tipCard}>
              <IconSymbol name="clock" size={20} color="#4FD1C5" />
              <ThemedText style={styles.tipText}>
                View your children's journey in the Timeline
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.tipCard}>
              <IconSymbol name="heart" size={20} color="#4FD1C5" />
              <ThemedText style={styles.tipText}>
                Save special entries to Favorites
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    gap: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C5282",
  },
  welcomeText: {
    fontSize: 16,
    color: "#4A5568",
    lineHeight: 22,
  },
  statsSection: {
    flexDirection: "row",
    padding: 20,
    gap: 16,
    justifyContent: "space-around",
  },
  statCard: {
    alignItems: "center",
    backgroundColor: "#2C5282",
    padding: 16,
    borderRadius: 12,
    minWidth: 120,
    gap: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 14,
    color: "#A0AEC0",
  },
  recentSection: {
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C5282",
    marginBottom: 8,
  },
  recentCard: {
    backgroundColor: "#4FD1C5",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  recentDate: {
    fontSize: 14,
    color: "#2C5282",
    fontWeight: "500",
  },
  recentCategory: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C5282",
  },
  recentAnswer: {
    fontSize: 14,
    color: "#2D3748",
  },
  tipsSection: {
    padding: 20,
    gap: 12,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#2C5282",
    padding: 16,
    borderRadius: 12,
  },
  tipText: {
    fontSize: 14,
    color: "white",
    flex: 1,
  },
});
