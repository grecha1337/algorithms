
import React, { useState } from "react";
import { Queue } from "../../data-structures/queue";
import { ElementStates } from "../../types/element-states";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./queue-page.module.css"

export const QueuePage: React.FC = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [queue,] = useState(new Queue<string>(6))
  const [array, setArray] = useState<(string | null)[]>([...queue.getElements()])
  const [animationHead, setAnimationHead] = useState(false)
  const [animationTail, setAnimationTail] = useState(false)
  const handlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  const handlerAddElement = () => {
    if (!value || queue.getTail() > array.length - 1) {
      return;
    }
    setValue('')
    setLoading(true)
    setAnimationTail(true)
    queue.enqueue(value)
    const interval = setInterval(() => {
      setArray([...queue.getElements()])
      setLoading(false)
      setAnimationTail(false)
      clearInterval(interval);
    }, 500)
  }

  const handlerDelete = () => {
    setLoading(true)
    setAnimationHead(true)
    const interval = setInterval(() => {
      queue.dequeue()
      setArray([...queue.getElements()])
      setLoading(false)
      setAnimationHead(false)
      clearInterval(interval);
    }, 500)
  }

  const handlerClear = () => {
    queue.clear()
    setArray([...queue.getElements()])
  }

  const isHead = (indexElement: number): boolean => {
    if ((!queue.isEmpty() && queue.getHead() === indexElement) ||
      (queue.isEmpty() && queue.getHead() - 1 === indexElement && queue.getHead() === array.length)) {
      return true
    } else {
      return false
    }
  }

  const isTail = (indexElement: number): boolean => {
    if (!queue.isEmpty() && queue.getTail() - 1 === indexElement) {
      return true;
    } else {
      return false
    }
  }

  const state = (indexElement: number): ElementStates => {
    if (!queue.isEmpty() && (animationHead && queue.getHead() === indexElement ||
      animationTail && queue.getTail() - 1 === indexElement)) {
      return ElementStates.Changing
    } else {
      return ElementStates.Default
    }
  }

  return (
    <SolutionLayout title="Очередь">
      <div className={styles.wrapperContent}>
        <div className={styles.controlPanel}>
          <Input maxLength={4} isLimitText={true} onChange={handlerInput} value={value} extraClass={styles.input} />
          <Button text="Добавить" disabled={loading} extraClass={styles.buttonAdd} onClick={handlerAddElement} />
          <Button text="Удалить" disabled={loading} extraClass={styles.buttonDelete} onClick={handlerDelete} />
          <Button text="Очистить" disabled={loading} extraClass={styles.buttonDelete} onClick={handlerClear} />

        </div>
        <div className={styles.contentQueue}>
          {array &&
            [...array].map((el, index) => {
              return (<Circle
                index={index}
                key={index}
                letter={el ? el : ""}
                head={isHead(index) ? "head" : ""}
                tail={isTail(index) ? "tail" : ""}
                state={state(index)}
              />)
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
