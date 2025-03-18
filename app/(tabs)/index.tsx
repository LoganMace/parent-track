import { StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useEntries } from "@/context/EntriesContext";
import { useProfiles } from "@/context/ProfilesContext";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { customColors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const { entries } = useEntries();
  const { profiles } = useProfiles();
  const sortedEntries = [...(entries || [])].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
  const recentEntry = sortedEntries[0];
  const totalEntries = entries?.length || 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <ThemedView style={styles.welcomeSection}>
            <ThemedText style={styles.welcomeTitle}>
              Welcome to Little Memories
            </ThemedText>
            <ThemedText style={styles.welcomeText}>
              Document your child's evolving favorites and cherished memories as
              they grow.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.statsSection}>
            <ThemedView style={styles.statCard}>
              <IconSymbol name="number" size={24} color="#4FD1C5" />
              <ThemedText style={styles.statNumber}>{totalEntries}</ThemedText>
              <ThemedText style={styles.statLabel}>Total Entries</ThemedText>
            </ThemedView>
          </ThemedView>

          {recentEntry && (
            <ThemedView style={styles.recentSection}>
              <ThemedText style={styles.sectionTitle}>
                Most Recent Entry
              </ThemedText>
              <LinearGradient
                colors={[customColors.lightTeal, customColors.lightBlue]}
                style={styles.recentCard}
              >
                <View style={styles.recentHeader}>
                  <ThemedText style={styles.recentProfile}>
                    {
                      profiles?.find(
                        (profile) => profile.id === recentEntry.profileId
                      )?.name
                    }
                  </ThemedText>
                  <ThemedText style={styles.recentDate}>
                    {recentEntry.date.toLocaleDateString()}
                  </ThemedText>
                </View>
                <ThemedText style={styles.recentCategory}>
                  {recentEntry.type === "Favorite"
                    ? `Favorite ${recentEntry.category}:`
                    : recentEntry.type === "Measurement"
                    ? `Measurement: ${recentEntry.measurement}`
                    : recentEntry.type === "Memory"
                    ? `Memory: ${recentEntry.title}`
                    : recentEntry.type === "Journal"
                    ? `Journal: ${recentEntry.title}`
                    : recentEntry.type === "Milestone"
                    ? `Milestone: ${recentEntry.category}`
                    : ""}
                </ThemedText>
                <ThemedText style={styles.recentAnswer} numberOfLines={2}>
                  {recentEntry.type === "Favorite"
                    ? recentEntry.answer
                    : recentEntry.type === "Measurement"
                    ? `${recentEntry.value} ${recentEntry.unit}`
                    : recentEntry.type === "Memory"
                    ? recentEntry.description
                    : recentEntry.type === "Journal"
                    ? recentEntry.content
                    : recentEntry.type === "Milestone"
                    ? recentEntry.description
                    : ""}
                </ThemedText>
              </LinearGradient>
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
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: customColors.lightBlue,
  },
  welcomeText: {
    textAlign: "center",
    fontSize: 16,
    color: customColors.textLightGray,
    lineHeight: 22,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statCard: {
    flexDirection: "row",
    backgroundColor: customColors.blue,
    padding: 16,
    borderRadius: 12,
    minWidth: 120,
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 14,
    color: customColors.textLightGray,
  },
  recentSection: {
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: customColors.lightBlue,
    marginBottom: 8,
  },
  recentCard: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recentProfile: {
    fontSize: 16,
    color: customColors.blue,
    fontWeight: "bold",
  },
  recentDate: {
    fontSize: 14,
    color: customColors.blue,
    fontWeight: "500",
  },
  recentCategory: {
    fontSize: 16,
    fontWeight: "bold",
    color: customColors.blue,
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
    backgroundColor: customColors.blue,
    padding: 16,
    borderRadius: 12,
  },
  tipText: {
    fontSize: 14,
    color: "white",
    flex: 1,
  },
});
