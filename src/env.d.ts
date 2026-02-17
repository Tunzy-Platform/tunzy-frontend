/// <reference types="react-scripts" />  // only for CRA

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_API_URL: string;
    readonly REACT_APP_OTHER_VAR?: string;
  }
}
