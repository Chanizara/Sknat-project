export const USER_ROLES = ["admin", "seller"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type User = {
  id: number;
  username: string;
  role: UserRole;
  fullName?: string;
  createdAt: string;
  updatedAt: string;
};
