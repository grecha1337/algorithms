import React, { useEffect, useRef, useState } from "react";
import { ElementStates } from "../../types/element-states";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./fibonacci.module.css"
import { fibIterative } from "./utils";

export const FibonacciPage: React.FC = () => {

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [algorithmSteps, setAlgorithmSteps] = useState<number[]>([]);
  const [currentAlgorithmStep, setCurrentAlgorithmStep] = useState(0);
  const interval = useRef<null | NodeJS.Timeout>(null);

  const handlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = 1;
    const max = 19;
    const value = Math.max(Number(min), Math.min(Number(max), Number(e.target.value)));
    setValue(value.toString());
  }

  useEffect(() => {
    interval.current = null;
    if (
      algorithmSteps.length > 0
      && currentAlgorithmStep < algorithmSteps.length - 1
    ) {
      interval.current = setInterval(() => {
        setCurrentAlgorithmStep((currentStep) => {
          const nextStep = currentStep + 1;
          if (nextStep >= algorithmSteps.length - 1 && interval) {
            setLoading(false);
          }
          return nextStep;
        });
      }, 500)
    }
    return () => {
      if (interval.current !== null) {
        return clearInterval(interval.current);
      }
    };
  }, [algorithmSteps, interval, currentAlgorithmStep])

  const handlerButton = () => {
    setLoading(true);
    const steps = fibIterative(Number(value));
    setCurrentAlgorithmStep(0);
    setAlgorithmSteps(steps);
  }

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <div className={styles.wrapperForm}>
        <div className={`mr-4 ${styles.wrapperInput}`}>
          <Input onChange={handlerInput} value={value} disabled={loading} max={19} type="number" isLimitText={true} />
        </div>
        <Button text="Развернуть" onClick={handlerButton} isLoader={loading} />
      </div>
      <div className={styles.content}>
        <div className={styles.warpperCircle}>
          {algorithmSteps.length > 0 &&
            algorithmSteps.slice(0, currentAlgorithmStep + 1).map((element, index) => {
              return (
                <Circle letter={element.toString()} key={index} state={ElementStates.Default} index={index} />
              );
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};

