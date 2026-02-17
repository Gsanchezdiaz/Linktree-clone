import { SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Trash2, Link as LinkIcon } from "lucide-react";
import prisma from "../lib/prisma";
import { claimUsername, addLink, deleteLink } from "./actions";

export default async function Page() {
  const authUser = await currentUser();

  // Not signed in -> show call to sign in
  if (!authUser) {
    return (
      <main className="min-h-screen hero-glow flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl space-y-6">
          {/* Main Hero Card */}
          <div className="card text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: "var(--cta-yellow)" }}>
                <span className="text-4xl">🔗</span>
              </div>
            </div>
            <h1 className="text-5xl font-extrabold mb-4">Tu Linktree Personal</h1>
            <p className="text-lg text-gray-600 mb-2">Comparte todos tus links en un único lugar</p>
            <p className="text-gray-500 mb-8">Crea tu perfil público y administra tus links de forma simple y elegante.</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card text-center p-6">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">Rápido</h3>
              <p className="text-sm text-gray-500">Crea tu perfil en segundos y comparte tus links al instante.</p>
            </div>
            <div className="card text-center p-6">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-semibold mb-2">Simple</h3>
              <p className="text-sm text-gray-500">Interfaz intuitiva y fácil de usar, sin complicaciones.</p>
            </div>
            <div className="card text-center p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2">Efectivo</h3>
              <p className="text-sm text-gray-500">Comparte tu perfil y conecta con tu audiencia.</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="card text-center">
            <h2 className="text-2xl font-semibold mb-4">¿Listo para empezar?</h2>
            <p className="text-gray-500 mb-6">Inicia sesión con tu cuenta para crear tu perfil.</p>
            <div className="flex justify-center">
              <SignInButton />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8">
            <p className="text-sm text-gray-500">
              ¿Ya tienes cuenta?{" "}
              <a href="/dashboard" className="font-semibold text-black hover:underline">
                Accede aquí
              </a>
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Safe email extraction from Clerk user
  const email = authUser.emailAddresses?.[0]?.emailAddress ?? authUser.primaryEmailAddress?.emailAddress ?? undefined;

  const dbUser = await prisma.user.findUnique({
    where: { email },
    include: { links: { orderBy: { createdAt: "desc" } } },
  });

  // If user is signed in but hasn't claimed a username/profile yet
  if (!dbUser) {
    return (
      <main className="min-h-screen hero-glow flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg card">
          <h2 className="text-2xl font-semibold">¡Bienvenido!</h2>
          <p className="mt-2 text-gray-500">Elige un username para tu perfil público.</p>

          <form action={claimUsername} className="mt-6 flex flex-col gap-3">
            <input name="username" placeholder="Tu username (ej: juan)" className="w-full px-4 py-3 rounded-xl border" style={{ borderColor: "var(--border-subtle)" }} required />
            <input name="name" placeholder="Tu nombre (opcional)" className="w-full px-4 py-3 rounded-xl border" style={{ borderColor: "var(--border-subtle)" }} />
            <button type="submit" className="mt-2 w-full py-4 rounded-full font-semibold" style={{ backgroundColor: "var(--cta-yellow)", color: "#000" }}>Reclamar username</button>
          </form>
        </div>
      </main>
    );
  }

  // Signed in and has a db profile -> dashboard
  return (
    <main className="min-h-screen flex items-start justify-center px-6 py-10">
      <div className="w-full max-w-2xl space-y-6">
        {/* Welcome card */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white border flex items-center justify-center" style={{ borderColor: "var(--border-subtle)" }}>
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-black">{dbUser.name ?? dbUser.username}</h1>
              <p className="mt-1 text-gray-500">Tu username: <span className="font-medium text-black">{dbUser.username}</span></p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <a className="py-3 px-6 rounded-full font-semibold" style={{ backgroundColor: "var(--cta-yellow)", color: "#000" }} href="#">
              Support
            </a>
            <button className="py-3 px-5 rounded-full border bg-white text-black" style={{ borderColor: "var(--border-subtle)" }}>
              Edit profile
            </button>
          </div>
        </div>

        {/* Add Link card */}
        <div className="card">
          <h2 className="text-2xl font-semibold">Agregar un link</h2>
          <p className="mt-2 text-gray-500">Añade un link que quieras compartir en tu perfil.</p>

          <form action={addLink} className="mt-4 flex flex-col gap-3">
            <input name="title" placeholder="Título" className="w-full px-4 py-3 rounded-xl border" style={{ borderColor: "var(--border-subtle)" }} required />
            <input name="url" placeholder="https://ejemplo.com" className="w-full px-4 py-3 rounded-xl border" style={{ borderColor: "var(--border-subtle)" }} required />
            <button type="submit" className="mt-2 w-full py-4 rounded-full font-semibold" style={{ backgroundColor: "var(--cta-yellow)", color: "#000" }}>Agregar link</button>
          </form>
        </div>

        {/* Links list card */}
        <div className="card">
          <h3 className="font-semibold mb-3">Tus links</h3>
          {dbUser.links && dbUser.links.length > 0 ? (
            <div className="grid gap-3">
              {dbUser.links.map((l: any) => (
                <div key={l.id} className="flex items-center justify-between rounded-xl p-4 bg-white" style={{ border: `1px solid var(--border-subtle)` }}>
                  <div className="pr-4">
                    <div className="font-medium">{l.title ?? l.url}</div>
                    <div className="text-sm text-gray-500">{l.url}</div>
                  </div>
                  <form action={deleteLink} method="post">
                    <input type="hidden" name="linkId" value={l.id} />
                    <button type="submit" className="py-2 px-3 rounded-full border bg-white text-black transition-colors hover:bg-red-50" style={{ borderColor: "var(--border-subtle)" }} title="Eliminar link">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <LinkIcon size={32} className="mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Aún no tienes links. Usa el formulario de arriba para agregar uno.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
