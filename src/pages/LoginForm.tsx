import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Field, TextInput } from "../components/common";
import { Logo } from "../layout/Logo";
import { useLogin } from "../hooks/useAuth";
import type { ApiErrorResponse } from "../types/api";
import { loginSchema, zodErrors } from "../utils/validation";

type LoginFormProps = {
  setAuthView: (view: "login" | "register") => void;
};

type LoginFormData = {
  email: string;
  password: string;
};

type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

export function LoginForm({ setAuthView }: LoginFormProps) {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [form, setForm] = useState<LoginFormData>({
    email: "marlon@student.ac.mz",
    password: "12345678",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});

  function validateForm() {
    const result = loginSchema.safeParse(form);
    return result.success ? {} : zodErrors(result.error);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    loginMutation.mutate(form, {
      onSuccess: (authData) => {
        if (authData.user.role === "admin") {
          navigate("/admin");
          return;
        }

        navigate("/dashboard");
      },
    });
  }

  const apiError = loginMutation.error as AxiosError<ApiErrorResponse> | null;

  const serverErrorMessage =
    apiError?.response?.data?.error?.message ??
    "Não foi possível iniciar sessão. Verifica as credenciais.";

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="rounded-4xl border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-900/10">
        <Logo />

        <h1 className="mt-8 text-3xl font-medium text-slate-900">
          Entrar na plataforma
        </h1>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Email institucional" error={errors.email}>
            <TextInput
              value={form.email}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  email: event.target.value,
                }))
              }
            />
          </Field>

          <Field label="Palavra-passe" error={errors.password}>
            <TextInput
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  password: event.target.value,
                }))
              }
            />
          </Field>

          {loginMutation.isError && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverErrorMessage}
            </p>
          )}

          <Button
            type="submit"
            className="w-full py-3"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "A entrar..." : "Entrar"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Ainda não tens conta?{" "}
          <button
            type="button"
            className="font-bold text-emerald-700"
            onClick={() => setAuthView("register")}
          >
            Criar conta
          </button>
        </p>
      </div>
    </div>
  );
}
