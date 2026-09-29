import { WorldPoint, ScreenPose } from '../types';
import { ANCHOR_X, ANCHOR_Y, LANE_LATERAL } from '../constants';
import { pointAt, headingAt, smoothHeadingAt } from './course';

/**
 * Transforms a world-space point W to 2D screen coordinates based on camera state.
 */
export function toScreen(
  worldPoint: WorldPoint,
  sRef: number,
  launchPx: number,
  camHeadingRad?: number
): WorldPoint {
  const thetaCam = camHeadingRad !== undefined ? camHeadingRad : smoothHeadingAt(sRef);
  const pRef = pointAt(sRef);

  const anchorX = ANCHOR_X + launchPx;
  const anchorY = ANCHOR_Y;

  const dx = worldPoint.x - pRef.x;
  const dy = worldPoint.y - pRef.y;

  // Rotate by -thetaCam (in clockwise-screen coordinates: x' = dx*cos - dy*sin with -thetaCam)
  // Rot(-thetaCam):
  // x_rot = dx * cos(-theta) - dy * sin(-theta) = dx * cos(theta) + dy * sin(theta)
  // y_rot = dx * sin(-theta) + dy * cos(-theta) = -dx * sin(theta) + dy * cos(theta)
  const cosT = Math.cos(thetaCam);
  const sinT = Math.sin(thetaCam);

  const rotX = dx * cosT + dy * sinT;
  const rotY = -dx * sinT + dy * cosT;

  return {
    x: anchorX + rotX,
    y: anchorY + rotY,
  };
}

/**
 * Calculates a boat's world position, screen position, and yaw angle.
 */
export function boatScreenPose(
  s_i: number,
  laneIndex: number,
  sRef: number,
  launchPx: number,
  camHeadingRad?: number
): ScreenPose {
  const thetaCam = camHeadingRad !== undefined ? camHeadingRad : smoothHeadingAt(sRef);
  const pBoat = pointAt(s_i);
  const headingBoat = headingAt(s_i);

  const lateral = LANE_LATERAL[laneIndex] ?? 0;
  // Right-hand normal N(theta) = (-sin(theta), cos(theta))
  const worldX = pBoat.x + lateral * (-Math.sin(headingBoat));
  const worldY = pBoat.y + lateral * Math.cos(headingBoat);

  const screenPt = toScreen({ x: worldX, y: worldY }, sRef, launchPx, thetaCam);
  const yawRad = headingBoat - thetaCam;
  const yawDeg = (yawRad * 180) / Math.PI;

  return {
    x: screenPt.x,
    y: screenPt.y,
    yawRad,
    yawDeg,
  };
}
