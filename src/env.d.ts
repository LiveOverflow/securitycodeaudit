interface ImportMetaEnv extends Readonly<Record<string, string>> {
    readonly BASE_URL: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }