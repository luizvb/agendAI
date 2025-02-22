export enum BusinessType {
  BARBERSHOP = "barbershop",
  DENTAL = "dental",
  BEAUTY_SALON = "beauty_salon",
}

export interface AIConfiguration {
  id?: number;
  agentName: string;
  communicationStyles: string[];
  businessType: BusinessType;
  customRules?: string[];
  isActive: boolean;
}
