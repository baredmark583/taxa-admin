"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { AdminUser } from "@/types"

const chartConfig = {
  playMoney: {
    label: "Игровые деньги",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

interface ChartRichestPlayersProps {
    users: AdminUser[];
}

export function ChartRichestPlayers({ users }: ChartRichestPlayersProps) {

  const chartData = React.useMemo(() => {
    if (!users || users.length === 0) return [];
    
    return [...users]
      .sort((a, b) => b.playMoney - a.playMoney)
      .slice(0, 10) // Take top 10
      .map(user => ({
          name: user.name,
          playMoney: user.playMoney,
      }))
      .reverse(); // Reverse for better bar chart presentation
  }, [users]);
  

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Топ-10 игроков по балансу (Play Money)</CardTitle>
        <CardDescription>
          Самые богатые игроки на данный момент.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid horizontal={false} />
             <XAxis type="number" dataKey="playMoney" hide />
             <YAxis 
                dataKey="name" 
                type="category" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={10} 
                width={120}
                className="text-sm"
             />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="playMoney" fill="var(--color-playMoney)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
