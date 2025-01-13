export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  products: number[]; // Array of product IDs
  type: MenuType;
  timeAvailable?: {
    start: string; // Format: "HH:mm"
    end: string;   // Format: "HH:mm"
  };
  daysAvailable?: WeekDay[];
  seasonal?: {
    startDate: Date;
    endDate: Date;
  };
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum MenuType {
  REGULAR = 'regular',     // Menu thường
  BREAKFAST = 'breakfast', // Menu buổi sáng
  LUNCH = 'lunch',        // Menu buổi trưa
  DINNER = 'dinner',      // Menu buổi tối
  SEASONAL = 'seasonal',  // Menu theo mùa
  SPECIAL = 'special',    // Menu đặc biệt
  COMBO = 'combo'         // Menu combo
}

export enum WeekDay {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

export interface CreateMenuItemDTO {
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  products: number[];
  type: MenuType;
  timeAvailable?: {
    start: string;
    end: string;
  };
  daysAvailable?: WeekDay[];
  seasonal?: {
    startDate: Date;
    endDate: Date;
  };
  tags?: string[];
}

export interface UpdateMenuItemDTO extends Partial<CreateMenuItemDTO> {
  id: number;
}

export interface MenuFilter {
  search?: string;
  type?: MenuType;
  isActive?: boolean;
  day?: WeekDay;
  time?: string; // Format: "HH:mm"
}

// Response type cho danh sách menu có phân trang
export interface MenuResponse {
  items: MenuItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Type cho thống kê menu
export interface MenuStats {
  totalMenus: number;
  activeMenus: number;
  totalProducts: number;
  byType: Record<MenuType, number>;
}

// Type cho menu availability check
export interface MenuAvailability {
  isAvailable: boolean;
  nextAvailableTime?: string;
  reason?: string;
}

// Constants
export const MENU_TYPES = Object.values(MenuType);
export const WEEK_DAYS = Object.values(WeekDay);

// Helper function để kiểm tra menu có available không
export const checkMenuAvailability = (menu: MenuItem): MenuAvailability => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:mm"
  const currentDay = WeekDay[now.getDay() as unknown as keyof typeof WeekDay];

  // Kiểm tra menu theo mùa
  if (menu.seasonal) {
    if (now < menu.seasonal.startDate || now > menu.seasonal.endDate) {
      return {
        isAvailable: false,
        reason: 'Menu này chỉ có trong thời gian nhất định'
      };
    }
  }

  // Kiểm tra ngày trong tuần
  if (menu.daysAvailable && !menu.daysAvailable.includes(currentDay)) {
    return {
      isAvailable: false,
      reason: 'Menu này không phục vụ vào ngày hôm nay'
    };
  }

  // Kiểm tra thời gian trong ngày
  if (menu.timeAvailable) {
    if (currentTime < menu.timeAvailable.start || currentTime > menu.timeAvailable.end) {
      return {
        isAvailable: false,
        nextAvailableTime: menu.timeAvailable.start,
        reason: 'Menu này chỉ phục vụ trong khung giờ nhất định'
      };
    }
  }

  return { isAvailable: true };
};

// Helper function để format thời gian hiển thị
export const formatTimeRange = (start: string, end: string): string => {
  return `${start} - ${end}`;
};

// Helper function để lấy tên hiển thị của MenuType
export const getMenuTypeLabel = (type: MenuType): string => {
  const labels: Record<MenuType, string> = {
    [MenuType.REGULAR]: 'Menu thường',
    [MenuType.BREAKFAST]: 'Menu buổi sáng',
    [MenuType.LUNCH]: 'Menu buổi trưa',
    [MenuType.DINNER]: 'Menu buổi tối',
    [MenuType.SEASONAL]: 'Menu theo mùa',
    [MenuType.SPECIAL]: 'Menu đặc biệt',
    [MenuType.COMBO]: 'Menu combo'
  };
  return labels[type];
};
