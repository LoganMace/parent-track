import React, { useState, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  View,
  Dimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { customColors } from "@/constants/Colors";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  isVisible: boolean;
  onClose: () => void;
  onOpen: () => void;
  buttonStyle?: any;
}

export function DatePicker({
  value,
  onChange,
  isVisible,
  onClose,
  onOpen,
  buttonStyle,
}: DatePickerProps) {
  const [buttonLayout, setButtonLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const buttonRef = useRef<View>(null);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const measureButton = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setButtonLayout({ x: pageX, y: pageY, width, height });
      });
    }
  };

  const handleOpen = () => {
    measureButton();
    onOpen();
  };

  const screenHeight = Dimensions.get("window").height;
  const pickerHeight = 300; // Approximate height of the picker
  const shouldShowAbove =
    buttonLayout.y + buttonLayout.height + pickerHeight > screenHeight;

  return (
    <>
      <View ref={buttonRef} collapsable={false}>
        <TouchableOpacity
          onPress={handleOpen}
          style={[styles.dateButton, buttonStyle]}
        >
          <LinearGradient
            colors={[customColors.lightTeal, customColors.lightBlue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <ThemedText style={styles.dateButtonText}>
              {value.toLocaleDateString()}
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {isVisible && (
        <Modal
          visible={isVisible}
          transparent
          animationType="fade"
          onRequestClose={onClose}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={onClose}
          >
            <ThemedView
              style={[
                styles.datePickerContainer,
                {
                  position: "absolute",
                  left: buttonLayout.x,
                  width: buttonLayout.width,
                  ...(shouldShowAbove
                    ? { bottom: screenHeight - buttonLayout.y }
                    : { top: buttonLayout.y + buttonLayout.height + 8 }),
                },
              ]}
            >
              <DateTimePicker
                value={value}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
              <ThemedView style={styles.datePickerButtons}>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.datePickerButton}
                >
                  <LinearGradient
                    colors={[customColors.red, customColors.redDark]}
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
                  onPress={onClose}
                  style={styles.datePickerButton}
                >
                  <LinearGradient
                    colors={[customColors.lightTeal, customColors.lightBlue]}
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
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  dateButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  gradientButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  dateButtonText: {
    color: customColors.white,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: customColors.overlay,
  },
  datePickerContainer: {
    backgroundColor: customColors.darkGray,
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: customColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  datePickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 16,
  },
  datePickerButton: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  datePickerButtonText: {
    color: customColors.white,
    fontWeight: "bold",
  },
});
