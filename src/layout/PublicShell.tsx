import { UserPlus } from "lucide-react";
import { Button } from "../components/common";
import { Landing } from "../pages/Landing";
import { LoginForm } from "../pages/LoginForm";
import { RegisterForm } from "../pages/RegisterForm";
import { Logo } from "./Logo";
export function PublicShell({
  authView,
  setAuthView,
  resources,
  users,
}: any) {
  return (
    <div>
      {authView === "landing" && (
        <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setAuthView("landing")}>
              Início
            </Button>
            <Button variant="secondary" onClick={() => setAuthView("login")}>
              Entrar
            </Button>
            <Button onClick={() => setAuthView("register")}>
              <UserPlus className="h-4 w-4" /> Criar conta
            </Button>
          </div>
        </header>
      )}
      <main
        className={
          authView === "landing"
            ? "mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"
            : "mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
        }
      >
        {authView === "landing" && (
          <Landing
            resources={resources.slice(0, 3)}
            users={users}
            setAuthView={setAuthView}
          />
        )}
        {authView === "login" && <LoginForm setAuthView={setAuthView} />}
        {authView === "register" && (
          <RegisterForm setAuthView={setAuthView} />
        )}
      </main>
    </div>
  );
}


