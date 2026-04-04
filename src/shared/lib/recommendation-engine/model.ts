export type Goal = "part-time" | "internship" | "first-job";
export type Focus = "people" | "data" | "tech";

export type CareerProfile = {
  mode: string | null;
  age: string;
  education: string | null;
  goal: Goal | null;
  preference: Focus | null;
  teamStyle: string | null;
  rhythm: string | null;
  hardSkills: string;
  softSkills: string;
  experience: string;
  targetVacancy: string;
};

export type TrackModel = {
  id: string;
  title: string;
  focus: Focus;
  eta: string;
  goals: Goal[];
  hardTags: string[];
  softTags: string[];
  expTags: string[];
};

export type RankedTrack = {
  id: string;
  title: string;
  eta: string;
  score: number;
  reason: string;
};

export const trackCatalog: TrackModel[] = [
  {
    id: "frontend-engineer",
    title: "Frontend разработка",
    focus: "tech",
    eta: "первые отклики через 1-2 недели",
    goals: ["part-time", "internship", "first-job"],
    hardTags: ["js", "javascript", "ts", "typescript", "react", "next", "html", "css", "frontend"],
    softTags: ["коммуникация", "самоорганизация", "системность"],
    expTags: ["проект", "коммерческих", "поддерживал", "разработка"],
  },
  {
    id: "hr-recruiting",
    title: "HR / рекрутинг",
    focus: "people",
    eta: "первый отклик через 2-3 недели",
    goals: ["part-time", "internship", "first-job"],
    hardTags: ["скрининг", "интервью", "резюме", "найм", "воронка", "ats"],
    softTags: ["коммуникация", "эмпатия", "переговоры", "внимательность"],
    expTags: ["волонтер", "подбор", "мероприятия", "куратор", "hr"],
  },
  {
    id: "smm-marketing",
    title: "SMM / контент-маркетинг",
    focus: "people",
    eta: "быстрый старт за 1-2 недели",
    goals: ["part-time", "internship", "first-job"],
    hardTags: ["контент", "canva", "figma", "аналитика", "метрики", "копирайтинг"],
    softTags: ["креатив", "коммуникация", "самоорганизация", "инициативность"],
    expTags: ["блог", "соцсети", "пост", "телеграм", "проект"],
  },
  {
    id: "sales-account",
    title: "Аккаунт / продажи",
    focus: "people",
    eta: "входная роль за 2 недели",
    goals: ["part-time", "internship", "first-job"],
    hardTags: ["crm", "скрипт", "презентация", "воронка", "договор"],
    softTags: ["аргументация", "переговоры", "коммуникация", "стрессоустойчивость"],
    expTags: ["консультант", "клиенты", "касса", "продажи", "поддержка"],
  },
  {
    id: "marketing-analytics",
    title: "Аналитика маркетинга",
    focus: "data",
    eta: "первые задачи через 3-4 недели",
    goals: ["internship", "first-job"],
    hardTags: ["excel", "sql", "таблицы", "метрики", "дашборд", "гипотезы"],
    softTags: ["системность", "внимательность", "логика", "усидчивость"],
    expTags: ["отчет", "исследование", "анализ", "данные", "таблица"],
  },
  {
    id: "operations-analyst",
    title: "Операционный аналитик",
    focus: "data",
    eta: "старт со спринтов через 2-3 недели",
    goals: ["internship", "first-job"],
    hardTags: ["excel", "google sheets", "sql", "процессы", "отчетность"],
    softTags: ["структурность", "ответственность", "внимательность"],
    expTags: ["планирование", "координация", "регламент", "документооборот"],
  },
  {
    id: "no-code-automation",
    title: "No-code / автоматизация",
    focus: "tech",
    eta: "первые кейсы за 2 недели",
    goals: ["part-time", "internship", "first-job"],
    hardTags: ["zapier", "make", "api", "интеграции", "notion", "bot"],
    softTags: ["самостоятельность", "логика", "инициативность"],
    expTags: ["автоматизация", "бот", "скрипт", "парсер", "инструменты"],
  },
  {
    id: "qa-junior",
    title: "QA / тестирование",
    focus: "tech",
    eta: "первые задачи через 2-4 недели",
    goals: ["internship", "first-job"],
    hardTags: ["тест-кейс", "чеклист", "jira", "postman", "api", "bug"],
    softTags: ["внимательность", "системность", "терпение"],
    expTags: ["проверка", "тестирование", "протокол", "ошибки"],
  },
];

export const defaultCareerProfile: CareerProfile = {
  mode: "deep",
  age: "",
  education: null,
  goal: null,
  preference: null,
  teamStyle: null,
  rhythm: null,
  hardSkills: "",
  softSkills: "",
  experience: "",
  targetVacancy: "",
};
