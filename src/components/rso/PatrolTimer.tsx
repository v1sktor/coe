import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Timer } from "lucide-react";

const STORAGE_KEY = "patrol_timer_start";

interface PatrolTimerProps {
  onStart?: () => void;
  onStop?: (startTime: string, endTime: string, durationSeconds: number) => void;
  isWidget?: boolean;
}

const formatTime = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export const usePatrolTimer = () => {
  const [startTime, setStartTime] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [elapsed, setElapsed] = useState(0);

  const isRunning = !!startTime;

  // Sync between multiple hook instances (e.g. parent page + child <PatrolTimer />)
  useEffect(() => {
    const sync = () => {
      const current = localStorage.getItem(STORAGE_KEY);
      setStartTime((prev) => (prev === current ? prev : current));
    };
    window.addEventListener("storage", sync);
    window.addEventListener("patrol-timer-change", sync);
    const poll = setInterval(sync, 1000);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("patrol-timer-change", sync);
      clearInterval(poll);
    };
  }, []);

  useEffect(() => {
    if (!startTime) {
      setElapsed(0);
      return;
    }
    const calc = () => Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
    setElapsed(calc());
    const interval = setInterval(() => setElapsed(calc()), 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const start = useCallback(() => {
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, now);
    setStartTime(now);
    window.dispatchEvent(new Event("patrol-timer-change"));
  }, []);

  const stop = useCallback(() => {
    const end = new Date().toISOString();
    const s = startTime;
    localStorage.removeItem(STORAGE_KEY);
    setStartTime(null);
    window.dispatchEvent(new Event("patrol-timer-change"));
    return { startTime: s!, endTime: end, durationSeconds: elapsed };
  }, [startTime, elapsed]);

  return { isRunning, elapsed, startTime, start, stop };
};

const PatrolTimer = ({ onStart, onStop, isWidget }: PatrolTimerProps) => {
  const { isRunning, elapsed, start, stop } = usePatrolTimer();

  const handleStart = () => {
    start();
    onStart?.();
  };

  const handleStop = () => {
    const result = stop();
    onStop?.(result.startTime, result.endTime, result.durationSeconds);
  };

  if (isWidget && !isRunning) return null;

  if (isWidget) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-xl shadow-2xl px-6 py-3 flex items-center gap-4">
        <Timer className="h-5 w-5 text-primary animate-pulse" />
        <span className="font-mono text-lg font-bold text-foreground">{formatTime(elapsed)}</span>
        <Button size="sm" variant="destructive" onClick={handleStop} className="font-display uppercase tracking-wider text-xs">
          <Square className="mr-1 h-3 w-3" /> Encerrar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <Timer className={`h-16 w-16 ${isRunning ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
      <span className="font-mono text-4xl font-bold text-foreground">{formatTime(elapsed)}</span>
      {!isRunning ? (
        <Button onClick={handleStart} className="font-display uppercase tracking-widest">
          <Play className="mr-2 h-4 w-4" /> Iniciar Patrulha
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">Patrulha em andamento</p>
          <Button variant="destructive" onClick={handleStop} className="font-display uppercase tracking-widest">
            <Square className="mr-2 h-4 w-4" /> Finalizar Patrulha
          </Button>
        </div>
      )}
    </div>
  );
};

export default PatrolTimer;
