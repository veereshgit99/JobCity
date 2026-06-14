import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function ProfilePage() {
  const { user, applicant } = useAuth();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get("/applications/mine").then((r) => setApps(r.data.items)).catch(() => {});
  }, []);

  if (!user) return <div className="pt-32 text-center text-white/60 label-mono">LOADING…</div>;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="label-mono">MY PROFILE</div>
        <h1 className="text-4xl font-black mt-1">{user.name || user.email}</h1>
        <div className="text-white/60 mt-1 font-mono text-sm">{user.email}</div>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <Stat label="APPLICATIONS" value={applicant?.applications_count ?? 0} color="#00FFCC" />
          <Stat label="EXPERIENCE" value={(applicant?.experience_level || "entry").toUpperCase()} color="#FFB24C" />
          <Stat
            label="GITHUB"
            value={applicant?.github_username ? `@${applicant.github_username}` : "—"}
            color="#FF5F6D"
          />
        </div>

        {applicant && (
          <div className="mt-6">
            <Link
              data-testid="my-building-link"
              to={`/applicants/${applicant.applicant_id}`}
              className="inline-block text-[#00FFCC] underline-offset-4 hover:underline"
            >
              View my building in Applicants City →
            </Link>
          </div>
        )}

        <div className="mt-8 glass rounded-3xl p-7">
          <div className="label-mono">MY APPLICATIONS</div>
          {apps.length === 0 ? (
            <div className="mt-3 text-white/50">
              You haven&apos;t applied to anything yet.{" "}
              <Link to="/jobs-city" className="text-[#FF5F6D]">
                Explore Jobs City →
              </Link>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-white/5">
              {apps.map((a) => (
                <Link
                  key={a.job_id + a.applied_at}
                  to={`/jobs/${a.job_id}`}
                  data-testid={`my-app-${a.job_id}`}
                  className="flex items-center justify-between py-3 hover:bg-white/5 px-2 rounded-lg"
                >
                  <div>
                    <div className="font-semibold">{a.job_title}</div>
                    <div className="font-mono text-[11px] text-white/50">
                      {a.company_name} · {a.city}, {a.state}
                    </div>
                  </div>
                  <div className="font-mono text-[11px] text-white/40">
                    {new Date(a.applied_at).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="label-mono">{label}</div>
      <div className="font-mono text-2xl font-bold mt-1" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
