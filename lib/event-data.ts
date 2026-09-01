export function formatEventInfoValue(value: unknown) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";

  const info = value as Record<string, unknown>;
  return [info.type, info.detail || info.fee]
    .filter(
      (item): item is string => typeof item === "string" && item.length > 0,
    )
    .join(" · ");
}

export function getEventInfoType(value: unknown) {
  const type =
    typeof value === "string" ? value : getStringProperty(value, "type");
  return type.split(",")[0]?.trim() ?? "";
}

export function getStringProperty(value: unknown, property: string) {
  if (!value || typeof value !== "object") return "";
  const result = (value as Record<string, unknown>)[property];
  return typeof result === "string" ? result : "";
}

export function getObjectProperty(value: unknown, property: string) {
  if (!value || typeof value !== "object") return null;
  const result = (value as Record<string, unknown>)[property];
  return result && typeof result === "object"
    ? (result as Record<string, unknown>)
    : null;
}

export function getEventSite(info: unknown, event: unknown) {
  return getStringProperty(info, "site") || getStringProperty(event, "site");
}
