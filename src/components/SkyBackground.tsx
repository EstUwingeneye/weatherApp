import { useMemo } from "react";
import type { ConditionInfo } from "../lib/conditions";

interface Props {
  condition: ConditionInfo;
  isDay: boolean;
}

const PALETTES: Record<ConditionInfo["sky"], { day: [string, string]; night: [string, string] }> = {
  clear: { day: ["#3FA7C9", "#8FD8E8"], night: ["#0D2438", "#1B4B66"] },
  cloudy: { day: ["#5A8FA8", "#A9C6D4"], night: ["#12293D", "#274659"] },
  overcast: { day: ["#6B7C87", "#9AAAB2"], night: ["#171E24", "#2C363E"] },
  rain: { day: ["#3A5A66", "#5F818C"], night: ["#0B1B22", "#1C333B"] },
  storm: { day: ["#293544", "#455166"], night: ["#080C13", "#161C28"] },
  snow: { day: ["#7FA6BD", "#D9E8EF"], night: ["#1C2E3B", "#33495A"] },
  fog: { day: ["#8B98A0", "#C7CFD3"], night: ["#20262B", "#3A4147"] },
};

export function SkyBackground({ condition, isDay }: Props) {
  const [top, bottom] = PALETTES[condition.sky][isDay ? "day" : "night"];

  const clouds = useMemo(
    () => [
      { top: "18%", scale: 1, duration: 46, opacity: 0.5 },
      { top: "34%", scale: 0.7, duration: 60, opacity: 0.35 },
      { top: "10%", scale: 0.5, duration: 38, opacity: 0.3 },
    ],
    []
  );

  const showOrb = condition.sky === "clear" || condition.sky === "cloudy";

  return (
    <div className="sky-backdrop" style={{ background: `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)` }}>
      {showOrb && (
        <div className={isDay ? "sky-orb sky-orb--sun" : "sky-orb sky-orb--moon"} aria-hidden="true" />
      )}
      {(condition.sky === "cloudy" || condition.sky === "overcast" || condition.sky === "fog") &&
        clouds.map((c, i) => (
          <div
            key={i}
            className="sky-cloud"
            style={{
              top: c.top,
              opacity: c.opacity,
              transform: `scale(${c.scale})`,
              animationDuration: `${c.duration}s`,
            }}
            aria-hidden="true"
          />
        ))}
      {(condition.sky === "rain" || condition.sky === "storm") && (
        <div className="sky-rain" aria-hidden="true" />
      )}
      <div className="sky-vignette" aria-hidden="true" />
    </div>
  );
}
