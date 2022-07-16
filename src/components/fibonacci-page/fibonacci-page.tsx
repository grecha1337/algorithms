import React, { useState } from "react";
import { ElementStates } from "../../types/element-states";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./fibonacci.module.css"

export const FibonacciPage: React.FC = () => {

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [algorithmSteps, setAlgorithmSteps] = useState<number[]>([]);
  const [currentAlgorithmStep, setCurrentAlgorithmStep] = useState(0)
  const handlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = 1;
    const max = 19;
    const value = Math.max(Number(min), Math.min(Number(max), Number(e.target.value)));
    setValue(value.toString());
  }

  const fibIterative = (n: number): number[] => {
    if (n < 0) return [];

    let arr: number[] = [1, 1];
    for (let i = 2; i < n + 1; i++) {
      arr.push(arr[i - 2] + arr[i - 1])
    }
    return arr
  }

  const handlerButton = () => {
    setLoading(true)
    const steps = fibIterative(Number(value))
    setCurrentAlgorithmStep(0)
    setAlgorithmSteps(steps)
    if (steps) {
      const interval = setInterval(() => {
        setCurrentAlgorithmStep((currentStep) => {
          const nextStep = currentStep + 1;
          if (nextStep >= steps.length - 1 && interval) {
            clearInterval(interval);
            setLoading(false)
          }
          return nextStep;
        });
      }, 500)
    }
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

