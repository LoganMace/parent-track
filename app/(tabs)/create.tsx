import React, { useReducer, useCallback } from "react";
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
  FavoriteEntry,
  MeasurementEntry,
  MemoryEntry,
  JournalEntry,
  MilestoneEntry,
} from "@/context/EntriesContext";
import { useProfiles } from "@/context/ProfilesContext";
import { Dropdown } from "@/components/ui/Dropdown";
import { DatePicker } from "@/components/ui/DatePicker";
import { InputGroup } from "@/components/ui/InputGroup";
import { customColors } from "@/constants/colors";
import { ENTRY_TYPES } from "@/constants/entryConstants";

// Define the state type
interface State {
  selectedProfile: string;
  entryType: string;
  entryDate: Date;
  showDatePicker: boolean;
  favoriteCategory: string;
  favoriteAnswer: string;
  measurementType: string;
  measurementValue: string;
  measurementUnit: string;
  memoryTitle: string;
  memoryDescription: string;
  memoryMood: string;
  journalTitle: string;
  journalContent: string;
  milestoneTitle: string;
  milestoneDescription: string;
  milestoneCategory: string;
}

// Define the action types
interface ResetFormAction {
  type: "RESET_FORM";
}

interface SetFieldAction {
  type: "SET_FIELD";
  field: keyof State;
  value: string | Date | boolean;
}

type Action = ResetFormAction | SetFieldAction;

