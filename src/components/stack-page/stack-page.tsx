import React, { useState } from "react";
import { Node } from "../../data-structures/node";
import { Stack } from "../../data-structures/stack";
import { ElementStates } from "../../types/element-states";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./stack-page.module.css"

export const StackPage: React.FC = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [stack,] = useState(new Stack<number | null>(new Node(null)))
  const [array, setArray] = useState<number[]>([])
  const [animation, setAnimation] = useState(false)
  const handlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handlerAddElement = () => {
    if (!value) {
      return;
    }
    stack.push(Number(value))
    setValue('')
    setArray(stackToArray(stack))
    setLoading(true)
    setAnimation(true)
    const interval = setInterval(() => {
      setLoading(false)
      setAnimation(false)
      clearInterval(interval);
    }, 500)

  }

  const stackToArray = <T extends any>(stack: Stack<T | null>): T[] => {
    console.log(stack)
    const res: T[] = []
    if (stack.isEmpty()) { return res }
    let node: Node<T | null> | null = stack.getTop();
    let i = 0;
    while (node && node.value) {
      console.log(node)
      res[i] = node.value;
      node = node.next

      i++;
    }
    return res.reverse();

  }

  const handlerDelete = () => {

    setLoading(true)
    setAnimation(true)
    setArray(stackToArray<number>(stack))
    stack.pop()
    const interval = setInterval(() => {
      clearInterval(interval);
      setArray(stackToArray(stack))
      setLoading(false)
      setAnimation(false)
    }, 500)
  }

  const handlerClear = () => {
    stack.clear();
    setArray(stackToArray(stack))
  }


  return (
    <SolutionLayout title="Стек">
      <div className={styles.wrapperContent}>
        <div className={styles.controlPanel}>
          <Input maxLength={4} isLimitText={true} onChange={handlerInput} value={value} disabled={loading} extraClass={styles.input} />
          <Button text="Добавить" disabled={loading} extraClass={styles.buttonAdd} onClick={handlerAddElement} />
          <Button text="Удалить" disabled={loading} extraClass={styles.buttonDelete} onClick={handlerDelete} />
          <Button text="Очистить" disabled={loading} extraClass={styles.buttonDelete} onClick={handlerClear} />

        </div>
        <div className={styles.contentStack}>
          {
            array.length > 0 &&
            array.map((element, index) => {
              return (<Circle letter={element.toString()}
                key={index}
                state={index === array.length - 1 && animation ? ElementStates.Modified : ElementStates.Default}
                head={index === array.length - 1 ? "top" : ""}
                index={index}
              />)
            })
          }
        </div>
      </div>
    </SolutionLayout >
  );
};
