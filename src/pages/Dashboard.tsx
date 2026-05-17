import { BookOpen, CheckCircle2, Plus, Repeat2, Users } from "lucide-react";
import { APP_NAME } from "../data/mockData";
import { formatDateTime } from "../utils/format";
import { Badge, Button, ResourceIcon, StatCard } from "../components/common";

export function Dashboard({
  currentUser,
  resources,
  loans,
  users,
  setPage,
  setSelectedResourceId,
}: any) {
  const myResources = resources.filter(
    (item) => item.ownerId === currentUser.id,
  );
  const activeLoans = loans.filter(
    (item) => item.borrowerId === currentUser.id && item.status === "Activa",
  );
  const available = resources.filter(
    (item) => item.visible && item.status === "Disponível",
  );
  const recent = [...resources]
    .filter((item) => item.visible)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="rounded-4xl bg-linear-to-br from-emerald-800 to-green-700 p-6 text-white shadow-xl shadow-emerald-900/20">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            {/* <Badge variant="dark">MVP funcional</Badge> */}
            <h2 className="mt-4 text-3xl font-black">
              Bem-vindo ao {APP_NAME}
            </h2>
            {/* <p className="mt-2 max-w-2xl text-emerald-50">
              Aqui controlas recursos publicados, requisições activas,
              devoluções e histórico. Todo recurso publicado mostra quem
              partilhou e desde quando está visível.
            </p> */}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setPage("new-resource")}>
              <Plus className="h-4 w-4" /> Publicar recurso
            </Button>
            <Button variant="secondary" onClick={() => setPage("explore")}>
              Explorar recursos
            </Button>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Disponíveis"
          value={available.length}
          icon={<CheckCircle2 className="h-6 w-6" />}
        />
        <StatCard
          title="Meus recursos"
          value={myResources.length}
          icon={<BookOpen className="h-6 w-6" />}
        />
        <StatCard
          title="Minhas requisições"
          value={activeLoans.length}
          icon={<Repeat2 className="h-6 w-6" />}
        />
        <StatCard
          title="Utilizadores"
          value={users.filter((u) => u.active).length}
          icon={<Users className="h-6 w-6" />}
        />
      </div>
      <div className="">
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black">Recursos recentes</h3>
            <Button variant="ghost" onClick={() => setPage("explore")}>
              Ver todos
            </Button>
          </div>
          <div className="space-y-3">
            {recent.map((resource) => {
              const owner = users.find((user) => user.id === resource.ownerId);
              return (
                <button
                  key={resource.id}
                  onClick={() => setSelectedResourceId(resource.id)}
                  className="flex w-full items-center gap-4 rounded-3xl border border-emerald-50 p-4 text-left transition hover:bg-emerald-50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <ResourceIcon type={resource.image} className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-slate-900">
                      {resource.title}
                    </p>
                    <p className="text-sm text-slate-500">
                      Partilhado por {owner?.name || "Utilizador"} •{" "}
                      {formatDateTime(resource.createdAt)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      resource.status === "Disponível" ? "green" : "amber"
                    }
                  >
                    {resource.status}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
        {/* <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-black">Actividade recente</h3>
          <div className="mt-4 space-y-4">
            {loans.slice(0, 5).map((loan) => {
              const resource = resources.find(
                (item) => item.id === loan.resourceId,
              );
              const borrower = users.find(
                (user) => user.id === loan.borrowerId,
              );
              return (
                <div key={loan.id} className="rounded-3xl bg-emerald-50 p-4">
                  <p className="font-bold text-slate-900">
                    {borrower?.name} requisitou {resource?.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Prazo: {formatDate(loan.dueDate)} • Estado: {loan.status}
                  </p>
                </div>
              );
            })}
            {loans.length === 0 && (
              <p className="text-sm text-slate-500">
                Ainda não existem requisições.
              </p>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
