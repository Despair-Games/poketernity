export const AdminMode = {
  LINK: 1,
  SEARCH: 2,
  ADMIN: 3,
} as const;

export type AdminMode = (typeof AdminMode)[keyof typeof AdminMode];
