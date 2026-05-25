/**
 * Small client-side map for progressive hints (definitions).
 * Used with resolveHintWord() when the rack matches exactly one lexicon entry.
 */

import { sortedLetterSignature } from "@/lib/unscramble";
import type { GameDifficulty } from "@/lib/word-game";

/** Curated word → short definition (common game vocabulary). */
export const WORD_DEFINITIONS: Record<string, string> = {
  able: "Having the skill or means to do something.",
  acid: "A sour chemical substance.",
  acre: "A unit of land area.",
  aged: "Having lived for many years.",
  also: "In addition; too.",
  arch: "A curved structure over an opening.",
  atom: "The smallest unit of a chemical element.",
  aunt: "The sister of a parent.",
  auto: "A car; self-moving.",
  away: "Not present; at a distance.",
  axis: "An imaginary line around which something turns.",
  back: "The rear part of the body.",
  bake: "Cook food using dry heat in an oven.",
  ball: "A round object used in games.",
  band: "A strip or a group of musicians.",
  bank: "Where money is kept.",
  barn: "A farm building for animals or crops.",
  base: "The bottom support; a foundation.",
  bath: "Washing the body; a tub of water.",
  beam: "A long piece of wood or metal.",
  bean: "An edible seed from a pod plant.",
  bear: "A large furry animal; to carry.",
  beat: "To strike rhythmically; defeat.",
  belt: "A strip worn around the waist.",
  bend: "To curve or fold something.",
  best: "Of the highest quality.",
  bike: "A bicycle.",
  bird: "A feathered animal with wings.",
  bite: "To cut with the teeth.",
  blow: "To move air; a hard hit.",
  blue: "A color like the clear sky.",
  boat: "A vessel that floats on water.",
  body: "The whole physical person or animal.",
  boil: "Heat a liquid until it bubbles.",
  bold: "Brave; thick dark letters.",
  bond: "A strong connection or agreement.",
  bone: "Hard tissue inside a skeleton.",
  book: "Pages bound together for reading.",
  boot: "A sturdy shoe covering the ankle.",
  born: "Brought into life.",
  both: "The two together.",
  bowl: "A round dish for food.",
  brag: "To boast about yourself.",
  burn: "To be on fire; damage by heat.",
  busy: "Full of activity; occupied.",
  cake: "A sweet baked dessert.",
  call: "To speak to someone; a phone ring.",
  calm: "Peaceful and quiet.",
  camp: "Temporary outdoor shelter.",
  card: "Stiff paper; a playing piece.",
  care: "Attention and concern for someone.",
  cart: "A vehicle with wheels for carrying.",
  case: "A container; a situation or example.",
  cash: "Money in coins or notes.",
  cast: "To throw; actors in a show.",
  cave: "A hollow space underground.",
  chat: "Informal conversation.",
  chef: "A professional cook.",
  chin: "The lower front of the face.",
  city: "A large town.",
  clay: "Soft earth used for pottery.",
  clip: "A small fastener; to cut short.",
  club: "A group; a heavy stick.",
  coal: "Black rock burned for heat.",
  coat: "An outer garment.",
  code: "Rules or symbols for messages.",
  coin: "Metal money.",
  cold: "Low temperature; an illness.",
  come: "To move toward or arrive.",
  cook: "To prepare food with heat.",
  cool: "Slightly cold; fashionable.",
  copy: "A duplicate of something.",
  cord: "A thin rope or wire.",
  core: "The central part.",
  corn: "A tall grain plant; maize.",
  cost: "The price paid for something.",
  crew: "A team working together.",
  crop: "Plants grown on a farm.",
  crow: "A black bird; to boast loudly.",
  cube: "A solid shape with six square faces.",
  curl: "A spiral of hair; to twist.",
  cute: "Attractive in a charming way.",
  dark: "With little or no light.",
  data: "Facts and information.",
  date: "A day on the calendar; a fruit.",
  dawn: "The first light of morning.",
  days: "Plural of day.",
  deal: "An agreement; to distribute cards.",
  debt: "Money owed to someone.",
  deck: "A floor of a ship; playing cards.",
  deep: "Far below the surface.",
  deer: "A graceful wild animal with antlers.",
  desk: "A table for writing or work.",
  dial: "A numbered face on a clock or phone.",
  diet: "The food a person eats.",
  dirt: "Soil; filth.",
  dish: "A plate; cooked food.",
  disk: "A flat round object.",
  dive: "To jump headfirst into water.",
  dock: "Where ships tie up.",
  does: "Third person of do.",
  doll: "A toy shaped like a person.",
  door: "A movable barrier to a room.",
  down: "Toward a lower place; sad.",
  drag: "To pull slowly; something tedious.",
  draw: "To sketch; to pull.",
  drop: "To fall; a small round amount.",
  drum: "A hollow instrument you hit for rhythm.",
  duck: "A water bird; to lower the head.",
  dull: "Not sharp or bright.",
  dust: "Fine dry particles.",
  duty: "A responsibility or task.",
  each: "Every one separately.",
  earl: "A British noble title.",
  earn: "To receive money for work.",
  east: "The direction of the sunrise.",
  easy: "Not difficult.",
  edge: "The outer limit of something.",
  edit: "To revise text or film.",
  eggs: "Oval food from hens.",
  else: "If not; otherwise.",
  emit: "To send out light, sound, or gas.",
  ends: "Plural of end; finishes.",
  epic: "A long heroic story.",
  even: "Flat; equal; still.",
  ever: "At any time.",
  evil: "Morally bad; harm.",
  exam: "A test of knowledge.",
  exit: "A way out; to leave.",
  face: "The front of the head.",
  fact: "Something known to be true.",
  fade: "To gradually disappear.",
  fail: "To not succeed.",
  fair: "Just; a festival; light complexion.",
  fall: "To drop down; autumn.",
  farm: "Land used for crops or animals.",
  fast: "Quick; not eating.",
  fear: "Being afraid.",
  feed: "To give food.",
  feel: "To sense by touch or emotion.",
  feet: "Plural of foot.",
  fell: "Past of fall; to cut down a tree.",
  felt: "Past of feel; a soft fabric.",
  file: "A folder of papers; to smooth edges.",
  fill: "To make full.",
  film: "A movie; thin coating.",
  find: "To discover by searching.",
  fine: "Good quality; a money penalty.",
  fire: "Flame; to dismiss from a job.",
  firm: "Solid; a business company.",
  fish: "An animal that lives in water.",
  five: "The number after four.",
  flag: "A cloth symbol on a pole.",
  flat: "Smooth and level; an apartment.",
  flaw: "A small defect.",
  flea: "A tiny jumping insect.",
  flew: "Past tense of fly.",
  flip: "To turn over quickly.",
  flow: "To move smoothly like water.",
  foam: "Bubbles on a liquid.",
  fold: "To bend one part over another.",
  folk: "People; traditional culture.",
  font: "A set of letters in one style.",
  food: "What people and animals eat.",
  foot: "The body part you walk on.",
  fork: "A utensil with prongs.",
  form: "Shape; a document; to create.",
  fort: "A strong military building.",
  four: "The number after three.",
  free: "Without cost; not busy.",
  frog: "A small jumping amphibian.",
  from: "Starting point; origin.",
  fuel: "Material burned for energy.",
  full: "Containing as much as possible.",
  fund: "Money saved for a purpose.",
  gain: "An increase; to obtain.",
  game: "A playful activity or sport.",
  gate: "A movable barrier in a fence.",
  gave: "Past tense of give.",
  gear: "Equipment; a toothed wheel.",
  gift: "Something given without payment.",
  girl: "A young female person.",
  give: "To hand over freely.",
  glad: "Pleased and happy.",
  glass: "Hard transparent material in windows.",
  glow: "A soft steady light.",
  glue: "A sticky substance that bonds.",
  goal: "A target to reach; a score in sports.",
  goat: "A farm animal with horns.",
  goes: "Third person of go.",
  gold: "A precious yellow metal.",
  golf: "A sport played on a course.",
  gone: "Past participle of go.",
  good: "Morally right; pleasant.",
  grab: "To seize suddenly.",
  gray: "A color between black and white.",
  grew: "Past tense of grow.",
  grid: "A pattern of crossing lines.",
  grip: "A firm hold.",
  grow: "To become larger.",
  gulf: "A large bay; a wide gap.",
  hair: "Thread-like strands on the head.",
  half: "One of two equal parts.",
  hall: "A large room or passage.",
  hand: "The body part at the end of the arm.",
  hang: "To suspend from above.",
  hard: "Firm; difficult.",
  harm: "Physical or emotional damage.",
  hate: "To strongly dislike.",
  head: "The top part of the body.",
  heal: "To become healthy again.",
  heap: "A pile of things.",
  hear: "To perceive sound.",
  heat: "High temperature; warmth.",
  held: "Past tense of hold.",
  help: "To make something easier for someone.",
  here: "In this place.",
  hero: "A brave admired person.",
  hide: "To put out of sight.",
  high: "Far above the ground.",
  hill: "A raised area of land.",
  hire: "To employ for pay.",
  hold: "To grasp; to contain.",
  hole: "An opening through something.",
  home: "Where someone lives.",
  hope: "A wish for something good.",
  horn: "A hard pointed growth; a loud device.",
  host: "One who receives guests.",
  hour: "Sixty minutes.",
  huge: "Very large.",
  hunt: "To search for animals to catch.",
  hurt: "To cause pain or damage.",
  idea: "A thought or plan.",
  inch: "A small unit of length.",
  into: "To the inside of.",
  iron: "A strong metal; a clothes press.",
  item: "A single thing on a list.",
  jack: "A lifting tool; a male name.",
  join: "To connect or become a member.",
  jump: "To push off the ground into the air.",
  just: "Exactly; only; fair.",
  keep: "To continue having.",
  keys: "Metal pieces that open locks.",
  kick: "To strike with the foot.",
  kind: "Friendly; a type or sort.",
  king: "A male ruler of a country.",
  knee: "The joint in the middle of the leg.",
  knew: "Past tense of know.",
  knit: "To make fabric with needles and yarn.",
  knot: "A tied loop in string or rope.",
  know: "To understand or be aware of.",
  lake: "A large body of water.",
  land: "Solid ground; to come down from the air.",
  last: "Final; most recent.",
  late: "After the expected time.",
  lawn: "Short grass in a yard.",
  lead: "To guide; a metal element.",
  leaf: "A flat green plant part.",
  lean: "Thin; to tilt against.",
  leap: "To jump far.",
  left: "Opposite of right; departed.",
  legs: "Limbs used for walking.",
  lend: "To let someone borrow temporarily.",
  lens: "A curved piece of glass in glasses.",
  less: "A smaller amount.",
  life: "The state of being alive.",
  lift: "To raise upward.",
  like: "Similar to; to enjoy.",
  line: "A long thin mark; a queue.",
  link: "A connection between things.",
  lion: "A large wild cat with a mane.",
  list: "A series of written items.",
  live: "To be alive; happening now.",
  load: "A burden carried; to put cargo on.",
  loan: "Money lent to be repaid.",
  lock: "A device that secures a door.",
  long: "Great in length; for a long time.",
  look: "To use your eyes to see.",
  loop: "A curved shape crossing itself.",
  lord: "A noble ruler; title of respect.",
  lose: "To fail to keep or win.",
  loss: "The fact of losing something.",
  loud: "Making a lot of noise.",
  love: "Deep affection for someone.",
  luck: "Good fortune by chance.",
  lung: "An organ used for breathing air.",
  made: "Past tense of make.",
  mail: "Letters and packages sent by post.",
  main: "The most important part.",
  make: "To create or produce.",
  male: "A boy or man; masculine.",
  many: "A large number of.",
  mark: "A sign or stain; a grade.",
  mass: "A large amount; scientific quantity.",
  mate: "A partner; a friend.",
  math: "The study of numbers and shapes.",
  meal: "Food eaten at one time.",
  mean: "To intend; unkind; average.",
  meat: "Animal flesh used as food.",
  meet: "To come together with someone.",
  melt: "To become liquid from heat.",
  menu: "A list of food choices.",
  mere: "Only; nothing more than.",
  mesh: "Net-like material.",
  mile: "A unit of distance.",
  milk: "White drink from cows.",
  mind: "Thoughts; to care about.",
  mine: "Belonging to me; a hole in the ground.",
  miss: "To fail to hit; a young woman.",
  mode: "A way of operating.",
  moon: "The natural satellite of Earth.",
  more: "A greater amount.",
  most: "The greatest amount.",
  move: "To change position.",
  much: "A large amount.",
  must: "To be required to.",
  nail: "A finger tip cover; a metal spike.",
  name: "What someone or something is called.",
  near: "Close in distance or time.",
  neck: "The part connecting head and body.",
  need: "To require something necessary.",
  nest: "A home built by birds.",
  news: "Information about recent events.",
  next: "Coming immediately after.",
  nice: "Pleasant; kind.",
  nine: "The number after eight.",
  node: "A point on a network or stem.",
  none: "Not any.",
  nose: "The organ used for smelling.",
  note: "A short written message; a tone.",
  noun: "A naming word in grammar.",
  odds: "The chances of something happening.",
  once: "One time; formerly.",
  only: "No one or nothing more.",
  onto: "To a position on top of.",
  open: "Not closed; to unlock.",
  oral: "Spoken; of the mouth.",
  over: "Above; finished; more than.",
  pace: "Speed of walking; a step.",
  pack: "To put things in a container.",
  page: "One side of a sheet in a book.",
  pain: "Physical or emotional suffering.",
  pair: "A set of two matching things.",
  palm: "Inside of the hand; a tree.",
  park: "A public green area; to stop a vehicle.",
  part: "A piece of a whole.",
  pass: "To go by; succeed in a test.",
  past: "Time gone by; beyond.",
  path: "A track for walking.",
  peak: "The top point of a mountain.",
  pear: "A sweet fruit, narrow at the top.",
  pick: "To choose; a pointed tool.",
  pile: "A heap of things stacked.",
  pine: "An evergreen tree; to long for.",
  pink: "A pale red color.",
  pipe: "A tube for water or smoke.",
  plan: "A scheme for doing something.",
  play: "To have fun; a performance.",
  plot: "A secret plan; a piece of land.",
  plug: "A device that connects to an outlet.",
  plus: "Added to; positive.",
  poem: "A piece of writing in verse.",
  poet: "A person who writes poetry.",
  pole: "A long stick; Earth’s axis ends.",
  pond: "A small body of still water.",
  pool: "Water for swimming; a shared group.",
  poor: "Having little money.",
  port: "A harbor; left side of a ship.",
  post: "A pole; mail; an online message.",
  pull: "To draw toward you.",
  pure: "Not mixed with anything else.",
  push: "To press something away from you.",
  quit: "To stop doing something.",
  race: "A speed competition; a group of people.",
  rain: "Water falling from clouds.",
  rank: "A position in an order.",
  rare: "Uncommon; lightly cooked meat.",
  rate: "A speed; a price per unit.",
  read: "To look at and understand writing.",
  real: "Actually existing; genuine.",
  redo: "To do again.",
  rest: "Sleep or relaxation; remainder.",
  rice: "Small white or brown grains as food.",
  rich: "Having a lot of money.",
  ride: "To sit on and control a vehicle.",
  ring: "A circular band; a phone sound.",
  rise: "To go up.",
  risk: "The chance of harm or loss.",
  road: "A path for vehicles.",
  rock: "Hard stone; to sway music.",
  role: "A part played by an actor.",
  roof: "The top cover of a building.",
  room: "Space inside walls.",
  root: "The part of a plant underground.",
  rope: "Thick twisted cord.",
  rose: "A flower; past tense of rise.",
  rule: "A regulation; to govern.",
  safe: "Free from danger; a strong box.",
  sail: "Canvas that catches wind on a boat.",
  sale: "Selling at reduced prices.",
  salt: "A white mineral used in food.",
  same: "Identical; not different.",
  sand: "Tiny grains on a beach.",
  save: "To rescue; to store for later.",
  seat: "Something to sit on.",
  seed: "A plant’s unit that can grow.",
  seek: "To try to find.",
  seem: "To appear to be.",
  self: "A person’s own being.",
  sell: "To give something for money.",
  send: "To cause to go somewhere.",
  ship: "A large boat; to transport.",
  shoe: "Foot covering.",
  shop: "A store; to buy things.",
  show: "To display; a performance.",
  shut: "To close.",
  sick: "Ill; unwell.",
  side: "A surface or edge; a team.",
  sign: "A symbol; to write your name.",
  silk: "A fine smooth thread from worms.",
  sing: "To make music with the voice.",
  sink: "Go down; a basin with a drain.",
  site: "A location; a web page.",
  size: "How big something is.",
  ski: "Glide on snow with long runners.",
  skin: "The outer layer of the body.",
  skip: "To jump lightly; to omit.",
  slab: "A thick flat piece of stone or wood.",
  slam: "To shut hard; a loud hit.",
  slip: "To slide accidentally; a small mistake.",
  slow: "Not fast.",
  snap: "To break suddenly; a quick photo.",
  snow: "Frozen white flakes from the sky.",
  soap: "A substance used for washing.",
  soil: "Earth where plants grow.",
  sold: "Past tense of sell.",
  some: "An unknown amount; a few.",
  song: "Music with words.",
  soon: "In a short time.",
  sort: "A category; to arrange.",
  soul: "The spiritual part of a person.",
  soup: "Liquid food with vegetables or meat.",
  spin: "To turn around quickly.",
  spit: "To force liquid from the mouth.",
  spot: "A small mark; a place.",
  star: "A point of light in the night sky.",
  stay: "To remain in a place.",
  stem: "The main stalk of a plant.",
  step: "A movement of the foot; a stage.",
  stir: "To mix by moving a spoon.",
  stop: "To cease moving or doing.",
  such: "Of that kind; so great.",
  suit: "Matching clothes; a legal case.",
  sure: "Certain; confident.",
  swim: "To move through water.",
  tail: "The rear part of an animal.",
  take: "To get hold of; carry away.",
  talk: "To speak with someone.",
  tall: "High in height.",
  tank: "A large container; an armored vehicle.",
  tape: "Sticky strip; recording ribbon.",
  task: "A piece of work to be done.",
  team: "A group working together.",
  tear: "A drop from the eye; to rip.",
  teen: "A person aged thirteen to nineteen.",
  tell: "To say to someone.",
  tent: "A portable shelter made of cloth.",
  term: "A fixed period; a word in logic.",
  test: "An examination; to try out.",
  text: "Written words; a message on phone.",
  than: "Used in comparisons.",
  that: "A thing or idea already mentioned.",
  them: "Those people or things.",
  then: "At that time; therefore.",
  they: "Those people or things.",
  thin: "Not thick; slender.",
  this: "The one nearby or just mentioned.",
  tide: "The rise and fall of the sea.",
  tidy: "Neat and orderly.",
  time: "Hours, minutes, and seconds.",
  tiny: "Very small.",
  tire: "A wheel’s rubber ring; to become weary.",
  toad: "A frog-like animal.",
  told: "Past tense of tell.",
  tone: "A quality of sound or color.",
  took: "Past tense of take.",
  tool: "An instrument used for work.",
  top: "The highest part.",
  tour: "A trip visiting places.",
  town: "A settled place smaller than a city.",
  tree: "A tall plant with a trunk.",
  trip: "A journey; to stumble.",
  true: "In accordance with fact.",
  tube: "A hollow cylinder.",
  turn: "To rotate; a chance in a game.",
  twin: "One of two born together.",
  type: "A kind; to write on a keyboard.",
  unit: "A single complete thing.",
  upon: "On top of; after.",
  used: "Not new; past tense of use.",
  user: "A person who uses something.",
  vast: "Very great in size.",
  very: "To a high degree.",
  view: "What can be seen from a place.",
  vote: "To choose in an election.",
  wage: "Money paid for work per time.",
  wait: "To stay until something happens.",
  wake: "To stop sleeping.",
  walk: "To move on foot at a slow pace.",
  wall: "A vertical side of a room.",
  want: "To desire or need.",
  warm: "Slightly hot; friendly.",
  wash: "To clean with water.",
  wave: "A moving ridge on water; to greet.",
  ways: "Methods; plural of way.",
  weak: "Not strong.",
  wear: "To have clothes on the body.",
  week: "Seven days together.",
  well: "In a good manner; a deep water hole.",
  went: "Past tense of go.",
  were: "Past plural of be.",
  west: "The direction of the sunset.",
  what: "Asking for information about a thing.",
  when: "At what time.",
  whip: "A cord for urging animals.",
  wide: "Great from side to side.",
  wife: "A married woman.",
  wild: "Not tame; in nature.",
  will: "Future intent; a legal document.",
  wind: "Moving air; to turn a clock.",
  wine: "Alcoholic drink from grapes.",
  wing: "A part used to fly.",
  wire: "A thin metal thread.",
  wise: "Showing good judgment.",
  wish: "To want something to happen.",
  with: "Accompanied by; using.",
  wolf: "A wild dog-like hunter.",
  wood: "Material from trees.",
  word: "A unit of language.",
  work: "Activity done for a job.",
  wrap: "To cover by folding material around.",
  yard: "Ground around a house; three feet.",
  year: "Twelve months.",
  yoga: "A system of exercise and breathing.",
  your: "Belonging to you.",
  zero: "The number meaning none.",
  zone: "An area with a particular use.",
  zoom: "To move quickly closer; a video call.",
  planet: "A large object in space that orbits a star.",
  market: "A place where people buy and sell goods or food.",
  bridge: "A structure built to cross over water or a gap.",
  flight: "A journey by air; the act of flying.",
  castle: "A large fortified building from medieval times.",
  spring: "The season after winter; a coil that bounces.",
  frozen: "Turned to ice; very cold.",
  jungle: "A dense tropical forest.",
  marble: "A hard stone used for sculpture or floors.",
  cabinet: "A piece of furniture with shelves behind doors.",
  blanket: "A warm cloth cover for a bed.",
  chicken: "A farm bird raised for meat or eggs.",
  dolphin: "A smart sea mammal that jumps in water.",
  element: "A basic part of something; a chemical type.",
  fortune: "Wealth or luck; a prediction of the future.",
  absolute: "Complete; not limited in any way.",
  complete: "Having all necessary parts; finished.",
  creative: "Using imagination to make new ideas.",
  thousand: "The number one thousand.",
  vacation: "Time away from work or school for rest.",
  chocolate: "A sweet brown treat made from cocoa.",
};

