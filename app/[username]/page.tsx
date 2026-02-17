import { notFound } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import prisma from "../../lib/prisma";
import CopyButton from "../components/copy-button";

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

  // Extract first letter for avatar fallback
  const avatarLetter = (user.name ?? user.username).charAt(0).toUpperCase();
  
  // Fetch Clerk user to get profile image
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(user.clerkId);
  const profileImageUrl = clerkUser?.imageUrl;
  
  // Build public profile URL for copy button
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${user.username}`;

  return (
    <main className="min-h-screen hero-glow flex items-start justify-center px-6 py-10">
      <div className="w-full max-w-2xl">
        {/* Profile Card */}
        <div className="card">
          {/* Header / Avatar + Name */}
          <div className="text-center mb-8">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={user.name ?? user.username}
                className="w-24 h-24 rounded-full border-2 mb-6 mx-auto object-cover"
                style={{ borderColor: "var(--border-subtle)" }}
              />
            ) : (
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 mb-6" style={{ backgroundColor: "var(--cta-yellow)", borderColor: "var(--border-subtle)" }}>
                <span className="text-5xl font-bold text-black">{avatarLetter}</span>
              </div>
            )}
            <h1 className="text-4xl font-extrabold text-black">{user.name ?? user.username}</h1>
            <p className="mt-2 text-gray-500">@{user.username}</p>
            
            {/* Copy Profile Link Button */}
            <div className="mt-6 flex justify-center">
              <CopyButton url={profileUrl} label="Copiar perfil" />
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-3">
            {user.links && user.links.length > 0 ? (
              user.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-4 rounded-full border text-center font-semibold text-black transition-all hover:shadow-lg hover:scale-105"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  {link.title || link.url}
                  <ExternalLink size={16} />
                </a>
              ))
            ) : (
              <div className="text-center py-8">
                <LinkIcon size={40} className="mx-auto mb-3 text-gray-400" />
                <p className="text-gray-500">Este usuario aún no tiene links compartidos.</p>
              </div>
            )}
          </div>
        </div>

        {/* Create your own CTA */}
        <div className="text-center border-t mt-8" style={{ borderColor: "var(--border-subtle)", paddingTop: "2rem" }}>
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
