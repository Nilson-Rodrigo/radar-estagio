export default function Sidebar() {
  return (
    <aside className="w-64 bg-green-700 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-10">
        Radar de Estágios
      </h2>

      <nav className="flex flex-col gap-4">
        <button className="text-left hover:bg-blue-600 p-3 rounded-lg">
          Dashboard
        </button>

        <button className="text-left hover:bg-blue-600 p-3 rounded-lg">
          Cadastrar vaga
        </button>

        <button className="text-left hover:bg-blue-600 p-3 rounded-lg">
          Vagas
        </button>

        <button className="text-left hover:bg-blue-600 p-3 rounded-lg">
          Sair
        </button>
      </nav>
    </aside>
  );
}