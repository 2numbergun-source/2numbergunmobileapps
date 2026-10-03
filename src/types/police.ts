export interface Officer {
  id: string;
  bgCode: string; // B.G. कोड (e.g., 'BG-2075-1029')
  computerCode: string; // कम्प्युटर कोड (e.g., 'CC-2075-1029' or '371209')
  sanketNo: string; // संकेत नं. (e.g., '१०२९४४')
  rank: string; // दर्जा (e.g., 'प्रनि — प्रहरी नायव निरीक्षक (SI)')
  name: string; // नामथर (e.g., 'प्रकाश शर्मा')
  darbandi: string; // दरबन्दी (e.g., 'सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज')
  dabhaka?: string; // द.भ.का.
  jobResponsibility?: string; // कामको जिम्मेवारी (e.g., 'क कम्पनी इन्चार्ज तथा फिल्ड अपरेशन कमाण्डर')
  specialSkills?: string; // विशेष क्षमता
  barrack?: string; // ब्यारेक (e.g., 'अधिकृत आवास क्वाटर')
  roomStatus?: string; // कोठावाला
  residenceLocation?: string; // बस्ने स्थान
  gender?: string; // लिङ्ग (e.g., 'पुरुष' / 'महिला')
  currentOffice?: string; // कार्यरत कार्यालय (e.g., 'महाराजगञ्ज कमाण्ड')
  workingSinceDate?: string; // कार्यरत मिति (e.g., '२०८०/०२/०१')
  recruitmentDate?: string; // भर्ना मिति (e.g., '२०६५/०१/१२')
  transferDate?: string; // सरुवा मिति (e.g., '२०८०/०१/२५')
  promotionDate?: string; // बढुवा मिति (e.g., '२०७७/११/०४')
  previousDarbandi?: string; // साविक दरबन्दी
  dateOfBirth?: string; // जन्म मिति (e.g., '२०४६/०३/२२')
  education?: string; // शैक्षिक योग्यता (e.g., 'स्नातक (BBS)')
  cugNumber?: string; // CUG भएका
  relativeName?: string; // आफन्तको नाम
  nonCugNumber?: string; // CUG नभएका
  dutyFitness?: string; // ड्युटी गर्न सक्ने/नसक्ने
  permanentAddress?: string; // वतन
  fatherName?: string; // बुबाको नाम
  motherName?: string; // आमाको नाम
  citizenshipNo?: string; // नागरिकता नं.
  vehicleNumber?: string; // सवारी साधन नं.
  sanchaApNo?: string; // संचाअप नं.
  email?: string; // Email
  propertyOrAsset?: string; // भएको/नभएको
  panNumber?: string; // PAN
  bankAccount?: string; // बैंक खाता
  remarks?: string; // कैफियत / कै.
  religion?: string; // धर्म (e.g., 'हिन्दु')
  headOfFamily?: string; // घरमूलीको नाम
  companyOrTeam?: string; // कम्पनी तथा कार्यदल (e.g., 'क कम्पनी', 'ख कम्पनी', 'विशेष कार्यदल (QRF)')

  // System & mobile communications
  phone: string;
  bloodGroup: string;
  role: string;
  section: string;
  avatarUrl?: string;
  isCommander?: boolean;
  pin?: string;
  qrCodeDataUrl?: string; // Cached personal QR Code Data URL
}

export interface AttendanceRecord {
  id: string;
  officerId: string;
  officerName: string;
  officerRank: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'उपस्थित' | 'ढिलो' | 'अनुपस्थित' | 'ड्युटीमा';
  coords: { lat: number; lng: number };
  distanceFromBattalionMeters: number;
  deviceInfo: string;
  verificationMethod: 'GPS + PIN' | 'GPS + QR' | 'GPS + Device ID';
  isLate: boolean;
  lateMinutes?: number;
  remarks?: string;
}

