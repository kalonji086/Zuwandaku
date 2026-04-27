const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PROVINCES = [
  { nom: 'Kinshasa', chefLieu: 'Kinshasa', lat: -4.3217, lng: 15.3222, description: 'Capitale et plus grande ville de la RDC' },
  { nom: 'Kongo-Central', chefLieu: 'Matadi', lat: -5.8217, lng: 13.4597, description: 'Province côtière avec accès à l\'Atlantique' },
  { nom: 'Kwango', chefLieu: 'Kenge', lat: -6.1333, lng: 16.9667, description: 'Province du Bandundu' },
  { nom: 'Kwilu', chefLieu: 'Bandundu', lat: -3.3167, lng: 17.3667, description: 'Province du Bandundu' },
  { nom: 'Mai-Ndombe', chefLieu: 'Inongo', lat: -1.9333, lng: 18.2667, description: 'Province du lac Mai-Ndombe' },
  { nom: 'Kasaï', chefLieu: 'Luebo', lat: -5.3500, lng: 21.4167, description: 'Province du Kasaï occidental' },
  { nom: 'Kasaï-Central', chefLieu: 'Kananga', lat: -5.8960, lng: 22.4167, description: 'Province de Kananga' },
  { nom: 'Kasaï-Oriental', chefLieu: 'Mbuji-Mayi', lat: -6.1500, lng: 23.6000, description: 'Province diamantifère' },
  { nom: 'Lomami', chefLieu: 'Kabinda', lat: -6.1333, lng: 24.4833, description: 'Province de la Lomami' },
  { nom: 'Sankuru', chefLieu: 'Lodja', lat: -3.4833, lng: 23.6000, description: 'Province du Sankuru' },
  { nom: 'Maniema', chefLieu: 'Kindu', lat: -2.9500, lng: 25.9167, description: 'Province forestière de l\'est' },
  { nom: 'Sud-Kivu', chefLieu: 'Bukavu', lat: -2.5083, lng: 28.8608, description: 'Province des Grands Lacs' },
  { nom: 'Nord-Kivu', chefLieu: 'Goma', lat: -1.6792, lng: 29.2228, description: 'Province volcanique des Grands Lacs' },
  { nom: 'Ituri', chefLieu: 'Bunia', lat: 1.5667, lng: 30.2500, description: 'Province du nord-est' },
  { nom: 'Haut-Uele', chefLieu: 'Isiro', lat: 2.7667, lng: 27.6167, description: 'Province du nord-est' },
  { nom: 'Bas-Uele', chefLieu: 'Buta', lat: 2.8000, lng: 24.7333, description: 'Province du nord' },
  { nom: 'Tshopo', chefLieu: 'Kisangani', lat: 0.5153, lng: 25.1900, description: 'Province de Kisangani' },
  { nom: 'Équateur', chefLieu: 'Mbandaka', lat: 0.0478, lng: 18.2564, description: 'Province équatoriale' },
  { nom: 'Sud-Ubangi', chefLieu: 'Gemena', lat: 3.2667, lng: 19.7667, description: 'Province du nord-ouest' },
  { nom: 'Nord-Ubangi', chefLieu: 'Gbadolite', lat: 4.2833, lng: 20.9833, description: 'Province du nord' },
  { nom: 'Mongala', chefLieu: 'Lisala', lat: 2.1500, lng: 21.5167, description: 'Province du nord' },
  { nom: 'Tshuapa', chefLieu: 'Boende', lat: -0.2167, lng: 20.8833, description: 'Province centrale' },
  { nom: 'Tanganyika', chefLieu: 'Kalemie', lat: -5.9333, lng: 29.2000, description: 'Province du lac Tanganyika' },
  { nom: 'Haut-Lomami', chefLieu: 'Kamina', lat: -8.7333, lng: 25.0000, description: 'Province du Katanga' },
  { nom: 'Lualaba', chefLieu: 'Kolwezi', lat: -10.7167, lng: 25.4667, description: 'Province minière du Katanga' },
  { nom: 'Haut-Katanga', chefLieu: 'Lubumbashi', lat: -11.6609, lng: 27.4794, description: 'Province minière, 2ème ville du pays' },
];

const VILLES_PAR_PROVINCE = {
  'Kinshasa': ['Kinshasa', 'Kinkole', 'Maluku', 'Nsele'],
  'Haut-Katanga': ['Lubumbashi', 'Likasi', 'Kipushi', 'Kasenga'],
  'Nord-Kivu': ['Goma', 'Butembo', 'Beni', 'Rutshuru'],
  'Sud-Kivu': ['Bukavu', 'Uvira', 'Baraka', 'Shabunda'],
  'Kasaï-Oriental': ['Mbuji-Mayi', 'Kabinda', 'Tshilenge'],
  'Kasaï-Central': ['Kananga', 'Tshikapa', 'Mweka'],
  'Kongo-Central': ['Matadi', 'Boma', 'Muanda', 'Mbanza-Ngungu'],
  'Tshopo': ['Kisangani', 'Ubundu', 'Isangi'],
  'Équateur': ['Mbandaka', 'Bikoro', 'Ingende'],
  'Maniema': ['Kindu', 'Kasongo', 'Punia'],
};

async function main() {
  console.log('Seeding 26 provinces RDC...');

  for (const p of PROVINCES) {
    const province = await prisma.province.upsert({
      where: { nom: p.nom },
      update: { chefLieu: p.chefLieu, lat: p.lat, lng: p.lng, description: p.description },
      create: p,
    });

    const villes = VILLES_PAR_PROVINCE[p.nom] || [p.chefLieu];
    for (const nomVille of villes) {
      const ville = await prisma.ville.upsert({
        where: { id: `${province.id}-${nomVille}`.slice(0, 25) },
        update: {},
        create: { id: `${province.id}-${nomVille}`.slice(0, 25), nom: nomVille, provinceId: province.id },
      });
    }
  }

  console.log('Done! 26 provinces + villes créées.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
