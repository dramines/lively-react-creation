export interface Zone {
  left: number;
  top: number;
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

export interface ProductZoneConfig {
  id: string;
  faces: Array<{
    sideId: string;
    zone: Zone;
  }>;
}