import {
  BookOpen,
  Bell,
  Home,
  LogOut,
  Plus,
  Repeat2,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import { UserAvatar } from "../components/common";
import { Logo } from "./Logo";

export function Sidebar({ currentUser, page, setPage, logout }: any) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "explore", label: "Explorar recursos", icon: Search },
    { id: "new-resource", label: "Publicar recurso", icon: Plus },
    { id: "my-resources", label: "Meus recursos", icon: BookOpen },
    { id: "loans", label: "Minhas requisições", icon: Repeat2 },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "profile", label: "Perfil", icon: User },
    ...(currentUser.role === "admin"
      ? [{ id: "admin", label: "Administração", icon: ShieldCheck }]
      : []),
  ];

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-emerald-100 bg-white p-4 sm:p-5">
      <Logo />
      <nav className="mt-7 flex-1 space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-bold transition ${page === item.id ? "bg-emerald-700 text-white shadow-sm shadow-emerald-700/20" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"}`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
          Sessão activa
        </p>
        <div className="mt-3 flex items-center gap-3">
          <UserAvatar user={currentUser} className="h-11 w-11 text-sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-slate-900">
              {currentUser.name}
            </p>
            <p className="text-xs text-slate-500">
              {currentUser.role === "admin" ? "Administrador" : "Estudante"}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-emerald-200 bg-white p-2 text-emerald-800 transition hover:bg-emerald-100"
            aria-label="Sair"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
