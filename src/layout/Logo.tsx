import { Leaf } from "lucide-react";
import { APP_NAME } from "../data/mockData";
export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-700 to-lime-600 text-white shadow-lg shadow-emerald-700/20">
        <Leaf className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xl font-black tracking-tight text-emerald-950">
          {APP_NAME}
        </p>
        <p className="text-xs font-semibold text-emerald-700">
          Recursos Estudantis
        </p>
      </div>
    </div>
  );
}

