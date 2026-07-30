"use client";

import Link from "next/link";

interface MaterialCardProps {
    id: number;
    title: string;
}

export default function MaterialCard({
    id,
    title,
}: MaterialCardProps) {
    return (
        <Link href={`/complementar-material/${id}`}>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer">

                <div className="flex h-56 items-center justify-center bg-gray-100">
                    <span className="text-gray-400">
                        Imagem do material
                    </span>
                </div>

                <div className="border-t border-gray-200 p-4">
                    <h2 className="text-center font-semibold text-gray-800">
                        {title}
                    </h2>
                </div>

            </div>
        </Link>
    );
}