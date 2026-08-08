import { getCurrentMember } from "@/lib/db/members";
import { updateMemberProfile } from "@/lib/actions/members";
import SetupBanner from "@/components/common/SetupBanner";
import ColorSwatchPicker from "@/components/common/ColorSwatchPicker";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

const MEMBER_COLORS = ["#0D6EFD", "#198754", "#FD7E14", "#DC3545", "#6f42c1", "#20c997"];

export default async function ProfilePage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="space-y-6">
        <SetupBanner />
      </main>
    );
  }

  const member = await getCurrentMember();

  if (!member) {
    return (
      <main className="space-y-6">
        <section className="panel p-6 sm:p-8">
          <p className="eyebrow mb-3">Account</p>
          <h1 className="page-title">Profile</h1>
          <p className="page-copy mt-3 max-w-2xl">
            We couldn&apos;t match your login to a household member. Ask an admin to add your email under Members.
          </p>
        </section>
      </main>
    );
  }

  const updateProfile = updateMemberProfile.bind(null, member.id);

  return (
    <main className="space-y-6">
      <section className="panel panel-header p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <span
            className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-semibold text-white"
            style={{ backgroundColor: member.color }}
          >
            {member.name[0]}
          </span>
          <div>
            <p className="eyebrow mb-1">Account</p>
            <h1 className="page-title">{member.name}</h1>
            {member.email && <p className="page-copy mt-1">{member.email}</p>}
          </div>
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="section-title mb-5">Edit Profile</h2>
        <form action={updateProfile} className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-4">
            <label className="field-label">Name</label>
            <input name="name" defaultValue={member.name} className="field-input" required />
          </div>
          <div className="md:col-span-4">
            <label className="field-label">Email</label>
            <input type="email" name="email" defaultValue={member.email ?? ""} className="field-input" />
          </div>
          <div className="md:col-span-3">
            <label className="field-label">Color</label>
            <div className="pt-1">
              <ColorSwatchPicker name="color" colors={MEMBER_COLORS} defaultValue={member.color} />
            </div>
          </div>
          <div className="md:col-span-1 md:self-end">
            <button type="submit" className="btn-primary w-full">
              Save
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