/** Rough syllable count from vowel groups (hint only). */
export function estimateSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w.length) return 1;
  let n = 0;
  let prevV = false;
  for (const ch of w) {
    const v = /[aeiouy]/.test(ch);
    if (v && !prevV) n++;
    prevV = v;
  }
  return Math.max(1, n);
}

/** If exactly one lexicon word matches the rack multiset and length, return it. */
export function resolveHintWord(rack: string): string | null {
  const sig = sortedLetterSignature(rack);
  const len = sig.length;
  if (!len) return null;
  const hits = Object.keys(WORD_DEFINITIONS).filter(
    (w) => w.length === len && sortedLetterSignature(w) === sig,
  );
  if (hits.length !== 1) return null;
  return hits[0]!;
}

export function getDefinitionForWord(word: string): string | undefined {
  return WORD_DEFINITIONS[word.toLowerCase()];
}

/**
 * Shared Easy-style meaning hints (SMART_HINTS + definitions), attempts 1–3 only.
 * No letter or spelling reveals — used by Medium and as the base for Easy.
 */
export function buildProgressiveMeaningHint(
  wrongNumber: number,
  answer: string,
): string | null {
  const w = answer.toLowerCase().replace(/[^a-z]/g, "");
  if (!w.length || wrongNumber < 1 || wrongNumber > 3) return null;

  const tier = Math.min(wrongNumber, 3) as ContextualTier;
  return (
    generateContextualHintTier(w, tier, "easy") ??
    generateContextualHintTier(w, 3, "easy") ??
    generateContextualHintTier(w, 2, "easy") ??
    generateContextualHintTier(w, 1, "easy")
  );
}

