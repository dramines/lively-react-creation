
interface Zone {
  left: number;
  top: number;
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

interface ProductFaceZone {
  sideId: string;
  zone: Zone;
}

export interface ProductZoneConfig {
  id: string;
  faces: ProductFaceZone[];
}

// Using percentage-based calculations for consistent zones
const calculateZone = (baseSize: number) => ({
  left: baseSize * 0.3,    // 30% from left
  top: baseSize * 0.3,     // 30% from top
  width: baseSize * 0.4,   // 40% of canvas width
  height: baseSize * 0.4,  // 40% of canvas height
});

export const productZoneConfigs: ProductZoneConfig[] = [
  {
    id: "tshirt",
    faces: [
      {
        sideId: "front",
        zone: {
          left: 165,    // 30% from left
          top: 100,     // 30% from top
          width: 180,   // 40% of canvas width
          height: 260,  // 40% of canvas height
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      },
      {
        sideId: "back",
        zone: {
          left: 165,    // 30% from left
          top: 90,     // 30% from top
          width: 190,   // 40% of canvas width
          height: 260,  // 40% of canvas height
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      }
    ]
  },
  {
    id: "buttons-tshirt",
    faces: [
      {
        sideId: "front",
        zone: {
          left: 100,    // 30% from left
          top: 180,     // 30% from top
          width: 310,   // 40% of canvas width
          height: 300,  // 40% of canvas height
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      },
      {
        sideId: "back",
        zone: {
          left: 160,    // 30% from left
          top: 80,     // 30% from top
          width: 190,   // 40% of canvas width
          height: 320,  // 40% of canvas height
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      }
    ]
  },
  {
    id: "long-sleeves",
    faces: [
      {
        sideId: "front",
        zone: {
          ...calculateZone(500),
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      },
      {
        sideId: "back",
        zone: {
          ...calculateZone(500),
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      }
    ]
  },
  {
    id: "marketing-flag",
    faces: [
      {
        sideId: "front",
        zone: {
          left: 170,    // 30% from left
          top: 30,     // 30% from top
          width: 150,   // 40% of canvas width
          height: 450,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1,
        }
      }
    ]
  },
  {
    id: "tablier",
    faces: [
      {
        sideId: "front",
        zone: {
          left: 170,    // 30% from left
          top: 140,     // 30% from top
          width: 190,   // 40% of canvas width
          height: 330,  // 40% of canvas height
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      }
    ]
  },
  {
    id: "mug",
    faces: [
      {
        sideId: "front",
        zone: {
          left: 60,    // 30% from left
          top: 110,     // 30% from top
          width: 260,   // 40% of canvas width
          height: 300,  // 40% of canvas height
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1,
        }
      }
    ]
  },
  {
    id: "notebook",
    faces: [
      {
        sideId: "front",
        zone: {
          ...calculateZone(500),
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1,
          left: 60,    // 30% from left
          top: 110,     // 30% from top
          width: 260,   // 40% of canvas width
          height: 300,  // 40% of canvas height
        }
      }
    ]
  },
  {
    id: "bag",
    faces: [
      {
        sideId: "front",
        zone: {
          ...calculateZone(500),
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      }
    ]
  }
];
