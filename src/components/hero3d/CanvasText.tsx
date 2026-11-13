import { useEffect, useMemo } from "react";
import * as THREE from "three";

/**
 * Lightweight 3D label drawn onto a canvas texture.
 * Replaces drei's <Text> (troika), which needs `eval` (blocked by our
 * Content-Security-Policy) and downloads its font from a third-party CDN.
 */
interface Props {
  children: string;
  position?: [number, number, number];
  /** Height of the text in world units (same meaning as drei's fontSize). */
  fontSize?: number;
  color?: string;
  outlineColor?: string;
  /** Outline thickness in world units. */
  outlineWidth?: number;
  bold?: boolean;
}

const PX = 128; // canvas pixels per text line — crisp enough for roadside signs

const CanvasText = ({
  children,
  position = [0, 0, 0],
  fontSize = 0.3,
  color = "#ffffff",
  outlineColor,
  outlineWidth = 0,
  bold = true,
}: Props) => {
  const { texture, aspect } = useMemo(() => {
    const font = `${bold ? "700" : "400"} ${PX}px Poppins, "Segoe UI", Arial, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = font;
    const strokePx = outlineColor ? Math.max(1, (outlineWidth / fontSize) * PX * 2) : 0;
    const pad = Math.ceil(strokePx + PX * 0.1);
    const width = Math.ceil(ctx.measureText(children).width) + pad * 2;
    const height = Math.ceil(PX * 1.25) + pad * 2;
    canvas.width = width;
    canvas.height = height;

    ctx.font = font; // resizing the canvas resets the context state
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (strokePx > 0 && outlineColor) {
      ctx.lineJoin = "round";
      ctx.lineWidth = strokePx;
      ctx.strokeStyle = outlineColor;
      ctx.strokeText(children, width / 2, height / 2);
    }
    ctx.fillStyle = color;
    ctx.fillText(children, width / 2, height / 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return { texture: tex, aspect: width / height };
  }, [children, fontSize, color, outlineColor, outlineWidth, bold]);

  useEffect(() => () => texture.dispose(), [texture]);

  // Plane height covers the padded canvas, so scale so the glyphs are ~fontSize tall.
  const h = fontSize * 1.45;
  return (
    <mesh position={position}>
      <planeGeometry args={[h * aspect, h]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
};

export default CanvasText;
