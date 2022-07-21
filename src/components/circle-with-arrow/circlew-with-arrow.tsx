import { ElementStates } from "../../types/element-states";
import { Circle } from "../ui/circle/circle"
import { ArrowIcon } from "../ui/icons/arrow-icon";
import styles from "./circle-with-arrow.module.css"

interface CircleProps {
  stateCircle?: ElementStates;
  stateArrow?: ElementStatesArrow;
  letter?: string;
  head?: string | React.ReactElement | null;
  index?: number;
  tail?: string | React.ReactElement | null;
  tailType?: "string" | "element";
  extraClass?: string;
  isSmall?: boolean;
  isNeedArrow?: boolean;

}

export enum ElementStatesArrow {
  Default = " #0032ff",
  Changing = "#d252e1",
  Modified = "#7fe051",
}

export const CircleWithArrow: React.FC<CircleProps> = ({
  stateCircle = ElementStates.Default,
  letter,
  head,
  index,
  tail,
  extraClass = "",
  isSmall,
  isNeedArrow = false,
  stateArrow = ElementStatesArrow.Default,
}) => {
  return (
    <div className={styles.wrapperCircle}>
      {!isNeedArrow && <ArrowIcon fill={stateArrow} />}
      <Circle state={stateCircle}
        letter={letter}
        head={head}
        index={index}
        tail={tail}
        extraClass={extraClass}
        isSmall={isSmall} />

    </div>
  );
};
