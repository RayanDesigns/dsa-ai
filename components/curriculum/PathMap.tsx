"use client";
import { MODULES } from "@/data/curriculum";
import { ModuleCard } from "./ModuleCard";
import { useProgress } from "@/hooks/useProgress";

export function PathMap() {
  const { progress, canAccessModule, isModuleComplete } = useProgress();

  if (!progress) return null;

  // Find current module (first unlocked, incomplete one)
  let currentModuleIdx = -1;
  for (let i = 0; i < MODULES.length; i++) {
    if (canAccessModule(i) && !isModuleComplete(MODULES[i].id)) {
      currentModuleIdx = i;
      break;
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {MODULES.map((module, idx) => {
        const mp = progress.moduleProgress[module.id];
        const completed = mp?.completedCount ?? 0;

        return (
          <ModuleCard
            key={module.id}
            module={module}
            completedCount={completed}
            isUnlocked={canAccessModule(idx)}
            isCurrent={idx === currentModuleIdx}
          />
        );
      })}
    </div>
  );
}
