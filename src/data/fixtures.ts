/**
 * Stubbed product data for Lebanon Trails.
 *
 * Everything the UI renders today comes from this module. A later milestone
 * replaces these exports with Netlify Database queries — keep the shapes
 * stable so the screens don't need to change (see PLAN.md).
 */

export type Difficulty = 'easy' | 'moderate' | 'hard'

export type Category =
  | 'waterfalls'
  | 'forests'
  | 'lakes'
  | 'viewpoints'
  | 'camping'
  | 'ruins'

export type LatLng = [number, number]

export interface NearbySpot {
  name: string
  kind: 'Restaurant' | 'Café' | 'Guesthouse' | 'Bakery'
  note: string
  distanceKm: number
}

export interface Trail {
  slug: string
  name: string
  region: string
  location: string
  startPoint: string
  start: LatLng
  distanceKm: number
  durationHours: number
  difficulty: Difficulty
  elevationGainM: number
  maxAltitudeM: number
  bestSeason: string
  bestMonths: number[]
  routeType: 'Loop' | 'Out & back' | 'Point to point'
  categories: Category[]
  hiddenGem?: boolean
  photos: string[]
  summary: string
  description: string
  highlights: string[]
  nearby: NearbySpot[]
  rating: number
  reviewCount: number
  completedCount: number
  route: LatLng[]
}

export interface ConditionReport {
  id: string
  trailSlug: string
  author: string
  kind: 'muddy' | 'flowing' | 'snow' | 'clear' | 'overgrown' | 'closed'
  text: string
  postedAgo: string
  helpful: number
}

export interface Review {
  id: string
  trailSlug: string
  author: string
  hometown: string
  rating: number
  date: string
  title: string
  text: string
  photo?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: 'mountain' | 'trees' | 'droplets' | 'landmark' | 'tent' | 'sunrise' | 'footprints' | 'snowflake'
  progress: number
  goal: number
}

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

export const difficultyMeta: Record<
  Difficulty,
  { label: string; color: string; textClass: string; bgClass: string; ringClass: string }
> = {
  easy: {
    label: 'Easy',
    color: '#3f8a4e',
    textClass: 'text-easy',
    bgClass: 'bg-easy',
    ringClass: 'ring-easy/30',
  },
  moderate: {
    label: 'Moderate',
    color: '#d9861c',
    textClass: 'text-moderate',
    bgClass: 'bg-moderate',
    ringClass: 'ring-moderate/30',
  },
  hard: {
    label: 'Hard',
    color: '#c0392b',
    textClass: 'text-hard',
    bgClass: 'bg-hard',
    ringClass: 'ring-hard/30',
  },
}

