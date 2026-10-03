"use client";

import { useFormStatus } from "react-dom";

type BlockMoveButtonsProps = {
  blockName: string;
  canMoveDown: boolean;
  canMoveUp: boolean;
};

export function BlockMoveButtons({
  blockName,
  canMoveDown,
  canMoveUp,
}: BlockMoveButtonsProps) {
  const { pending } = useFormStatus();

  return (
    <>
      <button
        aria-label={`Move ${blockName} up`}
        className="secondary"
        disabled={pending || !canMoveUp}
        name="direction"
        type="submit"
        value="up"
      >
        Move up
      </button>
      <button
        aria-label={`Move ${blockName} down`}
        className="secondary"
        disabled={pending || !canMoveDown}
        name="direction"
        type="submit"
        value="down"
      >
        Move down
      </button>
    </>
  );
}
