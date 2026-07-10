import { createFileRoute, Outlet } from "@tanstack/react-router";
import { WizardLayout } from "@/prototype/components/WizardLayout";

export const Route = createFileRoute("/wizard")({
  component: () => <WizardLayout><Outlet /></WizardLayout>,
});
