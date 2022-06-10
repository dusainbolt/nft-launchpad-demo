export enum Restrict {
  DISALLOW_SPECIAL_CHAR = 'DISALLOW_SPECIAL_CHAR',
}
export interface OptionSelect {
  label: string;
  value: string | any;
  urlIcon?: any;
  disabled?: boolean;
}

export interface IField {
  name: string;
  label?: string;
  placeholder?: string;
  options?: OptionSelect[];
  component: any;
  type?: 'password' | 'text' | any;
  restric?: Restrict;
  required?: boolean;
  grid?: number;
  disabled?: boolean;
}
