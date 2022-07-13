import React, { useEffect, useState } from "react";
import styles from "./string.module.css"
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { swap } from "../../common/swap";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";

interface Character {
  character: string;
  state: ElementStates;
}

export const StringComponent: React.FC = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [algorithmSteps, setAlgorithmSteps] = useState<Array<Array<Character>>>([]);
  const [currentAlgorithmStep, setCurrentAlgorithmStep] = useState(0)

  const getReversingStringSteps = (value: string): Array<Array<Character>> => {
    const result: Array<Array<Character>> = [[]]

    if (!value) return result;
    for (let i = 0; i < value.length; i++) {
      console.log(value[i])
      result[0][i] = { character: value[i], state: ElementStates.Default }
    }

    const array = value.split('');
    let i = 1;
    let j = 0;
    let start = 0;
    let end = array.length - 1
    let state: "Changing" | "Modified" = "Changing"
    while (start <= end) {

      if (!result[i]) {
        result[i] = [...result[i - 1]]
      }
      if (j === end && state === "Changing") {
        result[i][j] = { character: array[j], state: ElementStates.Changing }
      } else if (j === start && state === "Changing") {
        result[i][j] = { character: array[j], state: ElementStates.Changing }
      }

      if (j === end && state === "Modified") {
        result[i][j] = { character: array[j], state: ElementStates.Modified }
        start++
        end--;
      } else if (j === start && state === "Modified") {
        result[i][j] = { character: array[j], state: ElementStates.Modified }
      }

      if (j === array.length - 1 && state === "Changing") {
        swap(array, start, end)
        j = 0;
        i++;
        state = "Modified"
        continue;
      } else if (j === array.length - 1 && state === "Modified") {
        state = "Changing"
        j = 0;
        i++;
        continue;
      }
      j++
    }
    return result
  }



  const handlerButton = () => {
    setLoading(true)
    const steps = getReversingStringSteps(value)
    setAlgorithmSteps(steps)
    setCurrentAlgorithmStep(0)
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
      }, 1000)
    }
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
        {algorithmSteps.length > 0 &&
          algorithmSteps[currentAlgorithmStep].map((items, index) => {
            return (
              (<Circle letter={items.character} key={index} state={items.state} />)
            );
          })
        }
      </div>
    </SolutionLayout >
  );
};
