import { SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";
import { claimUsername } from "./actions";

export default async function Page() {
  const authUser = await currentUser();

  if (!authUser) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Bienvenido a Linktree Clone</h1>
        <p className="mt-4">Crea y comparte tus links fácilmente.</p>
        <div className="mt-6">
          <SignInButton>
            <button className="px-4 py-2 rounded bg-[#6c47ff] text-white">
              Get started
            </button>
          </SignInButton>
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
      <main className="p-8">
        <h2 className="text-xl font-semibold">Reclama tu username</h2>
        <p className="mt-2">
          Elige un nombre único (mínimo 3 caracteres, letras, números o _).
        </p>

        <form action={claimUsername} className="mt-4 flex gap-2">
          <input
            name="username"
            type="text"
            placeholder="tu_username"
            minLength={3}
            required
            className="px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#6c47ff] text-white rounded"
          >
            Reclamar
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Hola, {dbUser.name ?? dbUser.username}
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Tu username: {dbUser.username}
      </p>

      <section className="mt-6">
        <h3 className="font-semibold">Tus links</h3>
        {dbUser.links && dbUser.links.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {dbUser.links.map((l: any) => (
              <li key={l.id}>
                <a
                  href={l.url}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.title ?? l.url}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">Aún no tienes links.</p>
        )}
      </section>
    </main>
  );
}
