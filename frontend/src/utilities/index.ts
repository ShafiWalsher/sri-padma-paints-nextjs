import { NAV_MENU_ITEMS } from "@/constants";

const isPathPrefix = (prefix: string, path: string): boolean => {
  if (prefix === "/") return path === "/";
  return path === prefix || path.startsWith(prefix + "/");
};

export const getPageTitle = (currentPath: string): string => {
  // 1) Exact child match
  for (const parent of NAV_MENU_ITEMS) {
    if (parent.childrens) {
      const exactChild = parent.childrens.find(
        (child) => child.url === currentPath
      );
      if (exactChild) return exactChild.pageTitle ?? "";
    }
  }

  // 2) Nested child match (prefix)
  for (const parent of NAV_MENU_ITEMS) {
    if (parent.childrens) {
      const nested = parent.childrens.find((child) =>
        isPathPrefix(child.url ?? "", currentPath)
      );
      if (nested) return parent.pageTitle ?? "";
    }

    // 3) Parent route fallback (prefix match)
    if (parent.url && isPathPrefix(parent.url, currentPath)) {
      return parent.pageTitle ?? "";
    }
  }

  // 4) Nothing matched
  return "";
};
