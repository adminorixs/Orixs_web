import {
  Archive,
  Banknote,
  Bell,
  BellRing,
  BookOpen,
  Boxes,
  Calculator,
  CalendarCheck,
  CalendarDays,
  ChartNoAxesCombined,
  ChartPie,
  Clock,
  CreditCard,
  Database,
  FileSignature,
  FileText,
  FolderKanban,
  Gauge,
  Gavel,
  Landmark,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  Mail,
  Megaphone,
  MessagesSquare,
  Network,
  Package,
  Plane,
  Receipt,
  Scale,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Store,
  TrendingUp,
  UserPlus,
  UsersRound,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

// Structure of the Features tour. Names, descriptions and item lists live in messages/<locale>/features.json,
// keyed by the same ids. The menus and modules mirror the real Orixs menu (resources/views/sections/menu.blade.php).
export type FeatureModule = { id: string; icon: LucideIcon };
export type FeatureMenu = { id: string; icon: LucideIcon; modules: FeatureModule[] };

export const featureMenus: FeatureMenu[] = [
  {
    id: 'overview',
    icon: LayoutDashboard,
    modules: [
      { id: 'myDashboard', icon: LayoutDashboard },
      { id: 'calendarMeetings', icon: CalendarDays },
      { id: 'operationalDashboards', icon: Gauge },
      { id: 'reports', icon: ChartNoAxesCombined },
    ],
  },
  {
    id: 'customers',
    icon: UsersRound,
    modules: [
      { id: 'crmDashboard', icon: ChartPie },
      { id: 'marketing', icon: Megaphone },
      { id: 'clients', icon: UsersRound },
      { id: 'proposals', icon: FileText },
      { id: 'estimates', icon: Calculator },
      { id: 'contracts', icon: FileSignature },
      { id: 'intelligence', icon: Sparkles },
    ],
  },
  {
    id: 'work',
    icon: FolderKanban,
    modules: [
      { id: 'tasks', icon: ListChecks },
      { id: 'timesheet', icon: Clock },
      { id: 'costCenters', icon: FolderKanban },
      { id: 'tenders', icon: Gavel },
      { id: 'documents', icon: Archive },
      { id: 'travel', icon: Plane },
    ],
  },
  {
    id: 'finance',
    icon: Landmark,
    modules: [
      { id: 'billing', icon: Receipt },
      { id: 'purchases', icon: ShoppingCart },
      { id: 'expenses', icon: Wallet },
      { id: 'ledgerSetup', icon: BookOpen },
      { id: 'accounting', icon: Landmark },
      { id: 'inventory', icon: Boxes },
      { id: 'financialReports', icon: Scale },
    ],
  },
  {
    id: 'marketplace',
    icon: Store,
    modules: [
      { id: 'marketplaceDashboard', icon: LayoutDashboard },
      { id: 'catalogs', icon: Package },
      { id: 'onlineOrders', icon: ShoppingBag },
      { id: 'amazon', icon: Store },
      { id: 'shopify', icon: Store },
      { id: 'ebay', icon: Store },
      { id: 'woocommerce', icon: Store },
    ],
  },
  {
    id: 'people',
    icon: Network,
    modules: [
      { id: 'orgDashboard', icon: LayoutDashboard },
      { id: 'team', icon: UsersRound },
      { id: 'attendance', icon: CalendarCheck },
      { id: 'payroll', icon: Banknote },
      { id: 'recruitment', icon: UserPlus },
      { id: 'performance', icon: TrendingUp },
      { id: 'hierarchy', icon: Network },
    ],
  },
  {
    id: 'service',
    icon: MessagesSquare,
    modules: [
      { id: 'mailbox', icon: Mail },
      { id: 'noticeBoard', icon: BellRing },
      { id: 'support', icon: LifeBuoy },
      { id: 'chat', icon: MessagesSquare },
    ],
  },
  {
    id: 'settings',
    icon: Settings2,
    modules: [
      { id: 'accountSecurity', icon: ShieldCheck },
      { id: 'payments', icon: CreditCard },
      { id: 'communication', icon: Bell },
      { id: 'hrSettings', icon: SlidersHorizontal },
      { id: 'workflowSettings', icon: Settings2 },
      { id: 'platform', icon: Database },
    ],
  },
];

const storeIds = ['amazon', 'shopify', 'ebay', 'woocommerce'];

// Counted from the structure above, never typed by hand. Payment gateways and languages mirror the settings menu
// (PayPal, Stripe, Razorpay, Paystack, Mollie, Payfast, Authorize.net, Square, Flutterwave) and the site locales.
export const featureStats = {
  menus: featureMenus.length,
  modules: featureMenus.reduce((sum, menu) => sum + menu.modules.length, 0),
  stores: featureMenus.flatMap((menu) => menu.modules).filter((module) => storeIds.includes(module.id)).length,
  gateways: 9,
  languages: 3,
};
