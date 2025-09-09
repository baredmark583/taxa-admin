"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rank, Suit, SlotSymbol } from '@/types'; // Assuming types are shared
import { IconDeviceFloppy, IconRefresh, IconTrash, IconPlus } from '@tabler/icons-react';

// Define the shape of your assets
interface GameAssets {
  cardBackUrl: string;
  tableBackgroundUrl: string;
  godModePassword: string;
  cardFaces: { [suit in Suit]?: { [rank in Rank]?: string } };
  slotSymbols: SlotSymbol[];
}

const suitOrder: Suit[] = [Suit.SPADES, Suit.HEARTS, Suit.CLUBS, Suit.DIAMONDS];
const rankOrder: Rank[] = [Rank.ACE, Rank.KING, Rank.QUEEN, Rank.JACK, Rank.TEN, Rank.NINE, Rank.EIGHT, Rank.SEVEN, Rank.SIX, Rank.FIVE, Rank.FOUR, Rank.THREE, Rank.TWO];


export function AssetManagement() {
    const [assets, setAssets] = useState<GameAssets | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchAssets = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/assets`);
            if (!res.ok) throw new Error("Не удалось загрузить ассеты");
            const data = await res.json();
            setAssets(data);
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    const handleSave = () => {
        const promise = fetch(`${apiUrl}/api/assets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assets),
        }).then(res => {
            if(!res.ok) return res.json().then(err => { throw new Error(err.error || 'Ошибка сохранения') });
            return res.json();
        }).then(data => {
            setAssets(data);
        });

        toast.promise(promise, {
            loading: 'Сохранение ассетов...',
            success: 'Ассеты успешно сохранены!',
            error: (err) => err.message,
        });
    };

    const handleReset = () => {
        const promise = fetch(`${apiUrl}/api/assets/reset`, {
            method: 'POST',
        }).then(res => {
            if(!res.ok) return res.json().then(err => { throw new Error(err.error || 'Ошибка сброса') });
            return res.json();
        }).then(data => {
            setAssets(data);
        });

        toast.promise(promise, {
            loading: 'Сброс ассетов к значениям по умолчанию...',
            success: 'Ассеты успешно сброшены!',
            error: (err) => err.message,
        });
    };
    
    const handleInputChange = (field: keyof GameAssets, value: string) => {
        if (!assets) return;
        setAssets({ ...assets, [field]: value });
    };

    const handleCardFaceChange = (suit: Suit, rank: Rank, value: string) => {
        if (!assets) return;
        const newFaces = { ...assets.cardFaces };
        if (!newFaces[suit]) newFaces[suit] = {};
        newFaces[suit]![rank] = value;
        setAssets({ ...assets, cardFaces: newFaces });
    }
    
    const handleSlotSymbolChange = (index: number, field: keyof SlotSymbol, value: string | number) => {
        if (!assets) return;
        const newSymbols = [...assets.slotSymbols];
        // FIX: Replaced the failing type assertion with `as any` to allow for dynamic
        // property assignment. TypeScript cannot verify the type safety of assigning
        // a `string | number` value to a property accessed by a dynamic key
        // (`field`), so we must bypass the type checker for this operation.
        (newSymbols[index] as any)[field] = value;
        setAssets({ ...assets, slotSymbols: newSymbols });
    }
    
    const addSlotSymbol = () => {
        if (!assets) return;
        const newSymbol: SlotSymbol = { name: 'NEW', imageUrl: '', payout: 10, weight: 1 };
        setAssets({ ...assets, slotSymbols: [...assets.slotSymbols, newSymbol] });
    }
    
    const removeSlotSymbol = (index: number) => {
        if (!assets) return;
        const newSymbols = assets.slotSymbols.filter((_, i) => i !== index);
        setAssets({ ...assets, slotSymbols: newSymbols });
    }

    if (isLoading) {
        return <div className="p-6 text-center">Загрузка ассетов...</div>;
    }

    if (!assets) {
        return <div className="p-6 text-center text-red-500">Не удалось загрузить ассеты.</div>;
    }

    return (
        <div className="p-4 lg:p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">Управление ассетами</h2>
                    <p className="text-muted-foreground text-sm">Настройте внешний вид игровых элементов.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleReset}><IconRefresh className="mr-2 h-4 w-4" /> Сбросить</Button>
                    <Button onClick={handleSave}><IconDeviceFloppy className="mr-2 h-4 w-4" /> Сохранить</Button>
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle>Общие настройки</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="tableBackgroundUrl">URL фона стола</Label>
                        <Input id="tableBackgroundUrl" value={assets.tableBackgroundUrl} onChange={e => handleInputChange('tableBackgroundUrl', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="cardBackUrl">URL рубашки карт</Label>
                        <Input id="cardBackUrl" value={assets.cardBackUrl} onChange={e => handleInputChange('cardBackUrl', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="godModePassword">Пароль &quot;Режима бога&quot;</Label>
                        <Input id="godModePassword" value={assets.godModePassword} onChange={e => handleInputChange('godModePassword', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Лица карт (52)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {suitOrder.map(suit => (
                        <div key={suit}>
                            <h4 className="font-semibold mb-2 capitalize">{suit.toLowerCase()}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                {rankOrder.map(rank => (
                                    <div key={`${suit}-${rank}`} className="space-y-1">
                                        <Label className="text-xs font-mono">{rank}</Label>
                                        <Input 
                                            value={assets.cardFaces?.[suit]?.[rank] || ''}
                                            onChange={e => handleCardFaceChange(suit, rank, e.target.value)}
                                            placeholder="URL..."
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Символы для слотов</CardTitle>
                    <Button size="sm" onClick={addSlotSymbol}><IconPlus className="mr-2 h-4 w-4"/> Добавить</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                   {assets.slotSymbols.map((symbol, index) => (
                       <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg items-end">
                           <div className="space-y-2 md:col-span-2">
                               <Label>Название</Label>
                               <Input value={symbol.name} onChange={e => handleSlotSymbolChange(index, 'name', e.target.value)} />
                           </div>
                           <div className="space-y-2 md:col-span-3">
                               <Label>URL картинки</Label>
                               <Input value={symbol.imageUrl} onChange={e => handleSlotSymbolChange(index, 'imageUrl', e.target.value)} />
                           </div>
                           <div className="space-y-2">
                               <Label>Выплата (множитель)</Label>
                               <Input type="number" value={symbol.payout} onChange={e => handleSlotSymbolChange(index, 'payout', Number(e.target.value))} />
                           </div>
                           <div className="space-y-2">
                               <Label>Вес (частота)</Label>
                               <Input type="number" value={symbol.weight} onChange={e => handleSlotSymbolChange(index, 'weight', Number(e.target.value))} />
                           </div>
                           <Button variant="destructive" onClick={() => removeSlotSymbol(index)}><IconTrash size={16} /></Button>
                       </div>
                   ))}
                </CardContent>
            </Card>

        </div>
    );
}