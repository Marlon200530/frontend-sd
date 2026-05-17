import { LogIn, Sparkles } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "../data/mockData";
import { Badge, Button } from "../components/common";
export function Landing({ setAuthView }: any) {
  return (
    <div className="items-center gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section>
        <Badge variant="green">Sistema de Partilha Académica</Badge>
        <h1 className="mt-6 w-auto text-5xl font-black leading-tight tracking-tight text-emerald-950 sm:text-6xl">
          Partilha livros, apontamentos e equipamentos com a tua comunidade
          estudantil.
        </h1>
        <p className="mt-6 w-auto text-lg leading-8 text-slate-600">
          {APP_TAGLINE} O {APP_NAME} ajuda estudantes a disponibilizarem,
          requisitarem e devolverem recursos de forma simples, segura e
          auditável.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => setAuthView("register")} className="px-6 py-3">
            <Sparkles className="h-4 w-4" /> Começar agora
          </Button>
          <Button
            variant="secondary"
            onClick={() => setAuthView("login")}
            className="px-6 py-3"
          >
            <LogIn className="h-4 w-4" /> Já tenho conta
          </Button>
        </div>
        {/* <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <Metric value="+120" label="recursos possíveis" />
          <Metric value="<2 min" label="para requisitar" />
          <Metric value="24h" label="token JWT demo" />
        </div> */}
      </section>
      {/* <section className="rounded-4xl border border-emerald-100 bg-white/80 p-5 shadow-2xl shadow-emerald-900/10 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">
            Recursos recentes
          </h2>
          <Badge variant="dark">Preview público</Badge>
        </div>
        <div className="space-y-4">
          {resources.map((resource) => {
            const owner = users.find((user) => user.id === resource.ownerId);
            return (
              <div
                key={resource.id}
                className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-4"
              >
                <div className="flex items-start gap-4">
                  <IconBubble className="h-14 w-14 bg-white">
                    <ResourceIcon type={resource.image} className="h-7 w-7" />
                  </IconBubble>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-slate-900">
                      {resource.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Partilhado por {owner?.name || "Utilizador"} •{" "}
                      {formatDate(resource.createdAt)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      resource.status === "Disponível" ? "green" : "amber"
                    }
                  >
                    {resource.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </section> */}
    </div>
  );
}

export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <p className="text-2xl font-black text-emerald-800">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

