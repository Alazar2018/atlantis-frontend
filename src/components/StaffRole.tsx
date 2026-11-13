"use client";

import { createContext, useContext } from "react";

export type StaffRole = "admin" | "maker";

export const StaffRoleContext = createContext<StaffRole>("admin");

export function useStaffRole() {
  return useContext(StaffRoleContext);
}
