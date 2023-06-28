const mapping: Record<string, string> = {
  organizations: 'organization',
  pdfs: 'pdf',
  'scroll-settings': 'scroll_setting',
  users: 'user',
  'web-pages': 'web_page',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
