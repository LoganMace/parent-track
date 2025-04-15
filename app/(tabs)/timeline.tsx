import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useEntries } from "@/context/EntriesContext";
import { useProfiles } from "@/context/ProfilesContext";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useRef, useCallback } from "react";
import React from "react";
import { customColors } from "@/constants/colors";
import MOCK_ENTRIES from "@/components/__mocks__/mockEntries";
const TIMELINE_DOT_SIZE = 20;
const TIMELINE_LINE_WIDTH = 3;
const ENTRY_WIDTH = Dimensions.get("window").width * 0.4;
const ENTRY_MARGIN = 10;

function EmptyState({
  onNavigate,
  emptyType,
}: {
  onNavigate: () => void;
  emptyType: "profile" | "entry";
}) {
  return (
    <ThemedView style={styles.emptyContainer}>
      <ThemedText style={styles.emptyTitle}>
        No {emptyType === "profile" ? "Profiles" : "Entries"} Yet
      </ThemedText>
      <ThemedText style={styles.emptyText}>
        {emptyType === "profile"
          ? "Start creating profiles for your children to track their journey."
          : "Start creating entries to track your children's memories and experiences."}
      </ThemedText>
      <TouchableOpacity onPress={onNavigate} style={styles.createButton}>
        <LinearGradient
          colors={[customColors.teal, customColors.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <ThemedText style={styles.createButtonText}>
            {emptyType === "profile" ? "Create Profile" : "Create Entry"}
          </ThemedText>
        </LinearGradient>
      </TouchableOpacity>
    </ThemedView>
  );
}

export default function TimelineScreen() {
  const { entries } = useEntries();
  const { profiles, activeProfileId } = useProfiles();
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  useFocusEffect(
    useCallback(() => {
      scrollToTop();
    }, [scrollToTop])
  );

  const filteredEntries = entries.filter(
    (entry) => entry.profileId === activeProfileId
  );

  const sortedEntries = filteredEntries.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const handleNavigate = () => {
    if (!activeProfileId) {
      router.push("/(tabs)/profiles");
    } else {
      router.push("/(tabs)/create");
    }
  };

  const activeProfile = profiles?.find(
    (profile) => profile.id === activeProfileId
  );
  const profileName = activeProfile ? activeProfile.name : "No Active Profile";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {/* {!activeProfileId ? (
          <EmptyState emptyType="profile" onNavigate={handleNavigate} />
        ) : filteredEntries.length === 0 ? (
          <EmptyState emptyType="entry" onNavigate={handleNavigate} />
        ) : ( */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText style={styles.profileName}>{profileName}</ThemedText>
          <View style={styles.timelineLine}>
            <LinearGradient
              colors={[customColors.lightTeal, customColors.lightBlue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.timelineGradient}
            />
          </View>
          {MOCK_ENTRIES.map((entry, index) => {
            const isLeft = index % 2 === 0;
            return (
              <View
                key={index}
                style={[
                  styles.timelineRow,
                  isLeft ? styles.leftRow : styles.rightRow,
                ]}
              >
                <View
                  style={[
                    styles.entryContainer,
                    isLeft ? styles.leftEntry : styles.rightEntry,
                  ]}
                >
                  <LinearGradient
                    colors={[customColors.lightTeal, customColors.lightBlue]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.entryContent}
                  >
                    <ThemedText style={styles.category}>
                      {entry.type === "Favorite"
                        ? entry.category
                        : entry.type === "Measurement"
                        ? entry.measurement
                        : entry.type === "Memory"
                        ? entry.title
                        : entry.type === "Journal"
                        ? entry.title
                        : entry.type === "Milestone"
                        ? entry.category
                        : ""}
                    </ThemedText>
                    <ThemedText style={styles.answer} numberOfLines={3}>
                      {entry.type === "Favorite"
                        ? entry.answer
                        : entry.type === "Measurement"
                        ? `${entry.value} ${entry.unit}`
                        : entry.type === "Memory"
                        ? entry.description
                        : entry.type === "Journal"
                        ? entry.content
                        : entry.type === "Milestone"
                        ? entry.description
                        : ""}
                    </ThemedText>
                  </LinearGradient>
                </View>
                <View
                  style={[
                    styles.timelineDot,
                    isLeft ? styles.leftDot : styles.rightDot,
                  ]}
                />
                <View
                  style={[
                    styles.connector,
                    isLeft ? styles.leftConnector : styles.rightConnector,
                  ]}
                />
                <ThemedText
                  style={[
                    styles.date,
                    isLeft ? styles.leftDate : styles.rightDate,
                  ]}
                >
                  {entry.date.toLocaleDateString()}
                </ThemedText>
              </View>
            );
          })}
        </ScrollView>
        {/* )} */}
        <LinearGradient
          colors={[customColors.overlay, customColors.transparent]}
          style={styles.topFade}
          pointerEvents="none"
        />
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
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 60,
  },
  timelineLine: {
    position: "absolute",
    left: "50%",
    width: TIMELINE_LINE_WIDTH,
    height: "100%",
    marginLeft: -TIMELINE_LINE_WIDTH / 2,
    paddingTop: 80,
  },
  timelineGradient: {
    flex: 1,
    width: "100%",
  },
  timelineRow: {
    flexDirection: "row",
    minHeight: 100,
    marginVertical: ENTRY_MARGIN,
    alignItems: "flex-start",
  },
  leftRow: {
    justifyContent: "flex-start",
  },
  rightRow: {
    justifyContent: "flex-end",
  },
  entryContainer: {
    width: ENTRY_WIDTH,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: customColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  leftEntry: {
    marginRight: 20,
    marginLeft: "5%",
  },
  rightEntry: {
    marginLeft: 20,
    marginRight: "5%",
  },
  entryContent: {
    padding: 12,
  },
  date: {
    color: customColors.lightBlue,
    fontSize: 13,
    position: "absolute",
    top: 24,
    fontWeight: "500",
    lineHeight: 13,
  },
  leftDate: {
    left: "50%",
    marginLeft: 14,
  },
  rightDate: {
    right: "50%",
    marginRight: 14,
    textAlign: "right",
  },
  category: {
    color: customColors.blue,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  answer: {
    color: customColors.textDark,
    fontSize: 14,
  },
  timelineDot: {
    width: TIMELINE_DOT_SIZE,
    height: TIMELINE_DOT_SIZE,
    borderRadius: TIMELINE_DOT_SIZE / 2,
    backgroundColor: customColors.lightTeal,
    borderWidth: 3,
    borderColor: customColors.blue,
    position: "absolute",
    top: 20,
  },
  leftDot: {
    left: "50%",
    marginLeft: -TIMELINE_DOT_SIZE / 2,
  },
  rightDot: {
    left: "50%",
    marginLeft: -TIMELINE_DOT_SIZE / 2,
  },
  connector: {
    position: "absolute",
    top: 29,
    height: TIMELINE_LINE_WIDTH,
    backgroundColor: customColors.lightTeal,
    width: 10,
  },
  leftConnector: {
    right: "50%",
    marginRight: TIMELINE_DOT_SIZE / 2 - 1,
  },
  rightConnector: {
    left: "50%",
    marginLeft: TIMELINE_DOT_SIZE / 2 - 1,
  },
  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: customColors.lightBlue,
  },
  emptyText: {
    fontSize: 16,
    color: customColors.textGray,
    textAlign: "center",
    marginVertical: 10,
  },
  createButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  createButtonText: {
    color: customColors.white,
    fontWeight: "bold",
  },
  gradientButton: {
    padding: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: customColors.lightBlue,
    padding: 20,
    textAlign: "center",
  },
});
