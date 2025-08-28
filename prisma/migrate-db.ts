import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🚀 بدء تحديث قاعدة البيانات...')
    
    // إنشاء الجداول
    console.log('📊 إنشاء الجداول...')
    
    // يمكنك إضافة أي بيانات أولية هنا إذا كنت تريد
    
    console.log('✅ تم تحديث قاعدة البيانات بنجاح!')
    
  } catch (error) {
    console.error('❌ خطأ في تحديث قاعدة البيانات:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ خطأ عام:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🔌 تم قطع الاتصال مع قاعدة البيانات')
  })
