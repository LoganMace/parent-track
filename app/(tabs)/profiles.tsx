import {
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { SwipeableProfileCard } from "@/components/ui/SwipeableProfileCard";
import { customColors } from "@/constants/Colors";
import { useState } from "react";
import { useProfiles } from "@/context/ProfilesContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Profile } from "@/context/ProfilesContext";

export default function ProfilesScreen() {
  const {
    profiles,
    addProfile,
    updateProfile,
    deleteProfile,
    activeProfileId,
    setActiveProfile,
  } = useProfiles();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileBirthday, setNewProfileBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeCloseSwipe, setActiveCloseSwipe] = useState<(() => void) | null>(
    null
  );

  const resetForm = () => {
    setNewProfileName("");
    setNewProfileBirthday(new Date());
    setShowDatePicker(false);
    setIsEditMode(false);
    setEditingProfile(null);
    setActiveCloseSwipe(null);
  };

  const isFormValid =
    newProfileName.trim().length > 0 && newProfileBirthday instanceof Date;

  const handleAddProfile = () => {
    if (newProfileName) {
      if (isEditMode && editingProfile) {
        updateProfile(editingProfile.id, newProfileName, newProfileBirthday);
        activeCloseSwipe?.();
      } else {
        addProfile(newProfileName, newProfileBirthday);
      }
      setIsAddModalVisible(false);
      resetForm();
    }
  };

  const handleEditProfile = (profile: Profile, closeSwipe: () => void) => {
    setIsEditMode(true);
    setEditingProfile(profile);
    setNewProfileName(profile.name);
    setNewProfileBirthday(profile.birthday);
    setActiveCloseSwipe(() => closeSwipe);
    setIsAddModalVisible(true);
  };

  const handleDeleteProfile = (profile: Profile) => {
    Alert.alert(
      "Delete Profile",
      `Are you sure you want to delete ${profile.name}'s profile?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteProfile(profile.id),
        },
      ]
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setNewProfileBirthday(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSetActiveProfile = (profile: Profile) => {
    setActiveProfile(profile.id);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <ThemedView style={styles.header}>
              <ThemedText style={styles.title}>Profiles</ThemedText>
              <ThemedText style={styles.subtitle}>
                Manage your children's profiles
              </ThemedText>
            </ThemedView>

            <TouchableOpacity
              style={styles.addProfileCard}
              onPress={() => {
                resetForm();
                setIsAddModalVisible(true);
              }}
            >
              <IconSymbol
                name="plus.circle.fill"
                size={24}
                color={customColors.teal}
              />
              <ThemedText style={styles.addProfileText}>
                Add a new profile
              </ThemedText>
            </TouchableOpacity>

            <ThemedView style={styles.profilesList}>
              <ThemedText style={styles.sectionTitle}>Your Profiles</ThemedText>
              {profiles.length === 0 ? (
                <ThemedText style={styles.emptyText}>
                  No profiles yet. Add your first profile to get started!
                </ThemedText>
              ) : (
                profiles.map((profile) => (
                  <SwipeableProfileCard
                    key={profile.id}
                    profile={profile}
                    isActive={profile.id === activeProfileId}
                    onEdit={(profile, closeSwipe) =>
                      handleEditProfile(profile, closeSwipe)
                    }
                    onDelete={handleDeleteProfile}
                    onSetActive={handleSetActiveProfile}
                  />
                ))
              )}
            </ThemedView>
          </ScrollView>

          <Modal
            visible={isAddModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              resetForm();
              setIsAddModalVisible(false);
            }}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => {
                Keyboard.dismiss();
                resetForm();
                setIsAddModalVisible(false);
              }}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
              >
                <ThemedView style={styles.modalContent}>
                  <ThemedText style={styles.modalTitle}>
                    {isEditMode ? "Edit Profile" : "Add New Profile"}
                  </ThemedText>

                  <ThemedView style={styles.inputContainer}>
                    <ThemedText style={styles.inputLabel}>Name</ThemedText>
                    <TextInput
                      style={styles.input}
                      value={newProfileName}
                      onChangeText={setNewProfileName}
                      placeholder="Enter name"
                      placeholderTextColor={customColors.textLight}
                      onFocus={() => setShowDatePicker(false)}
                    />
                  </ThemedView>

                  <ThemedView style={styles.inputContainer}>
                    <ThemedText style={styles.inputLabel}>Birthday</ThemedText>
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <ThemedText style={styles.dateButtonText}>
                        {formatDate(newProfileBirthday)}
                      </ThemedText>
                    </TouchableOpacity>
                  </ThemedView>

                  {showDatePicker && (
                    <DateTimePicker
                      value={newProfileBirthday}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  )}

                  <ThemedView style={styles.modalButtons}>
                    <TouchableOpacity
                      onPress={() => {
                        Keyboard.dismiss();
                        resetForm();
                        setIsAddModalVisible(false);
                      }}
                      style={styles.modalButton}
                    >
                      <LinearGradient
                        colors={[customColors.red, customColors.redDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                      >
                        <ThemedText style={styles.modalButtonText}>
                          Cancel
                        </ThemedText>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleAddProfile}
                      style={[
                        styles.modalButton,
                        !isFormValid && styles.disabledButton,
                      ]}
                      disabled={!isFormValid}
                    >
                      <LinearGradient
                        colors={
                          isFormValid
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
                        <ThemedText style={styles.modalButtonText}>
                          {isEditMode ? "Save Changes" : "Save"}
                        </ThemedText>
                      </LinearGradient>
                    </TouchableOpacity>
                  </ThemedView>
                </ThemedView>
              </KeyboardAvoidingView>
            </TouchableOpacity>
          </Modal>
        </ThemedView>
      </SafeAreaView>
    </GestureHandlerRootView>
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
  header: {
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: customColors.lightBlue,
  },
  subtitle: {
    fontSize: 16,
    color: customColors.textLightGray,
  },
  addProfileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: customColors.darkGray,
    padding: 16,
    margin: 20,
    borderRadius: 12,
  },
  addProfileText: {
    fontSize: 16,
    fontWeight: "600",
    color: customColors.white,
  },
  profilesList: {
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: customColors.lightBlue,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: customColors.textGray,
    textAlign: "center",
    marginTop: 20,
  },
  keyboardAvoidingView: {
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: customColors.overlay,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: customColors.darkGray,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 20,
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: customColors.white,
    textAlign: "center",
  },
  inputContainer: {
    gap: 8,
    backgroundColor: customColors.darkGray,
    borderRadius: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: customColors.white,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: customColors.white + "40",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: customColors.white,
    backgroundColor: customColors.white + "10",
  },
  gradientButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 100,
  },
  modalButtons: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  modalButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  modalButtonText: {
    color: customColors.white,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: customColors.white + "40",
    borderRadius: 16,
    padding: 16,
    backgroundColor: customColors.white + "10",
  },
  dateButtonText: {
    fontSize: 16,
    color: customColors.white,
  },
});
