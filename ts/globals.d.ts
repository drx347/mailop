type BirthdayConfig = {
  toName?: string;
  fromName?: string;
  mainMessages?: string[];
  result?: {
    label?: string;
    title?: string;
    lead?: string;
    note?: string;
    small?: string;
  };
};

type BirthdayHelpers = {
  fadeTo(url: string, direction?: "next" | "prev" | "zoom"): Promise<void>;
  showToast(text: string, ms?: number): void;
};

interface Window {
  BDAY_CONFIG?: BirthdayConfig;
  BDay?: BirthdayHelpers;
}
