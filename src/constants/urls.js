import { API_URL, ENV, CLIENT_ID, CLIENT_SECRET } from '@env';

export const URLS = {
  // base: 'http://182.18.142.47/ruchi-soya-nutrition/api/', //live
  base: 'http://182.18.142.21/patanjali-dairy/api/', //test

  login: 'users/login',
  profile: 'users/profile',
  errorLog: 'error-logs',
  customer: 'customers/',
  customerToday: 'customers/today',
  customerVisits: 'customer-visits',
  lastVisits: 'latest-customer-visits',
  orderSummary: 'order-summary',
  topProducts: 'top-products',
  attendanceStatus: 'attendances/punch-status',
  attendancePunchIn: 'attendances/punch-in',
  attendancePunchOut: 'attendances/punch-out',
  attendance: 'attendances/',
  todaysOrder: 'user-performance/today-orders',
  myVisits: 'customers/today',
  routesToday: 'routes/today',
  achievements: 'performances/total-achievements',
  customerClass: 'customer-classes',
  route: 'routes',
  customerType: 'customer-types',
  customerActivityCategories: 'customer-activity-categories',
  customerCheckIn: 'customer-visits/check-in',
  customerCheckOut: 'customer-visits/check-out',
  customerVisitStatus: 'customer-visits/status',
  verticals: 'verticals/',
  brands: '/brands/',
  products: '/products',
  allProduct:'/all-products',
  predefineFeedback: 'customer-visits/predefined-feedbacks',
  saveFeedback: 'customer-visits/save-feedbacks',
  orders: 'orders/',
  salesReturn: 'sales-returns',
  scheduleSummary: 'customers/schedule-summary/',
  scheduleCustomer: 'customers/scheduled/',
  invoices: 'invoices/',
  geolocations: 'geolocations/',
  salesReturns: 'sales-returns/',
  userHierarchy: 'user-hierarchy/users?id=',
  customerOrderPerformance: 'user-performance/customer-orders',
  topCustomersPerformance: 'user-performance/top-customers',
  topDistributors: 'user-performance/top-distributors',
  todayCustomerOrder: 'user-performance/today-customer-orders',
  topScs: 'user-performance/top-scs',
  topZms:'user-performance/top-zms',
  topAsms:'user-performance/top-asms',
  topSalesOfficer: 'user-performance/top-sales-officers',
  dailyOrderPerformance: 'user-performance/daily-orders',
  dailyCustomerOrder: 'user-performance/daily-customer-orders',
  latestOrder: 'orders/latest',
  attendanceSummary: 'user-attendances/today-summary',
  schemes: '/schemes',
  markActive: '/mark-active',
  currentTargets: '/targets/current-brand',
  currentOverAllTargetsAmount: 'targets/current-overall-amount',
  dsms: 'kams',
  salesOfficers: 'sms',
  jointWorkStatus: 'joint-workings/status',
  startJointWork: '/joint-workings/start',
  endJointWork: '/joint-workings/end',
  jointWorkings: '/joint-workings',
  jointVisitCheckedInStatus: '/joint-customer-visits/status',
  jointVisitCheckIn: '/joint-customer-visits/check-in',
  jointVisitCheckOut: '/joint-customer-visits/check-out',
  jointVisitFeedback: '/joint-customer-visits/save-feedback',
  userJointWork: 'user-joint-workings',
  // kamDashboard: 'kams/dashboard',
  userDashboard: 'user-dashboard/today',
  cumulativeReport: 'user-hierarchy/cumulative-report',
  cumulativeMonthlyReport: 'user-hierarchy/cumulative-monthly-report',
  kamMtd: 'kams/month-till-date',
  kams: 'kams',
  promoterSales: 'promoter-sales',
  promoterClosingStock: 'promoter-closing-stocks',
  allProducts: 'products/all',
  allUsers: 'all-users',
  routeSchedules: 'route-schedules',
  userRouteSchedules: 'user-route-schedules',

  //promotional items
  customerPromotionalItems: 'customer-promotional-items',
  userPromotionalItems: 'user-promotional-inventory-items',

  //monthly travel
  monthlyAttendanceTravel: 'attendances/monthly',
  //divya prakshan
  present: 'daily-attendances/present-reasons',
  absent: 'daily-attendances/absent-reasons',
  markPresent: 'daily-attendances/mark-present',
  markAbsent: 'daily-attendances/mark-absent',
  workType: 'attendances/work-type',
  vehicleType: 'attendances/vehicle-type',
  dailyAllowance: 'attendances/daily-allowance',
  punchStatus: 'attendances/punch-status',
  status: 'daily-attendances/status',
  attendanceMonthly: '/daily-attendances/monthly',
  userDailyAttendaces: 'user-daily-attendances',

  //distributor
  distributors: 'distributors',
  distributorVisit:'distributor-visits',
  distributorSchedule:'distributor-schedules',
  userDistributorSchedule:'user-distributor-schedules',


  //expense
  expenseType:'expenses/type',
  expense:'expenses',

  //complaint
  complaints:'complaints',
  complaints_types:'complaint-types',


  //user_complaint
  user_complaint:'user-complaints',
  
  //ta_das
  ta_das:'/ta-das',

  //sample
  sample:'samples',
  //user_expense
  user_expense: 'user-expenses',

  //user_tadas
  user_tadas: 'user-ta-das',


  categories:'/categories',
};

export const clientId =
  '33OkryzDZsJIkAo-JJBhmpSqQC_GLLbq5yAtPs_D1mE6eqPVoELD8olvqhCkMONQx0wazhVAqnXjTodvQxTrqUSYSoFFEQ-4';
export const clientSecret =
  'lrFxI-iSEg_LQj8y1GRzY0JKgxCUN6lQtwim1Mdn6PdpbmKeVwDhu-z0hVf4V3JESu4ORP-2XbSAUtxdks66J7eTD1ZxiIkz6JAmkwxC4MY=';
