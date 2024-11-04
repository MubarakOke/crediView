export const RENDER_METHOD_TYPE_ENUM  = {
    SvgRenderingTemplate: "SvgRenderingTemplate",
    SvgRenderingTemplate2023: "SvgRenderingTemplate2023",
    OpenAttestationEmbeddedRenderer: "OpenAttestationEmbeddedRenderer",
} as const;


export const RENDER_METHOD_ABBR_ENUM = {
    [RENDER_METHOD_TYPE_ENUM.SvgRenderingTemplate]: "SVG",
    [RENDER_METHOD_TYPE_ENUM.SvgRenderingTemplate2023]: "SVG",
    [RENDER_METHOD_TYPE_ENUM.OpenAttestationEmbeddedRenderer]: "Embedded",
  } as const;

export type RENDER_METHOD_TYPE_ENUM_KEY = keyof typeof RENDER_METHOD_TYPE_ENUM; 
export type RENDER_METHOD_TYPE_ENUM_VALUE = typeof RENDER_METHOD_TYPE_ENUM[RENDER_METHOD_TYPE_ENUM_KEY];