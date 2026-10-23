const GITHUB_USER = "pubbgg92000-byte";
const REVALIDATE_SECONDS = 60 * 60 * 6;

export type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
};

export type GithubProfile = {
  login: string;
  html_url: string;
  public_repos: number;
  followers: number;
};

export type GithubActivityData = {
  profile: GithubProfile;
  repos: GithubRepo[];
};

async function githubFetch<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "arvind-portfolio",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(`https://api.github.com${path}`, {
    headers,
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`GitHub ${path} responded ${response.status}`);
  return response.json() as Promise<T>;
}

/** Public profile + six most recently pushed, non-fork repos. Null when GitHub is unreachable. */
export async function getGithubActivity(): Promise<GithubActivityData | null> {
  try {
    const [profile, repos] = await Promise.all([
      githubFetch<GithubProfile>(`/users/${GITHUB_USER}`),
      githubFetch<GithubRepo[]>(`/users/${GITHUB_USER}/repos?sort=pushed&per_page=12&type=owner`),
    ]);
    return { profile, repos: repos.filter((repo) => !repo.fork).slice(0, 6) };
  } catch (error) {
    console.warn("GitHub activity unavailable:", error instanceof Error ? error.message : error);
    return null;
  }
}

export function relativeTime(iso: string, now = Date.now()) {
  const diffSeconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, seconds] of units) {
    if (Math.abs(diffSeconds) >= seconds) return formatter.format(Math.round(diffSeconds / seconds), unit);
  }
  return "just now";
}
