import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
}: DropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  return (
    <>
      <TouchableOpacity
        style={[styles.dropdownButton, !value && styles.dropdownButtonEmpty]}
        onPress={() => {
          setShowDropdown(true);
        }}
        onLayout={(event) => {
          event.target.measure((x, y, width, height, pageX, pageY) => {
            setDropdownLayout({ x: pageX, y: pageY, width, height });
          });
        }}
      >
        <ThemedText
          style={[
            styles.dropdownButtonText,
            !value && styles.dropdownButtonTextEmpty,
          ]}
        >
          {value || placeholder}
        </ThemedText>
        <IconSymbol
          size={20}
          name="chevron.down"
          color={value ? "white" : "#666"}
        />
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
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
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onChange(option);
                    setShowDropdown(false);
                  }}
                >
                  <ThemedText
                    style={[
                      styles.dropdownItemText,
                      value === option && styles.dropdownItemSelected,
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
    </>
  );
}

const styles = StyleSheet.create({
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
