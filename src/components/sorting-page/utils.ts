import { ElementStates } from "../../types/element-states";
import { swap } from "../../utils/swap";


export interface Item {
  value: number;
  state: ElementStates;
}

export enum OrderBy {
  ASC,
  DESC
}



export const selectionSortStep = (arr: number[] | null, orderBy: OrderBy): Item[][] => {
  if (!arr) {
    return [[]]
  }

  const { length } = arr;
  const res: Array<Array<Item>> = [[]];
  let tmp: Array<Item> = [];
  let tmp1: Array<Item> = [];
  for (let i = 0; i < length; i++) {
    res[0][i] = { value: arr[i], state: ElementStates.Default };
  }

  for (let i = 0, level = 1; i < length; i++) {
    let index = i;
    if (!res[level]) {
      res[level] = [...res[level - 1]];
    }

    tmp1 = [...res[level]];
    res[level][i] = { value: arr[i], state: ElementStates.Changing };
    tmp = [...res[level]];

    for (let j = i + 1; j < length; j++, level++) {
      res[level][j] = { value: arr[j], state: ElementStates.Changing };

      if (orderBy === OrderBy.ASC) {
        if (arr[index] > arr[j]) {
          index = j;
        }
      } else {
        if (arr[index] < arr[j]) {
          index = j;
        }
      }
      res[level + 1] = [...tmp];
    }

    swap(arr, i, index);
    swap(tmp1, i, index);
    tmp1[i] = { value: arr[i], state: ElementStates.Modified };
    res[level] = [...tmp1]
  }
  return res;
};


export const bubbleSortSteps = (arr: number[], orderBy: OrderBy = OrderBy.ASC) => {
  const { length } = arr;

  const res: Array<Array<Item>> = [[]];
  let tmp = []
  for (let i = 0; i < length; i++) {
    res[0][i] = { value: arr[i], state: ElementStates.Default };
  }
  for (let i = 0, level = 1; i < length; i++) {
    if (!res[level]) {
      res[level] = [...res[level - 1]];
    }

    tmp = [...res[level]];

    for (let j = 0; j < length - i - 1; j++, level++) {
      if (orderBy === OrderBy.ASC) {
        if (arr[j] > arr[j + 1]) {
          swap(arr, j, j + 1);
          swap(tmp, j, j + 1);
        }
      } else {
        if (arr[j] < arr[j + 1]) {
          swap(arr, j, j + 1);
          swap(tmp, j, j + 1);
        }
      }
      res[level][j] = { value: arr[j], state: ElementStates.Changing };
      res[level][j + 1] = { value: arr[j + 1], state: ElementStates.Changing };
      res[level + 1] = [...tmp];

      if (j + 1 === length - i - 1) {
        if (i === length - 2) {
          res[level + 1][j] = { value: arr[j], state: ElementStates.Modified };
          res[level + 1][j + 1] = { value: arr[j + 1], state: ElementStates.Modified };
        } else {
          res[level + 1][j + 1] = { value: arr[j + 1], state: ElementStates.Modified };
        }

      }
    }
  }
  return res;
};