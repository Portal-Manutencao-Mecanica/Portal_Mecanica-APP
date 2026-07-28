"use client";

import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { ConfigFormProps } from "@/props/ConfigFormProps";
import Link from "next/link";

export default function ConfigForm({ user }: ConfigFormProps) {
    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-8">

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-weg-gray">
                    Configurações
                </h1>

                <p className="mt-2 text-gray-500">
                    Gerencie suas informações pessoais e configurações de acesso.
                </p>
            </div>

            {/* Dados pessoais */}
            <section className="mb-6 rounded-xl bg-weg-card-white p-6 shadow-sm">

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-weg-gray">
                        Dados pessoais
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Atualize as informações relacionadas à sua conta.
                    </p>
                </div>

                {/* Nome social */}
                <div className="border-b border-gray-200 py-5">

                    <div className="mb-4">
                        <h3 className="font-bold text-weg-gray">
                            Nome social
                        </h3>

                        <p className="text-sm text-gray-500">
                            Altere o nome que será exibido no sistema.
                        </p>
                    </div>

                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <Input
                                value={user.name}
                                placeholder="Digite seu nome social"
                            />
                        </div>

                        <Button>
                            Salvar
                        </Button>
                    </div>

                </div>

                {/* E-mail */}
                <div className="py-5">

                    <div className="mb-4">
                        <h3 className="font-bold text-weg-gray">
                            E-mail
                        </h3>

                        <p className="text-sm text-gray-500">
                            Altere o endereço de e-mail vinculado à sua conta.
                        </p>
                    </div>

                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <Input
                                value={user.email}
                                placeholder="Digite seu novo e-mail"
                            />
                        </div>

                        <Button>
                            Salvar
                        </Button>
                    </div>

                </div>

            </section>

            {/* Segurança */}
            <section className="rounded-xl bg-weg-card-white p-6 shadow-sm">

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-weg-gray">
                        Segurança
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Gerencie as configurações de segurança da sua conta.
                    </p>
                </div>

                <div className="flex items-center justify-between gap-6">

                    <div>
                        <h3 className="font-bold text-weg-gray">
                            Alterar senha
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Atualize sua senha para manter sua conta segura.
                        </p>
                    </div>

                    <Link href="../login/forgot-password">
                        <Button>
                            Trocar senha
                        </Button>
                    </Link>


                </div>

            </section>

        </div>
    );
}