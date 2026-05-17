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
    <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={openMenu}
            className="rounded-2xl border border-emerald-100 bg-white p-2 text-emerald-800 shadow-sm lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
          <p className="text-sm font-semibold text-emerald-700">
            {APP_TAGLINE}
          </p>
          <h1 className="truncate text-xl font-black text-slate-900">
            Olá, {currentUser.name.split(" ")[0]}{" "}
            <Hand className="inline h-5 w-5 text-emerald-700" />
          </h1>
          </div>
        </div>
        <div className="relative flex items-center gap-3">
          <button
            onClick={openNotifications}
            className="relative rounded-2xl border border-emerald-100 bg-white px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
          >
            <span className="inline-flex items-center gap-2">
              <Bell className="h-4 w-4" />
            </span>
            {unread > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
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
