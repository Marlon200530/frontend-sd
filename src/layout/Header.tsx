import { Bell, Hand, Menu } from "lucide-react";
import { APP_TAGLINE } from "../data/mockData";
import { UserAvatar } from "../components/common";

export function Topbar({
  currentUser,
  unread,
  openNotifications,
  openMenu,
}: any) {
  return (
    <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={openMenu}
            className="rounded-xl border border-emerald-100 bg-white p-2 text-emerald-800 shadow-sm lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-emerald-700 sm:text-sm">
            {APP_TAGLINE}
          </p>
          <h1 className="truncate text-lg font-black text-slate-900 sm:text-xl">
            Olá, {currentUser.name.split(" ")[0]}{" "}
            <Hand className="inline h-5 w-5 text-emerald-700" />
          </h1>
          </div>
        </div>
        <div className="relative flex items-center gap-3">
          <button
            onClick={openNotifications}
            className="relative rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 sm:px-4"
            aria-label="Abrir notificações"
          >
            <span className="inline-flex items-center gap-2">
              <Bell className="h-4 w-4" />
            </span>
            {unread > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-0.5 text-xs leading-none text-white">
                {unread}
              </span>
            )}
          </button>
          <UserAvatar user={currentUser} className="hidden h-10 w-10 text-sm sm:flex" />
        </div>
      </div>
    </header>
  );
}
