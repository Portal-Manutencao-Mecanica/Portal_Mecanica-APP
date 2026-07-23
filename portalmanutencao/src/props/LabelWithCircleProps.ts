import { CircleLabelProps } from "./CircleLabelProps";
import { LabelProps } from "./LabelProps";


export interface LabelWithCircleProps {
 
  circleColor: CircleLabelProps["color"];
  circleHeight: CircleLabelProps["height"];
  circleWidth: CircleLabelProps["width"];


  labelType: LabelProps["type"];
  labelPlaceholder: LabelProps["placeholder"];
  labelWidth: LabelProps["width"];
  labelHeight: LabelProps["height"];
}