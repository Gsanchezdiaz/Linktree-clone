import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen hero-glow flex items-center justify-center px-6">
      <div className="w-full max-w-md card text-center">
        <h1 className="text-5xl font-extrabold mb-4">404</h1>
        <p className="text-xl font-semibold mb-2">Usuario no encontrado</p>
        <p className="text-gray-500 mb-8">El perfil que buscas no existe.</p>
        <Link href="/" className="inline-block py-3 px-6 rounded-full font-semibold transition-all hover:shadow-lg hover:scale-105" style={{ backgroundColor: "var(--cta-yellow)", color: "#000" }}>
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
