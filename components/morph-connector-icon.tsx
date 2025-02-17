"use client";

import Image from "next/image";
import { type ConnectorId, getConnector } from "@/app/(morph)/morph";

/**
 * Component for displaying connector icons with consistent styling
 * @param connectorId - ID of the connector to display icon for
 * @param size - Size of the icon in pixels (default: 20)
 */
export function ConnectorIcon({
  connectorId,
  size = 20,
}: {
  connectorId: ConnectorId;
  size?: number;
}) {
  const connector = getConnector(connectorId);

  return (
    <div
      className="p-1 rounded-sm"
      style={{
        background: `linear-gradient(135deg, ${connector?.primaryColor}FF, ${connector?.primaryColor}99)`,
        border: `1px solid ${connector?.primaryColor}66`,
        boxShadow: `0 0 8px ${connector?.primaryColor}33`,
      }}
    >
      <Image
        src={`/icons/${connectorId}.svg`}
        alt={`${connector?.name} Icon`}
        width={size}
        height={size}
        className="object-contain brightness-0 invert"
      />
    </div>
  );
}
