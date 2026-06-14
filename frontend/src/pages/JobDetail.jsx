import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast, Toaster } from "sonner";

export default function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();

  const [data, setData] = useState(null);
  const [brief, setBrief] = useState(null);
  const [briefErr, setBriefErr] = useState("");
  const [askApply, setAskApply] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [applied, setApplied] = useState(false);
  const pendingApply = useRef(false);

  useEffect(() => {
    setBrief(null);
    setBriefErr("");
    setApplied(false);
    api.get(`/jobs/${id}`).then((r) => setData(r.data)).catch(() => setData("404"));
    // AI brief (auto-fetch). Fire-and-forget; show skeleton until it lands.
    api
      .get(`/jobs/${id}/summary`)
      .then((r) => setBrief(r.data.brief))
      .catch((e) => setBriefErr(formatApiErrorDetail(e.response?.data?.detail) || ""));
  }, [id]);

  // Detect return from external apply tab and prompt.
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible" && pendingApply.current) {
        pendingApply.current = false;
        setAskApply(true);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", onVis);
    };
  }, []);

  const onExternalApply = () => {
    if (!user || user === false) {
      nav("/login", { state: { returnTo: `/jobs/${id}` } });
      return;
    }
    const url = data?.job?.source_url;
    if (url) {
      pendingApply.current = true;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      // No external URL (e.g. seeded job) — confirm inline.
      setAskApply(true);
    }
  };

  const confirmApplied = async () => {
    setConfirming(true);
    try {
      await api.post("/applications", { job_id: id });
      setApplied(true);
      setAskApply(false);
      toast.success("Recorded — your tower in Applicants City just grew a floor.");
    } catch (e) {
      const msg = formatApiErrorDetail(e.response?.data?.detail) || e.message;
      if (msg.toLowerCase().includes("already")) {
        setApplied(true);
        setAskApply(false);
        toast.info("You'd already recorded this one.");
      } else {
        toast.error(msg);
      }
    } finally {
      setConfirming(false);
    }
  };

  const declineApplied = () => {
    setAskApply(false);
    toast("No worries — come back when you do.", { duration: 2500 });
  };

  if (data === "404") {
    return <div className="pt-32 text-center text-white/60">Job not found.</div>;
  }
  if (!data) {
    return <div className="pt-32 text-center text-white/60 label-mono">LOADING…</div>;
  }

  const { job, company } = data;
  const externalHost = (() => {
    try { return job.source_url ? new URL(job.source_url).hostname.replace("www.", "") : ""; }
    catch { return ""; }
  })();

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <Toaster theme="dark" position="top-right" />
      <div className="max-w-3xl mx-auto">
        <Link to="/jobs-city" className="label-mono text-white/40 hover:text-white">← BACK TO JOBS CITY</Link>

        {/* Header card */}
        <div className="mt-6 glass rounded-3xl p-7">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-[Unbounded] text-2xl font-black"
              style={{ background: job.company_color, color: "#0b0b0b" }}
              data-testid="company-color-block"
            >
              {job.company_name[0]}
            </div>
            <div className="flex-1">
              <div className="label-mono" style={{ color: job.company_color }}>
                {job.city.toUpperCase()}, {job.state} {job.remote && "· REMOTE OK"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black mt-1 tracking-tight" data-testid="job-title">
                {job.title}
              </h1>
              <div className="text-white/70 mt-1">
                at <span className="font-semibold">{job.company_name}</span>
                {company && company.industry && <span className="text-white/40"> · {company.industry}</span>}
              </div>
            </div>
            {job.category && (
              <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                {job.category}
              </div>
            )}
          </div>

          {(job.salary_min || job.salary_max) && (
            <div className="mt-5 font-mono text-sm text-[#FFB24C]">
              {job.salary_min && `$${Math.round(job.salary_min / 1000)}K`} –{" "}
              {job.salary_max && `$${Math.round(job.salary_max / 1000)}K`} / year
            </div>
          )}
        </div>

        {/* AI Brief — auto-loads */}
        <div className="mt-6 glass rounded-3xl p-7" data-testid="ai-brief-card">
          <div className="label-mono text-[#00FFCC]">AI BRIEF · CLAUDE SONNET 4.5</div>
          {!brief && !briefErr && (
            <div className="mt-3 space-y-2">
              <div className="h-3 bg-white/5 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
              <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
            </div>
          )}
          {briefErr && <div className="mt-2 text-sm text-white/50">Couldn&apos;t generate brief — using full description instead.</div>}
          {brief && (
            <>
              <p className="mt-3 text-white/85 leading-relaxed" data-testid="ai-brief-summary">
                {brief.summary}
              </p>
              {brief.required_skills?.length > 0 && (
                <div className="mt-5">
                  <div className="label-mono text-white/50">REQUIRED SKILLS</div>
                  <div className="mt-2 flex flex-wrap gap-2" data-testid="ai-brief-required-skills">
                    {brief.required_skills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full text-xs font-mono bg-[#00FFCC]/10 text-[#00FFCC] border border-[#00FFCC]/30"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {brief.nice_to_have?.length > 0 && (
                <div className="mt-4">
                  <div className="label-mono text-white/50">NICE TO HAVE</div>
                  <div className="mt-2 flex flex-wrap gap-2" data-testid="ai-brief-nice-skills">
                    {brief.nice_to_have.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-white/70 border border-white/10"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Original description collapsed */}
        <details className="mt-4 glass rounded-3xl p-7 group" data-testid="full-description">
          <summary className="cursor-pointer flex items-center justify-between text-sm text-white/60 hover:text-white">
            <span className="label-mono">FULL DESCRIPTION</span>
            <span className="group-open:rotate-90 transition-transform">›</span>
          </summary>
          <div className="mt-4 text-white/80 leading-relaxed whitespace-pre-line text-sm">
            {job.description}
          </div>
        </details>

        {/* External Apply */}
        <div className="mt-6 glass rounded-3xl p-7">
          <div className="label-mono">APPLY</div>
          {applied ? (
            <div className="mt-3 text-[#39FF14]" data-testid="applied-success">
              ✓ Logged in JobCity. Your building in Applicants City just grew a floor.
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mt-1">
                {job.source_url ? `Apply on ${externalHost || "the company site"}` : "Mark as applied"}
              </h2>
              <p className="text-white/60 text-sm mt-1">
                {job.source_url
                  ? "We'll open the official posting in a new tab. When you come back, we'll ask whether you applied so your tower grows accordingly."
                  : "This is a seeded role; mark it applied to grow your tower."}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  data-testid="external-apply-btn"
                  onClick={onExternalApply}
                  className="btn-jobs rounded-full px-7 py-6 h-auto text-base"
                >
                  {job.source_url ? "Apply on company site ↗" : "Mark as applied →"}
                </Button>
                {job.source_url && (
                  <Button
                    data-testid="mark-applied-btn"
                    variant="outline"
                    onClick={() => setAskApply(true)}
                    className="rounded-full bg-transparent border-white/15 text-white hover:bg-white/10 px-7 py-6 h-auto"
                  >
                    I&apos;ve already applied
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* "Did you apply?" confirmation dialog */}
      <AlertDialog open={askApply} onOpenChange={setAskApply}>
        <AlertDialogContent
          data-testid="did-you-apply-dialog"
          className="glass-strong border-white/10 text-white"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-[Unbounded] text-2xl">
              Did you apply?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Confirm that you submitted your application to{" "}
              <span className="font-semibold text-white">{job.company_name}</span> for{" "}
              <span className="font-semibold text-white">{job.title}</span>. Saying yes
              adds a floor to your tower in Applicants City.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-testid="did-not-apply-btn"
              onClick={declineApplied}
              className="bg-transparent border-white/15 text-white hover:bg-white/10"
            >
              Not yet
            </AlertDialogCancel>
            <AlertDialogAction
              data-testid="confirm-applied-btn"
              onClick={confirmApplied}
              disabled={confirming}
              className="btn-applicants rounded-full"
            >
              {confirming ? "Saving…" : "Yes, I applied →"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
