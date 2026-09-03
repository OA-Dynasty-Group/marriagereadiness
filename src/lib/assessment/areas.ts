import type { AreaDefinition, AreaId } from "./types";

export const AREAS: Record<AreaId, AreaDefinition> = {
  god: {
    id: "god",
    index: 1,
    name: "God's Role in Your Marriage",
    description:
      "Understanding of God's role in marriage, spiritual dependence, covenant, decision-making, and personal spiritual responsibility.",
    measures:
      "Covenant thinking, shared spiritual direction, prayerful discernment, and where responsibility for your own spiritual life sits.",
    healthyReadiness:
      "You see marriage as covenantal, own your own spiritual growth, and expect to seek direction together rather than outsourcing it.",
    strength:
      "You appear to hold a covenantal view of marriage while taking personal responsibility for your own walk with God.",
    growth:
      "There is room to clarify how faith will practically shape decisions, priorities, and direction inside a marriage.",
    priority:
      "Your responses suggest that the relationship between your faith and your future marriage deserves focused reflection.",
    reflectionQuestions: [
      "What does it look like, practically, for a marriage to be centered on God rather than only on happiness?",
      "Whose responsibility is your spiritual growth once you are married?",
      "How would you and a spouse make a decision when you both believe you are being faithful?",
    ],
    exercises: [
      "Write a one-page description of the spiritual culture you hope your future home will have.",
      "Practice a weekly rhythm of prayer and reflection on your own, before expecting to share one.",
    ],
    biblicalReflection:
      "\"Unless the Lord builds the house, those who build it labour in vain.\" — Psalm 127:1",
    resources: [
      "A marriage preparation course led by a trusted spiritual mentor",
      "Journalling practice around discernment and decision-making",
    ],
    discussionQuestion: "How will God's purposes actually shape the decisions we make together?",
    preparationPriority: "Clarify what a God-centered marriage requires of you personally.",
  },
  intimacy: {
    id: "intimacy",
    index: 2,
    name: "Sex & Intimacy",
    description:
      "Expectations about sexual and emotional intimacy, communication, consent, vulnerability, and sustaining intimacy over time.",
    measures:
      "Mutuality, emotional safety, willingness to communicate about intimacy, and the ability to separate intimacy from performance.",
    healthyReadiness:
      "You treat intimacy as something built through communication, consent, safety, and ongoing attention rather than something automatic.",
    strength:
      "You appear to understand intimacy as mutual, communicative, and rooted in emotional safety.",
    growth:
      "There is room to grow in comfort discussing intimacy directly and in expectations about desire and difference.",
    priority:
      "Your responses suggest expectations around intimacy that would benefit from honest exploration before marriage.",
    reflectionQuestions: [
      "How comfortable are you talking about intimacy without embarrassment or pressure?",
      "What do you currently believe marriage will resolve for you?",
      "What would you do if you and a spouse had very different levels of desire?",
    ],
    exercises: [
      "Write down what you believe about consent, desire, and mutuality inside marriage.",
      "Identify one insecurity you are carrying and name who could help you work through it.",
    ],
    biblicalReflection:
      "\"Let each of you look not only to your own interests, but also to the interests of others.\" — Philippians 2:4",
    resources: [
      "Marriage preparation counselling with a licensed therapist",
      "Reputable education on intimacy, consent, and communication",
    ],
    discussionQuestion: "How will we talk about intimacy when it becomes difficult or disappointing?",
    preparationPriority: "Clarify your expectations around sexual and emotional intimacy.",
  },
  thirdParty: {
    id: "thirdParty",
    index: 3,
    name: "Third Party",
    description:
      "Boundaries involving parents, siblings, friends, ex-partners, coworkers, children from previous relationships, and religious leaders.",
    measures:
      "Boundary clarity, loyalty ordering, privacy, and the ability to hold a marital boundary without disrespecting family.",
    healthyReadiness:
      "You expect your marriage to be the primary human relationship while maintaining respectful, non-controlling ties with family and friends.",
    strength:
      "You appear able to protect marital boundaries while keeping family relationships respectful and warm.",
    growth:
      "There is room to define where family influence ends and marital decision-making begins.",
    priority:
      "Your responses suggest that outside influence in your future marriage needs deliberate boundary work.",
    reflectionQuestions: [
      "Who currently has the most influence over your major decisions, and will that change?",
      "What would you say to someone you love who crossed a marital boundary?",
      "What should stay private between you and a spouse?",
    ],
    exercises: [
      "Draft the three boundaries you would want in place with extended family from day one.",
      "Practice one respectful boundary sentence out loud until it feels natural.",
    ],
    biblicalReflection:
      "\"Therefore a man shall leave his father and his mother and hold fast to his wife.\" — Genesis 2:24",
    resources: [
      "Reading on healthy boundaries in family systems",
      "Mentoring from a couple who navigate extended family well",
    ],
    discussionQuestion: "How involved should our families be in our marriage and our decisions?",
    preparationPriority: "Explore expectations around extended family and outside influence.",
  },
  money: {
    id: "money",
    index: 4,
    name: "Money",
    description:
      "Financial responsibility, transparency, earning, spending, saving, debt, generosity, roles, and decision-making.",
    measures:
      "Transparency, shared decision-making, separation of income from authority, and readiness for detailed financial conversation.",
    healthyReadiness:
      "You expect full transparency and shared decision-making regardless of who earns more.",
    strength:
      "You appear to treat money as a shared responsibility built on transparency rather than leverage.",
    growth:
      "There is room to develop a clearer financial philosophy and more practice discussing numbers directly.",
    priority:
      "Your responses suggest financial expectations that could create friction unless examined early.",
    reflectionQuestions: [
      "What does financial partnership actually look like day to day?",
      "How will you separate financial contribution from decision-making authority?",
      "What financial obligations outside the marriage will you carry?",
    ],
    exercises: [
      "Write your own financial summary: income, debt, savings, giving, obligations.",
      "Define your top three financial values and where they came from.",
    ],
    biblicalReflection:
      "\"Whoever is faithful in little is also faithful in much.\" — Luke 16:10",
    resources: [
      "A simple household budgeting framework",
      "Financial coaching or pre-marital financial counselling",
    ],
    discussionQuestion: "What does financial partnership look like to you?",
    preparationPriority: "Clarify your financial philosophy and practise talking about numbers.",
  },
  location: {
    id: "location",
    index: 5,
    name: "Location",
    description:
      "Where to live, career mobility, relocation, proximity to family, community, lifestyle, and major geographic decisions.",
    measures:
      "Shared decision-making about place, flexibility, and awareness of the needs beneath a location preference.",
    healthyReadiness:
      "You treat where you live as a joint decision shaped by both people's needs and a shared future.",
    strength:
      "You appear willing to weigh both people's needs before deciding where life happens.",
    growth:
      "There is room to clarify your own non-negotiables about place, proximity, and mobility.",
    priority:
      "Your responses suggest location expectations that could become a significant point of conflict.",
    reflectionQuestions: [
      "What need sits underneath your preferred location — safety, family, career, community?",
      "What would you be willing to relocate for?",
      "Whose career takes priority if you cannot both have your preferred city?",
    ],
    exercises: [
      "List your top five criteria for where you would raise a family, ranked.",
      "Name one location assumption you have never questioned.",
    ],
    biblicalReflection:
      "\"Where you go I will go, and where you lodge I will lodge.\" — Ruth 1:16",
    resources: [
      "A written relocation values exercise",
      "Conversation with a couple who has relocated for marriage",
    ],
    discussionQuestion:
      "Whose career should take priority if we cannot both pursue our preferred location?",
    preparationPriority: "Name your location non-negotiables and the needs behind them.",
  },
  children: {
    id: "children",
    index: 6,
    name: "Children & Parenting",
    description:
      "Desire for children, timing, fertility realities, adoption, parenting philosophy, discipline, education, and shared responsibility.",
    measures:
      "Willingness to discuss parenting early, flexibility about the path to parenthood, and shared parenting principles.",
    healthyReadiness:
      "You expect to discuss children explicitly, hold the path to parenthood with open hands, and parent from shared principles.",
    strength:
      "You appear ready to approach parenting as a shared philosophy rather than an assumption.",
    growth:
      "There is room to examine inherited parenting assumptions and the possibility of a different path to parenthood.",
    priority:
      "Your responses suggest parenting expectations that need honest examination before marriage.",
    reflectionQuestions: [
      "What happens if the path to parenthood looks different from what you imagine?",
      "Which parts of how you were raised do you want to repeat, and which not?",
      "How will you handle a serious parenting disagreement?",
    ],
    exercises: [
      "Write your parenting values in five sentences.",
      "List the parenting topics you have never discussed with anyone.",
    ],
    biblicalReflection:
      "\"Train up a child in the way he should go.\" — Proverbs 22:6",
    resources: [
      "Reading on parenting philosophies and discipline approaches",
      "Honest conversation with parents you respect",
    ],
    discussionQuestion: "What happens if our expectations about having children change?",
    preparationPriority: "Examine your parenting assumptions and the paths to parenthood.",
  },
  vision: {
    id: "vision",
    index: 7,
    name: "Vision & Purpose",
    description:
      "Life direction, shared purpose, values, ambition, calling, lifestyle, service, and legacy.",
    measures:
      "Whether marriage is understood as a shared life being built rather than romantic companionship alone.",
    healthyReadiness:
      "You can distinguish personal ambition from shared vision and want both to be developed.",
    strength:
      "You appear to see marriage as building something together that is larger than the relationship itself.",
    growth:
      "There is room to sharpen your own sense of direction so a shared vision has something to join.",
    priority:
      "Your responses suggest your life direction is still forming, which makes shared vision harder to define.",
    reflectionQuestions: [
      "What are you building, and would it survive contact with another person's plans?",
      "Where does your ambition end and shared vision begin?",
      "What would you want said about your marriage in thirty years?",
    ],
    exercises: [
      "Write a one-paragraph description of the life you hope to build.",
      "Separate your goals into 'mine', 'ours', and 'negotiable'.",
    ],
    biblicalReflection:
      "\"Where there is no vision, the people perish.\" — Proverbs 29:18",
    resources: [
      "A personal purpose and values workbook",
      "Annual life-planning practice",
    ],
    discussionQuestion: "What are we building together beyond the relationship itself?",
    preparationPriority: "Clarify your own direction before merging it with someone else's.",
  },
  growth: {
    id: "growth",
    index: 8,
    name: "Growth",
    description:
      "Self-awareness, emotional maturity, accountability, adaptability, feedback, and willingness to change.",
    measures:
      "Humility, openness to feedback, ownership of your own development, and the ability to apologise.",
    healthyReadiness:
      "You can hear difficult feedback, own your part, and change a habit that harms someone you love.",
    strength:
      "You demonstrate a strong willingness to learn, receive feedback, take responsibility, and keep developing.",
    growth:
      "There is room to practise receiving feedback without explaining, defending, or withdrawing.",
    priority:
      "Your responses suggest that openness to feedback and personal change deserves priority attention.",
    reflectionQuestions: [
      "What is the last significant thing you changed about yourself because of feedback?",
      "What is your first instinct when someone says you hurt them?",
      "What would your closest friend say you are blind to?",
    ],
    exercises: [
      "Ask two trusted people what it is like to disagree with you. Only listen.",
      "Practise a sincere apology that contains no explanation.",
    ],
    biblicalReflection:
      "\"Let the wise hear and increase in learning.\" — Proverbs 1:5",
    resources: [
      "Individual counselling or coaching",
      "A feedback journal kept over one month",
    ],
    discussionQuestion: "How do you want me to bring something up when you have hurt me?",
    preparationPriority: "Practise receiving hard feedback without defending yourself.",
  },
  faith: {
    id: "faith",
    index: 9,
    name: "Faith & Religion",
    description:
      "Religious identity, compatibility, spiritual practice, denominational difference, worship, community, and expectations.",
    measures:
      "Realism about religious compatibility and willingness to examine differences before marriage rather than after.",
    healthyReadiness:
      "You can name where genuine agreement and disagreement exist and you do not assume love will resolve conviction.",
    strength:
      "You appear realistic about how religious difference affects values, children, and daily life.",
    growth:
      "There is room to examine specific religious differences rather than trusting they will resolve themselves.",
    priority:
      "Your responses suggest religious compatibility may be underestimated and needs deliberate exploration.",
    reflectionQuestions: [
      "Which faith convictions are genuinely non-negotiable for you?",
      "How will you worship, give, and raise children?",
      "What would you do if a spouse's practice changed after marriage?",
    ],
    exercises: [
      "List your convictions in three columns: essential, preference, open.",
      "Visit a different faith community and notice your own reactions.",
    ],
    biblicalReflection:
      "\"Can two walk together, unless they are agreed?\" — Amos 3:3",
    resources: [
      "Pre-marital conversation guide on faith practice",
      "Guidance from a leader in your own tradition",
    ],
    discussionQuestion: "How will we practise and express our faith together?",
    preparationPriority: "Name your essential faith convictions and test them honestly.",
  },
  conflict: {
    id: "conflict",
    index: 10,
    name: "Conflict Resolution",
    description:
      "Disagreement, emotional regulation, listening, repair, forgiveness, accountability, compromise, and resilience.",
    measures:
      "What you actually do when emotions are high: pursue, withdraw, escalate, regulate, or repair.",
    healthyReadiness:
      "You can take space without punishing, return to hard conversations, apologise, and forgive while keeping accountability.",
    strength:
      "You appear able to regulate, return, and repair rather than escalate or disappear.",
    growth:
      "There is room to develop repair habits so difficult conversations do not stall out.",
    priority:
      "Your responses suggest that conflict instincts under pressure need real attention before marriage.",
    reflectionQuestions: [
      "What do you do in the first ten minutes of being hurt?",
      "What does silence mean when you use it?",
      "What should you both do when neither of you feels understood?",
    ],
    exercises: [
      "Write your conflict pattern: trigger, instinct, cost, better alternative.",
      "Practise repeating someone's position back before responding.",
    ],
    biblicalReflection:
      "\"Be angry and do not sin; do not let the sun go down on your anger.\" — Ephesians 4:26",
    resources: [
      "Communication skills workshop or counselling",
      "Reading on repair attempts and emotional regulation",
    ],
    discussionQuestion: "What should we do when neither of us feels understood?",
    preparationPriority: "Learn to have difficult conversations without escalating or withdrawing.",
  },
};

export const AREA_ORDER: AreaId[] = [
  "god",
  "intimacy",
  "thirdParty",
  "money",
  "location",
  "children",
  "vision",
  "growth",
  "faith",
  "conflict",
];

export const CONSTRUCT_LABELS = {
  selfAwareness: "Self-Awareness",
  expectationRealism: "Expectation Realism",
  partnershipMindset: "Partnership Mindset",
  relationalCapacity: "Relational Capacity",
  growthReadiness: "Growth Readiness",
} as const;

export const CONSTRUCT_DESCRIPTIONS = {
  selfAwareness:
    "Recognising your strengths, weaknesses, emotional patterns, and your own contribution to conflict.",
  expectationRealism:
    "Holding realistic expectations of marriage, a spouse, intimacy, money, family, and happiness.",
  partnershipMindset:
    "Moving from \"what will my spouse do for me?\" to \"what are we going to build together?\"",
  relationalCapacity:
    "Communication, listening, emotional regulation, accountability, forgiveness, and boundaries.",
  growthReadiness:
    "Humility, openness to feedback, willingness to change, and willingness to seek help.",
} as const;
