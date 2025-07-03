import type { EnumValues } from "#types/utility-types";

export const AdminMode = {
  LINK: 1,
  SEARCH: 2,
  ADMIN: 3,
} as const;

export type AdminMode = EnumValues<typeof AdminMode>;
