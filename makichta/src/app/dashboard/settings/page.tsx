import { SettingsForm } from "@/models/settings/components/settings-form";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez votre devise, période de référence et modules actifs
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}
