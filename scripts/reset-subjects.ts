import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const BASIC_SUBJECTS = [
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
    "حاسوب"
]

async function resetSubjects() {
    try {
        console.log('🗑️ بدء إعادة تعيين المواد الدراسية...')

        // حذف جميع المواد الموجودة
        console.log('🗑️ حذف جميع المواد الدراسية الموجودة...')
        const deleteResult = await prisma.subject.deleteMany({})
        console.log(`✅ تم حذف ${deleteResult.count} مادة دراسية`)

        // إنشاء المواد الأساسية الجديدة
        console.log('🌱 إنشاء المواد الأساسية الجديدة...')

        for (const subjectName of BASIC_SUBJECTS) {
            const subject = await prisma.subject.create({
                data: { name: subjectName }
            })
            console.log(`✅ تم إنشاء المادة: ${subject.name} (ID: ${subject.id})`)
        }

        // عرض جميع المواد الجديدة
        const allSubjects = await prisma.subject.findMany({
            orderBy: { name: 'asc' }
        })

        console.log('\n📚 المواد الدراسية الجديدة في قاعدة البيانات:')
        allSubjects.forEach((subject, index) => {
            console.log(`${index + 1}. ${subject.name} (ID: ${subject.id})`)
        })

        console.log('\n🎉 تم إعادة تعيين المواد الدراسية بنجاح!')

    } catch (error) {
        console.error('❌ خطأ في إعادة تعيين المواد:', error)
    } finally {
        await prisma.$disconnect()
    }
}

resetSubjects()
