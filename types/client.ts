export interface Client {
  id: number;
  name: string;
  phoneNumber: string;
  email?: string;
  notificationsEnabled: boolean;
  preferences?: {
    preferredProfessional?: number;
    communicationPreference?: "whatsapp" | "email" | "sms";
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDTO {
  name: string;
  phoneNumber: string;
  email?: string;
  notificationsEnabled?: boolean;
  preferences?: {
    preferredProfessional?: number;
    communicationPreference?: "whatsapp" | "email" | "sms";
  };
}
