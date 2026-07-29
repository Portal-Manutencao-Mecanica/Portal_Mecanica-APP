"use client";

import { FormEvent, useState } from "react";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { authService } from "@/services/authService";
import { getServiceErrorMessage } from "@/services/httpService";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message);
    } catch (requestError) {
      setError(getServiceErrorMessage(requestError, "Falha ao solicitar recuperação."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex w-full flex-col gap-8" onSubmit={handleSubmit}>
      <Input
        label="E-mail"
        type="email"
        required
        autoComplete="email"
        placeholder="Insira seu e-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      {message && <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">{message}</p>}
      {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
      </Button>
    </form>
  );
}
