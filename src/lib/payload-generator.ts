import { TivePayload } from '@/types/tive';

/**
 * Generate a random device IMEI
 */
export function generateDeviceImei(): string {
  return `35${Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0')}`;
}

/**
 * Generate a random device name
 */
export function generateDeviceName(): string {
  const prefixes = ['TIVE', 'TRACK', 'SENSOR', 'MONITOR'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${number}`;
}

/**
 * Generate random coordinates (within reasonable bounds)
 */
export function generateCoordinates(): { lat: number; lng: number } {
  // Random coordinates within continental US
  return {
    lat: 25 + Math.random() * 25, // 25 to 50 degrees
    lng: -125 + Math.random() * 55, // -125 to -70 degrees
  };
}

/**
 * Generate random temperature in Celsius
 */
export function generateTemperature(): number {
  return Math.round((20 + Math.random() * 15) * 100) / 100; // 20-35°C
}

/**
 * Generate a random Tive payload
 */
export function generateTivePayload(overrides?: Partial<TivePayload>): TivePayload {
  const now = Date.now();
  const coords = generateCoordinates();
  const deviceId = generateDeviceImei();
  const deviceName = generateDeviceName();

  const basePayload: TivePayload = {
    EntryTimeEpoch: Math.floor(now / 1000),
    EntryTimeUtc: new Date(now).toISOString(),
    DeviceId: deviceId,
    DeviceName: deviceName,
    Temperature: {
      Celsius: generateTemperature(),
      Fahrenheit: Math.round((generateTemperature() * 9/5 + 32) * 100) / 100,
    },
    Location: {
      Latitude: coords.lat,
      Longitude: coords.lng,
      FormattedAddress: `${Math.floor(Math.random() * 1000)} Main St, City, ST ${Math.floor(10000 + Math.random() * 90000)}, USA`,
      LocationMethod: ['gps', 'wifi', 'cell'][Math.floor(Math.random() * 3)] as 'gps' | 'wifi' | 'cell',
      Accuracy: {
        Meters: Math.floor(5 + Math.random() * 50),
        Kilometers: Math.round((5 + Math.random() * 50) / 1000 * 100) / 100,
        Miles: Math.round((5 + Math.random() * 50) * 0.000621371 * 100) / 100,
      },
    },
    Battery: {
      Percentage: Math.floor(20 + Math.random() * 80),
      Estimation: ['Days', 'Weeks', 'Months'][Math.floor(Math.random() * 3)] as 'Days' | 'Weeks' | 'Months',
      IsCharging: Math.random() > 0.7,
    },
    Humidity: {
      Percentage: Math.round((30 + Math.random() * 50) * 10) / 10,
    },
    Light: {
      Lux: Math.round((100 + Math.random() * 900) * 10) / 10,
    },
    Accelerometer: {
      G: Math.round((0.5 + Math.random() * 0.5) * 1000) / 1000,
      X: Math.round((Math.random() * 2 - 1) * 1000) / 1000,
      Y: Math.round((Math.random() * 2 - 1) * 1000) / 1000,
      Z: Math.round((Math.random() * 2 - 1) * 1000) / 1000,
    },
    Cellular: {
      SignalStrength: ['Poor', 'Fair', 'Good'][Math.floor(Math.random() * 3)] as 'Poor' | 'Fair' | 'Good',
      Dbm: Math.round((-100 + Math.random() * 50) * 100) / 100,
    },
    AccountId: Math.floor(1000 + Math.random() * 9000),
    ShipmentId: `SHIP-${Math.floor(Math.random() * 1000000)}`,
  };

  return { ...basePayload, ...overrides };
}

/**
 * Generate a minimal valid payload
 */
export function generateMinimalPayload(): TivePayload {
  const now = Date.now();
  const coords = generateCoordinates();
  const deviceId = generateDeviceImei();
  const deviceName = generateDeviceName();

  return {
    EntryTimeEpoch: Math.floor(now / 1000),
    DeviceId: deviceId,
    DeviceName: deviceName,
    Temperature: {
      Celsius: 25.0,
    },
    Location: {
      Latitude: coords.lat,
      Longitude: coords.lng,
    },
  };
}

/**
 * Sample payloads for testing
 */
export const samplePayloads: { name: string; payload: TivePayload }[] = [
  {
    name: 'Full Payload',
    payload: generateTivePayload(),
  },
  {
    name: 'Minimal Payload',
    payload: generateMinimalPayload(),
  },
  {
    name: 'High Temperature Alert',
    payload: generateTivePayload({
      Temperature: {
        Celsius: 45.5,
        Fahrenheit: 113.9,
      },
    }),
  },
  {
    name: 'Low Battery',
    payload: generateTivePayload({
      Battery: {
        Percentage: 15,
        Estimation: 'Days',
        IsCharging: false,
      },
    }),
  },
  {
    name: 'Poor Signal',
    payload: generateTivePayload({
      Cellular: {
        SignalStrength: 'Poor',
        Dbm: -110,
      },
    }),
  },
  {
    name: 'Standard Temperature Shipment',
    payload: {
      EntityName: 'A571992',
      EntryTimeEpoch: 1739215646000,
      EntryTimeUtc: '2025-02-10T19:27:26Z',
      Cellular: {
        SignalStrength: 'Poor',
        Dbm: -100,
      },
      Temperature: {
        Celsius: 10.078125,
        Fahrenheit: 50.140625,
      },
      ProbeTemperature: null,
      Humidity: {
        Percentage: 38.70000076293945,
      },
      Accelerometer: {
        G: 0.9901862198596787,
        X: -0.5625,
        Y: -0.4375,
        Z: 0.6875,
      },
      Light: {
        Lux: 0,
      },
      Battery: {
        Percentage: 65,
        Estimation: 'N/A',
        IsCharging: false,
      },
      Shipment: {
        Id: 'CL-13686/PHARMA-SHIP/COLD-LOGISTICS',
        Description: null,
        DeviceId: '866088073468439',
        ShipFrom: {
          Latitude: 26.09891,
          Longitude: -98.18494,
          FormattedAddress: '1460 E Hi Line Rd, Pharr, TX 78577, USA',
        },
        ShipTo: {
          Latitude: 40.815468,
          Longitude: -73.8805,
          FormattedAddress: '772 Edgewater Rd, Bronx, NY 10474, USA',
        },
        Carrier: 'EXCALIBUR',
      },
      AccountId: 478,
      DeviceId: '863257063350583',
      DeviceName: 'A571992',
      ShipmentId: 'CL-13686/PHARMA-SHIP/COLD-LOGISTICS',
      PublicShipmentId: '40X614N4WC',
      Location: {
        Latitude: 40.810562,
        Longitude: -73.879285,
        FormattedAddress: '114 Hunts Point Market, Bronx, NY 10474, USA',
        LocationMethod: 'wifi',
        Accuracy: {
          Meters: 23,
          Kilometers: 0.023,
          Miles: 0.014291572942945556,
        },
        GeolocationSourceName: 'skyhook',
        CellTowerUsedCount: 1,
        WifiAccessPointUsedCount: 5,
      },
    } as TivePayload,
  },
  {
    name: 'GPS Location Shipment',
    payload: {
      EntityName: 'B234567',
      EntryTimeEpoch: 1739302046000,
      EntryTimeUtc: '2025-02-11T19:27:26Z',
      Cellular: {
        SignalStrength: 'Good',
        Dbm: -75,
      },
      Temperature: {
        Celsius: 4.5,
        Fahrenheit: 40.1,
      },
      ProbeTemperature: null,
      Humidity: {
        Percentage: 55.3,
      },
      Accelerometer: {
        G: 1.012,
        X: 0.125,
        Y: -0.25,
        Z: 0.98,
      },
      Light: {
        Lux: 125.5,
      },
      Battery: {
        Percentage: 82,
        Estimation: 'Weeks',
        IsCharging: false,
      },
      Shipment: {
        Id: 'INV-45678/VACCINE-BATCH',
        Description: 'COVID Vaccine Shipment',
        DeviceId: '866088073468440',
        ShipFrom: {
          Latitude: 42.3601,
          Longitude: -71.0589,
          FormattedAddress: 'Boston, MA 02101, USA',
        },
        ShipTo: {
          Latitude: 33.749,
          Longitude: -84.388,
          FormattedAddress: 'Atlanta, GA 30303, USA',
        },
        Carrier: 'FEDEX-COLD',
      },
      AccountId: 478,
      DeviceId: '866088073468440',
      DeviceName: 'B234567',
      ShipmentId: 'INV-45678/VACCINE-BATCH',
      PublicShipmentId: '7YK832MNP1',
      Location: {
        Latitude: 37.7749,
        Longitude: -122.4194,
        FormattedAddress: 'San Francisco, CA 94102, USA',
        LocationMethod: 'gps',
        Accuracy: {
          Meters: 5,
          Kilometers: 0.005,
          Miles: 0.003,
        },
        GeolocationSourceName: 'gnss',
        CellTowerUsedCount: 0,
        WifiAccessPointUsedCount: 0,
      },
    } as TivePayload,
  },
  {
    name: 'Cellular Location Only',
    payload: {
      EntityName: 'C345678',
      EntryTimeEpoch: 1739388446000,
      EntryTimeUtc: '2025-02-12T19:27:26Z',
      Cellular: {
        SignalStrength: 'Fair',
        Dbm: -90,
      },
      Temperature: {
        Celsius: -18.5,
        Fahrenheit: -1.3,
      },
      ProbeTemperature: null,
      Humidity: {
        Percentage: 25.0,
      },
      Accelerometer: {
        G: 0.995,
        X: 0.0,
        Y: 0.0,
        Z: 0.995,
      },
      Light: {
        Lux: 0,
      },
      Battery: {
        Percentage: 45,
        Estimation: 'Days',
        IsCharging: false,
      },
      Shipment: null,
      AccountId: 478,
      DeviceId: '866088073468441',
      DeviceName: 'C345678',
      ShipmentId: null,
      PublicShipmentId: null,
      Location: {
        Latitude: 51.5074,
        Longitude: -0.1278,
        FormattedAddress: 'London, UK',
        LocationMethod: 'cell',
        Accuracy: {
          Meters: 500,
          Kilometers: 0.5,
          Miles: 0.31,
        },
        GeolocationSourceName: 'cell-triangulation',
        CellTowerUsedCount: 3,
        WifiAccessPointUsedCount: 0,
      },
    } as TivePayload,
  },
  {
    name: 'Minimal Data Payload',
    payload: {
      EntryTimeEpoch: 1739474846000,
      EntityName: 'D456789',
      DeviceId: '866088073468442',
      DeviceName: 'D456789',
      Temperature: {
        Celsius: 22.0,
        Fahrenheit: 71.6,
      },
      Location: {
        Latitude: 35.6762,
        Longitude: 139.6503,
        LocationMethod: null,
        Accuracy: null,
      },
    } as TivePayload,
  },
  {
    name: 'Invalid - Missing Device ID',
    payload: {
      EntryTimeEpoch: 1739215646000,
      DeviceName: 'A571992',
      Temperature: { Celsius: 10.0 },
      Location: { Latitude: 40.0, Longitude: -73.0 },
    } as TivePayload,
  },
  {
    name: 'Invalid - Invalid Latitude',
    payload: {
      EntryTimeEpoch: 1739215646000,
      EntityName: 'A571992',
      DeviceId: '863257063350583',
      DeviceName: 'A571992',
      Temperature: { Celsius: 10.0 },
      Location: { Latitude: 95.0, Longitude: -73.0 },
    } as TivePayload,
  },
  {
    name: 'Invalid - Invalid Longitude',
    payload: {
      EntryTimeEpoch: 1739215646000,
      EntityName: 'A571992',
      DeviceId: '863257063350583',
      DeviceName: 'A571992',
      Temperature: { Celsius: 10.0 },
      Location: { Latitude: 40.0, Longitude: -200.0 },
    } as TivePayload,
  },
  {
    name: 'Invalid - Timestamp in Future',
    payload: {
      EntryTimeEpoch: 1893456000000,
      EntityName: 'A571992',
      DeviceId: '863257063350583',
      DeviceName: 'A571992',
      Temperature: { Celsius: 10.0 },
      Location: { Latitude: 40.0, Longitude: -73.0 },
    } as TivePayload,
  },
  {
    name: 'Invalid - Old Timestamp',
    payload: {
      EntryTimeEpoch: 1609459200000,
      EntityName: 'A571992',
      DeviceId: '863257063350583',
      DeviceName: 'A571992',
      Temperature: { Celsius: 10.0 },
      Location: { Latitude: 40.0, Longitude: -73.0 },
    } as TivePayload,
  },
];

