import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
} from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEntries } from "@/context/EntriesContext";

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

export default function FavsScreen() {
  const { entries, addEntry } = useEntries();
  const [currentEntry, setCurrentEntry] = useState<Entry>({
    date: new Date(),
    favorite: "",
    answer: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

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
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.entriesList}>
          {entries
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((entry, index) => (
              <ThemedView key={index} style={styles.entryItem}>
                <ThemedText style={styles.entryDate}>
                  {entry.date.toLocaleDateString()}
                </ThemedText>
                <ThemedText style={styles.entryFavorite}>
                  {entry.favorite}
                </ThemedText>
                <ThemedText style={styles.entryAnswer}>
                  {entry.answer}
                </ThemedText>
              </ThemedView>
            ))}
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
  entriesList: {
    flex: 1,
  },
  entryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 4,
  },
  entryDate: {
    fontSize: 14,
    color: "#666",
  },
  entryFavorite: {
    fontSize: 16,
    fontWeight: "bold",
  },
  entryAnswer: {
    fontSize: 14,
  },
});
