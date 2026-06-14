import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen relative overflow-hidden grain">
      {/* Background imagery split */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
        <div
          className="relative"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(8,4,12,0.55), rgba(255,95,109,0.18)), url('https://images.unsplash.com/photo-1707531194853-4345288d3840?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxsb3clMjBwb2x5JTIwdm94ZWwlMjBjaXR5JTIwc3Vuc2V0JTIwM2QlMjByZW5kZXJ8ZW58MHx8fHwxNzgxNDY5OTI3fDA&ixlib=rb-4.1.0&q=85')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="relative"
          style={{
            backgroundImage:
              "linear-gradient(225deg, rgba(0,255,204,0.12), rgba(0,0,16,0.7)), url('https://images.unsplash.com/photo-1613739519297-e7947a931ba4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwxfHxsb3clMjBwb2x5JTIwdm94ZWwlMjBjaXR5JTIwbmlnaHQlMjAzZCUyMHJlbmRlcnxlbnwwfHx8fDE3ODE0Njk5Mjd8MA&ixlib=rb-4.1.0&q=85')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-[#050505]/55" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="rise">
          <div className="label-mono mb-4">A LIVING JOBS UNIVERSE · 2026</div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95] tracking-[-0.04em]">
            Two cities.
            <br />
            <span className="text-[#FF5F6D]">One </span>
            <span className="text-[#00FFCC]">network.</span>
          </h1>
          <p className="mt-6 max-w-xl text-white/70 text-lg leading-relaxed">
            Every company hiring becomes a building. Every applicant becomes a tower.
            Floors stack with jobs. Floors stack with applications. Fly the skyline,
            compare ambition, and apply with one click.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 rise" style={{ animationDelay: "120ms" }}>
          <Button
            data-testid="explore-jobs-city-btn"
            onClick={() => nav("/jobs-city")}
            className="btn-jobs rounded-full text-base px-7 py-6 h-auto"
          >
            Explore Jobs City →
          </Button>
          <Button
            data-testid="enter-applicants-city-btn"
            onClick={() => nav("/applicants-city")}
            variant="outline"
            className="rounded-full bg-transparent border border-white/15 text-white hover:bg-white/10 text-base px-7 py-6 h-auto"
          >
            Enter Applicants City →
          </Button>
        </div>

        <div className="mt-20 grid sm:grid-cols-3 gap-4 max-w-3xl">
          <Stat label="ACTIVE JOBS" value="350+" accent="#FF5F6D" />
          <Stat label="COMPANIES HIRING" value="20+" accent="#FFB24C" />
          <Stat label="APPLICANTS LIVE" value="30+" accent="#00FFCC" />
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-6">
          <FeatureCard
            tag="JOBS CITY"
            accent="#FF5F6D"
            title="A 3D U.S. map of open jobs"
            body="Companies appear at their hiring cities. Building floors = open roles in that city. Spin the globe, click a tower, apply."
            cta="Open Jobs City"
            to="/jobs-city"
            testid="card-jobs"
          />
          <FeatureCard
            tag="APPLICANTS CITY"
            accent="#00FFCC"
            title="A neon grid of every applicant"
            body="Floors stack with each application you submit. Antennae signal active developers. Pick up to four buildings to compare."
            cta="Enter Applicants City"
            to="/applicants-city"
            testid="card-applicants"
          />
        </div>

        <div className="mt-24 flex flex-wrap items-center gap-4 text-white/50 text-sm">
          <span className="label-mono">JOIN THE CITIES</span>
          <Link to="/register" data-testid="landing-register-link" className="underline decoration-white/30 underline-offset-4 hover:text-white">
            Create a free account
          </Link>
          <span>·</span>
          <Link to="/login" data-testid="landing-login-link" className="hover:text-white">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="label-mono">{label}</div>
      <div className="mt-2 font-[Unbounded] text-4xl font-black" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}

function FeatureCard({ tag, accent, title, body, cta, to, testid }) {
  return (
    <div data-testid={testid} className="glass rounded-3xl p-7 relative overflow-hidden">
      <div className="label-mono" style={{ color: accent }}>
        {tag}
      </div>
      <h3 className="font-[Unbounded] text-2xl mt-2 font-bold leading-tight">{title}</h3>
      <p className="text-white/65 mt-3 leading-relaxed">{body}</p>
      <Link to={to} className="inline-block mt-5 text-sm font-semibold" style={{ color: accent }}>
        {cta} →
      </Link>
      <div
        className="absolute -bottom-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-20"
        style={{ background: accent }}
      />
    </div>
  );
}
