// Form option lists. MUST stay identical to api/_lib/options.js (the server
// rejects anything not in these lists). The API test suite checks they match.

export const COURSES = [
  "2 Weeks Refresher Course",
  "1 Month Beginners Course",
  "Motorcycle Training",
  "Tricycle (Keke) Training",
  "Truck Driving",
  "Basic Car Maintenance",
  "Mock Driving Tests",
  "Weekly FRSC CBT Tests",
  "Friday Theory Classes",
  "Driver's License Processing",
  "International Driver's License",
  "Accident Management & First Aid",
  "Other",
] as const;

export const VEHICLES = [
  "Manual Car",
  "Automatic Car",
  "Both (Automatic & Manual)",
  "Motorcycle",
  "Tricycle (Keke)",
  "Truck",
] as const;

export const BRANCHES = [
  "Head Office – Old Timber Junction, Umuahia",
  "Office 1 – Umudike",
  "Office 2 – BCA Road (Practical Training Ground)",
  "Office 3 – Aba Road",
] as const;

export const PREFERRED_TIMES = ["Morning", "Afternoon", "Any time"] as const;
