export interface DesktopViewport {
  width: number;
  height: number;
}

export interface DesktopGridMetrics {
  startX: number;
  startY: number;
  columnWidth: number;
  rowHeight: number;
  bottomInset: number;
  maxColumns: number;
}

export const DEFAULT_DESKTOP_VIEWPORT: DesktopViewport = {
  width: 1440,
  height: 900,
};

export function getDesktopViewport(): DesktopViewport {
  if (typeof window === 'undefined') {
    return DEFAULT_DESKTOP_VIEWPORT;
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function getDesktopGridMetrics(viewport: DesktopViewport): DesktopGridMetrics {
  if (viewport.width < 640) {
    return {
      startX: 18,
      startY: 86,
      columnWidth: 126,
      rowHeight: 120,
      bottomInset: 100,
      maxColumns: 2,
    };
  }

  if (viewport.width < 1024) {
    return {
      startX: 22,
      startY: 90,
      columnWidth: 142,
      rowHeight: 130,
      bottomInset: 110,
      maxColumns: 3,
    };
  }

  return {
    startX: 28,
    startY: 92,
    columnWidth: 152,
    rowHeight: 140,
    bottomInset: 100,
    maxColumns: 4,
  };
}

export function getDesktopRowsPerColumn(viewport: DesktopViewport, metrics = getDesktopGridMetrics(viewport)) {
  return Math.max(1, Math.floor((viewport.height - metrics.startY - metrics.bottomInset) / metrics.rowHeight));
}

export function getDesktopGridPosition(index: number, viewport: DesktopViewport) {
  const metrics = getDesktopGridMetrics(viewport);
  const rowsPerColumn = getDesktopRowsPerColumn(viewport, metrics);
  const column = Math.floor(index / rowsPerColumn);
  const row = index % rowsPerColumn;

  return {
    x: metrics.startX + column * metrics.columnWidth,
    y: metrics.startY + row * metrics.rowHeight,
  };
}

export function snapDesktopPosition(position: { x: number; y: number }, viewport = getDesktopViewport()) {
  const metrics = getDesktopGridMetrics(viewport);
  const rowsPerColumn = getDesktopRowsPerColumn(viewport, metrics);

  const snappedColumn = Math.max(
    0,
    Math.min(
      metrics.maxColumns - 1,
      Math.round((position.x - metrics.startX) / metrics.columnWidth),
    ),
  );
  const snappedRow = Math.max(
    0,
    Math.min(
      rowsPerColumn - 1,
      Math.round((position.y - metrics.startY) / metrics.rowHeight),
    ),
  );

  return {
    x: metrics.startX + snappedColumn * metrics.columnWidth,
    y: metrics.startY + snappedRow * metrics.rowHeight,
  };
}
