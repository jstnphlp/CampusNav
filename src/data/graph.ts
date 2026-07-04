import type { CampusGraph } from "@/types/campus";

export const CAMPUS_GRAPH: CampusGraph = {

  nodes: [
    { id: "hw_nw", label: "South Hallway Corner (Top)", x: 24.5, y: 20.0 },
    { id: "south_male_restroom", label: "South Building Male Restroom", x: 20.6, y: 21.3 },
    { id: "wf_female_toilet", label: "WF Female Toilet", x: 38.1, y: 19.0 },
    { id: "health_services", label: "Health Services", x: 40.5, y: 20.6 },
    { id: "canteen", label: "Canteen", x: 52.0, y: 21.7 },
    { id: "hw_ne", label: "North Hallway to Canteen", x: 65.0, y: 28.0 },
    { id: "north_male_toilet", label: "North Building Male Toilet", x: 79.9, y: 28.0 },

    { id: "hw_w1", label: "South Hallway 1", x: 24.5, y: 27.0 },
    { id: "hw_w2", label: "South Hallway 2", x: 24.5, y: 38.0 },
    { id: "hw_w3", label: "South Elevator", x: 24.5, y: 45.0 },
    { id: "hw_w4", label: "South Walkway (Admissions)", x: 31.0, y: 53.0 },

    { id: "south_female_restroom", label: "South Building Female Restroom", x: 19.9, y: 28.3 },
    { id: "hw_se_to_canteen", label: "South Hallway to Canteen", x: 33.0, y: 27.0 },
    { id: "south_student_lounge", label: "South Student Lounge", x: 35.0, y: 38.0 },

    { id: "gymnasium", label: "Gymnasium", x: 50.0, y: 36.5 },
    { id: "registrar", label: "Registrar's Office", x: 45.7, y: 46.3 },
    { id: "treasurer", label: "Treasurer's Office", x: 54.5, y: 46.3 },

    { id: "hw_e1", label: "North Hallway 1", x: 78.5, y: 26.0 },
    { id: "hw_e2", label: "North Hallway 2", x: 78.5, y: 38.0 },
    { id: "hw_el", label: "North Elevator", x: 78.5, y: 45.0 },
    { id: "north_student_lounge", label: "North Student Lounge", x: 69.0, y: 38.0 },
    { id: "north_toilet", label: "North Bldg PWD Toilet", x: 81.0, y: 55.0 },

    { id: "entry_gate", label: "Entry Gate", x: 31.0, y: 62.5 },
    { id: "hw_sw", label: "South Walkway", x: 31.0, y: 45.0 },
    { id: "student_parking", label: "Student Parking", x: 50.0, y: 53.0 },
    { id: "hw_se", label: "North Hallway Corner (Bottom)", x: 78.5, y: 55.0 },
    { id: "hw_nwk", label: "North Walkway", x: 71.0, y: 45.0 },
    { id: "hw_nwk_2", label: "North Walkway 2", x: 71.0, y: 53.0 },

    { id: "south_canteen_ent", label: "South Canteen Entrance", x: 45.0, y: 25.0 },
    { id: "north_canteen_ent", label: "North Canteen Entrance", x: 60.0, y: 25.0 },
    { id: "audio_visual_room", label: "Audio Visual Room", x: 29.5, y: 24.0 },
    { id: "registrar_gym_ent", label: "Registrar Gymnasium Entrance", x: 42.0, y: 42.0 },
    { id: "treasurer_gym_ent", label: "Treasurer's Gymnasium Entrance", x: 59.0, y: 42.0 },

    { id: "exit_gate", label: "Exit Gate", x: 71.0, y: 73.5 },

    { id: "chapel", label: "Chapel", x: 71.0, y: 66.5 },

  ],

  edges: [
    { from: "hw_ne", to: "north_canteen_ent", weight: 10, covered: true, accessible: true },
    { from: "north_canteen_ent", to: "canteen", weight: 10, covered: true, accessible: true },
    { from: "south_canteen_ent", to: "canteen", weight: 10, covered: true, accessible: true },
    { from: "hw_se_to_canteen", to: "south_canteen_ent", weight: 10, covered: true, accessible: true },
    { from: "north_student_lounge", to: "hw_ne", weight: 15, covered: true, accessible: true },
    { from: "south_student_lounge", to: "hw_se_to_canteen", weight: 10, covered: true, accessible: true },
    { from: "hw_w1", to: "hw_se_to_canteen", weight: 15, covered: true, accessible: true },
    { from: "audio_visual_room", to: "hw_se_to_canteen", weight: 10, covered: true, accessible: true },
    { from: "hw_nw", to: "south_male_restroom", weight: 13, covered: true, accessible: true },
    { from: "wf_female_toilet", to: "south_canteen_ent", weight: 8, covered: true, accessible: true },
    { from: "health_services", to: "south_canteen_ent", weight: 5, covered: true, accessible: true },

    { from: "hw_w3", to: "hw_sw", weight: 15, covered: true, accessible: true },
    { from: "hw_nw", to: "hw_w1", weight: 8, covered: true, accessible: true },
    { from: "hw_w1", to: "hw_w2", weight: 10, covered: true, accessible: true },
    { from: "hw_w2", to: "hw_w3", weight: 9, covered: true, accessible: true },
    { from: "hw_w4", to: "entry_gate", weight: 7, covered: true, accessible: true },

    { from: "hw_w1", to: "south_female_restroom", weight: 12, covered: true, accessible: true },

    { from: "gymnasium", to: "treasurer_gym_ent", weight: 10, covered: true, accessible: true },
    { from: "gymnasium", to: "registrar_gym_ent", weight: 10, covered: true, accessible: true },
    { from: "treasurer", to: "treasurer_gym_ent", weight: 10, covered: true, accessible: true },
    { from: "registrar", to: "registrar_gym_ent", weight: 10, covered: true, accessible: true },
    { from: "hw_e1", to: "hw_ne", weight: 15, covered: true, accessible: true },
    { from: "hw_se", to: "hw_el", weight: 15, covered: true, accessible: true },
    { from: "north_male_toilet", to: "hw_e1", weight: 16, covered: true, accessible: true },
    { from: "hw_e1", to: "hw_e2", weight: 9, covered: true, accessible: true },
    { from: "hw_e2", to: "hw_el", weight: 7, covered: true, accessible: true },
    { from: "north_toilet", to: "hw_se", weight: 3, covered: true, accessible: true },

    { from: "hw_nwk", to: "hw_el", weight: 10, covered: true, accessible: true },
    { from: "hw_nwk", to: "treasurer", weight: 15, covered: true, accessible: true },
    { from: "hw_nwk", to: "north_student_lounge", weight: 10, covered: true, accessible: true },
    { from: "north_student_lounge", to: "gymnasium", weight: 20, covered: true, accessible: true },
    { from: "south_student_lounge", to: "gymnasium", weight: 20, covered: true, accessible: true },
    { from: "hw_sw", to: "south_student_lounge", weight: 10, covered: true, accessible: true },
    { from: "hw_sw", to: "registrar", weight: 20, covered: true, accessible: true },
    { from: "registrar", to: "treasurer", weight: 9, covered: true, accessible: true },

    { from: "hw_w4", to: "student_parking", weight: 15, covered: true, accessible: true },
    { from: "entry_gate", to: "hw_sw", weight: 17, covered: true, accessible: true },
    { from: "student_parking", to: "hw_nwk_2", weight: 21, covered: true, accessible: true },
    { from: "hw_nwk", to: "hw_nwk_2", weight: 8, covered: true, accessible: true },
    { from: "hw_nwk_2", to: "chapel", weight: 13, covered: true, accessible: true },

    { from: "chapel", to: "exit_gate", weight: 7, covered: false, accessible: true },
  ],
};
