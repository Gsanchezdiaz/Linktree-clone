import { notFound } from "next/navigation";
import prisma from "../../lib/prisma";

interface Params {
  username: string;
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { username } = await params;

  // Query database for user and their links
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      links: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // If user not found, return 404
  if (!user) {
    notFound();
  }

  // Extract first letter for avatar
  const avatarLetter = (user.name ?? user.username).charAt(0).toUpperCase();

  return (
    <main className="min-h-screen flex items-start justify-center px-6 py-10" style={{ backgroundColor: "#fff" }}>
      <div className="w-full max-w-2xl">
        {/* Header / Avatar + Name */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 mb-6" style={{ backgroundColor: "var(--cta-yellow)", borderColor: "var(--border-subtle)" }}>
            <span className="text-5xl font-bold text-black">{avatarLetter}</span>
          </div>
          <h1 className="text-4xl font-extrabold text-black">{user.name ?? user.username}</h1>
          <p className="mt-2 text-gray-500">@{user.username}</p>
        </div>

        {/* Links Section */}
        {user.links && user.links.length > 0 ? (
          <div className="space-y-3 mb-8">
            {user.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-full border border-gray-300 text-center font-semibold text-black transition-all hover:shadow-lg hover:scale-105"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                {link.title || link.url}
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center mb-8">
            <p className="text-gray-500">Este usuario aún no tiene links compartidos.</p>
          </div>
        )}

        {/* Create your own CTA */}
        <div className="text-center border-t" style={{ borderColor: "var(--border-subtle)", paddingTop: "2rem" }}>
          <p className="text-sm text-gray-500">
            ¿Tienes tu propio{" "}
            <a href="/" className="font-semibold text-black hover:underline">
              linktree
            </a>
            ?
          </p>
        </div>
      </div>
    </main>
  );
}
