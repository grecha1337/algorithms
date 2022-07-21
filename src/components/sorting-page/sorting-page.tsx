import React, { useEffect, useRef, useState } from "react";
import { Direction } from "../../types/direction";
import { ElementStates } from "../../types/element-states";
import { generationArray } from "../../utils/generation-array";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";
import { RadioInput } from "../ui/radio-input/radio-input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./sorting-page.module.css"
import { bubbleSortSteps, Item, OrderBy, selectionSortStep } from "./utils";

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
  const interval = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    if (
      algorithmSteps.length > 0
      && currentAlgorithmStep < algorithmSteps.length - 1
    ) {
      interval.current = setInterval(() => {
        setCurrentAlgorithmStep((currentStep) => {
          const nextStep = currentStep + 1;
          if (nextStep >= algorithmSteps.length - 1) {
            setOrderBy(null)
            setLoading(false)
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
  }, [algorithmSteps, currentAlgorithmStep, interval])

  const handlerButton = (orderBy: OrderBy = OrderBy.ASC) => {
    if (!array) {
      return;
    }

    orderBy === OrderBy.ASC ? setOrderBy(OrderBy.ASC) : setOrderBy(OrderBy.DESC)
    setLoading(true)
    const steps = active === TypeSort.SELECTION ? selectionSortStep(array, orderBy) : bubbleSortSteps(array, orderBy);
    setAlgorithmSteps(steps)
    setCurrentAlgorithmStep(1)
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
              checked={active === 0}
              onChange={() => setActive(TypeSort.SELECTION)} disabled={loading} />
            <RadioInput label="Пузырек"
              name="sortAlgorithm"
              checked={active === 1}
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
            algorithmSteps[currentAlgorithmStep]?.map((items, index) => {
              return (
                (<Column index={items.value}
                  extraClass={items.state === ElementStates.Modified ? styles.sorted : items.state === ElementStates.Changing ? styles.current : ''}
                  key={index} />)
              );
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
