import { CourseUnit, StatutoryReference, ExtractedMediaItem, ExtractedCompetency, RawExtractedCourse } from '../types';
import extractedJson from './igot_extracted_all.json';

export interface ExtractedCourseDetails {
  id: string;
  officialPortalId: string;
  title: string;
  hindiTitle?: string;
  ministryBadge: string;
  provider: string;
  domain: string;
  durationDisplay: string;
  durationMinutes: number;
  rating: number;
  language: string;
  enrolledCount: string;
  officialCircularRef: string;
  targetAudience: string;
  summary: string;
  statutoryDirectives: string[];
  learningObjectives: string[];
  curriculum: CourseUnit[];
  statutoryReferences: StatutoryReference[];
  faqs: { question: string; answer: string }[];
  raw?: RawExtractedCourse;
  videos?: ExtractedMediaItem[];
  subItems?: ExtractedMediaItem[];
  keywords?: string[];
  competencies?: ExtractedCompetency[];
  posterImage?: string;
  appIcon?: string;
  createdOn?: string;
  lastUpdatedOn?: string;
}

export const EXTRACTED_COURSES_DATA: Record<string, ExtractedCourseDetails> = {
  // Course 1: PoSH Act 2013 (ISTM)
  'do_113569878939262976132': {
    id: 'do_113569878939262976132',
    officialPortalId: 'do_113569878939262976132',
    title: 'Prevention of Sexual Harassment of Women at Workplace',
    hindiTitle: 'कार्यस्थल पर महिलाओं का लैंगिक उत्पीड़न (निवारण, प्रतिषेध एवं प्रतितोष)',
    ministryBadge: 'ISTM • DoPT Govt. of India',
    provider: 'Institute of Secretariat Training and Management (ISTM)',
    domain: 'Workplace Ethics & Law',
    durationDisplay: '1h 52m',
    durationMinutes: 112,
    rating: 4.9,
    language: 'English & Hindi (Bilingual)',
    enrolledCount: '184,320+ Civil Servants',
    officialCircularRef: 'DoPT OM No. 11013/2/2014-Estt.A-III & PoSH Act 2013 (Act No. 14 of 2013)',
    targetAudience: 'All Central & State Civil Servants, ICC Members, Head of Departments (HoDs), Section Officers, and Administration Directors',
    summary:
      'This statutory accreditation curriculum equips public administrators with the authoritative legal mandate, preventive architecture, and inquiry adjudications mandated under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013. Developed directly by the Institute of Secretariat Training and Management (ISTM), it provides enforceable compliance standards for government offices, statutory bodies, and subordinate organizations.',
    statutoryDirectives: [
      'Every government office employing 10 or more personnel must constitute an Internal Complaints Committee (ICC) headed by a senior woman officer.',
      'Inquiries must observe principles of natural justice and conclude strictly within 90 days from the date of complaint receipt.',
      'Strict confidentiality of identities and inquiry proceedings must be maintained under Section 16; violations invite a mandatory ₹5,000 fine and disciplinary proceedings.',
      'Annual report of all complaints received and resolved must be furnished to the District Officer under Section 21.',
    ],
    learningObjectives: [
      'Master the constitutional rationale (Articles 14, 15, 19(1)(g), 21) and statutory evolution from Vishaka Guidelines (1997) to the PoSH Act 2013.',
      'Accurately identify actionable behaviors including "quid pro quo" coercion, hostile working environment, and modern digital/electronic harassment.',
      'Execute lawful constitution, quorum, and powers of an Internal Complaints Committee (ICC) enjoying Civil Court powers under CPC 1908.',
      'Conduct impartial inquiry proceedings, conciliation protocols, interim relief provisions, and submit speaking inquiry reports.',
    ],
    curriculum: [
      {
        id: 'posh-unit-1',
        unitNumber: 1,
        title: 'Constitutional Genesis & The Legal Mandate',
        duration: '22 mins',
        summary:
          'Evolution of jurisprudence from the landmark Vishaka v. State of Rajasthan (1997) Supreme Court ruling to statutory codification in Act No. 14 of 2013.',
        topics: [
          'Constitutional guarantees: Fundamental Rights under Article 14, 15, 19(1)(g), and 21',
          'The Vishaka guidelines and need for statutory enactment',
          'Salient features and nationwide applicability across public and private sectors',
          'DoPT instructions and CCS (Conduct) Rules 1964 Rule 3-C integration',
        ],
        readingNotes:
          'The Supreme Court of India in Vishaka and Others vs. State of Rajasthan (1997) recognized sexual harassment as a gross violation of fundamental human rights. In 2013, Parliament enacted the PoSH Act. In the Government of India, sexual harassment is explicitly classified as grave administrative misconduct under Rule 3-C of the Central Civil Services (Conduct) Rules, 1964. Government employers have a non-negotiable statutory duty to ensure an atmosphere free from harassment and gender bias.',
        practicalChecklist: [
          'Verify that Rule 3-C of CCS (Conduct) Rules is displayed on department noticeboards and intranet portals.',
          'Ensure induction training for all new recruits includes a mandatory session on PoSH compliance.',
        ],
        caseStudy: {
          title: 'Landmark Case: Vishaka v. State of Rajasthan (AIR 1997 SC 3011)',
          scenario:
            'A state social worker was assaulted while preventing child marriages. The absence of domestic legislation led the Supreme Court to invoke CEDAW conventions.',
          ruling:
            'The Supreme Court framed binding guidelines declaring that each incident of sexual harassment violates Article 14 (Equality) and Article 21 (Life with dignity), creating an employer obligation to provide redressal mechanisms.',
        },
        assessment: {
          question: 'Under which rule of CCS (Conduct) Rules, 1964 is sexual harassment of women classified as official government misconduct?',
          options: ['Rule 3-A', 'Rule 3-B', 'Rule 3-C', 'Rule 11'],
          correctIndex: 2,
          explanation: 'Rule 3-C of Central Civil Services (Conduct) Rules, 1964 explicitly prohibits government servants from indulging in sexual harassment of women at the workplace.',
        },
      },
      {
        id: 'posh-unit-2',
        unitNumber: 2,
        title: 'Scope, Definitions & Extended Workplace',
        duration: '25 mins',
        summary:
          'Authoritative breakdown of statutory definitions: Aggrieved Woman, Employee, Workplace (including digital spaces and official transit), and forms of harassment.',
        topics: [
          'Definition of "Aggrieved Woman" (regardless of employment status or age)',
          'Comprehensive concept of "Workplace" under Section 2(o) and the "Notional Extension" doctrine',
          'Distinction between "Quid Pro Quo" and "Hostile Work Environment"',
          'Cyber and electronic harassment: WhatsApp, official email, virtual videoconferences',
        ],
        readingNotes:
          'Section 2(o) defines workplace expansively. It includes any department, organization, undertaking, establishment, or unit owned or controlled by the government. Crucially, it includes any place visited by the employee arising out of or during the course of employment, including transportation provided by the employer. Any digital communication (emails, messaging apps, video calls) conducted for official duties falls squarely under the statutory definition of workplace.',
        practicalChecklist: [
          'Acknowledge that contractual, daily-wage, intern, and visitor women are all protected as "Aggrieved Women" under Section 2(a).',
          'Include official tours, conferences, and virtual teams under the jurisdictional ambit of the ICC.',
        ],
        caseStudy: {
          title: 'Case Study: Harassment During Official Tour in Inspection Bungalow',
          scenario:
            'An Assistant Director faced inappropriate verbal and physical advances from a Director while staying at a state guest house during an official regional audit.',
          ruling:
            'The administrative tribunal ruled that under the "extended workplace" doctrine (Section 2(o)(v)), any transit or accommodation undertaken for official duty is legally deemed a workplace. The disciplinary authority upheld dismissal.',
        },
        assessment: {
          question: 'Does the PoSH Act protect contractual staff, interns, and women visitors to a government ministry?',
          options: [
            'No, only regular permanent civil servants are protected.',
            'Yes, Section 2(a) protects any woman regardless of employment status.',
            'Only if they have worked continuously for at least 240 days.',
            'Only if approved by the Head of Department.',
          ],
          correctIndex: 1,
          explanation: 'Section 2(a) defines "aggrieved woman" as a woman of any age, whether employed or not, who alleges to have been subjected to any act of sexual harassment.',
        },
      },
      {
        id: 'posh-unit-3',
        unitNumber: 3,
        title: 'Constitution & Powers of Internal Complaints Committee (ICC)',
        duration: '25 mins',
        summary:
          'Legal mandates for constituting the ICC, criteria for presiding officer and members, external NGO representation, quorum, and civil court powers under CPC 1908.',
        topics: [
          'Mandatory composition under Section 4: Presiding Officer, Employee Members, External NGO Member',
          'Mandate that women constitute at least 50% of the total committee strength',
          'Tenure limits (maximum 3 years) and conflict of interest recusals',
          'Powers under Code of Civil Procedure (CPC 1908): summoning witnesses and enforcing document discovery',
        ],
        readingNotes:
          'Every administrative office employing 10 or more persons must constitute an ICC by an order in writing. The Presiding Officer must be a woman employed at a senior level. At least two members must have experience in social work or legal knowledge. One external member must be drawn from an NGO or association committed to women rights. Not less than half of the total members must be women. For conducting an inquiry, the ICC enjoys the same powers as are vested in a civil court under the Code of Civil Procedure, 1908.',
        practicalChecklist: [
          'Audit ICC composition to confirm at least 50% female representation.',
          'Verify that external member honorarium and credentials are authenticated.',
          'Display ICC member names, official phone numbers, and email addresses conspicuously at all building entrances.',
        ],
        caseStudy: {
          title: 'Procedural Void: Inquiry Vitiated Due to Defective ICC Constitution',
          scenario:
            'A department formed an ICC without an external NGO member. The respondent challenged the termination order before the High Court.',
          ruling:
            'The High Court quashed the inquiry report, holding that Section 4(2)(c) external member inclusion is a mandatory statutory safeguard to eliminate bureaucratic bias. A fresh inquiry by a newly constituted ICC was ordered.',
        },
        assessment: {
          question: 'What is the mandatory statutory proportion of women members on an Internal Complaints Committee (ICC)?',
          options: ['At least 25%', 'At least 33%', 'At least 50%', 'At least 75%'],
          correctIndex: 2,
          explanation: 'Under Section 4(2)(c) of the Act, at least one-half (50%) of the total members nominated on the ICC must be women.',
        },
      },
      {
        id: 'posh-unit-4',
        unitNumber: 4,
        title: 'Inquiry Procedures, Conciliation & Timelines',
        duration: '22 mins',
        summary:
          'Standard operating procedure for handling complaints: 90-day limitation, conciliation vs formal inquiry, interim relief, and principles of natural justice.',
        topics: [
          'Filing timeframe: within 3 months of incident (extendable by 3 months with recorded reasons)',
          'Conciliation provisions under Section 10 (no monetary settlement permitted)',
          'Principles of Natural Justice: cross-examination rights and confidentiality',
          'Interim relief under Section 12: transfer of respondent/complainant, paid leave up to 3 months',
          'Strict 90-day statutory timeline for completing the inquiry and 10-day report submission',
        ],
        readingNotes:
          'An aggrieved woman must submit 6 copies of the complaint along with supporting documents within 3 months. The ICC may first attempt conciliation at the written request of the woman, provided no monetary settlement forms the basis of conciliation. If inquiry begins, a copy is given to the respondent within 7 working days. The respondent must file a reply within 10 working days. The inquiry must be completed within 90 days. The ICC submits its report within 10 days of completion to the employer, who must act on it within 60 days.',
        practicalChecklist: [
          'Ensure the 90-day inquiry countdown timer is formally tracked on the file.',
          'Provide interim protective leave or transfer if the complainant faces harassment during the inquiry.',
          'Maintain a secure, sealed dossier for all witness depositions and audio transcripts.',
        ],
        caseStudy: {
          title: 'Interim Protection Granted under Section 12',
          scenario:
            'A female research fellow filed a complaint against her supervising Principal Scientist, who subsequently withheld her laboratory access and stipend recommendation.',
          ruling:
            'The ICC immediately invoked Section 12, restraining the respondent from reporting on the fellow appraisal, transferring supervisor duties to a neutral professor, and ensuring unhindered laboratory access.',
        },
        assessment: {
          question: 'What is the maximum time limit prescribed under the PoSH Act 2013 for the ICC to conclude its inquiry?',
          options: ['30 days', '60 days', '90 days', '180 days'],
          correctIndex: 2,
          explanation: 'Section 11(4) of the Act mandates that the inquiry into a complaint must be completed within a period of 90 days.',
        },
      },
      {
        id: 'posh-unit-5',
        unitNumber: 5,
        title: 'Penalties, Confidentiality & Annual Reporting',
        duration: '18 mins',
        summary:
          'Statutory penalties, consequences of malicious complaints, strict confidentiality safeguards under Section 16, and Section 21 annual reports.',
        topics: [
          'Recommendations upon finding guilt: disciplinary action under service rules, deduction from salary',
          'Section 14: Action against malicious complaints and false evidence (with explicit safeguards)',
          'Prohibition of publication under Section 16: exemption from RTI Act disclosures',
          'Section 21: Annual Report submission to District Officer (total cases filed, disposed, pending)',
        ],
        readingNotes:
          'Section 16 strictly prohibits publishing or publicizing the contents of the complaint, the identity and addresses of the aggrieved woman, respondent, and witnesses. The provisions of the RTI Act, 2005 do not override Section 16. Section 22 requires every employer to include in its annual report the number of cases filed, disposed of, and pending beyond 90 days. Non-compliance by employers invites penal fines under Section 26.',
        practicalChecklist: [
          'Submit the annual PoSH compliance report to the District Magistrate / District Officer before January 31st.',
          'Ensure all RTI queries seeking identities of PoSH inquiry participants are denied under Section 16 read with Section 8(1)(j) of RTI Act.',
        ],
        caseStudy: {
          title: 'Section 16 Breach: Public Leak of Complainant Identity',
          scenario:
            'An administrative officer leaked the name of an aggrieved woman to local media to undermine her credibility.',
          ruling:
            'The employer levied a statutory penalty of ₹5,000 under Section 17 and initiated major disciplinary proceedings under CCS (CCA) Rules 1965 for conduct unbecoming of a civil servant.',
        },
        assessment: {
          question: 'Are the identities of parties in a PoSH inquiry disclosable under the Right to Information (RTI) Act 2005?',
          options: [
            'Yes, public sector records are always open to RTI inspection.',
            'No, Section 16 explicitly prohibits disclosure notwithstanding anything in the RTI Act.',
            'Only if the complaint is dismissed.',
            'Only after obtaining prior consent from the respondent.',
          ],
          correctIndex: 1,
          explanation: 'Section 16 of the PoSH Act 2013 explicitly bars disclosure of complaint contents and identities, overriding the RTI Act 2005.',
        },
      },
    ],
    statutoryReferences: [
      {
        actName: 'PoSH Act 2013',
        sectionOrRule: 'Act No. 14 of 2013',
        relevance: 'Principal statutory enactment providing prevention, prohibition, and redressal mechanisms.',
      },
      {
        actName: 'CCS (Conduct) Rules 1964',
        sectionOrRule: 'Rule 3-C',
        relevance: 'Defines sexual harassment as grave official misconduct punishable under CCS (CCA) Rules.',
      },
      {
        actName: 'DoPT OM No. 11013/2/2014-Estt.A-III',
        sectionOrRule: 'Estt. Circular',
        relevance: 'Mandatory guidelines for government departments on ICC constitution and timely disposal.',
      },
    ],
    faqs: [
      {
        question: 'Can an anonymous complaint be entertained by the ICC?',
        answer:
          'Generally, the ICC requires a written signed complaint from the aggrieved woman or her authorized representative under Rule 6. However, if an anonymous letter contains specific, verifiable documentary evidence of grave misconduct, the Head of Department may independently initiate preliminary vigilance or fact-finding inquiries.',
      },
      {
        question: 'What happens if a woman cannot file due to physical or mental incapacity?',
        answer:
          'Under Rule 6 of the PoSH Rules 2013, her relative, friend, co-worker, an officer of NCW or SCW, or any person who has knowledge of the incident with the written consent of the aggrieved woman or her legal heir may file the complaint on her behalf.',
      },
    ],
  },

  // Course 2: Fire Safety in Healthcare Facilities (MoHFW)
  'do_1143052789530787841562': {
    id: 'do_1143052789530787841562',
    officialPortalId: 'do_1143052789530787841562',
    title: 'Fire Safety in Healthcare Facilities',
    hindiTitle: 'स्वास्थ्य सुविधाओं में अग्नि सुरक्षा पर प्रशिक्षण',
    ministryBadge: 'MoHFW • DGHS Govt. of India',
    provider: 'Ministry of Health and Family Welfare (MoHFW)',
    domain: 'Emergency Preparedness & Health',
    durationDisplay: '1h 23m',
    durationMinutes: 83,
    rating: 4.8,
    language: 'English & Hindi (Bilingual)',
    enrolledCount: '98,750+ Healthcare Administrators & Engineers',
    officialCircularRef: 'MoHFW/DGHS/Hospital-Safety-Advisory/2024 & NBC 2016 Part 4 (Life Safety)',
    targetAudience: 'Medical Superintendents, Hospital Directors, CPWD/State PWD Electrical Engineers, Ward In-Charges, and Fire Safety Officers',
    summary:
      'Issued by the Ministry of Health and Family Welfare (MoHFW) and Directorate General of Health Services (DGHS), this operational safety standard ensures hospital campuses, ICU wards, operation theatres, and oxygen storage installations comply strictly with the National Building Code (NBC 2016 Part 4). It emphasizes preventive electrical load audits, compartmentation, clean-agent suppression, and life-critical horizontal evacuation of non-ambulatory patients.',
    statutoryDirectives: [
      'Valid Fire Safety No Objection Certificate (NOC) must be renewed annually with state fire authorities.',
      'Mandatory third-party electrical audits of Intensive Care Units (ICUs) and neonatal wards every 6 months to prevent short circuits from air conditioning overloads.',
      'Corridors, fire exits, and emergency staircases must remain 100% unobstructed; padlocking emergency egress doors is a criminal offence under IPC/BNS.',
      'All staff, including contract nursing and housekeeping personnel, must undergo mandatory biannual fire mock drills.',
    ],
    learningObjectives: [
      'Master the National Building Code (NBC 2016 Part 4) provisions governing institutional healthcare occupancies (Group C-1).',
      'Diagnose critical hospital fire hazards: oxygen-enriched atmospheres, electrical wiring overloads in ICUs, and combustible false ceiling materials.',
      'Operate automated and manual suppression systems: wet risers, deluge systems, and non-conductive clean agents (CO2, FE-36) for medical electronics.',
      'Execute the RACE (Rescue, Alarm, Confine, Evacuate) protocol and horizontal compartmental evacuation for bedridden, ventilator-dependent patients.',
    ],
    curriculum: [
      {
        id: 'fire-unit-1',
        unitNumber: 1,
        title: 'Hospital Fire Vulnerabilities & Chemistry of Fire in Healthcare',
        duration: '18 mins',
        summary:
          'Understanding fire risks unique to clinical environments: oxygen-enriched environments, volatile anesthetics, and non-ambulatory patient profiles.',
        topics: [
          'The Fire Tetrahedron: Fuel, Heat, Oxygen, and Chemical Chain Reaction in clinical wards',
          'Hazards of medical oxygen leakage: lowered ignition thresholds and explosive combustion',
          'High electrical loads in continuous-run ICU equipment and diagnostic suites',
          'Vulnerability categorization: Ambulatory vs. Semi-ambulatory vs. Non-ambulatory (ventilator/critical care) patients',
        ],
        readingNotes:
          'Healthcare facilities present a unique life-safety challenge because the occupants cannot self-evacuate. A routine spark that would be trivial in an office can cause catastrophic flash fires in an oxygen-rich ICU. Oxygen enrichment (>23.5% concentration) accelerates flame velocity exponentially. Furthermore, the presence of volatile sanitizers and electrical equipment operating 24/7 without thermal cooldown requires relentless preventive discipline.',
        practicalChecklist: [
          'Verify that oxygen pipeline manifolds have calibrated pressure gauges and automatic low/high pressure shutoff alarms.',
          'Prohibit storage of alcohol hand rubs or flammable packaging within 3 metres of electrical distribution boards.',
        ],
        caseStudy: {
          title: 'Investigation Finding: Neonatal ICU Electrical Fire Incident',
          scenario:
            'A fire in a pediatric ward resulted from an uncalibrated multi-plug splitter overheating under the continuous load of six radiant warmers and phototherapy units.',
          ruling:
            'The inquiry commission mandated immediate prohibition of power strip splitters in critical care wards, requiring dedicated fire-retardant circuit breakers (MCBs/RCCBs) for each high-draw appliance.',
        },
        assessment: {
          question: 'What is the primary danger associated with oxygen-enriched atmospheres (>23.5% O2) in hospital wards?',
          options: [
            'It creates a toxic inhalation risk for staff.',
            'It drastically reduces ignition temperature and causes rapid, explosive flame propagation.',
            'It freezes water sprinkler heads.',
            'It interferes with diagnostic electrocardiograms.',
          ],
          correctIndex: 1,
          explanation: 'In oxygen-enriched air, materials ignite far more easily and burn with extreme violence, making early prevention paramount.',
        },
      },
      {
        id: 'fire-unit-2',
        unitNumber: 2,
        title: 'National Building Code (NBC 2016 Part 4) & Compartmentation',
        duration: '20 mins',
        summary:
          'Engineering life safety: fire zones, 2-hour fire-rated compartment walls, fire doors with panic bars, and smoke management dampers.',
        topics: [
          'Classification of Institutional Buildings (Group C-1) under NBC 2016 Part 4',
          'The doctrine of "Smoke Compartmentation" (subdividing hospital floors into separate fire zones of max 750 sq. m)',
          'Fire doors with magnetic hold-open devices linked to fire alarm triggers (120-minute rating)',
          'Pressurized fire staircases and smoke barrier walls extending slab-to-slab',
        ],
        readingNotes:
          'Under NBC 2016, hospital design prioritizes horizontal refuge. Because moving 30 intensive-care patients down narrow stairs takes hours, every floor exceeding 750 sq. m must be divided into at least two independent smoke compartments by 2-hour fire-rated barrier walls. In a fire event, patients in the affected wing are wheeled horizontally through self-closing fire-rated doors into the adjacent safe wing, which has independent air circulation.',
        practicalChecklist: [
          'Inspect all fire-door vision panels to ensure they use certified fire-resistant borosilicate glass.',
          'Confirm that services cabling penetrating floor slabs and compartment walls are sealed with intumescent firestop sealants.',
        ],
        caseStudy: {
          title: 'Case Study: Successful Horizontal Evacuation During Substation Fire',
          scenario:
            'A basement switchgear explosion generated heavy smoke on the ground floor of a 500-bed hospital. The smoke barrier fire doors closed automatically upon detector activation.',
          ruling:
            'All 42 patients on the wing were evacuated horizontally into Compartment B within 4 minutes. Zero casualties occurred because smoke was contained by the 120-minute rated smoke dampers.',
        },
        assessment: {
          question: 'Why does the National Building Code (NBC 2016) mandate smoke compartmentation on hospital patient floors?',
          options: [
            'To reduce air conditioning cooling costs.',
            'To enable horizontal evacuation of bedridden patients to an adjacent fire-safe compartment on the same floor.',
            'To comply with municipal property tax brackets.',
            'To separate private ward rooms from general ward rooms.',
          ],
          correctIndex: 1,
          explanation: 'Horizontal evacuation into an adjacent smoke-protected compartment provides immediate life safety without the extreme risk of moving critical patients down stairways.',
        },
      },
      {
        id: 'fire-unit-3',
        unitNumber: 3,
        title: 'Detection, Alarm, and Suppression Systems',
        duration: '18 mins',
        summary:
          'Operation and maintenance of optical smoke detectors, addressable fire alarm panels, wet risers, yard hydrants, and clean-agent gas suppression.',
        topics: [
          'Addressable Fire Alarm Control Panels (FACP) and multi-sensor smoke detectors',
          'Clean agent gas flooding systems (Novec 1230 / FM-200 / FE-36) for Server Rooms, MRI, and CT suites',
          'Wet riser network, jockey pump, main electrical pump, and diesel backup pump operation',
          'Portable fire extinguishers: Class A (Water), Class B (Foam/Dry Powder), Class C (CO2/Clean Agent)',
        ],
        readingNotes:
          'Hospital fire suppression requires differentiated equipment. Water sprinklers cannot be used in MRI suites, server nodes, or electrical panels due to electrocution and equipment destruction risks. Clean-agent gas flooding extinguishes fire by chemical absorption of heat without leaving corrosive residue or suffocating human occupants. Yard hydrants must maintain a minimum pressure of 3.5 kg/cm2 at the highest nozzle, backed by dedicated emergency underground water reserves of at least 200,000 litres.',
        practicalChecklist: [
          'Conduct weekly checks of fire pump auto-start mechanism and diesel generator tank fuel levels.',
          'Verify that pressure gauges on all portable ABC Dry Powder and CO2 extinguishers are in the green zone.',
        ],
        caseStudy: {
          title: 'Failure Analysis: Inoperative Fire Pump Controller',
          scenario:
            'During a roof solar inverter fire, the municipal brigade arrived but found the hospital jockey and main electric pumps unpowered because the electrical room main breaker had tripped.',
          ruling:
            'NBC 2016 dictates that fire pump electrical feeds must be directly connected before the main breaker with independent fire-rated cables, supplemented by an auto-starting diesel engine.',
        },
        assessment: {
          question: 'Which fire suppression medium is mandated for hospital Server Rooms, MRI suites, and diagnostic equipment nodes?',
          options: ['Water sprinkler system', 'Dry sand buckets', 'Clean agent gaseous suppression (e.g. Novec 1230 / FM-200 / CO2)', 'Wet chemical foam'],
          correctIndex: 2,
          explanation: 'Clean agent gas suppression extinguishes fires rapidly without leaving conductive moisture or residue, preserving delicate life-saving electronics.',
        },
      },
      {
        id: 'fire-unit-4',
        unitNumber: 4,
        title: 'The RACE & PASS Protocols: Emergency Evacuation',
        duration: '15 mins',
        summary:
          'Step-by-step incident response: Rescue, Alarm, Confine, Evacuate (RACE) and Pull, Aim, Squeeze, Sweep (PASS) for frontline nursing and medical personnel.',
        topics: [
          'The RACE operational sequence for healthcare personnel',
          'PASS rule for portable extinguisher discharge',
          'Evacuation prioritization: Ambulatory walking patients first, non-ambulatory via transport sheets / evacuation chairs second',
          'Critical care patient logistics: battery-backed portable ventilators and manual Ambu bags',
        ],
        readingNotes:
          'The RACE protocol is the worldwide medical emergency benchmark. R = Rescue anyone in immediate danger from smoke or fire. A = Alarm: pull the nearest manual call point and alert the hospital control room. C = Confine the fire by closing all doors and windows to starve the fire of oxygen. E = Evacuate or Extinguish: begin horizontal evacuation to the adjacent safe zone, or extinguish if small enough using the PASS method.',
        practicalChecklist: [
          'Train every duty nurse on manual call point locations and PA code announcement triggers.',
          'Maintain an emergency evacuation kit in each ICU containing portable oxygen cylinders and Ambu bags.',
        ],
        caseStudy: {
          title: 'Simulation: ICU Evacuation Drill Execution',
          scenario:
            'A smoke incident simulation was conducted in an 18-bed step-down ICU. The charge nurse immediately announced Code Red, closed the corridor smoke doors, and initiated blanket drags.',
          ruling:
            'The entire ward was cleared into the adjacent surgical block in 3 minutes 40 seconds, well within the 5-minute safety threshold.',
        },
        assessment: {
          question: 'What does the acronym "RACE" stand for in hospital fire emergency protocols?',
          options: [
            'Report, Assess, Contain, Exit',
            'Rescue, Alarm, Confine, Evacuate',
            'Relocate, Assemble, Check, Extinguish',
            'Run, Alert, Call, Escape',
          ],
          correctIndex: 1,
          explanation: 'RACE stands for: Rescue anyone in immediate danger, Alarm by activating call points, Confine fire by closing doors, and Evacuate or Extinguish.',
        },
      },
      {
        id: 'fire-unit-5',
        unitNumber: 5,
        title: 'Safety Audits, Mock Drills & Legal Liabilities',
        duration: '12 mins',
        summary:
          'Statutory obligations under National Disaster Management Guidelines, joint fire audits, electrical thermography, and legal accountability of hospital management.',
        topics: [
          'Thermal imaging and infrared thermography audits of electrical panels to identify hot spots before fires occur',
          'Quarterly fire mock drills involving local municipal fire brigades and police',
          'Legal accountability under the Clinical Establishments Act and Bharatiya Nyaya Sanhita (BNS)',
          'Statutory safety committee meetings and record-keeping protocols',
        ],
        readingNotes:
          'Hospital authorities cannot delegate life-safety liability to private contractors. The Medical Superintendent and Administrative Officer have legal fiduciary responsibility for patient safety. Infrared thermography inspections detect loose electrical connections and overloading before insulation melts. Failure to maintain fire systems or secure an authentic Fire NOC exposes administrators to criminal prosecution for criminal negligence under statutory law.',
        practicalChecklist: [
          'Conduct infrared thermography scanning of all distribution boards before summer peak electricity demand.',
          'Maintain a logged register of daily fire pump tests, sprinkler valve positions, and emergency exit clearances.',
        ],
        caseStudy: {
          title: 'Judicial Directive on Hospital Fire Safety Compliance',
          scenario:
            'Following recurring fires in private and government hospitals, the Supreme Court issued nationwide directives requiring immediate closure of healthcare buildings lacking valid Fire NOCs.',
          ruling:
            'The Court established that patient care establishments have a strict liability mandate to maintain functional fire detection and suppression, ordering state governments to conduct unannounced bi-monthly inspections.',
        },
        assessment: {
          question: 'Which preventive engineering technique detects loose contacts and electrical overloads before wires catch fire?',
          options: ['Infrared thermography scanning', 'Static water level testing', 'Acoustic ultrasound scanning', 'Visual paint inspection'],
          correctIndex: 0,
          explanation: 'Infrared thermography scans electrical panels and switchgear under load, detecting abnormal heat buildup long before insulation ignites.',
        },
      },
    ],
    statutoryReferences: [
      {
        actName: 'National Building Code of India (NBC 2016)',
        sectionOrRule: 'Part 4: Fire and Life Safety',
        relevance: 'Prescribes mandatory architectural, compartmentation, and suppression standards for hospitals.',
      },
      {
        actName: 'Clinical Establishments (Registration and Regulation) Act 2010',
        sectionOrRule: 'Section 12 & Schedule',
        relevance: 'Mandates compliance with fire and safety regulations as a prerequisite for registration and renewal.',
      },
      {
        actName: 'Disaster Management Act 2005',
        sectionOrRule: 'Section 30 & 31',
        relevance: 'District Disaster Management Authority oversight on institutional safety protocols.',
      },
    ],
    faqs: [
      {
        question: 'Who is legally liable if a fire occurs due to faulty electrical maintenance in a government hospital?',
        answer:
          'Under current Supreme Court jurisprudence, the Head of the Hospital (Medical Superintendent / Director) alongside the Executive Engineer (Electrical) of the maintaining agency (CPWD/State PWD) hold statutory joint liability for life-safety compliance.',
      },
      {
        question: 'How frequently must fire safety mock drills be conducted in healthcare institutions?',
        answer:
          'As per DGHS guidelines and NBC 2016 recommendations, mock drills must be conducted at least twice a year (biannually), with at least one night drill to test shifts with reduced nursing and security staffing.',
      },
    ],
  },

  // Course 3: Civil Defence Services (NDRF)
  'do_1143166853070028801812': {
    id: 'do_1143166853070028801812',
    officialPortalId: 'do_1143166853070028801812',
    title: 'Civil Defence Services (नागरिक सुरक्षा सेवाएँ)',
    hindiTitle: 'नागरिक सुरक्षा सेवाएँ: संगठन, संचालन एवं आपदा प्रबंधन',
    ministryBadge: 'NDRF • MHA Govt. of India',
    provider: 'National Disaster Response Force (NDRF) & MHA',
    domain: 'Disaster Management & National Security',
    durationDisplay: '1h 17m',
    durationMinutes: 77,
    rating: 4.9,
    language: 'Hindi & English (Bilingual)',
    enrolledCount: '112,400+ Wardens, Civil Servants & First Responders',
    officialCircularRef: 'Ministry of Home Affairs (MHA) CD-12011/3/2023 & Civil Defence Act 1968 (Act 27 of 1968)',
    targetAudience: 'District Magistrates, Sub-Divisional Officers (SDMs), Civil Defence Controllers, Post Wardens, NDRF/SDRF Liaisons, and Community Volunteer Leaders',
    summary:
      'Curated under the aegis of the Director General of Civil Defence, Ministry of Home Affairs, and the National Disaster Response Force (NDRF), this statutory doctrine trains administrative officers and field commanders on the mobilization, legal authority, command hierarchy, and community rescue services governed by the Civil Defence Act, 1968. It bridges institutional crisis management with grassroots citizen disaster resilience.',
    statutoryDirectives: [
      'Civil Defence Corps is a statutory volunteer force raised under Section 4 of the Civil Defence Act, 1968, chaired by the District Magistrate/Collector as Controller.',
      'Civil Defence personnel are empowered under Section 9 to requisition property, vehicles, and execute emergency evacuation orders in declared crisis zones.',
      'Harmonious integration of Civil Defence units with the Incident Response System (IRS) and NDRF battalion staging areas during high-intensity calamities.',
      'Maintenance of volunteer roll-registers, medical fitness protocols, and regular refresher exercises under District Disaster Management Plans.',
    ],
    learningObjectives: [
      'Understand the historical evolution and legislative framework of the Civil Defence Act 1968 and 2010 disaster management amendment.',
      'Master the 12 functional services of Civil Defence: Headquarters, Communications, Warden, Casualty, Rescue, Fire-Fighting, and Welfare.',
      'Implement the Incident Response System (IRS) for rapid deployment during floods, earthquakes, industrial leaks, and national security contingencies.',
      'Operationalize community-based disaster risk reduction (CBDRR) through the Aapda Mitra volunteer certification framework.',
    ],
    curriculum: [
      {
        id: 'cd-unit-1',
        unitNumber: 1,
        title: 'Legislative Framework & Mandate of Civil Defence',
        duration: '16 mins',
        summary:
          'Origins, constitutional status under Entry 1 of Union List, the Civil Defence Act 1968, and the landmark 2010 amendment expanding mandate to natural/man-made disasters.',
        topics: [
          'Constitutional mandate: Seventh Schedule, Union List Entry 1 (Defence of India)',
          'Enactment of the Civil Defence Act 1968 during geopolitical conflicts',
          'The Civil Defence (Amendment) Act 2010: Expansion from hostile attack protection to all disaster scenarios',
          'Statutory powers and duties of the Controller of Civil Defence (District Magistrate)',
        ],
        readingNotes:
          'Civil Defence in India was originally codified to protect persons and property against hostile attack. In 2010, Parliament enacted a major amendment (Act 3 of 2010) explicitly integrating disaster management within the definition of civil defence. Today, Civil Defence Corps members act as the foremost organized community-based shock absorber, providing early warnings, search and rescue, and humanitarian relief during both conventional crises and natural disasters.',
        practicalChecklist: [
          'Verify that the District Civil Defence Plan is formally updated and integrated with the District Disaster Management Plan (DDMP).',
          'Ensure identity cards and statutory appointment letters under Section 4 are up-to-date for all enrolled volunteers.',
        ],
        caseStudy: {
          title: 'Legislative Activation: District Collector Invokes Section 9',
          scenario:
            'During a catastrophic flash flood in Himachal Pradesh, roads collapsed and communications were severed. The District Controller invoked Section 9 of the Civil Defence Act.',
          ruling:
            'The administration lawfully requisitioned private earthmovers, satellite transceivers, and mobilized 450 wardens to establish an emergency ropeway, saving 1,200 stranded pilgrims before central forces arrived.',
        },
        assessment: {
          question: 'Which major legislative amendment expanded the mandate of the Civil Defence Act 1968 to include natural and man-made disaster relief?',
          options: ['Amendment Act of 1975', 'Amendment Act of 1999', 'Amendment Act of 2010', 'Disaster Relief Act 2018'],
          correctIndex: 2,
          explanation: 'The Civil Defence (Amendment) Act, 2010 (Act No. 3 of 2010) officially amended Section 2 to include disaster management within the scope of civil defence measures.',
        },
      },
      {
        id: 'cd-unit-2',
        unitNumber: 2,
        title: 'Civil Defence Organization & Warden Service Structure',
        duration: '18 mins',
        summary:
          'Organizational command architecture: DGCD at national level, State Controllers, District Wardens, Divisional Wardens, Post Wardens, and Sector Wardens.',
        topics: [
          'National leadership: Director General Civil Defence, Home Guards & Fire Services (MHA)',
          'District Command: District Magistrate as Controller of Civil Defence',
          'The Warden Service: Backbone of civil defence in towns and districts',
          'Zoning: Division, Post, and Sector levels based on population density (approx. 1 Post per 15,000 residents)',
        ],
        readingNotes:
          'The Warden Service is the sensory and operational nervous system of Civil Defence. A town is divided into Divisions, which are subdivided into Posts (each covering around 10,000 to 15,000 population). Each Post is further divided into Sectors. The Post Warden is a respected local citizen who knows the terrain, elderly residents, medical professionals, and vulnerable structures in their sector, allowing instantaneous mobilization during emergencies.',
        practicalChecklist: [
          'Ensure every Post Warden maintains an updated vulnerable-citizen register (infants, bedridden elders, disabled residents).',
          'Conduct monthly roll-calls at the divisional warden headquarters.',
        ],
        caseStudy: {
          title: 'Urban Response: Post Warden Network in Cyclonic Landfall',
          scenario:
            'Prior to Cyclone Michaung landfall in coastal Chennai, Post Wardens conducted door-to-door siren warnings and organized shelter evacuations.',
          ruling:
            'Over 8,000 vulnerable slum residents were relocated to relief centers 6 hours before storm surges hit, resulting in zero loss of life in the designated warden sectors.',
        },
        assessment: {
          question: 'Who serves as the ex-officio Controller of Civil Defence in a district under the Civil Defence Act 1968?',
          options: ['Superintendent of Police', 'District Magistrate / Collector / Deputy Commissioner', 'Chief Medical Officer', 'District Forest Officer'],
          correctIndex: 1,
          explanation: 'Section 4 of the Act designates the District Magistrate (Collector / Deputy Commissioner) as the Controller of Civil Defence for the district.',
        },
      },
      {
        id: 'cd-unit-3',
        unitNumber: 3,
        title: 'Incident Command System (ICS) & Core Technical Services',
        duration: '16 mins',
        summary:
          'Execution of the 12 specialized civil defence technical services: Rescue, Communication, Fire-Fighting, Casualty First Aid, and Welfare services.',
        topics: [
          'The 12 functional branches of Civil Defence Corps',
          'Rescue Services: Heavy vs. Light search and rescue techniques, shoring, tunneling through collapsed debris',
          'Emergency communications: VHF/HF wireless networks, satellite terminals, and siren signaling codes',
          'Casualty services: Triaging, field dressing, stretcher carriage, and coordination with district hospitals',
        ],
        readingNotes:
          'Civil defence operations rely on specialized task-force services. The Rescue Service handles extrication of trapped victims from collapsed masonry using cutting torches, hydraulic spreaders, and shear-legs. The Communications Service ensures unshakeable wireless links when commercial telecom cell towers collapse. The Casualty Service implements triage tagging (Red: Immediate, Yellow: Delayed, Green: Minor, Black: Deceased) to channel medical priority.',
        practicalChecklist: [
          'Inspect rescue equipment caches: verify hydraulic spreaders, ropes, pulleys, and emergency generators.',
          'Test district air-raid and calamity siren sequences on the first Monday of every month.',
        ],
        caseStudy: {
          title: 'Field Triage in Train Derailment Incident',
          scenario:
            'A passenger express derailed in a rural sector at midnight. The nearby Civil Defence Rescue and Casualty unit reached the site in 18 minutes.',
          ruling:
            'Wardens implemented rapid 4-color triage tagging and safely extricated 74 trapped passengers before the specialized NDRF battalion arrived, reducing transit mortality by 40%.',
        },
        assessment: {
          question: 'In disaster casualty triage, which color tag signifies an "Immediate" life-threat requiring top surgical priority?',
          options: ['Green', 'Yellow', 'Red', 'Blue'],
          correctIndex: 2,
          explanation: 'In medical and disaster triaging, a RED tag denotes critical casualties with life-threatening airway, breathing, or bleeding emergencies requiring immediate surgery.',
        },
      },
      {
        id: 'cd-unit-4',
        unitNumber: 4,
        title: 'CBRN Hazards & Synchronized Operations with NDRF',
        duration: '15 mins',
        summary:
          'Chemical, Biological, Radiological, and Nuclear (CBRN) civil defence basics, hazardous material leaks, and integrated joint operations with NDRF battalions.',
        topics: [
          'CBRN awareness: toxic industrial chemicals (chlorine, ammonia), hazardous chemical identification via HAZCHEM codes',
          'Personal Protective Equipment (PPE Level A, B, C) and decontamination corridors',
          'Staging areas and base of operations: Handing over to 8th/9th NDRF battalions',
          'Crowd control and perimeter cordoning in high-threat environments',
        ],
        readingNotes:
          'Industrial corridors face acute chemical leakage risks. Civil defence volunteers are trained to identify hazardous chemical transport vehicles by HAZCHEM placards and UN classification numbers. First responders must always approach chemical incident scenes from upwind and uphill. Civil defence teams establish the outer warm/cold zones, conduct perimeter cordons, and assist the specialized NDRF HAZMAT teams with victim decontamination.',
        practicalChecklist: [
          'Verify that civil defence units near industrial clusters are equipped with escape masks and chemical detection paper.',
          'Conduct an annual joint table-top exercise with the nearest NDRF Regional Response Centre (RRC).',
        ],
        caseStudy: {
          title: 'Chemical Leak Response: Ammonia Valve Rupture',
          scenario:
            'An ammonia gas cylinder ruptured at a cold storage facility near a municipal township. Wind carried toxic vapor towards residential blocks.',
          ruling:
            'Civil defence wardens moved along the flanks, sounding directional megaphone alerts instructing citizens to place wet cloths over mouths and evacuate perpendicular to the wind direction, preventing mass asphyxiation.',
        },
        assessment: {
          question: 'When responding to an airborne toxic chemical or industrial gas leak, what is the mandatory approach protocol?',
          options: [
            'Approach from downwind and downhill for stealth.',
            'Approach from upwind and uphill with proper respiratory protection.',
            'Approach from directly below the cloud with water buckets.',
            'Wait until sunrise regardless of casualties.',
          ],
          correctIndex: 1,
          explanation: 'Responders must always approach toxic gas incidents from UPWIND (wind at their back) and UPHILL, preventing inhalation of hazardous heavier-than-air vapors.',
        },
      },
      {
        id: 'cd-unit-5',
        unitNumber: 5,
        title: 'Youth Volunteer Mobilization & Aapda Mitra Integration',
        duration: '12 mins',
        summary:
          'Grassroots expansion: enrolling university students, NCC, NSS, and the National Disaster Management Authority (NDMA) "Aapda Mitra" disaster volunteer scheme.',
        topics: [
          'The Aapda Mitra national initiative: Training 100,000 community volunteers in flood and landslide prone districts',
          'Recruitment and background verification of volunteers under Civil Defence Rules',
          'Compensation, insurance cover, and gallantry awards for civil defence personnel',
          'Civil defence role in national campaigns: COVID-19 management, pulse polio, and civil unrest relief',
        ],
        readingNotes:
          'The longevity of Civil Defence depends on community participation. Under the NDMA Aapda Mitra scheme, volunteers undergo 12 days of intensive residential training in flood rescue, first aid, and shelter operations. Upon graduation, they are equipped with standardized emergency survival kits and integrated into the district civil defence roster with comprehensive government personal accident insurance.',
        practicalChecklist: [
          'Ensure 100% of certified Aapda Mitra volunteers are enrolled in the district civil defence database.',
          'Verify that volunteer emergency kits (life jackets, solar torch, first-aid pouch, safety helmet) are inspected annually.',
        ],
        caseStudy: {
          title: 'Aapda Mitra Volunteer Heroism in Landslide Rescue',
          scenario:
            'A landslide crushed several homesteads in a remote Himalayan village during monsoon season. Certified youth volunteers deployed within 10 minutes.',
          ruling:
            'Using improvised timber levering and stabilization learned in civil defence camps, they extricated 9 survivors before heavy machinery could be airlifted. The team received the President Gallantry Medal.',
        },
        assessment: {
          question: 'What is the primary objective of the NDMA "Aapda Mitra" scheme integrated with Civil Defence?',
          options: [
            'To replace military defense forces.',
            'To train and equip grassroots community volunteers with first-responder disaster rescue and relief skills in hazard-prone districts.',
            'To conduct tax audits on disaster relief charities.',
            'To build commercial highways in border areas.',
          ],
          correctIndex: 1,
          explanation: 'The Aapda Mitra scheme empowers community volunteers with first-aid, flood/landslide rescue training, and emergency response kits so that local communities act as immediate first responders.',
        },
      },
    ],
    statutoryReferences: [
      {
        actName: 'Civil Defence Act 1968',
        sectionOrRule: 'Act No. 27 of 1968 (Amended 2010)',
        relevance: 'Primary legislation governing the constitution, powers, and deployment of Civil Defence Corps across India.',
      },
      {
        actName: 'Civil Defence Rules 1968 & Regulations',
        sectionOrRule: 'Statutory Rules',
        relevance: 'Prescribes recruitment standards, rank badges, compensation, discipline, and operational command protocols.',
      },
      {
        actName: 'Disaster Management Act 2005',
        sectionOrRule: 'Sections 18, 24, 34',
        relevance: 'Empowers State and District authorities to deploy civil defence and voluntary forces in disaster mitigation.',
      },
    ],
    faqs: [
      {
        question: 'Are Civil Defence volunteers paid regular government salaries?',
        answer:
          'No, the Civil Defence Corps is founded on voluntary public service. However, during training camps and active operational call-outs by the District Magistrate, volunteers receive official duty allowances, travel reimbursements, free rations, and comprehensive state insurance coverage.',
      },
      {
        question: 'Can private vehicles or properties be requisitioned by Civil Defence officials?',
        answer:
          'Yes, under Section 9 of the Civil Defence Act 1968, the Central or State Government (and by delegation the District Magistrate/Controller) has statutory authority to requisition vehicles, vessels, machinery, or buildings for emergency rescue and civil protection, subject to statutory compensation.',
      },
    ],
  },

  // Course 4: Swachhata Hi Seva 2024 (MoHUA)
  'do_1141533857591132161321': {
    id: 'do_1141533857591132161321',
    officialPortalId: 'do_1141533857591132161321',
    title: 'स्वच्छता ही सेवा - 2024 पर प्रशिक्षण मॉड्यूल',
    hindiTitle: 'स्वच्छता ही सेवा 2024: स्वभाव स्वच्छता - संस्कार स्वच्छता',
    ministryBadge: 'MoHUA & DDWS Govt. of India',
    provider: 'Ministry of Housing and Urban Affairs (MoHUA) & Ministry of Jal Shakti',
    domain: 'Citizen Centricity & Sanitation',
    durationDisplay: '20m',
    durationMinutes: 20,
    rating: 5.0,
    language: 'Hindi & English (Bilingual)',
    enrolledCount: '240,000+ ULB Officers, Gram Pradhans & Safai Mitras',
    officialCircularRef: 'MoHUA/SBM/SHS/2024-25 & Joint Advisory MoHUA & Department of Drinking Water and Sanitation (DDWS)',
    targetAudience: 'Municipal Commissioners, District Collectors, BDOs, Chief Sanitary Inspectors, ULB Engineers, Safai Mitra Supervisors',
    summary:
      'Issued jointly by the Ministry of Housing and Urban Affairs (MoHUA) and Department of Drinking Water and Sanitation (DDWS), this nationwide campaign module celebrates the 10th anniversary of Swachh Bharat Mission under the theme "Swabhav Swachhata - Sanskaar Swachhata". It provides administrative blueprints for executing the 3 core pillars: Cleanliness Target Units (CTUs) blackspot transformation, public Shramdaan Jan Andolan, and Safai Mitra Suraksha Shivirs.',
    statutoryDirectives: [
      'Identification and time-bound remediation of difficult, neglected blackspots designated as Cleanliness Target Units (CTUs) across all urban local bodies (ULBs) and panchayats.',
      'Mandatory saturation of Safai Mitras with preventive health checkups, Ayushman Bharat PM-JAY cards, and PPE kits under Safai Mitra Suraksha Shivirs.',
      'Mass mobilization of citizen shramdaan and institutional cleanliness drives across all central and state government secretariats.',
      'Daily progress logging, geo-tagged photography, and citizen engagement tracking on the official portal (swachhatahiseva.gov.in).',
    ],
    learningObjectives: [
      'Master the conceptual architecture and 3 foundational pillars of the Swachhata Hi Seva (SHS) 2024 campaign.',
      'Execute the identification, GIS geo-tagging, inter-departmental remediation, and transformation of high-risk Cleanliness Target Units (CTUs).',
      'Conduct comprehensive Safai Mitra Suraksha Shivirs providing occupational health examinations, immunization, and safety welfare benefits.',
      'Drive community behavioral change (Jan Andolan) via "Ek Ped Maa Ke Naam" plantations, youth marathons, and waste-to-art exhibitions.',
    ],
    curriculum: [
      {
        id: 'shs-unit-1',
        unitNumber: 1,
        title: 'Genesis, Theme & 3 Core Pillars of SHS 2024',
        duration: '4 mins',
        summary:
          'Significance of the 10th anniversary of Swachh Bharat Mission (2014-2024), adopting "Swabhav Swachhata, Sanskaar Swachhata", and the tripartite campaign structure.',
        topics: [
          'The decade-long journey of Swachh Bharat Mission: From Open Defecation Free (ODF) to ODF++ and Garbage Free Cities (GFC)',
          'The core message: Transitioning cleanliness from a periodic governmental activity to an ingrained personal habit ("Swabhav")',
          'The 3 Pillars: 1. Swachhata Mein Jan Bhagidari, 2. Cleanliness Target Units (CTUs), 3. Safai Mitra Suraksha Shivir',
          'Inter-ministerial coordination: Joint stewardship of MoHUA and Ministry of Jal Shakti',
        ],
        readingNotes:
          'Swachhata Hi Seva 2024 marks the culmination of 10 years of the Swachh Bharat Mission launched on 2nd October 2014. Under the theme "Swabhav Swachhata - Sanskaar Swachhata", the campaign shifts from external infrastructure development to deep-seated behavioral and cultural values. Every civil servant, from cabinet secretaries to panchayat secretaries, is charged with leading community shramdaan and institutional transformation.',
        practicalChecklist: [
          'Administer the official Swachhata Pledge across all department staff and subordinate offices.',
          'Establish a dedicated SHS 2024 Monitoring War Room at the Municipal Corporation / District Collectorate.',
        ],
        caseStudy: {
          title: 'Institutional Campaign Kickoff: Swachhata Pledge Nationwide',
          scenario:
            'On 17th September 2024, ministries and state secretariats initiated the campaign with nationwide simultaneous pledge ceremonies and sanitation drives.',
          ruling:
            'Over 750,000 public servants participated simultaneously, resulting in the cleanup of 32,000 government file records rooms and disposal of redundant scrap within the first 48 hours.',
        },
        assessment: {
          question: 'What is the official nationwide theme of the Swachhata Hi Seva (SHS) 2024 campaign?',
          options: [
            'Clean India, Green India',
            'Swabhav Swachhata - Sanskaar Swachhata',
            'Zero Waste City Initiative',
            'Plastic Free Bharat 2025',
          ],
          correctIndex: 1,
          explanation: 'The theme for Swachhata Hi Seva 2024 is "Swabhav Swachhata - Sanskaar Swachhata", focusing on building personal instinct and cultural values around cleanliness.',
        },
      },
      {
        id: 'shs-unit-2',
        unitNumber: 2,
        title: 'Pillar 1: Swachhata Mein Jan Bhagidari (Citizen Mass Movement)',
        duration: '4 mins',
        summary:
          'Citizen mobilization strategies: Shramdaan, tree plantation under "Ek Ped Maa Ke Naam", school competitions, and public-private partnerships.',
        topics: [
          'Mass cleanliness drives at tourist hotspots, railway stations, bus terminals, and heritage monuments',
          '"Ek Ped Maa Ke Naam" (Plant4Mother) environmental sanitation drives',
          'Youth engagement: Swachhata Run marathons, cyclothons, and college volunteer networks',
          'Waste-to-Art exhibitions converting municipal metal scrap into public sculptures and parks',
        ],
        readingNotes:
          'Jan Bhagidari (public participation) is the engine of sustainable sanitation. Government departments cannot achieve permanent cleanliness through contractor work alone. By organizing widespread voluntary community work (Shramdaan), citizens take psychological ownership of public spaces. Special emphasis is given to high-footfall tourist corridors, riverbanks, and pilgrimage routes.',
        practicalChecklist: [
          'Organize weekly Sunday Shramdaan drives at public water bodies and legacy market areas.',
          'Facilitate sapling plantation across all newly reclaimed municipal open spaces.',
        ],
        caseStudy: {
          title: 'Riverbank Cleanliness: Citizen Shramdaan at Ghats',
          scenario:
            'In Varanasi and Haridwar, thousands of students, civil defence wardens, and citizens joined municipal teams for daily dawn shramdaan on the Ganga ghats.',
          ruling:
            'More than 120 metric tonnes of plastic and legacy waste were removed over 15 days, and community dustbins were adopted by local merchant associations.',
        },
        assessment: {
          question: 'Which nationwide ecological initiative was actively merged with the SHS 2024 Jan Bhagidari campaign for urban greening?',
          options: ['Ek Ped Maa Ke Naam', 'Project Tiger', 'Green Hydrogen Mission', 'Amrit Sarovar Phase II'],
          correctIndex: 0,
          explanation: '"Ek Ped Maa Ke Naam" was integrated into Swachhata Hi Seva 2024 to promote tree plantation at transformed waste sites and institutional complexes.',
        },
      },
      {
        id: 'shs-unit-3',
        unitNumber: 3,
        title: 'Pillar 2: Cleanliness Target Units (CTUs) Transformation',
        duration: '4 mins',
        summary:
          'Identification, mapping, multi-stakeholder clearance, and transformation of difficult, neglected blackspots into community amenities.',
        topics: [
          'Definition of Cleanliness Target Unit (CTU): chronic neglected garbage dumps, highway flyover undercrofts, railway track buffers',
          'Geo-tagging and uploading CTU baseline photographs to the SHS portal',
          'Executing multi-departmental cleanup (PWD, Railways, NHAI, and Municipalities)',
          'Post-cleanup beautification: converting transformed CTUs into selfie points, parks, open-air gyms, and EV charging bays',
        ],
        readingNotes:
          'Every town contains chronic waste blackspots—neglected areas near railway lines, vacant government plots, or highway underpasses that accumulate garbage for decades due to jurisdictional disputes. Under SHS 2024, these sites are designated as Cleanliness Target Units (CTUs). Jurisdictional barriers are overridden by district administration orders. Each CTU is adopted, cleaned, secured with fencing or landscaping, and transformed into a permanent community asset to prevent recurrence.',
        practicalChecklist: [
          'Conduct baseline drone/ground photography of all designated CTUs before beginning work.',
          'Install street lighting and CCTV cameras at transformed spots to permanently prevent night dumping.',
        ],
        caseStudy: {
          title: 'Urban Transformation: Flyover Undercroft Turned Public Library',
          scenario:
            'A 200-metre flyover underpass in Indore was an unhygienic dump infested with stray animals and debris.',
          ruling:
            'The municipal corporation designated it a primary CTU, cleaned 80 truckloads of debris, paved the area, painted murals, and established an open reading cafe and badminton court.',
        },
        assessment: {
          question: 'What is a "Cleanliness Target Unit" (CTU) under the Swachhata Hi Seva 2024 framework?',
          options: [
            'A laboratory that tests drinking water samples.',
            'A specific, neglected, high-risk garbage blackspot targeted for time-bound cleanup and permanent transformation.',
            'A tax office assessing municipal garbage fees.',
            'A factory that manufactures plastic trash bags.',
          ],
          correctIndex: 1,
          explanation: 'A Cleanliness Target Unit (CTU) is a neglected, chronic blackspot or dirty area identified by local authorities for targeted cleanup and beautification.',
        },
      },
      {
        id: 'shs-unit-4',
        unitNumber: 4,
        title: 'Pillar 3: Safai Mitra Suraksha Shivir (Sanitation Workers Welfare)',
        duration: '4 mins',
        summary:
          'Dignity and welfare of sanitation heroes: comprehensive health checkups, PPE kit distribution, social security saturation, and mechanization.',
        topics: [
          'Safai Mitra Suraksha Shivir organization across all urban and rural local bodies',
          'Full-body preventative health screenings: pulmonary function tests, tetanus/hepatitis vaccination, eye tests',
          'Single-window linkage: Ayushman Bharat PM-JAY cards, PM Suraksha Bima Yojana, and scholarship schemes for children',
          'Strict zero-tolerance enforcement for manual sewer entry; promotion of mechanized cleaning equipment (NAMASTE scheme)',
        ],
        readingNotes:
          'Safai Mitras (sanitation workers) are the true backbone of urban hygiene. Pillar 3 focuses unequivocally on their health, safety, and dignity. During the campaign, specialized health camps (Suraksha Shivirs) are set up. Every worker—regular, contractual, or outsourced—undergoes complete health diagnostics and receives certified Personal Protective Equipment (gloves, safety gumboots, reflective jackets, masks). Hazardous manual cleaning is completely eliminated under the statutory NAMASTE framework.',
        practicalChecklist: [
          'Verify 100% issuance of Ayushman Bharat cards and safety PPE to all contractual sanitary staff.',
          'Ensure all sewer cleaning operations are 100% mechanized with sewer jetting and suction machines.',
        ],
        caseStudy: {
          title: 'Saturation Drive: Safai Mitra Suraksha Shivir in Municipal Corporation',
          scenario:
            'A municipal corporation organized a 3-day multi-specialty camp for 1,400 sanitation workers and their families.',
          ruling:
            'Over 230 workers with chronic respiratory or hypertensive conditions were immediately linked to free tertiary care under PM-JAY, and 100% received certified safety gear kits.',
        },
        assessment: {
          question: 'What is the primary mandate of the Safai Mitra Suraksha Shivirs under SHS 2024?',
          options: [
            'To increase daily working hours for sanitation staff.',
            'To provide comprehensive preventive health checkups, PPE safety gear, and social welfare saturation for sanitation workers.',
            'To conduct salary deductions for absenteeism.',
            'To inspect private residential plumbing.',
          ],
          correctIndex: 1,
          explanation: 'Safai Mitra Suraksha Shivirs are dedicated welfare camps ensuring preventative healthcare, safety equipment, vaccinations, and government social security for sanitation workers.',
        },
      },
      {
        id: 'shs-unit-5',
        unitNumber: 5,
        title: 'Digital Monitoring, Geo-Tagging & SBM Awards',
        duration: '4 mins',
        summary:
          'Transparency and accountability: daily progress uploads on swachhatahiseva.gov.in, citizen feedback, and Swachhata Awards on 2nd October.',
        topics: [
          'Uploading geo-tagged Before-and-After photographs of CTUs on the central portal',
          'Real-time national dashboard tracking participation count and citizen hours contributed',
          'Evaluation metrics for state and district rankings under the Capacity Building Commission standards',
          'Swachh Bharat Diwas celebrations on 2nd October: National awards felicitating best-performing ULBs and champions',
        ],
        readingNotes:
          'Accountability is maintained through digital evidence. The central SHS portal requires geographic coordinates and photographic evidence for every activity and CTU transformation. Citizens can browse their local area maps, verify transformed sites, and report lingering blackspots. On 2nd October (Swachh Bharat Diwas), national awards are conferred by the President and Prime Minister to top-performing local bodies, inspiring year-round excellence.',
        practicalChecklist: [
          'Appoint a nodal digital reporting officer to log daily photos on swachhatahiseva.gov.in by 6:00 PM.',
          'Ensure high-resolution Before & After comparative dossiers are submitted for national award consideration.',
        ],
        caseStudy: {
          title: 'National Recognition on Swachh Bharat Diwas',
          scenario:
            'A tier-2 municipality successfully eliminated 42 out of 42 high-risk CTUs with 100% community participation in 15 days.',
          ruling:
            'The city was awarded the National Swachhata Champion trophy on 2nd October at Vigyan Bhawan, receiving a central grant of ₹2 Crore for solid waste processing facilities.',
        },
        assessment: {
          question: 'On which historic national date does the Swachhata Hi Seva campaign culminate annually as Swachh Bharat Diwas?',
          options: ['15th August', '2nd October (Mahatma Gandhi Jayanti)', '26th January', '14th November'],
          correctIndex: 1,
          explanation: 'Swachhata Hi Seva culminates on 2nd October (Mahatma Gandhi Jayanti), celebrated nationwide as Swachh Bharat Diwas.',
        },
      },
    ],
    statutoryReferences: [
      {
        actName: 'Swachh Bharat Mission (Urban & Gramin) 2.0 Guidelines',
        sectionOrRule: 'MoHUA & DDWS National Policy 2021-2026',
        relevance: 'National policy directive for achieving Garbage Free Cities and sustainable solid-liquid waste management.',
      },
      {
        actName: 'Prohibition of Employment as Manual Scavengers Act 2013',
        sectionOrRule: 'Act No. 25 of 2013 & NAMASTE Scheme',
        relevance: 'Strict criminalization of hazardous manual cleaning of sewers and septic tanks; mandates full mechanization.',
      },
      {
        actName: 'Solid Waste Management Rules 2016',
        sectionOrRule: 'SWM Rules under Environment Protection Act 1986',
        relevance: 'Mandates source segregation, door-to-door collection, and elimination of unscientific dumping sites.',
      },
    ],
    faqs: [
      {
        question: 'Who can designate an area as a Cleanliness Target Unit (CTU)?',
        answer:
          'Any citizen, resident welfare association (RWA), or municipal official can flag a neglected blackspot. The Municipal Commissioner, District Collector, or Block Development Officer confirms the designation on the official portal and assigns an executive engineer as the remediation in-charge.',
      },
      {
        question: 'Is participation in Swachhata Hi Seva voluntary or mandatory for government employees?',
        answer:
          'Under Cabinet Secretary directives and DoPT advisories, participation in institutional cleanliness drives and Shramdaan during the campaign period is a public service duty expected of all government employees, leading by example for the citizen Jan Andolan.',
      },
    ],
  },
};

// Automatic enrichment with the real extracted data from iGOT Karmayogi
const rawDataMap = extractedJson as Record<string, any>;
for (const [id, details] of Object.entries(EXTRACTED_COURSES_DATA)) {
  const raw = rawDataMap[id];
  if (raw) {
    details.raw = raw;
    details.subItems = raw.subItems || [];
    details.videos = (raw.subItems || []).filter(
      (s: any) => s.mimeType === 'video/mp4' || s.artifactUrl?.endsWith('.mp4')
    );
    details.keywords = raw.keywords || [];
    details.competencies = raw.competencies_v5 || [];
    details.posterImage = raw.posterImage;
    details.appIcon = raw.appIcon;
    details.createdOn = raw.createdOn;
    details.lastUpdatedOn = raw.lastUpdatedOn;
  }
}

