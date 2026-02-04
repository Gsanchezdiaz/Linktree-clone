import { SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";
import { claimUsername } from "./actions";

export default async function Page() {
  const authUser = await currentUser();

  if (!authUser) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div
          className="w-full max-w-md rounded-xl border"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-subtle)" }}
        >
          <div className="p-6">
            <h1 className="text-5xl font-extrabold text-black leading-tight">Saca una ronda ☕</h1>
            <p className="mt-4 text-gray-500">¿Te gusta mi trabajo? Invítame un café y apóyame para seguir creando.</p>

            <div className="mt-6 flex flex-col gap-3">
              <SignInButton>
                <button className="py-4 px-8 rounded-full font-semibold text-black" style={{ backgroundColor: "var(--cta-yellow)" }}>
                  Invítame un café
                </button>
              </SignInButton>

              <button className="py-4 px-8 rounded-full border bg-white text-black font-medium" style={{ borderColor: "var(--border-subtle)" }}>
                Compartir perfil
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const authEmail =
    authUser.primaryEmailAddress?.emailAddress ||
    authUser.emailAddresses?.[0]?.emailAddress;

  let dbUser: any = null;
  try {
    dbUser = (await (prisma.user as any).findFirst({
      where: { email: authEmail },
      include: { links: true },
    })) as any;
  } catch (err) {
    throw err;
  }

  if (!dbUser) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-xl border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-subtle)" }}>
          <div className="p-6">
            <h2 className="text-4xl font-extrabold">Reclama tu username</h2>
            <p className="mt-2 text-gray-500">Elige un nombre único (mínimo 3 caracteres; letras, números o _).</p>

            <form action={claimUsername} className="mt-6 flex gap-3">
              <input
                name="username"
                type="text"
                placeholder="tu_username"
                minLength={3}
                required
                className="flex-1 px-4 py-3 rounded-xl border"
                style={{ borderColor: "var(--border-subtle)" }}
              />
              <button type="submit" className="py-4 px-8 rounded-full font-semibold" style={{ backgroundColor: "var(--cta-yellow)", color: "#000" }}>
                Reclamar
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-xl border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-subtle)" }}>
        <div className="p-6 md:p-10">
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-xl bg-white border flex items-center justify-center" style={{ borderColor: "var(--border-subtle)" }}>
                <span className="text-2xl font-bold">👋</span>
              </div>
            </div>

            <div>
              <h1 className="text-5xl font-extrabold">{dbUser.name ?? dbUser.username}</h1>
              <p className="mt-2 text-gray-500">Tu username: <span className="font-medium text-black">{dbUser.username}</span></p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a className="py-4 px-8 rounded-full font-semibold" style={{ backgroundColor: "var(--cta-yellow)", color: "#000" }} href="#">
                  Support
                </a>
                <button className="py-4 px-6 rounded-full border bg-white text-black" style={{ borderColor: "var(--border-subtle)" }}>
                  Edit profile
                </button>
              </div>
            </div>
          </div>

          <section className="mt-8">
            <h3 className="font-semibold mb-3">Tus links</h3>
            {dbUser.links && dbUser.links.length > 0 ? (
              <div className="grid gap-3">
                {dbUser.links.map((l: any) => (
                  <a key={l.id} href={l.url} className="block rounded-xl p-4" style={{ backgroundColor: "#ffffff", border: `1px solid ${"var(--border-subtle)"}` }}>
                    <div className="font-medium">{l.title ?? l.url}</div>
                    <div className="text-sm text-gray-500">{l.url}</div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aún no tienes links.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
