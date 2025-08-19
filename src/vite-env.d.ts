/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface SVGRProps {
  title?: string;
  titleId?: string;
}

declare module '*.svg?react' {
  import { FC, SVGProps } from 'react'
  const SVG: FC<SVGProps<SVGSVGElement> & SVGRProps>
  export default SVG
}

interface ImportMetaEnv {
  readonly VITE_REST_API_URL: string
}