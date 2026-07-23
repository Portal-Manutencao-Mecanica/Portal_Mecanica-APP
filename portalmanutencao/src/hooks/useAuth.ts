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
                name: "João Silva",
                email: "joao@aluno.com",
                role: "ALUNO",
            };
            setUser(mockUser);
        }
    }, []);

    return { user };
}