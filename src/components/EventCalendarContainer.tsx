import Image from "next/image";
import EventCalendar from "./EventCalendar";
import EventList from "./EventList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles } from "lucide-react";
import Link from "next/link";

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-xl overflow-hidden" dir="rtl">
      <CardHeader className="bg-gradient-to-r from-lama-yellow/20 via-lama-sky/20 to-lama-purple/20 border-b border-lama-sky/20">
        <CardTitle className="flex items-center justify-between text-lama-yellow">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-lama-yellow to-lama-sky p-2 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">التقويم والأحداث</div>
              <div className="text-sm text-gray-600 font-normal">أحداث المعهد والفعاليات</div>
            </div>
          </div>
          <Link href="/events">
            <Button variant="outline" size="sm" className="text-lama-yellow border-lama-yellow hover:bg-lama-yellow hover:text-white">
              إدارة الأحداث
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* التقويم مع الأحداث */}
          <div className="group border-2 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.01] hover:shadow-xl border-lama-yellow/30 bg-gradient-to-br from-lama-yellow/10 to-lama-sky/5 hover:border-lama-yellow/60">
            <EventCalendar />
          </div>
          
          {/* قائمة الأحداث للتاريخ المحدد */}
          <div className="group border-2 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.01] hover:shadow-xl border-lama-sky/30 bg-gradient-to-br from-lama-sky/10 to-lama-purple/5 hover:border-lama-sky/60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-lama-sky to-lama-purple p-2 rounded-xl shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-lama-yellow">أحداث اليوم</h3>
              </div>
              <Image src="/moreDark.png" alt="المزيد" width={20} height={20} />
            </div>
            <div className="flex flex-col gap-4">
              <EventList dateParam={date} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendarContainer;
