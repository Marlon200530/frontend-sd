import { useMemo, useState } from "react";
import { availability } from "../data/mockData";
import {
  Button,
  EmptyState,
  PageHeader,
  ResourceCard,
  SelectInput,
  TextInput,
} from "../components/common";

export function ExploreResources({
  currentUser,
  resources,
  users,
  loans,
  setSelectedResourceId,
  categories = [],
}: any) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    return resources.filter((resource) => {
      const matchesQuery = `${resource.title} ${resource.description}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCategory =
        category === "Todos" || resource.categoryId === category;
      const matchesStatus = status === "Todos" || resource.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [resources, query, category, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize,
  );

  function resetFilters() {
    setQuery("");
    setCategory("Todos");
    setStatus("Todos");
    setPageNumber(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Explorar recursos"
        description="Pesquisa, filtra e requisita recursos publicados por outros estudantes."
        action={
          <Button onClick={resetFilters} variant="secondary">
            Limpar filtros
          </Button>
        }
      />
      <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,50%)_minmax(0,23%)_minmax(0,23%)]">
          <TextInput
            placeholder="Pesquisar por título ou descrição..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPageNumber(1);
            }}
          />
          <SelectInput
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPageNumber(1);
            }}
          >
            <option>Todos</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </SelectInput>
          <SelectInput
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPageNumber(1);
            }}
          >
            {availability.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </SelectInput>
        </div>
      </div>
      {paginated.length === 0 ? (
        <EmptyState
          title="Nenhum recurso encontrado"
          description="Tenta remover filtros ou pesquisar por outra palavra-chave."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {paginated.map((resource) => {
            const owner = users.find((user) => user.id === resource.ownerId);
            const hasOpenLoan = loans.some(
              (loan) =>
                loan.resourceId === resource.id &&
                loan.borrowerId === currentUser.id &&
                ["Pendente", "Activa"].includes(loan.status),
            );
            return (
              <ResourceCard
                key={resource.id}
                resource={resource}
                owner={owner}
                canRequest={
                  resource.ownerId !== currentUser.id &&
                  resource.status === "Disponível" &&
                  !hasOpenLoan
                }
                onOpen={setSelectedResourceId}
              />
            );
          })}
        </div>
      )}
      <div className="flex items-center justify-between rounded-3xl border border-emerald-100 bg-white p-4">
        <p className="text-sm font-semibold text-slate-500">
          Página {pageNumber} de {totalPages} • {filtered.length} resultado(s)
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled={pageNumber === 1}
            onClick={() => setPageNumber((n) => Math.max(1, n - 1))}
          >
            Anterior
          </Button>
          <Button
            variant="secondary"
            disabled={pageNumber === totalPages}
            onClick={() => setPageNumber((n) => Math.min(totalPages, n + 1))}
          >
            Seguinte
          </Button>
        </div>
      </div>
    </div>
  );
}
