import { formatDate, isOverdue } from "../utils/format";
import { Badge, Button, EmptyState, InfoBox, PageHeader, ResourceIcon } from "../components/common";
export function MyLoans({
  currentUser,
  resources,
  loans,
  users,
  onReturn,
  onOpen,
}: any) {
  const mine = loans.filter((loan: any) => loan.borrowerId === currentUser.id);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Minhas requisições"
        description="Controla recursos que requisitaste e regista devoluções dentro do prazo."
      />
      {mine.length === 0 ? (
        <EmptyState
          title="Nenhuma requisição registada"
          description="Explora recursos disponíveis e faz a tua primeira requisição."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {mine.map((loan: any) => {
            const resource = resources.find(
              (item: any) => item.id === loan.resourceId,
            );
            const owner = users.find(
              (user: any) => user.id === resource?.ownerId,
            );
            const overdue = loan.status === "Activa" && isOverdue(loan.dueDate);
            const canRequestReturn = ["Activa", "Expirada"].includes(loan.status);
            return (
              <div
                key={loan.id}
                className="rounded-4xl border border-emerald-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <ResourceIcon type={resource?.image} className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900">
                        {resource?.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Dono: {owner?.name || "Utilizador"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      overdue || loan.status === "Rejeitada"
                        ? "red"
                        : ["Pendente", "Devolução pendente"].includes(loan.status)
                          ? "amber"
                          : "green"
                    }
                  >
                    {overdue ? "Expirada" : loan.status}
                  </Badge>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <InfoBox
                    label="Requisitado em"
                    value={formatDate(loan.requestedAt)}
                  />
                  <InfoBox label="Prazo" value={formatDate(loan.dueDate)} />
                  <InfoBox
                    label="Devolvido em"
                    value={formatDate(loan.returnedAt)}
                  />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => resource && onOpen(resource.id)}
                  >
                    Ver recurso
                  </Button>
                  <Button
                    disabled={!canRequestReturn}
                    onClick={() => onReturn(loan.id)}
                  >
                    Pedir devolução
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}




