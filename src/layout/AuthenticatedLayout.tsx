import { useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Header";
export function AuthenticatedLayout({
  currentUser,
  page,
  setPage,
  logout,
  unread,
  notifications,
  markRead,
  children,
}: any) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const goTo = (next) => {
    setPage(next);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 hidden h-screen lg:block">
        <Sidebar
          currentUser={currentUser}
          page={page}
          setPage={goTo}
          logout={logout}
        />
      </div>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[86vw] transform bg-white shadow-2xl transition lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar
          currentUser={currentUser}
          page={page}
          setPage={goTo}
          logout={logout}
        />
        <div className="absolute right-4 top-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-2xl border border-emerald-100 bg-white p-2 text-emerald-800 shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          currentUser={currentUser}
          unread={unread}
          notifications={notifications}
          markRead={markRead}
          openNotifications={() => goTo("notifications")}
          openMenu={() => setMobileOpen(true)}
        />
        {children}
      </div>
    </div>
  );
}

