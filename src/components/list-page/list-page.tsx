import React, { useRef, useState } from "react";
import { LinkedList } from "../../data-structures/linled-list";
import { ElementStates } from "../../types/element-states";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./list-page.module.css"


export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

enum TypeOperation {
  ADD_HEAD,
  ADD_TAIL,
  DELETE_HEAD,
  DELETE_TAIL,
}

export const ListPage: React.FC = () => {

  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [loading, setLoading] = useState(false);
  const interval = useRef<null | NodeJS.Timeout>(null);
  const [array, setArray] = useState();
  const [list, setList] = useState(new LinkedList());
  const [isAnimationHead, setIsAnimationHead] = useState()
  const [isAnimationTail, setisAnimationTail] = useState()
  const [isNewElement, setIsNewElement] = useState()
  const [isDeleteElement, setDeleteElement] = useState()
  const [indexHead, setIndexHead] = useState(0)
  const [indexTail, setIndexTail] = useState(0)
  const [typeOperation, setTypeOpeation] = useState<TypeOperation>(0)

  const handlerInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }
  const handlerInputInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputIndex(e.target.value)
  }



  const handlerAddHead = async () => {
    setIsAnimationHead(true)
    setTypeOpeation(TypeOperation.ADD_HEAD)
    await sleep(500)
    list.appendHead(inputValue)
    setIsNewElement(true)
    setIsAnimationHead(false)
    setArray(list.toArray())
    await sleep(500)
    setIsNewElement(false)
    setInputValue('')
    setTypeOpeation(null)
  }


  const handlerAddTail = async () => {
    setisAnimationTail(true)
    setTypeOpeation(TypeOperation.ADD_TAIL)
    await sleep(500)
    list.appendTail(inputValue)
    setisAnimationTail(false)
    setIsNewElement(true)
    setArray(list.toArray())
    await sleep(500)
    setIsNewElement(false)
    setInputValue('')
    setTypeOpeation(null)
  }

  const handlerDeleteHead = async () => {
    setIsAnimationHead(true)
    setTypeOpeation(TypeOperation.DELETE_HEAD)
    await sleep(500)
    list.deleteHead()
    setIsAnimationHead(false)
    setIsNewElement(true)
    setArray(list.toArray())
    await sleep(500)
    setIsNewElement(false)
    setInputValue('')
    setTypeOpeation(null)
  }


  const setCircle = (index) => {
    if (index == 0 && isAnimationHead) {
      return <Circle letter={inputValue} isSmall={true} state={ElementStates.Changing} />
    } else if (index == array.length - 1 && isAnimationTail) {
      return <Circle letter={inputValue} isSmall={true} state={ElementStates.Changing} />
    }
  }

  const setState = (index) => {
    console.log(isAnimationHead && isNewElement && index === 0)
    if (typeOperation === TypeOperation.ADD_HEAD && isNewElement && index === 0) {
      return ElementStates.Modified
    } else if (typeOperation === TypeOperation.ADD_TAIL && isNewElement && index === array.length - 1) {
      return ElementStates.Modified
    }
  }

  return (
    <SolutionLayout title="Связный список">
      <div className={styles.wrapperContent}>
        <div className={styles.controlPanel}>
          <Input maxLength={4} isLimitText={true} value={inputValue} extraClass={styles.input} onChange={handlerInputValue} />
          <Button text="Добавить в head" disabled={loading} extraClass={styles.buttonAdd} onClick={handlerAddHead} />
          <Button text="Добавить в tail" disabled={loading} extraClass={styles.buttonDelete} onClick={handlerAddTail} />
          <Button text="Удалить из head" disabled={loading} extraClass={styles.buttonDelete} />
          <Button text="Удалить из tail" disabled={loading} extraClass={styles.buttonDelete} />

        </div>
        <div className={styles.contentList}>
          {array &&
            array.map((el, index) => {
              return (<Circle
                index={index}
                key={index}
                letter={el ? el : ""}
                head={setCircle(index)}
                //tail={isTail(index) ? "tail" : ""}
                state={setState(index)}
              />

              )

            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
