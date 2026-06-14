import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { EXP_COLORS } from "@/lib/colors";

export default function ApplicantDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/applicants/${id}`).then((r) => setData(r.data)).catch(() => setData("404"));
  }, [id]);

  if (data === "404") return <div className="pt-32 text-center text-white/60">Applicant not found.</div>;
  if (!data) return <div className="pt-32 text-center text-white/60 label-mono">LOADING…</div>;

  const { applicant, applications } = data;
  const color = EXP_COLORS[applicant.experience_level] || EXP_COLORS.entry;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/applicants-city" className="label-mono text-white/40 hover:text-white">
          ← BACK TO APPLICANTS CITY
        </Link>

        <div className="mt-6 glass rounded-3xl p-7">
          <div className="flex items-start gap-5">
            <div
              data-testid="applicant-avatar-block"
              className="w-20 h-20 rounded-2xl flex items-center justify-center font-[Unbounded] text-3xl font-black"
              style={{ background: color, color: "#0b0b0b" }}
            >
              {applicant.display_name[0]}
            </div>
            <div className="flex-1">
              <div className="label-mono" style={{ color }}>
                {applicant.experience_level.toUpperCase()} ·{" "}
                {applicant.location_city ? `${applicant.location_city}, ${applicant.location_state}` : "anywhere"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">
                {applicant.display_name}
              </h1>
              <p className="text-white/70 mt-1">{applicant.headline || "—"}</p>
            </div>
            <div className="text-right">
              <div className="label-mono">APPLICATIONS</div>
              <div className="font-mono text-3xl font-bold mt-1" style={{ color: "#00FFCC" }}>
                {applicant.applications_count}
              </div>
            </div>
          </div>

          {applicant.skills?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {applicant.skills.map((s) => (
                <span key={s} className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10">
                  {s}
                </span>
              ))}
            </div>
          )}

          {applicant.github_username && (
            <div className="mt-5 font-mono text-sm text-white/60">
              ⌁ GITHUB · @{applicant.github_username} · {applicant.github_commits_30d} commits / 30d
            </div>
          )}
        </div>

        <div className="mt-6 glass rounded-3xl p-7">
          <div className="label-mono">RECENT APPLICATIONS</div>
          {applications.length === 0 ? (
            <div className="mt-3 text-white/50">No applications yet.</div>
          ) : (
            <div className="mt-3 divide-y divide-white/5">
              {applications.map((a) => (
                <Link
                  key={a.job_id + a.applied_at}
                  to={`/jobs/${a.job_id}`}
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
