import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// 26 Provinces RDC complètes
const PROVINCES = [
  { nom: "Kinshasa", chefLieu: "Kinshasa", lat: -4.4419, lng: 15.2663 },
  { nom: "Kongo Central", chefLieu: "Matadi", lat: -5.8138, lng: 13.4585 },
  { nom: "Kwango", chefLieu: "Kenge", lat: -5.2708, lng: 17.4565 },
  { nom: "Kwilu", chefLieu: "Bandinga", lat: -6.5, lng: 18.5 },
  { nom: "Mai-Ndombe", chefLieu: "Inongo", lat: -1.9167, lng: 17.8833 },
  { nom: "Kasaï", chefLieu: "Lusambo", lat: -6.5, lng: 21.5 },
  { nom: "Kwilu", chefLieu: "Bandinga", lat: -6.5, lng: 18.5 },
  { nom: "Kwango", chefLieu: "Kenge", lat: -5.2708, lng: 17.4565 },
  { nom: "Kwango", chefLieu: "Kenge", lat: -5.2708, lng: 17.4565 },
  { nom: "Mongala", chefLieu: "Lisala", lat: 2.15, lng: 21.5167 },
  { nom: "Sud-Ubangi", chefLieu: "Yasa-Bongo", lat: 4.25, lng: 20.2667 },
  { nom: "Nord-Ubangi", chefLieu: "Bosobolo", lat: 4.1667, lng: 20.0167 },
  { nom: "Tshopo", chefLieu: "Kisangani", lat: 0.5167, lng: 25.2 },
  { nom: "Tshuapa", chefLieu: "Boende", lat: -0.3, lng: 20.2333 },
  { nom: "Haut-Lomami", chefLieu: "Kamina", lat: -8.9167, lng: 26.95 },
  { nom: "Lualaba", chefLieu: "Kolwezi", lat: -10.7167, lng: 26.2667 },
  { nom: "Haut-Katanga", chefLieu: "Lubumbashi", lat: -11.6667, lng: 27.4833 },
  { nom: "Lomami", chefLieu: "Kabinda", lat: -7.5833, lng: 24.4833 },
  { nom: "Kasaï-Oriental", chefLieu: "Mbuji-Mayi", lat: -6.1333, lng: 23.6 },
  { nom: "Kasaï Central", chefLieu: "Kananga", lat: -5.9, lng: 22.4167 },
  { nom: "Kasaï", chefLieu: "Lusambo", lat: -6.5, lng: 21.5 },
  { nom: "Nord-Kivu", chefLieu: "Goma", lat: -1.6582, lng: 29.2216 },
  { nom: "Sud-Kivu", chefLieu: "Bukavu", lat: -2.5, lng: 28.8333 },
  { nom: "Ituri", chefLieu: "Bunia", lat: 1.5667, lng: 30.25 },
  { nom: "Haut-Uele", chefLieu: "Isiro", lat: 2.7667, lng: 30.0167 },
  { nom: "Bas-Uele", chefLieu: "Buta", lat: 2.8167, lng: 24.7833 },
  { nom: "Tshopo", chefLieu: "Kisangani", lat: 0.5167, lng: 25.2 },
  { nom: "Mongala", chefLieu: "Lisala", lat: 2.15, lng: 21.5167 },
];

async function main() {
  console.log('🔄 Seeding provinces RDC (26)...');

  // Clear existing
  await prisma.province.deleteMany({});
  await prisma.ville.deleteMany({});
  await prisma.quartier.deleteMany({});

  // Create provinces
  for (const prov of PROVINCES) {
    const province = await prisma.province.create({
      data: {
        nom: prov.nom,
        chefLieu: prov.chefLieu,
        lat: prov.lat,
        lng: prov.lng,
        description: `Province de ${prov.nom}, RDC`,
      },
    });

    // Create sample villes
    const villes = [
      { nom: prov.chefLieu, provinceId: province.id },
      { nom: `${prov.nom} Nord`, provinceId: province.id },
      { nom: `${prov.nom} Sud`, provinceId: province.id },
    ];

    for (const villeData of villes) {
      const ville = await prisma.ville.create({
        data: villeData,
      });

      // Create sample quartiers
      const quartiers = [
        { nom: "Centre-ville", villeId: ville.id },
        { nom: "Nord", villeId: ville.id },
        { nom: "Sud", villeId: ville.id },
        { nom: "Est", villeId: ville.id },
        { nom: "Ouest", villeId: ville.id },
      ];

      await prisma.quartier.createMany({
        data: quartiers,
      });
    }
  }

  console.log('✅ 26 provinces RDC + villes + quartiers créés !');
  console.log(`➡️ Prisma Studio: npx prisma studio (http://localhost:5555)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

