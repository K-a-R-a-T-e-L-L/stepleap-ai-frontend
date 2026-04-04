"use client";

import { useAuthSession } from "@/processes/providers/AuthSessionProvider";
import {
  useCareerControllerGetProfile,
  useCareerControllerGetRecommendations,
  useCareerControllerSaveProfile,
} from "@/shared/api/.generated";
import {
  CareerProfile,
  defaultCareerProfile,
  ensureCareerProfile,
  Focus,
  getNearestRoleByTracks,
  getProfileFilledPercent,
  Goal,
  RankedTrack,
} from "@/shared/lib/recommendation-engine";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type CareerProfileContextValue = {
  profile: CareerProfile;
  hasProfileData: boolean;
  setProfileField: <K extends keyof CareerProfile>(key: K, value: CareerProfile[K]) => void;
  resetProfile: () => void;
  profileReadyPercent: number;
  rankedTracks: RankedTrack[];
  nearestRole: string;
  onboardingSubmitted: boolean;
  setOnboardingSubmitted: (value: boolean) => void;
  isRecommendationsLoading: boolean;
  recommendationsSource: "api" | null;
  dynamicSkills: {
    hard: { name: string; value: number; reason: string }[];
    soft: { name: string; value: number; reason: string }[];
  };
  llmStatus: {
    used: boolean;
    error: string | null;
  };
};

const CareerProfileContext = createContext<CareerProfileContextValue | null>(null);

function hasCyrillic(text: string) {
  return /[а-яё]/i.test(text);
}

function localizeTrackTitle(title: string) {
  const normalized = title.trim().toLowerCase();
  const map: Record<string, string> = {
    "data analyst": "Аналитик данных",
    "middle frontend developer": "Middle frontend-разработчик",
    "frontend developer": "Frontend-разработчик",
    "backend developer": "Backend-разработчик",
    "qa engineer": "QA-инженер",
    "smm specialist": "SMM-специалист",
  };
  return map[normalized] ?? title;
}

function localizeTrackReason(reason: string) {
  const trimmed = reason.trim();
  if (!trimmed) return "Рекомендация сформирована на основе профиля.";
  if (hasCyrillic(trimmed)) return trimmed;
  return "Рекомендация сформирована на основе навыков, опыта и карьерной цели.";
}

function normalizeGoal(value: string | null): Goal | null {
  if (value === "part-time" || value === "internship" || value === "first-job") {
    return value;
  }
  return null;
}

function normalizeFocus(value: string | null): Focus | null {
  if (value === "people" || value === "data" || value === "tech") {
    return value;
  }
  return null;
}

function normalizeProfileFromApi(profile: {
  mode: string | null;
  age: string;
  education: string | null;
  goal: string | null;
  preference: string | null;
  teamStyle: string | null;
  rhythm: string | null;
  hardSkills: string;
  softSkills: string;
  experience: string;
  targetVacancy: string | null;
}): CareerProfile {
  return ensureCareerProfile({
    ...profile,
    mode: "deep",
    goal: normalizeGoal(profile.goal),
    preference: normalizeFocus(profile.preference),
    targetVacancy: profile.targetVacancy ?? "",
  });
}

