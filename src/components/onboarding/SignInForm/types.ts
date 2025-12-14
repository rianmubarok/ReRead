export interface Region {
  code: string;
  name: string;
}

export interface AddressData {
  province: string;
  regency: string;
  district: string;
  village: string;
}

export interface SignInFormStepProps {
  onNext: () => void;
  onBack?: () => void;
  step: number;
}

