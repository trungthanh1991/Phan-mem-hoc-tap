/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_KEY?: string
    readonly VITE_API_KEY_2?: string
    readonly VITE_API_KEY_3?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
