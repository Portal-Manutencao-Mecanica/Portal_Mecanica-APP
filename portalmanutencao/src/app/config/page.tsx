"use client";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import ConfigForm from "@/components/organisms/ConfigForm";

export default function ConfigPage() {

    const user = {
        name: "Alexandre Santos",
        email: "alexandre@weg.net",
    };

    return (
        <LayoutDesktop>
            <ConfigForm user={user} />
        </LayoutDesktop>
    );
}