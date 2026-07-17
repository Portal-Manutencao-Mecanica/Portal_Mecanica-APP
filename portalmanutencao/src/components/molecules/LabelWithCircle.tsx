import CircleLabel from "../atoms/CircleLabel";
import Label from "../atoms/Label";


export default function LabelWithCircle(){
    return(
        <div className="flex flex-row justify-center">
            <CircleLabel color={"weg-negative"} height={"5"} width={"5"}/>
            <Label type={"positive"} placeholder={"Ocorrencia"} width={"20"} height={"20"}            
            />
        </div>
    )
}