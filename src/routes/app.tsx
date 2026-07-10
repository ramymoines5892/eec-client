import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/prototype/components/AppShell";

export const Route = createFileRoute("/app")({
  component: () => <AppShell><Outlet /></AppShell>,
});
