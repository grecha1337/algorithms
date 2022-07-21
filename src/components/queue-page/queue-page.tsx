
import React, { useEffect, useRef, useState } from "react";
import { Queue } from "../../data-structures/queue";
import { ElementStates } from "../../types/element-states";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./queue-page.module.css"


enum TypeOperation {
  ADD,
  DELETE
}


export const QueuePage: React.FC = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [queue,] = useState(new Queue<string>(6))
  const [array, setArray] = useState<(string | null)[]>([...queue.getElements()])
  const [animationHead, setAnimationHead] = useState(false)
  const [animationTail, setAnimationTail] = useState(false)
  const [typOperation, setTypOperation] = useState<TypeOperation | null>()
  const timeOut = useRef<null | NodeJS.Timeout>(null);

  const handlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  useEffect(() => {
    if (typOperation === TypeOperation.ADD) {
      timeOut.current = setInterval(() => {
        setArray([...queue.getElements()])
        setLoading(false)
        setAnimationTail(false)
        setTypOperation(null)
      }, 500)
    }
    if (typOperation === TypeOperation.DELETE) {
      timeOut.current = setInterval(() => {
        queue.dequeue()
        setArray([...queue.getElements()])
        setLoading(false)
        setAnimationHead(false)
        setTypOperation(null)
      }, 500)
    }
    return () => {
      if (timeOut.current !== null) {
        return clearInterval(timeOut.current);
      }
    };
  }, [queue, timeOut, typOperation, value])

  const handlerAddElement = () => {
    if (!value || queue.getTailIndex() > array.length - 1) {
      return;
    }
    setTypOperation(TypeOperation.ADD)
    setValue('')
    setLoading(true)
    setAnimationTail(true)
    queue.enqueue(value)
  }

  const handlerDelete = () => {
    setTypOperation(TypeOperation.DELETE)
    setLoading(true)
    setAnimationHead(true)

  }

  const handlerClear = () => {
    queue.clear()
    setArray([...queue.getElements()])
  }

  const isHead = (indexElement: number): boolean => {
    if (
      (
        !queue.isEmpty()
        && queue.getHeadIndex() === indexElement)
      || (
        queue.isEmpty()
        && queue.getHeadIndex() - 1 === indexElement
        && queue.getHeadIndex() === array.length
      )
    ) {
      return true
    } else {
      return false
    }
  }

  const isTail = (indexElement: number): boolean => {
    if (
      !queue.isEmpty()
      && queue.getTailIndex() - 1 === indexElement
    ) {
      return true;
    } else {
      return false
    }
  }

  const state = (indexElement: number): ElementStates => {
    if (
      !queue.isEmpty()
      && (
        animationHead
        && queue.getHeadIndex() === indexElement
        || animationTail
        && queue.getTailIndex() - 1 === indexElement
      )
    ) {
      return ElementStates.Changing
    } else {
      return ElementStates.Default
    }
  }

  return (
    <SolutionLayout title="Очередь">
      <div className={styles.wrapperContent}>
        <div className={styles.controlPanel}>
          <Input maxLength={4}
            isLimitText={true}
            onChange={handlerInput}
            value={value}
            extraClass={styles.input} />
          <Button text="Добавить"
            disabled={loading || !value}
            extraClass={styles.buttonAdd}
            onClick={handlerAddElement}
            isLoader={typOperation === TypeOperation.ADD} />
          <Button text="Удалить"
            disabled={loading || (queue.isEmpty())}
            extraClass={styles.buttonDelete}
            onClick={handlerDelete}
            isLoader={typOperation === TypeOperation.DELETE} />
          <Button text="Очистить"
            disabled={loading}
            extraClass={styles.buttonDelete}
            onClick={handlerClear} />

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
