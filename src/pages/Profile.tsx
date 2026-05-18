import { useRef, useState } from "react";
import { BookOpen, Repeat2, Star, Trash2, Upload } from "lucide-react";
import { Badge, Button, Field, PageHeader, StatCard, TextInput, UserAvatar } from "../components/common";
import { passwordChangeSchema, profileSchema, zodErrors } from "../utils/validation";

export function Profile({ currentUser, resources, loans, onUpdate, onPassword, onPhoto, isUpdatingPhoto }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState({
    name: currentUser.name,
    contact: currentUser.contact,
    email: currentUser.email,
    photo: currentUser.photo,
  });
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileErrors, setProfileErrors] = useState<any>({});
  const [passwordErrors, setPasswordErrors] = useState<any>({});
  const [photoPreview, setPhotoPreview] = useState(currentUser.photo);
  const myResources = resources.filter(
    (item) => item.ownerId === currentUser.id,
  );
  const myLoans = loans.filter((item) => item.borrowerId === currentUser.id);

  function submitProfile(event) {
    event.preventDefault();
    const result = profileSchema.safeParse(profile);
    const nextErrors = result.success ? {} : zodErrors(result.error);
    setProfileErrors(nextErrors);
    if (!result.success) return;
    onUpdate({
      name: result.data.name,
      contact: result.data.contact || undefined,
    });
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function handlePhotoUpload(event) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    onPhoto(file);
    event.target.value = "";
  }

  function removePhoto() {
    setPhotoPreview(getInitials(profile.name || currentUser.name));
    onUpdate({ photoUrl: null });
  }

  function submitPassword(event) {
    event.preventDefault();
    const result = passwordChangeSchema.safeParse(password);
    const nextErrors = result.success ? {} : zodErrors(result.error);
    setPasswordErrors(nextErrors);
    if (!result.success) return;
    onPassword(result.data.oldPassword, result.data.newPassword);
    setPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Perfil do utilizador"
        description="Actualiza os teus dados e acompanha as tuas estatísticas de partilha."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-6">
          <h3 className="text-lg font-black">Dados pessoais</h3>
          <form
            onSubmit={submitProfile}
            className="mt-5 grid gap-4 sm:grid-cols-2"
          >
            <Field label="Nome completo" error={profileErrors.name}>
              <TextInput
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </Field>
            <Field label="Contacto" error={profileErrors.contact}>
              <TextInput
                value={profile.contact}
                onChange={(e) =>
                  setProfile({ ...profile, contact: e.target.value })
                }
              />
            </Field>
            <Field label="Email institucional">
              <TextInput
                value={profile.email}
                readOnly
                className="bg-slate-50 text-slate-500"
              />
            </Field>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Guardar perfil
              </Button>
            </div>
          </form>
          <div className="mt-8 border-t border-emerald-100 pt-6">
            <h3 className="text-lg font-black">Alterar palavra-passe</h3>
            <form
              onSubmit={submitPassword}
              className="mt-5 grid gap-4 sm:grid-cols-2"
            >
              <Field label="Palavra-passe actual" error={passwordErrors.oldPassword}>
                <TextInput
                  type="password"
                  value={password.oldPassword}
                  onChange={(e) =>
                    setPassword({ ...password, oldPassword: e.target.value })
                  }
                />
              </Field>
              <Field label="Nova palavra-passe" error={passwordErrors.newPassword}>
                <TextInput
                  type="password"
                  value={password.newPassword}
                  onChange={(e) =>
                    setPassword({ ...password, newPassword: e.target.value })
                  }
                />
              </Field>
              <Field label="Confirmar nova palavra-passe" error={passwordErrors.confirmPassword}>
                <TextInput
                  type="password"
                  value={password.confirmPassword}
                  onChange={(e) =>
                    setPassword({ ...password, confirmPassword: e.target.value })
                  }
                />
              </Field>
              <div className="sm:col-span-2">
                <Button type="submit">Alterar palavra-passe</Button>
              </div>
            </form>
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 text-center shadow-sm sm:p-6">
            <UserAvatar
              user={{ ...currentUser, ...profile, photo: photoPreview }}
              className="mx-auto h-24 w-24 text-2xl"
            />
            <h3 className="mt-4 break-words text-lg font-black sm:text-xl">{profile.name}</h3>
            <p className="break-all text-sm text-slate-500">{profile.email}</p>
            <Badge variant="green">
              {currentUser.role === "admin" ? "Administrador" : "Estudante"}
            </Badge>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <div className="mt-5 grid gap-2">
              <Button
                variant="secondary"
                className="w-full"
                disabled={isUpdatingPhoto}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" /> {isUpdatingPhoto ? "A enviar..." : "Alterar imagem"}
              </Button>
              {currentUser.photoUrl && (
                <Button variant="muted" className="w-full" onClick={removePhoto}>
                  <Trash2 className="h-4 w-4" /> Remover imagem
                </Button>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <StatCard
              title="Recursos partilhados"
              value={myResources.length}
              icon={<BookOpen className="h-6 w-6" />}
            />
            <StatCard
              title="Requisições feitas"
              value={myLoans.length}
              icon={<Repeat2 className="h-6 w-6" />}
            />
            <StatCard title="Avaliação média" value="4.8" icon={<Star className="h-6 w-6" />} />
          </div>
        </aside>
      </div>
    </div>
  );
}





