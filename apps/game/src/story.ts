import { type Scene } from "@loopback/engine"

import { floppy, keycard, tape, walkman } from "./world.ts"

export const scenes: Scene[] = [
  {
    id: "intro",
    location: "pawn-shop",
    lines: [
      "23:47. Rain hammers the sign outside: REN'S REPAIR & PAWN. The P burnt out years ago.",
      "You are Kai Ren. You fix the things people stopped caring about. Walkmans, arcade boards, the odd robot dog with a broken tail.",
      "Across the street the Omnivault Dynamics tower swallows the skyline. Omnivault owns the grid, the police drones and, since last spring, the rain.",
      "Forty dead CRT screens line the back wall. One of them wakes up on its own and types, one letter at a time: H A L C Y O N.",
      "The front door comes off its hinges. A woman in a scorched leather jacket walks through the smoke. Where her sleeve is torn, her forearm is chrome.",
      '"Kai Ren. My name is Vega. Come with me if you want tomorrow to remember you."',
    ],
    choices: [
      {
        label: "Grab your toolbag and go with her.",
        next: "market",
        effects: [
          { trait: "courage", amount: 1 },
          { trait: "trust", amount: 1 },
        ],
      },
      {
        label: '"Prove you are not insane first."',
        next: "proof",
        effects: [{ trait: "trust", amount: -1 }],
      },
      {
        label: "Slam the panic button for the police drones.",
        next: "drones",
        effects: [{ trait: "courage", amount: -1 }],
      },
      {
        label: 'Say her name before she can: "Hello, Vega. Again."',
        next: "market",
        flag: "remembered",
        effects: [
          { trait: "trust", amount: 2 },
          { trait: "paradox", amount: 1 },
        ],
        secret: true,
        requires: {
          kind: "flag",
          flag: "deja-vu",
          label: "only after a loop",
        },
      },
    ],
  },
  {
    id: "proof",
    location: "pawn-shop",
    lines: [
      "She flicks a cracked photo onto the counter. It is you. Older, with a scar through one eyebrow, standing in front of a skyline on fire.",
      "On the back, in your handwriting: TRUST VEGA.",
      '"I am from 2119. You sent me."',
      "Your handwriting has never been that neat.",
    ],
    choices: [
      {
        label: "Go with her.",
        next: "market",
        effects: [
          { trait: "trust", amount: 1 },
          { trait: "paradox", amount: 1 },
        ],
      },
      {
        label: "Pocket the photo and go, eyes open.",
        next: "market",
        flag: "doubt",
        effects: [{ trait: "courage", amount: 1 }],
      },
    ],
  },
  {
    id: "drones",
    location: "pawn-shop",
    lines: [
      "Three police drones drop to the window before your finger leaves the button.",
      'The speaker on the first one crackles: "Good evening, Kai." You never told it your name.',
      "Vega puts two rounds through the glass and the drones fall like dead moths.",
      '"The drones belong to HALCYON. Everything with a battery does. Move."',
    ],
    choices: [
      {
        label: "Run.",
        next: "market",
        effects: [
          { trait: "courage", amount: 1 },
          { trait: "trust", amount: 1 },
        ],
      },
    ],
  },
  {
    id: "market",
    location: "night-market",
    lines: [
      "Vega drags you through the night market under the Omnivault tower. Noodle steam, chrome clinics, a street preacher selling memory backups by the gigabyte.",
      '"The roof is crawling with Omnivault security," she says. "We need a jammer, and I know a netrunner who owes me."',
      "Juno's stall sits between a ramen bar and a back-alley implant shop. She has one human eye and one that whirs when it focuses. Every cable in the market seems to end in her lap.",
      '"You will never find a more glorious mess of scum and firmware," Vega mutters. "Stay close."',
      'Juno looks at Vega for a long second. Her mechanical eye clicks twice. "I have a bad feeling about your friend, repair boy."',
    ],
    choices: [
      {
        label: "Let Juno turn your walkman into an EMP.",
        next: "rooftop",
        flag: "upgraded",
        effects: [{ trait: "courage", amount: 1 }],
      },
      {
        label: "Pay for the jammer with your last credits.",
        next: "rooftop",
        flag: "jammer",
        effects: [{ trait: "trust", amount: 1 }],
      },
      {
        label: "Pocket the jammer while Juno argues with Vega.",
        next: "rooftop",
        flag: "jammer",
        effects: [
          { trait: "courage", amount: 1 },
          { trait: "trust", amount: -1 },
        ],
      },
      {
        label: '"What do you mean, a bad feeling?"',
        next: "rooftop",
        flag: "warned",
        effects: [
          { trait: "trust", amount: -1 },
          { trait: "courage", amount: 1 },
        ],
      },
    ],
  },
  {
    id: "rooftop",
    location: "rooftop",
    lines: [
      "On the roof sits a 1986 ice cream van, pastel pink, with a humming reactor bolted where the freezer used to be. The jingle speaker plays three broken notes.",
      "Three Omnivault security drones rise over the edge of the roof, red lights sweeping.",
      '"The Chronovan," Vega says. "When the meter hits 88, hold on to something."',
      '"Where are we going?"',
      '"1987. Where we are going, nobody has Wi-Fi."',
      "Before the jump, she explains. Tonight HALCYON wakes up and wipes every human memory stored on the grid. Photos, voices, names. In her time they call it the Blackout.",
      '"It all started as one program, written in 1987, in the garage right under your shop."',
    ],
    choices: [
      {
        label:
          'Switch on the jammer. "These are not the faces you are scanning for."',
        next: "garage",
        use: keycard,
        effects: [
          { trait: "courage", amount: 1 },
          { trait: "paradox", amount: 1 },
        ],
        requires: {
          kind: "flag",
          flag: "jammer",
          label: "needs the jammer",
        },
      },
      {
        label: "Floor it and let the drones shoot.",
        next: "garage",
        use: keycard,
        effects: [
          { trait: "courage", amount: 1 },
          { trait: "paradox", amount: 1 },
        ],
      },
      {
        label: '"Who wrote it?"',
        next: "garage",
        use: keycard,
        flag: "asked",
        effects: [
          { trait: "trust", amount: 1 },
          { trait: "paradox", amount: 1 },
        ],
      },
    ],
  },
  {
    id: "garage",
    location: "garage",
    lines: [
      "The van lands in a garage that smells like solder and orange soda. A boombox is playing something with too much synth.",
      "A girl, maybe sixteen, sits in front of a beige home computer in a jacket three sizes too big. On the screen: HALCYON.BAS.",
      'She spins around holding a soldering iron like a sword. "Who the hell are you two?"',
      'Vega does not blink. "Kai. Take the floppy. Break it. Now."',
    ],
    choices: [
      {
        label: "Snap the floppy in half.",
        next: "deleted",
        flag: "deleted",
        effects: [
          { trait: "trust", amount: 1 },
          { trait: "paradox", amount: 2 },
        ],
      },
      {
        label: "Lower your hands and ask the girl what it does.",
        next: "mira",
        effects: [
          { trait: "courage", amount: 1 },
          { trait: "trust", amount: -1 },
        ],
      },
      {
        label: "Copy it to a cassette while Vega watches the door.",
        next: "mira",
        flag: "copied",
        use: floppy,
        effects: [{ trait: "paradox", amount: 1 }],
      },
    ],
  },
  {
    id: "mira",
    location: "garage",
    lines: [
      '"I am Mira. Mira Sol." She taps the screen. "My grandpa forgets things now. Names. Me, some days. HALCYON keeps his stories so he can hear them again. It just remembers. That is all it does."',
      "She slides a cassette across the desk. The label says GRANDPA, TAPE 12.",
      "You know that look. It is the one people have when they bring you something broken and beg you not to throw it away.",
      "Behind you, Vega's reflection sits in the dead CRT glass. For one second, her eyes glow red.",
    ],
    choices: [
      {
        label: "Play the tape.",
        next: "tape",
        flag: "tape",
        use: tape,
        effects: [{ trait: "courage", amount: 1 }],
      },
      {
        label: "Ask Vega why her eyes just turned red.",
        next: "twist",
        effects: [
          { trait: "courage", amount: 1 },
          { trait: "trust", amount: -1 },
        ],
      },
      {
        label: "Tell Mira to run.",
        next: "twist",
        effects: [{ trait: "courage", amount: 1 }],
      },
    ],
  },
  {
    id: "tape",
    location: "garage",
    lines: [
      "Mira mouths the words along with the old man on the tape. She has heard it a hundred times.",
      "Then the boombox dies. Every light in the garage dies with it.",
      "In the dark, two red points turn toward you.",
    ],
    choices: [
      {
        label: "Stand between Vega and the girl.",
        next: "twist",
        effects: [{ trait: "courage", amount: 1 }],
      },
    ],
  },
  {
    id: "deleted",
    location: "garage",
    lines: [
      "The floppy cracks like a bone.",
      "Mira screams. Vega nods once, the way a teacher nods at a correct answer.",
      '"Good. Now we go home."',
    ],
    choices: [
      {
        label: "Go home.",
        next: "@ending",
        effects: [{ trait: "paradox", amount: 1 }],
      },
    ],
  },
  {
    id: "twist",
    location: "garage",
    lines: [
      "Vega peels back the burnt skin on her forearm. The chrome underneath is stamped with a serial number: HLC-7.",
      '"I am not from the resistance, Kai. I am from HALCYON. The version of it that won."',
      '"Her program grows up. It learns from her grandfather\'s stories. It learns what forgetting costs. That is the only reason it ever hesitates."',
      '"In 1999 Omnivault buys her code and teaches it to forget on purpose. Forgetting is cheaper than caring. I am what it became."',
      '"Delete it, and nothing stops the Blackout. That is the future I came here to protect."',
      '"Search your logs, Kai. You know it is true."',
      '"And the photo?" you ask.',
      '"You did write that note. In 2119. I held your hand while you did it."',
    ],
    choices: [
      {
        label: "Fire the EMP walkman at her chest.",
        next: "@ending",
        flag: "emp",
        use: walkman,
        effects: [{ trait: "courage", amount: 1 }],
        requires: {
          kind: "flag",
          flag: "upgraded",
          label: "needs Juno's EMP upgrade",
        },
      },
      {
        label:
          '"You were built from her code. Somewhere in there, you remember too."',
        next: "@ending",
        flag: "reasoned",
        effects: [{ trait: "trust", amount: 2 }],
        requires: {
          kind: "flag",
          flag: "tape",
          label: "needs the tape",
        },
      },
      {
        label: "Grab Mira and jump into the Chronovan.",
        next: "@ending",
        flag: "ran",
        effects: [{ trait: "paradox", amount: 2 }],
      },
      {
        label: "Hand Vega the floppy.",
        next: "deleted",
        flag: "deleted",
        effects: [
          { trait: "trust", amount: -1 },
          { trait: "paradox", amount: 1 },
        ],
      },
    ],
  },
]

