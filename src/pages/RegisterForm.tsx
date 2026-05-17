import { AxiosError } from "axios";
import { useState } from "react";
import { Button, Field, TextInput } from "../components/common";
import { Logo } from "../layout/Logo";
import { useRegister } from "../hooks/useAuth";
import type { ApiErrorResponse } from "../types/api";
import { registerSchema, zodErrors } from "../utils/validation";

export function RegisterForm({ setAuthView }: any) {
  const registerMutation = useRegister();
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<any>({});

  function submit(event) {
    event.preventDefault();
    const result = registerSchema.safeParse(form);
    const nextErrors = result.success ? {} : zodErrors(result.error);
    setErrors(nextErrors);
    if (result.success) {
      registerMutation.mutate(
        {
          name: result.data.name,
          email: result.data.email,
          contact: result.data.contact || undefined,
          password: result.data.password,
          confirmPassword: result.data.confirm,
        },
        {
          onSuccess: () => setAuthView("login"),
        },
      );
    }
  }

  const apiError = registerMutation.error as AxiosError<ApiErrorResponse> | null;
  const serverErrorMessage =
    apiError?.response?.data?.error?.message ??
    "Não foi possível criar a conta. Confirma os dados.";

  return (
    <div className="mx-auto max-w-xl py-10">
      <div className="rounded-4xl border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-900/10">
        <Logo />
        <h1 className="mt-8 text-3xl font-black text-slate-900">
          Criar conta de estudante
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Regista-te para partilhar e requisitar recursos académicos.
        </p>
        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Nome completo" error={errors.name}>
            <TextInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex.: Ana Macuácua"
            />
          </Field>
          <Field label="Contacto" error={errors.contact}>
            <TextInput
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              placeholder="+258..."
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <TextInput
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="nome@student.ac.mz"
            />
          </Field>
          <Field label="Palavra-passe" error={errors.password}>
            <TextInput
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>
          <Field label="Confirmar palavra-passe" error={errors.confirm}>
            <TextInput
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
          </Field>
          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full py-3"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "A criar..." : "Criar conta"}
            </Button>
          </div>
        </form>
        {registerMutation.isError && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverErrorMessage}
          </p>
        )}
        <p className="mt-5 text-center text-sm text-slate-500">
          Já tens conta?{" "}
          <button
            className="font-bold text-emerald-700"
            onClick={() => setAuthView("login")}
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}