/**
 * Client-side hints when the rack matches exactly one lexicon word (Easy/Medium).
 */
export function buildWrongHintLine(
  wrongNumber: number,
  rack: string,
  semanticOnly = false,
): string | null {
  const resolved = resolveHintWord(rack);
  if (resolved) {
    return semanticOnly
      ? buildProgressiveMeaningHint(wrongNumber, resolved)
      : buildProgressiveContextualHint(wrongNumber, resolved);
  }
  const rackLetters = rack.toLowerCase().replace(/[^a-z]/g, "");
  if (!semanticOnly && wrongNumber >= 4 && rackLetters.length) {
    return `The word has ${rackLetters.length} letters.`;
  }
  return null;
}

type DifficultyHintSet = {
  easy: string;
  medium: string;
  hard: string;
};

type LegacyHintPair = readonly [string, string] | readonly [string, string, string];

/**
 * Human-written hints for the curated game pools.
 * Easy and Medium use the same clear, friendly style; Hard can be slightly trickier.
 */
const SMART_HINTS: Readonly<Record<string, DifficultyHintSet | LegacyHintPair>> = {
  ball: {
    easy: "A round object used in many sports and games.",
    medium: "Kids throw or kick it when they play outside.",
    hard: "It rolls and bounces when you move it.",
  },
  book: {
    easy: "You read stories and facts inside it.",
    medium: "It has pages you turn when learning or relaxing.",
    hard: "Libraries and backpacks often carry one.",
  },
  cake: {
    easy: "A sweet dessert people eat at celebrations.",
    medium: "Birthday parties often have candles on top of it.",
    hard: "You slice it and share pieces with friends.",
  },
  door: {
    easy: "You open it to go into a room.",
    medium: "It blocks the way until you turn the handle.",
    hard: "Homes and cars both have one at the entrance.",
  },
  face: {
    easy: "Your eyes, nose, and mouth are on it.",
    medium: "People look at it to see how you feel.",
    hard: "You wash it in the morning when you wake up.",
  },
  fire: {
    easy: "Hot flames that give light and warmth.",
    medium: "Campers sit near it to stay warm outside.",
    hard: "Smoke rises when wood burns in it.",
  },
  fish: {
    easy: "An animal that lives and swims in water.",
    medium: "People catch it with a rod or buy it at markets.",
    hard: "It has fins and gills instead of legs.",
  },
  fork: {
    easy: "You use it to pick up food at meals.",
    medium: "It has prongs and sits next to your plate.",
    hard: "You hold it in one hand while eating dinner.",
  },
  game: {
    easy: "Something people play for fun.",
    medium: "Friends follow rules and try to win it together.",
    hard: "Boards, cards, or screens are often part of it.",
  },
  hand: {
    easy: "You use it to hold and touch things.",
    medium: "It has five fingers and can wave hello.",
    hard: "You write and eat using this part of your arm.",
  },
  home: {
    easy: "The place where you live.",
    medium: "You go back there after school or work.",
    hard: "It has rooms like a kitchen and bedroom.",
  },
  king: {
    easy: "A man who rules a country with a crown.",
    medium: "Stories and history books often mention one.",
    hard: "He leads a kingdom and wears royal clothes.",
  },
  lion: {
    easy: "A large wild cat with a mane.",
    medium: "It roars and lives on grasslands in Africa.",
    hard: "Zoos show this big hunter behind strong fences.",
  },
  love: {
    easy: "A strong feeling of care for someone.",
    medium: "Families and friends share this feeling.",
    hard: "People show it with hugs, kindness, and support.",
  },
  milk: {
    easy: "A white drink that comes from cows.",
    medium: "You pour it on cereal in the morning.",
    hard: "It is kept cold in the fridge at home.",
  },
  moon: {
    easy: "Something bright you can see at night.",
    medium: "A bright object visible in the night sky.",
    hard: "It looks round and changes shape at night.",
  },
  rain: {
    easy: "Water that falls from clouds.",
    medium: "You need an umbrella when this happens outside.",
    hard: "Puddles form on the ground after a storm.",
  },
  ring: {
    easy: "A circle of metal worn on a finger.",
    medium: "Some people wear one when they get married.",
    hard: "It can be gold, silver, or another shiny metal.",
  },
  road: {
    easy: "Cars and buses drive along it.",
    medium: "It connects towns and cities together.",
    hard: "Lines and signs help drivers stay safe on it.",
  },
  ship: {
    easy: "A large boat that travels on the ocean.",
    medium: "It carries people or goods across the sea.",
    hard: "Sailors work on its deck far from land.",
  },
  song: {
    easy: "Music with words that people sing.",
    medium: "You hear it on the radio or at concerts.",
    hard: "A singer performs it with a melody and lyrics.",
  },
  star: {
    easy: "A bright point of light in the night sky.",
    medium: "You see many of them when you look up at night.",
    hard: "The sun is the closest one to Earth.",
  },
  tree: {
    easy: "A tall plant with a trunk and branches.",
    medium: "Birds sit on it and leaves grow on it.",
    hard: "People climb it or rest in its shade in parks.",
  },
  wind: {
    easy: "Moving air that you can feel outside.",
    medium: "It makes leaves rustle and kites fly high.",
    hard: "A breezy day has a gentle one blowing.",
  },
  cricket: {
    easy: "A popular sport played with a bat and ball.",
    medium: "Players score runs in this outdoor game.",
    hard: "It is often played on a large grass field.",
  },
  apple: [
    "A fruit people often eat every day.",
    "It is often red, green, or yellow and crunchy.",
  ],
  beach: [
    "Think of a place people go in summer.",
    "Sand, waves, and sunshine usually go with it.",
  ],
  bread: [
    "Think of something from the kitchen.",
    "Often sliced and used for sandwiches or toast.",
  ],
  chair: [
    "Think of something you find in a home or office.",
    "You sit on it—it has a back and legs.",
  ],
  clock: [
    "Think of something used every day.",
    "It tells you what time it is.",
  ],
  dance: [
    "Think of an activity people do for fun or exercise.",
    "Often done to music at parties or classes.",
  ],
  dream: [
    "Think of something that happens when you sleep.",
    "Stories or images in your mind at night.",
  ],
  earth: [
    "Think of something huge in nature.",
    "The planet we all live on.",
  ],
  field: [
    "Think of an outdoor place.",
    "Farmers grow crops there; sports teams play on one too.",
  ],
  fruit: [
    "Think of something you eat.",
    "Sweet produce that grows on trees or bushes.",
  ],
  ghost: [
    "Think of something from stories or Halloween.",
    "Some people say old houses have one.",
  ],
  grape: [
    "Think of a small food item.",
    "Grows in bunches; juice can be made from it.",
  ],
  grass: [
    "Think of something outside.",
    "Green ground cover in yards and parks.",
  ],
  group: [
    "Think of more than one person together.",
    "A team, class, or band of people counts as one.",
  ],
  heart: [
    "Think of part of the human body.",
    "It beats in your chest and pumps blood.",
  ],
  house: [
    "Think of a kind of building.",
    "A place where people live with rooms and a roof.",
  ],
  juice: [
    "Think of something from the kitchen.",
    "You pour it in a glass—often from fruit.",
  ],
  knife: [
    "Think of something used in the kitchen.",
    "It cuts food and has a sharp edge.",
  ],
  light: [
    "Think of something you notice in a room or sky.",
    "It helps you see when it’s dark.",
  ],
  lunch: [
    "Think of a meal.",
    "Often eaten around midday at school or work.",
  ],
  magic: [
    "Think of shows or stories.",
    "Tricks that seem impossible—rabbits in hats, card tricks.",
  ],
  money: [
    "Think of something people use every day.",
    "You earn it, save it, and spend it.",
  ],
  mouse: [
    "Think of an animal or a computer tool.",
    "Small and quick—might live in walls or move your cursor.",
  ],
  music: [
    "Think of something you hear.",
    "Made with instruments or voices; playlists are full of it.",
  ],
  night: [
    "Think of part of the day.",
    "When the sky is dark and most people sleep.",
  ],
  ocean: [
    "Think of a very large body of water.",
    "Fish live there; waves crash on the shore.",
  ],
  paper: [
    "Think of something used in school or an office.",
    "You write on it; it comes in sheets.",
  ],
  party: [
    "Think of a social event.",
    "Friends gather, there’s food, music, and celebrating.",
  ],
  piano: [
    "Think of something used for music.",
    "Black and white keys—you press them to play notes.",
  ],
  pizza: [
    "Think of a popular food.",
    "Round, often has cheese and toppings, comes in slices.",
  ],
  plant: [
    "Think of something living that’s not an animal.",
    "It grows in soil; many people keep one indoors.",
  ],
  river: [
    "Think of water in nature.",
    "Long flowing water that runs to the sea.",
  ],
  robot: [
    "Think of something from science or factories.",
    "A machine that can move or do tasks, sometimes like a person.",
  ],
  salad: [
    "Think of something you eat.",
    "Often raw vegetables tossed in a bowl.",
  ],
  sheep: [
    "Think of a farm animal.",
    "Woolly herd animal—counting them is a cliché for sleep.",
  ],
  shirt: [
    "Think of something you wear.",
    "Covers your torso; has sleeves and buttons or not.",
  ],
  smile: [
    "Think of something people do with their face.",
    "Shows you’re happy—turns the corners of your mouth up.",
  ],
  space: [
    "Think of something huge above us.",
    "Astronauts travel there; stars live there.",
  ],
  speed: [
    "Think of how fast something moves.",
    "Cars and runners are measured with it.",
  ],
  sport: [
    "Think of something people play or watch.",
    "Teams, rules, and a ball are common.",
  ],
  stone: [
    "Think of something hard from nature.",
    "Rocks and pebbles are small kinds of it.",
  ],
  storm: [
    "Think of weather.",
    "Thunder, lightning, and heavy rain often come with it.",
  ],
  story: [
    "Think of something you read or hear.",
    "Has a beginning, middle, and end—books are full of them.",
  ],
  sunny: [
    "Think of describing the weather.",
    "Bright day with lots of yellow light from the sky.",
  ],
  sweet: [
    "Think of a taste or a personality trait.",
    "Sugar, candy, and dessert often taste this way.",
  ],
  table: [
    "Think of furniture.",
    "You eat meals on its flat top.",
  ],
  teach: [
    "Think of something done in a school.",
    "What a teacher does to help students learn.",
  ],
  thank: [
    "Think of something polite you say.",
    "You say it when someone helps you or gives you something.",
  ],
  thing: [
    "Think of a very general noun.",
    "You use it when you don’t want to name the object yet.",
  ],
  tiger: [
    "Think of a wild animal.",
    "Big striped cat—not one you’d pet in the wild.",
  ],
  torch: [
    "Think of something that gives light.",
    "You might carry one in the dark; flames on a stick.",
  ],
  tower: [
    "Think of a tall building.",
    "Castles and cities have one that rises above the rest.",
  ],
  train: [
    "Think of transportation.",
    "Runs on tracks; carries people or cargo between cities.",
  ],
  treat: [
    "Think of something nice you give or get.",
    "Could be candy, a surprise, or a small reward.",
  ],
  truck: [
    "Think of a vehicle.",
    "Bigger than a car; used to haul heavy loads.",
  ],
  voice: [
    "Think of how people communicate.",
    "You hear it when someone speaks or sings.",
  ],
  watch: [
    "Think of something small you wear or do.",
    "Tells time on your wrist—or you do it to see a show.",
  ],
  water: [
    "Think of something essential to life.",
    "You drink it; fish swim in it.",
  ],
  wheat: [
    "Think of farming and food.",
    "A grain used for flour and bread.",
  ],
  world: [
    "Think of something very big.",
    "The whole Earth and everyone on it.",
  ],
};

