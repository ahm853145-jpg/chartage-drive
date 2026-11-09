import { environment } from '../../../environments/environment';

/** Curated vehicle photography, selected by rental category. */
const image = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const carImagePlaceholder = '/assets/cars/car-placeholder.svg';

const categoryImages: Record<string, string> = {
  'suv': image('photo-1533473359331-0135ef1b58bf'),
  '4x4': image('photo-1533473359331-0135ef1b58bf'),
  'premium': image('photo-1503376780353-7e6692767b70'),
  'luxe': image('photo-1503376780353-7e6692767b70'),
  'berline': image('photo-1552519507-da3b142c6e3d'),
  'sedan': image('photo-1552519507-da3b142c6e3d'),
  'compacte': image('photo-1502877338535-766e1452684a'),
  'economique': image('photo-1502877338535-766e1452684a'),
  'économique': image('photo-1502877338535-766e1452684a'),
  'citadine': image('photo-1502877338535-766e1452684a'),
  'familiale': image('photo-1549317661-bd32c8ce0db2'),
  'minivan': image('photo-1549317661-bd32c8ce0db2'),
  'electrique': image('photo-1551830820-330a71b99659'),
  'électrique': image('photo-1551830820-330a71b99659')
};

const defaultImage = image('photo-1492144534655-ae79c964c9d7');
const modelImages: Record<string, string> = {
  'peugeot|208': '/assets/cars/peugeot-208-site.jpg',
  'renault|clio': '/assets/cars/renault-clio-site.jpg',
  'volkswagen|golf': '/assets/cars/vw-golf-site.jpg',
  'toyota|yaris': '/assets/cars/toyota-yaris-site.jpg',
  'bmw|serie 3': '/assets/cars/bmw-serie-3-site.jpg',
  'mercedes-benz|classe c': '/assets/cars/mercedes-classe-c-site.jpg',
  'audi|a4': '/assets/cars/audi-a4-site.jpg',
  'hyundai|tucson': '/assets/cars/hyundai-tucson-site.jpg',
  'volkswagen|tiguan': '/assets/cars/vw-tiguan-site.jpg',
  'tesla|model 3': '/assets/cars/tesla-model-3-site.jpg'
};

// Brand fallbacks keep the dedicated photo visible even when legacy database
// text has an incorrectly encoded model name (for example "Série 3").
const brandImages: Record<string, string> = {
  'peugeot': '/assets/cars/peugeot-208-site.jpg',
  'renault': '/assets/cars/renault-clio-site.jpg',
  'volkswagen': '/assets/cars/vw-golf-site.jpg',
  'vw': '/assets/cars/vw-golf-site.jpg',
  'toyota': '/assets/cars/toyota-yaris-site.jpg',
  'bmw': '/assets/cars/bmw-serie-3-site.jpg',
  'mercedes-benz': '/assets/cars/mercedes-classe-c-site.jpg',
  'mercedes benz': '/assets/cars/mercedes-classe-c-site.jpg',
  'audi': '/assets/cars/audi-a4-site.jpg',
  'hyundai': '/assets/cars/hyundai-tucson-site.jpg',
  'tesla': '/assets/cars/tesla-model-3-site.jpg'
};

const seedImageFiles: Record<string, string[]> = {
  'peugeot|208': ['peugeot-208-1.jpg', 'peugeot-208-2.jpg', 'peugeot-208-3.jpg', 'peugeot-208-site.jpg'],
  'renault|clio': ['renault-clio-1.jpg', 'renault-clio-2.jpg', 'renault-clio-site.jpg'],
  'volkswagen|golf': ['vw-golf-1.jpg', 'vw-golf-2.jpg', 'vw-golf-site.jpg'],
  'toyota|yaris': ['toyota-yaris-1.jpg', 'toyota-yaris-2.jpg', 'toyota-yaris-site.jpg'],
  'bmw|serie 3': ['bmw-3-1.jpg', 'bmw-3-2.jpg', 'bmw-serie-3-site.jpg'],
  'mercedes-benz|classe c': ['mercedes-c-1.jpg', 'mercedes-c-2.jpg', 'mercedes-classe-c-site.jpg'],
  'audi|a4': ['audi-a4-1.jpg', 'audi-a4-2.jpg', 'audi-a4-site.jpg'],
  'hyundai|tucson': ['hyundai-tucson-1.jpg', 'hyundai-tucson-2.jpg', 'hyundai-tucson-site.jpg'],
  'volkswagen|tiguan': ['vw-tiguan-1.jpg', 'vw-tiguan-2.jpg', 'vw-tiguan-site.jpg'],
  'tesla|model 3': ['tesla-model3-1.jpg', 'tesla-model3-2.jpg', 'tesla-model-3-site.jpg']
};

export function carImage(category?: string, existingImage?: string, brand?: string, model?: string): string {
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLocaleLowerCase('fr-FR');
  const modelKey = `${normalize(brand || '')}|${normalize(model || '')}`;
  const imageFile = existingImage?.split(/[\\/]/).pop()?.toLocaleLowerCase('fr-FR');
  const isLegacySeedImage = imageFile && seedImageFiles[modelKey]?.includes(imageFile);
  if (existingImage && !isLegacySeedImage) {
    if (/^(https?:)?\/\//i.test(existingImage)) return existingImage;
    if (existingImage.startsWith('/uploads/')) {
      return `${environment.apiUrl.replace(/\/api\/?$/, '')}${existingImage}`;
    }
    return existingImage;
  }
  if (modelImages[modelKey]) return modelImages[modelKey];
  const normalizedBrand = normalize(brand || '');
  if (brandImages[normalizedBrand]) return brandImages[normalizedBrand];
  if (existingImage) {
    if (/^(https?:)?\/\//i.test(existingImage)) return existingImage;
    if (existingImage.startsWith('/uploads/')) {
      return `${environment.apiUrl.replace(/\/api\/?$/, '')}${existingImage}`;
    }
    return existingImage;
  }
  const normalized = normalize(category || '');
  return Object.entries(categoryImages).find(([key]) => normalized.includes(key))?.[1] || defaultImage;
}

export function handleCarImageError(event: Event): void {
  const element = event.target as HTMLImageElement;
  if (element && !element.src.endsWith(carImagePlaceholder)) {
    element.src = carImagePlaceholder;
  }
}

export const categoryShowcase = [
  { name: 'Citadines', description: 'Agiles et économiques pour la ville.', image: categoryImages['citadine'] },
  { name: 'Berlines', description: 'Confort et élégance pour vos trajets.', image: categoryImages['berline'] },
  { name: 'SUV & 4×4', description: 'Espace et sérénité sur toutes les routes.', image: categoryImages['suv'] },
  { name: 'Premium', description: 'Une expérience de conduite haut de gamme.', image: categoryImages['premium'] }
];
