import Link from "next/link";

import Button from "../atoms/Button";
import MachineConditionBadge from "../atoms/MachineConditionBadge";

interface Props {
    id: number;
    patrimony: string;
    name: string;
    place: string;
    condition: string;
    tag?: string;
}

export function MachineRow({
    id,
    patrimony,
    name,
    place,
    condition,
    tag,
}: Props) {
    return (
        <div className="grid grid-cols-6 items-center px-6 py-5 border-t border-gray-100">

            <span>{patrimony}</span>

            <span>{name}</span>

            <span>{place}</span>

            <MachineConditionBadge
                condition={condition}
            />

            <span>{tag || "-"}</span>

            <div className="flex justify-end">
                <Link href={`/maquinas/${id}`}>
                    <Button>
                        Ver
                    </Button>
                </Link>
            </div>

        </div>
    );
}