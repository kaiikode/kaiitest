export type TaskStatus =
  "Not Started" | "In Progress" | "Waiting" | "Completed";

export interface ChecklistTask {
  id: string;
  title: string;
  description: string;
  due: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: TaskStatus;
}

export interface BudgetItem {
  id: string;
  name: string;
  category: string;
  estimated: number;
  actual: number;
  paid: number;
  due: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  household: string;
  email: string;
  status: "Not Invited" | "Invited" | "Attending" | "Declined" | "No Response";
  meal: string;
  table: string;
}

export interface Vendor {
  id: string;
  business: string;
  contact: string;
  category: string;
  email: string;
  contract: string;
  cost: number;
  preferred?: boolean;
}

export const couple = {
  names: "Olivia & Marcus",
  firstNames: ["Olivia", "Marcus"],
  weddingDate: "2027-10-17",
  guestCount: 150,
  targetBudget: 85000,
  bookingStatus: "Venue Booked",
  ceremonyStyle: "Outdoor courtyard",
  receptionStyle: "Seated dinner & dancing",
  planningStage: "Vendors booked",
  priorities: ["Guest experience", "Photography", "Food"],
};

export const initialTasks: ChecklistTask[] = [
  {
    id: "t1",
    title: "Confirm photographer",
    description: "Review coverage hours and sign the final agreement.",
    due: "2026-08-02",
    category: "Photography",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "t2",
    title: "Draft guest list",
    description: "Consolidate both household lists and confirm addresses.",
    due: "2026-08-18",
    category: "Guest List",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "t3",
    title: "Select planning team",
    description: "Interview the final two planning partners.",
    due: "2026-09-01",
    category: "Vendors",
    priority: "Medium",
    status: "Not Started",
  },
  {
    id: "t4",
    title: "Save ceremony references",
    description:
      "Collect processional and floral references for the courtyard.",
    due: "2026-09-14",
    category: "Ceremony",
    priority: "Low",
    status: "Not Started",
  },
  {
    id: "t5",
    title: "Book Padua",
    description: "Review agreement and reserve the wedding date.",
    due: "2026-04-10",
    category: "Venue",
    priority: "High",
    status: "Completed",
  },
  {
    id: "t6",
    title: "Set target budget",
    description: "Agree on total investment and category priorities.",
    due: "2026-05-02",
    category: "Budget",
    priority: "High",
    status: "Completed",
  },
  {
    id: "t7",
    title: "Explore catering direction",
    description: "Collect dietary needs and questions for menu planning.",
    due: "2026-10-12",
    category: "Catering",
    priority: "Medium",
    status: "Waiting",
  },
  {
    id: "t8",
    title: "Research entertainment",
    description: "Compare DJ and live music options for dinner and dancing.",
    due: "2026-11-05",
    category: "Entertainment",
    priority: "Medium",
    status: "Not Started",
  },
];

export const initialBudget: BudgetItem[] = [
  {
    id: "b1",
    name: "Padua venue estimate",
    category: "Venue",
    estimated: 28000,
    actual: 28000,
    paid: 7000,
    due: "2027-02-17",
  },
  {
    id: "b2",
    name: "Dinner service",
    category: "Catering",
    estimated: 18000,
    actual: 0,
    paid: 0,
    due: "2027-09-17",
  },
  {
    id: "b3",
    name: "Photography",
    category: "Photography",
    estimated: 8500,
    actual: 8200,
    paid: 2500,
    due: "2027-08-17",
  },
  {
    id: "b4",
    name: "Florals & ceremony design",
    category: "Florals",
    estimated: 9000,
    actual: 0,
    paid: 0,
    due: "2027-09-01",
  },
  {
    id: "b5",
    name: "Entertainment",
    category: "Entertainment",
    estimated: 4500,
    actual: 4200,
    paid: 1000,
    due: "2027-09-17",
  },
  {
    id: "b6",
    name: "Attire",
    category: "Attire",
    estimated: 6000,
    actual: 5400,
    paid: 3200,
    due: "2027-03-15",
  },
];

export const initialGuests: Guest[] = [
  {
    id: "g1",
    firstName: "Elena",
    lastName: "Rivera",
    household: "Rivera Household",
    email: "elena@example.com",
    status: "Attending",
    meal: "Vegetarian",
    table: "8",
  },
  {
    id: "g2",
    firstName: "Daniel",
    lastName: "Rivera",
    household: "Rivera Household",
    email: "daniel@example.com",
    status: "Attending",
    meal: "Chicken",
    table: "8",
  },
  {
    id: "g3",
    firstName: "Sofia",
    lastName: "Chen",
    household: "Chen Household",
    email: "sofia@example.com",
    status: "Invited",
    meal: "Not selected",
    table: "—",
  },
  {
    id: "g4",
    firstName: "Noah",
    lastName: "Williams",
    household: "Williams Household",
    email: "noah@example.com",
    status: "No Response",
    meal: "Not selected",
    table: "—",
  },
  {
    id: "g5",
    firstName: "Amelia",
    lastName: "Brooks",
    household: "Brooks Household",
    email: "amelia@example.com",
    status: "Declined",
    meal: "—",
    table: "—",
  },
];

