import { swap } from "../../utils/swap";
import { Character } from "../../types/character";
import { ElementStates } from "../../types/element-states";

export const getReversingStringSteps = (value: string): Array<Array<Character>> => {
  const result: Array<Array<Character>> = [[]]

  if (!value) return result;
  for (let i = 0; i < value.length; i++) {
    console.log(value[i])
    result[0][i] = { character: value[i], state: ElementStates.Default }
  }

  const array = value.split('');
  let i = 1;
  let j = 0;
  let start = 0;
  let end = array.length - 1
  let state: "Changing" | "Modified" = "Changing"
  while (start <= end) {

    if (!result[i]) {
      result[i] = [...result[i - 1]]
    }
    if (j === end && state === "Changing") {
      result[i][j] = { character: array[j], state: ElementStates.Changing }
    } else if (j === start && state === "Changing") {
      result[i][j] = { character: array[j], state: ElementStates.Changing }
    }

    if (j === end && state === "Modified") {
      result[i][j] = { character: array[j], state: ElementStates.Modified }
      start++
      end--;
    } else if (j === start && state === "Modified") {
      result[i][j] = { character: array[j], state: ElementStates.Modified }
    }

    if (j === array.length - 1 && state === "Changing") {
      swap(array, start, end)
      j = 0;
      i++;
      state = "Modified"
      continue;
    } else if (j === array.length - 1 && state === "Modified") {
      state = "Changing"
      j = 0;
      i++;
      continue;
    }
    j++
  }
  return result
}
