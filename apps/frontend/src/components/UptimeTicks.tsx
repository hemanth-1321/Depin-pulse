interface TicksProps {
    ticks: ("good" | "bad")[];
}

export function UptimeTicks({ ticks }: TicksProps) {
  console.log("ticks",ticks)
  return (
    <div className="flex gap-1 mt-2">
      {ticks.map((tick, index) => {
        const color =
          tick === 'good'
            ? 'bg-green-500'
            : tick === 'bad'
            ? 'bg-red-500'
            : 'bg-gray-500';
        return <div key={index} className={`w-8 h-2 rounded ${color}`} />;
      })}
    </div>
  );
}