function splitDefinitionSentences(def: string): string[] {
  return def
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function oneSentence(s: string): string {
  const trimmed = s.replace(/\s+/g, " ").trim();
  if (!trimmed) return trimmed;
  const capped = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return capped.replace(/[.!?]+$/, "").trim() + ".";
}

function hintContainsAnswer(hint: string, w: string): boolean {
  return new RegExp(`\\b${w}\\b`, "i").test(hint);
}

function isLegacyHintPair(
  entry: DifficultyHintSet | LegacyHintPair,
): entry is LegacyHintPair {
  return Array.isArray(entry);
}

/** Turn "Think of a place…" templates into direct, friendly sentences. */
function toDirectHint(hint: string): string {
  let s = hint.trim();
  if (/^think of\b/i.test(s)) {
    s = s.replace(/^think of\s+(a|an|the)\s+/i, "");
    s = s.replace(/^think of\s+/i, "");
    s = s.charAt(0).toUpperCase() + s.slice(1);
    if (!/^(A|An|The)\s/.test(s)) {
      if (/^(place|kind|meal|activity|vehicle|tool|animal|fruit|building)\b/i.test(s)) {
        s = `A ${s}`;
      } else if (/^(someone|something)\b/i.test(s)) {
        s = s.replace(/^someone\b/i, "Someone");
        s = s.replace(/^something\b/i, "Something");
      }
    }
  }
  return oneSentence(s);
}

function isVagueOpener(hint: string): boolean {
  return /^(Something|Someone|A place|An activity|A kind of|More than one|Part of)\b/i.test(
    hint,
  );
}

/** Reject poetic, abstract, dictionary, or generic template lines. */
function isUnhelpfulHint(hint: string): boolean {
  if (hint.split(/\s+/).length > 14) return true;
  if (
    /\b(common word|everyday word|you already know|think of a common|something people know|sports-related word|normal thing)\b/i.test(
      hint,
    )
  ) {
    return true;
  }
  if (
    /\b(celestial|wandering|darkness|temptation|symbol|metaphor|ancient|mysterious|ethereal|enigma|realm|void|destiny|sacred|legend)\b/i.test(
      hint,
    )
  ) {
    return true;
  }
  if (/\b(is|are|was|were|means|refers to|defined as)\b/i.test(hint) && hint.length > 55) {
    return true;
  }
  return false;
}

function sanitizeHint(hint: string, w: string): string | null {
  const direct = toDirectHint(hint);
  if (!direct || hintContainsAnswer(direct, w) || isUnhelpfulHint(direct)) {
    return null;
  }
  return direct;
}

/** Turn a dictionary clause into a short contextual sentence. */
function clueFromDefinitionClause(clause: string): string | null {
  let line = clause.trim();
  if (!line) return null;
  line = line.replace(/^(a|an|the)\s+/i, (m) => m);
  if (/^to\s+/i.test(line)) {
    line = `You ${line.replace(/^to\s+/i, "")}`;
  }
  const h = oneSentence(line);
  return isUnhelpfulHint(h) ? null : h;
}

function isSpellingBasedHint(hint: string): boolean {
  return /\b(starts with|first letter|ends with|contains the letter|letters and|letter [A-Z]|how it is spelled|how many letters)\b/i.test(
    hint,
  );
}

function sanitizeSemanticHint(hint: string, w: string): string | null {
  const h = sanitizeHint(hint, w);
  if (!h || isSpellingBasedHint(h)) return null;
  return h;
}

/** Build 1–3 progressive semantic clues from a dictionary-style definition. */
function semanticCluesFromDefinition(def: string, w: string): string[] {
  const clauses: string[] = [];
  for (const sentence of splitDefinitionSentences(def)) {
    for (const part of sentence.split(";")) {
      const c = clueFromDefinitionClause(part);
      if (c) clauses.push(c);
    }
  }

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const c of clauses) {
    const h = sanitizeSemanticHint(c, w);
    if (h && !seen.has(h)) {
      seen.add(h);
      unique.push(h);
    }
  }

  if (unique.length >= 3) return unique.slice(0, 3);
  if (unique.length === 2) return [unique[0]!, unique[1]!, unique[1]!];
  if (unique.length === 1) {
    const core = unique[0]!;
    const broad = sanitizeSemanticHint(
      core.replace(/^(A|An|The)\s+/i, "Something that "),
      w,
    );
    const specific = sanitizeSemanticHint(oneSentence(def), w);
    return [
      broad && broad !== core ? broad : core,
      core,
      specific && specific !== core ? specific : core,
    ];
  }
  return [];
}

