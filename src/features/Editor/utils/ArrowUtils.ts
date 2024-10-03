export type PointTypes = {
  x: number;
  y: number;
};

const MAX_Y_CONTROL_POINT_SHIFT = 50;
// const MAX_X_CONTROL_POINT_SHIFT = 10;

export const calculateLowDyControlPointShift = (
  dx: number,
  dy: number,
  maxShift = MAX_Y_CONTROL_POINT_SHIFT
) => {
  if (dx > 0) return 0;
  const sign = dy < 0 ? -1 : 1;
  const value = Math.round(
    maxShift * Math.pow(0.9, Math.pow(1.2, Math.abs(dy) / 10))
  );

  if (value === 0) return 0;

  return sign * value;
};

export const calculateDeltas = (
  startPoint: PointTypes,
  endPoint: PointTypes
): {
  dx: number;
  dy: number;
  absDx: number;
  absDy: number;
} => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  return { dx, dy, absDx, absDy };
};

export const calculateFixedLineInflectionConstant = (
  absDx: number,
  absDy: number
) => {
  const WEIGHT_X = 4;
  const WEIGHT_Y = 0.8;

  return Math.round(Math.sqrt(absDx) * WEIGHT_X + Math.sqrt(absDy) * WEIGHT_Y);
};

export const calculateControlPointsWithoutBoundingBox = ({
  absDx,
  absDy,
  dx,
  dy,
}: {
  absDx: number;
  absDy: number;
  dx: number;
  dy: number;
}): {
  p1: PointTypes;
  p2: PointTypes;
  p3: PointTypes;
  p4: PointTypes;
} => {
  let leftTopX = 0;
  let leftTopY = 0;
  let rightBottomX = absDx;
  let rightBottomY = absDy;
  if (dx < 0) [leftTopX, rightBottomX] = [rightBottomX, leftTopX];
  if (dy < 0) [leftTopY, rightBottomY] = [rightBottomY, leftTopY];

  const controlPointShift = Math.max(absDx, absDy) * 0.2; // Adjust as needed

  const p1 = {
    x: leftTopX,
    y: leftTopY,
  };
  const p2 = {
    x: leftTopX + controlPointShift,
    y: leftTopY + (dy < 0 ? -controlPointShift : controlPointShift),
  };
  const p3 = {
    x: rightBottomX - controlPointShift,
    y: rightBottomY - (dy < 0 ? -controlPointShift : controlPointShift),
  };
  const p4 = {
    x: rightBottomX,
    y: rightBottomY,
  };

  return { p1, p2, p3, p4 };
};

export const calculateControlPoints = ({
  boundingBoxElementsBuffer,
  absDx,
  absDy,
  dx,
  dy,
}: {
  boundingBoxElementsBuffer: number;
  absDx: number;
  absDy: number;
  dx: number;
  dy: number;
}): {
  p1: PointTypes;
  p2: PointTypes;
  p3: PointTypes;
  p4: PointTypes;
  boundingBoxBuffer: {
    vertical: number;
    horizontal: number;
  };
} => {
  const { p1, p2, p3, p4 } = calculateControlPointsWithoutBoundingBox({
    absDx,
    absDy,
    dx,
    dy,
  });

  const topBorder = Math.min(p1.y, p2.y, p3.y, p4.y);
  const bottomBorder = Math.max(p1.y, p2.y, p3.y, p4.y);
  const leftBorder = Math.min(p1.x, p2.x, p3.x, p4.x);
  const rightBorder = Math.max(p1.x, p2.x, p3.x, p4.x);

  const verticalBuffer =
    (bottomBorder - topBorder - absDy) / 2 + boundingBoxElementsBuffer;
  const horizontalBuffer =
    (rightBorder - leftBorder - absDx) / 2 + boundingBoxElementsBuffer;

  const boundingBoxBuffer = {
    vertical: verticalBuffer,
    horizontal: horizontalBuffer,
  };

  return {
    p1: {
      x: p1.x + horizontalBuffer,
      y: p1.y + verticalBuffer,
    },
    p2: {
      x: p2.x + horizontalBuffer,
      y: p2.y + verticalBuffer,
    },
    p3: {
      x: p3.x + horizontalBuffer,
      y: p3.y + verticalBuffer,
    },
    p4: {
      x: p4.x + horizontalBuffer,
      y: p4.y + verticalBuffer,
    },
    boundingBoxBuffer,
  };
};
