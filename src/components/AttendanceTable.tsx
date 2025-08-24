"use client";

import { useState } from "react";
import FormModal from "./FormModal";

type Column = {
    header: string;
    accessor: string;
    className?: string;
};

type AttendanceTableProps = {
    columns: Column[];
    data: any[];
    userRole?: string;
};

const AttendanceTable = ({ columns, data, userRole }: AttendanceTableProps) => {
    const [sortBy, setSortBy] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const renderRow = (item: any) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <td className="flex items-center gap-4 p-4">
                <div className="flex flex-col">
                    <h3 className="font-semibold">{item.student.fullName}</h3>
                    <p className="text-xs text-gray-500">
                        {item.student.class?.name ?? "غير محدد"}
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
                    {userRole === "admin" && (
                        <>
                            <FormModal table="attendance" type="update" data={item} />
                            <FormModal table="attendance" type="delete" id={item.id} />
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    const handleSort = (accessor: string) => {
        if (sortBy === accessor) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(accessor);
            setSortOrder("asc");
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortBy) return 0;

        let aValue: any;
        let bValue: any;

        switch (sortBy) {
            case "student":
                aValue = a.student.fullName;
                bValue = b.student.fullName;
                break;
            case "lesson":
                aValue = a.lesson.name;
                bValue = b.lesson.name;
                break;
            case "date":
                aValue = new Date(a.date);
                bValue = new Date(b.date);
                break;
            case "present":
                aValue = a.present ? 1 : 0;
                bValue = b.present ? 1 : 0;
                break;
            default:
                return 0;
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    return (
        <div className="mt-4">
            <table className="w-full mt-4" dir="rtl">
                <thead>
                    <tr className="text-right text-gray-500 text-sm">
                        {columns.map((col) => (
                            <th
                                key={col.accessor}
                                className={`p-4 cursor-pointer hover:bg-gray-50 ${col.className || ""}`}
                                onClick={() => handleSort(col.accessor)}
                            >
                                <div className="flex items-center justify-between">
                                    {col.header}
                                    {sortBy === col.accessor && (
                                        <span className="text-xs">
                                            {sortOrder === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody dir="rtl">
                    {sortedData.length > 0 ? (
                        sortedData.map((item) => renderRow(item))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="text-center p-8 text-gray-500">
                                لا توجد بيانات حضور وغياب
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;