/** Non-spelling semantic fallbacks when a word has no curated clues. */
function semanticFallbackHint(
  wrongNumber: number,
  difficulty: GameDifficulty,
): string {
  const easy = [
    "This word names something familiar from everyday life.",
    "Think about where or when people use this word.",
    "Picture the real-world thing or idea the word refers to.",
  ];
  const medium = [
    "This word describes something people recognize in daily life.",
    "Focus on what it means, not how it is spelled.",
    "The clue points to a common idea, object, or action.",
  ];
  const hard = [
    "Consider the concept behind the word, not its spelling.",
    "The answer is an everyday English word with a clear meaning.",
    "Link the idea to context—where would this word appear in conversation?",
  ];
  const pool =
    difficulty === "hard" ? hard : difficulty === "medium" ? medium : easy;
  return pool[Math.min(Math.max(wrongNumber - 1, 0), 2)]!;
}

/**
 * Semantic clues for a word, ordered broad → specific for the difficulty band.
 */
export function gatherSemanticClues(
  word: string,
  difficulty: GameDifficulty,
): string[] {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w.length) return [];

  const clear: string[] = [];
  const vague: string[] = [];
  const seen = new Set<string>();
  const push = (hint: string | null) => {
    const h = hint ? sanitizeSemanticHint(hint, w) : null;
    if (!h || seen.has(h)) return;
    seen.add(h);
    if (isVagueOpener(h)) vague.push(h);
    else clear.push(h);
  };

  const entry = SMART_HINTS[w];
  if (entry) {
    if (isLegacyHintPair(entry)) {
      for (const line of entry) {
        push(line);
      }
    } else if (difficulty === "easy") {
      push(entry.easy);
      push(entry.medium);
      push(entry.hard);
    } else if (difficulty === "medium") {
      push(entry.medium);
      push(entry.easy);
      push(entry.hard);
    } else {
      push(entry.hard);
      push(entry.medium);
    }
  }

  const def = getDefinitionForWord(w);
  if (def) {
    for (const clue of semanticCluesFromDefinition(def, w)) {
      push(clue);
    }
  }

  return [...clear, ...vague];
}

