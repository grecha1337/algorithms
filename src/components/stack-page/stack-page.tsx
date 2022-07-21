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
  const [stack,] = useState(new Stack<string | null>(new Node(null)))
  const [array, setArray] = useState<string[]>([])
  const [animation, setAnimation] = useState(false)
  const [typOperation, setTypOperation] = useState<TypeOperation | null>()
  const timeOut = React.useRef<null | NodeJS.Timeout>(null);
  const handlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  useEffect(() => {
    if (typOperation === TypeOperation.ADD) {
      setArray(stackToArray(stack))
      timeOut.current = setTimeout(() => {
        setLoading(false);
        setAnimation(false);
        setTypOperation(null);
      }, 500)
    }
    if (typOperation === TypeOperation.DELETE) {
      timeOut.current = setInterval(() => {
        setArray(stackToArray(stack));
        setLoading(false);
        setAnimation(false);
        setTypOperation(null);
      }, 500)
    }
    return () => {
      if (timeOut.current !== null) {
        return clearInterval(timeOut.current);
      }
    };
  }, [stack, timeOut, typOperation])


  const handlerAddElement = () => {
    if (!value) {
      return;
    }
    setTypOperation(TypeOperation.ADD)
    stack.push(value);
    setValue('');
    setLoading(true);
    setAnimation(true);
  }

  const stackToArray = <T extends any>(stack: Stack<T | null>): T[] => {
    const res: T[] = []
    if (stack.isEmpty()) { return res }
    let node: Node<T | null> | null = stack.getTop();
    let i = 0;
    while (node && node.value) {
      console.log(node);
      res[i] = node.value;
      node = node.next;
      i++;
    }
    return res.reverse();
  }

  const handlerDelete = () => {
    setTypOperation(TypeOperation.DELETE);
    stack.pop();
    setLoading(true);
    setAnimation(true);
  }

  const handlerClear = () => {
    stack.clear();
    setArray(stackToArray(stack));
  }

  return (
    <SolutionLayout title="Стек">
      <div className={styles.wrapperContent}>
        <div className={styles.controlPanel}>
          <Input maxLength={4}
            isLimitText={true}
            onChange={handlerInput}
            value={value}
            disabled={loading}
            extraClass={styles.input} />
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
                state={index === array.length - 1 && animation ? ElementStates.Changing : ElementStates.Default}
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
