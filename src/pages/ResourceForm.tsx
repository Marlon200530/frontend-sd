import { useRef, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import {
  Button,
  EmptyState,
  Field,
  isImageSource,
  PageHeader,
  SelectInput,
  TextArea,
  TextInput,
} from "../components/common";
import { CONDITION_LABEL, DEFAULT_CONDITION } from "../services/platform.service";
import { resourceFormSchema, zodErrors } from "../utils/validation";

export function ResourceForm({ mode, resource, onSubmit, onCancel, categories = [], isSubmitting = false }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstCategoryId = categories[0]?.id || resource?.categoryId || "";
  const [form, setForm] = useState({
    title: resource?.title || "",
    description: resource?.description || "",
    categoryId: resource?.categoryId || firstCategoryId,
    condition: resource?.condition || DEFAULT_CONDITION,
    location: resource?.location || "",
    image: resource?.image || "book",
    imageFile: null,
  });
  const [errors, setErrors] = useState<any>({});

  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, image: "Escolhe um ficheiro de imagem válido." });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, image: reader.result, imageFile: file }));
      setErrors((current) => ({ ...current, image: null }));
    };
    reader.readAsDataURL(file);
  }

  function submit(event) {
    event.preventDefault();
    const result = resourceFormSchema.safeParse(form);
    const nextErrors = result.success ? {} : zodErrors(result.error);
    setErrors(nextErrors);
    if (result.success && !isSubmitting) {
      onSubmit({
        title: result.data.title,
        description: result.data.description,
        categoryId: result.data.categoryId,
        condition: result.data.condition,
        location: result.data.location,
        image: form.imageFile,
      });
    }
  }

  if (mode === "edit" && !resource) {
    return (
      <EmptyState
        title="Recurso não encontrado"
        description="O recurso que tentaste editar já não existe."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={mode === "create" ? "Publicar recurso" : "Editar recurso"}
        description="Preenche os dados principais e adiciona uma imagem para ajudar outros estudantes a reconhecerem o recurso."
      />
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,62%)_minmax(280px,1fr)]">
        <section className="rounded-4xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Título do recurso" error={errors.title}>
              <TextInput
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex.: Manual de Redes"
              />
            </Field>
            <Field label="Categoria" error={errors.categoryId}>
              <SelectInput
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Condição">
              <SelectInput
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
              >
                {Object.entries(CONDITION_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Local de entrega" error={errors.location}>
              <TextInput
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Ex.: Biblioteca central"
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Descrição" error={errors.description}>
                <TextArea
                  rows={6}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Explica o conteúdo, utilidade e condições de uso do recurso."
                />
              </Field>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "A guardar..."
                : mode === "create"
                  ? "Publicar recurso"
                  : "Guardar alterações"}
            </Button>
            <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
          </div>
        </section>

        <aside className="rounded-4xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900">
            Imagem do recurso
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Envia uma fotografia clara do recurso para aparecer na listagem e no
            detalhe.
          </p>
          <div className="mt-5 flex h-48 items-center justify-center overflow-hidden rounded-4xl bg-emerald-50 text-emerald-800">
            {isImageSource(form.image) ? (
              <img
                src={form.image}
                alt="Pré-visualização do recurso"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center">
                <ImagePlus className="mx-auto h-14 w-14" />
                <p className="mt-2 text-sm font-bold">Sem imagem enviada</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          {errors.image && (
            <p className="mt-2 text-xs font-medium text-red-600">
              {errors.image}
            </p>
          )}
          <Button
            variant="secondary"
            className="mt-5 w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" /> Escolher imagem
          </Button>
          <div className="mt-6 rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-black">Pré-visualização</p>
            <p className="mt-2">
              Quando publicares, todos verão: título, categoria,
              disponibilidade, local, quem partilhou e data de publicação.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
