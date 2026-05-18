import { LogIn, UserPlus } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "../data/mockData";
import { Badge, Button } from "../components/common";
export function Landing({ setAuthView }: any) {
  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <section className="max-w-4xl">
        <Badge variant="green">Sistema de Partilha Académica</Badge>
        <h1 className="mt-5 text-3xl font-black leading-tight text-emerald-950 sm:text-4xl lg:text-5xl">
          Partilha livros, apontamentos e equipamentos com a tua comunidade
          estudantil.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          {APP_TAGLINE} O {APP_NAME} ajuda estudantes a disponibilizarem,
          requisitarem e devolverem recursos de forma simples e segura.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button onClick={() => setAuthView("register")} className="w-full px-6 py-3 sm:w-auto">
            <UserPlus className="h-4 w-4" /> Criar conta
          </Button>
          <Button
            variant="secondary"
            onClick={() => setAuthView("login")}
            className="w-full px-6 py-3 sm:w-auto"
          >
            <LogIn className="h-4 w-4" /> Já tenho conta
          </Button>
        </div>
      </section>
    </div>
  );
}

export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <p className="text-2xl font-black text-emerald-800">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
