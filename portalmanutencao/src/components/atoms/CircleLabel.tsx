import { CircleLabelProps } from "@/props/CircleLabelProps"


export default function CircleLabel({color, height, width}:CircleLabelProps){

    return(
        <div className={`${color} ${height} ${width} rounded-full `}>
                
        </div>
    );
}