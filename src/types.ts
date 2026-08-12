export interface WorkItem {
  id: string;
  title: string;
  category: "commercial" | "music-video" | "branded" | "documentary" | "photography";
  client: string;
  director: string;
  dp: string; // Director of Photography or Lead Photographer
  year: string;
  duration: string;
  camera: string;
  visualStill: string; // Background URL or representation
  youtubeId?: string; // Real YouTube embed ID if available
  videoUrl?: string; // Real self-hosted MP4 or video source URL if available
  description: string;
  challenge: string;
  solution: string;
  credits: {
    role: string;
    name: string;
  }[];
  tags: string[];
}

export type ProjectCategory = "all" | "commercial" | "music-video" | "branded" | "documentary" | "photography";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  specialties: string[];
  selectedWorks: string[];
}

export interface CostItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  multiplierLabel?: string;
  unitType?: "days" | "minutes" | "crew" | "locations" | "flat" | "hours" | "clips" | "units";
  isSelected: boolean;
  quantity: number;
}

export interface CostCategory {
  id: string;
  name: string;
  description: string;
  items: CostItem[];
}

export interface ScriptScene {
  timecode: string;
  visuals: string;
  audio: string;
  directorsNote: string;
}

export interface ScriptAct {
  actName: string;
  scenes: ScriptScene[];
}

export interface StoryboardPanel {
  panelNumber: number;
  description: string;
  shotType: string;
  aestheticPrompt: string;
}

export interface ScriptResult {
  title: string;
  concept: string;
  moodboardKeywords: string[];
  visualStyle: {
    lighting: string;
    colorPalette: string;
    cameraMovement: string;
    soundDesign: string;
  };
  scriptActs: ScriptAct[];
  storyboardBrief: StoryboardPanel[];
  productionTips: string[];
}
