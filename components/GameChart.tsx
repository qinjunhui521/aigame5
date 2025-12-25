import React from 'react';
import { AreaChart, Area, YAxis, XAxis, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';

interface GameChartProps {
  data: { time: number; price: number }[];
  startPrice: number;
  currentPrice: number;
  tpPrice: number | null;
  slPrice: number | null;
  isLong: boolean;
}

export const GameChart: React.FC<GameChartProps> = ({ data, startPrice, currentPrice, tpPrice, slPrice, isLong }) => {
  const isProfit = isLong ? currentPrice >= startPrice : currentPrice <= startPrice;
  const color = isProfit ? '#10b981' : '#ef4444'; // Green or Red

  // Calculate domain to keep chart looking nice
  const allPrices = data.map(d => d.price);
  // Add buffers
  const minP = Math.min(...allPrices, slPrice || Infinity, tpPrice || Infinity, startPrice) * 0.9995;
  const maxP = Math.max(...allPrices, slPrice || -Infinity, tpPrice || -Infinity, startPrice) * 1.0005;

  const lastPoint = data[data.length - 1];

  return (
    <div className="w-full h-48 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700 relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" hide domain={['dataMin', 'dataMax']} />
          <YAxis domain={[minP, maxP]} hide />
          
          <ReferenceLine y={startPrice} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'Entry', fill: '#94a3b8', fontSize: 10 }} />
          {tpPrice && (
            <ReferenceLine y={tpPrice} stroke="#10b981" label={{ value: 'TP', fill: '#10b981', fontSize: 10 }} />
          )}
          {slPrice && (
            <ReferenceLine y={slPrice} stroke="#ef4444" label={{ value: 'SL', fill: '#ef4444', fontSize: 10 }} />
          )}
          
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            isAnimationActive={false}
          />

          {/* Live Indicator Dot with Pulse */}
          {lastPoint && (
            <ReferenceDot 
              x={lastPoint.time} 
              y={lastPoint.price} 
              shape={(props: any) => (
                <g>
                  <circle cx={props.cx} cy={props.cy} r={10} fill={color} className="animate-ping opacity-20 origin-center" style={{ transformBox: 'fill-box' }} />
                  <circle cx={props.cx} cy={props.cy} r={4} fill={color} stroke="white" strokeWidth={2} />
                </g>
              )}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="absolute top-2 right-2 font-mono text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded backdrop-blur-sm border border-slate-700/50">
        Current: <span className={isProfit ? 'text-green-400' : 'text-red-400'}>{currentPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};