/** All unique contextual clues for a word (curated + dictionary) — Easy band. */
export function gatherContextualClues(word: string): string[] {
  return gatherSemanticClues(word, "easy");
}

/** True when we can produce real word-specific contextual hints. */
export function wordHasContextualHints(word: string): boolean {
  return gatherSemanticClues(word, "easy").length > 0;
}

/** True when Medium can show progressive semantic hints for this word. */
export function wordHasSemanticHints(
  word: string,
  difficulty: GameDifficulty,
): boolean {
  return gatherSemanticClues(word, difficulty).length > 0;
}

/**
 * Medium uses the same clue sources as Easy (easy → medium → hard tiers + definitions).
 * Requires at least three progressive clues (or enough data to synthesize them).
 */
export function wordHasMediumProgressiveHints(word: string): boolean {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w.length) return false;

  const clues = gatherSemanticClues(w, "easy");
  if (clues.length >= 3) return true;

  const entry = SMART_HINTS[w];
  if (entry && isLegacyHintPair(entry) && entry.length >= 3) return true;

  if (getDefinitionForWord(w)) return true;

  return clues.length >= 2;
}

export type ContextualTier = 1 | 2 | 3;

/** Wrong #1 = broad, #2 = clearer, #3 = most helpful contextual clue. */
export function generateContextualHintTier(
  word: string,
  tier: ContextualTier,
  difficulty: GameDifficulty = "easy",
): string | null {
  const clues = gatherSemanticClues(word, difficulty);
  if (!clues.length) return null;

  if (tier === 1) return clues[0]!;
  if (tier === 2) return clues[Math.min(1, clues.length - 1)]!;
  return clues[Math.min(2, clues.length - 1)] ?? clues[clues.length - 1]!;
}

