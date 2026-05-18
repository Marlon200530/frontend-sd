import {
  BookOpen,
  Cable,
  Calculator,
  Eye,
  FileText,
  FlaskConical,
  Headphones,
  LibraryBig,
  Monitor,
  MapPin,
  Network,
  NotebookText,
  PackageOpen,
  Ruler,
  Sprout,
} from "lucide-react";
import { formatDateTime } from "../utils/format";
const iconMap = {
  book: BookOpen,
  notes: NotebookText,
  calculator: Calculator,
  equipment: Cable,
  laptop: PackageOpen,
  computer: Monitor,
  headphones: Headphones,
  ruler: Ruler,
  lab: FlaskConical,
  network: Network,
  file: FileText,
  default: LibraryBig,
};

export function isImageSource(value?: string) {
  return Boolean(
    value?.startsWith("data:image") ||
      value?.startsWith("http://") ||
      value?.startsWith("https://") ||
      value?.startsWith("blob:"),
  );
}

export function ResourceIcon({
  type,
  className = "h-8 w-8",
}: {
  type: string;
  className?: string;
}) {
  if (isImageSource(type)) {
    return (
      <img
        src={type}
        alt=""
        className={`${className} rounded-xl object-cover`}
      />
    );
  }

  const Icon = iconMap[type as keyof typeof iconMap] || iconMap.default;
  return <Icon className={className} strokeWidth={1.8} />;
}

export function UserAvatar({
  user,
  className = "h-11 w-11",
}: {
  user: any;
  className?: string;
}) {
  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "UT";

  if (isImageSource(user?.photo)) {
    return (
      <img
        src={user.photo}
        alt={user.name || "Utilizador"}
        className={`${className} rounded-xl object-cover`}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center rounded-xl bg-emerald-700 font-black text-white`}
    >
      {user?.photo || initials}
    </div>
  );
}

export function IconBubble({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100 ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  variant = "green",
}: {
  children: React.ReactNode;
  variant?: "green" | "dark" | "amber" | "red" | "grey";
}) {
  const variants = {
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dark: "bg-emerald-900 text-white border-emerald-900",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    red: "bg-red-100 text-red-700 border-red-200",
    grey: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "danger" | "muted";
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    primary:
      "bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm shadow-emerald-700/20",
    secondary:
      "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50",
    ghost: "bg-transparent text-emerald-800 hover:bg-emerald-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    muted: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold leading-tight transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-xs font-medium text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-base outline-none ring-0 transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:text-sm ${props.className || ""}`}
    />
  );
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`min-w-0 w-full max-w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-base outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:text-sm ${props.className || ""}`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-base outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:text-sm ${props.className || ""}`}
    />
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-emerald-200 bg-white p-6 text-center sm:p-10">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Sprout className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ResourceCard({ resource, owner, onOpen, canRequest }: any) {
  const hasPhoto = isImageSource(resource.image);
  const displayOwner = owner || resource.owner;

  return (
    <div className="animate-card-enter group flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/10">
      <div className="relative h-44 overflow-hidden bg-emerald-50 sm:h-52">
        {hasPhoto ? (
          <img
            src={resource.image}
            alt={resource.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-emerald-800">
            <ResourceIcon type={resource.image} className="h-16 w-16 sm:h-20 sm:w-20" />
          </div>
        )}
        <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
          <Badge variant={resource.status === "Disponível" ? "green" : "amber"}>
            {resource.status}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="grey">{resource.category}</Badge>
        </div>
        <h3 className="mt-3 text-base font-extrabold leading-snug text-slate-900 sm:text-lg">
          {resource.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
          {resource.description}
        </p>
        <div className="mt-5 rounded-2xl bg-emerald-50/80 p-3 text-xs text-emerald-950 ring-1 ring-emerald-100">
          <p>
            <strong>Partilhado por:</strong>{" "}
            {displayOwner?.name || "Utilizador"}
          </p>
          <p>
            <strong>Visível desde:</strong> {formatDateTime(resource.createdAt)}
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
            <MapPin className="h-3.5 w-3.5" /> {resource.location}
          </span>
          <Button
            variant={canRequest ? "primary" : "secondary"}
            onClick={() => onOpen(resource.id)}
            className="w-full sm:w-auto"
          >
            <Eye className="h-4 w-4" /> Ver detalhe
          </Button>
        </div>
      </div>
    </div>
  );
}


export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`skeleton-shimmer rounded-2xl bg-slate-100 ${className}`}
      aria-hidden="true"
    />
  );
}

export function ResourceCardSkeleton() {
  return (
    <div className="animate-card-enter overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
      <SkeletonBlock className="h-52 rounded-none" />
      <div className="space-y-4 p-5">
        <SkeletonBlock className="h-6 w-24" />
        <SkeletonBlock className="h-7 w-4/5" />
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-11/12" />
          <SkeletonBlock className="h-4 w-2/3" />
        </div>
        <div className="rounded-3xl bg-emerald-50/70 p-3">
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="mt-2 h-4 w-1/2" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <SkeletonBlock className="h-5 w-32" />
          <SkeletonBlock className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}

export function AppLoadingSkeleton() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <SkeletonBlock className="h-9 w-64 max-w-full" />
            <SkeletonBlock className="h-4 w-96 max-w-full" />
          </div>
          <SkeletonBlock className="h-11 w-40" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="animate-card-enter rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-9 w-9" />
            </div>
            <SkeletonBlock className="mt-4 h-9 w-16" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} style={{ animationDelay: `${index * 80}ms` }}>
            <ResourceCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}


export function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="animate-card-enter rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-900/5 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-500">{title}</p>
        <span className="text-emerald-700">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-black text-emerald-800 sm:text-3xl">{value}</p>
    </div>
  );
}


export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}


export function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-emerald-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
        {label}
      </p>
      <p className="mt-1 font-bold text-slate-900">{value}</p>
    </div>
  );
}


