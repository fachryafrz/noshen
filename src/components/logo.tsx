"use client";

import { useTheme } from "next-themes";

export default function Logo({ size = 24 }: { size?: number }) {
  const { resolvedTheme } = useTheme();

  return (
    <>
      {resolvedTheme === "light" ? (
        <svg
          width={size}
          height={size}
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_60_38)">
            <path
              d="M447.674 0L1000 650.684V1000H742.248V776.257L341.086 303.652H257.752V1000H0V0H447.674ZM742.248 347.032V0H1000V347.032H742.248Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_60_38">
              <rect width="1000" height="1000" fill="black" />
            </clipPath>
          </defs>
        </svg>
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_60_38)">
            <path
              d="M447.674 0L1000 650.684V1000H742.248V776.257L341.086 303.652H257.752V1000H0V0H447.674ZM742.248 347.032V0H1000V347.032H742.248Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_60_38">
              <rect width="1000" height="1000" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )}
    </>
  );
}
