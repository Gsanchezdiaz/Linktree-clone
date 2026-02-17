import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen hero-glow flex items-center justify-center px-6">
      <div className="w-full max-w-md card text-center">
        <h1 className="text-6xl font-extrabold mb-4" style={{ color: "var(--text-primary)" }}>
          404
        </h1>
        <p className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          Página no encontrada
        </p>
        <p className="text-gray-500 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-block py-3 px-8 rounded-full font-semibold transition-all hover:shadow-lg hover:scale-105"
          style={{ backgroundColor: "var(--cta-yellow)", color: "#000" }}
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
