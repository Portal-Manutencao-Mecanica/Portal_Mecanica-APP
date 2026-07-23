export interface UserProfileProps {
    id: number;
    name: string;
    email: string;
    role: "ALUNO" | "PROFESSOR" | "ADMIN" | "COORDENADOR"; 
}