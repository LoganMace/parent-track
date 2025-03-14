import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  View,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEntries } from "@/context/EntriesContext";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Dropdown } from "@/components/ui/Dropdown";

interface Entry {
  date: Date;
  favorite: string;
  answer: string;
}

const FAVORITE_OPTIONS = [
  "Color",
  "Food",
  "Animal",
  "Movie",
  "Show",
  "Song",
  "Sport",
  "Game",
];

export default function CreateScreen() {
  const { addEntry } = useEntries();
  const [currentEntry, setCurrentEntry] = useState<Entry>({
    date: new Date(),
    favorite: "",
    answer: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [dropdownLayout, setDropdownLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const resetForm = useCallback(() => {
    setCurrentEntry({
      date: new Date(),
      favorite: "",
      answer: "",
    });
    setShowDatePicker(false);
    setShowDropdown(false);
    setTempDate(new Date());
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm();
      };
    }, [resetForm])
  );

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || tempDate;
    setTempDate(currentDate);
  };

  const confirmDate = () => {
    setCurrentEntry((prev) => ({ ...prev, date: tempDate }));
    setShowDatePicker(false);
  };

  const saveEntry = () => {
    if (currentEntry.favorite && currentEntry.answer.trim()) {
      Keyboard.dismiss();
      addEntry(currentEntry);
      setCurrentEntry({ date: new Date(), favorite: "", answer: "" });
    }
  };

  const isFormValid = currentEntry.favorite && currentEntry.answer.trim();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() => {
                if (showDatePicker) {
                  setShowDatePicker(false);
                } else {
                  setTempDate(currentEntry.date);
                  setShowDatePicker(true);
                }
              }}
              style={styles.dateButton}
            >
              <LinearGradient
                colors={["#4FD1C5", "#2C5282"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <ThemedText style={styles.dateButtonText}>
                  {currentEntry.date.toLocaleDateString()}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>

            {showDatePicker && (
              <ThemedView style={styles.datePickerContainer}>
                <DateTimePicker
                  testID="datePicker"
                  value={tempDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                />
                <ThemedView style={styles.datePickerButtons}>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    style={styles.datePickerButton}
                  >
                    <LinearGradient
                      colors={["#FF6B6B", "#FF3B30"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      <ThemedText style={styles.datePickerButtonText}>
                        Cancel
                      </ThemedText>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={confirmDate}
                    style={styles.datePickerButton}
                  >
                    <LinearGradient
                      colors={["#4FD1C5", "#2C5282"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      <ThemedText style={styles.datePickerButtonText}>
                        Confirm
                      </ThemedText>
                    </LinearGradient>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            )}

            <ThemedView style={styles.formContainer}>
              <ThemedView style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Favorite:</ThemedText>
                <Dropdown
                  options={FAVORITE_OPTIONS}
                  value={currentEntry.favorite}
                  onChange={(value) =>
                    setCurrentEntry((prev) => ({ ...prev, favorite: value }))
                  }
                  placeholder="What is your favorite..."
                />
              </ThemedView>

              <ThemedView style={styles.inputGroup}>
                <TextInput
                  style={[styles.textInput, { color: "white" }]}
                  value={currentEntry.answer}
                  onChangeText={(text) =>
                    setCurrentEntry((prev) => ({ ...prev, answer: text }))
                  }
                  placeholder={
                    currentEntry.favorite
                      ? `What is your favorite ${currentEntry.favorite}?`
                      : "Select a category..."
                  }
                  placeholderTextColor="#666"
                  multiline
                />
              </ThemedView>
            </ThemedView>

            <TouchableOpacity
              onPress={saveEntry}
              style={[
                styles.saveButton,
                !isFormValid && styles.saveButtonDisabled,
              ]}
              disabled={!isFormValid}
            >
              <LinearGradient
                colors={
                  isFormValid ? ["#4FD1C5", "#2C5282"] : ["#cccccc", "#999999"]
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
        </ThemedView>

        <Modal
          visible={showDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDropdown(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              setShowDropdown(false);
              Keyboard.dismiss();
            }}
          >
            <ThemedView
              style={[
                styles.dropdownList,
                {
                  position: "absolute",
                  top: dropdownLayout.y + dropdownLayout.height,
                  left: dropdownLayout.x,
                  width: dropdownLayout.width,
                },
              ]}
            >
              <ScrollView bounces={false} style={styles.dropdownScroll}>
                {FAVORITE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCurrentEntry((prev) => ({
                        ...prev,
                        favorite: option,
                      }));
                      setShowDropdown(false);
                    }}
                  >
                    <ThemedText
                      style={[
                        styles.dropdownItemText,
                        currentEntry.favorite === option &&
                          styles.dropdownItemSelected,
                      ]}
                    >
                      {option}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ThemedView>
          </TouchableOpacity>
        </Modal>
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
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
    gap: 12,
  },
  formContainer: {
    gap: 12,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: Platform.OS === "ios" ? "transparent" : "#2C5282",
  },
  picker: {
    height: Platform.OS === "ios" ? 150 : 50,
    color: "white",
    backgroundColor: Platform.OS === "ios" ? "transparent" : "#2C5282",
  },
  dateButton: {
    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  datePickerContainer: {
    alignItems: "center",
    gap: 12,
  },
  datePickerButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  datePickerButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  datePickerButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  gradientButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 100,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  dateButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
    paddingHorizontal: 16,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#2C5282",
  },
  dropdownButtonEmpty: {
    backgroundColor: "transparent",
  },
  dropdownButtonText: {
    color: "white",
    fontSize: 16,
  },
  dropdownButtonTextEmpty: {
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownList: {
    backgroundColor: "#2C5282",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 200,
  },
  dropdownScroll: {
    flexGrow: 0,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  dropdownItemText: {
    color: "white",
    fontSize: 16,
  },
  dropdownItemSelected: {
    fontWeight: "bold",
    color: "#4FD1C5",
  },
});
