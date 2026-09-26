// Aegis — Sovereign Boundary & Interstate Border Telemetry
// Survey of India & NDMA Compliant Sovereign Demarcation
// Depicts the entire territory of Jammu & Kashmir and Ladakh as an integral, inalienable part of India.

/**
 * Complete Sovereign International Boundary of India
 * Survey of India Official Alignment:
 * - Northern Sector: Entire Jammu & Kashmir and Ladakh (including PoK, Gilgit-Baltistan, Siachen, and Aksai Chin)
 * - Eastern Sector: Entire Arunachal Pradesh (McMahon Line), Sikkim, and North-East
 * - Western & Southern: Complete continental coastline and maritime boundaries
 */
export const INDIA_SOVEREIGN_BORDER = [
  // Starting at Sir Creek, Gujarat
  [23.70, 68.15],
  [23.95, 68.60],
  [24.40, 68.80],
  [24.50, 69.50],
  [24.70, 70.30],
  [24.75, 71.05], // Gujarat-Rajasthan-Pakistan border
  [25.40, 70.50],
  [26.30, 70.20],
  [27.00, 70.00],
  [27.70, 70.50],
  [28.50, 71.50],
  [29.50, 72.50],
  [30.20, 73.50], // Punjab-Pakistan border (Fazilka, Firozpur, Wagah)
  [31.20, 74.50],
  [31.60, 74.60], // Amritsar/Wagah
  [32.20, 74.90],
  [32.50, 74.50], // Jammu sector (Kathua/Samba/Jammu)
  [33.10, 74.00], // Rajouri/Poonch
  [33.80, 74.10], // Uri / Baramulla sector
  [34.30, 73.80], // Muzaffarabad / Neelum Valley (Integral J&K)
  [34.80, 74.20], // Gurez / Karen
  [35.30, 74.50], // Gilgit-Baltistan Northwest boundary
  [35.80, 74.30], // Hunza / Nagar Valley
  [36.30, 74.50], // Wakhan Corridor border (Afghanistan-India border)
  [37.05, 74.80], // Northernmost Point: Indira Col / Karakoram Range
  [36.90, 75.50], // Shaksgam Valley (Integral Indian sovereign territory)
  [36.50, 76.20], // Karakoram Pass
  [36.20, 77.00], // Siachen Glacier / Saltoro Ridge
  [35.80, 78.00], // Kunlun Mountains Northern Aksai Chin
  [35.50, 79.20], // Aksai Chin Eastern Border (Kunlun / Hotan crest)
  [35.00, 80.00], // Aksai Chin Eastern frontier
  [34.40, 79.50], // Spanggur / Pangong Tso East
  [33.90, 79.00], // Chushul / Demchok sector
  [33.20, 79.20], // Indus River Demchok
  [32.70, 79.00], // Himachal Pradesh - Tibet boundary (Kaurik / Shipki La)
  [31.80, 78.60], // Kinnaur border
  [31.30, 78.80], // Uttarakhand - Tibet boundary (Mana Pass, Niti Pass)
  [30.80, 79.80], // Chamoli / Nanda Devi frontier
  [30.30, 80.50], // Kalapani / Lipulekh Pass (India-Nepal-China tri-junction)
  // India-Nepal International Boundary
  [29.80, 80.50],
  [29.00, 80.10],
  [28.50, 81.00],
  [27.70, 82.50],
  [27.40, 83.50],
  [26.90, 85.00],
  [26.60, 86.50],
  [26.80, 88.00], // Nepal-Sikkim border (Kanchenjunga)
  // Sikkim Crown
  [27.60, 88.10],
  [28.05, 88.60], // Northern Sikkim (Naku La)
  [27.80, 88.90],
  [27.30, 88.90], // Doklam / Bhutan border
  // India-Bhutan Boundary
  [27.00, 89.20],
  [26.80, 90.00],
  [26.80, 91.50],
  [27.20, 92.10], // Bhutan-Arunachal Pradesh border
  // Arunachal Pradesh Sovereign McMahon Line
  [27.60, 92.20], // Tawang Sector
  [27.90, 92.50],
  [28.30, 93.50], // Subansiri sector
  [28.70, 94.50], // Siang sector
  [29.00, 95.50], // Dibang Valley
  [28.70, 96.50], // Anjaw / Kibithu
  [28.20, 97.40], // Easternmost point: Diphu Pass (India-Myanmar-China tri-junction)
  // India-Myanmar Boundary
  [27.50, 96.80], // Patkai Range (Arunachal-Myanmar)
  [26.50, 95.20], // Nagaland border
  [25.00, 94.50], // Manipur border (Moreh)
  [24.00, 93.30], // Mizoram border
  [22.50, 93.00],
  [21.80, 92.80], // Southern tip of Mizoram
  // India-Bangladesh Boundary
  [22.20, 92.60],
  [23.50, 92.00], // Tripura East
  [24.00, 92.20],
  [24.50, 92.00], // Assam / Karimganj
  [25.20, 91.50], // Meghalaya border (Cherrapunji/Shillong plateau)
  [25.20, 89.80], // Garo Hills
  [25.70, 89.90], // Dhubri (Assam)
  [26.30, 89.00], // Cooch Behar (West Bengal)
  [26.00, 88.50], // Siliguri Corridor / Dinajpur
  [25.00, 88.20], // Malda
  [24.10, 88.40], // Murshidabad (Ganges border)
  [23.50, 88.70], // Nadia
  [22.80, 88.90], // 24 Parganas
  [21.60, 89.10], // Sundarbans Bay of Bengal Delta
  // Indian Continental Coastline (Bay of Bengal & Arabian Sea)
  [21.60, 87.50], // Digha, West Bengal
  [21.30, 87.10], // Balasore / Chandipur, Odisha
  [20.85, 87.05], // Dhamra Port / Bhadrak Coast
  [20.25, 86.68], // Paradip Port
  [19.80, 85.83], // Puri & Chilika Lake
  [19.28, 84.90], // Gopalpur, Ganjam
  [18.30, 84.00], // Kalingapatnam / Srikakulam, Andhra Pradesh
  [17.68, 83.22], // Visakhapatnam Port
  [16.98, 82.25], // Kakinada
  [16.18, 81.14], // Machilipatnam
  [15.80, 80.60], // Nizampatnam
  [14.45, 80.00], // Nellore / Krishnapatnam Port
  [13.40, 80.30], // Pulicat Lake
  [13.08, 80.27], // Chennai Harbor, Tamil Nadu
  [12.50, 80.15], // Mahabalipuram
  [11.93, 79.83], // Puducherry
  [10.76, 79.84], // Nagapattinam / Karaikal
  [10.30, 79.40], // Point Calimere
  [9.28, 79.31],  // Pamban Island / Rameswaram
  [8.80, 78.15],  // Tuticorin (V.O. Chidambaranar Port)
  [8.08, 77.55],  // KANYAKUMARI (Southernmost Continental Apex)
  // Arabian Sea Coastline
  [8.50, 76.95],  // Thiruvananthapuram (Vizhinjam International Seaport), Kerala
  [9.50, 76.30],  // Alappuzha
  [9.97, 76.28],  // Kochi Port
  [11.25, 75.77], // Kozhikode
  [11.87, 75.37], // Kannur
  [12.87, 74.88], // Mangalore, Karnataka
  [13.34, 74.74], // Udupi
  [14.81, 74.13], // Karwar
  [15.30, 73.80], // Mormugao Port, Goa
  [15.80, 73.60], // Malvan, Maharashtra
  [16.99, 73.30], // Ratnagiri
  [18.95, 72.82], // Mumbai Port & JNPT
  [19.98, 72.75], // Dahanu / Tarapur Atomic Power
  [21.17, 72.83], // Surat / Hazira Port, Gujarat
  [21.65, 72.30], // Gulf of Khambhat / Bhavnagar
  [20.71, 70.98], // Diu
  [20.90, 70.37], // Veraval / Somnath
  [21.63, 69.60], // Porbandar
  [22.24, 68.96], // Dwarka
  [22.47, 69.07], // Okha
  [22.75, 70.10], // Kandla Port (Deendayal Port) / Gulf of Kutch
  [22.85, 69.70], // Mundra Port
  [23.20, 68.60], // Mandvi / Kutch Coast
  [23.70, 68.15]  // Return to Sir Creek
];