/** First contextual hint — same logic for Easy and Medium. */
export function generateEasyStyleHint(word: string): string | null {
  return generateContextualHintTier(word, 1);
}

export function generateBestHintForWord(
  word: string,
  difficulty: GameDifficulty,
): string | null {
  if (difficulty === "hard") {
    return (
      generateContextualHintTier(word, 2) ?? generateContextualHintTier(word, 1)
    );
  }
  return generateEasyStyleHint(word);
}

/** Letter hints only after attempt 3 (wrong #4+) — Easy contextual path only. */
const LETTER_HINT_START = 4;

function letterHint(w: string, wrongNumber: number): string {
  if (wrongNumber === LETTER_HINT_START) {
    return `It starts with the letter ${w[0]!.toUpperCase()}.`;
  }
  const len = w.length;
  const last = w[len - 1]!.toUpperCase();
  const inner = w.slice(1, -1);
  for (const c of inner) {
    if ("aeiou".includes(c)) {
      return `The word has ${len} letters and contains the letter ${c.toUpperCase()}.`;
    }
  }
  return `The word has ${len} letters and ends with ${last}.`;
}

/**
 * Progressive hints: 3 contextual clues, then letter help (Easy only).
 */
export function buildProgressiveContextualHint(
  wrongNumber: number,
  answer: string,
): string | null {
  const w = answer.toLowerCase().replace(/[^a-z]/g, "");
  if (!w.length) return null;

  if (wrongNumber >= LETTER_HINT_START) {
    return letterHint(w, wrongNumber);
  }

  const hint = buildProgressiveMeaningHint(wrongNumber, answer);
  if (hint) return hint;

  if (wrongNumber >= 3) {
    return letterHint(w, LETTER_HINT_START);
  }
  return null;
}

