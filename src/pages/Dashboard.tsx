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
      <div className="rounded-2xl bg-emerald-800 p-5 text-white shadow-sm shadow-emerald-900/20 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">
              Bem-vindo ao {APP_NAME}
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <Button variant="secondary" onClick={() => setPage("new-resource")} className="w-full sm:w-auto">
              <Plus className="h-4 w-4" /> Publicar recurso
            </Button>
            <Button variant="secondary" onClick={() => setPage("explore")} className="w-full sm:w-auto">
              Explorar recursos
            </Button>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                  className="flex w-full flex-col gap-3 rounded-2xl border border-emerald-50 p-4 text-left transition hover:bg-emerald-50 sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
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