/**
 * Key Interstate Boundaries (High-Contrast Delineation for Dark Theme)
 * Accurately divides Indian Coastal States and Northern Frontiers
 */
export const INDIA_STATE_BOUNDARIES = [
  // 1. Jammu & Kashmir — Ladakh UT Delineation Line (Integral Territory)
  {
    name: "J&K — Ladakh Border",
    coords: [
      [36.20, 77.00],
      [35.30, 76.50],
      [34.80, 75.80],
      [34.50, 75.70], // Kargil
      [34.20, 75.40], // Zoji La Pass
      [33.90, 75.70],
      [33.20, 76.30], // Kishtwar/Zanskar
      [32.80, 76.80]
    ]
  },
  // 2. Punjab — Himachal Pradesh — J&K
  {
    name: "J&K — Punjab / HP Border",
    coords: [
      [32.20, 74.90],
      [32.40, 75.40], // Kathua-Pathankot
      [32.80, 76.00], // Chamba-Doda
      [32.80, 76.80]
    ]
  },
  // 3. Odisha — West Bengal Coastal Interstate Boundary
  {
    name: "Odisha — West Bengal Border",
    coords: [
      [21.60, 87.50], // Digha / Talasari Beach
      [21.80, 87.35], // Jaleswar / Subarnarekha River
      [22.15, 86.90], // Mayurbhanj - Jhargram
      [22.45, 86.60]  // Tri-junction with Jharkhand
    ]
  },
  // 4. Odisha — Andhra Pradesh Coastal Interstate Boundary
  {
    name: "Odisha — Andhra Pradesh Border",
    coords: [
      [19.10, 84.80], // Bahuda River mouth / Gopalpur South
      [18.90, 84.50], // Ichchapuram / Berhampur Corridor
      [18.70, 83.90], // Paralakhemundi
      [18.50, 83.20], // Koraput / Visakhapatnam Agency
      [18.10, 82.30]  // Tri-junction with Chhattisgarh
    ]
  },
  // 5. Odisha — Jharkhand Boundary
  {
    name: "Odisha — Jharkhand Border",
    coords: [
      [22.45, 86.60],
      [22.30, 85.80], // Rourkela / Chaibasa
      [22.20, 84.80], // Sundargarh
      [22.35, 84.10]
    ]
  },
  // 6. Odisha — Chhattisgarh Boundary
  {
    name: "Odisha — Chhattisgarh Border",
    coords: [
      [22.35, 84.10],
      [21.50, 83.30], // Sambalpur / Raigarh
      [20.50, 82.50], // Nuapada / Raipur
      [19.00, 82.10], // Malkangiri / Bastar
      [18.10, 82.30]
    ]
  },
  // 7. Andhra Pradesh — Tamil Nadu Interstate Boundary
  {
    name: "Andhra Pradesh — Tamil Nadu Border",
    coords: [
      [13.45, 80.25], // Pulicat Lake barrier
      [13.35, 79.95], // Gummidipoondi / Tada Corridor (NH-16)
      [13.20, 79.50], // Tirupati / Arakkonam
      [12.90, 78.60]  // Tri-junction with Karnataka
    ]
  },
  // 8. Tamil Nadu — Kerala Coastal & Western Ghats Boundary
  {
    name: "Tamil Nadu — Kerala Border",
    coords: [
      [8.30, 77.10],  // Poovar / Kanyakumari Coast
      [8.70, 77.25],  // Shencottah Gap
      [9.50, 77.15],  // Thekkady / Periyar
      [10.10, 77.05], // Munnar / Anamudi
      [10.75, 76.70], // Palakkad Gap
      [11.50, 76.40], // Nilgiris / Wayanad
      [11.80, 76.00]  // Tri-junction with Karnataka
    ]
  },
  // 9. Maharashtra — Gujarat Coastal Interstate Boundary
  {
    name: "Maharashtra — Gujarat Border",
    coords: [
      [20.15, 72.75], // Daman / Talasari (NH-48)
      [20.30, 73.15], // Silvassa / Dadra & Nagar Haveli
      [20.70, 73.80], // Dang / Nashik
      [21.40, 74.30]  // Tapi River / Dhule
    ]
  },
  // 10. Gujarat — Rajasthan Border
  {
    name: "Gujarat — Rajasthan Border",
    coords: [
      [24.75, 71.05], // Rann of Kutch / Barmer
      [24.50, 72.20], // Banaskantha / Mount Abu
      [24.20, 73.00], // Sabarkantha / Udaipur
      [23.50, 74.00]  // Aravalli / Banswara
    ]
  },
  // 11. Maharashtra — Goa Boundary
  {
    name: "Maharashtra — Goa Border",
    coords: [
      [15.75, 73.70], // Terekhol River mouth (North Goa)
      [15.80, 74.10], // Pernem / Sawantwadi
      [15.65, 74.25]  // Dodamarg Western Ghats
    ]
  },
  // 12. Goa — Karnataka Boundary
  {
    name: "Goa — Karnataka Border",
    coords: [
      [15.65, 74.25],
      [15.30, 74.35], // Dudhsagar / Castle Rock
      [14.90, 74.15]  // Karwar / Canacona Coast
    ]
  },
  // 13. Andhra Pradesh — Telangana Boundary
  {
    name: "Andhra Pradesh — Telangana Border",
    coords: [
      [18.10, 82.30],
      [17.50, 81.30], // Bhadrachalam / Godavari River
      [16.80, 80.20], // Khammam / Krishna River
      [16.20, 79.30], // Nagarjuna Sagar
      [15.80, 78.30]  // Srisailam / Kurnool
    ]
  },
  // 14. West Bengal — Bihar / Jharkhand Boundary
  {
    name: "West Bengal — Bihar / Jharkhand Border",
    coords: [
      [26.50, 88.00], // Siliguri / Kishanganj
      [25.30, 87.80], // Katihar / Malda
      [24.50, 87.70], // Rajmahal / Farakka
      [23.70, 86.80], // Asansol / Dhanbad
      [22.45, 86.60]  // Purulia / Jamshedpur
    ]
  }
];

/**
 * Neighboring International Boundaries (For Regional EOC Geospatial Awareness)
 */
export const NEIGHBORING_MARITIME_LINES = [
  // India — Sri Lanka International Maritime Boundary Line (IMBL) in Palk Strait
  {
    name: "India — Sri Lanka IMBL (Palk Strait & Gulf of Mannar)",
    coords: [
      [10.08, 80.05],
      [9.95, 79.85],
      [9.50, 79.55],
      [9.10, 79.35], // Adam's Bridge / Dhanushkodi
      [8.65, 79.05],
      [8.00, 78.80]
    ]
  }
];
