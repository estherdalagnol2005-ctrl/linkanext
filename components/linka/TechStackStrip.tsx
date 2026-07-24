const codexIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23FFFFFF' stroke-width='4.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M32 8.5c5.5 0 10 4.5 10 10v7.4l-10-5.7-10 5.7v-7.4c0-5.5 4.5-10 10-10Z'/%3E%3Cpath d='M51.9 20.1c2.8 4.8 1.1 10.9-3.7 13.7l-6.4 3.7V26L32 20.2l6.4-3.7c4.8-2.8 10.9-1.2 13.5 3.6Z'/%3E%3Cpath d='M52.1 43.7c-2.8 4.8-8.9 6.4-13.7 3.7L32 43.6l9.9-5.8V26.4l6.4 3.7c4.8 2.7 6.5 8.8 3.8 13.6Z'/%3E%3Cpath d='M32 55.5c-5.5 0-10-4.5-10-10v-7.4l10 5.7 10-5.7v7.4c0 5.5-4.5 10-10 10Z'/%3E%3Cpath d='M12.1 43.9c-2.8-4.8-1.1-10.9 3.7-13.7l6.4-3.7V38L32 43.8l-6.4 3.7c-4.8 2.8-10.9 1.2-13.5-3.6Z'/%3E%3Cpath d='M11.9 20.3c2.8-4.8 8.9-6.4 13.7-3.7l6.4 3.8-9.9 5.8v11.4l-6.4-3.7c-4.8-2.7-6.5-8.8-3.8-13.6Z'/%3E%3C/g%3E%3Ccircle cx='32' cy='32' r='5.8' fill='%23080A10' stroke='%237DD3FC' stroke-width='2.4'/%3E%3C/svg%3E";

const figmaIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 38 57'%3E%3Cpath fill='%23F24E1E' d='M19 19H9.5A9.5 9.5 0 1 1 9.5 0H19v19Z'/%3E%3Cpath fill='%23A259FF' d='M19 38H9.5a9.5 9.5 0 1 1 0-19H19v19Z'/%3E%3Cpath fill='%230ACF83' d='M19 47.5a9.5 9.5 0 1 1-9.5-9.5H19v9.5Z'/%3E%3Cpath fill='%23FF7262' d='M19 0h9.5a9.5 9.5 0 1 1 0 19H19V0Z'/%3E%3Cpath fill='%231ABCFE' d='M38 28.5a9.5 9.5 0 1 1-19 0 9.5 9.5 0 0 1 19 0Z'/%3E%3C/svg%3E";

const firstRow = [
  ["Vercel", "https://cdn.simpleicons.org/vercel/FFFFFF"],
  ["Figma", figmaIcon],
  ["Next.js", "https://cdn.simpleicons.org/nextdotjs/FFFFFF"],
  ["TypeScript", "https://cdn.simpleicons.org/typescript/3178C6"],
  ["Cursor", "https://cdn.simpleicons.org/cursor/FFFFFF"],
] as const;

const secondRow = [
  ["Antigravity", "https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/antigravity-color.svg", "Google Antigravity"],
  ["Google Ads", "https://upload.wikimedia.org/wikipedia/commons/c/cc/Google_Ads_icon.svg", "Google Ads"],
  ["Meta Ads", "https://cdn.simpleicons.org/meta/0866FF", "Meta Ads"],
  ["OpenAI", "", "OpenAI + ChatGPT"],
  ["Codex", codexIcon, "Codex"],
] as const;

function TechItem({
  alt,
  label,
  src,
}: {
  alt: string;
  label: string;
  src: string;
}) {
  return (
    <div className="lkss3-item">
      {src ? (
        <img alt={alt} decoding="async" draggable={false} loading="lazy" src={src} />
      ) : (
        <span aria-hidden="true" className="lkss3-openai-logo">
          <i>AI</i>
        </span>
      )}
      <b>
        {label === "OpenAI" ? (
          <>
            OpenAI <small>+ ChatGPT</small>
          </>
        ) : (
          label
        )}
      </b>
    </div>
  );
}

export default function TechStackStrip() {
  return (
    <section className="linka-stack-strip-v3" id="services">
      <div aria-hidden="true" className="lkss3-bg" />
      <div className="lkss3-head">
        <span data-lk-en="PREMIUM STACK" data-lk-pt="STACK PREMIUM">
          STACK PREMIUM
        </span>
      </div>

      <div aria-label="Tecnologias utilizadas pela Linka" className="lkss3-marquee lkss3-row-a">
        <div className="lkss3-track">
          <div className="lkss3-group">
            {firstRow.map(([label, src]) => (
              <TechItem alt={label} key={label} label={label} src={src} />
            ))}
          </div>
          <div aria-hidden="true" className="lkss3-group">
            {firstRow.map(([label, src]) => (
              <TechItem alt="" key={label} label={label} src={src} />
            ))}
          </div>
        </div>
      </div>

      <div
        aria-label="Plataformas de inteligência artificial, tráfego e comunicação"
        className="lkss3-marquee lkss3-row-b"
      >
        <div className="lkss3-track">
          <div className="lkss3-group">
            {secondRow.map(([label, src, alt]) => (
              <TechItem alt={alt} key={label} label={label} src={src} />
            ))}
          </div>
          <div aria-hidden="true" className="lkss3-group">
            {secondRow.map(([label, src]) => (
              <TechItem alt="" key={label} label={label} src={src} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
