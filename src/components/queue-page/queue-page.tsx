
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const [queue,] = useState(new Queue(6))
  const [array, setArray] = useState([...queue.getElements()])
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

  }
  console.log(queue.getHead())
  console.log(array.length)
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
                head={(!queue.isEmpty() && queue.getHead() === index) || (queue.isEmpty() && queue.getHead() - 1 === index && queue.getHead() === array.length) ? "head" : ""}
                tail={!queue.isEmpty() && queue.getTail() - 1 === index ? "tail" : ""}
                state={!queue.isEmpty()
                  && (animationHead && queue.getHead() === index ||
                    animationTail && queue.getTail() - 1 === index)
                  ? ElementStates.Changing : ElementStates.Default}
              />)
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
