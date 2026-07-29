export interface UserProfileProps {
    id: string;
    name: string;
    email: string;
    role: "ALUNO" | "PROFESSOR" | "ADMIN" | "COORDENADOR"; 
}
