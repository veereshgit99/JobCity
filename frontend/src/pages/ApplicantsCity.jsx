import { Suspense, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApplicantsCityScene from "@/components/three/ApplicantsCityScene";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ApplicantsCityPage() {
  const [compareIds, setCompareIds] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [query, setQuery] = useState("");
  const nav = useNavigate();

  const toggleCompare = (a) => {
    setCompareIds((prev) => {
      if (prev.includes(a.id)) return prev.filter((x) => x !== a.id);
      if (prev.length >= 4) return prev;
      return [...prev, a.id];
    });
    setHovered(a);
  };

  return (
    <div className="fixed inset-0">
      <Suspense fallback={null}>
        <ApplicantsCityScene
          onApplicantClick={toggleCompare}
          selectedIds={compareIds}
          query={query}
        />
      </Suspense>

      {/* Floating search */}
      <div className="absolute top-20 left-4 z-20 pointer-events-auto">
        <div className="glass rounded-full p-1 flex items-center pl-4 w-[300px]">
          <Input
            data-testid="applicants-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, level (entry/mid/senior), github…"
            className="bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Top guide */}
      <div className="absolute top-36 left-4 z-20 pointer-events-auto glass rounded-2xl px-4 py-3 max-w-md">
        <div className="label-mono text-[#00FFCC]">APPLICANTS CITY · GUIDE</div>
        <div className="text-sm text-white/70 mt-1">
          Each tower is an applicant. Floors = job applications submitted.
          Towers with 8+ apps become skyscrapers. Antenna = active GitHub.
          Click towers to select up to 4 for comparison.
        </div>
      </div>

      {/* Selected detail */}
      {hovered && (
        <div className="absolute top-20 right-4 z-20 pointer-events-auto glass rounded-2xl px-4 py-3 max-w-xs">
          <div className="label-mono">{hovered.experience_level.toUpperCase()} APPLICANT</div>
          <div className="font-[Unbounded] text-lg font-bold mt-1">{hovered.display_name}</div>
          <div className="font-mono text-xs text-white/60 mt-1">
            {hovered.floors} APPLICATIONS · {hovered.has_github ? `${hovered.github_commits_30d} commits/30d` : "no github"}
          </div>
          <Link
            to={`/applicants/${hovered.id}`}
            data-testid={`applicant-detail-link-${hovered.id}`}
            className="mt-3 inline-block text-sm font-semibold text-[#00FFCC]"
          >
            View profile →
          </Link>
        </div>
      )}

      {/* Compare bar */}
      {compareIds.length > 0 && (
        <div
          data-testid="compare-bar"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto glass-strong rounded-full px-5 py-3 flex items-center gap-3"
        >
          <div className="label-mono">COMPARING {compareIds.length}/4</div>
          <Button
            data-testid="compare-go-btn"
            disabled={compareIds.length < 2}
            onClick={() => nav(`/compare?ids=${compareIds.join(",")}`)}
            className="btn-applicants rounded-full"
            size="sm"
          >
            Compare side-by-side →
          </Button>
          <Button
            data-testid="compare-clear-btn"
            variant="ghost"
            size="sm"
            onClick={() => setCompareIds([])}
            className="text-white/60"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
