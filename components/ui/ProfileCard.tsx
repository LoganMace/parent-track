import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { customColors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Profile } from "@/context/ProfilesContext";

interface ProfileCardProps {
  profile: Profile;
  isActive?: boolean;
}

function calculateAge(birthday: Date): string {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthday.getDate())
  ) {
    age--;
  }

  return age.toString();
}

export function ProfileCard({ profile, isActive }: ProfileCardProps) {
  const age = calculateAge(profile.birthday);

  return (
    <ThemedView style={styles.profileCard}>
      <LinearGradient
        colors={[customColors.lightTeal, customColors.lightBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileGradient}
      >
        <IconSymbol
          name="person.circle.fill"
          size={40}
          color={customColors.blue}
        />
        <ThemedView style={styles.profileInfo}>
          <ThemedView style={styles.nameRow}>
            <ThemedText style={styles.profileName}>{profile.name}</ThemedText>
            {isActive && (
              <ThemedView style={styles.activeIndicator}>
                <ThemedText style={styles.activeText}>Active</ThemedText>
              </ThemedView>
            )}
          </ThemedView>
          <ThemedText style={styles.profileAge}>Age: {age}</ThemedText>
        </ThemedView>
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: customColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  profileGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
    backgroundColor: customColors.transparent,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: customColors.transparent,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "600",
    color: customColors.blue,
  },
  profileAge: {
    fontSize: 13,
    color: customColors.textDark,
  },
  activeIndicator: {
    backgroundColor: customColors.darkGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  activeText: {
    fontSize: 12,
    color: customColors.teal,
    fontWeight: "600",
  },
});