export interface DutyItem {
  id: string;
  officerId: string;
  title: string;
  date: string;
  timeSlot: string; // e.g. "०६:०० बजे - १४:०० बजे"
  dutyType: 'Patrol Duty' | 'Reserve Duty' | 'कार्यालय Duty' | 'विशेष Duty' | 'Night Duty';
  locationName: string;
  coords: { lat: number; lng: number };
  teamMembers: Array<{ name: string; rank: string; phone?: string; role?: string }>;
  commanderName: string;
  commanderRank: string;
  commanderPhone: string;
  vehicleNumber: string;
  vehicleModel: string;
  driverName: string;
  driverPhone: string;
  instructions: string[];
  status: 'सक्रिय' | 'आगामी' | 'सम्पन्न';
}

export interface EmergencyAlert {
  id: string;
  officerId: string;
  officerName: string;
  officerRank: string;
  phone: string;
  coords: { lat: number; lng: number };
  locationName: string;
  timestamp: string;
  batteryLevel: number;
  status: '🚨 आपतकालीन सक्रिय' | 'कन्ट्रोल रूम अलर्ट' | 'टोली परिचालित' | 'समाधान भयो';
  sirenTriggered: boolean;
  note?: string;
  dialedNumber?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  title: string;
  phone: string;
  type: 'कन्ट्रोल' | 'गण' | 'शाखा' | 'अस्पताल' | 'कमाण्डर';
  isOfficialGov: boolean;
  badge?: string;
}

// 1. परिपत्र (Official Circular / Directive from Taluk / HQ Office)
export interface CircularDocument {
  id: string;
  circularNo: string; // प.सं. तथा चलानी नं.
  issuingOffice: string; // तालुक कार्यालय (e.g., 'प्रहरी प्रधान कार्यालय', 'काठमाडौँ उपत्यका प्रहरी कार्यालय')
  title: string;
  date: string; // मिति (e.g. २०८३/०६/१०)
  priority: 'अति गोप्य' | 'जरुरी' | 'सामान्य' | 'सुरक्षा सतर्कता';
  photoUrl: string; // Captured photo / uploaded circular image
  summary: string;
  instructions?: string;
  postedBy: string; // Who broadcasted it
  postedAt: string;
  acknowledgedOfficerIds: string[]; // List of officer IDs who viewed/acknowledged
}

// 2. कार्यालय फोटो ग्यालरी (Battalion Photo Gallery)
export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'परेड तथा कवाज' | 'दंगा नियन्त्रण अभ्यास' | 'विपद् उद्धार' | 'गण परिसर तथा भौतिक संरचना' | 'विशिष्ट सुरक्षा' | 'खेलकुद तथा कल्याण';
  date: string;
  imageUrl: string;
  caption: string;
  uploadedBy: string;
}

// 3. सूचना पाटी (Battalion Digital Notice Board)
export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  category: 'दैनिक रोलकल तथा आदेश' | 'प्रशासनिक सूचना' | 'सरुवा तथा बढुवा' | 'विपद तथा मौसम अलर्ट' | 'तालिम तथा कल्याण';
  priority: 'अति जरुरी' | 'नयाँ' | 'सामान्य';
  content: string;
  postedBy: string;
  attachmentUrl?: string;
  isPinned?: boolean;
}

// 4. गण सम्बन्धी जानकारी विवरण (Battalion Profile & Live Dashboard Config)
export interface BattalionConfig {
  name: string;
  shortCode: string;
  address: string;
  centerCoords: { lat: number; lng: number };
  virtualBoundaryMeters: number; // 50m
  officeContact: string;
  controlRoomContact: string;
  chiefCommanderName: string;
  chiefCommanderRank: string;
  deputyCommanderName: string;
  deputyCommanderRank: string;
  dutyOfficerContact: string;
  establishmentYear: string;
  totalDarbandiStrength: number;
  availableForces: number;
  activeVehicles: number;
  missionStatement: string;
  historyOverview: string;
  announcementTicker?: string;
  logoUrl?: string; // गणको लोगो (Custom Logo URL or Base64/SVG)
  bannerUrl?: string; // कार्यालय / परेड / कमाण्ड फोटो वा ब्यानर
}
