export interface IQuestion {
  type?: string;
  name?: string;
  message?: string;
  choices?: (string | number)[];
  default?: string | number | boolean;
}
