import { StyleSheet, ScrollView, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useEntries } from "@/context/EntriesContext";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useRef, useCallback } from "react";
import React from "react";
import { customColors } from "@/constants/Colors";

const MOCK_ENTRIES = [
  {
    date: new Date("2024-03-20"),
    favorite: "Color",
    answer:
      "Deep ocean blue - it reminds me of diving in the Great Barrier Reef",
  },
  {
    date: new Date("2024-02-14"),
    favorite: "Food",
    answer: "Homemade lasagna with my grandmother's secret recipe",
  },
  {
    date: new Date("2023-12-25"),
    favorite: "Movie",
    answer:
      "The Shawshank Redemption - a timeless story of hope and friendship",
  },
  {
    date: new Date("2023-10-31"),
    favorite: "Animal",
    answer: "Red pandas because they're playful and adorable",
  },
  {
    date: new Date("2023-08-15"),
    favorite: "Song",
    answer: "Bohemian Rhapsody - it's like multiple songs in one epic journey",
  },
  {
    date: new Date("2023-06-21"),
    favorite: "Game",
    answer: "The Legend of Zelda: Breath of the Wild - endless exploration",
  },
  {
    date: new Date("2023-01-01"),
    favorite: "Sport",
    answer: "Rock climbing - it's both physically and mentally challenging",
  },
  {
    date: new Date("2022-12-31"),
    favorite: "Show",
    answer: "Breaking Bad - the character development is unmatched",
  },
];

const TIMELINE_DOT_SIZE = 20;
const TIMELINE_LINE_WIDTH = 3;
const ENTRY_WIDTH = Dimensions.get("window").width * 0.4;
const ENTRY_MARGIN = 10;

export default function TimelineScreen() {
  const { entries } = useEntries();
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Scroll to top when the screen is focused
      scrollToTop();
    }, [scrollToTop])
  );

  // Use mock entries for development, comment out for production
  const sortedEntries = MOCK_ENTRIES.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.timelineLine}>
            <LinearGradient
              colors={[customColors.lightTeal, customColors.lightBlue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.timelineGradient}
            />
          </View>
          {sortedEntries.map((entry, index) => {
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
                      {entry.favorite}
                    </ThemedText>
                    <ThemedText style={styles.answer} numberOfLines={3}>
                      {entry.answer}
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
    backgroundColor: customColors.teal,
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
    backgroundColor: customColors.teal,
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
});
