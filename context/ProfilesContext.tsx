import React, { createContext, useContext, useState } from "react";

export interface Profile {
  id: string;
  name: string;
  birthday: Date;
}

export interface ProfilesContextType {
  profiles: Profile[];
  activeProfileId: string | null;
  addProfile: (name: string, birthday: Date) => void;
  updateProfile: (id: string, name: string, birthday: Date) => void;
  deleteProfile: (id: string) => void;
  setActiveProfile: (id: string) => void;
}

const ProfilesContext = createContext<ProfilesContextType | undefined>(
  undefined
);

export function ProfilesProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  const addProfile = (name: string, birthday: Date) => {
    const newProfile = {
      id: Math.random().toString(),
      name,
      birthday,
    };

    setProfiles((currentProfiles) => {
      const updatedProfiles = [...currentProfiles, newProfile];
      // Set as active if it's the first profile
      if (updatedProfiles.length === 1) {
        setActiveProfileId(newProfile.id);
      }
      return updatedProfiles;
    });
  };

  const updateProfile = (id: string, name: string, birthday: Date) => {
    setProfiles((currentProfiles) =>
      currentProfiles.map((profile) =>
        profile.id === id ? { ...profile, name, birthday } : profile
      )
    );
  };

  const deleteProfile = (id: string) => {
    setProfiles((currentProfiles) => {
      const updatedProfiles = currentProfiles.filter(
        (profile) => profile.id !== id
      );
      // If we're deleting the active profile, set the first remaining profile as active
      if (id === activeProfileId && updatedProfiles.length > 0) {
        setActiveProfileId(updatedProfiles[0].id);
      } else if (updatedProfiles.length === 0) {
        setActiveProfileId(null);
      }
      return updatedProfiles;
    });
  };

  const setActiveProfile = (id: string) => {
    setActiveProfileId(id);
  };

  return (
    <ProfilesContext.Provider
      value={{
        profiles,
        activeProfileId,
        addProfile,
        updateProfile,
        deleteProfile,
        setActiveProfile,
      }}
    >
      {children}
    </ProfilesContext.Provider>
  );
}

export function useProfiles() {
  const context = useContext(ProfilesContext);
  if (context === undefined) {
    throw new Error("useProfiles must be used within a ProfilesProvider");
  }
  return context;
}