/**
 * Semantic-only progressive hints (no spelling or letter reveals).
 * Hint 1 broad → Hint 2 clearer → Hint 3 specific.
 */
export function buildProgressiveSemanticHint(
  wrongNumber: number,
  answer: string,
  difficulty: GameDifficulty,
): string {
  const w = answer.toLowerCase().replace(/[^a-z]/g, "");
  if (!w.length) {
    return semanticFallbackHint(wrongNumber, difficulty);
  }

  const clues = gatherSemanticClues(w, difficulty);
  if (!clues.length) {
    return semanticFallbackHint(wrongNumber, difficulty);
  }

  const tier = Math.min(wrongNumber, 3) as ContextualTier;
  return (
    generateContextualHintTier(w, tier, difficulty) ??
    clues[Math.min(tier - 1, clues.length - 1)] ??
    clues[clues.length - 1] ??
    semanticFallbackHint(wrongNumber, difficulty)
  );
}

/** @deprecated Use buildProgressiveMeaningHint — same behavior as Easy meaning hints. */
export function buildMediumProgressiveHint(
  wrongNumber: number,
  answer: string,
): string | null {
  return buildProgressiveMeaningHint(wrongNumber, answer);
}

/**
 * Server-side hints after a wrong guess.
 * Easy: meaning hints + letter fallback. Medium: same meaning hints as Easy. Hard: semantic band.
 */
export function buildWrongHintFromAnswer(
  wrongNumber: number,
  answer: string,
  difficulty: GameDifficulty,
): string | null {
  if (difficulty === "easy") {
    return buildProgressiveContextualHint(wrongNumber, answer);
  }
  if (difficulty === "medium") {
    return buildProgressiveMeaningHint(wrongNumber, answer);
  }
  return buildProgressiveSemanticHint(wrongNumber, answer, difficulty);
}