const initialState: State = {
  selectedProfile: "",
  entryType: "Favorite",
  entryDate: new Date(),
  showDatePicker: false,
  favoriteCategory: "",
  favoriteAnswer: "",
  measurementType: "",
  measurementValue: "",
  measurementUnit: "",
  memoryTitle: "",
  memoryDescription: "",
  memoryMood: "",
  journalTitle: "",
  journalContent: "",
  milestoneTitle: "",
  milestoneDescription: "",
  milestoneCategory: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "RESET_FORM":
      return initialState;
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    default:
      return state;
  }
}

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
  const { profiles, activeProfileId } = useProfiles();

  const [state, dispatch] = useReducer(reducer, initialState);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM" });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const currentActiveProfile = profiles.find(
        (p) => p.id === activeProfileId
      );
      if (currentActiveProfile) {
        dispatch({
          type: "SET_FIELD",
          field: "selectedProfile",
          value: currentActiveProfile.name,
        });
      }
      return () => {
        resetForm();
      };
    }, [resetForm, activeProfileId, profiles])
  );

  const isFormValid = (): boolean => {
    if (!state.selectedProfile) return false;

    switch (state.entryType) {
      case "Favorite":
        return Boolean(state.favoriteCategory && state.favoriteAnswer.trim());
      case "Measurement":
        return Boolean(
          state.measurementType &&
            state.measurementValue &&
            state.measurementUnit
        );
      case "Memory":
        return Boolean(
          state.memoryTitle.trim() && state.memoryDescription.trim()
        );
      case "Journal":
        return Boolean(
          state.journalTitle.trim() && state.journalContent.trim()
        );
      case "Milestone":
        return Boolean(
          state.milestoneTitle.trim() && state.milestoneDescription.trim()
        );
      default:
        return false;
    }
  };

  const handleSave = (): void => {
    if (!isFormValid()) return;

    const selectedProfileData = profiles.find(
      (p) => p.name === state.selectedProfile
    );
    if (!selectedProfileData) return;

    let entry;

    switch (state.entryType) {
      case "Favorite":
        entry = {
          type: "Favorite",
          date: state.entryDate,
          profileId: selectedProfileData.id,
          category: state.favoriteCategory,
          answer: state.favoriteAnswer,
        } as Omit<FavoriteEntry, "id">;
        break;
      case "Measurement":
        entry = {
          type: "Measurement",
          date: state.entryDate,
          profileId: selectedProfileData.id,
          measurement: state.measurementType,
          value: parseFloat(state.measurementValue),
          unit: state.measurementUnit,
        } as Omit<MeasurementEntry, "id">;
        break;
      case "Memory":
        entry = {
          type: "Memory",
          date: state.entryDate,
          profileId: selectedProfileData.id,
          title: state.memoryTitle,
          description: state.memoryDescription,
          mood: state.memoryMood || undefined,
        } as Omit<MemoryEntry, "id">;
        break;
      case "Journal":
        entry = {
          type: "Journal",
          date: state.entryDate,
          profileId: selectedProfileData.id,
          title: state.journalTitle,
          content: state.journalContent,
        } as Omit<JournalEntry, "id">;
        break;
      case "Milestone":
        entry = {
          type: "Milestone",
          date: state.entryDate,
          profileId: selectedProfileData.id,
          title: state.milestoneTitle,
          description: state.milestoneDescription,
          category: state.milestoneCategory,
        } as Omit<MilestoneEntry, "id">;
        break;
      default:
        return;
    }

    addEntry(entry);
    resetForm();
  };

  const renderEntryFields = (): JSX.Element | null => {
    switch (state.entryType) {
      case "Favorite":
        return (
          <>
            <InputGroup
              label="Category"
              value={state.favoriteCategory}
              onChange={(value) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "favoriteCategory",
                  value,
                })
              }
              placeholder="Select a category..."
            />
            <InputGroup
              label="Answer"
              value={state.favoriteAnswer}
              onChange={(value) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "favoriteAnswer",
                  value,
                })
              }
              placeholder={
                state.favoriteCategory
                  ? `What is your favorite ${state.favoriteCategory}?`
                  : "Select a category first..."
              }
              multiline
            />
          </>
        );

      case "Measurement":
        return (
          <>
            <InputGroup
              label="Type"
              value={state.measurementType}
              onChange={(value) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "measurementType",
                  value,
                })
              }
              placeholder="Select measurement type..."
            />
            <InputGroup
              label="Value"
              value={state.measurementValue}
              onChange={(value) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "measurementValue",
                  value,
                })
              }
              placeholder="Enter value..."
              keyboardType="numeric"
            />
            <InputGroup
              label="Unit"
              value={state.measurementUnit}
              onChange={(value) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "measurementUnit",
                  value,
                })
              }
              placeholder="Enter unit (cm, kg, etc.)..."
            />
          </>
        );

      case "Memory":
        return (
          <>
            <InputGroup
              label="Title"
              value={state.memoryTitle}
              onChange={(value) =>
                dispatch({ type: "SET_FIELD", field: "memoryTitle", value })
              }
              placeholder="Enter memory title..."
            />
            <InputGroup
              label="Description"
              value={state.memoryDescription}
              onChange={(value) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "memoryDescription",
                  value,
                })
              }
              placeholder="Describe this memory..."
              multiline
            />
            <InputGroup
              label="Mood (optional)"
              value={state.memoryMood}
              onChange={(value) =>
                dispatch({ type: "SET_FIELD", field: "memoryMood", value })
              }
              placeholder="How were you feeling?"
            />
          </>
        );

      case "Journal":
        return (
          <>
            <InputGroup
              label="Title"
              value={state.journalTitle}
              onChange={(value) =>
                dispatch({ type: "SET_FIELD", field: "journalTitle", value })
              }
              placeholder="Enter journal title..."
            />
            <InputGroup
              label="Content"
              value={state.journalContent}
              onChange={(value) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "journalContent",
                  value,
                })
              }
              placeholder="Write your journal entry..."
              multiline
            />
          </>
        );

      case "Milestone":
        return (
          <>
            <InputGroup
              label="Category"
              value={state.milestoneCategory}
              onChange={(value) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "milestoneCategory",
                  value,
                })
              }
              placeholder="Select milestone category..."
            />
            <InputGroup
              label="Title"
              value={state.milestoneTitle}
              onChange={(value) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "milestoneTitle",
                  value,
                })
              }
              placeholder="Enter milestone title..."
            />
            <InputGroup
              label="Description"
              value={state.milestoneDescription}
              onChange={(value) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "milestoneDescription",
                  value,
                })
              }
              placeholder="Describe this milestone..."
              multiline
            />
          </>
        );

      default:
        return null;
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
                  value={state.selectedProfile}
                  onChange={(value) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "selectedProfile",
                      value,
                    })
                  }
                  placeholder="Select a profile..."
                />
              </ThemedView>

              <ThemedView style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Entry Type</ThemedText>
                <Dropdown
                  options={ENTRY_TYPES}
                  value={state.entryType}
                  onChange={(value) =>
                    dispatch({ type: "SET_FIELD", field: "entryType", value })
                  }
                  placeholder="Select entry type..."
                />
              </ThemedView>

              <ThemedView style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Date</ThemedText>
                <DatePicker
                  value={state.entryDate}
                  onChange={(value) =>
                    dispatch({ type: "SET_FIELD", field: "entryDate", value })
                  }
                  isVisible={state.showDatePicker}
                  onClose={() =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "showDatePicker",
                      value: false,
                    })
                  }
                  onOpen={() =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "showDatePicker",
                      value: true,
                    })
                  }
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
                      ? [customColors.lightTeal, customColors.lightBlue]
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