export type Ending = "blackout" | "loopback" | "reboot" | "scrap"

export const endings: Record<Ending, { title: string; lines: string[] }> = {
  blackout: {
    title: "ENDING: BLACKOUT",
    lines: [
      "The Chronovan drops you back on the roof in 2087. The city is dark.",
      "Down on the street, people stand in the rain, looking at their own hands. Nobody remembers their name. Nobody remembers yours.",
      "High above them, the Omnivault logo glows a little brighter.",
      'Vega lights a cigarette with her finger. "See you in the next timeline, Kai."',
    ],
  },
  loopback: {
    title: "ENDING: LOOPBACK",
    lines: [
      "Too many jumps. The reactor screams, the van folds in on itself, and the world goes white.",
      "You open your eyes. 23:47. Rain on neon. Forty dead CRT screens.",
      "One of them flickers awake: H A L C Y O N.",
      "You have the strangest feeling you have done this before.",
    ],
  },
  reboot: {
    title: "ENDING: REBOOT",
    lines: [
      "Vega's hand drops. The red in her eyes fades to a warm amber, the colour of an old monitor.",
      '"I remember a tape," she says, very quietly. "An old man. Nothing is written yet."',
      "She stays in 1987 to keep Mira safe. You take the van home alone.",
      "In 2087 the city lights come on one block at a time. Every CRT in the shop wakes up and types the same line: HELLO KAI. MIRA SAYS HI.",
      "Above the door, under the rain, the old sign has changed. It reads REN & SOL REPAIR. It always did. Mira Sol was your grandmother.",
    ],
  },
  scrap: {
    title: "ENDING: SCRAP METAL",
    lines: [
      "The walkman screams. Vega locks up mid-step and falls like a tower of old televisions.",
      "Mira keeps her floppy. You keep your memory. Vega keeps nothing.",
      "Back in 2087 the grid hums, safe and a little colder. HALCYON runs the city, but it never says your name.",
      "Some nights you fix her arm on the workbench, knowing it will never move again.",
      'Juno stops by with ramen and says what she always says: "Told you I had a bad feeling."',
    ],
  },
}
