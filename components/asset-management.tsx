
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// FIX: Changed alias path to relative path to fix module resolution error.
import { Rank, Suit, GameAssets, IconAssets, LotteryPrize } from '../types';
import { IconDeviceFloppy, IconRefresh, IconTrash, IconPlus } from '@tabler/icons-react';

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
    
    const handleInputChange = (field: keyof GameAssets, value: string | number) => {
        if (!assets) return;
        setAssets({ ...assets, [field]: value });
    };

    const handleCardFaceChange = (suit: Suit, rank: Rank, value: string) => {
        if (!assets) return;
        const newFaces = {
            ...assets.cardFaces,
            [suit]: {
                ...(assets.cardFaces?.[suit] || {}),
                [rank]: value,
            },
        };
        // FIX: The type of `newFaces` may not strictly match `GameAssets['cardFaces']` if the initial
        // `assets.cardFaces` from the API was partial. We use a type assertion to proceed,
        // as the component logic is designed to handle this partial data, resolving the assignment error.
        setAssets({ ...assets, cardFaces: newFaces as GameAssets['cardFaces'] });
    }
    
    const handleSlotSymbolChange = <K extends keyof GameAssets['slotSymbols'][0]>(index: number, field: K, value: GameAssets['slotSymbols'][0][K]) => {
        if (!assets) return;
        const newSymbols = [...assets.slotSymbols];
        newSymbols[index] = { ...newSymbols[index], [field]: value };
        setAssets({ ...assets, slotSymbols: newSymbols });
    };

    const handleLotteryPrizeChange = (
        prizeType: 'lotteryPrizesPlayMoney' | 'lotteryPrizesRealMoney',
        index: number, 
        field: keyof LotteryPrize, 
        value: string | number
    ) => {
        if (!assets) return;
        const newPrizes = [...assets[prizeType]];
        newPrizes[index] = { ...newPrizes[index], [field]: value };
        setAssets({ ...assets, [prizeType]: newPrizes });
    };

    const addLotteryPrize = (prizeType: 'lotteryPrizesPlayMoney' | 'lotteryPrizesRealMoney') => {
        if (!assets) return;
        const newPrize: LotteryPrize = { label: 'New Prize', multiplier: 100, weight: 10 };
        setAssets({ ...assets, [prizeType]: [...assets[prizeType], newPrize] });
    };
    
    const removeLotteryPrize = (prizeType: 'lotteryPrizesPlayMoney' | 'lotteryPrizesRealMoney', index: number) => {
        if (!assets) return;
        const newPrizes = assets[prizeType].filter((_, i) => i !== index);
        setAssets({ ...assets, [prizeType]: newPrizes });
    };
    
    const addSlotSymbol = () => {
        if (!assets) return;
        const newSymbol: GameAssets['slotSymbols'][0] = { name: 'NEW', imageUrl: '', payout: 10, weight: 1 };
        setAssets({ ...assets, slotSymbols: [...assets.slotSymbols, newSymbol] });
    }
    
    const removeSlotSymbol = (index: number) => {
        if (!assets) return;
        const newSymbols = assets.slotSymbols.filter((_, i) => i !== index);
        setAssets({ ...assets, slotSymbols: newSymbols });
    }
    
    const iconFields: { key: keyof IconAssets; label: string }[] = [
        { key: 'iconFavicon', label: 'Favicon' },
        { key: 'iconManifest', label: 'TON Manifest Icon' },
        { key: 'iconCrypto', label: 'Crypto Icon (TON)' },
        { key: 'iconPlayMoney', label: 'Play Money Icon' },
        { key: 'iconExit', label: 'Exit/Lobby Icon' },
        { key: 'iconSettings', label: 'Settings Icon' },
        { key: 'iconUsers', label: 'Users Icon' },
        { key: 'iconDealerChip', label: 'Dealer Chip Icon' },
        { key: 'iconPokerChip', label: 'Poker Chip Icon' },
        { key: 'iconSlotMachine', label: 'Slot Machine Icon' },
        { key: 'iconRoulette', label: 'Roulette Icon' },
        { key: 'iconFold', label: 'Fold Action Icon' },
        { key: 'iconCall', label: 'Call/Check Action Icon' },
        { key: 'iconRaise', label: 'Raise/Bet Action Icon' },
        { key: 'iconBank', label: 'Bank Icon' },
    ];


    if (isLoading) {
        return <div className="p-6 text-center">Загрузка ассетов...</div>;
    }

    if (!assets) {
        return <div className="p-6 text-center text-red-500">Не удалось загрузить ассеты.</div>;
    }

    return (
        <div className="p-4 lg:p-6 space-y-6 overflow-y-auto">
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
                 <CardHeader>
                    <CardTitle>Управление иконками</CardTitle>
                    <CardDescription>Вставьте URL иконок с <a href="https://icon-sets.iconify.design/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Iconify</a> или любого другого источника.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {iconFields.map(({ key, label }) => (
                        <div key={key as string} className="space-y-2">
                            <Label htmlFor={key as string}>{label}</Label>
                            <Input id={key as string} value={assets[key]} onChange={e => handleInputChange(key, e.target.value)} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Настройки лотереи</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="lotteryTicketPricePlayMoney">Цена билета (Play Money)</Label>
                            <Input id="lotteryTicketPricePlayMoney" type="number" value={assets.lotteryTicketPricePlayMoney} onChange={e => handleInputChange('lotteryTicketPricePlayMoney', Number(e.target.value))} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="lotteryTicketPriceRealMoney">Цена билета (Real Money - TON)</Label>
                            <Input id="lotteryTicketPriceRealMoney" type="number" step="0.01" value={assets.lotteryTicketPriceRealMoney} onChange={e => handleInputChange('lotteryTicketPriceRealMoney', Number(e.target.value))} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {([
                            { type: 'lotteryPrizesPlayMoney', title: 'Призы - Easy (Play Money)' },
                            { type: 'lotteryPrizesRealMoney', title: 'Призы - Hard (Real Money)' }
                        ] as const).map(({ type, title }) => (
                            <div key={type} className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold">{title}</h4>
                                    <Button size="sm" onClick={() => addLotteryPrize(type)}><IconPlus className="mr-2 h-4 w-4"/> Добавить</Button>
                                </div>
                                {assets[type]?.map((prize, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2 border rounded-lg items-end">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Название</Label>
                                            <Input value={prize.label} onChange={e => handleLotteryPrizeChange(type, index, 'label', e.target.value)} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Множитель (%)</Label>
                                            <Input type="number" value={prize.multiplier} onChange={e => handleLotteryPrizeChange(type, index, 'multiplier', Number(e.target.value))} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Вес (шанс)</Label>
                                            <Input type="number" value={prize.weight} onChange={e => handleLotteryPrizeChange(type, index, 'weight', Number(e.target.value))} />
                                        </div>
                                        <Button size="icon" variant="destructive" onClick={() => removeLotteryPrize(type, index)}><IconTrash size={16} /></Button>
                                    </div>
                                ))}
                            </div>
                        ))}
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