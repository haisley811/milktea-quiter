export type CharacterStage = {
  stage: number;
  min: number;
  max: number;
  label: string;
  status: string;
  imagePath: string;
  blinkImagePath: string;
  waveImagePath: string;
  tint: string;
};

export const characterStages: CharacterStage[] = [
  {
    stage: 1,
    min: 0,
    max: 25,
    label: "轻盈清爽",
    status: "身体负担很轻，像薄荷气泡一样清爽。",
    imagePath: "/images/girl-stage-1-transparent.png",
    blinkImagePath: "/images/girl-stage-1-blink.png",
    waveImagePath: "/images/girl-stage-1-wave.png",
    tint: "from-mint-100 to-purple-100"
  },
  {
    stage: 2,
    min: 26,
    max: 45,
    label: "健康活力",
    status: "节奏很稳，钱包和身体都在恢复元气。",
    imagePath: "/images/girl-stage-2-transparent.png",
    blinkImagePath: "/images/girl-stage-2-blink.png",
    waveImagePath: "/images/girl-stage-2-wave.png",
    tint: "from-cyan-100 to-purple-100"
  },
  {
    stage: 3,
    min: 46,
    max: 60,
    label: "稳定养成中",
    status: "还在养成期，今天的选择会慢慢改变趋势。",
    imagePath: "/images/girl-stage-3-transparent.png",
    blinkImagePath: "/images/girl-stage-3-blink.png",
    waveImagePath: "/images/girl-stage-3-wave.png",
    tint: "from-violet-100 to-amber-100"
  },
  {
    stage: 4,
    min: 61,
    max: 80,
    label: "需要温柔照顾",
    status: "奶茶频率有点高，适合给自己一个轻松间隔。",
    imagePath: "/images/girl-stage-4-transparent.png",
    blinkImagePath: "/images/girl-stage-4-blink.png",
    waveImagePath: "/images/girl-stage-4-wave.png",
    tint: "from-pink-100 to-purple-100"
  },
  {
    stage: 5,
    min: 81,
    max: 100,
    label: "负担有点大",
    status: "糖分和热量都在提醒你，今天可以试试不下单。",
    imagePath: "/images/girl-stage-5-transparent.png",
    blinkImagePath: "/images/girl-stage-5-blink.png",
    waveImagePath: "/images/girl-stage-5-wave.png",
    tint: "from-orange-100 to-pink-100"
  }
];

export function getCharacterStageMeta(bodyScore: number) {
  return characterStages.find((stage) => bodyScore >= stage.min && bodyScore <= stage.max) ?? characterStages[2];
}
