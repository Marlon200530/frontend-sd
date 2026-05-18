import { useState } from "react";
import { BookOpen, EyeOff, FolderPlus, Repeat2, Users } from "lucide-react";
import { formatDateTime } from "../utils/format";
import {
  Badge,
  Button,
  Field,
  PageHeader,
  ResourceIcon,
  SkeletonBlock,
  StatCard,
  TextArea,
  TextInput,
} from "../components/common";
import { categoryFormSchema, zodErrors } from "../utils/validation";

export function AdminPanel({
  users,
  resources,
  loans,
  categories = [],
  categoriesLoading = false,
  getUser,
  onToggleUser,
  onModerate,
  onExport,
  onCreateCategory,
  onUpdateCategory,
  isSavingCategory = false,
}: any) {
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [categoryErrors, setCategoryErrors] = useState<any>({});

  function resetCategoryForm() {
    setEditingCategoryId(null);
    setCategoryForm({ name: "", description: "", isActive: true });
    setCategoryErrors({});
  }

  function editCategory(category) {
    setEditingCategoryId(category.id);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      isActive: category.active,
    });
    setCategoryErrors({});
  }

  function submitCategory(event) {
    event.preventDefault();
    const result = categoryFormSchema.safeParse(categoryForm);
    const nextErrors = result.success ? {} : zodErrors(result.error);
    setCategoryErrors(nextErrors);
    if (!result.success || isSavingCategory) return;

    if (editingCategoryId) {
      onUpdateCategory(editingCategoryId, result.data);
    } else {
      onCreateCategory(result.data);
    }

    resetCategoryForm();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Painel de administração"
        description="Gestão geral da plataforma: utilizadores, recursos, requisições e relatórios."
        action={<Button onClick={onExport}>Exportar CSV</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Utilizadores" value={users.length} icon={<Users className="h-6 w-6" />} />
        <StatCard title="Recursos" value={resources.length} icon={<BookOpen className="h-6 w-6" />} />
        <StatCard
          title="Requisições activas"
          value={loans.filter((loan) => loan.status === "Activa").length}
          icon={<Repeat2 className="h-6 w-6" />}
        />
        <StatCard
          title="Ocultos"
          value={resources.filter((resource) => !resource.visible).length}
          icon={<EyeOff className="h-6 w-6" />}
        />
      </div>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,40%)_minmax(0,60%)]">
        <form
          onSubmit={submitCategory}
          className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <FolderPlus className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-black">
                {editingCategoryId ? "Editar categoria" : "Nova categoria"}
              </h3>
              <p className="text-sm text-slate-500">
                Controla as opções usadas na publicação de recursos.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <Field label="Nome da categoria" error={categoryErrors.name}>
              <TextInput
                value={categoryForm.name}
                onChange={(event) =>
                  setCategoryForm({ ...categoryForm, name: event.target.value })
                }
                placeholder="Ex.: Laboratório"
              />
            </Field>
            <Field label="Descrição" error={categoryErrors.description}>
              <TextArea
                rows={3}
                value={categoryForm.description}
                onChange={(event) =>
                  setCategoryForm({
                    ...categoryForm,
                    description: event.target.value,
                  })
                }
                placeholder="Breve descrição para uso interno."
              />
            </Field>
            <label className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm font-bold text-emerald-900">
              Categoria activa
              <input
                type="checkbox"
                checked={categoryForm.isActive}
                onChange={(event) =>
                  setCategoryForm({
                    ...categoryForm,
                    isActive: event.target.checked,
                  })
                }
                className="h-5 w-5 accent-emerald-700"
              />
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button type="submit" disabled={isSavingCategory} className="w-full sm:w-auto">
                {isSavingCategory
                  ? "A guardar..."
                  : editingCategoryId
                    ? "Guardar categoria"
                    : "Criar categoria"}
              </Button>
              {editingCategoryId && (
                <Button variant="secondary" onClick={resetCategoryForm} className="w-full sm:w-auto">
                  Cancelar edição
                </Button>
              )}
            </div>
          </div>
        </form>
        <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
          <div className="border-b border-emerald-100 p-5">
            <h3 className="text-lg font-black">Categorias</h3>
          </div>
          {categoriesLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-emerald-50 text-xs uppercase text-emerald-800">
                  <tr>
                    <th className="w-2/5 px-5 py-4">Nome</th>
                    <th className="w-2/5 px-5 py-4">Descrição</th>
                    <th className="w-1/5 px-5 py-4">Estado</th>
                    <th className="px-5 py-4">Acção</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-5 py-4 font-black text-slate-900">
                        {category.name}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {category.description || "Sem descrição"}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={category.active ? "green" : "red"}>
                          {category.active ? "Activa" : "Inactiva"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Button
                          variant="secondary"
                          onClick={() => editCategory(category)}
                        >
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
          <div className="border-b border-emerald-100 p-5">
            <h3 className="text-lg font-black">Gestão de utilizadores</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-emerald-50 text-xs uppercase text-emerald-800">
                <tr>
                  <th className="px-5 py-4">Nome</th>
                  <th className="px-5 py-4">Papel</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Acção</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4">
                      <p className="font-black">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      {user.role === "admin" ? "Administrador" : "Estudante"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={user.active ? "green" : "red"}>
                        {user.active ? "Activo" : "Desactivado"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Button
                        variant="secondary"
                        onClick={() => onToggleUser(user.id)}
                      >
                        {user.active ? "Desactivar" : "Activar"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
          <div className="border-b border-emerald-100 p-5">
            <h3 className="text-lg font-black">Moderação de recursos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-emerald-50 text-xs uppercase text-emerald-800">
                <tr>
                  <th className="px-5 py-4">Recurso</th>
                  <th className="px-5 py-4">Partilhado por</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Acção</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {resources.map((resource) => (
                  <tr key={resource.id}>
                    <td className="px-5 py-4">
                      <p className="flex items-center gap-2 font-black">
                        <ResourceIcon type={resource.image} className="h-4 w-4 text-emerald-700" />
                        {resource.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        Publicado em {formatDateTime(resource.createdAt)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {getUser(resource.ownerId)?.name || resource.owner?.name || "Utilizador"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={resource.visible ? "green" : "red"}>
                        {resource.visible ? "Visível" : "Oculto"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Button
                        variant="secondary"
                        onClick={() => onModerate(resource.id)}
                      >
                        {resource.visible ? "Ocultar" : "Mostrar"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
