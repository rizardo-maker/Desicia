export function Icon({
  name = "arrow",
  size = 18,
  ...props
}: {
  name?: string;
  size?: number;
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M4 10h12M11 5l5 5-5 5" />
      </>
    ),
    diagonal: (
      <>
        <path d="M5 15 15 5M5 5h10v10" />
      </>
    ),
    down: (
      <>
        <path d="M10 3v14m-5-5 5 5 5-5" />
      </>
    ),
    check: <path d="m4 10 4 4 8-8" />,
    plus: <path d="M10 4v12M4 10h12" />,
    close: <path d="m5 5 10 10M5 15 15 5" />,
    play: <path d="m7 4 9 6-9 6Z" />,
    pause: (
      <>
        <path d="M7 4v12M13 4v12" />
      </>
    ),
    shield: (
      <>
        <path d="m10 2 7 3v5c0 4-7 8-7 8s-7-4-7-8V5Z" />
        <path d="m6 9 3 3 5-5" />
      </>
    ),
    layers: (
      <>
        <path d="m2 7 8-5 8 5-8 5ZM2 11l8 5 8-5M2 15l8 5 8-5" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="5" height="5" />
        <rect x="12" y="3" width="5" height="5" />
        <rect x="3" y="12" width="5" height="5" />
        <rect x="12" y="12" width="5" height="5" />
      </>
    ),
    bolt: <path d="m11 2-7 9h6l-1 7 7-10h-6Z" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}
export function Mark() {
  return (
    <svg
      viewBox="0 0 34 34"
      width="28"
      height="28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 5h12l10 10v12H16L6 17V5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M6 5 18 17v10M18 17h10M11 5l12 12M6 11l12 12"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