export const categoryMeta: Record<Category, { label: string; blurb: string; image: string }> = {
  waterfalls: {
    label: 'Waterfalls',
    blurb: 'Snowmelt cascades and limestone sinkholes',
    image: '/img/waterfall.png',
  },
  forests: {
    label: 'Forests',
    blurb: 'Cedar, juniper and oak woodlands',
    image: '/img/cedars.png',
  },
  lakes: {
    label: 'Lakes',
    blurb: 'Emerald pools and reservoir shorelines',
    image: '/img/lake.png',
  },
  viewpoints: {
    label: 'Viewpoints',
    blurb: 'Ridges where you can see the sea from the snow',
    image: '/img/summit.png',
  },
  camping: {
    label: 'Camping spots',
    blurb: 'High plateaus for a night under the stars',
    image: '/img/camp.png',
  },
  ruins: {
    label: 'Historical ruins',
    blurb: 'Roman temples, crusader forts, hermit caves',
    image: '/img/ruins.png',
  },
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/* ------------------------------------------------------------------ */
/* Route generation (placeholder GPS tracks until real GPX uploads)    */
/* ------------------------------------------------------------------ */

function seeded(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

function buildRoute(start: LatLng, km: number, type: Trail['routeType'], seed: string): LatLng[] {
  const rand = seeded(seed)
  const steps = 36
  const oneWay = type === 'Out & back' ? km / 2 : km
  const stepKm = oneWay / steps
  let heading = rand() * Math.PI * 2
  const points: LatLng[] = [start]
  let [lat, lng] = start
  for (let i = 1; i <= steps; i++) {
    if (type === 'Loop') heading += (Math.PI * 2) / steps + (rand() - 0.5) * 0.5
    else heading += (rand() - 0.5) * 0.9
    lat += (Math.cos(heading) * stepKm) / 111
    lng += (Math.sin(heading) * stepKm) / (111 * Math.cos((lat * Math.PI) / 180))
    points.push([+lat.toFixed(5), +lng.toFixed(5)])
  }
  if (type === 'Loop') points.push(start)
  return points
}

/* ------------------------------------------------------------------ */
/* Trails                                                              */
/* ------------------------------------------------------------------ */

type TrailInput = Omit<Trail, 'route'>

const trailInputs: TrailInput[] = [
  {
    slug: 'qadisha-valley',
    name: 'Qadisha Valley Trail',
    region: 'North Lebanon',
    location: 'Wadi Qannoubine, Bsharri District',
    startPoint: 'Blawza village church, descending stone stairway',
    start: [34.2877, 35.937],
    distanceKm: 8,
    durationHours: 4,
    difficulty: 'moderate',
    elevationGainM: 520,
    maxAltitudeM: 1380,
    bestSeason: 'March – June',
    bestMonths: [3, 4, 5, 6],
    routeType: 'Out & back',
    categories: ['ruins', 'viewpoints'],
    photos: ['/img/hero.png', '/img/cedars.png', '/img/chouf.png'],
    summary: 'Descend into the Holy Valley past cliffside monasteries and hermit caves.',
    description:
      'A UNESCO-listed gorge carved by the Qadisha river. The trail drops from Blawza on old stone stairs to the Qannoubine monastery, hugging terraces of olive and mulberry before following the valley floor toward Deir Mar Elisha. Expect shaded sections, a few slick rocks near springs, and a steady climb out.',
    highlights: [
      'Deir Qannoubine, built into the cliff face',
      'Mar Marina hermit cave',
      'Spring water refill at Ain Qannoubine',
      'Views up to the Bsharri cedars',
    ],
    nearby: [
      { name: 'Hikers Café Qannoubine', kind: 'Café', note: 'Mint lemonade at the valley floor', distanceKm: 0.4 },
      { name: 'Mar Elisha Guesthouse', kind: 'Guesthouse', note: 'Simple rooms run by the parish', distanceKm: 2.1 },
      { name: 'Mountain Rose, Hadchit', kind: 'Restaurant', note: 'Kibbeh nayyeh and grilled trout', distanceKm: 3.6 },
    ],
    rating: 4.8,
    reviewCount: 312,
    completedCount: 4812,
  },
  {
    slug: 'cedars-of-god',
    name: 'Cedars of God Loop',
    region: 'North Lebanon',
    location: 'Arz Bsharri, Bsharri District',
    startPoint: 'Cedars grove main gate, near the chapel',
    start: [34.2436, 36.0485],
    distanceKm: 3.2,
    durationHours: 1.5,
    difficulty: 'easy',
    elevationGainM: 90,
    maxAltitudeM: 2010,
    bestSeason: 'May – October',
    bestMonths: [5, 6, 7, 8, 9, 10],
    routeType: 'Loop',
    categories: ['forests'],
    photos: ['/img/cedars.png', '/img/summit.png'],
    summary: 'Walk among cedars that have stood for over a thousand years.',
    description:
      'A gentle loop through the most famous grove in the country — some trees here are estimated at over 1,000 years old. Paths are well kept and mostly flat, making it ideal for families and first-timers. Snow can linger until late April.',
    highlights: ['The Patriarch cedar', 'Carved cedar sculpture by Rudy Rahme', 'Chapel of the Transfiguration'],
    nearby: [
      { name: 'Le Cèdre Café', kind: 'Café', note: 'Hot chocolate after a snowy walk', distanceKm: 0.2 },
      { name: 'Chez Mansour', kind: 'Restaurant', note: 'Mezze on a terrace above the valley', distanceKm: 0.6 },
    ],
    rating: 4.6,
    reviewCount: 538,
    completedCount: 9241,
  },
  {
    slug: 'baatara-gorge',
    name: 'Baatara Gorge Waterfall',
    region: 'North Lebanon',
    location: 'Tannourine el Fawqa, Batroun District',
    startPoint: 'Balaa village parking, signed footpath',
    start: [34.173, 35.87],
    distanceKm: 2.5,
    durationHours: 1.25,
    difficulty: 'easy',
    elevationGainM: 140,
    maxAltitudeM: 1600,
    bestSeason: 'March – May',
    bestMonths: [3, 4, 5],
    routeType: 'Out & back',
    categories: ['waterfalls', 'viewpoints'],
    photos: ['/img/waterfall.png', '/img/lake.png'],
    summary: 'A 255 m waterfall dropping behind three natural stone bridges.',
    description:
      'The "Cave of the Three Bridges" is one of the most dramatic sights in Lebanon. A short path leads to viewing platforms above the sinkhole. The waterfall is strongest during snowmelt — by August it can be a trickle.',
    highlights: ['Three stacked limestone bridges', 'Jurassic-era sinkhole', 'Platform viewpoint'],
    nearby: [
      { name: 'Balaa Snack', kind: 'Café', note: 'Manakish from a saj oven at the trailhead', distanceKm: 0.1 },
      { name: 'Tannourine Bakery', kind: 'Bakery', note: 'Fresh ka3ak for the drive back', distanceKm: 4.5 },
    ],
    rating: 4.7,
    reviewCount: 401,
    completedCount: 7120,
  },
  {
    slug: 'jannet-chouwen',
    name: 'Jannet Chouwen',
    region: 'Mount Lebanon',
    location: 'Jabal Moussa Biosphere, Keserwan',
    startPoint: 'Chouwen trailhead above Kfardebian road',
    start: [34.054, 35.764],
    distanceKm: 6.5,
    durationHours: 3.5,
    difficulty: 'hard',
    elevationGainM: 610,
    maxAltitudeM: 980,
    bestSeason: 'May – October',
    bestMonths: [5, 6, 7, 8, 9, 10],
    routeType: 'Out & back',
    categories: ['lakes', 'forests'],
    hiddenGem: true,
    photos: ['/img/lake.png', '/img/chouf.png'],
    summary: 'A steep plunge to an emerald river pool hidden in the canyon.',
    description:
      '"Chouwen Paradise" rewards a knee-testing descent with a turquoise pool fed by the Nahr Ibrahim tributaries. The climb back is relentless and exposed in the afternoon — start early and carry more water than you think.',
    highlights: ['Swimmable emerald pool', 'Rope-assisted rock section', 'Oak and juniper canopy'],
    nearby: [
      { name: 'Chouwen Shack', kind: 'Café', note: 'Seasonal fruit cocktails by the water', distanceKm: 0.2 },
      { name: 'Beit Moussa', kind: 'Restaurant', note: 'Village mezze with a view', distanceKm: 5.2 },
    ],
    rating: 4.5,
    reviewCount: 227,
    completedCount: 3018,
  },
  {
    slug: 'qornet-es-sawda',
    name: 'Qornet es Sawda Summit',
    region: 'North Lebanon',
    location: 'Mount Lebanon Range, above Bsharri',
    startPoint: 'Cedars ski slopes, upper lift station',
    start: [34.255, 36.075],
    distanceKm: 14,
    durationHours: 7,
    difficulty: 'hard',
    elevationGainM: 1150,
    maxAltitudeM: 3088,
    bestSeason: 'June – September',
    bestMonths: [6, 7, 8, 9],
    routeType: 'Out & back',
    categories: ['viewpoints'],
    photos: ['/img/summit.png', '/img/camp.png'],
    summary: 'Stand on the roof of Lebanon at 3,088 m.',
    description:
      'The highest point in the Levant. The route climbs bare, rocky ridges with no shade and no water source. On clear days you can see the Mediterranean on one side and the Bekaa Valley on the other. Snow patches remain into June; weather turns fast.',
    highlights: ['Highest summit in Lebanon', 'Sea-to-Bekaa panorama', 'Summer snowfields'],
    nearby: [
      { name: 'Alpine Lodge Arz', kind: 'Guesthouse', note: 'Pre-dawn breakfasts for summit teams', distanceKm: 1.1 },
      { name: "L'Igloo", kind: 'Restaurant', note: 'Raclette and lentil soup', distanceKm: 1.3 },
    ],
    rating: 4.9,
    reviewCount: 189,
    completedCount: 1564,
  },
  {
    slug: 'faqra-ruins',
    name: 'Faqra Roman Ruins & Natural Bridge',
    region: 'Mount Lebanon',
    location: 'Kfardebian, Keserwan',
    startPoint: 'Faqra archaeological site entrance',
    start: [33.997, 35.81],
    distanceKm: 5,
    durationHours: 2,
    difficulty: 'easy',
    elevationGainM: 180,
    maxAltitudeM: 1550,
    bestSeason: 'April – November',
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    routeType: 'Loop',
    categories: ['ruins', 'viewpoints'],
    photos: ['/img/ruins.png', '/img/summit.png'],
    summary: 'Temple columns, a sacred tower and Jisr el Hajar in one easy loop.',
    description:
      'A first-century Roman sanctuary set in a surreal karst landscape, followed by a walk to Jisr el Hajar, a natural limestone arch over a stream. Short, scenic and great for golden-hour photography.',
    highlights: ['Temple of Adonis columns', 'Claudius tower', 'Jisr el Hajar natural bridge'],
    nearby: [
      { name: 'Café Faqra', kind: 'Café', note: 'Turkish coffee overlooking the ruins', distanceKm: 0.3 },
      { name: 'Le Montagnard', kind: 'Restaurant', note: 'Grilled halloumi and fattoush', distanceKm: 2.4 },
    ],
    rating: 4.4,
    reviewCount: 166,
    completedCount: 3987,
  },
  {
    slug: 'barouk-cedars',
    name: 'Barouk Cedars Ridge',
    region: 'Chouf',
    location: 'Shouf Biosphere Reserve, Barouk',
    startPoint: 'Barouk reserve gate (entrance fee applies)',
    start: [33.693, 35.693],
    distanceKm: 9.4,
    durationHours: 4,
    difficulty: 'moderate',
    elevationGainM: 430,
    maxAltitudeM: 1960,
    bestSeason: 'April – November',
    bestMonths: [4, 5, 6, 9, 10, 11],
    routeType: 'Point to point',
    categories: ['forests', 'viewpoints'],
    photos: ['/img/chouf.png', '/img/cedars.png'],
    summary: 'Ridge walk through the largest cedar reserve in Lebanon.',
    description:
      'The Shouf Biosphere protects a quarter of the country’s remaining cedars. This ridge route links Barouk to Maasser el Chouf, with sweeping views west to the coast and east over Lake Qaraoun. Wind can be strong on the crest.',
    highlights: ['Old-growth cedar stands', 'Views of Lake Qaraoun', 'Wolf and ibex habitat'],
    nearby: [
      { name: 'Barouk Spring Restaurant', kind: 'Restaurant', note: 'Trout pulled from the spring', distanceKm: 1.8 },
      { name: 'Maasser Bakery', kind: 'Bakery', note: 'Thyme manoushe at the finish', distanceKm: 0.5 },
    ],
    rating: 4.7,
    reviewCount: 274,
    completedCount: 4410,
  },
  {
    slug: 'laqlouq-plateau',
    name: 'Laqlouq Plateau Camp Walk',
    region: 'Mount Lebanon',
    location: 'Laqlouq, Jbeil District',
    startPoint: 'Laqlouq village square',
    start: [34.136, 35.878],
    distanceKm: 7,
    durationHours: 3,
    difficulty: 'moderate',
    elevationGainM: 320,
    maxAltitudeM: 1920,
    bestSeason: 'May – October',
    bestMonths: [5, 6, 7, 8, 9, 10],
    routeType: 'Loop',
    categories: ['camping', 'viewpoints'],
    hiddenGem: true,
    photos: ['/img/camp.png', '/img/summit.png'],
    summary: 'Open highland meadows with the best stargazing near Beirut.',
    description:
      'A wide plateau of grazing land and limestone formations. The loop passes the eroded "rock city" before reaching flat grassy shelves where hikers pitch tents. Nights are cold even in August.',
    highlights: ['Wild camping meadows', 'Rock-city formations', 'Dark-sky stargazing'],
    nearby: [
      { name: 'Laqlouq Tourist Café', kind: 'Café', note: 'Sahlab and toasted kaak', distanceKm: 0.2 },
      { name: 'Shepherd’s Table', kind: 'Restaurant', note: 'Lamb grilled over oak coals', distanceKm: 1.5 },
    ],
    rating: 4.5,
    reviewCount: 98,
    completedCount: 1876,
  },
  {
    slug: 'horsh-ehden',
    name: 'Horsh Ehden Forest Reserve',
    region: 'North Lebanon',
    location: 'Ehden, Zgharta District',
    startPoint: 'Horsh Ehden visitor centre',
    start: [34.309, 35.974],
    distanceKm: 6,
    durationHours: 3,
    difficulty: 'moderate',
    elevationGainM: 390,
    maxAltitudeM: 1950,
    bestSeason: 'May – October',
    bestMonths: [5, 6, 7, 8, 9, 10],
    routeType: 'Loop',
    categories: ['forests'],
    photos: ['/img/cedars.png', '/img/chouf.png'],
    summary: 'Mixed forest of cedar, fir and wild apple with rare orchids.',
    description:
      'One of the most biodiverse reserves in Lebanon, home to over 1,000 plant species. The loop climbs through shaded forest and opens onto clearings with long views over the Qadisha.',
    highlights: ['Cilician fir and juniper', 'Wild orchids in spring', 'Mar Sarkis viewpoint'],
    nearby: [
      { name: 'Ehden Midan cafés', kind: 'Café', note: 'Ice cream on the village square', distanceKm: 3.2 },
      { name: 'Abou Joseph', kind: 'Restaurant', note: 'Famous Ehden kibbeh', distanceKm: 3.4 },
    ],
    rating: 4.6,
    reviewCount: 143,
    completedCount: 2570,
  },
  {
    slug: 'jezzine-waterfall',
    name: 'Jezzine Waterfall & Pine Walk',
    region: 'South Lebanon',
    location: 'Jezzine, Jezzine District',
    startPoint: 'Jezzine waterfall viewpoint, town centre',
    start: [33.544, 35.585],
    distanceKm: 4.2,
    durationHours: 2,
    difficulty: 'easy',
    elevationGainM: 150,
    maxAltitudeM: 980,
    bestSeason: 'February – May',
    bestMonths: [2, 3, 4, 5],
    routeType: 'Loop',
    categories: ['waterfalls', 'forests'],
    photos: ['/img/waterfall.png', '/img/chouf.png'],
    summary: 'A 40 m cascade and the largest stone-pine forest in the Middle East.',
    description:
      'Start at the town’s iconic waterfall and wander down into the Bkassine pine forest. Easy gradients, plenty of shade, and benches along the way make it a relaxed family outing.',
    highlights: ['Jezzine waterfall', 'Bkassine stone pine forest', 'Fakhreddine cave viewpoint'],
    nearby: [
      { name: 'Café du Pont', kind: 'Café', note: 'Seated right next to the falls', distanceKm: 0.1 },
      { name: 'Jezzine Grill', kind: 'Restaurant', note: 'Local honey and pine-nut desserts', distanceKm: 0.6 },
    ],
    rating: 4.3,
    reviewCount: 121,
    completedCount: 2244,
  },
  {
    slug: 'afqa-akoura',
    name: 'Afqa Grotto to Akoura',
    region: 'Mount Lebanon',
    location: 'Afqa, Jbeil District',
    startPoint: 'Afqa grotto car park',
    start: [34.068, 35.894],
    distanceKm: 11,
    durationHours: 5,
    difficulty: 'hard',
    elevationGainM: 780,
    maxAltitudeM: 1650,
    bestSeason: 'April – June',
    bestMonths: [4, 5, 6],
    routeType: 'Point to point',
    categories: ['waterfalls', 'ruins'],
    hiddenGem: true,
    photos: ['/img/waterfall.png', '/img/ruins.png'],
    summary: 'From the mythic source of the Adonis river up to a cliff village.',
    description:
      'Begin at the cave where the Nahr Ibrahim bursts from the mountain, then climb an old mule path past Roman inscriptions to the village of Akoura. Long, steep and spectacular — a Lebanon Mountain Trail favourite.',
    highlights: ['Afqa spring cave', 'Roman road inscriptions', 'Akoura rock-cut churches'],
    nearby: [
      { name: 'Afqa Fish Farm', kind: 'Restaurant', note: 'Trout fresh from the source', distanceKm: 0.5 },
      { name: 'Akoura Guesthouse', kind: 'Guesthouse', note: 'Family-run, hearty dinners', distanceKm: 0.3 },
    ],
    rating: 4.8,
    reviewCount: 87,
    completedCount: 921,
  },
  {
    slug: 'tannourine-cedars',
    name: 'Tannourine Cedar Forest',
    region: 'North Lebanon',
    location: 'Tannourine, Batroun District',
    startPoint: 'Reserve entrance at Hadath el Jebbeh road',
    start: [34.209, 35.931],
    distanceKm: 5.5,
    durationHours: 2.5,
    difficulty: 'moderate',
    elevationGainM: 260,
    maxAltitudeM: 1800,
    bestSeason: 'May – November',
    bestMonths: [5, 6, 7, 8, 9, 10, 11],
    routeType: 'Loop',
    categories: ['forests'],
    photos: ['/img/cedars.png', '/img/hero.png'],
    summary: 'A dense, quiet cedar forest clinging to steep slopes.',
    description:
      'Less visited than Bsharri, Tannourine holds one of the densest cedar forests in Lebanon. The loop is shaded and peaceful, with a few rocky steps and a lookout over the valley.',
    highlights: ['Dense cedar canopy', 'Valley lookout', 'Spring-fed fountain'],
    nearby: [{ name: 'Arz Tannourine Café', kind: 'Café', note: 'Cedar-honey cake', distanceKm: 0.3 }],
    rating: 4.6,
    reviewCount: 112,
    completedCount: 1932,
  },
  {
    slug: 'mseilha-fort',
    name: 'Mseilha Fort & Nahr el Jawz',
    region: 'North Lebanon',
    location: 'Hamat, Batroun District',
    startPoint: 'Mseilha Fort parking off the old coastal road',
    start: [34.27, 35.683],
    distanceKm: 3.8,
    durationHours: 1.5,
    difficulty: 'easy',
    elevationGainM: 70,
    maxAltitudeM: 180,
    bestSeason: 'October – May',
    bestMonths: [10, 11, 12, 1, 2, 3, 4, 5],
    routeType: 'Out & back',
    categories: ['ruins'],
    photos: ['/img/ruins.png', '/img/lake.png'],
    summary: 'A 17th-century fort perched on a rock above a river gorge.',
    description:
      'Built by Emir Fakhreddine II, Mseilha guards the old route between Tripoli and Beirut. A short walk follows the Nahr el Jawz upstream through oleander and plane trees. Good winter option when the mountains are snowed in.',
    highlights: ['Fakhreddine-era fort', 'River gorge walk', 'Winter-friendly low altitude'],
    nearby: [
      { name: 'Batroun lemonade stands', kind: 'Café', note: 'The famous Batroun lemonade', distanceKm: 4.8 },
      { name: 'Chez Maguy', kind: 'Restaurant', note: 'Seafood on the rocks', distanceKm: 6.1 },
    ],
    rating: 4.2,
    reviewCount: 76,
    completedCount: 2105,
  },
  {
    slug: 'qaraoun-shore',
    name: 'Lake Qaraoun Shoreline',
    region: 'Bekaa',
    location: 'Qaraoun, West Bekaa',
    startPoint: 'Qaraoun village lakeside promenade',
    start: [33.565, 35.703],
    distanceKm: 6,
    durationHours: 2,
    difficulty: 'easy',
    elevationGainM: 60,
    maxAltitudeM: 870,
    bestSeason: 'March – June, Sept – Nov',
    bestMonths: [3, 4, 5, 6, 9, 10, 11],
    routeType: 'Out & back',
    categories: ['lakes', 'camping'],
    photos: ['/img/lake.png', '/img/camp.png'],
    summary: 'Flat lakeside walk with migrating birds and Mount Hermon views.',
    description:
      'The largest body of fresh water in Lebanon. The path follows the eastern shore with views across to Jabal el Sheikh. Popular with birdwatchers in spring and autumn migrations.',
    highlights: ['Bird migration routes', 'Mount Hermon backdrop', 'Lakeside picnic spots'],
    nearby: [{ name: 'Qaraoun Fish Restaurants', kind: 'Restaurant', note: 'Lake fish fried whole', distanceKm: 0.3 }],
    rating: 4.1,
    reviewCount: 64,
    completedCount: 1480,
  },
]

export const trails: Trail[] = trailInputs.map((t) => ({
  ...t,
  route: buildRoute(t.start, t.distanceKm, t.routeType, t.slug),
}))

export function getTrail(slug: string) {
  return trails.find((t) => t.slug === slug)
}

/* ------------------------------------------------------------------ */
/* Packing checklist                                                   */
/* ------------------------------------------------------------------ */

export function getChecklist(trail: Trail): string[] {
  const water = trail.durationHours >= 5 ? 3 : trail.durationHours >= 3 ? 2 : 1
  const items = [
    `Water ${water}L`,
    trail.difficulty === 'easy' ? 'Comfortable trail shoes' : 'Hiking boots with ankle support',
    'Snacks — dried fruit, nuts, a manoushe',
    'Sun hat & sunscreen',
  ]
  if (trail.maxAltitudeM > 1500) items.push('Warm jacket — it gets cold up high')
  else items.push('Light windbreaker')
  if (trail.difficulty !== 'easy') items.push('Trekking poles')
  if (trail.durationHours >= 4) items.push('Packed lunch')
  if (trail.categories.includes('lakes') || trail.categories.includes('waterfalls'))
    items.push('Swimsuit & quick-dry towel')
  if (trail.categories.includes('camping')) items.push('Tent, sleeping bag & headlamp')
  if (trail.maxAltitudeM > 2500) items.push('Microspikes for late snow patches')
  items.push('Offline map & charged phone', 'First-aid kit', 'Trash bag — leave no trace')
  return items
}

/* ------------------------------------------------------------------ */
/* Community                                                           */
/* ------------------------------------------------------------------ */

export const conditionMeta: Record<ConditionReport['kind'], { label: string; color: string }> = {
  muddy: { label: 'Muddy', color: '#8a6a3e' },
  flowing: { label: 'Water flowing', color: '#2f7fa3' },
  snow: { label: 'Snow on trail', color: '#7a90a8' },
  clear: { label: 'Clear & dry', color: '#3f8a4e' },
  overgrown: { label: 'Overgrown', color: '#6f8a5b' },
  closed: { label: 'Partly closed', color: '#c0392b' },
}

export const conditionReports: ConditionReport[] = [
  { id: 'c1', trailSlug: 'qadisha-valley', author: 'Maya Khoury', kind: 'muddy', text: 'Trail is muddy after rain below Qannoubine — the stone steps are slippery, take it slow.', postedAgo: '3h ago', helpful: 24 },
  { id: 'c2', trailSlug: 'baatara-gorge', author: 'Karim Nassar', kind: 'flowing', text: 'Beautiful waterfall this week! Full flow from the snowmelt, best I have seen it.', postedAgo: '6h ago', helpful: 41 },
  { id: 'c3', trailSlug: 'qornet-es-sawda', author: 'Lea Abi Saab', kind: 'snow', text: 'Snow patches from 2,800 m to the summit. Microspikes were very useful on the last ridge.', postedAgo: '1d ago', helpful: 18 },
  { id: 'c4', trailSlug: 'jannet-chouwen', author: 'Elie Frem', kind: 'clear', text: 'Dry and dusty, pool is crystal clear. Rope section is fine. Parking full by 10 am.', postedAgo: '1d ago', helpful: 12 },
  { id: 'c5', trailSlug: 'barouk-cedars', author: 'Nour Hamdan', kind: 'clear', text: 'Perfect visibility — could see Qaraoun and the sea at the same time.', postedAgo: '2d ago', helpful: 9 },
  { id: 'c6', trailSlug: 'qadisha-valley', author: 'Georges Tawk', kind: 'flowing', text: 'Ain Qannoubine spring is running, you can refill water there.', postedAgo: '2d ago', helpful: 15 },
  { id: 'c7', trailSlug: 'afqa-akoura', author: 'Rita Zgheib', kind: 'overgrown', text: 'Thorny bushes on the upper switchbacks, wear long trousers.', postedAgo: '4d ago', helpful: 7 },
  { id: 'c8', trailSlug: 'horsh-ehden', author: 'Sami Douaihy', kind: 'closed', text: 'Lower loop closed for reforestation work, use the upper path to Mar Sarkis.', postedAgo: '5d ago', helpful: 22 },
  { id: 'c9', trailSlug: 'cedars-of-god', author: 'Joelle Rahme', kind: 'clear', text: 'Paths are clean and dry, gate opens at 8.', postedAgo: '5d ago', helpful: 5 },
]

export const reviews: Review[] = [
  { id: 'r1', trailSlug: 'qadisha-valley', author: 'Hadi Saliba', hometown: 'Achrafieh', rating: 5, date: 'Sep 28, 2026', title: 'The most moving hike in Lebanon', text: 'Walking past monasteries carved into the cliffs is something else. The climb out is long but the café at the bottom saves you. Go on a weekday.', photo: '/img/hero.png' },
  { id: 'r2', trailSlug: 'qadisha-valley', author: 'Christelle Aoun', hometown: 'Jounieh', rating: 4, date: 'Sep 14, 2026', title: 'Beautiful but bring more water', text: 'Took us 4.5 hours with breaks. Shade most of the way down, very little on the way back up in the afternoon.' },
  { id: 'r3', trailSlug: 'baatara-gorge', author: 'Omar Chehab', hometown: 'Aley', rating: 5, date: 'Apr 19, 2026', title: 'Unreal in April', text: 'Short walk, huge payoff. Go early to beat the tour buses.', photo: '/img/waterfall.png' },
  { id: 'r4', trailSlug: 'qornet-es-sawda', author: 'Lea Abi Saab', hometown: 'Zahle', rating: 5, date: 'Jul 2, 2026', title: 'Roof of Lebanon, finally', text: 'Started at 5 am, summit by 9:30. Zero shade, zero water — carry 3L minimum. Worth every step.', photo: '/img/summit.png' },
  { id: 'r5', trailSlug: 'jannet-chouwen', author: 'Elie Frem', hometown: 'Byblos', rating: 4, date: 'Aug 11, 2026', title: 'Earn your swim', text: 'The descent is brutal on the knees, the pool is pure paradise. Poles recommended.', photo: '/img/lake.png' },
  { id: 'r6', trailSlug: 'barouk-cedars', author: 'Nour Hamdan', hometown: 'Deir el Qamar', rating: 5, date: 'Oct 1, 2026', title: 'Cedars and sea in one view', text: 'Well signposted ridge with incredible old trees. We arranged a car at Maasser to avoid walking back.' },
  { id: 'r7', trailSlug: 'cedars-of-god', author: 'Tania Feghali', hometown: 'Bsharri', rating: 4, date: 'Aug 22, 2026', title: 'Perfect with kids', text: 'Flat, shaded, short. Our 6-year-old loved finding the biggest tree.' },
  { id: 'r8', trailSlug: 'faqra-ruins', author: 'Bassam Kassab', hometown: 'Beirut', rating: 4, date: 'Jun 5, 2026', title: 'Golden hour magic', text: 'Columns glowing at sunset, then a quick walk to the stone bridge. Easy and photogenic.', photo: '/img/ruins.png' },
  { id: 'r9', trailSlug: 'laqlouq-plateau', author: 'Yara Mouawad', hometown: 'Batroun', rating: 5, date: 'Aug 30, 2026', title: 'Best night of camping', text: 'So many stars. Bring a proper sleeping bag, it dropped to 8°C at night.', photo: '/img/camp.png' },
]

/* ------------------------------------------------------------------ */
/* Hiker profile & gamification                                        */
/* ------------------------------------------------------------------ */

export const badges: Badge[] = [
  { id: 'mountain-explorer', name: 'Lebanon Mountain Explorer', description: 'Complete trails in all 5 hiking regions', icon: 'mountain', progress: 4, goal: 5 },
  { id: 'cedars-guardian', name: 'Cedars Guardian', description: 'Walk through 4 cedar reserves', icon: 'trees', progress: 4, goal: 4 },
  { id: 'waterfall-hunter', name: 'Waterfall Hunter', description: 'Visit 3 waterfalls in a single spring', icon: 'droplets', progress: 2, goal: 3 },
  { id: 'time-traveller', name: 'Time Traveller', description: 'Reach 3 historical ruins on foot', icon: 'landmark', progress: 3, goal: 3 },
  { id: 'under-the-stars', name: 'Under the Stars', description: 'Log an overnight camping hike', icon: 'tent', progress: 0, goal: 1 },
  { id: 'roof-of-lebanon', name: 'Roof of Lebanon', description: 'Summit Qornet es Sawda (3,088 m)', icon: 'snowflake', progress: 0, goal: 1 },
  { id: 'early-bird', name: 'Early Bird', description: 'Start 5 hikes before sunrise', icon: 'sunrise', progress: 3, goal: 5 },
  { id: 'hundred-k', name: '100 km Club', description: 'Hike 100 km in total', icon: 'footprints', progress: 82, goal: 100 },
]

export const hiker = {
  name: 'Rami Haddad',
  handle: '@rami.hikes',
  hometown: 'Mar Mikhael, Beirut',
  memberSince: 'March 2025',
  stats: {
    trailsCompleted: 17,
    kmHiked: 82.4,
    elevationM: 6340,
    peaksClimbed: 5,
  },
  completedSlugs: ['qadisha-valley', 'cedars-of-god', 'baatara-gorge', 'barouk-cedars', 'faqra-ruins', 'tannourine-cedars', 'horsh-ehden', 'mseilha-fort'],
  wishlistSlugs: ['qornet-es-sawda', 'laqlouq-plateau', 'afqa-akoura'],
}

export const leaderboard = [
  { name: 'Lea Abi Saab', region: 'Zahle', km: 214.7, trails: 41 },
  { name: 'Georges Tawk', region: 'Bsharri', km: 198.2, trails: 38 },
  { name: 'Nour Hamdan', region: 'Deir el Qamar', km: 167.9, trails: 33 },
  { name: 'Elie Frem', region: 'Byblos', km: 141.3, trails: 27 },
  { name: 'Rami Haddad', region: 'Beirut', km: 82.4, trails: 17 },
]
