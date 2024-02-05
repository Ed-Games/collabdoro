import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import { Mode } from "@/enums";
import { Progressbar } from "./components/ProgressBar";
import { TimerOptions } from "./components/TimerOptions";
import { useTimer } from "@/hooks/useTimer";

interface IPomodoroProps {
  isAdmin: boolean;
}

const Pomodoro = ({ isAdmin }: IPomodoroProps) => {
  const [openConfigModal, setOpenConfigModal] = useState<boolean>(false);
  const notificationAudioRef = useRef<HTMLAudioElement>();
  const startAudioRef = useRef<HTMLAudioElement>();

  const {
    minutes,
    seconds,
    mode,
    startTimer,
    resetTimer,
    cyclesCount,
    isActive,
    timerOptions, 
    setTimerOptions
  } = useTimer();

  const [minuteLeft, minuteRight] = String(minutes).padStart(2, "0").split("");
  const [secondLeft, secondRight] = String(seconds).padStart(2, "0").split("");

  const toggleTimer = () => {
    isActive && isAdmin ? resetTimer() : startTimer();
    !isActive && startAudioRef.current?.play();
  };

  useEffect(() => {
    switch (mode) {
      case Mode.LONGBREAK:
        toast.success(
          "Parabens! Você completou um ciclo. Que tal uma pausa para o café?",
          { pauseOnFocusLoss: false }
        );
        break;
      case Mode.SHORTBREAK:
        toast.success("Hora de fazer uma pequena pausa", {
          pauseOnFocusLoss: false,
        });
        break;
      case Mode.POMODORO:
        if (isActive) {
          toast.success("Hora de focar!!", { pauseOnFocusLoss: false });
        }
        break;
      default:
        // handle default case here
        break;
    }
  }, [mode, isActive]);

  useEffect(() => {
    if (cyclesCount < 1 && mode === Mode.POMODORO) {
      return;
    } else {
      notificationAudioRef.current?.play();
    }
  }, [cyclesCount, mode]);

  return (
    <div className={styles.pomodoro}>
      <div className={styles.tabs}>
        <button className={mode == Mode.POMODORO ? styles.active : ""}>
          Pomodoro
        </button>
        <button className={mode == Mode.SHORTBREAK ? styles.active : ""}>
          Short Break
        </button>
        <button className={mode == Mode.LONGBREAK ? styles.active : ""}>
          Long Break
        </button>
      </div>

      <div className={styles.line}></div>

      <div className={styles.timer}>
        <span>
          {minuteLeft}
          {minuteRight}:{secondLeft}
          {secondRight}
        </span>
      </div>

      {!isActive && isAdmin && (
        <button
          onClick={() => setOpenConfigModal(true)}
          className={styles.btnConfig}
        >
          Configurar ciclo
        </button>
      )}

      {isActive && <Progressbar value={(cyclesCount / 4) * 100} />}

      <button
        disabled={!isAdmin}
        onClick={toggleTimer}
        className={!isActive ? styles.btnStart : styles.btnStop}
      >
        {isActive ? "Cancelar" : "Iniciar ciclo"}
      </button>
      {
        timerOptions && <TimerOptions
        isVisible={openConfigModal}
        setIsVisible={setOpenConfigModal}
        timerOptions={timerOptions}
        setTimerOptions={setTimerOptions}
      />
      }
      <audio ref={notificationAudioRef as any} src="/notification-sound.mp3" />
      <audio ref={startAudioRef as any} src="/start-sound.mp3" />
    </div>
  );
};

export default Pomodoro;