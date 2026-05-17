import { API_BASE_URL, api } from "../utils/api";
import type { ApiResponse } from "../types/api";

export const STATUS_LABEL = {
  available: "Disponível",
  requisitioned: "Requisitado",
  unavailable: "Indisponível",
  hidden: "Oculto",
  removed: "Removido",
};

export const STATUS_VALUE = Object.fromEntries(
  Object.entries(STATUS_LABEL).map(([value, label]) => [label, value])
);

export const LOAN_STATUS_LABEL = {
  pending: "Pendente",
  active: "Activa",
  overdue: "Expirada",
  return_pending: "Devolução pendente",
  returned: "Devolvida",
  rejected: "Rejeitada",
  cancelled: "Cancelada",
};

export const CONDITION_LABEL = {
  new: "Novo",
  like_new: "Como novo",
  very_good: "Muito bom",
  good: "Bom",
  acceptable: "Aceitável",
};

export const DEFAULT_CONDITION = "good";

const RESOURCE_STATUSES = [
  "available",
  "requisitioned",
  "unavailable",
  "hidden",
  "removed",
];

function initials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "UT"
  );
}

export function normalizeUser(user) {
  if (!user) return null;

  return {
    ...user,
    active: user.isActive,
    photo: user.photoUrl || initials(user.name),
    joinedAt: user.createdAt,
  };
}

export function normalizeCategory(category) {
  return {
    ...category,
    active: category.isActive,
  };
}

export function normalizeResource(resource, categories = []) {
  const category = categories.find((item) => item.id === resource.categoryId);
  const cover = resource.coverImage || resource.images?.find((image) => image.isCover);
  const owner = normalizeUser(resource.owner);

  return {
    ...resource,
    category: category?.name || resource.category?.name || "Sem categoria",
    status: STATUS_LABEL[resource.status] || resource.status,
    visible: resource.status !== "hidden" && resource.status !== "removed",
    image: cover?.url || "book",
    owner,
  };
}

export function normalizeLoan(loan) {
  return {
    ...loan,
    rawStatus: loan.status,
    status: LOAN_STATUS_LABEL[loan.status] || loan.status,
  };
}

export function normalizeNotification(notification) {
  return {
    ...notification,
    read: notification.isRead,
    loanId: notification.entityType === "loan" ? notification.entityId : null,
    type: notification.type,
  };
}

async function getList(path, params = {}) {
  const response = await api.get<ApiResponse<any[]>>(path, {
    params: { page: 1, limit: 100, ...params },
  });

  return response.data.data;
}

export async function listCategories() {
  const response = await api.get<ApiResponse<any[]>>("/categories", {
    params: { isActive: true },
  });

  return response.data.data.map(normalizeCategory);
}

export async function listAllCategories() {
  const response = await api.get<ApiResponse<any[]>>("/categories");

  return response.data.data.map(normalizeCategory);
}

export async function createCategory(payload) {
  const response = await api.post<ApiResponse<any>>("/categories", {
    name: payload.name,
    description: payload.description || undefined,
    isActive: payload.isActive,
  });

  return normalizeCategory(response.data.data);
}

export async function updateCategory(id, payload) {
  const response = await api.patch<ApiResponse<any>>(`/categories/${id}`, {
    name: payload.name,
    description: payload.description || undefined,
    isActive: payload.isActive,
  });

  return normalizeCategory(response.data.data);
}

export async function listResources(categories = []) {
  const lists = await Promise.all(
    RESOURCE_STATUSES.map((status) =>
      getList("/resources", { status }).catch(() => [])
    )
  );

  const byId = new Map();
  lists.flat().forEach((resource) => byId.set(resource.id, resource));

  return [...byId.values()].map((resource) =>
    normalizeResource(resource, categories)
  );
}

