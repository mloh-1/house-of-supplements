"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SiteSettings {
  id: string;
  storeName: string;
  storeEmail: string | null;
  storePhone1: string | null;
  storePhone2: string | null;
  storeAddress1: string | null;
  storeAddress2: string | null;
  freeShippingMin: number;
  shippingCost: number;
  currency: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
}

const defaultSettings: SiteSettings = {
  id: "settings",
  storeName: "House of Supplements",
  storeEmail: null,
  storePhone1: "064/4142-678",
  storePhone2: "065/40-24-444",
  storeAddress1: "Bulevar Oslobođenja 63",
  storeAddress2: "Vojvode Stepe 353",
  freeShippingMin: 4000,
  shippingCost: 350,
  currency: "RSD",
  facebookUrl: null,
  instagramUrl: null,
};

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refetch: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refetch: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refetch: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
