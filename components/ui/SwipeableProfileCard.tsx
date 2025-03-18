import React, { useRef } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { customColors } from "@/constants/Colors";
import { Profile } from "@/context/ProfilesContext";
import { ProfileCard } from "./ProfileCard";
import { SharedValue } from "react-native-reanimated";

interface SwipeableProfileCardProps {
  profile: Profile;
  isActive?: boolean;
  onEdit: (profile: Profile, closeSwipe: () => void) => void;
  onDelete: (profile: Profile) => void;
  onSetActive: (profile: Profile) => void;
}

export function SwipeableProfileCard({
  profile,
  isActive,
  onEdit,
  onDelete,
  onSetActive,
}: SwipeableProfileCardProps) {
  const swipeableRef = useRef<SwipeableMethods>(null);

  const closeSwipe = () => {
    swipeableRef.current?.close();
  };

  const renderRightActions = (
    progress: SharedValue<number>,
    dragX: SharedValue<number>
  ) => {
    return (
      <ThemedView style={styles.actionsContainer}>
        {!isActive && (
          <TouchableOpacity
            style={[styles.actionButton, styles.activeButton]}
            onPress={() => {
              closeSwipe();
              onSetActive(profile);
            }}
          >
            <IconSymbol name="star.fill" size={24} color={customColors.white} />
            <ThemedText style={styles.actionText}>Set Active</ThemedText>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(profile, closeSwipe)}
        >
          <IconSymbol name="pencil" size={24} color={customColors.white} />
          <ThemedText style={styles.actionText}>Edit</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => {
            closeSwipe();
            onDelete(profile);
          }}
        >
          <IconSymbol name="trash" size={24} color={customColors.white} />
          <ThemedText style={styles.actionText}>Delete</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
    >
      <ProfileCard profile={profile} isActive={isActive} />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderRadius: 12,
  },
  activeButton: {
    backgroundColor: customColors.teal,
    marginRight: 8,
  },
  editButton: {
    backgroundColor: customColors.blue,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: customColors.red,
  },
  actionText: {
    color: customColors.white,
    fontSize: 12,
    marginTop: 4,
  },
});
