import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import {
  useEntries,
  EntryType,
  Entry,
  FavoriteEntry,
  MeasurementEntry,
  MemoryEntry,
  JournalEntry,
  MilestoneEntry,
} from "@/context/EntriesContext";
import { useProfiles } from "@/context/ProfilesContext";
import { Dropdown } from "@/components/ui/Dropdown";
import { DatePicker } from "@/components/ui/DatePicker";
import { customColors } from "@/constants/Colors";

const ENTRY_TYPES: EntryType[] = [
  "Favorite",
  "Measurement",
  "Memory",
  "Journal",
  "Milestone",
];

const FAVORITE_CATEGORIES = [
  "Color",
  "Food",
  "Animal",
  "Movie",
  "Show",
  "Song",
  "Sport",
  "Game",
];

const MEASUREMENT_TYPES = [
  "Height",
  "Weight",
  "Head Circumference",
  "Shoe Size",
  "Clothing Size",
];

const MILESTONE_CATEGORIES = [
  "First Steps",
  "First Words",
  "First Day of School",
  "Lost Tooth",
  "Birthday",
  "Achievement",
  "Other",
];

function EmptyState() {
  const router = useRouter();

  return (
    <ThemedView style={styles.emptyContainer}>
      <IconSymbol name="person.2.fill" size={48} color={customColors.teal} />
      <ThemedText style={styles.emptyTitle}>No Profiles Yet</ThemedText>
      <ThemedText style={styles.emptyText}>
        Create a profile for your child to start tracking their journey.
      </ThemedText>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/profiles")}
        style={styles.createProfileButton}
      >
        <LinearGradient
          colors={[customColors.teal, customColors.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <ThemedText style={styles.createProfileButtonText}>
            Create Profile
          </ThemedText>
        </LinearGradient>
      </TouchableOpacity>
    </ThemedView>
  );
}

export default function CreateScreen() {
  const { addEntry } = useEntries();
  const { profiles } = useProfiles();
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [entryType, setEntryType] = useState<EntryType>("Favorite");
  const [entryDate, setEntryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Favorite type fields
  const [favoriteCategory, setFavoriteCategory] = useState("");
  const [favoriteAnswer, setFavoriteAnswer] = useState("");

  // Measurement type fields
  const [measurementType, setMeasurementType] = useState("");
  const [measurementValue, setMeasurementValue] = useState("");
  const [measurementUnit, setMeasurementUnit] = useState("");

  // Memory type fields
  const [memoryTitle, setMemoryTitle] = useState("");
  const [memoryDescription, setMemoryDescription] = useState("");
  const [memoryMood, setMemoryMood] = useState("");

  // Journal type fields
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");

  // Milestone type fields
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [milestoneCategory, setMilestoneCategory] = useState("");

  const resetForm = useCallback(() => {
    setSelectedProfile("");
    setEntryType("Favorite");
    setEntryDate(new Date());
    setShowDatePicker(false);

    // Reset all type-specific fields
    setFavoriteCategory("");
    setFavoriteAnswer("");
    setMeasurementType("");
    setMeasurementValue("");
    setMeasurementUnit("");
    setMemoryTitle("");
    setMemoryDescription("");
    setMemoryMood("");
    setJournalTitle("");
    setJournalContent("");
    setMilestoneTitle("");
    setMilestoneDescription("");
    setMilestoneCategory("");
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm();
      };
    }, [resetForm])
  );

  const isFormValid = () => {
    if (!selectedProfile) return false;

    switch (entryType) {
      case "Favorite":
        return Boolean(favoriteCategory && favoriteAnswer.trim());
      case "Measurement":
        return Boolean(measurementType && measurementValue && measurementUnit);
      case "Memory":
        return Boolean(memoryTitle.trim() && memoryDescription.trim());
      case "Journal":
        return Boolean(journalTitle.trim() && journalContent.trim());
      case "Milestone":
        return Boolean(milestoneTitle.trim() && milestoneDescription.trim());
      default:
        return false;
    }
  };

  const handleSave = () => {
    if (!isFormValid()) return;

    let entry: Omit<Entry, "id">;

    switch (entryType) {
      case "Favorite":
        entry = {
          type: "Favorite",
          date: entryDate,
          profileId: selectedProfile,
          category: favoriteCategory,
          answer: favoriteAnswer,
        } as Omit<FavoriteEntry, "id">;
        break;
      case "Measurement":
        entry = {
          type: "Measurement",
          date: entryDate,
          profileId: selectedProfile,
          measurement: measurementType,
          value: parseFloat(measurementValue),
          unit: measurementUnit,
        } as Omit<MeasurementEntry, "id">;
        break;
      case "Memory":
        entry = {
          type: "Memory",
          date: entryDate,
          profileId: selectedProfile,
          title: memoryTitle,
          description: memoryDescription,
          mood: memoryMood || undefined,
        } as Omit<MemoryEntry, "id">;
        break;
      case "Journal":
        entry = {
          type: "Journal",
          date: entryDate,
          profileId: selectedProfile,
          title: journalTitle,
          content: journalContent,
        } as Omit<JournalEntry, "id">;
        break;
      case "Milestone":
        entry = {
          type: "Milestone",
          date: entryDate,
          profileId: selectedProfile,
          title: milestoneTitle,
          description: milestoneDescription,
          category: milestoneCategory,
        } as Omit<MilestoneEntry, "id">;
        break;
      default:
        return;
    }

    addEntry(entry);
    resetForm();
  };

  const renderEntryFields = () => {
    switch (entryType) {
      case "Favorite":
        return (
          <>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Category</ThemedText>
              <Dropdown
                options={FAVORITE_CATEGORIES}
                value={favoriteCategory}
                onChange={setFavoriteCategory}
                placeholder="Select a category..."
              />
            </ThemedView>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Answer</ThemedText>
              <TextInput
                style={[styles.textInput, { color: customColors.white }]}
                value={favoriteAnswer}
                onChangeText={setFavoriteAnswer}
                placeholder={
                  favoriteCategory
                    ? `What is your favorite ${favoriteCategory}?`
                    : "Select a category first..."
                }
                placeholderTextColor={customColors.textGray}
                multiline
              />
            </ThemedView>
          </>
        );

      case "Measurement":
        return (
          <>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Type</ThemedText>
              <Dropdown
                options={MEASUREMENT_TYPES}
                value={measurementType}
                onChange={setMeasurementType}
                placeholder="Select measurement type..."
              />
            </ThemedView>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Value</ThemedText>
              <TextInput
                style={[styles.textInput, { color: customColors.white }]}
                value={measurementValue}
                onChangeText={setMeasurementValue}
                placeholder="Enter value..."
                placeholderTextColor={customColors.textGray}
                keyboardType="numeric"
              />
            </ThemedView>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Unit</ThemedText>
              <TextInput
                style={[styles.textInput, { color: customColors.white }]}
                value={measurementUnit}
                onChangeText={setMeasurementUnit}
                placeholder="Enter unit (cm, kg, etc.)..."
                placeholderTextColor={customColors.textGray}
              />
            </ThemedView>
          </>
        );

      case "Memory":
        return (
          <>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Title</ThemedText>
              <TextInput
                style={[styles.textInput, { color: customColors.white }]}
                value={memoryTitle}
                onChangeText={setMemoryTitle}
                placeholder="Enter memory title..."
                placeholderTextColor={customColors.textGray}
              />
            </ThemedView>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Description</ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  { color: customColors.white, height: 120 },
                ]}
                value={memoryDescription}
                onChangeText={setMemoryDescription}
                placeholder="Describe this memory..."
                placeholderTextColor={customColors.textGray}
                multiline
              />
            </ThemedView>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Mood (optional)</ThemedText>
              <TextInput
                style={[styles.textInput, { color: customColors.white }]}
                value={memoryMood}
                onChangeText={setMemoryMood}
                placeholder="How were you feeling?"
                placeholderTextColor={customColors.textGray}
              />
            </ThemedView>
          </>
        );

      case "Journal":
        return (
          <>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Title</ThemedText>
              <TextInput
                style={[styles.textInput, { color: customColors.white }]}
                value={journalTitle}
                onChangeText={setJournalTitle}
                placeholder="Enter journal title..."
                placeholderTextColor={customColors.textGray}
              />
            </ThemedView>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Content</ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  { color: customColors.white, height: 200 },
                ]}
                value={journalContent}
                onChangeText={setJournalContent}
                placeholder="Write your journal entry..."
                placeholderTextColor={customColors.textGray}
                multiline
              />
            </ThemedView>
          </>
        );

      case "Milestone":
        return (
          <>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Category</ThemedText>
              <Dropdown
                options={MILESTONE_CATEGORIES}
                value={milestoneCategory}
                onChange={setMilestoneCategory}
                placeholder="Select milestone category..."
              />
            </ThemedView>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Title</ThemedText>
              <TextInput
                style={[styles.textInput, { color: customColors.white }]}
                value={milestoneTitle}
                onChangeText={setMilestoneTitle}
                placeholder="Enter milestone title..."
                placeholderTextColor={customColors.textGray}
              />
            </ThemedView>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Description</ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  { color: customColors.white, height: 120 },
                ]}
                value={milestoneDescription}
                onChangeText={setMilestoneDescription}
                placeholder="Describe this milestone..."
                placeholderTextColor={customColors.textGray}
                multiline
              />
            </ThemedView>
          </>
        );
    }
  };

  if (!profiles.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <EmptyState />
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <ThemedView style={styles.formContainer}>
              <ThemedView style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Profile</ThemedText>
                <Dropdown
                  options={profiles.map((p) => p.name)}
                  value={selectedProfile}
                  onChange={setSelectedProfile}
                  placeholder="Select a profile..."
                />
              </ThemedView>

              <ThemedView style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Entry Type</ThemedText>
                <Dropdown
                  options={ENTRY_TYPES}
                  value={entryType}
                  onChange={(value) => setEntryType(value as EntryType)}
                  placeholder="Select entry type..."
                />
              </ThemedView>

              <ThemedView style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Date</ThemedText>
                <DatePicker
                  value={entryDate}
                  onChange={setEntryDate}
                  isVisible={showDatePicker}
                  onClose={() => setShowDatePicker(false)}
                  onOpen={() => setShowDatePicker(true)}
                />
              </ThemedView>

              {renderEntryFields()}

              <TouchableOpacity
                onPress={handleSave}
                style={[
                  styles.saveButton,
                  !isFormValid() && styles.saveButtonDisabled,
                ]}
                disabled={!isFormValid()}
              >
                <LinearGradient
                  colors={
                    isFormValid()
                      ? [customColors.teal, customColors.blue]
                      : [
                          customColors.disabledGray,
                          customColors.disabledDarkGray,
                        ]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <ThemedText style={styles.saveButtonText}>
                    Save Entry
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </ThemedView>
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  formContainer: {
    padding: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: customColors.white,
  },
  textInput: {
    borderWidth: 1,
    borderColor: customColors.borderGray,
    borderRadius: 8,
    padding: 12,
    minHeight: 48,
    backgroundColor: customColors.white + "10",
  },
  gradientButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: customColors.white,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: customColors.white,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: customColors.textGray,
    textAlign: "center",
    marginBottom: 8,
  },
  createProfileButton: {
    width: "100%",
    maxWidth: 300,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  createProfileButtonText: {
    color: customColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
