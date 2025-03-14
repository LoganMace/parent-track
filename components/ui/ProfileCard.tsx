import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { customColors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Profile } from "@/context/ProfilesContext";

interface ProfileCardProps {
  profile: Profile;
}

function calculateAge(birthday: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthday.getDate())
  ) {
    age--;
  }

  return age;
}

export function ProfileCard({ profile }: ProfileCardProps) {
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
          <ThemedText style={styles.profileName}>{profile.name}</ThemedText>
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
  profileName: {
    fontSize: 17,
    fontWeight: "600",
    color: customColors.blue,
  },
  profileAge: {
    fontSize: 13,
    color: customColors.textDark,
  },
});
