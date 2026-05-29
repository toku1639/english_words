import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const defaults: IconProps = {
  width: 24,
  height: 24,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function IconStudy(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...defaults} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  )
}

export function IconList(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...defaults} {...props}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}

export function IconReview(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...defaults} {...props}>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </svg>
  )
}

export function IconVolume(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...defaults} {...props}>
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18 5a9 9 0 0 1 0 14" />
    </svg>
  )
}

export function IconCheck(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...defaults} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function IconX(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...defaults} {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...defaults} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function IconEye(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...defaults} {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function IconChart(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...defaults} {...props}>
      <path d="M3 3v18h18" />
      <path d="M7 16v-5M12 16V8M17 16v-9" />
    </svg>
  )
}

export function IconSearch(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...defaults} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function IconChevronUp(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...defaults} {...props}>
      <path d="m18 15-6-6-6 6" />
    </svg>
  )
}