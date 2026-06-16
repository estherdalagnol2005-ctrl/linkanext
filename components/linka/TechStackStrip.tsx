const firstRow = [
  ["Vercel", "https://cdn.simpleicons.org/vercel/FFFFFF"],
  ["React", "https://cdn.simpleicons.org/react/61DAFB"],
  ["Next.js", "https://cdn.simpleicons.org/nextdotjs/FFFFFF"],
  ["TypeScript", "https://cdn.simpleicons.org/typescript/3178C6"],
  ["Cursor", "https://cdn.simpleicons.org/cursor/FFFFFF"],
] as const;

const secondRow = [
  ["Antigravity", "https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/antigravity-color.svg", "Google Antigravity"],
  ["Google Ads", "https://upload.wikimedia.org/wikipedia/commons/c/cc/Google_Ads_icon.svg", "Google Ads"],
  ["Meta Ads", "https://cdn.simpleicons.org/meta/0866FF", "Meta Ads"],
  ["OpenAI", "", "OpenAI + ChatGPT"],
  ["WhatsApp", "https://cdn.simpleicons.org/whatsapp/25D366", "WhatsApp"],
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
        <img alt={alt} draggable={false} src={src} />
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
