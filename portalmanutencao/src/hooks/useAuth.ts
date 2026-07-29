import { useEffect, useState } from "react";

import type { UserProfile } from "@/lib/api/types";
import { authService } from "@/services/authService";

export function useAuth() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        authService.getSession()
            .then(setUser)
            .catch(() => {
                setUser(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    return { user, isLoading };
}
