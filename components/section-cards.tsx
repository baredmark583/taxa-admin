import { IconTrendingUp, IconUser, IconPigMoney, IconCrown } from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// FIX: Changed alias path to relative path to fix module resolution error.
import { AdminUser } from "../types";
import React from "react";

interface SectionCardsProps {
    users: AdminUser[];
}

export function SectionCards({ users }: SectionCardsProps) {
  const stats = React.useMemo(() => {
    if (!users || users.length === 0) {
      return {
        totalRealMoney: 0,
        totalUsers: 0,
        totalPlayMoney: 0,
        richestPlayer: { name: 'N/A', playMoney: 0 },
      };
    }

    const totalRealMoney = users.reduce((sum, user) => sum + user.realMoney, 0);
    const totalPlayMoney = users.reduce((sum, user) => sum + user.playMoney, 0);
    const richestPlayer = users.reduce((max, user) => user.playMoney > max.playMoney ? user : max, users[0]);
    
    return {
      totalRealMoney,
      totalUsers: users.length,
      totalPlayMoney,
      richestPlayer,
    };
  }, [users]);


  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Общий баланс (TON)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalRealMoney.toFixed(4)}
          </CardTitle>
           <div className="absolute top-4 right-4 text-muted-foreground">
             <IconTrendingUp size={28}/>
           </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Всего игроков</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalUsers}
          </CardTitle>
           <div className="absolute top-4 right-4 text-muted-foreground">
             <IconUser size={28}/>
           </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>В игре (Play Money)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${stats.totalPlayMoney.toLocaleString()}
          </CardTitle>
          <div className="absolute top-4 right-4 text-muted-foreground">
             <IconPigMoney size={28}/>
           </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Самый богатый игрок</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl truncate">
            {stats.richestPlayer.name}
          </CardTitle>
          <p className="text-muted-foreground text-sm">${stats.richestPlayer.playMoney.toLocaleString()}</p>
           <div className="absolute top-4 right-4 text-muted-foreground">
             <IconCrown size={28}/>
           </div>
        </CardHeader>
      </Card>
    </div>
  )
}