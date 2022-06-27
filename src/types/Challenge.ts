export interface Challenge {
  code: string;
  solve: { [index: string]: Function };
}
