
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Stopwatch } from '@/components/ui/Stopwatch';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import '@/styles/StudyTimer.css';

const StudyTimer = () => {
  const [timerType, setTimerType] = useState<'stopwatch' | 'countdown'>('stopwatch');

  return (
    <Card className="study-timer-container">
      <Tabs defaultValue="stopwatch" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="stopwatch"
            onClick={() => setTimerType('stopwatch')}
          >
            Stopwatch
          </TabsTrigger>
          <TabsTrigger
            value="countdown"
            onClick={() => setTimerType('countdown')}
          >
            Countdown
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stopwatch">
          <Stopwatch />
        </TabsContent>
        <TabsContent value="countdown">
          <CountdownTimer />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default StudyTimer;
