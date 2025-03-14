import React, { createContext, useContext, useState } from "react";

export interface Profile {
  id: string;
  name: string;
  birthday: Date;
}

export interface ProfilesContextType {
  profiles: Profile[];
  addProfile: (name: string, birthday: Date) => void;
  updateProfile: (id: string, name: string, birthday: Date) => void;
  deleteProfile: (id: string) => void;
}

const ProfilesContext = createContext<ProfilesContextType | undefined>(
  undefined
);

export function ProfilesProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const addProfile = (name: string, birthday: Date) => {
    setProfiles((currentProfiles) => [
      ...currentProfiles,
      {
        id: Math.random().toString(),
        name,
        birthday,
      },
    ]);
  };

  const updateProfile = (id: string, name: string, birthday: Date) => {
    setProfiles((currentProfiles) =>
      currentProfiles.map((profile) =>
        profile.id === id ? { ...profile, name, birthday } : profile
      )
    );
  };

  const deleteProfile = (id: string) => {
    setProfiles((currentProfiles) =>
      currentProfiles.filter((profile) => profile.id !== id)
    );
  };

  return (
    <ProfilesContext.Provider
      value={{ profiles, addProfile, updateProfile, deleteProfile }}
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
