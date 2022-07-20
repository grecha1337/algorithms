import React, { useEffect, useState } from "react";
import { Node } from "../../data-structures/node";
import { Stack } from "../../data-structures/stack";
import { ElementStates } from "../../types/element-states";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./stack-page.module.css"

enum TypeOperation {
  ADD,
  DELETE
}

export const StackPage: React.FC = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [stack,] = useState(new Stack<number | null>(new Node(null)))
  const [array, setArray] = useState<number[]>([])
  const [animation, setAnimation] = useState(false)
  const [typOperation, setTypOperation] = useState<TypeOperation | null>()
  const interval = React.useRef<null | NodeJS.Timeout>(null);
  const handlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  useEffect(() => {
    interval.current = null;
    if (typOperation === TypeOperation.ADD) {
      setArray(stackToArray(stack))
      const interval = setInterval(() => {
        setLoading(false)
        setAnimation(false)
        setTypOperation(null)
        clearInterval(interval);
      }, 500)
    } else if (typOperation === TypeOperation.DELETE) {
      const interval = setInterval(() => {
        setArray(stackToArray(stack))
        setLoading(false)
        setAnimation(false)
        setTypOperation(null)
        clearInterval(interval);
      }, 500)
    }
    return () => {
      if (interval.current !== null) {
        return clearInterval(interval.current);
      }
    };
  }, [stack, interval, typOperation])


  const handlerAddElement = () => {
    if (!value) {
      return;
    }
    setTypOperation(TypeOperation.ADD)
    stack.push(Number(value))
    setValue('')
    setLoading(true)
    setAnimation(true)
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
    setTypOperation(TypeOperation.DELETE)
    stack.pop()
    setLoading(true)
    setAnimation(true)
  }

  const handlerClear = () => {
    stack.clear();
    setArray(stackToArray(stack))
  }

  console.log(stack.isEmpty())
  console.log(stack)
  return (
    <SolutionLayout title="Стек">
      <div className={styles.wrapperContent}>
        <div className={styles.controlPanel}>
          <Input maxLength={4} isLimitText={true} onChange={handlerInput} value={value} disabled={loading} extraClass={styles.input} />
          <Button text="Добавить"
            disabled={loading || !value}
            extraClass={styles.buttonAdd}
            onClick={handlerAddElement}
            isLoader={typOperation === TypeOperation.ADD} />
          <Button text="Удалить"
            disabled={loading || stack.isEmpty()}
            extraClass={styles.buttonDelete}
            onClick={handlerDelete}
            isLoader={typOperation === TypeOperation.DELETE} />
          <Button text="Очистить"
            disabled={loading}
            extraClass={styles.buttonDelete}
            onClick={handlerClear} />

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
