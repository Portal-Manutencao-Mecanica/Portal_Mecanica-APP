import { UserProfileProps } from "@/props/UserProfileProps";
import { useEffect, useState } from "react";

export function useAuth() {
    const [user, setUser] = useState<UserProfileProps | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("@App:user");
        
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            const mockUser: UserProfileProps = {
                id: 1,
                name: "Arthur Mourão",
                email: "arthur@professor.com",
                role: "PROFESSOR",
            };
            setUser(mockUser);
        }
    }, []);

    return { user };
}