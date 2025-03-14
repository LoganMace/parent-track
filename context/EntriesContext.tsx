import React, { createContext, useContext, useState } from "react";

export type EntryType =
  | "Favorite"
  | "Measurement"
  | "Memory"
  | "Journal"
  | "Milestone";

interface BaseEntry {
  id: string;
  type: EntryType;
  date: Date;
  profileId: string;
}

export interface FavoriteEntry extends BaseEntry {
  type: "Favorite";
  category: string;
  answer: string;
}

export interface MeasurementEntry extends BaseEntry {
  type: "Measurement";
  measurement: string;
  value: number;
  unit: string;
}

export interface MemoryEntry extends BaseEntry {
  type: "Memory";
  title: string;
  description: string;
  mood?: string;
}

export interface JournalEntry extends BaseEntry {
  type: "Journal";
  title: string;
  content: string;
}

export interface MilestoneEntry extends BaseEntry {
  type: "Milestone";
  title: string;
  description: string;
  category: string;
}

export type Entry =
  | FavoriteEntry
  | MeasurementEntry
  | MemoryEntry
  | JournalEntry
  | MilestoneEntry;

interface EntriesContextType {
  entries: Entry[];
  addEntry: (entry: Omit<Entry, "id">) => void;
}

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

export function EntriesProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);

  const addEntry = (entry: Omit<Entry, "id">) => {
    const newEntry = {
      ...entry,
      id: Math.random().toString(36).substring(7),
    } as Entry;
    setEntries((prev) => [...prev, newEntry]);
  };

  return (
    <EntriesContext.Provider value={{ entries, addEntry }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries() {
  const context = useContext(EntriesContext);
  if (!context) {
    throw new Error("useEntries must be used within an EntriesProvider");
  }
  return context;
}
