import { Suspense } from "react";
import AttendanceTable from "../../../../components/AttendanceTable";
import AttendanceStats from "../../../../components/AttendanceStats";
import FormModal from "../../../../components/FormModal";
import Pagination from "../../../../components/Pagination";
import TableSearch from "../../../../components/TableSearch";
import prisma from "../../../../lib/prisma";
import { ITEM_PER_PAGE } from "../../../../lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type AttendanceList = {
    id: number;
    student: {
        id: string;
        fullName: string;
        class?: {
            name: string;
        };
    };
    lesson: {
        name: string;
        subject: {
            name: string;
        };
        class: {
            name: string;
        };
    };
    date: Date;
    present: boolean;
};

const AttendancePage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;

    const columns = [
        {
            header: "معلومات الطالب",
            accessor: "student",
        },
        {
            header: "الحصة/المادة",
            accessor: "lesson",
            className: "hidden md:table-cell",
        },
        {
            header: "التاريخ",
            accessor: "date",
            className: "hidden md:table-cell",
        },
        {
            header: "الحالة",
            accessor: "present",
        },
        {
            header: "الإجراءات",
            accessor: "action",
        },
    ];

    const renderRow = (item: AttendanceList) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <td className="flex items-center gap-4 p-4">
                <div className="flex flex-col">
                    <h3 className="font-semibold">{item.student.fullName}</h3>
                    <p className="text-xs text-gray-500">
                        {item.student.class?.name || "غير محدد"}
                    </p>
                </div>
            </td>
            <td className="hidden md:table-cell">
                <div className="flex flex-col">
                    <span className="font-medium">{item.lesson.name}</span>
                    <span className="text-xs text-gray-500">{item.lesson.subject.name}</span>
                </div>
            </td>
            <td className="hidden md:table-cell">
                {new Intl.DateTimeFormat("ar-SA").format(item.date)}
            </td>
            <td>
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.present
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                >
                    {item.present ? "حاضر" : "غائب"}
                </span>
            </td>
            <td>
                <div className="flex items-center gap-2">
                    {role === "admin" && (
                        <>
                            <FormModal table="attendance" type="update" data={item} />
                            <FormModal table="attendance" type="delete" id={item.id} />
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    // URL PARAMS CONDITION
    const query: Prisma.AttendanceWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "classId":
                        query.lesson = {
                            classId: parseInt(value),
                        };
                        break;
                    case "search":
                        query.student = {
                            fullName: { contains: value, mode: "insensitive" },
                        };
                        break;
                }
            }
        }
    }

    // ROLE CONDITIONS
    if (currentUserId) {
        switch (role) {
            case "admin":
                break;
            case "teacher":
                query.lesson = {
                    ...(query.lesson || {}),
                    teacherId: currentUserId,
                } as Prisma.LessonWhereInput;
                break;
            case "student":
                query.studentId = currentUserId;
                break;
            case "parent":
                query.student = {
                    ...(query.student || {}),
                    parentId: currentUserId,
                } as Prisma.StudentWhereInput;
                break;
            default:
                break;
        }
    }



    const [data, count] = await prisma.$transaction([
        prisma.attendance.findMany({
            where: query,
            include: {
                student: {
                    include: {
                        class: { select: { name: true } },
                    },
                },
                lesson: {
                    include: {
                        subject: { select: { name: true } },
                        class: { select: { name: true } },
                    },
                },
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            orderBy: {
                date: "desc",
            },
        }),
        prisma.attendance.count({ where: query }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">كشف الحضور والغياب</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="Filter" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="Sort" width={14} height={14} />
                        </button>
                        {role === "admin" && (
                            <FormModal table="attendance" type="create" />
                        )}
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div className="mt-4">
                <Suspense fallback="جاري التحميل...">
                    <AttendanceStats />
                </Suspense>
            </div>

            {/* LIST */}
            <AttendanceTable columns={columns} data={data} userRole={role} />

            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    );
};

export default AttendancePage;
