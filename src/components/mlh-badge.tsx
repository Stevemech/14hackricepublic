/**
 * MLH trust badge — fixed top-right per MLH placement rules, official yellow
 * colorway (the asset itself must not be modified). Hovering (or keyboard
 * focus) pulls the ribbon down and reveals a SEE MORE tag; clicking opens
 * the MLH 2027 season site.
 */
export function MlhBadge() {
  return (
    <a
      id="mlh-trust-badge"
      className="group fixed top-0 right-[50px] z-50 block w-[10%] max-w-[100px] min-w-[60px] transition-transform duration-300 ease-out hover:translate-y-4 focus-visible:translate-y-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright"
      href="https://mlh.io/seasons/2027/events"
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* Ribbon extension: fills the gap above the badge while it's pulled
          down. Color is MLH's exact official ribbon yellow (#f8b92a, the
          asset's .cls-1 fill) so it's seamless with the badge body. */}
      <span
        aria-hidden="true"
        className="absolute bottom-full left-[4.5%] h-8 w-[90.5%] bg-[#f8b92a]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- MLH requires their hosted asset */}
      <img
        src="https://logged-assets.s3.amazonaws.com/trust-badge/2027/mlh-trust-badge-2027-yellow.svg"
        alt="Major League Hacking 2026 Hackathon Season"
        className="w-full"
      />
      <span className="font-dot absolute top-full left-1/2 mt-1.5 -translate-x-1/2 border border-gold/50 bg-felt/95 px-2 py-1 text-[10px] tracking-[0.2em] whitespace-nowrap text-gold-bright uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        See more ↗
      </span>
    </a>
  );
}
