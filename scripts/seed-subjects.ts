import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SUBJECTS = [
    "قرآن وأحكامه",
    "سيرة",
    "تفسير",
    "عقيدة",
    "فقه",
    "دراسات الأدبية",
    "دراسات اللغوية",
    "أصول الفقه",
    "منهج دعوة",
    "علوم حديث",
    "لغة إنجليزية",
    "حاسوب",
    "أدب إسلامي",
    "بلاغة",
    "صرف",
    "نحو",
    "تجويد",
    "أخلاق",
    "تاريخ إسلامي",
    "جغرافيا إسلامية"
]

async function seedSubjects() {
    try {
        console.log('🌱 بدء إدخال المواد الدراسية...')

        // التحقق من المواد الموجودة
        const existingSubjects = await prisma.subject.findMany({
            where: { name: { in: SUBJECTS } }
        })

        console.log(`📚 المواد الموجودة: ${existingSubjects.length}`)

        if (existingSubjects.length > 0) {
            console.log('المواد الموجودة:')
            existingSubjects.forEach(subject => {
                console.log(`  - ${subject.name}`)
            })
        }

        // إنشاء المواد الجديدة
        const subjectsToCreate = SUBJECTS.filter(
            subjectName => !existingSubjects.find(s => s.name === subjectName)
        )

        if (subjectsToCreate.length === 0) {
            console.log('✅ جميع المواد موجودة بالفعل!')
            return
        }

        console.log(`🆕 المواد المراد إنشاؤها: ${subjectsToCreate.length}`)
        subjectsToCreate.forEach(name => console.log(`  - ${name}`))

        // إنشاء المواد
        const createdSubjects = await prisma.subject.createMany({
            data: subjectsToCreate.map(name => ({ name })),
            skipDuplicates: true
        })

        console.log(`✅ تم إنشاء ${createdSubjects.count} مادة جديدة`)

        // عرض جميع المواد
        const allSubjects = await prisma.subject.findMany({
            orderBy: { name: 'asc' }
        })

        console.log('\n📚 جميع المواد في قاعدة البيانات:')
        allSubjects.forEach((subject, index) => {
            console.log(`${index + 1}. ${subject.name} (ID: ${subject.id})`)
        })

    } catch (error) {
        console.error('❌ خطأ في إدخال المواد:', error)
    } finally {
        await prisma.$disconnect()
    }
}

seedSubjects()
