import { Leaf } from "lucide-react";
import { APP_NAME } from "../data/mockData";
export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm shadow-emerald-700/20 sm:h-11 sm:w-11">
        <Leaf className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
      <div>
        <p className="text-lg font-black text-emerald-950 sm:text-xl">
          {APP_NAME}
        </p>
        <p className="text-xs font-semibold text-emerald-700">
          Recursos Estudantis
        </p>
      </div>
    </div>
  );
}

