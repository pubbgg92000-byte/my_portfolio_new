import { ArrowUpRight, GitBranch, Github, Star, Users } from "lucide-react";
import { getGithubActivity, relativeTime } from "@/lib/github";

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Svelte: "#ff3e00",
  Python: "#3572a5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Dart: "#00b4ab",
  Shell: "#89e051",
};

export async function GithubActivity() {
  const data = await getGithubActivity();
  const lastPush = data?.repos[0]?.pushed_at;

  return (
    <section id="github" className="story-section github-section" aria-labelledby="github-title">
      <header>
        <p className="section-kicker">Open source</p>
        <h2 id="github-title">Recent on GitHub</h2>
        <p className="github-note">Pulled live from the GitHub API and refreshed every six hours.</p>
      </header>

      {data ? (
        <>
          <div className="github-stats">
            <a href={data.profile.html_url} target="_blank" rel="noreferrer">
              <Github aria-hidden="true" />
              <strong>@{data.profile.login}</strong>
              <span>Profile<span className="sr-only"> (opens in new tab)</span></span>
            </a>
            <div>
              <GitBranch aria-hidden="true" />
              <strong>{data.profile.public_repos}</strong>
              <span>Public repos</span>
            </div>
            <div>
              <Users aria-hidden="true" />
              <strong>{data.profile.followers}</strong>
              <span>Followers</span>
            </div>
            <div>
              <Star aria-hidden="true" />
              <strong>{lastPush ? relativeTime(lastPush) : "—"}</strong>
              <span>Last push</span>
            </div>
          </div>

          <ul className="github-repos">
            {data.repos.map((repo) => (
              <li key={repo.name}>
                <a href={repo.html_url} target="_blank" rel="noreferrer">
                  <strong>
                    {repo.name}
                    <ArrowUpRight aria-hidden="true" />
                  </strong>
                  <p>{repo.description ?? "No description yet."}</p>
                  <span>
                    {repo.language ? (
                      <>
                        <i style={{ background: languageColors[repo.language] ?? "#8a8a90" }} aria-hidden="true" />
                        {repo.language}
                      </>
                    ) : null}
                    <em>Pushed {relativeTime(repo.pushed_at)}</em>
                  </span>
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="github-fallback">
          GitHub activity is temporarily unavailable.{" "}
          <a href="https://github.com/pubbgg92000-byte" target="_blank" rel="noreferrer">
            Open my profile<ArrowUpRight aria-hidden="true" />
          </a>
        </p>
      )}
    </section>
  );
}
