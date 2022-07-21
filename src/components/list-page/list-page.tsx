import React, { useEffect, useRef, useState } from "react";
import { LinkedList } from "../../data-structures/linled-list";
import { ElementStates } from "../../types/element-states";
import { CircleWithArrow, ElementStatesArrow } from "../circle-with-arrow/circlew-with-arrow";
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
  ADD_BY_INDEX_SEARCH,
  ADD_BY_INDEX_INSERT,
  DELETE_BY_INDEX_SEARCH,
  DELETE_BY_INDEX_REMOVE,
}

export const ListPage: React.FC = () => {

  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [loading, setLoading] = useState(false);
  const interval = React.useRef<null | NodeJS.Timeout>(null);
  const [array, setArray] = useState<(number | null)[]>([]);
  const [list,] = useState(new LinkedList<number>());
  const [isAnimationHead, setIsAnimationHead] = useState<boolean>(false)
  const [isAnimationTail, setIsAnimationTail] = useState<boolean>(false)
  const [isAnimationByIndex, setIsAnimationByIndex] = useState<boolean>(false)
  const [isNewElement, setIsNewElement] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [lastElementArray, setLastElementArray] = useState<number | null>(0)
  const [firstElementArray, setFirstElementArray] = useState<number | null>(0)
  const [typeOperation, setTypeOperation] = useState<TypeOperation | null>(null)

  const handlerInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }
  const handlerInputInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputIndex(e.target.value)
  }

  useEffect(() => {
    for (let i = 0; i < 5; i++) {
      list.appendHead(Math.floor(Math.random() * (100 - 1) + 1))
    }
    setArray(list.toArray())
  }, [list])

  useEffect(() => {
    if (TypeOperation.ADD_BY_INDEX_SEARCH === typeOperation) {
      interval.current = setInterval(() => {
        if (currentIndex === Number(inputIndex)) {
          console.log('asdsad')
          setIsNewElement(true)
          setTypeOperation(TypeOperation.ADD_BY_INDEX_INSERT)
          setArray(list.toArray())
        }
        setCurrentIndex(prev => prev + 1)
      }, 500)
    }
    return () => {
      if (interval.current !== null) {
        return clearInterval(interval.current);
      }
    };
  }, [interval, typeOperation, currentIndex, inputIndex, list])

  useEffect(() => {
    if (TypeOperation.ADD_BY_INDEX_INSERT === typeOperation && isNewElement) {
      setTimeout(() => {
        setIsNewElement(false)
        setTypeOperation(null)
        setInputIndex('')
        setInputValue('')
      }, 1000)
    }

  }, [typeOperation, isNewElement])


  useEffect(() => {
    if (TypeOperation.DELETE_BY_INDEX_SEARCH === typeOperation) {
      interval.current = setInterval(() => {
        if (currentIndex !== Number(inputIndex)) {
          setCurrentIndex(prev => prev + 1)
        }
      }, 1000)
    }
    return () => {
      if (interval.current !== null) {
        return clearInterval(interval.current);
      }
    };
  }, [interval, typeOperation, currentIndex, inputIndex, list, array])

  useEffect(() => {
    console.log(currentIndex)
    console.log(inputIndex)
    if (TypeOperation.DELETE_BY_INDEX_SEARCH === typeOperation && currentIndex === Number(inputIndex)) {
      setTimeout(() => {
        const tmp = [...array]
        setLastElementArray(tmp[currentIndex])
        tmp[currentIndex] = null;
        setArray([...tmp])
        setTypeOperation(TypeOperation.DELETE_BY_INDEX_REMOVE)
      }, 1000)
    }
    if (TypeOperation.DELETE_BY_INDEX_REMOVE === typeOperation) {
      setTimeout(() => {
        setArray(list.toArray())
        setInputIndex('')
        setInputValue('')
        setTypeOperation(null)
      }, 1000)
    }
  }, [typeOperation, isNewElement, currentIndex, inputIndex])

  const handlerAddHead = async () => {
    setIsAnimationHead(true)
    setTypeOperation(TypeOperation.ADD_HEAD)
    await sleep(600)
    list.appendHead(Number(inputValue))
    setIsNewElement(true)
    setIsAnimationHead(false)
    setArray(list.toArray())
    await sleep(600)
    setIsNewElement(false)
    setInputValue('')
    setTypeOperation(null)
  }


  const handlerAddTail = async () => {
    setIsAnimationTail(true)
    setTypeOperation(TypeOperation.ADD_TAIL)
    await sleep(600)
    list.appendTail(Number(inputValue))
    setIsAnimationTail(false)
    setIsNewElement(true)
    setArray(list.toArray())
    await sleep(600)
    setIsNewElement(false)
    setInputValue('')
    setTypeOperation(null)
  }

  const handlerDeleteHead = async () => {
    setIsAnimationHead(true)
    setTypeOperation(TypeOperation.DELETE_HEAD)
    const tmp = [...array]
    setFirstElementArray(tmp[0])
    tmp[0] = null;
    setArray(tmp)
    await sleep(1000)
    list.deleteHead()
    setArray(list.toArray())
    setIsAnimationHead(false)
    await sleep(1000)
    setInputValue('')
    setTypeOperation(null)
  }

  const handlerDeleteTail = async () => {
    setIsAnimationTail(true)
    setTypeOperation(TypeOperation.DELETE_TAIL)
    const tmp = [...array]
    setLastElementArray(tmp[tmp.length - 1])
    tmp[tmp.length - 1] = null;
    setArray([...tmp])
    await sleep(1000)
    list.deleteTail()
    setArray(list.toArray())
    setIsAnimationTail(false)
    await sleep(1000)
    setInputValue('')
    setTypeOperation(null)
  }


  const handlerAddByIndex = () => {
    setCurrentIndex(0)
    setIsAnimationByIndex(true)
    setTypeOperation(TypeOperation.ADD_BY_INDEX_SEARCH)
    list.addByIndex(Number(inputValue), Number(inputIndex))
  }

  const handlerDeleteByIndex = () => {
    setCurrentIndex(0)
    setIsAnimationByIndex(true)
    setTypeOperation(TypeOperation.DELETE_BY_INDEX_SEARCH)
    list.deleteByIndex(Number(inputIndex))
  }

  const setCircleHead = (index: number) => {
    if (index === 0 && isAnimationHead && typeOperation === TypeOperation.ADD_HEAD) {
      return <Circle letter={inputValue} isSmall={true} state={ElementStates.Changing} />
    } else if (index === array.length - 1 && isAnimationTail && typeOperation === TypeOperation.ADD_TAIL) {
      return <Circle letter={inputValue} isSmall={true} state={ElementStates.Changing} />
    } else if (index === currentIndex && isAnimationByIndex && typeOperation === TypeOperation.ADD_BY_INDEX_SEARCH) {
      return <Circle letter={inputValue} isSmall={true} state={ElementStates.Changing} />
    } else if (index === 0) {
      return 'head'
    }
  }

  const setCircleTail = (index: number) => {
    if (index === 0 && isAnimationHead && typeOperation === TypeOperation.DELETE_HEAD) {
      return <Circle letter={firstElementArray?.toString()} isSmall={true} state={ElementStates.Changing} />
    } else if (index === array.length - 1 && isAnimationTail && typeOperation === TypeOperation.DELETE_TAIL) {
      return <Circle letter={lastElementArray?.toString()} isSmall={true} state={ElementStates.Changing} />
    } else if (index === currentIndex && typeOperation === TypeOperation.DELETE_BY_INDEX_REMOVE) {
      return <Circle letter={lastElementArray?.toString()} isSmall={true} state={ElementStates.Changing} />
    } else if (index === array.length - 1) {
      return 'tail'
    }
  }

  const setState = (index: number) => {
    if (typeOperation === TypeOperation.ADD_HEAD && isNewElement && index === 0) {
      return ElementStates.Modified
    } else if (typeOperation === TypeOperation.ADD_TAIL && isNewElement && index === array.length - 1) {
      return ElementStates.Modified
    } else if (typeOperation === TypeOperation.ADD_BY_INDEX_INSERT && index === currentIndex) {
      return ElementStates.Modified
    } else if ((typeOperation === TypeOperation.ADD_BY_INDEX_SEARCH || typeOperation === TypeOperation.ADD_BY_INDEX_INSERT) && index <= currentIndex) {
      return ElementStates.Changing
    } if ((typeOperation === TypeOperation.DELETE_BY_INDEX_SEARCH || typeOperation === TypeOperation.DELETE_BY_INDEX_REMOVE) && index <= currentIndex) {
      return ElementStates.Changing
    }
  }

  const setStateArrow = (index: number) => {
    if (index <= currentIndex && (typeOperation === TypeOperation.ADD_BY_INDEX_SEARCH || typeOperation === TypeOperation.ADD_BY_INDEX_INSERT)) {
      return ElementStatesArrow.Changing
    } if (index <= currentIndex && (typeOperation === TypeOperation.DELETE_BY_INDEX_SEARCH || typeOperation === TypeOperation.DELETE_BY_INDEX_REMOVE)) {
      return ElementStatesArrow.Changing
    } else {
      return ElementStatesArrow.Default
    }
  }

  const isNeedArrow = (index: number, array: any[]) => {
    if (array.length < 0) {
      return false
    } else if (index === 0) {
      return false
    } else {
      return true
    }
  }

  return (
    <SolutionLayout title="Связный список">
      <div className={styles.wrapperContent}>
        <div className={styles.controlPanel}>
          <Input maxLength={4}
            isLimitText={true}
            value={inputValue}
            disabled={loading}
            extraClass={styles.input}
            onChange={handlerInputValue}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }} />
          <Button text="Добавить в head"
            disabled={!!typeOperation || !inputValue}
            extraClass={styles.buttonAdd}
            onClick={handlerAddHead}
          />
          <Button text="Добавить в tail"
            disabled={!!typeOperation || !inputValue}
            extraClass={styles.buttonDelete}
            onClick={handlerAddTail} />
          <Button text="Удалить из head"
            disabled={!!typeOperation || !array.length}
            extraClass={styles.buttonDelete}
            onClick={handlerDeleteHead} />
          <Button text="Удалить из tail"
            disabled={!!typeOperation || !array.length}
            extraClass={styles.buttonDelete}
            onClick={handlerDeleteTail} />
          <Input maxLength={4}
            max={19}
            type="number"
            value={inputIndex}
            disabled={loading}
            extraClass={styles.input}
            onChange={handlerInputInput}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
          />
          <Button text="Добавить по индексу"
            disabled={loading || (array && Number(inputIndex) > array.length) || !inputIndex}
            extraClass={styles.addByIndex}
            onClick={handlerAddByIndex}
          />
          <Button text="Удалить по индексу"
            disabled={loading || (array && Number(inputIndex) > array.length) || !array.length}
            extraClass={styles.deleteByIndex}
            onClick={handlerDeleteByIndex}
          />

        </div>
        <div className={styles.contentList}>
          {array &&
            array.map((value, index) => {
              return (<CircleWithArrow
                key={index}
                letter={value ? value.toString() : ""}
                head={setCircleHead(index)}
                tail={setCircleTail(index)}
                stateCircle={setState(index)}
                stateArrow={setStateArrow(index)}
                isNeedArrow={!isNeedArrow(index, array)}
              />
              )
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
