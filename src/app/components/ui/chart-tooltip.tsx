import { motion, AnimatePresence } from 'motion/react';

interface PayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  fill?: string;
  dataKey?: string;
  payload?: Record<string, unknown>;
  unit?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: number | string, name?: string) => string;
  hideLabel?: boolean;
  indicator?: 'dot' | 'line' | 'dashed';
}

export function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  hideLabel = false,
  indicator = 'dot',
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const formattedLabel = labelFormatter ? labelFormatter(String(label)) : label;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 4, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 4, scale: 0.96 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="min-w-[140px] overflow-hidden rounded-lg border border-border/60 bg-popover px-3 py-2 shadow-xl shadow-black/10"
      >
        {!hideLabel && formattedLabel && (
          <p className="mb-1.5 text-xs text-muted-foreground">{formattedLabel}</p>
        )}
        <div className="flex flex-col gap-1">
          {payload.map((item, index) => {
            const color = item.color || item.fill || 'var(--chart-1)';
            const name = item.name || item.dataKey || '';
            const value = valueFormatter
              ? valueFormatter(item.value ?? '', name)
              : item.value;

            return (
              <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  {indicator === 'dot' && (
                    <span
                      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  )}
                  {indicator === 'line' && (
                    <span
                      className="inline-block h-0.5 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  )}
                  {indicator === 'dashed' && (
                    <span
                      className="inline-block h-0.5 w-3 shrink-0 rounded-full border-b-2 border-dashed"
                      style={{ borderColor: color }}
                    />
                  )}
                  <span className="text-xs text-muted-foreground">{name}</span>
                </div>
                <span className="text-xs tabular-nums text-popover-foreground" style={{ fontWeight: 600 }}>
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Cursor component for highlighting the hovered bar/area
export function ChartCursor({ fill = 'var(--foreground)', opacity = 0.05 }: { fill?: string; opacity?: number }) {
  return { fill, opacity };
}
