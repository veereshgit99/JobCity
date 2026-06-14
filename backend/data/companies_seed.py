"""Seed list of 20 well-known companies with stable colors."""
COMPANIES_SEED = [
    {"name": "Google", "industry": "Internet", "color": "#4285F4", "hq_city": "Mountain View", "hq_state": "CA", "website": "https://google.com", "logo_url": ""},
    {"name": "Amazon", "industry": "E-commerce", "color": "#FF9900", "hq_city": "Seattle", "hq_state": "WA", "website": "https://amazon.com", "logo_url": ""},
    {"name": "Microsoft", "industry": "Software", "color": "#00A4EF", "hq_city": "Redmond", "hq_state": "WA", "website": "https://microsoft.com", "logo_url": ""},
    {"name": "Meta", "industry": "Social", "color": "#1877F2", "hq_city": "Menlo Park", "hq_state": "CA", "website": "https://meta.com", "logo_url": ""},
    {"name": "Apple", "industry": "Hardware", "color": "#A2AAAD", "hq_city": "Cupertino", "hq_state": "CA", "website": "https://apple.com", "logo_url": ""},
    {"name": "Netflix", "industry": "Media", "color": "#E50914", "hq_city": "Los Angeles", "hq_state": "CA", "website": "https://netflix.com", "logo_url": ""},
    {"name": "Stripe", "industry": "Fintech", "color": "#635BFF", "hq_city": "San Francisco", "hq_state": "CA", "website": "https://stripe.com", "logo_url": ""},
    {"name": "Airbnb", "industry": "Travel", "color": "#FF5A5F", "hq_city": "San Francisco", "hq_state": "CA", "website": "https://airbnb.com", "logo_url": ""},
    {"name": "Uber", "industry": "Mobility", "color": "#000000", "hq_city": "San Francisco", "hq_state": "CA", "website": "https://uber.com", "logo_url": ""},
    {"name": "Salesforce", "industry": "SaaS", "color": "#00A1E0", "hq_city": "San Francisco", "hq_state": "CA", "website": "https://salesforce.com", "logo_url": ""},
    {"name": "Tesla", "industry": "Automotive", "color": "#CC0000", "hq_city": "Austin", "hq_state": "TX", "website": "https://tesla.com", "logo_url": ""},
    {"name": "Nvidia", "industry": "Hardware", "color": "#76B900", "hq_city": "Santa Clara", "hq_state": "CA", "website": "https://nvidia.com", "logo_url": ""},
    {"name": "Adobe", "industry": "Creative SaaS", "color": "#FF0000", "hq_city": "San Jose", "hq_state": "CA", "website": "https://adobe.com", "logo_url": ""},
    {"name": "Atlassian", "industry": "Dev tools", "color": "#0052CC", "hq_city": "San Francisco", "hq_state": "CA", "website": "https://atlassian.com", "logo_url": ""},
    {"name": "Notion", "industry": "Productivity", "color": "#FFFFFF", "hq_city": "San Francisco", "hq_state": "CA", "website": "https://notion.so", "logo_url": ""},
    {"name": "Linear", "industry": "Productivity", "color": "#5E6AD2", "hq_city": "San Francisco", "hq_state": "CA", "website": "https://linear.app", "logo_url": ""},
    {"name": "Vercel", "industry": "Dev tools", "color": "#FFFFFF", "hq_city": "San Francisco", "hq_state": "CA", "website": "https://vercel.com", "logo_url": ""},
    {"name": "Anthropic", "industry": "AI", "color": "#D97757", "hq_city": "San Francisco", "hq_state": "CA", "website": "https://anthropic.com", "logo_url": ""},
    {"name": "OpenAI", "industry": "AI", "color": "#10A37F", "hq_city": "San Francisco", "hq_state": "CA", "website": "https://openai.com", "logo_url": ""},
    {"name": "Databricks", "industry": "Data", "color": "#FF3621", "hq_city": "San Francisco", "hq_state": "CA", "website": "https://databricks.com", "logo_url": ""},
]

JOB_TITLES = [
    "Software Engineer", "Senior Software Engineer", "Staff Software Engineer",
    "Frontend Engineer", "Backend Engineer", "Full Stack Engineer",
    "Mobile Engineer (iOS)", "Mobile Engineer (Android)",
    "Data Engineer", "Machine Learning Engineer", "ML Research Scientist",
    "Site Reliability Engineer", "DevOps Engineer", "Platform Engineer",
    "Security Engineer", "Infrastructure Engineer",
    "Product Manager", "Senior Product Manager", "Technical Program Manager",
    "Product Designer", "UX Designer", "Design Engineer",
    "Engineering Manager", "Director of Engineering",
    "Data Scientist", "Analytics Engineer",
    "Solutions Engineer", "Developer Advocate",
    "QA Engineer", "Game Engineer",
]

