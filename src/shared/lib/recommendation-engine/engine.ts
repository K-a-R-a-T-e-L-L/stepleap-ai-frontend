import {
  CareerProfile,
  defaultCareerProfile,
  RankedTrack,
  trackCatalog,
} from "@/shared/lib/recommendation-engine/model";

function tokenize(input: string) {
  return input
    .toLowerCase()
    .split(/[^a-zа-я0-9+#-]+/i)
    .map((item) => item.trim())
    .filter(Boolean);
}

function overlapCount(sourceTokens: string[], targetTags: string[]) {
  const sourceSet = new Set(sourceTokens);
  return targetTags.reduce(
    (acc, tag) => (sourceSet.has(tag.toLowerCase()) ? acc + 1 : acc),
    0
  );
}

export function getProfileFilledPercent(profile: CareerProfile) {
  const quickModeKeys: (keyof CareerProfile)[] = [
    "mode",
    "age",
    "education",
    "goal",
    "preference",
    "teamStyle",
    "rhythm",
  ];
  const deepModeKeys: (keyof CareerProfile)[] = [
    ...quickModeKeys,
    "hardSkills",
    "softSkills",
    "experience",
    "targetVacancy",
  ];

  const keys = profile.mode === "quick" ? quickModeKeys : deepModeKeys;
  const values = keys.map((key) =>
    typeof profile[key] === "string"
      ? (profile[key] as string).trim()
      : profile[key]
  );
  const filled = values.filter(Boolean).length;

  return Math.round((filled / values.length) * 100);
}

export function rankTracksByProfile(profile: CareerProfile): RankedTrack[] {
  const hardTokens = tokenize(profile.hardSkills);
  const softTokens = tokenize(profile.softSkills);
  const expTokens = tokenize(profile.experience);

  const ranked = trackCatalog.map((track) => {
    const hardMatch = overlapCount(hardTokens, track.hardTags);
    const softMatch = overlapCount(softTokens, track.softTags);
    const expMatch = overlapCount(expTokens, track.expTags);

    const focusBoost = profile.preference === track.focus ? 18 : 0;
    const goalBoost = profile.goal && track.goals.includes(profile.goal) ? 14 : 0;
    const modeBoost = profile.mode === "deep" ? 6 : 2;

    const rawScore =
      26 +
      hardMatch * 11 +
      softMatch * 8 +
      expMatch * 9 +
      focusBoost +
      goalBoost +
      modeBoost;
    const score = Math.min(100, rawScore);

    const reasonParts: string[] = [];

    if (hardMatch > 0) reasonParts.push(`совпало hard skills: ${hardMatch}`);
    if (softMatch > 0) reasonParts.push(`совпало soft skills: ${softMatch}`);
    if (expMatch > 0) reasonParts.push(`релевантный опыт: ${expMatch}`);
    if (profile.goal && track.goals.includes(profile.goal)) {
      reasonParts.push("подходит под текущую цель");
    }

    return {
      id: track.id,
      title: track.title,
      eta: track.eta,
      score,
      reason: reasonParts.length
        ? `AI-скоринг: ${reasonParts.join(", ")}.`
        : "AI-скоринг: нужен ввод навыков/опыта для точного матчинга.",
    };
  });

  return ranked.sort((a, b) => b.score - a.score).slice(0, 3);
}

export function buildSkillProgress(profile: CareerProfile) {
  const hardTokens = tokenize(profile.hardSkills);
  const softTokens = tokenize(profile.softSkills);
  const expTokens = tokenize(profile.experience);
  const profileReadyPercent = getProfileFilledPercent(profile);
  const countMatches = (tokens: string[], probes: string[]) =>
    probes.reduce((acc, probe) => (tokens.includes(probe) ? acc + 1 : acc), 0);
  const cap = (value: number) => Math.max(8, Math.min(96, Math.round(value)));

  return {
    soft: [
      {
        name: "Коммуникация",
        value: cap(
          22 +
            countMatches(softTokens, ["коммуникация", "переговоры", "эмпатия"]) * 18 +
            countMatches(expTokens, ["клиенты", "поддержка", "мероприятия"]) * 10 +
            profileReadyPercent * 0.28
        ),
      },
      {
        name: "Самоорганизация",
        value: cap(
          20 +
            countMatches(softTokens, ["самоорганизация", "дисциплина", "ответственность"]) * 16 +
            countMatches(expTokens, ["планирование", "регламент", "координация"]) * 8 +
            profileReadyPercent * 0.3
        ),
      },
      {
        name: "Системность",
        value: cap(
          18 +
            countMatches(softTokens, ["системность", "логика", "структурность"]) * 17 +
            countMatches(expTokens, ["анализ", "таблица", "отчет"]) * 8 +
            profileReadyPercent * 0.3
        ),
      },
    ],
    hard: [
      {
        name: "Аналитика",
        value: cap(
          14 +
            countMatches(hardTokens, ["sql", "excel", "метрики", "аналитика", "дашборд"]) * 14 +
            countMatches(expTokens, ["исследование", "данные", "таблица"]) * 7 +
            profileReadyPercent * 0.28
        ),
      },
      {
        name: "Контент / коммуникации",
        value: cap(
          16 +
            countMatches(hardTokens, ["контент", "копирайтинг", "smm", "презентация"]) * 14 +
            countMatches(expTokens, ["блог", "пост", "соцсети"]) * 8 +
            profileReadyPercent * 0.29
        ),
      },
      {
        name: "Инструменты",
        value: cap(
          12 +
            countMatches(hardTokens, ["figma", "jira", "postman", "zapier", "make", "api"]) * 15 +
            countMatches(expTokens, ["автоматизация", "инструменты", "бот"]) * 8 +
            profileReadyPercent * 0.27
        ),
      },
    ],
  };
}

export function getNearestRoleByTracks(tracks: RankedTrack[]) {
  const top = tracks[0];
  if (!top) return "Не определена";

  if (top.id.includes("frontend")) return "Frontend intern";
  if (top.id.includes("hr")) return "HR intern";
  if (top.id.includes("analytics")) return "Marketing analyst intern";
  if (top.id.includes("qa")) return "QA trainee";
  if (top.id.includes("smm")) return "SMM intern";

  return "Junior trainee";
}

export function ensureCareerProfile(profile?: Partial<CareerProfile>): CareerProfile {
  return {
    ...defaultCareerProfile,
    ...profile,
  };
}
