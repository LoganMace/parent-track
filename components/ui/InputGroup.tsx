import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { customColors } from "@/constants/colors";

interface InputGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  keyboardType = "default",
}) => {
  return (
    <View style={styles.inputGroup}>
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <TextInput
        style={[styles.textInput, { color: customColors.white }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={customColors.textGray}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});