import type { Category, CategoryId } from "./types";

export const CATEGORIES: Category[] = [
  { id: "food", label: "Еда", color: "#F59E0B", icon: "food" },
  { id: "transport", label: "Транспорт", color: "#3B82F6", icon: "transport" },
  { id: "housing", label: "Жилье", color: "#8B5CF6", icon: "housing" },
  { id: "cafe", label: "Кафе", color: "#F97316", icon: "cafe" },
  { id: "shopping", label: "Покупки", color: "#EC4899", icon: "shopping" },
  { id: "health", label: "Здоровье", color: "#EF4444", icon: "health" },
  {
    id: "entertainment",
    label: "Развлечения",
    color: "#06B6D4",
    icon: "entertainment",
  },
  { id: "comms", label: "Связь", color: "#10B981", icon: "comms" },
  {
    id: "subscriptions",
    label: "Подписки",
    color: "#6366F1",
    icon: "subscriptions",
  },
  { id: "other", label: "Другое", color: "#6B7280", icon: "other" },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;
