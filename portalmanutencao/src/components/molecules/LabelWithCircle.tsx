import { LabelWithCircleProps } from "@/props/LabelWithCircleProps";
import CircleLabel from "../atoms/CircleLabel";
import Label from "../atoms/Label";

export default function LabelWithCircle({
  circleColor,
  circleHeight,
  circleWidth,
  labelType,
  labelPlaceholder,
  labelWidth,
  labelHeight,
}: LabelWithCircleProps) {
  return (
    <Label type={labelType} placeholder={labelPlaceholder} width={labelWidth} height={labelHeight}>
      <CircleLabel color={circleColor} height={circleHeight} width={circleWidth} />
    </Label>
  );
}