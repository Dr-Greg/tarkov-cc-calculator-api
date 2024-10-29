const ALL_TYPES = [
    "barter",
    "container",
    "glasses",
    "grenade",
    "headphones",
    "injectors",
    "mods",
    "pistolGrip",
    "suppressor",
] as const;

const DEFAULT_TYPES = [
    "barter",
    "container",
    "suppressor",
] as const;

export type AllTypes = typeof ALL_TYPES[number];

export { ALL_TYPES, DEFAULT_TYPES };
