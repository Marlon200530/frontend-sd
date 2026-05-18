import { useState } from "react";
import { X } from "lucide-react";
import { formatDate, formatDateTime } from "../utils/format";
import { Badge, Button, Field, InfoBox, ResourceIcon, TextInput, isImageSource } from "../components/common";
import { loanRequestSchema, zodErrors } from "../utils/validation";

const earliestDueDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

export function ResourceDetail({
  resource,
  owner,
  currentUser,
  loans,
  users,
  onBack,
  onRequest,
  isRequesting = false,
}: any) {
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [imageOpen, setImageOpen] = useState(false);
  const resourceLoans = loans.filter((loan) => loan.resourceId === resource.id);
  const myOpenLoan = resourceLoans.find(
    (loan) =>
      loan.borrowerId === currentUser.id &&
      ["Pendente", "Activa"].includes(loan.status),
  );
  const canRequest =
    resource.ownerId !== currentUser.id &&
    resource.status === "Disponível" &&
    !myOpenLoan;
  const hasPhoto = isImageSource(resource.image);

  function submit(event) {
    event.preventDefault();
    const result = loanRequestSchema.safeParse({ dueDate });
    const nextErrors = result.success ? {} : zodErrors(result.error);
    setErrors(nextErrors);
    if (!result.success || isRequesting) return;
    onRequest(resource.id, result.data.dueDate);
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack}>
        Voltar
      </Button>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-6">
            <button
              type="button"
              onClick={() => hasPhoto && setImageOpen(true)}
              className={`h-56 overflow-hidden rounded-2xl bg-emerald-50 text-emerald-700 sm:h-80 ${hasPhoto ? "cursor-zoom-in" : "cursor-default"}`}
              aria-label={hasPhoto ? "Ampliar imagem do recurso" : undefined}
            >
              {hasPhoto ? (
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-emerald-50">
                  <ResourceIcon type={resource.image} className="h-20 w-20 sm:h-28 sm:w-28" />
                </div>
              )}
            </button>
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={resource.status === "Disponível" ? "green" : "amber"}
                >
                  {resource.status}
                </Badge>
                <Badge variant="grey">{resource.category}</Badge>
              </div>
              <h2 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl">
                {resource.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                {resource.description}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <InfoBox
                  label="Partilhado por"
                  value={owner?.name || resource.owner?.name || "Utilizador"}
                />
                <InfoBox
                  label="Visível desde"
                  value={formatDateTime(resource.createdAt)}
                />
                <InfoBox label="Local de entrega" value={resource.location} />
                <InfoBox
                  label="Contacto do dono"
                  value={owner?.contact || resource.owner?.contact || "Não informado"}
                />
              </div>
            </div>
          </div>
        </section>
        <aside className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-6 xl:sticky xl:top-24 xl:self-start">
          <h3 className="text-xl font-black text-slate-900">
            Requisitar recurso
          </h3>
          {resource.ownerId === currentUser.id ? (
            <p className="mt-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
              Este recurso pertence a ti. Podes editá-lo na área “Meus
              recursos”.
            </p>
          ) : myOpenLoan ? (
            <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              Já tens uma requisição {myOpenLoan.status.toLowerCase()} para este
              recurso. Só podes pedir novamente depois de devolveres ou se o
              pedido for rejeitado.
            </p>
          ) : resource.status !== "Disponível" ? (
            <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              Este recurso já está requisitado. Aguarda a devolução.
            </p>
          ) : (
            <form onSubmit={submit} className="mt-5 space-y-4">
              <Field label="Data prevista de devolução" error={errors.dueDate}>
                <TextInput
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={earliestDueDate}
                  required
                />
              </Field>
              <Button
                type="submit"
                disabled={!canRequest || isRequesting}
                className="w-full py-3"
              >
                {isRequesting ? "A enviar..." : "Confirmar requisição"}
              </Button>
            </form>
          )}
          <div className="mt-6 border-t border-emerald-100 pt-5">
            <h4 className="font-black text-slate-900">Histórico resumido</h4>
            <div className="mt-3 space-y-3">
              {resourceLoans.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Ainda não existem requisições deste recurso.
                </p>
              ) : (
                resourceLoans.map((loan) => {
                  const borrower = users.find(
                    (user) => user.id === loan.borrowerId,
                  );
                  return (
                    <div
                      key={loan.id}
                      className="rounded-xl bg-emerald-50 p-3 text-sm"
                    >
                      <p className="font-bold text-slate-800">
                        {borrower?.name || "Utilizador"}
                      </p>
                      <p className="text-slate-500">
                        {formatDate(loan.requestedAt)} →{" "}
                        {loan.returnedAt
                          ? formatDate(loan.returnedAt)
                          : `prazo ${formatDate(loan.dueDate)}`}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      </div>
      {imageOpen && hasPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4"
          onClick={() => setImageOpen(false)}
        >
          <button
            type="button"
            onClick={() => setImageOpen(false)}
            className="absolute right-4 top-4 rounded-xl bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Fechar imagem ampliada"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={resource.image}
            alt={resource.title}
            className="max-h-[90vh] max-w-[94vw] rounded-2xl object-contain shadow-xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}