export default function CareerProfileProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuthSession();

  const [profile, setProfile] = useState<CareerProfile>(defaultCareerProfile);
  const [onboardingSubmitted, setOnboardingSubmitted] = useState(false);
  const [apiRankedTracks, setApiRankedTracks] = useState<RankedTrack[] | null>(null);
  const [apiNearestRole, setApiNearestRole] = useState<string | null>(null);
  const [apiReadyPercent, setApiReadyPercent] = useState<number | null>(null);
  const [apiSkillScores, setApiSkillScores] = useState<{
    hard: { name: string; value: number; reason: string }[];
    soft: { name: string; value: number; reason: string }[];
  } | null>(null);
  const [apiLlmStatus, setApiLlmStatus] = useState<{ used: boolean; error: string | null }>({
    used: false,
    error: null,
  });

  const hydratedFromApiRef = useRef(false);
  const lastSavedPayloadRef = useRef<string | null>(null);
  const lastRecommendationsPayloadRef = useRef<string | null>(null);

  const authClient = useMemo(
    () =>
      accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : {},
    [accessToken]
  );

  const profileQuery = useCareerControllerGetProfile({
    query: {
      enabled: Boolean(accessToken),
      retry: false,
    },
    client: authClient,
  });

  const saveProfileMutation = useCareerControllerSaveProfile({
    client: authClient,
  });

  const recommendationsMutation = useCareerControllerGetRecommendations({
    client: authClient,
    mutation: {
      onSuccess: (response) => {
        setApiRankedTracks(
          response.tracks.map((track) => ({
            id: track.id,
            title: localizeTrackTitle(track.title),
            score: track.score,
            eta: track.eta,
            reason: localizeTrackReason(track.reason),
          }))
        );
        setApiNearestRole(response.nearestRole);
        setApiReadyPercent(response.profileReadyPercent);
        setApiSkillScores({
          hard: (response.hardSkills ?? []).map((item) => ({
            name: item.name,
            value: item.score,
            reason: item.reason,
          })),
          soft: (response.softSkills ?? []).map((item) => ({
            name: item.name,
            value: item.score,
            reason: item.reason,
          })),
        });
        setApiLlmStatus({
          used: Boolean(response.llmUsed),
          error: response.llmError ?? null,
        });
      },
      onError: () => {
        setApiRankedTracks(null);
        setApiNearestRole(null);
        setApiReadyPercent(null);
        setApiSkillScores(null);
        setApiLlmStatus({ used: false, error: "Recommendations request failed" });
      },
    },
  });

  useEffect(() => {
    if (!profileQuery.data || hydratedFromApiRef.current) return;

    const normalizedProfile = normalizeProfileFromApi(profileQuery.data.profile);
    setProfile(normalizedProfile);
    const hasSavedData = [
      normalizedProfile.age,
      normalizedProfile.education,
      normalizedProfile.goal,
      normalizedProfile.preference,
      normalizedProfile.teamStyle,
      normalizedProfile.rhythm,
      normalizedProfile.hardSkills,
      normalizedProfile.softSkills,
      normalizedProfile.experience,
      normalizedProfile.targetVacancy,
    ].some((item) => (typeof item === "string" ? Boolean(item.trim()) : Boolean(item)));
    if (hasSavedData) {
      setOnboardingSubmitted(true);
    }
    lastSavedPayloadRef.current = JSON.stringify(normalizedProfile);
    hydratedFromApiRef.current = true;
  }, [profileQuery.data]);

  useEffect(() => {
    if (!hydratedFromApiRef.current || !accessToken) return;

    const payload = JSON.stringify(profile);
    if (lastSavedPayloadRef.current === payload) return;

    const timeoutId = setTimeout(() => {
      if (lastSavedPayloadRef.current === payload) return;
      lastSavedPayloadRef.current = payload;
      saveProfileMutation.mutate({
        data: profile,
      });
    }, 700);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, accessToken]);

  const hasProfileData = useMemo(() => {
    const values = [
      profile.age,
      profile.education,
      profile.goal,
      profile.preference,
      profile.teamStyle,
      profile.rhythm,
      profile.hardSkills,
      profile.softSkills,
      profile.experience,
      profile.targetVacancy,
    ];
    return values.some((item) =>
      typeof item === "string" ? Boolean(item.trim()) : Boolean(item)
    );
  }, [profile]);

  useEffect(() => {
    if (!accessToken || !profile.mode) {
      return;
    }
    if (!onboardingSubmitted) {
      setApiRankedTracks(null);
      setApiNearestRole(null);
      setApiReadyPercent(null);
      setApiSkillScores(null);
      setApiLlmStatus({ used: false, error: null });
      return;
    }
    if (!hasProfileData) {
      setApiRankedTracks(null);
      setApiNearestRole(null);
      setApiReadyPercent(null);
      setApiSkillScores(null);
      setApiLlmStatus({ used: false, error: null });
      lastRecommendationsPayloadRef.current = null;
      return;
    }

    const payload = {
      mode: profile.mode,
      age: profile.age,
      education: profile.education,
      goal: profile.goal,
      preference: profile.preference,
      teamStyle: profile.teamStyle,
      rhythm: profile.rhythm,
      hardSkills: profile.hardSkills,
      softSkills: profile.softSkills,
      experience: profile.experience,
      targetVacancy: profile.targetVacancy || null,
    };
    const payloadFingerprint = JSON.stringify(payload);
    if (lastRecommendationsPayloadRef.current === payloadFingerprint) return;

    const timeoutId = setTimeout(() => {
      if (lastRecommendationsPayloadRef.current === payloadFingerprint) return;
      lastRecommendationsPayloadRef.current = payloadFingerprint;
      recommendationsMutation.mutate({
        data: payload,
      });
    }, 900);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    accessToken,
    onboardingSubmitted,
    hasProfileData,
    profile.mode,
    profile.age,
    profile.education,
    profile.goal,
    profile.preference,
    profile.teamStyle,
    profile.rhythm,
    profile.hardSkills,
    profile.softSkills,
    profile.experience,
    profile.targetVacancy,
  ]);

  const value = useMemo<CareerProfileContextValue>(() => {
    const rankedTracks = onboardingSubmitted ? apiRankedTracks ?? [] : [];
    const profileReadyPercent = apiReadyPercent ?? getProfileFilledPercent(profile);

    return {
      profile,
      hasProfileData,
      setProfileField: (key, fieldValue) => {
        setProfile((prev) => ({
          ...prev,
          [key]: fieldValue,
        }));
      },
      resetProfile: () => {
        setProfile(defaultCareerProfile);
        setOnboardingSubmitted(false);
        setApiRankedTracks(null);
        setApiNearestRole(null);
        setApiReadyPercent(null);
        setApiSkillScores(null);
        setApiLlmStatus({ used: false, error: null });
        lastSavedPayloadRef.current = null;
        lastRecommendationsPayloadRef.current = null;
        hydratedFromApiRef.current = false;
      },
      profileReadyPercent,
      rankedTracks,
      nearestRole: rankedTracks.length
        ? apiNearestRole ?? getNearestRoleByTracks(rankedTracks)
        : "Не определена",
      onboardingSubmitted,
      setOnboardingSubmitted,
      isRecommendationsLoading: recommendationsMutation.isPending,
      recommendationsSource: !hasProfileData || !onboardingSubmitted
        ? null
        : apiRankedTracks
        ? "api"
        : null,
      dynamicSkills:
        !hasProfileData
          ? { hard: [], soft: [] }
          : apiSkillScores ?? { hard: [], soft: [] },
      llmStatus: apiLlmStatus,
    };
  }, [
    profile,
    hasProfileData,
    onboardingSubmitted,
    apiRankedTracks,
    apiNearestRole,
    apiReadyPercent,
    apiSkillScores,
    apiLlmStatus,
    recommendationsMutation.isPending,
  ]);

  return <CareerProfileContext.Provider value={value}>{children}</CareerProfileContext.Provider>;
}

export function useCareerProfile() {
  const context = useContext(CareerProfileContext);

  if (!context) {
    throw new Error("useCareerProfile must be used within CareerProfileProvider");
  }

  return context;
}
