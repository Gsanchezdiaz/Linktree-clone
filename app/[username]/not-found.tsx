import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl border p-8 text-center" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-subtle)" }}>
        <h1 className="text-5xl font-extrabold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-2">Usuario no encontrado</p>
        <p className="text-gray-500 mb-6">El perfil que buscas no existe.</p>
        <Link href="/" className="inline-block py-3 px-6 rounded-full font-semibold" style={{ backgroundColor: "var(--cta-yellow)", color: "#000" }}>
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
