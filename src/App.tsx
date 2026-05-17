import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { formatDateTime } from "./utils/format";
import { AppLoadingSkeleton, EmptyState } from "./components/common";
import { Toast } from "./components/Toast";
import { AuthenticatedLayout } from "./layout/AuthenticatedLayout";
import { PublicShell } from "./layout/PublicShell";
import { AdminPanel } from "./pages/AdminPanel";
import { Dashboard } from "./pages/Dashboard";
import { ExploreResources } from "./pages/ExploreResources";
import { MyLoans } from "./pages/MyLoans";
import { MyResources } from "./pages/MyResources";
import { NotificationsPage } from "./pages/NotificationsPage";
import { Profile } from "./pages/Profile";
import { ResourceDetail } from "./pages/ResourceDetail";
import { ResourceForm } from "./pages/ResourceForm";
import { useLogout, useMe } from "./hooks/useAuth";
import { getAccessToken } from "./utils/token";
import type { ApiErrorResponse } from "./types/api";
import {
  changePassword as changePasswordRequest,
  approveLoan as approveLoanRequest,
  createCategory as createCategoryRequest,
  createNotificationsEventSource,
  createLoan,
  createResource,
  deleteResource as deleteResourceRequest,
  listAllCategories,
  listCategories,
  listLoans,
  listNotifications,
  listResources,
  listUsers,
  markAllNotificationsRead,
  moderateResource as moderateResourceRequest,
  normalizeUser,
  returnLoan as returnLoanRequest,
  rejectLoan as rejectLoanRequest,
  updateMe,
  updateCategory as updateCategoryRequest,
  updateProfilePhoto as updateProfilePhotoRequest,
  updateResource as updateResourceRequest,
  updateUserStatus,
} from "./services/platform.service";

function getApiMessage(error: unknown, fallback: string) {
  const apiError = error as AxiosError<ApiErrorResponse>;
  return apiError?.response?.data?.error?.message || fallback;
}

