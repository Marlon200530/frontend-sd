import { useEffect } from "react";
import { Bell, Check, Clock, X } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  PageHeader,
  ResourceIcon,
} from "../components/common";
import { formatDate, formatDateTime } from "../utils/format";

export function NotificationsPage({
  currentUser,
  notifications,
  loans,
  resources,
  users,
  onApprove,
  onReject,
  onReturn,
  onOpenResource,
  markRead,
}: any) {
  useEffect(() => {
    markRead?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ordered = [...notifications].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  function getLoan(notification: any) {
    return loans.find((loan: any) => loan.id === notification.loanId);
  }

  function getResource(loan: any) {
    return resources.find((resource: any) => resource.id === loan?.resourceId);
  }

  function getBorrower(loan: any) {
    return users.find((user: any) => user.id === loan?.borrowerId);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificações"
        description="Acompanha pedidos de requisição, aprovações, rejeições e devoluções dos recursos."
      />

      {ordered.length === 0 ? (
        <EmptyState
          title="Sem notificações"
          description="Quando alguém requisitar um recurso teu, a notificação aparece aqui."
        />
      ) : (
        <div className="space-y-4">
          {ordered.map((notification: any) => {
            const loan = getLoan(notification);
            const resource = getResource(loan);
            const borrower = getBorrower(loan);

            const canModerate =
              notification.type === "loan_created" &&
              loan?.status === "Pendente" &&
              resource?.ownerId === currentUser.id;

            const canConfirmReturn =
              loan?.status === "Devolução pendente" &&
              resource?.ownerId === currentUser.id;

            return (
              <section
                key={notification.id}
                className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      {resource ? (
                        <ResourceIcon
                          type={resource.image}
                          className="h-7 w-7"
                        />
                      ) : (
                        <Bell className="h-6 w-6" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            loan?.status === "Pendente"
                              ? "amber"
                              : loan?.status === "Devolução pendente"
                                ? "amber"
                                : loan?.status === "Activa"
                                  ? "green"
                                  : loan?.status === "Rejeitada"
                                    ? "red"
                                    : "grey"
                          }
                        >
                          {loan?.status || "Informação"}
                        </Badge>

                        {!notification.read && (
                          <Badge variant="dark">Nova</Badge>
                        )}
                      </div>

                      <p className="mt-3 font-black text-slate-900">
                        {notification.message}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {formatDateTime(notification.createdAt)}
                      </p>

                      {loan && resource && (
                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                          <div className="rounded-xl bg-emerald-50 p-3">
                            <p className="text-xs font-bold uppercase text-emerald-700">
                              Recurso
                            </p>
                            <p className="font-bold text-slate-900">
                              {resource.title}
                            </p>
                          </div>

                          <div className="rounded-xl bg-emerald-50 p-3">
                            <p className="text-xs font-bold uppercase text-emerald-700">
                              Estudante
                            </p>
                            <p className="font-bold text-slate-900">
                              {borrower?.name || "Utilizador"}
                            </p>
                          </div>

                          <div className="rounded-xl bg-emerald-50 p-3">
                            <p className="text-xs font-bold uppercase text-emerald-700">
                              Prazo
                            </p>
                            <p className="font-bold text-slate-900">
                              {formatDate(loan.dueDate)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
                    {resource && (
                      <Button
                        variant="secondary"
                        onClick={() => onOpenResource(resource.id)}
                        className="w-full sm:w-auto"
                      >
                        Ver recurso
                      </Button>
                    )}

                    {canModerate && (
                      <>
                        <Button onClick={() => onApprove(loan.id)} className="w-full sm:w-auto">
                          <Check className="h-4 w-4" /> Aprovar
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => onReject(loan.id)}
                          className="w-full sm:w-auto"
                        >
                          <X className="h-4 w-4" /> Rejeitar
                        </Button>
                      </>
                    )}

                    {canConfirmReturn && (
                      <Button onClick={() => onReturn(loan.id)} className="w-full sm:w-auto">
                        <Check className="h-4 w-4" /> Confirmar devolução
                      </Button>
                    )}

                    {loan?.status === "Pendente" && !canModerate && (
                      <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
                        <Clock className="h-4 w-4" /> A aguardar aprovação
                      </span>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
