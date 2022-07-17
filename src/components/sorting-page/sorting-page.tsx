import React, { useState } from "react";
import { Direction } from "../../types/direction";
import { ElementStates } from "../../types/element-states";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";
import { RadioInput } from "../ui/radio-input/radio-input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./sorting-page.module.css"


interface Item {
  value: number;
  state: ElementStates;
}

enum OrderBy {
  ASC,
  DESC
}

enum TypeSort {
  SELECTION,
  BUBBLE
}


export const SortingPage: React.FC = () => {
  const [active, setActive] = useState(TypeSort.SELECTION);
  const [currentAlgorithmStep, setCurrentAlgorithmStep] = useState(0)
  const [algorithmSteps, setAlgorithmSteps] = useState<Item[][]>([]);
  const [loading, setLoading] = useState(false);
  const [array, setArray] = useState<number[]>();
  const [orderBy, setOrderBy] = useState<OrderBy | null>(null);

  const generationArray = (minValue: number, maxValue: number, minLen: number, maxLenv: number): number[] => {
    const arrLength = Math.floor(Math.random() * (maxLenv - minLen + 1)) + minLen;
    const res = []
    for (let i = 0; i <= arrLength; i++) {
      res.push(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue)
    }
    return res;
  }

  const swap = (arr: any[], firstIndex: number, secondIndex: number): void => {
    const temp = arr[firstIndex];
    arr[firstIndex] = arr[secondIndex];
    arr[secondIndex] = temp;
  };

  const selectionSort = (arr: number[] | null, orderBy: OrderBy): Item[][] => {
    if (!arr) {
      return [[]]
    }

    const { length } = arr;
    const res: Array<Array<Item>> = [[]];
    let tmp: Array<Item> = [];
    let tmp1: Array<Item> = [];
    for (let i = 0; i < length; i++) {
      res[0][i] = { value: arr[i], state: ElementStates.Default };
    }

    for (let i = 0, level = 1; i < length; i++) {
      let index = i;
      if (!res[level]) {
        res[level] = [...res[level - 1]];
      }

      tmp1 = [...res[level]];
      res[level][i] = { value: arr[i], state: ElementStates.Changing };
      tmp = [...res[level]];

      for (let j = i + 1; j < length; j++, level++) {
        res[level][j] = { value: arr[j], state: ElementStates.Changing };

        if (orderBy === OrderBy.ASC) {
          if (arr[index] > arr[j]) {
            index = j;
          }
        } else {
          if (arr[index] < arr[j]) {
            index = j;
          }
        }
        res[level + 1] = [...tmp];
      }

      swap(arr, i, index);
      swap(tmp1, i, index);
      tmp1[i] = { value: arr[i], state: ElementStates.Modified };
      res[level] = [...tmp1]
    }
    return res;
  };


  const bubbleSort = (arr: number[], orderBy: OrderBy = OrderBy.ASC) => {
    const { length } = arr;

    const res: Array<Array<Item>> = [[]];
    let tmp = []
    for (let i = 0; i < length; i++) {
      res[0][i] = { value: arr[i], state: ElementStates.Default };
    }
    for (let i = 0, level = 1; i < length; i++) {
      if (!res[level]) {
        res[level] = [...res[level - 1]];
      }

      tmp = [...res[level]];

      for (let j = 0; j < length - i - 1; j++, level++) {
        if (orderBy === OrderBy.ASC) {
          if (arr[j] > arr[j + 1]) {
            swap(arr, j, j + 1);
            swap(tmp, j, j + 1);
          }
        } else {
          if (arr[j] < arr[j + 1]) {
            swap(arr, j, j + 1);
            swap(tmp, j, j + 1);
          }
        }
        res[level][j] = { value: arr[j], state: ElementStates.Changing };
        res[level][j + 1] = { value: arr[j + 1], state: ElementStates.Changing };
        res[level + 1] = [...tmp];

        if (j + 1 === length - i - 1) {
          if (i === length - 2) {
            res[level + 1][j] = { value: arr[j], state: ElementStates.Modified };
            res[level + 1][j + 1] = { value: arr[j + 1], state: ElementStates.Modified };
          } else {
            res[level + 1][j + 1] = { value: arr[j + 1], state: ElementStates.Modified };
          }

        }
      }
    }
    return res;
  };

  const handlerButton = (orderBy: OrderBy = OrderBy.ASC) => {
    if (!array) {
      return;
    }

    orderBy === OrderBy.ASC ? setOrderBy(OrderBy.ASC) : setOrderBy(OrderBy.DESC)

    setLoading(true)
    const steps = active === TypeSort.SELECTION ? selectionSort(array, orderBy) : bubbleSort(array, orderBy);
    console.log(steps)
    setAlgorithmSteps(steps)
    setCurrentAlgorithmStep(1)
    if (steps) {
      const interval = setInterval(() => {
        setCurrentAlgorithmStep((currentStep) => {
          const nextStep = currentStep + 1;
          if (nextStep >= steps.length - 1 && interval) {
            clearInterval(interval);
            setOrderBy(null)
            setLoading(false)
          }
          return nextStep;
        });
      }, 500)
    }
  }

  const handlerButtonGenArray = () => {
    const array = generationArray(0, 100, 3, 17)
    setCurrentAlgorithmStep(0)
    const res: Item[][] = [[]]
    for (let i = 0; i < array.length; i++) {
      res[0][i] = { value: array[i], state: ElementStates.Default };
    }
    setArray(array);
    setAlgorithmSteps(res)
  }

  return (
    <SolutionLayout title="Сортировка массива">
      <div className={styles.wrapperContent}>
        <div className={styles.contolPanel}>
          <div className={styles.radioGroup}>
            <RadioInput label="Выбор"
              name="sortAlgorithm"
              checked={active == 0}
              onChange={() => setActive(TypeSort.SELECTION)} disabled={loading} />
            <RadioInput label="Пузырек"
              name="sortAlgorithm"
              checked={active == 1}
              onChange={() => setActive(TypeSort.BUBBLE)} disabled={loading} />
          </div>
          <div className={styles.buttonDirectionGroup}>
            <Button text="По возрастанию"
              sorting={Direction.Ascending}
              isLoader={orderBy === OrderBy.ASC}
              disabled={loading}
              onClick={() => handlerButton(OrderBy.ASC)} />
            <Button text="По убыванию"
              sorting={Direction.Descending}
              isLoader={orderBy === OrderBy.DESC}
              disabled={loading}
              onClick={() => handlerButton(OrderBy.DESC)} />
          </div>
          <Button text="Новый массив" onClick={handlerButtonGenArray} disabled={loading} />
        </div>
        <div className={styles.contentArray}>
          {algorithmSteps.length > 0 &&
            algorithmSteps[currentAlgorithmStep].map((items, index) => {
              return (
                (<Column index={items.value}
                  extraClass={items.state == ElementStates.Modified ? styles.sorted : items.state == ElementStates.Changing ? styles.current : ''}
                  key={index} />)
              );
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
