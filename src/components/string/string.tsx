import React, { useEffect, useRef, useState } from "react";
import styles from "./string.module.css"
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Circle } from "../ui/circle/circle";
import { Character } from "../../types/character";
import { getReversingStringSteps } from "./utils";

export const StringComponent: React.FC = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [algorithmSteps, setAlgorithmSteps] = useState<Array<Array<Character>>>([]);
  const [currentAlgorithmStep, setCurrentAlgorithmStep] = useState(0)
  const interval = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    if (
      algorithmSteps.length > 0
      && currentAlgorithmStep < algorithmSteps.length - 1
    ) {
      interval.current = setInterval(() => {
        setCurrentAlgorithmStep((currentStep) => {
          const nextStep = currentStep + 1;
          if (nextStep >= algorithmSteps.length - 1 && interval.current) {
            setLoading(false)
          }
          return nextStep;
        });
      }, 1000)
    }

    return () => {
      if (interval.current !== null) {
        return clearInterval(interval.current);
      }
    };
  }, [algorithmSteps, interval, currentAlgorithmStep])

  const handlerButton = () => {
    setLoading(true)
    const steps = getReversingStringSteps(value)
    setAlgorithmSteps(steps)
    setCurrentAlgorithmStep(0)
  }

  const handlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <SolutionLayout title="Строка">
      <div className={styles.wrapperForm}>
        <div className={`mr-4 ${styles.wrapperInput}`}>
          <Input maxLength={11} isLimitText={true} onChange={handlerInput} value={value} disabled={loading} />
        </div>
        <Button text="Развернуть" onClick={handlerButton} isLoader={loading} />
      </div>
      <div className={styles.wrapperCircle}>
        {algorithmSteps?.length > 0 &&
          algorithmSteps[currentAlgorithmStep]?.map((items, index) => {
            return (
              (<Circle letter={items.character} key={index} state={items.state} />)
            );
          })
        }
      </div>
    </SolutionLayout >
  );
};
