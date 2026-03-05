export interface pageSelection {
  skip: number;
  limit: number;
}
export interface apiResultFormat {
  data: [];
  totalData: number;
}
export interface adminSidebar {
  tittle: string;
  showAsTab: boolean;
  separateRoute: boolean;
  menu: adminMenu[];
}
export interface adminMenu {
  menuValue: string;
  hasSubRoute: boolean;
  showSubRoute: boolean;
  route?: string;
  subMenus?: adminSubMenus[];
  base?: string;
  boxIcon?: string;
}
export interface adminSubMenus {
  menuValue?: string;
  route?: string;
}
export interface url {
  url: string;
}

export interface apiResultFormat {
  data: [];
  totalData: number;
}
export interface adminSidebar {
  tittle: string;
  showAsTab: boolean;
  separateRoute: boolean;
  menu: adminMenu[];
}
export interface adminMenu {
  menuValue: string;
  hasSubRoute: boolean;
  showSubRoute: boolean;
  route?: string;
  subMenus?: adminSubMenus[];
  base?: string;
  boxIcon?: string;
}
export interface adminSubMenus {
  menuValue?: string;
  route?: string;
}
export interface url {
  url: string;
}
export class register {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export class passwordResponce {
  passwordResponceText?: string;
  passwordResponceImage?: string;
  passwordResponceKey?: string;
}
export interface reportUser {
  isSelected?: boolean;
  id: number;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  reportDate: string;
  reportedBy: string;
  img1: string;
  img2: string;
}

export interface language {
  isSelected?: boolean;
  id: number;
  name: string;
  code: string;
  total: string;
  done: string;
  progress: number;
  img: string;
}
export interface languageadmin {
  isSelected?: boolean;
  id: number;
  medium: string;
  file: string;
  total: string;
  complete: string;
  progress: number;
}
export interface languageapp {
  isSelected?: boolean;
  id: number;
  medium: string;
  file: string;
  total: string;
  complete: string;
  progress: number;
}
export interface languagetranslate {
  isSelected?: boolean;
  id: number;
  medium: string;
  file: string;
  total: string;
  complete: string;
  progress: number;
}
export interface languageweb {
  isSelected?: boolean;
  moduleName: string;
  id: number;
  total: number;
  complete: number;
  progress: number;
}
export interface stories {
  isSelected?: boolean;
  id: number;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  storiesDate: string;
  img: string;
}
export interface userList {
  id: number;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  regDate: string;
  country: string;
  lastSeen: string;
  img: string;
  isSelected?: boolean;
}
export interface inviteUser {
  id: number;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  inviteDate: string;
  country: string;
  img: string;
  isSelected?: boolean;
}
export interface abuseMessage {
  isSelected?: boolean;
  id: number;
  reportedBy: string;
  reportedUser: string;
  totalMessageCount: string;
  date: string;
  img1: string;
  img: string;
}
export interface chatSidebar {
  boxIcon: string;
  tooltip: string;
  route: string;
  class?: string;
}
export interface CompanyAccount {
  sNo?: number;
  isSelected: boolean;
  CompanyName: string;
  Email: string;
  AccountURL: string;
  Plan: string;
  CreatedDate: string; // Alternatively, use Date if you want to store it as a Date object
  Image: string;
  Status: string;
}
export interface CompanyInfo {
  sNo?: number;
  isSelected: boolean;
  CompanyName: string;
  BillCycle: string;
  PaymentMethod: string;
  Email: string;
  AccountURL: string;
  Plan: string;
  CreatedDate: string;
  ExpiringDate: string;
  Image: string;
  Status: string;
  Amount: string;
  DomainStatus: string;
  InvoiceID: string;
}
export interface PackageList {
  sNo?: number;
  isSelected: boolean;
  Plan_Name: string;
  Plan_Type: string;
  Total_Subscribers: string; // Alternatively, use number if you want a numerical type
  Price: string; // Alternatively, use number if you want to remove the "$" symbol
  Created_Date: string; // Alternatively, use Date if you want to store it as a Date object
  Status: string;
}
export interface dataTables {
  isSelected: boolean;
  sNo?: number;
  name?: string;
  position?: string;
  office?: string;
  age?: string;
  salary?: string;
  startDate?: string;
  id?: string;
}
export interface Star {
  show?: boolean;
  half?: boolean;
}
export interface SideBarMenu {
  showMyTab?: boolean;
  menuValue: string;
  route?: string;
  hasSubRoute?: boolean;
  showSubRoute: boolean;
  ids?:string;
  icon: string;
  base?: string;
  base2?: string;
  base3?: string;
  base4?: string;
  base5?: string;
  base7?: string;
  base8?: string;
  base9?: string;
  base10?: string;
  last1?: string;
  last?: string;
  page?: string;
  last2?: string;
  new?: boolean;
  materialicons?: string;
  subMenus: SubMenu[];
  dot?: boolean;
  changeLogVersion?: boolean;
  hasSubRouteTwo?: boolean;
  page1?: string;
}
export interface breadCrumbItems {
  label: string;
  active?: boolean;
}
export interface SubMenu {
  menuValue: string;
  route?: string;
  base?: string;
  page?: string;
  page1?: string;
  page2?: string;
  base2?: string;
  base3?: string;
  base4?: string;
  base5?: string;
  base6?: string;
  base7?: string;
  base8?: string;
  dot?: boolean;
  new?: boolean;
    ids?:string;
  currentActive?: boolean;
  hasSubRoute?: boolean;
  showSubRoute?: boolean;
  customSubmenuTwo?: boolean;
  subMenusTwo?: SubMenu[];
}
export interface SubMenusTwo {
  menuValue: string;
  route?: string;
  base?: string;
  page?: string;
  base2?: string;
  base3?: string;
  base4?: string;
  base5?: string;
  base6?: string;
  base7?: string;
  base8?: string;
  currentActive?: boolean;
  materialicons?: string;
  hasSubRoute?: boolean;
  showSubRoute?: boolean;
}

export interface SideBar {
  showMyTab?: boolean;
  tittle: string;
  icon?: string;
  showAsTab: boolean;
  base?: string;
  base2?: string;
  ids?:string;
  separateRoute: boolean;
  materialicons?: string;
  menu: SideBarMenu[];
  hasSubRoute?: boolean;
}

export interface SubMenuTwo {
  menuValue: string;
  route: string;
  base?: string;
  base1?: string;
  base2?: string;
  base3?: string;
  hasSubRoute?: boolean;
  showSubRoute?: boolean;
}

export interface SubMenu2 {
  menuValue: string;
  route?: string;
  base?: string;
  base1?: string;
  base2?: string;
  base3?: string;
  hasSubRoute?: boolean;
  showSubRoute?: boolean;
  customSubmenuTwo?: boolean;
  subMenusTwo?: SubMenuTwo[];
}

export interface Menu {
  menuValue: string;
  hasSubRouteTwo?: boolean;
  showSubRoute?: boolean;
  hasSubRoute?: boolean;
  icon?: string;
  base?: string;
  base1?: string;
  base2?: string;
  base3?: string;
  base4?: string;
  base5?: string;
  base6?: string;
  base7?: string;
  base8?: string;
  base9?: string;
  base10?: string;
  subMenus?: SubMenu2[];
  customSubmenuTwo?: boolean;
  subMenusTwo?: SubMenuTwo[];
}

export interface MainMenu {
  title: string;
  showAsTab: boolean;
  separateRoute: boolean;
  base?: string;
  menu: Menu[];
}

export interface Client {
  sNo?: number;
  isSelected: boolean;
  ClientID: string;
  ClientName: string;
  Work: string;
  CompanyName: string;
  Email: string;
  Phone: string;
  Image: string;
  Status: string;
}

export interface Project {
  sNo?: number;
  isSelected: boolean;
  ProjectID: string;
  ProjectName: string;
  Leader: string;
  Team: string;
  UserImg: string;
  share: string[];
  Deadline: string;
  Priority: string;
  Status: string;
}
export interface activities {
  sNo?: number;
  isSelected: boolean;
  title: string;
  activityType: string;
  dueDate: string;
  owner: string;
  createdAt: string;
}
export interface contactList {
  sNo?: number;
  isSelected?: boolean;
  Image: string;
  Name: string;
  Roll: string;
  Email: string;
  Phone: string;
  Location: string;
  Rating: string;
  Owner: string;
  Status: string;
}
export interface Company {
  sNo?: number;
  isSelected: boolean;
  Company_Name: string;
  Image: string;
  Image2: string;
  Email: string;
  Phone: string;
  Location: string;
  Rating: string;
  Owner: string;
  Status: string;
  share: string[];
}
export interface Pipeline {
  sNo?: number;
  isSelected: boolean;
  Pipeline_Name: string;
  Total_Deal_Value: string;
  No_of_Deals: string;
  Stages: string;
  Created_Date: string;
  Status: string;
}
export interface Activity {
  sNo?: number;
  isSelected: boolean;
  Title: string;
  Activity_Type: string;
  Due_Date: string;
  Owner: string;
  Created_Date: string;
}

export interface employees {
  sNo?: number;
  isSelected: boolean;
  EmpId: string;
  Image: string;
  Name: string;
  CurrentRole: string;
  Email: string;
  Phone: string;
  Designation: string;
  JoiningDate: string;
  Status: string;
}

export interface department {
  sNo?: number;
  isSelected: boolean;
  Department: string;
  NoOfEmployees: string;
  Status: string;
}

export interface designation {
  sNo?: number;
  isSelected: boolean;
  Designation: string;
  Department: string;
  NoOfEmployees: string;
  Status: string;
}

export interface policy {
  sNo?: number;
  isSelected: boolean;
  Name: string;
  Department: string;
  Description: string;
  CreatedDate: string;
}
export interface holiday {
  sNo?: number;
  isSelected: boolean;
  Title: string;
  Date: string;
  Description: string;
  Status: string;
}

export interface attendanceadmin {
  sNo?: number;
  isSelected: boolean;
  Employee: string;
  Image: string;
  Role: string;
  CheckIn: string;
  CheckOut: string;
  Break: string;
  Late: string;
  Production: number;
  ProductionHours: string;
  Status: string;
}

export interface attendanceemployee {
  sNo?: number;
  isSelected: boolean;
  Date: string;
  CheckIn: string;
  Status: string;
  CheckOut: string;
  Break: string;
  Late: string;
  Overtime: string;
  Production: number;
  ProductionHours: string;
}

export interface timesheet {
  sNo?: number;
  isSelected: boolean;
  Employee: string;
  Image: string;
  Role: string;
  Date: string;
  Project: string;
  AssignedHours: number;
  WorkedHours: number;
}

export interface shiftschedule {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Name: string;
  JobTitle: string;
}

export interface overtime {
  sNo?: number;
  isSelected: boolean;
  EmpImage: string;
  Employee: string;
  Role: string;
  Date: string;
  OvertimeHours: string;
  Project: string;
  Image: string;
  Name: string;
  Status: string;
}

export interface promotion {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  PromotedEmployee: string;
  Department: string;
  DesignationFrom: string;
  DesignationTo: string;
  PromotionDate: string;
}

export interface resignation {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  ResigningEmployee: string;
  Department: string;
  Reason: string;
  NoticeDate: string;
  ResignationDate: string;
}
export interface termination {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  ResigningEmployee: string;
  Department: string;
  TerminationType: string;
  NoticeDate: string;
  Reason: string;
  ResignationDate: string;
}

export interface DealInfo {
  sNo?: number;
  isSelected: boolean;
  DealName: string;
  Stage: string;
  DealValue: string;
  Tags: string;
  ExpectedClosedDate: string;
  Owner: string;
  Probability: string;
  Status: string;
}
export interface LeadInfo {
  sNo?: number;
  isSelected: boolean;
  LeadName: string;
  CompanyName: string;
  Phone: string;
  Email: string;
  Tags: string;
  CreatedDate: string;
  Image: string;
  LeadOwner: string;
}
export interface PipelineInfo {
  sNo?: number;
  isSelected: boolean;
  Pipeline_Name: string;
  Total_Deal_Value: string;
  No_of_Deals: string;
  Stages: string;
  Created_Date: string;
  Status: string;
}
export interface Activity {
  sNo?: number;
  isSelected: boolean;
  Title: string;
  Activity_Type: string;
  Due_Date: string;
  Owner: string;
  Created_Date: string;
}
export interface JobsInfo {
  sNo?: number;
  isSelected: boolean;
  Job_ID: string;
  Experience: string;
  Image: string;
  Job_Title: string;
  Roll: string;
  Category: string;
  Location: string;
  Salary_Range: string;
  Posted_Date: string;
}

export interface CandidateInfo {
  sNo?: number;
  isSelected: boolean;
  Cand_ID: string;
  Image: string;
  Candidate: string;
  Email: string;
  Applied_Role: string;
  Phone: string;
  Applied_Date: string;
  Status: string;
}

export interface ReferralInfo {
  sNo?: number;
  isSelected: boolean;
  Refferals_Image: string;
  Refferals_ID: string;
  Referrer_Name: string;
  Roll: string;
  Job_Image: string;
  Job_Reffered: string;
  Refferee_Image: string;
  Referee_Name: string;
  Email: string;
  Refferals_Bonus: string;
}

export interface trainingList {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  TrainingType: string;
  Trainer: string;
  Employee: string;
  Img1?: string;
  Img2?: string;
  Img3?: string;
  Img4?: string;
  Img5?: string;
  TimeDuration: string;
  Description: string;
  Cost: string;
  Status: string;
}

export interface trainers {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Name: string;
  Phone: string;
  Email: string;
  Description: string;
  Status: string;
}

export interface trainingType {
  sNo?: number;
  isSelected: boolean;
  Type: string;
  Description: string;
  Status: string;
}

export interface performanceIndicator {
  sNo?: number;
  isSelected: boolean;
  Designation: string;
  Department: string;
  Image: string;
  ApprovedBy: string;
  Role: string;
  CreatedDate: string;
  Status: string;
}

export interface performanceAppraisal {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Name: string;
  Designation: string;
  Department: string;
  AppraisalDate: string;
  Status: string;
}

export interface goalType {
  sNo?: number;
  isSelected: boolean;
  Type: string;
  Description: string;
  Status: string;
}

export interface goalTrack {
  sNo?: number;
  isSelected: boolean;
  GoalType: string;
  Subject: string;
  TargetAchievement: string;
  StartDate: string;
  EndDate: string;
  Description: string;
  Status: string;
  Progress: string;
}

export interface leaveAdmin {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Employee: string;
  Role: string;
  LeaveType: string;
  From: string;
  To: string;
  NoOfDays: string;
}

export interface leaveEmployee {
  sNo?: number;
  isSelected: boolean;
  LeaveType: string;
  Image: string;
  From: string;
  ApprovedBy: string;
  Roll: string;
  To: string;
  NoOfDays: string;
  Status: string;
}

export interface Estimate {
  sNo?: number;
  isSelected: boolean;
  Client_Name: string;
  Image: string;
  Roll: string;
  Company_Name: string;
  Estimate_Date: string;
  Expiry_Date: string;
  Amount: string;
  Status: string;
}

export interface InvoiceList {
  sNo?: number;
  isSelected: boolean;
  Invoice: string;
  Image: string;
  Name: string;
  Roll: string; // If 'Roll' represents the role, you may want to rename it to 'Role'
  Created_On: string;
  Total: string;
  Amount_Due: string;
  Due_Date: string;
  Status: string;
}

export interface InvoicePaymentDetails {
  sNo?: number;
  isSelected: boolean;
  Invoice_ID: string;
  Image: string;
  Client_Name: string;
  Roll: string; // Consider renaming to 'Role' if it refers to job role
  Company_Name: string;
  Payment_Type: string;
  Paid_Date: string;
  Paid_Amount: string;
}
export interface ExpenseDetails {
  sNo?: number;
  isSelected: boolean;
  Expense_Name: string;
  Date: string;
  Payment_Method: string;
  Amount: string;
}

export interface ProvidentFundDetails {
  sNo?: number;
  isSelected: boolean;
  Employee_Name: string;
  Image: string;
  Roll: string;
  Provident_Fund_Type: string;
  Employee_Share: string;
  Organization_Share: string;
  Status: string;
}
export interface TaxDetails {
  sNo?: number;
  isSelected: boolean;
  Tax_Name: string;
  Tax_Percentage: string;
  Status: string;
}
export interface UserMangementUser {
  sNo?: number;
  isSelected: boolean;
  Name: string;
  Email: string;
  CreatedDate: string;
  Role: string;
  Status: string;
  Image: string;
}
export interface RoleInfo {
  sNo?: number;
  isSelected: boolean;
  Role: string;
  CreatedDate: string;
  Status: string;
}
export interface budgetRevenue {
  sNo?: number;
  isSelected: boolean;
  RevenueName: string;
  CategoryName: string;
  SubCategoryName: string;
  Amount: string;
  ExpenseDate: string;
}

export interface budgetExpense {
  sNo?: number;
  isSelected: boolean;
  ExpenseName: string;
  CategoryName: string;
  SubCategoryName: string;
  Amount: string;
  ExpenseDate: string;
}

export interface budget {
  sNo?: number;
  isSelected: boolean;
  BudgetTitle: string;
  BudgetType: string;
  StartDate: string;
  EndDate: string;
  TotalRevenue: string;
  TotalExpense: string;
  TaxAmount: string;
  BudgetAmount: string;
}

export interface categories {
  sNo?: number;
  isSelected: boolean;
  CategoryName: string;
  SubCategoryName: string;
}

export interface payrollAddition {
  sNo?: number;
  isSelected: boolean;
  Name: string;
  Category: string;
  Amount: string;
}

export interface payrollOvertime {
  sNo?: number;
  isSelected: boolean;
  Name: string;
  Rate: string;
}

export interface payrollDeduction {
  sNo?: number;
  isSelected: boolean;
  Name: string;
  Category: string;
  Amount: string;
}

export interface employeeSalary {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  EmpID: string;
  Name: string;
  Department: string;
  Email: string;
  Phone: string;
  Designation: string;
  JoiningDate: string;
  Salary: string;
  PaySlip: string;
}

export interface assetList {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  AssetName: string;
  AssetUser: string;
  PurchaseDate: string;
  Warranty: string;
  WarrantyEndDate: string;
  Status: string;
}

export interface assetCategories {
  sNo?: number;
  isSelected: boolean;
  CategoryName: string;
  Status: string;
}

export interface userReport {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Name: string;
  Email: string;
  CreatedDate: string;
  Role: string;
  Status: string;
}

export interface taskReport {
  sNo?: number;
  isSelected: boolean;
  TaskName: string;
  ProjectName: string;
  CreatedDate: string;
  DueDate: string;
  Priority: string;
  Status: string;
}

export interface projectReport {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  ProjectID: string;
  ProjectName: string;
  Leader: string;
  Img: string;
  Img1: string;
  Img2: string;
  Team: number;
  Deadline: string;
  Priority: string;
  Status: string;
}

export interface payslipReport {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Name: string;
  Role: string;
  PaidAmount: string;
  PaidMonth: string;
  PaidYear: string;
}

export interface paymentReport {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  InvoiceID: string;
  ClientName: string;
  Role: string;
  CompanyName: string;
  PaymentType: string;
  PaidDate: string;
  PaidAmount: string;
}

export interface leaveReport {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  InvoiceID: string;
  ClientName: string;
  Role: string;
  CompanyName: string;
  CreatedDate: string;
  DueDate: string;
  Amount: string;
  Status: string;
}

export interface invoiceReport {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  InvoiceID: string;
  ClientName: string;
  Role: string;
  CompanyName: string;
  CreatedDate: string;
  DueDate: string;
  Amount: string;
  Status: string;
}

export interface expenseReport {
  sNo?: number;
  isSelected: boolean;
  ExpenseName: string;
  Date: string;
  PaymentMethod: string;
  Amount: string;
}

export interface employeeReport {
  sNo?: number;
  isSelected: boolean;
  EmpID: string;
  Image: string;
  Name: string;
  Role: string;
  Email: string;
  Department: string;
  Phone: string;
  JoiningDate: string;
  Status: string;
}

export interface dailyReport {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Name: string;
  Role: string;
  Date: string;
  Department: string;
  Status: string;
}

export interface attendanceReport {
  sNo?: number;
  isSelected: boolean;
  Name: string;
  Image: string;
  Role: string;
  Date: string;
  CheckIn: string;
  Status: string;
  CheckOut: string;
  Break: string;
  Late: string;
  Overtime: string;
  Progress: number;
  ProductionHours: string;
}
export interface ApiData {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  serviceName: string;
  createdBy: string;
  apiKey: string;
  status: string;
  createdDate: string;
}

export interface page {
  sNo?: number;
  isSelected: boolean;
  Page: string;
  PageSlug: string;
  Status: string;
}

export interface blogCategories {
  sNo?: number;
  isSelected: boolean;
  Category: string;
  CreatedDate: string;
  Status: string;
}

export interface blogComments {
  sNo?: number;
  isSelected: boolean;
  Comment: string;
  CreatedDate: string;
  Blog: string;
  By: string;
}

export interface blogTags {
  sNo?: number;
  isSelected: boolean;
  Tag: string;
  CreatedDate: string;
  Status: string;
}

export interface cities {
  sNo?: number;
  isSelected: boolean;
  CityName: string;
  StateName: string;
  CountryName: string;
  Status: string;
}

export interface countries {
  sNo?: number;
  isSelected: boolean;
  CountryName: string;
  CountryCode: string;
  Status: string;
}

export interface faq {
  sNo?: number;
  isSelected: boolean;
  Questions: string;
  Answers: string;
  Categories: string;
}

export interface states {
  sNo?: number;
  isSelected: boolean;
  StateName: string;
  CountryName: string;
  Status: string;
}

export interface testimonial {
  sNo?: number;
  isSelected: boolean;
  Image: string;
  Author: string;
  Role: string;
  Content: string;
  CreatedDate: string;
}

export interface callHistory {
  sNo?: number;
  isSelected: boolean;
  Name: string;
  Email: string;
  Phone: string;
  CallType: string;
  Class: string;
  Duration: string;
  Image: string;
  DateTime: string;
}
export interface tenantUsage {
  sNo?: number;
  id?: number;
  isSelected?: boolean;
  name: string;
  image: string;
  plan: string;
  activeUsers: string;
  mostModuleUsage: string;
  storageUsage: string;
  status: string;
}
export interface agent {
  sNo?: number;
  id?: number;
  isSelected?: boolean;
  agentId: string;
  name: string;
  image: string;
  email: string;
  role: string;
  ticketsAssigned: number;
  ticketsResolved: number;
  availability: string;
}
export interface ticketReport {
  sNo?: number;
  id?: number;
  isSelected?: boolean;
  ticketId: string;
  description: string;
  priority: string;
  companyName: string;
  companyImage: string;
  date: number;
  assigneName: number;
  assigneImage: string;
  status: string;
}

export interface shiftSwap {
  sNo?: number;
  id?: number;
  isSelected?: boolean;
  empId: string;
  name: string;
  image: string;
  designation: string;
  currentShift: string;
  requestedShift: string;
  requestedOn: string;
  status: string;
}

export interface workfromhome {
  sNo?: number;
  id?: number;
  isSelected?: boolean;
  empId: string;
  name: string;
  image: string;
  designation: string;
  shift: string;
  reason: string;
  date: string;
  status: string;
}

export interface noticePeriod {
  sNo?: number;
  id?: number;
  isSelected?: boolean;
  empId: string;
  name: string;
  image: string;
  designation: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  completed: number;
  remaining: number;
  status: string;
}

export interface probation {
  sNo?: number;
  id?: number;
  isSelected?: boolean;
  empId: string;
  name: string;
  image: string;
  designation: string;
  joiningDate: string;
  probationEndDate: string;
  reviewerName: string;
  reviewerImage: string;
  status: string;
  action?: string;
}

export interface certificationTrack {
  sNo?: number;
  id?: number;
  isSelected?: boolean;
  empId: string;
  name: string;
  image: string;
  trainingType: string;
  trainername: string;
  trainerimage: string;
  date: string;
  status: string;
}

export interface campushire {
  sNo?: number;
  id?: number;
  isSelected?: boolean;
  empId: string;
  name: string;
  image: string;
  email: string;
  branch: string;
  graduationYear: string;
  jobRole: string;
  recruitername: string;
  recruiterimage: string;
  status: string;
}

export interface resumeParse {
  sNo?: number;
  id?: number;
  isSelected?: boolean;
  candId: string;
  name: string;
  email: string;
  image: string;
  branch: string;
  graduationYear: string;
  jobRole: string;
  phone: string;
  experience: string;
  location: string;
  status: string;
}

// ─── Audit CAR Portal Models ────────────────────────────────────────────────

export type AuditRiskRating = 'High' | 'Medium' | 'Low' | 'Improvement';
/** Backend statuses: Open | Repeated | Closed | Overdue */
export type AuditObservationStatus = 'Open' | 'Repeated' | 'Closed' | 'Overdue';
export type AuditUserRole = 'Audit Team' | 'Responsible Person' | 'HoD';

/**
 * Maps to tbl_audit_observations with JOINed fields from
 * tbl_audit_areas, tbl_divisions, tbl_emp_master.
 */
export interface AuditObservation {
  /** tbl_audit_observations.observation_id */
  observationId: number;
  /** Auto-generated: OBS-YEAR-0001 */
  observationNumber: string;
  auditYear: number;
  auditAreaId?: number;
  divisionId?: number;
  observationTitle: string;
  riskRating: AuditRiskRating;
  detailsOfFindings: string;
  followupCommitment: string;
  responsiblePersonId?: number;
  initialTargetDate: string;
  subsequentFollowup1?: string;
  updatedTargetDate1?: string;
  status: AuditObservationStatus;
  closureDate?: string;
  closureRemarks?: string;
  closedByUserId?: number;
  createdByUserId?: number;
  createdAt: string;
  updatedAt: string;
  // JOINed display fields
  auditArea?: string;
  division?: string;
  responsiblePerson?: string;
  responsiblePersonCode?: string;
  responsiblePersonEmail?: string;
  closedBy?: string;
  createdBy?: string;
}

/** Reference data for audit area lookup */
export interface AuditArea {
  id: number;
  areaName: string;
}

/** Reference data for division lookup */
export interface AuditDivision {
  id: number;
  divisionName: string;
}

/** Employee record from /api/master/employees */
export interface AuditEmployee {
  eid: number;
  emp_name: string;
  emp_code: string;
  emp_email?: string;
  emp_dept?: string;
  emp_status?: string;
}

/** Staging row from tbl_audit_observations_staging */
export interface AuditStagingRow {
  stagingId: number;
  batchId: string;
  uploadFilename: string;
  auditYear: string;
  auditArea: string;
  division: string;
  observationTitle: string;
  riskRating: string;
  detailsOfFindings: string;
  followupCommitment: string;
  responsiblePerson: string;
  initialTargetDate: string;
  subsequentFollowup1: string;
  updatedTargetDate1: string;
  status: string;
  syncStatus: 'Pending' | 'Synced' | 'Error';
  syncError?: string;
  syncedObservationId?: number;
}

/** Batch summary from listBatches */
export interface AuditBatch {
  batch_id: string;
  upload_filename: string;
  uploaded_by_user_id: number;
  uploaded_at: string;
  total_rows: number;
  synced: number;
  errors: number;
}

/** Batch sync status summary */
export interface AuditBatchSummary {
  pending: number;
  synced: number;
  error: number;
  total: number;
}

/** Computed dashboard statistics (assembled client-side from list API) */
export interface AuditDashboardStats {
  totalObservations: number;
  openObservations: number;
  closedObservations: number;
  overdueObservations: number;
  repeatedObservations: number;
  byRiskRating: { high: number; medium: number; low: number; improvement: number };
  byDivision: { division: string; count: number; open: number; closed: number }[];
  byYear: { year: number; total: number; open: number; closed: number }[];
  responsiblePersonStats: { name: string; total: number; open: number; closed: number; overdue: number }[];
}

/** Kept for backward-compat; prefer AuditBatch for new code */
export interface AuditUploadHistory {
  id: string;
  fileName: string;
  uploadDate: string;
  uploadedBy: string;
  uploadedByName: string;
  recordsUploaded: number;
  status: 'Success' | 'Failed' | 'Partial';
  errors?: string[];
}

// ─── End Audit CAR Portal Models ────────────────────────────────────────────

export interface learninganalysis {
   sNo?: number;
  id?: number;
  isSelected?: boolean;
  empId: string;
  name: string;
  image: string;
  designation: string;
  trainingCourse: string;
  status: string;
  score: string;
  completionDate: string;
  feedback: string;
  attempts: string;
  certificate: string;
}

// ─── Packaging Creative Approval Portal Models ────────────────────────────────

export type PackagingWorkflowType = 'sequential' | 'parallel' | 'hybrid';
export type PackagingDocStatus = 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected';
export type PackagingStepStatus = 'pending' | 'in-progress' | 'completed' | 'rejected';
export type PackagingApproverStatus = 'pending' | 'approved' | 'rejected';
export type PackagingFileType = 'pdf' | 'jpeg' | 'jpg';
export type PackagingAuditActionType = 'uploaded' | 'submitted' | 'approved' | 'rejected' | 'pending';

export interface PackagingFile {
  id: string;
  name: string;
  type: PackagingFileType;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface PackagingStepApprover {
  approverId: string;
  approverName: string;
  approverEmail: string;
  role: string;
  avatar?: string;
  status: PackagingApproverStatus;
  remarks?: string | null;
  actionAt?: string | null;
}

export interface PackagingApprovalStep {
  id: string;
  stepNumber: number;
  stepType: 'sequential' | 'parallel';
  status: PackagingStepStatus;
  completedAt?: string;
  approvers: PackagingStepApprover[];
}

export interface PackagingDocument {
  id: string;
  title: string;
  description: string;
  productName: string;
  productCategory: string;
  batchRef: string;
  files: PackagingFile[];
  workflowType: PackagingWorkflowType;
  status: PackagingDocStatus;
  initiator: string;
  initiatorEmail: string;
  initiatorAvatar?: string;
  createdAt: string;
  updatedAt: string;
  currentStepIndex: number;
  approvalSteps: PackagingApprovalStep[];
  sNo?: number;
  isSelected?: boolean;
}

export interface PackagingApprover {
  id: string;
  name: string;
  role: string;
  roleKey: string;
  email: string;
  department: string;
  location: string;
  phone: string;
  avatar?: string;
  isActive: boolean;
  sNo?: number;
  isSelected?: boolean;
}

export interface PackagingAuditTrail {
  id: string;
  documentId: string;
  documentTitle: string;
  action: string;
  actionType: PackagingAuditActionType;
  performedBy: string;
  performedByEmail: string;
  performedByAvatar?: string;
  timestamp: string;
  remarks?: string;
  status: PackagingAuditActionType;
  ipAddress?: string;
  sNo?: number;
  isSelected?: boolean;
}

export interface PackagingWorkflowStep {
  stepNumber: number;
  stepType: 'sequential' | 'parallel';
  selectedApprovers: PackagingApprover[];
}

// ─── End Packaging Creative Approval Portal Models ────────────────────────────