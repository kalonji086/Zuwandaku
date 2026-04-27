import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'defaokalonji086@gmail.com';
  const password = 'Proverbe:17?';
  const name = 'Super Admin ZUWAndaku';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Mettre à jour si existe déjà
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: { role: 'SUPER_ADMIN', password: hashed, isActive: true, status: 'APPROVED' },
    });
    console.log('✅ Super Admin mis à jour :', email);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      name,
      password: hashed,
      role: 'SUPER_ADMIN',
      isActive: true,
      status: 'APPROVED',
    },
  });

  console.log('✅ Super Admin créé avec succès !');
  console.log('   Email    :', email);
  console.log('   Rôle     : SUPER_ADMIN');
}

main()
  .catch((e) => { console.error('❌ Erreur :', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
