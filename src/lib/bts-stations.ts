export type TransitStation = {
  nameTh: string;
  line: 'BTS' | 'MRT' | 'ARL';
  lat: number;
  lng: number;
};

export const TRANSIT_STATIONS: TransitStation[] = [
  // BTS Sukhumvit Line
  { nameTh: 'หมอชิต', line: 'BTS', lat: 13.8027, lng: 100.5533 },
  { nameTh: 'สะพานควาย', line: 'BTS', lat: 13.7930, lng: 100.5470 },
  { nameTh: 'เสนานิคม', line: 'BTS', lat: 13.7862, lng: 100.5457 },
  { nameTh: 'อารีย์', line: 'BTS', lat: 13.7804, lng: 100.5440 },
  { nameTh: 'สนามเป้า', line: 'BTS', lat: 13.7746, lng: 100.5390 },
  { nameTh: 'อนุสาวรีย์ชัย', line: 'BTS', lat: 13.7660, lng: 100.5369 },
  { nameTh: 'พญาไท', line: 'BTS', lat: 13.7520, lng: 100.5327 },
  { nameTh: 'ราชเทวี', line: 'BTS', lat: 13.7480, lng: 100.5304 },
  { nameTh: 'สยาม', line: 'BTS', lat: 13.7455, lng: 100.5340 },
  { nameTh: 'ชิดลม', line: 'BTS', lat: 13.7440, lng: 100.5397 },
  { nameTh: 'เพลินจิต', line: 'BTS', lat: 13.7437, lng: 100.5440 },
  { nameTh: 'นานา', line: 'BTS', lat: 13.7395, lng: 100.5485 },
  { nameTh: 'อโศก', line: 'BTS', lat: 13.7360, lng: 100.5600 },
  { nameTh: 'พร้อมพงษ์', line: 'BTS', lat: 13.7296, lng: 100.5698 },
  { nameTh: 'ทองหล่อ', line: 'BTS', lat: 13.7240, lng: 100.5788 },
  { nameTh: 'เอกมัย', line: 'BTS', lat: 13.7196, lng: 100.5869 },
  { nameTh: 'พระโขนง', line: 'BTS', lat: 13.7144, lng: 100.5953 },
  { nameTh: 'อ่อนนุช', line: 'BTS', lat: 13.7034, lng: 100.6006 },
  { nameTh: 'บางจาก', line: 'BTS', lat: 13.6960, lng: 100.6030 },
  { nameTh: 'ปุณณวิถี', line: 'BTS', lat: 13.6884, lng: 100.6012 },
  { nameTh: 'อุดมสุข', line: 'BTS', lat: 13.6822, lng: 100.6036 },
  { nameTh: 'บางนา', line: 'BTS', lat: 13.6714, lng: 100.6013 },
  { nameTh: 'แบริ่ง', line: 'BTS', lat: 13.6624, lng: 100.6089 },
  { nameTh: 'สำโรง', line: 'BTS', lat: 13.6536, lng: 100.6100 },
  { nameTh: 'ปู่เจ้า', line: 'BTS', lat: 13.6403, lng: 100.6161 },
  { nameTh: 'ช้างเอราวัณ', line: 'BTS', lat: 13.6272, lng: 100.6119 },
  // BTS Silom Line
  { nameTh: 'สนามกีฬาแห่งชาติ', line: 'BTS', lat: 13.7448, lng: 100.5298 },
  { nameTh: 'ศาลาแดง', line: 'BTS', lat: 13.7279, lng: 100.5327 },
  { nameTh: 'ช่องนนทรี', line: 'BTS', lat: 13.7219, lng: 100.5305 },
  { nameTh: 'เซนต์หลุยส์', line: 'BTS', lat: 13.7185, lng: 100.5285 },
  { nameTh: 'สุรศักดิ์', line: 'BTS', lat: 13.7152, lng: 100.5256 },
  { nameTh: 'สะพานตากสิน', line: 'BTS', lat: 13.7183, lng: 100.5153 },
  { nameTh: 'กรุงธนบุรี', line: 'BTS', lat: 13.7261, lng: 100.5036 },
  { nameTh: 'วงเวียนใหญ่', line: 'BTS', lat: 13.7225, lng: 100.4954 },
  { nameTh: 'โพธิ์นิมิตร', line: 'BTS', lat: 13.7158, lng: 100.4899 },
  { nameTh: 'ตลาดพลู', line: 'BTS', lat: 13.7109, lng: 100.4862 },
  { nameTh: 'วุฒากาศ', line: 'BTS', lat: 13.7012, lng: 100.4831 },
  { nameTh: 'บางหว้า', line: 'BTS', lat: 13.6938, lng: 100.4766 },
  // BTS Gold Line
  { nameTh: 'กรุงธนบุรี (Gold)', line: 'BTS', lat: 13.7258, lng: 100.5033 },
  { nameTh: 'เจริญนคร', line: 'BTS', lat: 13.7222, lng: 100.5003 },
  { nameTh: 'คลองสาน', line: 'BTS', lat: 13.7189, lng: 100.4971 },
  // BTS Dark Green (Kasetsart University extension)
  { nameTh: 'ม.เกษตรศาสตร์', line: 'BTS', lat: 13.8488, lng: 100.5696 },
  { nameTh: 'หลักสี่', line: 'BTS', lat: 13.8787, lng: 100.5820 },
  // MRT Blue Line
  { nameTh: 'หัวลำโพง', line: 'MRT', lat: 13.7385, lng: 100.5159 },
  { nameTh: 'สามย่าน', line: 'MRT', lat: 13.7296, lng: 100.5229 },
  { nameTh: 'สีลม', line: 'MRT', lat: 13.7230, lng: 100.5286 },
  { nameTh: 'ลุมพินี', line: 'MRT', lat: 13.7231, lng: 100.5378 },
  { nameTh: 'คลองเตย', line: 'MRT', lat: 13.7224, lng: 100.5505 },
  { nameTh: 'ศูนย์ราชการเฉลิมพระเกียรติ', line: 'MRT', lat: 13.7237, lng: 100.5601 },
  { nameTh: 'สุขุมวิท', line: 'MRT', lat: 13.7364, lng: 100.5605 },
  { nameTh: 'เพชรบุรี', line: 'MRT', lat: 13.7515, lng: 100.5676 },
  { nameTh: 'ไทยทิค', line: 'MRT', lat: 13.7563, lng: 100.5641 },
  { nameTh: 'ห้วยขวาง', line: 'MRT', lat: 13.7749, lng: 100.5754 },
  { nameTh: 'สุทธิสาร', line: 'MRT', lat: 13.7874, lng: 100.5694 },
  { nameTh: 'รัชดาภิเษก', line: 'MRT', lat: 13.7980, lng: 100.5680 },
  { nameTh: 'ลาดพร้าว', line: 'MRT', lat: 13.8076, lng: 100.5697 },
  { nameTh: 'พหลโยธิน', line: 'MRT', lat: 13.8126, lng: 100.5657 },
  { nameTh: 'สวนจตุจักร', line: 'MRT', lat: 13.8081, lng: 100.5534 },
  { nameTh: 'กำแพงเพชร', line: 'MRT', lat: 13.7998, lng: 100.5464 },
  { nameTh: 'บางซื่อ', line: 'MRT', lat: 13.8044, lng: 100.5294 },
  { nameTh: 'เตาปูน', line: 'MRT', lat: 13.8043, lng: 100.5264 },
  { nameTh: 'บางโพ', line: 'MRT', lat: 13.8083, lng: 100.5189 },
  { nameTh: 'สิรินธร', line: 'MRT', lat: 13.7905, lng: 100.4894 },
  { nameTh: 'บางยี่ขัน', line: 'MRT', lat: 13.7775, lng: 100.4812 },
  { nameTh: 'บางอ้อ', line: 'MRT', lat: 13.7622, lng: 100.4839 },
  { nameTh: 'บางพลัด', line: 'MRT', lat: 13.7478, lng: 100.4869 },
  { nameTh: 'สิริกิติ์', line: 'MRT', lat: 13.7237, lng: 100.5585 },
  // MRT Purple Line
  { nameTh: 'คลองบางไผ่', line: 'MRT', lat: 13.8976, lng: 100.4928 },
  { nameTh: 'นนทบุรี 1', line: 'MRT', lat: 13.8491, lng: 100.4884 },
  { nameTh: 'นนทบุรี 2', line: 'MRT', lat: 13.8549, lng: 100.4909 },
  { nameTh: 'ไทรม้า', line: 'MRT', lat: 13.8606, lng: 100.4929 },
  { nameTh: 'สะพานพระนั่งเกล้า', line: 'MRT', lat: 13.8726, lng: 100.5034 },
  { nameTh: 'แยกนนทบุรี 1', line: 'MRT', lat: 13.8594, lng: 100.5200 },
  { nameTh: 'บางกระสอ', line: 'MRT', lat: 13.8489, lng: 100.5334 },
  { nameTh: 'ศูนย์ราชการนนทบุรี', line: 'MRT', lat: 13.8423, lng: 100.5453 },
  { nameTh: 'กระทรวงสาธารณสุข', line: 'MRT', lat: 13.7963, lng: 100.5831 },
  { nameTh: 'แยกติวานนท์', line: 'MRT', lat: 13.8213, lng: 100.5600 },
  { nameTh: 'สามแยกบางใหญ่', line: 'MRT', lat: 13.8442, lng: 100.4730 },
  // Airport Rail Link
  { nameTh: 'พญาไท (ARL)', line: 'ARL', lat: 13.7522, lng: 100.5330 },
  { nameTh: 'ราชปรารภ', line: 'ARL', lat: 13.7553, lng: 100.5451 },
  { nameTh: 'มักกะสัน', line: 'ARL', lat: 13.7499, lng: 100.5561 },
  { nameTh: 'รามคำแหง', line: 'ARL', lat: 13.7421, lng: 100.5968 },
  { nameTh: 'หัวหมาก', line: 'ARL', lat: 13.7282, lng: 100.6256 },
  { nameTh: 'บ้านทับช้าง', line: 'ARL', lat: 13.7092, lng: 100.6607 },
  { nameTh: 'ลาดกระบัง', line: 'ARL', lat: 13.7231, lng: 100.7500 },
  { nameTh: 'สุวรรณภูมิ', line: 'ARL', lat: 13.6869, lng: 100.7507 },
];

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type NearestStation = {
  nameTh: string;
  line: 'BTS' | 'MRT' | 'ARL';
  distanceMeters: number;
};

export function findNearestStation(lat: number, lng: number): NearestStation | null {
  if (!lat || !lng) return null;
  let nearest: (TransitStation & { dist: number }) | null = null;
  for (const station of TRANSIT_STATIONS) {
    const dist = haversineDistance(lat, lng, station.lat, station.lng);
    if (!nearest || dist < nearest.dist) {
      nearest = { ...station, dist };
    }
  }
  if (!nearest) return null;
  return { nameTh: nearest.nameTh, line: nearest.line, distanceMeters: Math.round(nearest.dist) };
}

export function formatStationDistance(meters: number): string {
  if (meters < 1000) return `${meters} ม.`;
  return `${(meters / 1000).toFixed(1)} กม.`;
}