export const initialVendors: Vendor[] = [
  {
    id: "v1",
    business: "Padua Weddings",
    contact: "Claire Bennett",
    category: "Venue",
    email: "planning@paduaweddings.com",
    contract: "Booked",
    cost: 28000,
    preferred: true,
  },
  {
    id: "v2",
    business: "Mariposa Photo Co.",
    contact: "Ana Flores",
    category: "Photographer",
    email: "ana@example.com",
    contract: "Reviewing",
    cost: 8200,
    preferred: true,
  },
  {
    id: "v3",
    business: "Olive & Vine Floral",
    contact: "Maya Ortiz",
    category: "Florist",
    email: "maya@example.com",
    contract: "Inquired",
    cost: 9000,
    preferred: true,
  },
  {
    id: "v4",
    business: "Night Garden Music",
    contact: "Theo Martin",
    category: "DJ",
    email: "theo@example.com",
    contract: "Booked",
    cost: 4200,
  },
];

export const planningTimeline = [
  {
    date: "Apr 2026",
    title: "Venue reserved",
    detail: "Padua date and spaces confirmed",
    done: true,
  },
  {
    date: "Aug 2026",
    title: "Core creative partners",
    detail: "Photography and planning teams",
    done: false,
  },
  {
    date: "Jan 2027",
    title: "Guest experience plan",
    detail: "Transportation, accommodations, accessibility",
    done: false,
  },
  {
    date: "Apr 2027",
    title: "Invitations sent",
    detail: "RSVP deadline and guest communications",
    done: false,
  },
  {
    date: "Sep 2027",
    title: "Final Padua details",
    detail: "Guest count, menu and final walkthrough",
    done: false,
  },
  {
    date: "Oct 17",
    title: "Wedding day",
    detail: "A considered, generous celebration",
    done: false,
  },
];

export const dayTimeline = [
  {
    time: "12:30 PM",
    end: "2:30 PM",
    title: "Hair & makeup",
    location: "Getting Ready Suite",
    people: "Wedding party",
  },
  {
    time: "2:45 PM",
    end: "3:30 PM",
    title: "Photography begins",
    location: "Spanish Revival arches",
    people: "Olivia, Marcus, photographer",
  },
  {
    time: "4:30 PM",
    end: "5:00 PM",
    title: "Ceremony",
    location: "Courtyard",
    people: "All guests",
  },
  {
    time: "5:00 PM",
    end: "6:00 PM",
    title: "Cocktail hour",
    location: "Fountain terrace",
    people: "All guests",
  },
  {
    time: "6:15 PM",
    end: "10:30 PM",
    title: "Dinner & dancing",
    location: "Theatre",
    people: "All guests",
  },
];

export const inspiration = [
  {
    id: "i1",
    title: "Textural courtyard florals",
    category: "Ceremony",
    color: "#d8cdbd",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "i2",
    title: "Candlelit dinner",
    category: "Table Design",
    color: "#263d32",
    image:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "i3",
    title: "Olive and ivory palette",
    category: "Color Palette",
    color: "#7d8b72",
    image:
      "https://images.unsplash.com/photo-1464699908537-0954e50791ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "i4",
    title: "Architectural portraits",
    category: "Photography",
    color: "#a65f45",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "i5",
    title: "Minimal place settings",
    category: "Reception",
    color: "#b4935a",
    image:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "i6",
    title: "Stone and foliage details",
    category: "Florals",
    color: "#8a725b",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80",
  },
];

export const notes = [
  {
    id: "n1",
    title: "Photography priorities",
    category: "Photography",
    date: "Jul 8, 2026",
    content:
      "Quiet portraits near the olive trees, courtyard architecture, and candid dinner photographs.",
    pinned: true,
  },
  {
    id: "n2",
    title: "Guest comfort",
    category: "Guest Experience",
    date: "Jun 29, 2026",
    content:
      "Confirm accessible arrival route and add a transportation note to the invitation site.",
    pinned: false,
  },
];

export const venueSpaces = [
  {
    name: "Courtyard",
    detail: "Warm stone, open sky and a natural processional axis.",
  },
  {
    name: "Olive trees",
    detail: "Soft, organic portrait setting with late-day light.",
  },
  {
    name: "Spanish Revival architecture",
    detail: "Arches, textured walls and historic details.",
  },
  {
    name: "Theatre",
    detail: "An architectural indoor setting for dinner and dancing.",
  },
  {
    name: "Fountain & tile details",
    detail: "Color, movement and intimate composition.",
  },
  {
    name: "Hillside views",
    detail: "A wide landscape for golden-hour portraits.",
  },
];
