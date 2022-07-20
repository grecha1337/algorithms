import { type } from "os";
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
  const [isDeleteElement, setIsDeleteElement] = useState()
  const [indexHead, setIndexHead] = useState(0)
  const [indexTail, setIndexTail] = useState(0)
  const [lastElementArray, setLastElementArray] = useState(null)
  const [firstElementArray, setFirstElementArray] = useState(null)
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
    await sleep(600)
    list.appendHead(inputValue)
    setIsNewElement(true)
    setIsAnimationHead(false)
    setArray(list.toArray())
    await sleep(600)
    setIsNewElement(false)
    setInputValue('')
    setTypeOpeation(null)
  }


  const handlerAddTail = async () => {
    setisAnimationTail(true)
    setTypeOpeation(TypeOperation.ADD_TAIL)
    await sleep(600)
    list.appendTail(inputValue)
    setisAnimationTail(false)
    setIsNewElement(true)
    setArray(list.toArray())
    await sleep(600)
    setIsNewElement(false)
    setInputValue('')
    setTypeOpeation(null)
  }

  const handlerDeleteHead = async () => {
    setIsAnimationHead(true)
    setTypeOpeation(TypeOperation.DELETE_HEAD)
    const tmp = [...array]
    setFirstElementArray(tmp[0])
    tmp[0] = '';
    setArray(tmp)
    await sleep(1000)
    list.deleteHead()
    setArray(list.toArray())
    setIsAnimationHead(false)
    setIsDeleteElement(true)
    await sleep(1000)
    setIsDeleteElement(false)
    setInputValue('')
    setTypeOpeation(null)
  }

  const handlerDeleteTail = async () => {
    setisAnimationTail(true)
    setTypeOpeation(TypeOperation.DELETE_TAIL)
    const tmp = [...array]
    console.log(tmp[tmp.length - 1])
    setLastElementArray(tmp[tmp.length - 1])
    tmp[tmp.length - 1] = '';
    setArray(tmp)
    await sleep(1000)
    list.deleteTail()
    setArray(list.toArray())
    setisAnimationTail(false)
    setIsDeleteElement(true)
    await sleep(1000)
    setIsDeleteElement(false)
    setInputValue('')
    setTypeOpeation(null)
    console.log(lastElementArray)
  }




  const setCircleHead = (index) => {
    if (index === 0 && isAnimationHead && typeOperation === TypeOperation.ADD_HEAD) {
      return <Circle letter={inputValue} isSmall={true} state={ElementStates.Changing} />
    } else if (index == array.length - 1 && isAnimationTail && typeOperation === TypeOperation.ADD_TAIL) {
      return <Circle letter={inputValue} isSmall={true} state={ElementStates.Changing} />
    } else if (index === 0) {
      return 'head'
    }
  }

  const setCircleTail = (index) => {
    console.log(lastElementArray)
    if (index === 0 && isAnimationHead && typeOperation === TypeOperation.DELETE_HEAD) {
      return <Circle letter={firstElementArray} isSmall={true} state={ElementStates.Changing} />
    } else if (index == array.length - 1 && isAnimationTail && typeOperation === TypeOperation.DELETE_TAIL) {
      console.log('lastElementArray', lastElementArray)
      return <Circle letter={lastElementArray} isSmall={true} state={ElementStates.Changing} />
    } else if (index === array.length - 1) {
      return 'tail'
    }
  }

  const setState = (index) => {
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
          <Input maxLength={4}
            isLimitText={true}
            value={inputValue}
            extraClass={styles.input}
            onChange={handlerInputValue} />
          <Button text="Добавить в head"
            disabled={loading}
            extraClass={styles.buttonAdd}
            onClick={handlerAddHead} />
          <Button text="Добавить в tail"
            disabled={loading}
            extraClass={styles.buttonDelete}
            onClick={handlerAddTail} />
          <Button text="Удалить из head"
            disabled={loading}
            extraClass={styles.buttonDelete}
            onClick={handlerDeleteHead} />
          <Button text="Удалить из tail"
            disabled={loading}
            extraClass={styles.buttonDelete}
            onClick={handlerDeleteTail} />
          <Input maxLength={4}
            max={19}
            type="number"
            value={inputValue}
            extraClass={styles.input}
            onChange={handlerInputInput} />
          <Button text="Добавить по индексу"
            disabled={loading}
            extraClass={styles.addByIndex}
          />
          <Button text="Удалить по индексу"
            disabled={loading}
            extraClass={styles.deleteByIndex}
          />

        </div>
        <div className={styles.contentList}>
          {array &&
            array.map((el, index) => {
              return (<Circle

                key={index}
                letter={el ? el : ""}
                head={setCircleHead(index)}
                tail={setCircleTail(index)}
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
