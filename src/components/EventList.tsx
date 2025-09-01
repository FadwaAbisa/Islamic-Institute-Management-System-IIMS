import prisma from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-lamaSkyLight rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-lamaYellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-lamaYellow font-medium">لا توجد أحداث لهذا اليوم</p>
        <p className="text-lamaYellowLight text-sm mt-1">اختر تاريخاً آخر لعرض الأحداث</p>
      </div>
    );
  }

  return data.map((event, index) => (
    <div
      dir="rtl"
      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
        index % 2 === 0 
          ? 'border-lamaSky bg-gradient-to-r from-lamaSkyLight/30 to-white' 
          : 'border-lamaPurple bg-gradient-to-r from-lamaPurpleLight/30 to-white'
      }`}
      key={event.id}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lamaYellow text-lg">{event.title}</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-lamaSky rounded-full"></div>
          <span className="text-lamaYellow font-semibold text-sm">
            {event.startTime.toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
        </div>
      </div>
      {event.description && (
        <p className="text-lamaDarkGray text-sm leading-relaxed">{event.description}</p>
      )}
      <div className="mt-3 pt-3 border-t border-lamaSkyLight/50">
        <div className="flex items-center gap-2 text-xs text-lamaYellow">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>حدث يومي</span>
        </div>
      </div>
    </div>
  ));
};

export default EventList;
