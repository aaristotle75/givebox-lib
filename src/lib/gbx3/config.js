 export const initLayout = {
  'logo': { name: 'Logo', child: 'Logo', grid: {
    desktop: { i: 'logo', x: 0, y: 0, w: 1, h: 4, enabled: true },
    mobile: { i: 'logo', x: 0, y: 0, w: 1, h: 4, enabled: true }
  }},
  'title': { name: 'Title', child: 'Title', grid: {
    desktop: { i: 'title', x: 1, y: 0, w: 5, h: 2, enabled: true },
    mobile: { i: 'title', x: 1, y: 0, w: 5, h: 2, enabled: true }
  }},
  'orgName': { name: 'Name', child: 'OrgName', grid: {
    desktop: { i: 'orgName', x: 1, y: 1, w: 5, h: 2, enabled: true },
    mobile: { i: 'orgName', x: 1, y: 1, w: 5, h: 2, enabled: true }
  }},
  'media': { name: 'Media', child: 'Media', grid: {
    desktop: { i: 'media', x: 6, y: 0, w: 6, h: 20, enabled: true },
    mobile: { i: 'media', x: 0, y: 2, w: 6, h: 20, enabled: true }
  }},
  'summary': { name: 'Summary', child: 'Summary', grid: {
    desktop: { i: 'summary', x: 0, y: 2, w: 6, h: 6, enabled: true },
    mobile: { i: 'summary', x: 0, y: 2, w: 6, h: 6, enabled: true }
  }},
  'form': { name: 'Form', child: 'PublicForm', overflow: 'visible', irremovable: true, grid: {
    desktop: { i: 'form', x: 0, y: 3, w: 12, h: 40, minW: 10, enabled: true },
    mobile: { i: 'form', x: 0, y: 3, w: 6, h: 60, minW: 4, enabled: true }
  }},
  'content': { name: 'Content', child: 'Content', overflow: 'visible', grid: {
    desktop: { i: 'content', x: 0, y: 4, w: 6, h: 6, enabled: true },
    mobile: { i: 'content', x: 0, y: 4, w: 6, h: 6, enabled: true }
  }}
};
