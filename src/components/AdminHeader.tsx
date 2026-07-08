type AdminHeaderProps = {
  onNovaVaga: () => void;
};

export default function AdminHeader({ onNovaVaga }: AdminHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">
        Painel do Administrador
      </h1>

      <button
        onClick={onNovaVaga}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
      >
        + Nova vaga
      </button>
    </div>
  );
}