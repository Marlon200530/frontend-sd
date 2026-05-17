import { formatDate, formatDateTime } from "../utils/format";
import { Badge, Button, EmptyState, PageHeader, ResourceIcon } from "../components/common";
export function MyResources({
  currentUser,
  resources,
  loans,
  users,
  onEdit,
  onDelete,
  onOpen,
  onReturn,
}: any) {
  const mine = resources.filter(
    (resource) => resource.ownerId === currentUser.id,
  );
  return (
    <div className="space-y-6">
      <PageHeader
        title="Meus recursos"
        description="Acompanha tudo o que publicaste e controla edição, remoção e histórico."
      />
      {mine.length === 0 ? (
        <EmptyState
          title="Ainda não publicaste recursos"
          description="Publica o teu primeiro recurso para que outros estudantes possam requisitá-lo."
        />
      ) : (
        <div className="overflow-hidden rounded-4xl border border-emerald-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left text-sm">
              <thead className="bg-emerald-50 text-xs uppercase tracking-wide text-emerald-800">
                <tr>
                  <th className="px-5 py-4">Recurso</th>
                  <th className="px-5 py-4">Categoria</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Visibilidade</th>
                  <th className="px-5 py-4">Publicado em</th>
                  <th className="px-5 py-4">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {mine.map((resource) => {
                  const hasOpenRequests = loans.some(
                    (loan) =>
                      loan.resourceId === resource.id &&
                      ["Pendente", "Activa", "Expirada", "Devolução pendente"].includes(loan.status),
                  );
                  return (
                  <tr key={resource.id} className="align-top">
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ResourceIcon type={resource.image} className="h-5 w-5" /></span>
                        <div>
                          <p className="font-black text-slate-900">
                            {resource.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {resource.location}
                          </p>
                          <p className="mt-1 text-xs text-emerald-700">
                            Partilhado por {currentUser.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">{resource.category}</td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          resource.status === "Disponível" ? "green" : "amber"
                        }
                      >
                        {resource.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={resource.visible ? "green" : "red"}>
                        {resource.visible ? "Visível" : "Oculto"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      {formatDateTime(resource.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => onOpen(resource.id)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="secondary"
                          disabled={resource.status !== "Disponível" || hasOpenRequests}
                          onClick={() => onEdit(resource.id)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          disabled={resource.status !== "Disponível" || hasOpenRequests}
                          onClick={() => onDelete(resource.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black text-slate-900">
          Histórico dos meus recursos
        </h3>
        <div className="mt-4 space-y-3">
          {loans.filter((loan) =>
            mine.some((resource) => resource.id === loan.resourceId),
          ).length === 0 ? (
            <p className="text-sm text-slate-500">Ainda não há histórico.</p>
          ) : (
            loans
              .filter((loan) =>
                mine.some((resource) => resource.id === loan.resourceId),
              )
              .map((loan) => {
                const resource = resources.find(
                  (item) => item.id === loan.resourceId,
                );
                const borrower = users.find(
                  (user) => user.id === loan.borrowerId,
                );
                const canMarkReturned = ["Activa", "Expirada", "Devolução pendente"].includes(loan.status);
                return (
                  <div
                    key={loan.id}
                    className="flex flex-col gap-3 rounded-3xl bg-emerald-50 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <strong>{resource?.title}</strong> requisitado por{" "}
                      {borrower?.name}. Prazo: {formatDate(loan.dueDate)}. Estado:{" "}
                      {loan.status}
                    </div>
                    {canMarkReturned && (
                      <Button onClick={() => onReturn(loan.id)}>
                        {loan.status === "Devolução pendente"
                          ? "Confirmar devolução"
                          : "Marcar devolução"}
                      </Button>
                    )}
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}