JOB_DESCRIPTION_TEMPLATE = (
    "We're hiring a {title} to join our team in {city}, {state}. "
    "You'll work with talented engineers on ambitious problems that scale to millions of users. "
    "Strong fundamentals in software design, communication, and ownership are required. "
    "We offer competitive comp, equity, health benefits, and a flexible schedule."
)

DEMO_APPLICANTS = [
    ("Sam Lee", "Junior Frontend Dev exploring NYC", "entry", "New York", "NY", ["React", "TypeScript", "CSS"], False, 0),
    ("Priya Patel", "Backend engineer | distributed systems", "mid", "Seattle", "WA", ["Go", "Kubernetes", "Postgres"], True, 412),
    ("Marcus Chen", "Staff SWE | infra @ scale", "senior", "San Francisco", "CA", ["Rust", "Kafka", "AWS"], True, 884),
    ("Ava Rodriguez", "Product designer turning ML into UX", "mid", "Austin", "TX", ["Figma", "Prototyping", "Design Systems"], False, 0),
    ("Jordan Kim", "Full-stack dev | indie hacker", "mid", "Los Angeles", "CA", ["Next.js", "Prisma", "tRPC"], True, 211),
    ("Riya Shah", "ML grad researching agents", "entry", "Boston", "MA", ["PyTorch", "LLMs", "RAG"], True, 95),
    ("Diego Alvarez", "EM | building developer tools", "senior", "Denver", "CO", ["Leadership", "Go", "K8s"], False, 0),
    ("Emily Tran", "iOS engineer @ fintech", "mid", "Miami", "FL", ["Swift", "SwiftUI", "Combine"], False, 0),
    ("Noah Williams", "Recent CS grad — first job hunt", "entry", "Atlanta", "GA", ["Java", "Spring", "SQL"], True, 33),
    ("Sofia Martinez", "Data engineer ↔ analytics", "mid", "Chicago", "IL", ["Airflow", "DBT", "Snowflake"], False, 0),
    ("Liam O'Connor", "Security engineer | offensive sec", "senior", "Washington", "DC", ["Pentest", "Cloud Security"], True, 156),
    ("Aiko Tanaka", "Design engineer | bridging code+design", "mid", "Portland", "OR", ["React", "Motion", "WebGL"], True, 320),
    ("Ben Carter", "Game engine programmer", "mid", "San Diego", "CA", ["C++", "Unity", "Shaders"], False, 0),
    ("Chloe Park", "ML PM @ early stage", "mid", "San Francisco", "CA", ["PM", "ML", "Strategy"], False, 0),
    ("Daniel Singh", "DevRel + developer experience", "mid", "New York", "NY", ["Public speaking", "OSS"], True, 70),
    ("Grace Liu", "Senior data scientist | causal inference", "senior", "Minneapolis", "MN", ["Python", "R", "Stats"], False, 0),
    ("Henry Nguyen", "Platform engineer | Kubernetes", "senior", "Seattle", "WA", ["K8s", "Helm", "Terraform"], True, 502),
    ("Isabel Garcia", "QA automation engineer", "mid", "Phoenix", "AZ", ["Playwright", "Cypress", "Jest"], False, 0),
    ("Jasper Nolan", "Backend Rust enthusiast", "entry", "Pittsburgh", "PA", ["Rust", "Axum", "PG"], True, 18),
    ("Kira Yamamoto", "Frontend perf nerd", "senior", "Salt Lake City", "UT", ["React", "Vite", "Perf"], True, 745),
    ("Leo Brown", "TPM | shipping at scale", "senior", "Charlotte", "NC", ["PM", "Agile", "Mentor"], False, 0),
    ("Maya Cohen", "AI research engineer", "mid", "Boston", "MA", ["JAX", "Diffusion", "VLM"], True, 240),
    ("Nico Rossi", "Solutions engineer", "mid", "Dallas", "TX", ["Sales eng", "Demos", "Cloud"], False, 0),
    ("Olivia Davis", "Junior backend dev", "entry", "Columbus", "OH", ["Node", "Express", "Mongo"], False, 0),
    ("Paul Edwards", "Director of Engineering", "senior", "Indianapolis", "IN", ["Leadership", "Architecture"], False, 0),
    ("Quinn Foster", "Mobile dev (Android)", "mid", "Nashville", "TN", ["Kotlin", "Compose"], True, 88),
    ("Rosa Hernandez", "Cloud infra engineer", "senior", "Las Vegas", "NV", ["AWS", "Terraform", "Vault"], True, 410),
    ("Sean McAlister", "Junior data analyst", "entry", "Detroit", "MI", ["SQL", "Tableau", "Python"], False, 0),
    ("Tara Bell", "Senior product designer", "senior", "Raleigh", "NC", ["Design Systems", "Research"], False, 0),
    ("Uma Krishnan", "ML platform engineer", "senior", "St. Louis", "MO", ["MLOps", "Kubeflow"], True, 188),
]
