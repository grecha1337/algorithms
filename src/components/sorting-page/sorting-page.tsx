import React, { useState } from "react";
import { Direction } from "../../types/direction";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";
import { RadioInput } from "../ui/radio-input/radio-input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./sorting-page.module.css"

export const SortingPage: React.FC = () => {
  const [active, setActive] = useState(0);
  const [array, setArray] = useState<number[]>([])
  const [currentAlgorithmStep, setCurrentAlgorithmStep] = useState(0)
  const [algorithmSteps, setAlgorithmSteps] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const generationArray = (minValue: number, maxValue: number, minLen: number, maxLenv: number): number[] => {
    const arrLength = Math.floor(Math.random() * (maxLenv - minLen + 1)) + minLen;
    const res = []
    for (let i = 0; i <= arrLength; i++) {
      res.push(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue)
    }
    return res;
  }

  const swap = (arr: number[], firstIndex: number, secondIndex: number): void => {
    const temp = arr[firstIndex];
    arr[firstIndex] = arr[secondIndex];
    arr[secondIndex] = temp;
  };

  const selectionSort = (arr: number[], orderBy: "asc" | "desc" = "asc") => {
    const { length } = arr;
  
    const res = [[]];
    let tmp = [];
    let tmp1 = [];
    for (let i = 0; i < length; i++) {
      res[0][i] = { value: arr[i], state: "деф" };
    }
  
    for (let i = 0, level = 1, it = 0; i < length; i++) {
      let index = i;
      if (!res[level]) {
        res[level] = [...res[level - 1]];
      }

      tmp1[0] = [...res[level]];
      res[level][i] = { value: arr[i], state: "выбор" };
      tmp[0] = [...res[level]];
     
      for (let j = i + 1; j < length; j++, level++) {
        res[level][j] = { value: arr[j], state: "выбор" };
  
        if (arr[index] > arr[j]) {
          index = j;
        }
        res[level + 1] =  [...tmp[0]];
      }
  
      swap(arr, i, index);
      swap(tmp1[0], i, index);
      tmp1[0][i] = { value: arr[i], state: "готово" };
      res[level] = [...tmp1[0]]
    }
    return res;
  };

  const handlerButton = () => {
    setLoading(true)
    const steps = selectionSort(generationArray(0,100,3,17));
    console.log(steps)
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


  return (
    <SolutionLayout title="Сортировка массива">
      <div className={styles.wrapperContent}>
        <div className={styles.contolPanel}>
          <div className={styles.radioGroup}>
            <RadioInput label="Выбор" name="sortAlgorithm" checked={active == 0} onChange={() => setActive(0)} />
            <RadioInput label="Пузырек" name="sortAlgorithm" checked={active == 1} onChange={() => setActive(1)} />
          </div>
          <div className={styles.buttonDirectionGroup}>
            <Button text="По возрастанию" sorting={Direction.Ascending} />
            <Button text="По убыванию" sorting={Direction.Descending} />
          </div>
          <Button text="Новый массив" onClick={handlerButton} />
        </div>
        <div className={styles.contentArray}>
          {array.length > 0 &&
            array.map(element => {
              return (<Column index={element} extraClass={styles.current} />)
            })
          }

          {algorithmSteps.length > 0 &&
            algorithmSteps[currentAlgorithmStep].map((items, index) => {
              return (
                (<Column index={items.value} extraClass={items.state == "готово" ? styles.sorted : items.state == "выбор" ? styles.current : ''} key={index} />)
              );
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