export default function NhluvukoApp() {
  const queryClient = useQueryClient();
  const meQuery = useMe();
  const logoutMutation = useLogout();

  const [authView, setAuthView] = useState("landing");
  const [page, setPage] = useState("dashboard");
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(
    null,
  );
  const [editingResourceId, setEditingResourceId] = useState<string | null>(
    null,
  );
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null,
  );

  const currentUser = useMemo(
    () => normalizeUser(meQuery.data),
    [meQuery.data],
  );
  const isAuthenticated = Boolean(currentUser);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });

  const adminCategoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: listAllCategories,
    enabled: currentUser?.role === "admin",
  });

  const resourcesQuery = useQuery({
    queryKey: ["resources", categoriesQuery.data],
    queryFn: () => listResources(categoriesQuery.data || []),
    enabled: Boolean(categoriesQuery.data),
  });

  const loansQuery = useQuery({
    queryKey: ["loans"],
    queryFn: listLoans,
    enabled: isAuthenticated,
  });

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: listNotifications,
    enabled: isAuthenticated,
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
    enabled: currentUser?.role === "admin",
  });

  const categories = useMemo(
    () => categoriesQuery.data || [],
    [categoriesQuery.data],
  );
  const adminCategories = useMemo(
    () => adminCategoriesQuery.data || [],
    [adminCategoriesQuery.data],
  );
  const resources = useMemo(
    () => resourcesQuery.data || [],
    [resourcesQuery.data],
  );
  const loans = useMemo(() => loansQuery.data || [], [loansQuery.data]);
  const notifications = useMemo(
    () => notificationsQuery.data || [],
    [notificationsQuery.data],
  );
  const users = useMemo(() => {
    const byId = new Map();
    if (currentUser) byId.set(currentUser.id, currentUser);
    resources.forEach((resource: any) => {
      if (resource.owner) byId.set(resource.owner.id, resource.owner);
    });
    (usersQuery.data || []).forEach((user) => byId.set(user.id, user));
    return [...byId.values()];
  }, [currentUser, resources, usersQuery.data]);

  const visibleResources = useMemo(
    () => resources.filter((resource: any) => resource.visible),
    [resources],
  );
  const selectedResource = selectedResourceId
    ? resources.find((resource: any) => resource.id === selectedResourceId)
    : null;
  const unreadNotifications = notifications.filter((item: any) => !item.read);

  function invalidatePlatform() {
    queryClient.invalidateQueries({ queryKey: ["resources"] });
    queryClient.invalidateQueries({ queryKey: ["loans"] });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
  }

  function showToast(message: string, type: string = "success") {
    setToast({ message, type });
    window.clearTimeout((window as any).__nhluvukoToastTimer);
    (window as any).__nhluvukoToastTimer = window.setTimeout(
      () => setToast(null),
      3000,
    );
  }

  function getUser(userId: string) {
    return users.find((user: any) => user.id === userId);
  }

  const createResourceMutation = useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      invalidatePlatform();
      setPage("explore");
      showToast("Recurso publicado com sucesso.");
    },
    onError: (error) =>
      showToast(
        getApiMessage(error, "Não foi possível publicar o recurso."),
        "error",
      ),
  });

  const updateResourceMutation = useMutation({
    mutationFn: ({ id, payload }: any) => updateResourceRequest(id, payload),
    onSuccess: () => {
      invalidatePlatform();
      setEditingResourceId(null);
      setPage("my-resources");
      showToast("Recurso actualizado com sucesso.");
    },
    onError: (error) =>
      showToast(
        getApiMessage(error, "Não foi possível actualizar o recurso."),
        "error",
      ),
  });

  const deleteResourceMutation = useMutation({
    mutationFn: deleteResourceRequest,
    onSuccess: () => {
      invalidatePlatform();
      showToast("Recurso removido da plataforma.");
    },
    onError: (error) =>
      showToast(
        getApiMessage(error, "Não foi possível remover o recurso."),
        "error",
      ),
  });

  const requestResourceMutation = useMutation({
    mutationFn: ({ resourceId, dueDate }: any) =>
      createLoan(resourceId, dueDate),
    onSuccess: () => {
      invalidatePlatform();
      setPage("loans");
      setSelectedResourceId(null);
      showToast("Pedido enviado. Aguarda a aprovação do dono do recurso.");
    },
    onError: (error) =>
      showToast(
        getApiMessage(error, "Não foi possível requisitar o recurso."),
        "error",
      ),
  });

  const returnLoanMutation = useMutation({
    mutationFn: returnLoanRequest,
    onSuccess: () => {
      invalidatePlatform();
      showToast("Devolução actualizada.");
    },
    onError: (error) =>
      showToast(
        getApiMessage(error, "Não foi possível registar a devolução."),
        "error",
      ),
  });

  const profileMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
      invalidatePlatform();
      showToast("Perfil actualizado com sucesso.");
    },
    onError: (error) =>
      showToast(
        getApiMessage(error, "Não foi possível actualizar o perfil."),
        "error",
      ),
  });

  const profilePhotoMutation = useMutation({
    mutationFn: updateProfilePhotoRequest,
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
      invalidatePlatform();
      showToast("Foto de perfil actualizada.");
    },
    onError: (error) =>
      showToast(
        getApiMessage(error, "Não foi possível actualizar a foto."),
        "error",
      ),
  });

  const passwordMutation = useMutation({
    mutationFn: ({ oldPassword, newPassword }: any) =>
      changePasswordRequest(oldPassword, newPassword),
    onSuccess: () => showToast("Palavra-passe alterada com sucesso."),
    onError: (error) =>
      showToast(
        getApiMessage(error, "Não foi possível alterar a palavra-passe."),
        "error",
      ),
  });

  const userStatusMutation = useMutation({
    mutationFn: ({ userId, isActive }: any) =>
      updateUserStatus(userId, isActive),
    onSuccess: () => {
      invalidatePlatform();
      showToast("Estado do utilizador actualizado.");
    },
    onError: (error) =>
      showToast(
        getApiMessage(error, "Não foi possível actualizar o utilizador."),
        "error",
      ),
  });

  const moderationMutation = useMutation({
    mutationFn: ({ resourceId, visible }: any) =>
      moderateResourceRequest(resourceId, visible),
    onSuccess: () => {
      invalidatePlatform();
      showToast("Visibilidade do recurso actualizada.");
    },
    onError: (error) =>
      showToast(
        getApiMessage(error, "Não foi possível moderar o recurso."),
        "error",
      ),
  });

  const markReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markNotificationsRead = useCallback(() => {
    if (markReadMutation.isPending) return;
    if (unreadNotifications.length === 0) return;

    markReadMutation.mutate();
  }, [markReadMutation.isPending, unreadNotifications.length]);

  const approveLoanMutation = useMutation({
    mutationFn: approveLoanRequest,
    onSuccess: () => {
      invalidatePlatform();
      showToast("Requisição aprovada. O recurso ficou requisitado.");
    },
    onError: (error) =>
      showToast(
        getApiMessage(error, "Não foi possível aprovar a requisição."),
        "error",
      ),
  });

  const rejectLoanMutation = useMutation({
    mutationFn: rejectLoanRequest,
    onSuccess: () => {
      invalidatePlatform();
      showToast("Requisição rejeitada.");
    },
    onError: (error) =>
      showToast(
        getApiMessage(error, "Não foi possível rejeitar a requisição."),
        "error",
      ),
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategoryRequest,
    onSuccess: () => {
      invalidatePlatform();
      showToast("Categoria criada com sucesso.");
    },
    onError: (error) =>
      showToast(
        getApiMessage(error, "Não foi possível criar a categoria."),
        "error",
      ),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: any) => updateCategoryRequest(id, payload),
    onSuccess: () => {
      invalidatePlatform();
      showToast("Categoria actualizada.");
    },
    onError: (error) =>
      showToast(
        getApiMessage(error, "Não foi possível actualizar a categoria."),
        "error",
      ),
  });

  useEffect(() => {
    const token = getAccessToken();

    if (!currentUser || !token) {
      return;
    }

    const source = createNotificationsEventSource(token);

    source.addEventListener("notification", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    });

    return () => source.close();
  }, [currentUser, queryClient]);

  function logout() {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        setAuthView("landing");
        setSelectedResourceId(null);
        showToast("Sessão terminada com segurança.");
      },
    });
  }

  function publishResource(payload) {
    if (createResourceMutation.isPending) return;
    createResourceMutation.mutate(payload);
  }

  function updateResource(resourceId, payload) {
    if (!resourceId) return;
    if (updateResourceMutation.isPending) return;
    updateResourceMutation.mutate({ id: resourceId, payload });
  }

  function deleteResource(resourceId) {
    deleteResourceMutation.mutate(resourceId);
  }

  function requestResource(resourceId, dueDate) {
    if (requestResourceMutation.isPending) return;
    requestResourceMutation.mutate({ resourceId, dueDate });
  }

  function approveLoan(loanId) {
    approveLoanMutation.mutate(loanId);
  }

  function rejectLoan(loanId) {
    rejectLoanMutation.mutate(loanId);
  }

  function returnLoan(loanId) {
    returnLoanMutation.mutate(loanId);
  }

  function updateProfile(payload) {
    profileMutation.mutate(payload);
  }

  function changePassword(oldPassword, newPassword) {
    passwordMutation.mutate({ oldPassword, newPassword });
  }

  function updateProfilePhoto(file) {
    profilePhotoMutation.mutate(file);
  }

  function createCategory(payload) {
    createCategoryMutation.mutate(payload);
  }

  function updateCategory(id, payload) {
    updateCategoryMutation.mutate({ id, payload });
  }

  function toggleUser(userId) {
    if (userId === currentUser.id)
      return showToast("Não podes desactivar a tua própria conta.", "error");
    const user = getUser(userId);
    if (!user) return;
    userStatusMutation.mutate({ userId, isActive: !user.active });
  }

  function moderateResource(resourceId) {
    const resource = resources.find((item) => item.id === resourceId);
    if (!resource) return;
    moderationMutation.mutate({ resourceId, visible: !resource.visible });
  }

  function exportCsv() {
    const rows = [
      [
        "Titulo",
        "Categoria",
        "Disponibilidade",
        "Partilhado por",
        "Visivel desde",
        "Local",
      ],
      ...resources.map((resource) => [
        resource.title,
        resource.category,
        resource.status,
        getUser(resource.ownerId)?.name || "Utilizador",
        formatDateTime(resource.createdAt),
        resource.location,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio-nhluvuko.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Relatório CSV gerado.");
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-green-100 text-slate-900">
        <Toast toast={toast} />
        <PublicShell
          setAuthView={setAuthView}
          authView={authView}
          resources={visibleResources}
          users={users}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/60 text-slate-900">
      <Toast toast={toast} />
      <AuthenticatedLayout
        currentUser={currentUser}
        page={page}
        setPage={(next) => {
          setPage(next);
          setSelectedResourceId(null);
        }}
        logout={logout}
        unread={unreadNotifications.length}
        notifications={notifications}
        markRead={markNotificationsRead}
      >
        <main className="flex min-w-0 flex-1 flex-col">
          <section className="flex-1 p-4 sm:p-6 lg:p-8">
            {resourcesQuery.isLoading || loansQuery.isLoading ? (
              <AppLoadingSkeleton />
            ) : selectedResource ? (
              <ResourceDetail
                resource={selectedResource}
                owner={getUser(selectedResource.ownerId)}
                currentUser={currentUser}
                loans={loans}
                users={users}
                onBack={() => setSelectedResourceId(null)}
                onRequest={requestResource}
                isRequesting={requestResourceMutation.isPending}
              />
            ) : page === "dashboard" ? (
              <Dashboard
                currentUser={currentUser}
                resources={resources}
                loans={loans}
                users={users}
                setPage={setPage}
                setSelectedResourceId={setSelectedResourceId}
              />
            ) : page === "explore" ? (
              <ExploreResources
                currentUser={currentUser}
                resources={visibleResources}
                users={users}
                loans={loans}
                setSelectedResourceId={setSelectedResourceId}
                categories={categories}
              />
            ) : page === "new-resource" ? (
              <ResourceForm
                mode="create"
                categories={categories}
                isSubmitting={createResourceMutation.isPending}
                onSubmit={publishResource}
                onCancel={() => setPage("dashboard")}
              />
            ) : page === "edit-resource" ? (
              <ResourceForm
                mode="edit"
                categories={categories}
                resource={resources.find(
                  (item) => item.id === editingResourceId,
                )}
                isSubmitting={updateResourceMutation.isPending}
                onSubmit={(payload) =>
                  updateResource(editingResourceId, payload)
                }
                onCancel={() => setPage("my-resources")}
              />
            ) : page === "my-resources" ? (
              <MyResources
                currentUser={currentUser}
                resources={resources}
                loans={loans}
                users={users}
                onEdit={(id) => {
                  setEditingResourceId(id);
                  setPage("edit-resource");
                }}
                onDelete={deleteResource}
                onOpen={setSelectedResourceId}
                onReturn={returnLoan}
              />
            ) : page === "loans" ? (
              <MyLoans
                currentUser={currentUser}
                resources={resources}
                loans={loans}
                users={users}
                onReturn={returnLoan}
                onOpen={setSelectedResourceId}
              />
            ) : page === "notifications" ? (
              <NotificationsPage
                currentUser={currentUser}
                notifications={notifications}
                loans={loans}
                resources={resources}
                users={users}
                onApprove={approveLoan}
                onReject={rejectLoan}
                onReturn={returnLoan}
                onOpenResource={setSelectedResourceId}
                markRead={markNotificationsRead}
              />
            ) : page === "profile" ? (
              <Profile
                currentUser={currentUser}
                resources={resources}
                loans={loans}
                onUpdate={updateProfile}
                onPassword={changePassword}
                onPhoto={updateProfilePhoto}
                isUpdatingPhoto={profilePhotoMutation.isPending}
              />
            ) : page === "admin" && currentUser.role === "admin" ? (
              <AdminPanel
                users={users}
                resources={resources}
                loans={loans}
                getUser={getUser}
                onToggleUser={toggleUser}
                onModerate={moderateResource}
                onExport={exportCsv}
                categories={adminCategories}
                categoriesLoading={adminCategoriesQuery.isLoading}
                onCreateCategory={createCategory}
                onUpdateCategory={updateCategory}
                isSavingCategory={
                  createCategoryMutation.isPending ||
                  updateCategoryMutation.isPending
                }
              />
            ) : (
              <EmptyState
                title="Página indisponível"
                description="Esta área não está disponível para o teu nível de acesso."
              />
            )}
          </section>
        </main>
      </AuthenticatedLayout>
    </div>
  );
}
