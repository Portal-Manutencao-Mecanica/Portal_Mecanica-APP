'use client'

import { StudentProps } from "@/props/StudentProps";
import { Check, ChevronRight, User, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function StudentSelector({ value = [], onChange, error }: StudentSelectorProps) {
    const [classrooms, setClassrooms] = useState<ClassroomProps[]>([]);
    const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null);
    const [students, setStudents] = useState<StudentProps[]>([]);
    const [selectedStudentsList, setSelectedStudentsList] = useState<StudentProps[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // 1. Busca todas as turmas da API ao carregar o componente
    useEffect(() => {
        async function fetchClassrooms() {
            try {
                const res = await fetch("/api/classrooms"); // Substitua pela sua URL real
                const data = await res.json();
                setClassrooms(data);
            } catch (err) {
                console.error("Erro ao buscar turmas:", err);
            }
        }
        fetchClassrooms();
    }, []);

    // 2. Quando passar o mouse/selecionar uma turma, busca os alunos dela na API
    const handleHoverClassroom = async (classroomId: number) => {
        setSelectedClassroom(classroomId);
        try {
            const res = await fetch(`/api/classrooms/${classroomId}/students`); // Endpoint de alunos da turma
            const data = await res.json();
            setStudents(data);
        } catch (err) {
            console.error("Erro ao buscar alunos da turma:", err);
        }
    };

    // 3. Adiciona ou remove o aluno do estado global do formulário
    const toggleStudent = (student: StudentProps) => {
        let updatedIds: number[];
        let updatedList: StudentProps[];

        if (value.includes(student.id)) {
            updatedIds = value.filter((id) => id !== student.id);
            updatedList = selectedStudentsList.filter((s) => s.id !== student.id);
        } else {
            updatedIds = [...value, student.id];
            updatedList = [...selectedStudentsList, student];
        }

        setSelectedStudentsList(updatedList);
        if (onChange) onChange(updatedIds); // Notifica o React Hook Form / Valibot
    };

    return (
        <div className="relative w-full space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Alunos Envolvidos *
            </label>

            {/* Tags dos Alunos Selecionados */}
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedStudentsList.map((student) => (
                    <span
                        key={student.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200"
                    >
                        <User className="w-3.5 h-3.5" />
                        {student.name}
                        <button
                            type="button"
                            onClick={() => toggleStudent(student)}
                            className="hover:text-red-500 transition-colors ml-1"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </span>
                ))}
            </div>

            {/* Botão Principal para Abrir o Select */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left px-4 py-2.5 bg-white border rounded-xl text-sm font-medium flex justify-between items-center transition-all ${
                    error ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400'
                }`}
            >
                <span className={value.length === 0 ? "text-gray-400" : "text-gray-800"}>
                    {value.length === 0
                        ? "Selecione a turma para escolher os alunos..."
                        : `${value.length} aluno(s) selecionado(s)`}
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
            </button>

            {/* Dropdown Flutuante de 2 Níveis (Submenu) */}
            {isOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg flex h-64 overflow-hidden">
                    {/* Nível 1: Lista de Turmas */}
                    <div className="w-1/2 border-r border-gray-100 overflow-y-auto bg-gray-50/50 p-2">
                        <span className="text-[11px] font-bold text-gray-400 uppercase px-2 mb-1 block">
                            Turmas
                        </span>
                        {classrooms.map((cls) => (
                            <div
                                key={cls.id}
                                onMouseEnter={() => handleHoverClassroom(cls.id)}
                                onClick={() => handleHoverClassroom(cls.id)}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                                    selectedClassroom === cls.id
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-gray-200/70 text-gray-700"
                                }`}
                            >
                                <span>{cls.name}</span>
                                <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                            </div>
                        ))}
                    </div>

                    {/* Nível 2: Lista de Alunos da Turma Selecionada */}
                    <div className="w-1/2 overflow-y-auto p-2">
                        <span className="text-[11px] font-bold text-gray-400 uppercase px-2 mb-1 block">
                            Alunos da Turma
                        </span>
                        {!selectedClassroom ? (
                            <p className="text-xs text-gray-400 p-2">Passe o mouse sobre uma turma...</p>
                        ) : students.length === 0 ? (
                            <p className="text-xs text-gray-400 p-2">Nenhum aluno nesta turma.</p>
                        ) : (
                            students.map((student) => {
                                const isSelected = value.includes(student.id);
                                return (
                                    <div
                                        key={student.id}
                                        onClick={() => toggleStudent(student)}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                                            isSelected
                                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        <span>{student.name}</span>
                                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Mensagem de Erro do Valibot */}
            {error && <span className="text-xs text-red-500 font-medium block">{error}</span>}
        </div>
    );
}