export async function createResource(payload) {
  const { image, category, condition, ...resourcePayload } = payload;
  const response = await api.post<ApiResponse<any>>("/resources", {
    ...resourcePayload,
    categoryId: payload.categoryId || category,
    condition: condition || DEFAULT_CONDITION,
  });

  const resource = response.data.data;

  if (image instanceof File) {
    await uploadResourceImage(resource.id, image, resource.title);
  }

  return resource;
}

export async function updateResource(id, payload) {
  const { image, category, condition, ...resourcePayload } = payload;
  const response = await api.patch<ApiResponse<any>>(`/resources/${id}`, {
    ...resourcePayload,
    categoryId: payload.categoryId || category,
    condition: condition || DEFAULT_CONDITION,
  });

  if (image instanceof File) {
    await uploadResourceImage(id, image, response.data.data.title);
  }

  return response.data.data;
}

export async function deleteResource(id) {
  await api.delete(`/resources/${id}`);
}

export async function moderateResource(id, visible) {
  const response = await api.patch<ApiResponse<any>>(`/resources/${id}/moderation`, {
    action: visible ? "restore" : "hide",
    reason: visible ? undefined : "Ocultado pelo administrador.",
  });

  return response.data.data;
}

export async function uploadResourceImage(resourceId, file, altText) {
  const formData = new FormData();
  formData.append("images", file);
  formData.append("coverIndex", "0");
  if (altText) formData.append("altText", altText);

  const response = await api.post<ApiResponse<any[]>>(
    `/resources/${resourceId}/images`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data.data;
}

export async function listLoans() {
  const response = await api.get<ApiResponse<any[]>>("/loans", {
    params: { page: 1, limit: 100 },
  });

  return response.data.data.map(normalizeLoan);
}

export async function createLoan(resourceId, dueDate) {
  const response = await api.post<ApiResponse<any>>("/loans", {
    resourceId,
    dueDate,
  });

  return normalizeLoan(response.data.data);
}

export async function returnLoan(id) {
  const response = await api.patch<ApiResponse<any>>(`/loans/${id}/return`, {});
  return normalizeLoan(response.data.data);
}

export async function approveLoan(id) {
  const response = await api.patch<ApiResponse<any>>(`/loans/${id}/approve`);
  return normalizeLoan(response.data.data);
}

export async function rejectLoan(id, reason) {
  const response = await api.patch<ApiResponse<any>>(`/loans/${id}/reject`, {
    ...(reason ? { reason } : {}),
  });
  return normalizeLoan(response.data.data);
}

export function createNotificationsEventSource(token) {
  const url = `${API_BASE_URL}/notifications/stream?token=${encodeURIComponent(token)}`;
  return new EventSource(url);
}

export async function listNotifications() {
  const response = await api.get<ApiResponse<any[]>>("/notifications", {
    params: { page: 1, limit: 100 },
  });

  return response.data.data.map(normalizeNotification);
}

export async function markAllNotificationsRead() {
  const response = await api.patch<ApiResponse<number>>("/notifications/read-all");
  return response.data.data;
}

export async function listUsers() {
  const response = await api.get<ApiResponse<any[]>>("/users", {
    params: { page: 1, limit: 100 },
  });

  return response.data.data.map(normalizeUser);
}

export async function updateMe(payload) {
  const response = await api.patch<ApiResponse<any>>("/users/me", {
    name: payload.name,
    contact: payload.contact || undefined,
    photoUrl: payload.photoUrl ?? null,
  });

  return normalizeUser(response.data.data);
}

export async function updateProfilePhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await api.patch<ApiResponse<any>>("/users/me/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return normalizeUser(response.data.data);
}

export async function changePassword(currentPassword, newPassword) {
  const response = await api.patch<ApiResponse<any>>("/users/me/password", {
    currentPassword,
    newPassword,
    confirmNewPassword: newPassword,
  });

  return response.data.data;
}

export async function updateUserStatus(id, isActive) {
  const response = await api.patch<ApiResponse<any>>(`/users/${id}/status`, {
    isActive,
  });

  return normalizeUser(response.data.data);
}
