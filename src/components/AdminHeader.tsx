import Badge from "../shared/ui/Badge";
import Button from "../shared/ui/Button";

type AdminHeaderProps = {
  onNovaVaga: () => void;
};

export default function AdminHeader({ onNovaVaga }: AdminHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[#d8eadf] bg-[#f7fbf8] px-6 py-5 shadow-sm sm:px-8 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-3">
        <Badge variant="neutral" className="border-[#d2e5d8] bg-white text-slate-800 shadow-sm">
          Painel administrativo
        </Badge>

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Painel do Administrador
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Gerencie vagas, ajuste informações e publique novas oportunidades em uma interface simples e familiar.
          </p>
        </div>
      </div>

      <Button
        onClick={onNovaVaga}
        size="lg"
        className="w-full border border-[#c9ddd2] bg-white text-slate-900 shadow-none hover:bg-[#f6fbf7] lg:w-auto"
      >
        + Nova vaga
      </Button>
    </div>
  );
}