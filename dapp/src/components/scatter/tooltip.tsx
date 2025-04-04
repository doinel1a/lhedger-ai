import styles from './tooltip.module.css';

// Information needed to build the tooltip
export type InteractionData = {
  xPos: number;
  yPos: number;
  sharpe: number;
  portfolio: { [token: string]: number };
};

type TooltipProps = {
  interactionData: InteractionData | null;
};

export const Tooltip = ({ interactionData }: TooltipProps) => {
  if (!interactionData) {
    return null;
  }

  return (
    <div
      className={styles.tooltip}
      style={{
        left: interactionData.xPos,
        top: interactionData.yPos
      }}
    >
      {interactionData.sharpe.toFixed(2)}
      {
        /* Portfolio composition */
        Object.entries(interactionData.portfolio).map(([token, amount]) => (
          <div key={token}>
            {token}: {(amount * 100).toFixed(2)} %
          </div>
        ))
      }
    </div>
  );
};
