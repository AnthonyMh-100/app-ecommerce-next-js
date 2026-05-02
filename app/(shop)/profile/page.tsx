import { Title } from "@/components";
import { auth } from "../../auth.config";
import { redirect } from "next/navigation";

export const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user) redirect("/");

  const user = session.user;

  return (
    <section className="max-w-3xl mx-auto w-full mb-10">
      <Title
        title="Perfil"
        subtitle="Informacion de tu cuenta"
        className="mb-2"
      />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-gray-400 text-2xl font-semibold">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name ?? "Usuario"}
                  className="h-full w-full object-cover"
                />
              ) : (
                (user.name?.trim()?.[0] ?? "U").toUpperCase()
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">Usuario</p>
              <h2 className="text-2xl font-semibold text-gray-900">
                {user.name ?? "Sin nombre"}
              </h2>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Correo
              </p>
              <p className="mt-1 text-base font-medium text-gray-900 break-all">
                {user.email ?? "No disponible"}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Rol
              </p>
              <p className="mt-1 text-base font-medium text-gray-900 capitalize">
                {user.role ?? "Usuario"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
