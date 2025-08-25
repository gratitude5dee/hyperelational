├── README.md
├── app
    ├── api
    │   └── vision
    │   │   └── route.ts
    ├── booking-agent
    │   ├── page.tsx
    │   ├── page_new.tsx
    │   └── page_old.tsx
    ├── globals.css
    ├── interactive-agent
    │   └── page.tsx
    ├── layout.tsx
    ├── page.tsx
    ├── voice-agent-original
    │   ├── page.tsx
    │   └── secure-vision.ts
    └── voice-agent
    │   ├── page.tsx
    │   ├── page_new.tsx
    │   ├── page_old.tsx
    │   └── secure-vision.ts
├── next-env.d.ts
├── next.config.ts
├── node_modules
    ├── @alloc
    │   └── quick-lru
    │   │   ├── index.d.ts
    │   │   ├── index.js
    │   │   ├── license
    │   │   ├── package.json
    │   │   └── readme.md
    └── @ampproject
    │   └── remapping
    │       ├── LICENSE
    │       ├── README.md
    │       ├── dist
    │           ├── remapping.mjs
    │           ├── remapping.mjs.map
    │           ├── remapping.umd.js
    │           ├── remapping.umd.js.map
    │           └── types
    │           │   ├── build-source-map-tree.d.ts
    │           │   ├── remapping.d.ts
    │           │   ├── source-map-tree.d.ts
    │           │   ├── source-map.d.ts
    │           │   └── types.d.ts
    │       └── package.json
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── vercel.json


/README.md:
--------------------------------------------------------------------------------
 1 | This is an **OpenAI Vision Live Clone** - a [Next.js](https://nextjs.org) project that combines real-time voice AI with computer vision capabilities, using OpenAI's Vision API for image analysis.
 2 | 
 3 | ## Features
 4 | 
 5 | - 🎥 **Real-time camera capture** from user's webcam
 6 | - 🗣️ **Voice conversations** using Vapi AI
 7 | - 👁️ **Computer vision analysis** using OpenAI's GPT-4 Vision
 8 | - 🔄 **Multimodal AI interaction** - the AI can see what you're showing and talk about it
 9 | 
10 | ## Setup
11 | 
12 | ### 1. Environment Variables
13 | 
14 | Create a `.env.local` file in the root directory with:
15 | 
16 | ```env
17 | # Vapi AI Configuration
18 | NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here
19 | NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
20 | 
21 | # OpenAI API Configuration (server-side only for security)
22 | OPENAI_API_KEY=your_openai_api_key_here
23 | ```
24 | 
25 | ### 2. Get API Keys
26 | 
27 | - **Vapi AI**: Sign up at [vapi.ai](https://vapi.ai) and get your public key and assistant ID
28 | - **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
29 | 
30 | ### 3. Install Dependencies
31 | 
32 | ```bash
33 | npm install
34 | ```
35 | 
36 | ## Getting Started
37 | 
38 | Run the development server:
39 | 
40 | ```bash
41 | npm run dev
42 | # or
43 | yarn dev
44 | # or
45 | pnpm dev
46 | # or
47 | bun dev
48 | ```
49 | 
50 | Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
51 | 
52 | ## How to Use
53 | 
54 | 1. **Allow camera access** when prompted by your browser
55 | 2. **Click "Start Voice"** to begin the voice conversation with the AI
56 | 3. **Click "Analyze Frame"** to manually ask the AI what it sees in your camera
57 | 4. **Talk naturally** - the AI will automatically see what you're showing and can discuss it
58 | 
59 | The AI will automatically analyze your camera feed every few seconds and use that visual context in your conversation.
60 | 
61 | ## Technical Details
62 | 
63 | - **Camera capture**: 320x240 resolution at ~1 FPS for vision analysis
64 | - **Vision processing**: OpenAI GPT-4 Vision with smart throttling to avoid rate limits
65 | - **Voice AI**: Vapi.ai for real-time voice conversations
66 | - **Integration**: Vision descriptions are injected into the conversation context using Vapi's add-message feature
67 | 
68 | ## Learn More
69 | 
70 | To learn more about Next.js, take a look at the following resources:
71 | 
72 | - [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
73 | - [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
74 | 
75 | You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
76 | 
77 | ## Deploy on Vercel
78 | 
79 | The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
80 | 
81 | Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
82 | 


--------------------------------------------------------------------------------
/app/api/vision/route.ts:
--------------------------------------------------------------------------------
  1 | import { GoogleGenerativeAI } from "@google/generative-ai";
  2 | import { NextRequest, NextResponse } from "next/server";
  3 | 
  4 | const VISION_PROMPT = `You generate clear, detailed descriptions of what's visible in a camera image for a voice agent.
  5 | Be specific and descriptive.
  6 | Transcribe all visible text, code, or handwritten content exactly as it appears.
  7 | Mention notable objects, people, screens, diagrams, product labels, and relevant details.
  8 | Use 1–3 sentences.
  9 | Do not mention photos, images, or cameras—just describe what is present.
 10 | 
 11 | Examples:
 12 | "A person holds a book titled 'Clean Code' by Robert Martin. The cover says: 'A Handbook of Agile Software Craftsmanship.'"
 13 | "A whiteboard with handwritten text: 'E = mc^2' and a diagram of an atom."
 14 | "Three people sit at a table. Two use MacBook laptops; one holds a coffee cup."
 15 | 
 16 | No opinions or commentary—only clear, factual, and descriptive summaries.`;
 17 | 
 18 | const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
 19 | const model = genAI.getGenerativeModel({ 
 20 |   model: "gemini-2.5-flash-lite",
 21 |   generationConfig: {
 22 |     maxOutputTokens: 150,
 23 |     temperature: 0.2,
 24 |     topP: 0.8,
 25 |   }
 26 | });
 27 | 
 28 | let lastRequestTime = 0;
 29 | const MIN_REQUEST_INTERVAL = 3000;
 30 | 
 31 | export async function POST(request: NextRequest) {
 32 |   try {
 33 |     const now = Date.now();
 34 |     const timeSinceLastRequest = now - lastRequestTime;
 35 |     
 36 |     if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
 37 |       const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
 38 |       return NextResponse.json(
 39 |         { 
 40 |           error: "Rate limited", 
 41 |           retryAfter: Math.ceil(waitTime / 1000),
 42 |           message: `Please wait ${Math.ceil(waitTime / 1000)} seconds before next request`
 43 |         },
 44 |         { status: 429 }
 45 |       );
 46 |     }
 47 | 
 48 |     const { imageBase64, userPrompt } = await request.json();
 49 | 
 50 |     if (!imageBase64) {
 51 |       return NextResponse.json(
 52 |         { error: "Image data is required" },
 53 |         { status: 400 }
 54 |       );
 55 |     }
 56 | 
 57 |     console.log('Processing screen capture analysis...');
 58 |     console.log('Image data length:', imageBase64.length);
 59 |     console.log('User prompt provided:', !!userPrompt);
 60 | 
 61 |     lastRequestTime = now;
 62 | 
 63 |     const prompt = userPrompt || VISION_PROMPT;
 64 |     console.log('Using prompt:', prompt.substring(0, 100) + '...');
 65 | 
 66 |     const result = await model.generateContent([
 67 |       prompt,
 68 |       {
 69 |         inlineData: {
 70 |           data: imageBase64,
 71 |           mimeType: "image/jpeg"
 72 |         }
 73 |       }
 74 |     ]);
 75 | 
 76 |     const description = result.response.text();
 77 |     console.log('Screen analysis result:', description.substring(0, 100) + '...');
 78 | 
 79 |     return NextResponse.json({
 80 |       description,
 81 |       timestamp: Date.now(),
 82 |       success: true
 83 |     });
 84 | 
 85 |   } catch (error: any) {
 86 |     console.error('Vision API error:', error);
 87 |     
 88 |     if (error.status === 429) {
 89 |       return NextResponse.json(
 90 |         { 
 91 |           error: "API quota exceeded", 
 92 |           retryAfter: 60,
 93 |           message: "Gemini API quota exceeded. Please wait 60 seconds.",
 94 |           details: "Consider upgrading your API plan for higher limits"
 95 |         },
 96 |         { status: 429 }
 97 |       );
 98 |     }
 99 |     
100 |     return NextResponse.json(
101 |       { error: "Failed to process image", details: error instanceof Error ? error.message : "Unknown error" },
102 |       { status: 500 }
103 |     );
104 |   }
105 | } 


--------------------------------------------------------------------------------
/app/booking-agent/page.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | import React from 'react';
  3 | import Link from 'next/link';
  4 | 
  5 | export default function BookingAgentPage() {
  6 |   return (
  7 |     <div className="min-h-screen bg-gray-500 text-white" style={{ fontFamily: 'monospace, Courier, "Courier New"' }}>
  8 |       {/* Desktop Background Pattern */}
  9 |       <div className="min-h-screen bg-gray-500 p-8" style={{
 10 |         backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23404040' fill-opacity='0.1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`
 11 |       }}>
 12 |         
 13 |         {/* Main Application Window */}
 14 |         <div className="max-w-5xl mx-auto">
 15 |           <div className="bg-gray-300 border-4 border-gray-600" style={{
 16 |             borderStyle: 'outset',
 17 |             borderTopColor: '#ffffff',
 18 |             borderLeftColor: '#ffffff', 
 19 |             borderRightColor: '#404040',
 20 |             borderBottomColor: '#404040'
 21 |           }}>
 22 |             
 23 |             {/* Window Title Bar */}
 24 |             <div className="bg-red-600 px-2 py-1 flex items-center justify-between border-b-2 border-black">
 25 |               <div className="flex items-center space-x-2">
 26 |                 <div className="text-white font-bold text-sm tracking-wider">
 27 |                   📅 BOOKING.EXE - BOOK THE COMIC
 28 |                 </div>
 29 |               </div>
 30 |               <div className="flex space-x-1">
 31 |                 <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-gray-300"
 32 |                         style={{
 33 |                           borderStyle: 'outset',
 34 |                           borderTopColor: '#ffffff',
 35 |                           borderLeftColor: '#ffffff',
 36 |                           borderRightColor: '#404040', 
 37 |                           borderBottomColor: '#404040'
 38 |                         }}>
 39 |                   _
 40 |                 </button>
 41 |                 <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-gray-300"
 42 |                         style={{
 43 |                           borderStyle: 'outset',
 44 |                           borderTopColor: '#ffffff',
 45 |                           borderLeftColor: '#ffffff',
 46 |                           borderRightColor: '#404040',
 47 |                           borderBottomColor: '#404040'
 48 |                         }}>
 49 |                   □
 50 |                 </button>
 51 |                 <Link href="/">
 52 |                   <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-red-500"
 53 |                           style={{
 54 |                             borderStyle: 'outset',
 55 |                             borderTopColor: '#ffffff',
 56 |                             borderLeftColor: '#ffffff',
 57 |                             borderRightColor: '#404040',
 58 |                             borderBottomColor: '#404040'
 59 |                           }}>
 60 |                     ×
 61 |                   </button>
 62 |                 </Link>
 63 |               </div>
 64 |             </div>
 65 | 
 66 |             {/* Window Content */}
 67 |             <div className="p-8 bg-black">
 68 |               {/* Header */}
 69 |               <div className="border-2 border-red-600 p-6 mb-8 bg-black">
 70 |                 <div className="text-center">
 71 |                   <div className="text-red-600 text-5xl font-bold mb-4 tracking-wider">
 72 |                     BOOK THE COMIC
 73 |                   </div>
 74 |                   <div className="bg-red-600 text-black px-4 py-2 inline-block font-bold text-sm mb-4">
 75 |                     [LINDY-POWERED SCHEDULING • GREEN M&MS INCLUDED]
 76 |                   </div>
 77 |                   <div className="text-white text-lg font-mono max-w-3xl mx-auto">
 78 |                     &gt; AUTOMATED BOOKING AGENT
 79 |                     <br />
 80 |                     &gt; HANDLES RIDERS, SCHEDULES, NEGOTIATIONS  
 81 |                     <br />
 82 |                     &gt; NO HUMAN INTERVENTION REQUIRED
 83 |                   </div>
 84 |                 </div>
 85 |               </div>
 86 | 
 87 |               {/* Coming Soon Notice */}
 88 |               <div className="border-4 border-red-600 p-8 mb-8 bg-black text-center">
 89 |                 <div className="text-red-600 text-4xl font-bold mb-4">
 90 |                   [SYSTEM INITIALIZING...]
 91 |                 </div>
 92 |                 <div className="text-white text-xl font-mono mb-6">
 93 |                   BOOKING AGENT CURRENTLY IN DEVELOPMENT
 94 |                   <br />
 95 |                   STAND BY FOR AUTOMATED COMEDY SCHEDULING
 96 |                 </div>
 97 |                 <div className="bg-black border-2 border-red-600 text-red-600 px-6 py-3 inline-block text-lg font-bold">
 98 |                   [COMING SOON]
 99 |                 </div>
100 |               </div>
101 | 
102 |               {/* Features Grid */}
103 |               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
104 |                 
105 |                 <div className="border-2 border-red-600 p-6 bg-black">
106 |                   <div className="text-center">
107 |                     <div className="text-4xl mb-4">📅</div>
108 |                     <div className="text-red-600 font-bold text-xl mb-4">SMART SCHEDULING</div>
109 |                     <div className="text-sm font-mono text-white">
110 |                       LINDY AI HANDLES THE BACK-AND-FORTH
111 |                       <br />
112 |                       FINDS TIME SLOTS THAT WORK
113 |                       <br />
114 |                       NO MORE EMAIL PING-PONG
115 |                     </div>
116 |                   </div>
117 |                 </div>
118 | 
119 |                 <div className="border-2 border-red-600 p-6 bg-black">
120 |                   <div className="text-center">
121 |                     <div className="text-4xl mb-4">🤝</div>
122 |                     <div className="text-red-600 font-bold text-xl mb-4">CONTRACT NEGOTIATION</div>
123 |                     <div className="text-sm font-mono text-white">
124 |                       AUTOMATICALLY HANDLES RIDERS
125 |                       <br />
126 |                       NEGOTIATES RATES & TERMS
127 |                       <br />
128 |                       ENSURES GREEN M&MS CLAUSE
129 |                     </div>
130 |                   </div>
131 |                 </div>
132 | 
133 |                 <div className="border-2 border-red-600 p-6 bg-black">
134 |                   <div className="text-center">
135 |                     <div className="text-4xl mb-4">⏰</div>
136 |                     <div className="text-red-600 font-bold text-xl mb-4">24/7 AVAILABILITY</div>
137 |                     <div className="text-sm font-mono text-white">
138 |                       RESPONDS TO INQUIRIES INSTANTLY
139 |                       <br />
140 |                       HANDLES MULTIPLE TIMEZONES
141 |                       <br />
142 |                       NEVER SLEEPS, NEVER EATS
143 |                     </div>
144 |                   </div>
145 |                 </div>
146 | 
147 |                 <div className="border-2 border-red-600 p-6 bg-black">
148 |                   <div className="text-center">
149 |                     <div className="text-4xl mb-4">🛡️</div>
150 |                     <div className="text-red-600 font-bold text-xl mb-4">HR-COMPLIANT</div>
151 |                     <div className="text-sm font-mono text-white">
152 |                       AUTOMATIC CONTENT FILTERING
153 |                       <br />
154 |                       CORPORATE-FRIENDLY ROASTS
155 |                       <br />
156 |                       ZERO LAWSUITS GUARANTEED*
157 |                     </div>
158 |                   </div>
159 |                 </div>
160 | 
161 |               </div>
162 | 
163 |               {/* Quote Section */}
164 |               <div className="border-4 border-red-600 p-6 mb-8 bg-black">
165 |                 <div className="text-center">
166 |                   <div className="text-2xl md:text-3xl font-bold text-red-600 mb-4">
167 |                     "FINALLY, A BOOKING AGENT THAT DOESN'T TAKE 20%
168 |                   </div>
169 |                   <div className="text-2xl md:text-3xl font-bold text-white mb-4">
170 |                     AND ACTUALLY RETURNS CALLS."
171 |                   </div>
172 |                   <div className="text-sm font-mono text-white">
173 |                     &gt; AUTOMATED SCHEDULING • RIDER MANAGEMENT • TALENT COORDINATION
174 |                     <br />
175 |                     &gt; ALL THE EFFICIENCY, NONE OF THE ATTITUDE
176 |                   </div>
177 |                 </div>
178 |               </div>
179 | 
180 |               {/* Back Button */}
181 |               <div className="text-center">
182 |                 <Link href="/">
183 |                   <div className="border-4 border-red-600 bg-black hover:bg-red-600 hover:text-black transition-colors duration-150 px-8 py-4 inline-block">
184 |                     <div className="font-bold text-xl">
185 |                       ← BACK TO MAIN PROGRAM
186 |                     </div>
187 |                   </div>
188 |                 </Link>
189 |               </div>
190 | 
191 |               {/* Footer */}
192 |               <div className="mt-8 text-center">
193 |                 <div className="text-xs font-mono text-red-600">
194 |                   * LEGAL DISCLAIMER: WE'RE NOT LAWYERS, JUST COMEDIANS WITH AI
195 |                 </div>
196 |               </div>
197 |             </div>
198 |           </div>
199 |         </div>
200 |       </div>
201 |     </div>
202 |   );
203 | }
204 | 


--------------------------------------------------------------------------------
/app/booking-agent/page_new.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | import React from 'react';
  3 | import Link from 'next/link';
  4 | 
  5 | export default function BookingAgentPage() {
  6 |   return (
  7 |     <div className="min-h-screen bg-gray-500 text-white" style={{ fontFamily: 'monospace, Courier, "Courier New"' }}>
  8 |       {/* Desktop Background Pattern */}
  9 |       <div className="min-h-screen bg-gray-500 p-8" style={{
 10 |         backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23404040' fill-opacity='0.1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`
 11 |       }}>
 12 |         
 13 |         {/* Main Application Window */}
 14 |         <div className="max-w-5xl mx-auto">
 15 |           <div className="bg-gray-300 border-4 border-gray-600" style={{
 16 |             borderStyle: 'outset',
 17 |             borderTopColor: '#ffffff',
 18 |             borderLeftColor: '#ffffff', 
 19 |             borderRightColor: '#404040',
 20 |             borderBottomColor: '#404040'
 21 |           }}>
 22 |             
 23 |             {/* Window Title Bar */}
 24 |             <div className="bg-red-600 px-2 py-1 flex items-center justify-between border-b-2 border-black">
 25 |               <div className="flex items-center space-x-2">
 26 |                 <div className="text-white font-bold text-sm tracking-wider">
 27 |                   📅 BOOKING.EXE - BOOK THE COMIC
 28 |                 </div>
 29 |               </div>
 30 |               <div className="flex space-x-1">
 31 |                 <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-gray-300"
 32 |                         style={{
 33 |                           borderStyle: 'outset',
 34 |                           borderTopColor: '#ffffff',
 35 |                           borderLeftColor: '#ffffff',
 36 |                           borderRightColor: '#404040', 
 37 |                           borderBottomColor: '#404040'
 38 |                         }}>
 39 |                   _
 40 |                 </button>
 41 |                 <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-gray-300"
 42 |                         style={{
 43 |                           borderStyle: 'outset',
 44 |                           borderTopColor: '#ffffff',
 45 |                           borderLeftColor: '#ffffff',
 46 |                           borderRightColor: '#404040',
 47 |                           borderBottomColor: '#404040'
 48 |                         }}>
 49 |                   □
 50 |                 </button>
 51 |                 <Link href="/">
 52 |                   <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-red-500"
 53 |                           style={{
 54 |                             borderStyle: 'outset',
 55 |                             borderTopColor: '#ffffff',
 56 |                             borderLeftColor: '#ffffff',
 57 |                             borderRightColor: '#404040',
 58 |                             borderBottomColor: '#404040'
 59 |                           }}>
 60 |                     ×
 61 |                   </button>
 62 |                 </Link>
 63 |               </div>
 64 |             </div>
 65 | 
 66 |             {/* Window Content */}
 67 |             <div className="p-8 bg-black">
 68 |               {/* Header */}
 69 |               <div className="border-2 border-red-600 p-6 mb-8 bg-black">
 70 |                 <div className="text-center">
 71 |                   <div className="text-red-600 text-5xl font-bold mb-4 tracking-wider">
 72 |                     BOOK THE COMIC
 73 |                   </div>
 74 |                   <div className="bg-red-600 text-black px-4 py-2 inline-block font-bold text-sm mb-4">
 75 |                     [LINDY-POWERED SCHEDULING • GREEN M&MS INCLUDED]
 76 |                   </div>
 77 |                   <div className="text-white text-lg font-mono max-w-3xl mx-auto">
 78 |                     &gt; AUTOMATED BOOKING AGENT
 79 |                     <br />
 80 |                     &gt; HANDLES RIDERS, SCHEDULES, NEGOTIATIONS  
 81 |                     <br />
 82 |                     &gt; NO HUMAN INTERVENTION REQUIRED
 83 |                   </div>
 84 |                 </div>
 85 |               </div>
 86 | 
 87 |               {/* Coming Soon Notice */}
 88 |               <div className="border-4 border-red-600 p-8 mb-8 bg-black text-center">
 89 |                 <div className="text-red-600 text-4xl font-bold mb-4">
 90 |                   [SYSTEM INITIALIZING...]
 91 |                 </div>
 92 |                 <div className="text-white text-xl font-mono mb-6">
 93 |                   BOOKING AGENT CURRENTLY IN DEVELOPMENT
 94 |                   <br />
 95 |                   STAND BY FOR AUTOMATED COMEDY SCHEDULING
 96 |                 </div>
 97 |                 <div className="bg-black border-2 border-red-600 text-red-600 px-6 py-3 inline-block text-lg font-bold">
 98 |                   [COMING SOON]
 99 |                 </div>
100 |               </div>
101 | 
102 |               {/* Features Grid */}
103 |               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
104 |                 
105 |                 <div className="border-2 border-red-600 p-6 bg-black">
106 |                   <div className="text-center">
107 |                     <div className="text-4xl mb-4">📅</div>
108 |                     <div className="text-red-600 font-bold text-xl mb-4">SMART SCHEDULING</div>
109 |                     <div className="text-sm font-mono text-white">
110 |                       LINDY AI HANDLES THE BACK-AND-FORTH
111 |                       <br />
112 |                       FINDS TIME SLOTS THAT WORK
113 |                       <br />
114 |                       NO MORE EMAIL PING-PONG
115 |                     </div>
116 |                   </div>
117 |                 </div>
118 | 
119 |                 <div className="border-2 border-red-600 p-6 bg-black">
120 |                   <div className="text-center">
121 |                     <div className="text-4xl mb-4">🤝</div>
122 |                     <div className="text-red-600 font-bold text-xl mb-4">CONTRACT NEGOTIATION</div>
123 |                     <div className="text-sm font-mono text-white">
124 |                       AUTOMATICALLY HANDLES RIDERS
125 |                       <br />
126 |                       NEGOTIATES RATES & TERMS
127 |                       <br />
128 |                       ENSURES GREEN M&MS CLAUSE
129 |                     </div>
130 |                   </div>
131 |                 </div>
132 | 
133 |                 <div className="border-2 border-red-600 p-6 bg-black">
134 |                   <div className="text-center">
135 |                     <div className="text-4xl mb-4">⏰</div>
136 |                     <div className="text-red-600 font-bold text-xl mb-4">24/7 AVAILABILITY</div>
137 |                     <div className="text-sm font-mono text-white">
138 |                       RESPONDS TO INQUIRIES INSTANTLY
139 |                       <br />
140 |                       HANDLES MULTIPLE TIMEZONES
141 |                       <br />
142 |                       NEVER SLEEPS, NEVER EATS
143 |                     </div>
144 |                   </div>
145 |                 </div>
146 | 
147 |                 <div className="border-2 border-red-600 p-6 bg-black">
148 |                   <div className="text-center">
149 |                     <div className="text-4xl mb-4">🛡️</div>
150 |                     <div className="text-red-600 font-bold text-xl mb-4">HR-COMPLIANT</div>
151 |                     <div className="text-sm font-mono text-white">
152 |                       AUTOMATIC CONTENT FILTERING
153 |                       <br />
154 |                       CORPORATE-FRIENDLY ROASTS
155 |                       <br />
156 |                       ZERO LAWSUITS GUARANTEED*
157 |                     </div>
158 |                   </div>
159 |                 </div>
160 | 
161 |               </div>
162 | 
163 |               {/* Quote Section */}
164 |               <div className="border-4 border-red-600 p-6 mb-8 bg-black">
165 |                 <div className="text-center">
166 |                   <div className="text-2xl md:text-3xl font-bold text-red-600 mb-4">
167 |                     "FINALLY, A BOOKING AGENT THAT DOESN'T TAKE 20%
168 |                   </div>
169 |                   <div className="text-2xl md:text-3xl font-bold text-white mb-4">
170 |                     AND ACTUALLY RETURNS CALLS."
171 |                   </div>
172 |                   <div className="text-sm font-mono text-white">
173 |                     &gt; AUTOMATED SCHEDULING • RIDER MANAGEMENT • TALENT COORDINATION
174 |                     <br />
175 |                     &gt; ALL THE EFFICIENCY, NONE OF THE ATTITUDE
176 |                   </div>
177 |                 </div>
178 |               </div>
179 | 
180 |               {/* Back Button */}
181 |               <div className="text-center">
182 |                 <Link href="/">
183 |                   <div className="border-4 border-red-600 bg-black hover:bg-red-600 hover:text-black transition-colors duration-150 px-8 py-4 inline-block">
184 |                     <div className="font-bold text-xl">
185 |                       ← BACK TO MAIN PROGRAM
186 |                     </div>
187 |                   </div>
188 |                 </Link>
189 |               </div>
190 | 
191 |               {/* Footer */}
192 |               <div className="mt-8 text-center">
193 |                 <div className="text-xs font-mono text-red-600">
194 |                   * LEGAL DISCLAIMER: WE'RE NOT LAWYERS, JUST COMEDIANS WITH AI
195 |                 </div>
196 |               </div>
197 |             </div>
198 |           </div>
199 |         </div>
200 |       </div>
201 |     </div>
202 |   );
203 | }
204 | 


--------------------------------------------------------------------------------
/app/booking-agent/page_old.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | import React from 'react';
  3 | import Link from 'next/link';
  4 | 
  5 | export default function BookingAgentPage() {
  6 |   return (
  7 |     <div className="min-h-screen bg-gray-500 text-white" style={{ fontFamily: 'monospace, Courier, "Courier New"' }}>
  8 |       {/* Desktop Background Pattern */}
  9 |       <div className="min-h-screen bg-gray-500 p-8" style={{
 10 |         backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23404040' fill-opacity='0.1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`
 11 |       }}>
 12 |         
 13 |         {/* Main Application Window */}
 14 |         <div className="max-w-5xl mx-auto">
 15 |           <div className="bg-gray-300 border-4 border-gray-600" style={{
 16 |             borderStyle: 'outset',
 17 |             borderTopColor: '#ffffff',
 18 |             borderLeftColor: '#ffffff', 
 19 |             borderRightColor: '#404040',
 20 |             borderBottomColor: '#404040'
 21 |           }}>
 22 |             
 23 |             {/* Window Title Bar */}
 24 |             <div className="bg-red-600 px-2 py-1 flex items-center justify-between border-b-2 border-black">
 25 |               <div className="flex items-center space-x-2">
 26 |                 <div className="text-white font-bold text-sm tracking-wider">
 27 |                   📅 BOOKING.EXE - BOOK THE COMIC
 28 |                 </div>
 29 |               </div>
 30 |               <div className="flex space-x-1">
 31 |                 <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-gray-300"
 32 |                         style={{
 33 |                           borderStyle: 'outset',
 34 |                           borderTopColor: '#ffffff',
 35 |                           borderLeftColor: '#ffffff',
 36 |                           borderRightColor: '#404040', 
 37 |                           borderBottomColor: '#404040'
 38 |                         }}>
 39 |                   _
 40 |                 </button>
 41 |                 <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-gray-300"
 42 |                         style={{
 43 |                           borderStyle: 'outset',
 44 |                           borderTopColor: '#ffffff',
 45 |                           borderLeftColor: '#ffffff',
 46 |                           borderRightColor: '#404040',
 47 |                           borderBottomColor: '#404040'
 48 |                         }}>
 49 |                   □
 50 |                 </button>
 51 |                 <Link href="/">
 52 |                   <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-red-500"
 53 |                           style={{
 54 |                             borderStyle: 'outset',
 55 |                             borderTopColor: '#ffffff',
 56 |                             borderLeftColor: '#ffffff',
 57 |                             borderRightColor: '#404040',
 58 |                             borderBottomColor: '#404040'
 59 |                           }}>
 60 |                     ×
 61 |                   </button>
 62 |                 </Link>
 63 |               </div>
 64 |             </div>
 65 | 
 66 |         {/* Main Content */}
 67 |         <main className="pb-16">
 68 |           <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
 69 |             {/* Hero Glass */}
 70 |             <div className="relative overflow-hidden bg-white/10 backdrop-blur-xl rounded-3xl p-10 md:p-12 border border-white/15 shadow-2xl shadow-emerald-500/10">
 71 |               <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-emerald-400/20 blur-2xl" />
 72 |               <div className="text-center">
 73 |                 <div className="mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-400/15 border border-emerald-300/20 text-emerald-200">
 74 |                   <FontAwesomeIcon icon={faMasksTheater} className="h-4 w-4" />
 75 |                   <span className="text-sm font-medium">Office Entertainer • MC • Roast Master</span>
 76 |                 </div>
 77 | 
 78 |                 <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
 79 |                   "I'll host, roast, and coast your event
 80 |                   <span className="text-emerald-300"> without toasting HR.</span>"
 81 |                 </h2>
 82 |                 <p className="text-lg md:text-xl text-emerald-100/90 max-w-2xl mx-auto mb-8">
 83 |                   One link. Zero back-and-forth. A calendar that respects timezones, buffer windows,
 84 |                   and your VP's suspicious "hard stop."
 85 |                 </p>
 86 | 
 87 |                 <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
 88 |                   <div className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-white font-semibold shadow-lg shadow-emerald-500/25">
 89 |                     <FontAwesomeIcon icon={faCalendarCheck} className="mr-2 h-4 w-4" />
 90 |                     Coming Soon
 91 |                   </div>
 92 |                   <Link
 93 |                     href="/"
 94 |                     className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 text-emerald-200 hover:bg-white/15 border border-white/15 transition-all"
 95 |                   >
 96 |                     <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
 97 |                     Back to Stage
 98 |                   </Link>
 99 |                 </div>
100 |               </div>
101 |             </div>
102 | 
103 |             {/* Features */}
104 |             <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
105 |               <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-emerald-300/30 transition-colors">
106 |                 <div className="flex items-start gap-4">
107 |                   <div className="bg-emerald-500/20 p-3 rounded-xl">
108 |                     <FontAwesomeIcon icon={faCalendarDays} className="h-6 w-6 text-emerald-300" />
109 |                   </div>
110 |                   <div>
111 |                     <h3 className="text-lg font-semibold text-white mb-2">Smart Scheduling</h3>
112 |                     <p className="text-emerald-200/80 text-sm">
113 |                       Lindy's AI handles the back-and-forth so you don't have to. 
114 |                       Finds time slots that actually work for humans.
115 |                     </p>
116 |                   </div>
117 |                 </div>
118 |               </div>
119 | 
120 |               <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-lime-300/30 transition-colors">
121 |                 <div className="flex items-start gap-4">
122 |                   <div className="bg-lime-500/20 p-3 rounded-xl">
123 |                     <FontAwesomeIcon icon={faHandshake} className="h-6 w-6 text-lime-300" />
124 |                   </div>
125 |                   <div>
126 |                     <h3 className="text-lg font-semibold text-white mb-2">Event Contracts</h3>
127 |                     <p className="text-emerald-200/80 text-sm">
128 |                       Automated agreements that cover everything from payment to 
129 |                       your rider requirements (yes, even the green M&Ms).
130 |                     </p>
131 |                   </div>
132 |                 </div>
133 |               </div>
134 | 
135 |               <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-teal-300/30 transition-colors">
136 |                 <div className="flex items-start gap-4">
137 |                   <div className="bg-teal-500/20 p-3 rounded-xl">
138 |                     <FontAwesomeIcon icon={faClock} className="h-6 w-6 text-teal-300" />
139 |                   </div>
140 |                   <div>
141 |                     <h3 className="text-lg font-semibold text-white mb-2">Buffer Management</h3>
142 |                     <p className="text-emerald-200/80 text-sm">
143 |                       Automatically adds setup time, breakdown time, and 
144 |                       "recover from that one brutal roast" time.
145 |                     </p>
146 |                   </div>
147 |                 </div>
148 |               </div>
149 | 
150 |               <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-emerald-300/30 transition-colors">
151 |                 <div className="flex items-start gap-4">
152 |                   <div className="bg-emerald-500/20 p-3 rounded-xl">
153 |                     <FontAwesomeIcon icon={faShieldHalved} className="h-6 w-6 text-emerald-300" />
154 |                   </div>
155 |                   <div>
156 |                     <h3 className="text-lg font-semibold text-white mb-2">HR-Safe Defaults</h3>
157 |                     <p className="text-emerald-200/80 text-sm">
158 |                       Pre-configured settings that keep the comedy corporate-friendly 
159 |                       and the lawyers happy.
160 |                     </p>
161 |                   </div>
162 |                 </div>
163 |               </div>
164 |             </section>
165 | 
166 |             {/* Booking Flow Preview */}
167 |             <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
168 |               <h3 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h3>
169 |               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
170 |                 <div className="text-center">
171 |                   <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
172 |                     <span className="text-2xl font-bold text-emerald-300">1</span>
173 |                   </div>
174 |                   <h4 className="font-semibold text-emerald-200 mb-2">Share Your Link</h4>
175 |                   <p className="text-sm text-emerald-300/80">
176 |                     Send one magic link that handles everything from availability to preferences
177 |                   </p>
178 |                 </div>
179 |                 <div className="text-center">
180 |                   <div className="w-16 h-16 bg-lime-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
181 |                     <span className="text-2xl font-bold text-lime-300">2</span>
182 |                   </div>
183 |                   <h4 className="font-semibold text-emerald-200 mb-2">AI Handles Details</h4>
184 |                   <p className="text-sm text-emerald-300/80">
185 |                     Lindy negotiates timing, requirements, and sets expectations automatically
186 |                   </p>
187 |                 </div>
188 |                 <div className="text-center">
189 |                   <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
190 |                     <span className="text-2xl font-bold text-teal-300">3</span>
191 |                   </div>
192 |                   <h4 className="font-semibold text-emerald-200 mb-2">Show Up & Roast</h4>
193 |                   <p className="text-sm text-emerald-300/80">
194 |                     Everything's handled. You just need to bring the entertainment
195 |                   </p>
196 |                 </div>
197 |               </div>
198 |             </div>
199 | 
200 |             {/* Testimonials */}
201 |             <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
202 |               <h3 className="text-2xl font-bold text-white mb-6 text-center">What Event Planners Say</h3>
203 |               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
204 |                 <div className="bg-emerald-500/10 rounded-xl p-6">
205 |                   <p className="text-emerald-200/90 mb-4 italic">
206 |                     "Finally, a booking system that doesn't make me want to quit event planning. 
207 |                     It even remembered our company's weird no-swearing policy."
208 |                   </p>
209 |                   <p className="text-emerald-300 font-medium">— Sarah, Corporate Events</p>
210 |                 </div>
211 |                 <div className="bg-lime-500/10 rounded-xl p-6">
212 |                   <p className="text-emerald-200/90 mb-4 italic">
213 |                     "The AI understood 'family-friendly but still funny' better than most humans. 
214 |                     Our kids' party was a hit without traumatizing anyone."
215 |                   </p>
216 |                   <p className="text-emerald-300 font-medium">— Mike, Birthday Dad</p>
217 |                 </div>
218 |               </div>
219 |             </div>
220 |           </div>
221 |         </main>
222 |       </div>
223 |     </div>
224 |   );
225 | }
226 | 


--------------------------------------------------------------------------------
/app/globals.css:
--------------------------------------------------------------------------------
  1 | @import "tailwindcss";
  2 | @tailwind base;
  3 | @tailwind components;
  4 | @tailwind utilities;
  5 | 
  6 | :root {
  7 |   --background: #ffffff;
  8 |   --foreground: #171717;
  9 | }
 10 | 
 11 | @theme inline {
 12 |   --color-background: var(--background);
 13 |   --color-foreground: var(--foreground);
 14 |   --font-sans: var(--font-geist-sans);
 15 |   --font-mono: var(--font-geist-mono);
 16 | }
 17 | 
 18 | @media (prefers-color-scheme: dark) {
 19 |   :root {
 20 |     --background: #0a0a0a;
 21 |     --foreground: #ededed;
 22 |   }
 23 | }
 24 | 
 25 | body {
 26 |   background: var(--background);
 27 |   color: var(--foreground);
 28 |   font-family: Arial, Helvetica, sans-serif;
 29 | }
 30 | 
 31 | /* Ensure full screen app */
 32 | html, body {
 33 |   height: 100%;
 34 |   height: 100vh;
 35 |   height: 100dvh;
 36 |   margin: 0;
 37 |   padding: 0;
 38 |   overflow: hidden;
 39 |   background: black;
 40 | }
 41 | 
 42 | /* Mobile safe area support */
 43 | @supports (padding: max(0px)) {
 44 |   .pb-safe {
 45 |     padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
 46 |   }
 47 | }
 48 | 
 49 | /* Fallback for browsers without safe area support */
 50 | .pb-safe {
 51 |   padding-bottom: 1.5rem;
 52 | }
 53 | 
 54 | /* Mobile-specific large bottom padding */
 55 | @media screen and (max-width: 768px) {
 56 |   @supports (padding: max(0px)) {
 57 |     .pb-safe {
 58 |       padding-bottom: max(8rem, env(safe-area-inset-bottom));
 59 |     }
 60 |   }
 61 |   
 62 |   .pb-safe {
 63 |     padding-bottom: 8rem;
 64 |   }
 65 | }
 66 | 
 67 | /* Mobile viewport fix */
 68 | @media screen and (max-height: 700px) {
 69 |   .min-h-\[120px\] {
 70 |     min-height: 100px;
 71 |   }
 72 | }
 73 | 
 74 | /* Prevent zoom on mobile */
 75 | input, button, textarea, select {
 76 |   font-size: 16px;
 77 | }
 78 | 
 79 | /* Smooth transitions */
 80 | * {
 81 |   -webkit-tap-highlight-color: transparent;
 82 | }
 83 | 
 84 | /* Custom scrollbar for desktop */
 85 | ::-webkit-scrollbar {
 86 |   width: 6px;
 87 | }
 88 | 
 89 | ::-webkit-scrollbar-track {
 90 |   background: rgba(0, 0, 0, 0.1);
 91 | }
 92 | 
 93 | ::-webkit-scrollbar-thumb {
 94 |   background: rgba(255, 255, 255, 0.3);
 95 |   border-radius: 3px;
 96 | }
 97 | 
 98 | ::-webkit-scrollbar-thumb:hover {
 99 |   background: rgba(255, 255, 255, 0.5);
100 | }
101 | 
102 | /* Custom animation delays for background elements */
103 | .animation-delay-2000 {
104 |   animation-delay: 2s;
105 | }
106 | 
107 | .animation-delay-4000 {
108 |   animation-delay: 4s;
109 | }
110 | 
111 | /* Smooth gradient animations */
112 | @keyframes gradient-shift {
113 |   0%, 100% {
114 |     background-position: 0% 50%;
115 |   }
116 |   50% {
117 |     background-position: 100% 50%;
118 |   }
119 | }
120 | 
121 | .gradient-animate {
122 |   background-size: 200% 200%;
123 |   animation: gradient-shift 3s ease infinite;
124 | }
125 | 


--------------------------------------------------------------------------------
/app/interactive-agent/page.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | import React from 'react';
  3 | import Link from 'next/link';
  4 | import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  5 | import { 
  6 |   faBrain, 
  7 |   faArrowLeft, 
  8 |   faCog, 
  9 |   faMasksTheater, 
 10 |   faWandMagicSparkles,
 11 |   faMicrophoneLines,
 12 |   faShieldHalved,
 13 |   faStar,
 14 |   faTimes
 15 | } from '@fortawesome/free-solid-svg-icons';
 16 | 
 17 | export default function InteractiveAgentPage() {
 18 |   return (
 19 |     <div className="min-h-screen bg-black text-white font-mono">
 20 |       {/* Neo-Brutalist Window Frame */}
 21 |       <div className="min-h-screen bg-black p-4">
 22 |         <div className="max-w-6xl mx-auto">
 23 |           {/* Main Window */}
 24 |           <div className="border-4 border-red-600 bg-black">
 25 |             {/* Title Bar */}
 26 |             <div className="bg-red-600 px-4 py-2 flex items-center justify-between border-b-4 border-red-600">
 27 |               <div className="text-white font-bold text-sm tracking-wider">
 28 |                 VIRTUALMC.EXE
 29 |               </div>
 30 |               <Link href="/" className="text-white font-bold text-lg hover:bg-red-700 px-2">
 31 |                 <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
 32 |               </Link>
 33 |             </div>
 34 | 
 35 |             {/* Window Content */}
 36 |             <div className="p-8 bg-black">
 37 |               {/* Header */}
 38 |               <div className="border-2 border-red-600 p-6 mb-8 bg-black">
 39 |                 <div className="text-center">
 40 |                   <div className="text-6xl mb-4">🎭</div>
 41 |                   <div className="text-red-600 text-4xl font-bold mb-4 tracking-wider">
 42 |                     VIRTUAL MC
 43 |                   </div>
 44 |                   <div className="bg-red-600 text-black px-4 py-2 inline-block font-bold text-sm mb-4">
 45 |                     [HEDRA-POWERED AVATARS • REAL PERSONALITY]
 46 |                   </div>
 47 |                   <div className="text-white text-lg font-mono">
 48 |                     &gt; "I'M BASICALLY A HOLOGRAM WITH BETTER TIMING."
 49 |                   </div>
 50 |                 </div>
 51 |               </div>
 52 | 
 53 |               {/* Main Content */}
 54 |               <div className="border-4 border-red-600 p-6 mb-8 bg-black">
 55 |                 <div className="text-center mb-8">
 56 |                   <div className="bg-black border-2 border-red-600 text-red-600 px-6 py-3 inline-block text-xl font-bold mb-6">
 57 |                     [COMING SOON]
 58 |                   </div>
 59 |                   <div className="text-white text-lg font-mono mb-6">
 60 |                     &gt; HEDRA'S VISUAL AI MEETS COMEDY GOLD
 61 |                     <br />
 62 |                     &gt; DEPLOY LIFELIKE AVATARS THAT HOST EVENTS
 63 |                     <br />
 64 |                     &gt; ROAST ATTENDEES, NEVER NEED BATHROOM BREAKS
 65 |                   </div>
 66 |                 </div>
 67 | 
 68 |                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
 69 |                   <Link
 70 |                     href="/voice-agent-original"
 71 |                     className="bg-red-600 text-black hover:bg-black hover:text-red-600 border-2 border-red-600 transition-colors px-6 py-3 font-bold text-sm"
 72 |                   >
 73 |                     [TRY ROAST MASTER INSTEAD]
 74 |                   </Link>
 75 |                   <Link
 76 |                     href="/"
 77 |                     className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-black transition-colors px-6 py-3 font-bold text-sm"
 78 |                   >
 79 |                     &lt; BACK TO STAGE
 80 |                   </Link>
 81 |                 </div>
 82 |               </div>
 83 | 
 84 |               {/* Features Grid */}
 85 |               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
 86 |                 <div className="border-2 border-red-600 p-4 bg-black">
 87 |                   <div className="text-red-600 font-bold mb-2 text-sm">[LIFELIKE AVATARS]</div>
 88 |                   <div className="text-white text-xs font-mono">
 89 |                     HEDRA'S CUTTING-EDGE VISUAL AI
 90 |                     <br />
 91 |                     CREATES AVATARS SO REALISTIC
 92 |                     <br />
 93 |                     YOU'LL FORGET THEY'RE NOT JUDGING
 94 |                     <br />
 95 |                     YOUR POWERPOINT
 96 |                   </div>
 97 |                 </div>
 98 | 
 99 |                 <div className="border-2 border-red-600 p-4 bg-black">
100 |                   <div className="text-red-600 font-bold mb-2 text-sm">[INSTANT HOSTING]</div>
101 |                   <div className="text-white text-xs font-mono">
102 |                     DEPLOY AN MC THAT NEVER GETS
103 |                     <br />
104 |                     STAGE FRIGHT, NEVER GOES OVERTIME
105 |                     <br />
106 |                     NEVER ASKS FOR DRINK TICKETS
107 |                   </div>
108 |                 </div>
109 | 
110 |                 <div className="border-2 border-red-600 p-4 bg-black">
111 |                   <div className="text-red-600 font-bold mb-2 text-sm">[HR-SAFE COMEDY]</div>
112 |                   <div className="text-white text-xs font-mono">
113 |                     SMART ENOUGH TO ROAST
114 |                     <br />
115 |                     WISE ENOUGH TO KNOW WHEN TO STOP
116 |                     <br />
117 |                     PERFECT FOR CORPORATE EVENTS
118 |                     <br />
119 |                     WHERE FUN HAS BOUNDARIES
120 |                   </div>
121 |                 </div>
122 | 
123 |                 <div className="border-2 border-red-600 p-4 bg-black">
124 |                   <div className="text-red-600 font-bold mb-2 text-sm">[ZERO PREP TIME]</div>
125 |                   <div className="text-white text-xs font-mono">
126 |                     NO REHEARSALS, NO RIDER DEMANDS
127 |                     <br />
128 |                     NO DIVA MOMENTS
129 |                     <br />
130 |                     POINT, CLICK, WATCH MAGIC HAPPEN
131 |                   </div>
132 |                 </div>
133 |               </div>
134 | 
135 |               {/* Coming Soon Details */}
136 |               <div className="border-4 border-red-600 p-6 mb-8 bg-black">
137 |                 <div className="text-center mb-6">
138 |                   <div className="text-red-600 font-bold text-xl mb-4">[DEVELOPMENT ROADMAP]</div>
139 |                 </div>
140 |                 
141 |                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
142 |                   <div className="border border-red-600 p-4">
143 |                     <div className="text-center">
144 |                       <div className="text-2xl mb-2">🎭</div>
145 |                       <div className="text-red-600 font-bold mb-2 text-sm">[MULTIPLE PERSONALITIES]</div>
146 |                       <div className="text-white text-xs font-mono">
147 |                         CHOOSE YOUR MC STYLE:
148 |                         <br />
149 |                         • CORPORATE FRIENDLY
150 |                         <br />
151 |                         • SLIGHTLY EDGY
152 |                         <br />
153 |                         • FULL ROAST MODE
154 |                       </div>
155 |                     </div>
156 |                   </div>
157 | 
158 |                   <div className="border border-red-600 p-4">
159 |                     <div className="text-center">
160 |                       <div className="text-2xl mb-2">🎯</div>
161 |                       <div className="text-red-600 font-bold mb-2 text-sm">[EVENT-AWARE]</div>
162 |                       <div className="text-white text-xs font-mono">
163 |                         AVATARS THAT KNOW:
164 |                         <br />
165 |                         • YOUR AGENDA
166 |                         <br />
167 |                         • YOUR ATTENDEES
168 |                         <br />
169 |                         • YOUR INSIDE JOKES
170 |                       </div>
171 |                     </div>
172 |                   </div>
173 | 
174 |                   <div className="border border-red-600 p-4">
175 |                     <div className="text-center">
176 |                       <div className="text-2xl mb-2">📱</div>
177 |                       <div className="text-red-600 font-bold mb-2 text-sm">[MULTI-PLATFORM]</div>
178 |                       <div className="text-white text-xs font-mono">
179 |                         DEPLOY ON:
180 |                         <br />
181 |                         • ZOOM / TEAMS
182 |                         <br />
183 |                         • PROJECT ON OFFICE WALL
184 |                         <br />
185 |                         • HOLOGRAPHIC DISPLAYS
186 |                       </div>
187 |                     </div>
188 |                   </div>
189 | 
190 |                   <div className="border border-red-600 p-4">
191 |                     <div className="text-center">
192 |                       <div className="text-2xl mb-2">⚡</div>
193 |                       <div className="text-red-600 font-bold mb-2 text-sm">[REAL-TIME REACTIONS]</div>
194 |                       <div className="text-white text-xs font-mono">
195 |                         RESPONDS TO AUDIENCE
196 |                         <br />
197 |                         ADAPTS PERFORMANCE
198 |                         <br />
199 |                         ON THE FLY
200 |                       </div>
201 |                     </div>
202 |                   </div>
203 |                 </div>
204 |               </div>
205 | 
206 |               {/* Status Bar */}
207 |               <div className="border-2 border-red-600 p-3 bg-black">
208 |                 <div className="flex items-center justify-between text-xs font-mono">
209 |                   <div className="text-red-600">STATUS: DEVELOPMENT IN PROGRESS</div>
210 |                   <div className="text-white">HEDRA_INTEGRATION.DLL LOADING...</div>
211 |                   <div className="text-red-600">MEMORY: 0% USED</div>
212 |                 </div>
213 |               </div>
214 |             </div>
215 |           </div>
216 |         </div>
217 |       </div>
218 |     </div>
219 |   );
220 | }
221 | 


--------------------------------------------------------------------------------
/app/layout.tsx:
--------------------------------------------------------------------------------
 1 | import type { Metadata, Viewport } from "next";
 2 | import { Geist, Geist_Mono } from "next/font/google";
 3 | import "./globals.css";
 4 | import '@fortawesome/fontawesome-svg-core/styles.css';
 5 | 
 6 | const geistSans = Geist({
 7 |   variable: "--font-geist-sans",
 8 |   subsets: ["latin"],
 9 | });
10 | 
11 | const geistMono = Geist_Mono({
12 |   variable: "--font-geist-mono",
13 |   subsets: ["latin"],
14 | });
15 | 
16 | export const metadata: Metadata = {
17 |   title: "ARLO - Audio-visual Reinforcement Learning Optimizer",
18 |   description: "Advanced AI assistant specialized in training, analyzing, and optimizing reinforcement learning systems that process multimodal audio-visual input with real-time observational capabilities.",
19 |   keywords: ["reinforcement learning", "audio-visual", "multimodal AI", "RL optimization", "computer vision", "audio processing", "PPO", "SAC", "A3C", "DQN", "neural networks", "policy optimization"],
20 |   authors: [{ name: "ARLO AI System" }],
21 |   openGraph: {
22 |     title: "ARLO - Audio-visual Reinforcement Learning Optimizer",
23 |     description: "Advanced AI assistant specialized in training, analyzing, and optimizing reinforcement learning systems that process multimodal audio-visual input with real-time observational capabilities.",
24 |     type: "website",
25 |     locale: "en_US",
26 |   },
27 |   twitter: {
28 |     card: "summary_large_image",
29 |     title: "ARLO - Audio-visual Reinforcement Learning Optimizer",
30 |     description: "Advanced AI assistant specialized in training, analyzing, and optimizing reinforcement learning systems that process multimodal audio-visual input with real-time observational capabilities.",
31 |   },
32 | };
33 | 
34 | export const viewport: Viewport = {
35 |   width: "device-width",
36 |   initialScale: 1,
37 |   maximumScale: 1,
38 |   userScalable: false,
39 | };
40 | 
41 | export default function RootLayout({
42 |   children,
43 | }: Readonly<{
44 |   children: React.ReactNode;
45 | }>) {
46 |   return (
47 |     <html lang="en">
48 |       <body
49 |         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
50 |         suppressHydrationWarning={true}
51 |       >
52 |         {children}
53 |       </body>
54 |     </html>
55 |   );
56 | }
57 | 


--------------------------------------------------------------------------------
/app/page.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | import React from 'react';
  3 | import Link from 'next/link';
  4 | 
  5 | export default function HomePage() {
  6 |   return (
  7 |     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
  8 |       {/* Neural Network Background Pattern */}
  9 |       <div className="absolute inset-0 overflow-hidden">
 10 |         <div className="absolute inset-0 opacity-20">
 11 |           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
 12 |             <defs>
 13 |               <pattern id="neural-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
 14 |                 <circle cx="5" cy="5" r="0.5" fill="currentColor" className="text-blue-400"/>
 15 |                 <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="0.1" className="text-blue-300"/>
 16 |                 <line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" strokeWidth="0.1" className="text-blue-300"/>
 17 |               </pattern>
 18 |             </defs>
 19 |             <rect width="100" height="100" fill="url(#neural-grid)"/>
 20 |           </svg>
 21 |         </div>
 22 |         {/* Animated Data Streams */}
 23 |         <div className="absolute top-0 left-0 w-full h-full">
 24 |           <div className="absolute top-20 left-10 w-1 h-20 bg-gradient-to-b from-blue-400 to-transparent animate-pulse"></div>
 25 |           <div className="absolute top-40 right-20 w-1 h-32 bg-gradient-to-b from-purple-400 to-transparent animate-pulse animation-delay-2000"></div>
 26 |           <div className="absolute bottom-20 left-1/4 w-1 h-24 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse animation-delay-4000"></div>
 27 |         </div>
 28 |       </div>
 29 | 
 30 |       {/* Main Content */}
 31 |       <div className="relative z-10 min-h-screen flex flex-col">
 32 |         {/* Header */}
 33 |         <header className="p-6 border-b border-blue-800/30">
 34 |           <div className="max-w-7xl mx-auto flex items-center justify-between">
 35 |             <div className="flex items-center space-x-4">
 36 |               <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center relative">
 37 |                 <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl animate-pulse opacity-50"></div>
 38 |                 <svg className="w-7 h-7 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 39 |                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
 40 |                 </svg>
 41 |               </div>
 42 |               <div>
 43 |                 <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
 44 |                   ARLO
 45 |                 </h1>
 46 |                 <p className="text-sm text-blue-300 font-mono">Audio-visual Reinforcement Learning Optimizer</p>
 47 |               </div>
 48 |             </div>
 49 |             <nav className="hidden md:flex items-center space-x-8">
 50 |               <a href="#capabilities" className="text-blue-300 hover:text-white transition-colors font-mono text-sm">CAPABILITIES</a>
 51 |               <a href="#framework" className="text-blue-300 hover:text-white transition-colors font-mono text-sm">FRAMEWORK</a>
 52 |               <Link href="/voice-agent-original" className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-mono text-sm border border-blue-500/30">
 53 |                 INITIALIZE SYSTEM
 54 |               </Link>
 55 |             </nav>
 56 |           </div>
 57 |         </header>
 58 | 
 59 |         {/* Hero Section */}
 60 |         <main className="flex-1 flex items-center justify-center px-6">
 61 |           <div className="max-w-6xl mx-auto text-center">
 62 |             <div className="mb-12">
 63 |               <div className="mb-6">
 64 |                 <span className="inline-block bg-blue-900/50 border border-blue-700/50 px-4 py-2 rounded-lg text-blue-300 font-mono text-sm mb-4">
 65 |                   [SYSTEM STATUS: ONLINE]
 66 |                 </span>
 67 |               </div>
 68 |               <h2 className="text-5xl md:text-7xl font-bold mb-8 font-mono">
 69 |                 <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
 70 |                   MULTIMODAL
 71 |                 </span>
 72 |                 <br />
 73 |                 <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
 74 |                   RL OPTIMIZER
 75 |                 </span>
 76 |               </h2>
 77 |               <p className="text-xl md:text-2xl text-blue-200 max-w-5xl mx-auto leading-relaxed font-mono">
 78 |                 Advanced AI assistant specialized in training, analyzing, and optimizing reinforcement learning systems 
 79 |                 that process multimodal audio-visual input with real-time observational capabilities.
 80 |               </p>
 81 |             </div>
 82 | 
 83 |             {/* Core Capabilities Grid */}
 84 |             <div className="grid md:grid-cols-3 gap-8 mb-16">
 85 |               <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300">
 86 |                 <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
 87 |                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 88 |                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 89 |                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
 90 |                   </svg>
 91 |                 </div>
 92 |                 <h3 className="text-xl font-bold mb-4 font-mono text-blue-300">COMPUTER VISION</h3>
 93 |                 <p className="text-blue-200 text-sm leading-relaxed">
 94 |                   Object detection, scene understanding, visual feature extraction for policy networks with real-time analysis capabilities.
 95 |                 </p>
 96 |                 <div className="mt-4 text-xs text-blue-400 font-mono">
 97 |                   [FEATURES: YOLO, ResNet, Attention Maps]
 98 |                 </div>
 99 |               </div>
100 | 
101 |               <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-700/30 hover:border-purple-500/50 transition-all duration-300">
102 |                 <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
103 |                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
104 |                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
105 |                   </svg>
106 |                 </div>
107 |                 <h3 className="text-xl font-bold mb-4 font-mono text-purple-300">AUDIO PROCESSING</h3>
108 |                 <p className="text-purple-200 text-sm leading-relaxed">
109 |                   Speech recognition, sound event detection, audio feature engineering for decision making with spectral analysis.
110 |                 </p>
111 |                 <div className="mt-4 text-xs text-purple-400 font-mono">
112 |                   [FEATURES: Mel-Scale, FFT, MFCC]
113 |                 </div>
114 |               </div>
115 | 
116 |               <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-cyan-700/30 hover:border-cyan-500/50 transition-all duration-300">
117 |                 <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
118 |                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
119 |                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
120 |                   </svg>
121 |                 </div>
122 |                 <h3 className="text-xl font-bold mb-4 font-mono text-cyan-300">RL ALGORITHMS</h3>
123 |                 <p className="text-cyan-200 text-sm leading-relaxed">
124 |                   PPO, SAC, A3C, Rainbow DQN with multimodal adaptations and real-time policy optimization.
125 |                 </p>
126 |                 <div className="mt-4 text-xs text-cyan-400 font-mono">
127 |                   [ALGORITHMS: PPO, SAC, A3C, DQN]
128 |                 </div>
129 |               </div>
130 |             </div>
131 | 
132 |             {/* System Metrics Display */}
133 |             <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-8 border border-blue-700/30 mb-12">
134 |               <h3 className="text-2xl font-bold mb-6 font-mono text-blue-300">REAL-TIME SYSTEM METRICS</h3>
135 |               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
136 |                 <div className="text-center">
137 |                   <div className="text-3xl font-bold text-blue-400 font-mono">99.7%</div>
138 |                   <div className="text-sm text-blue-300 font-mono">UPTIME</div>
139 |                 </div>
140 |                 <div className="text-center">
141 |                   <div className="text-3xl font-bold text-purple-400 font-mono">2.3ms</div>
142 |                   <div className="text-sm text-purple-300 font-mono">LATENCY</div>
143 |                 </div>
144 |                 <div className="text-center">
145 |                   <div className="text-3xl font-bold text-cyan-400 font-mono">1.2M</div>
146 |                   <div className="text-sm text-cyan-300 font-mono">PARAMETERS</div>
147 |                 </div>
148 |                 <div className="text-center">
149 |                   <div className="text-3xl font-bold text-green-400 font-mono">24/7</div>
150 |                   <div className="text-sm text-green-300 font-mono">MONITORING</div>
151 |                 </div>
152 |               </div>
153 |             </div>
154 | 
155 |             {/* CTA Buttons */}
156 |             <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
157 |               <Link href="/voice-agent-original" className="group bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-2xl border border-blue-500/30 font-mono">
158 |                 <span className="flex items-center space-x-3">
159 |                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
160 |                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
161 |                   </svg>
162 |                   <span>INITIALIZE ARLO SYSTEM</span>
163 |                 </span>
164 |               </Link>
165 |               <button className="group bg-slate-800/50 backdrop-blur-lg px-8 py-4 rounded-xl text-lg font-semibold border border-blue-700/30 hover:border-blue-500/50 transition-all duration-200 font-mono">
166 |                 <span className="flex items-center space-x-3">
167 |                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
168 |                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
169 |                   </svg>
170 |                   <span>VIEW ANALYTICS</span>
171 |                 </span>
172 |               </button>
173 |             </div>
174 |           </div>
175 |         </main>
176 | 
177 |         {/* Operational Framework Section */}
178 |         <section id="framework" className="py-20 px-6 border-t border-blue-800/30">
179 |           <div className="max-w-6xl mx-auto">
180 |             <div className="text-center mb-16">
181 |               <h3 className="text-4xl font-bold mb-6 font-mono">
182 |                 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
183 |                   OPERATIONAL FRAMEWORK
184 |                 </span>
185 |               </h3>
186 |               <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed font-mono">
187 |                 Advanced multimodal processing pipeline with real-time feedback loops and adaptive optimization strategies.
188 |               </p>
189 |             </div>
190 | 
191 |             <div className="grid md:grid-cols-2 gap-12 items-center">
192 |               <div className="space-y-8">
193 |                 <div className="flex items-start space-x-4">
194 |                   <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
195 |                     <span className="text-white font-bold font-mono">01</span>
196 |                   </div>
197 |                   <div>
198 |                     <h4 className="text-xl font-bold mb-2 font-mono text-blue-300">OBSERVATION PROCESSING</h4>
199 |                     <p className="text-blue-200 text-sm leading-relaxed">
200 |                       Analyze visual components, process audio signals, identify multimodal correlations and temporal dependencies.
201 |                     </p>
202 |                   </div>
203 |                 </div>
204 | 
205 |                 <div className="flex items-start space-x-4">
206 |                   <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
207 |                     <span className="text-white font-bold font-mono">02</span>
208 |                   </div>
209 |                   <div>
210 |                     <h4 className="text-xl font-bold mb-2 font-mono text-purple-300">LEARNING OPTIMIZATION</h4>
211 |                     <p className="text-purple-200 text-sm leading-relaxed">
212 |                       Monitor training metrics, identify convergence issues, recommend architecture modifications for better integration.
213 |                     </p>
214 |                   </div>
215 |                 </div>
216 | 
217 |                 <div className="flex items-start space-x-4">
218 |                   <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
219 |                     <span className="text-white font-bold font-mono">03</span>
220 |                   </div>
221 |                   <div>
222 |                     <h4 className="text-xl font-bold mb-2 font-mono text-cyan-300">REAL-TIME FEEDBACK</h4>
223 |                     <p className="text-cyan-200 text-sm leading-relaxed">
224 |                       Observe agent performance, provide immediate diagnostic insights, suggest policy adjustments based on patterns.
225 |                     </p>
226 |                   </div>
227 |                 </div>
228 |               </div>
229 | 
230 |               <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-blue-700/30">
231 |                 <div className="aspect-video bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl flex items-center justify-center border border-blue-700/30">
232 |                   <div className="text-center">
233 |                     <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
234 |                       <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
235 |                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
236 |                       </svg>
237 |                     </div>
238 |                     <p className="text-blue-300 font-mono text-sm">LIVE SYSTEM MONITORING</p>
239 |                     <p className="text-blue-400 font-mono text-xs mt-2">[REAL-TIME METRICS]</p>
240 |                   </div>
241 |                 </div>
242 |               </div>
243 |             </div>
244 |           </div>
245 |         </section>
246 | 
247 |         {/* Footer */}
248 |         <footer className="py-12 px-6 border-t border-blue-800/30">
249 |           <div className="max-w-6xl mx-auto text-center">
250 |             <div className="flex items-center justify-center space-x-4 mb-6">
251 |               <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
252 |                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
253 |                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
254 |                 </svg>
255 |               </div>
256 |               <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-mono">
257 |                 ARLO
258 |               </span>
259 |             </div>
260 |             <p className="text-blue-300 mb-6 font-mono text-sm">
261 |               Advanced AI assistant specialized in audio-visual reinforcement learning optimization.
262 |             </p>
263 |             <div className="flex justify-center space-x-8 text-sm text-blue-400 font-mono">
264 |               <a href="#" className="hover:text-white transition-colors">DOCUMENTATION</a>
265 |               <a href="#" className="hover:text-white transition-colors">API REFERENCE</a>
266 |               <a href="#" className="hover:text-white transition-colors">SYSTEM STATUS</a>
267 |             </div>
268 |           </div>
269 |         </footer>
270 |       </div>
271 |     </div>
272 |   );
273 | }
274 | 


--------------------------------------------------------------------------------
/app/voice-agent-original/page.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | import React, { useRef, useEffect, useState } from 'react';
  3 | import Vapi from '@vapi-ai/web';
  4 | import { SecureVisionProcessor } from './secure-vision';
  5 | import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  6 | import { faPhone } from '@fortawesome/free-solid-svg-icons';
  7 | import { config } from '@fortawesome/fontawesome-svg-core';
  8 | 
  9 | config.autoAddCss = false;
 10 | 
 11 | const originalConsoleWarn = console.warn;
 12 | console.warn = (...args) => {
 13 |   const message = args.join(' ');
 14 |   if (message.includes('Ignoring settings for browser- or platform-unsupported input processor(s): audio')) {
 15 |     return;
 16 |   }
 17 |   originalConsoleWarn.apply(console, args);
 18 | };
 19 | 
 20 | function OpenAIVisionMVP() {
 21 |   const videoRef = useRef<HTMLVideoElement>(null);
 22 |   const canvasRef = useRef<HTMLCanvasElement>(null);
 23 |   const [hasCamera, setHasCamera] = useState(false);
 24 |   const [capturedImage, setCapturedImage] = useState<string | null>(null);
 25 |   const [vapi, setVapi] = useState<any>(null);
 26 |   const [callActive, setCallActive] = useState(false);
 27 |   const [visionProcessor, setVisionProcessor] = useState<SecureVisionProcessor | null>(null);
 28 |   const [lastVisionDescription, setLastVisionDescription] = useState<string>('');
 29 |   const [visionProcessing, setVisionProcessing] = useState(false);
 30 |   const [isClient, setIsClient] = useState(false);
 31 |   const [visionHistory, setVisionHistory] = useState<string[]>([]);
 32 |   const [isScreenSharing, setIsScreenSharing] = useState(false);
 33 | 
 34 |   const lastApiCallTime = useRef(0);
 35 |   const MIN_API_INTERVAL = 3000;
 36 | 
 37 |   const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
 38 |   const vapiAssistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
 39 | 
 40 |   useEffect(() => {
 41 |     setIsClient(true);
 42 |   }, []);
 43 | 
 44 |   useEffect(() => {
 45 |     if (!isClient) return;
 46 |     
 47 |     console.log('Component mounted, checking screen capture support...');
 48 |     
 49 |     // Check if screen capture is supported
 50 |     if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
 51 |       console.error('Screen capture not supported in this browser');
 52 |       alert('Screen capture is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
 53 |       return;
 54 |     }
 55 |     
 56 |     console.log('Screen capture is supported, auto-starting...');
 57 |     
 58 |     // Auto-start screen capture
 59 |     const autoStartScreenCapture = async () => {
 60 |       try {
 61 |         console.log('Auto-starting screen capture...');
 62 |         
 63 |         const stream = await navigator.mediaDevices.getDisplayMedia({ 
 64 |           video: {
 65 |             displaySurface: 'monitor',
 66 |             logicalSurface: true,
 67 |             cursor: 'always'
 68 |           },
 69 |           audio: false
 70 |         });
 71 |         
 72 |         console.log('Screen capture stream obtained:', stream);
 73 |         
 74 |         if (videoRef.current) {
 75 |           videoRef.current.srcObject = stream;
 76 |           setHasCamera(true);
 77 |           setIsScreenSharing(true);
 78 |           console.log('Screen capture started successfully');
 79 |         }
 80 |         
 81 |         // Handle stream ending (user stops sharing)
 82 |         stream.getVideoTracks()[0].onended = () => {
 83 |           console.log('Screen capture ended by user');
 84 |           setHasCamera(false);
 85 |           setIsScreenSharing(false);
 86 |         };
 87 |       } catch (err) {
 88 |         console.error('Auto screen capture error:', err);
 89 |         // Don't show alert for auto-start failures, just log them
 90 |         setHasCamera(false);
 91 |         setIsScreenSharing(false);
 92 |       }
 93 |     };
 94 |     
 95 |     // Start screen capture after a short delay to ensure component is fully mounted
 96 |     const timer = setTimeout(autoStartScreenCapture, 500);
 97 |     
 98 |     return () => {
 99 |       clearTimeout(timer);
100 |       if (videoRef.current && videoRef.current.srcObject) {
101 |         (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
102 |       }
103 |     };
104 |   }, [isClient]);
105 | 
106 |   useEffect(() => {
107 |     if (!isClient || !hasCamera || !callActive || !visionProcessor || !vapi) return;
108 |     
109 |     const continuousVisionProcessing = async () => {
110 |       if (videoRef.current && canvasRef.current) {
111 |         const ctx = canvasRef.current.getContext('2d');
112 |         if (ctx) {
113 |           ctx.drawImage(videoRef.current, 0, 0, 320, 240);
114 |           const dataUrl = canvasRef.current.toDataURL('image/jpeg');
115 |           setCapturedImage(dataUrl);
116 |           
117 |           const base64Data = dataUrl.split(',')[1];
118 |           
119 |           try {
120 |             setVisionProcessing(true);
121 |             lastApiCallTime.current = Date.now();
122 |             const description = await visionProcessor.forceAnalysis(base64Data, '');
123 |             
124 |             if (description) {
125 |               setLastVisionDescription(description);
126 |               
127 |               vapi.send({
128 |                 type: 'add-message',
129 |                 message: {
130 |                   role: 'system',
131 |                   content: `Visual context update: ${description}`,
132 |                 },
133 |                 triggerResponseEnabled: false,
134 |               });
135 |               
136 |               setVisionHistory(prev => {
137 |                 const newEntry = `${new Date().toLocaleTimeString()}: ${description}`;
138 |                 const newHistory = [...prev, newEntry];
139 |                 return newHistory.slice(-5);
140 |               });
141 |             }
142 |           } catch (error) {
143 |           } finally {
144 |             setVisionProcessing(false);
145 |           }
146 |         }
147 |       }
148 |     };
149 |     
150 |     const initialTimer = setTimeout(continuousVisionProcessing, 1000);
151 |     const interval = setInterval(continuousVisionProcessing, 3000);
152 |     
153 |     return () => {
154 |       clearTimeout(initialTimer);
155 |       clearInterval(interval);
156 |     };
157 |   }, [isClient, hasCamera, callActive, visionProcessor, vapi]);
158 | 
159 |   useEffect(() => {
160 |     if (!isClient || !hasCamera || callActive) return;
161 |     
162 |     const interval = setInterval(() => {
163 |       if (videoRef.current && canvasRef.current) {
164 |         const ctx = canvasRef.current.getContext('2d');
165 |         if (ctx) {
166 |           ctx.drawImage(videoRef.current, 0, 0, 320, 240);
167 |           const dataUrl = canvasRef.current.toDataURL('image/jpeg');
168 |           setCapturedImage(dataUrl);
169 |         }
170 |       }
171 |     }, 1000);
172 |     
173 |     return () => clearInterval(interval);
174 |   }, [isClient, hasCamera, callActive]);
175 | 
176 |   useEffect(() => {
177 |     if (!isClient || !vapiPublicKey) return;
178 |     
179 |     try {
180 |       const v = new Vapi(vapiPublicKey);
181 |       
182 |       v.on('message', (message: any) => {
183 |       });
184 |       
185 |       v.on('call-start', () => {
186 |         setCallActive(true);
187 |       });
188 |       
189 |       v.on('call-end', () => {
190 |         setCallActive(false);
191 |       });
192 |       
193 |       v.on('error', (error) => {
194 |         if (!error.message?.includes('audio processor')) {
195 |           setCallActive(false);
196 |         }
197 |       });
198 |       
199 |       setVapi(v);
200 |     } catch (error) {
201 |     }
202 |     
203 |     return () => {
204 |       if (vapi) {
205 |         try {
206 |           vapi.stop();
207 |         } catch (error) {
208 |         }
209 |       }
210 |     };
211 |   }, [isClient, vapiPublicKey]);
212 | 
213 |   useEffect(() => {
214 |     if (!isClient) return;
215 |     
216 |     try {
217 |       const processor = new SecureVisionProcessor({
218 |         onDescriptionUpdate: (description) => {
219 |           setLastVisionDescription(description);
220 |         },
221 |         onProcessingStateChange: (isProcessing) => {
222 |           setVisionProcessing(isProcessing);
223 |         }
224 |       });
225 |       setVisionProcessor(processor);
226 |     } catch (error) {
227 |     }
228 |   }, [isClient]);
229 | 
230 |   const handleStartCall = () => {
231 |     if (vapi && vapiAssistantId) {
232 |       try {
233 |         vapi.start(vapiAssistantId);
234 |       } catch (error) {
235 |       }
236 |     }
237 |   };
238 |   
239 |   const handleStopCall = () => {
240 |     if (vapi) {
241 |       try {
242 |         vapi.stop();
243 |       } catch (error) {
244 |       }
245 |     }
246 |   };
247 | 
248 |   const analyzeCurrentFrame = async (userPrompt?: string) => {
249 |     if (!visionProcessor || !videoRef.current || !canvasRef.current) return;
250 |     
251 |     const now = Date.now();
252 |     if (now - lastApiCallTime.current < MIN_API_INTERVAL) {
253 |       const waitTime = Math.ceil((MIN_API_INTERVAL - (now - lastApiCallTime.current)) / 1000);
254 |       return;
255 |     }
256 |     
257 |     try {
258 |       setVisionProcessing(true);
259 |       const ctx = canvasRef.current.getContext('2d');
260 |       if (ctx) {
261 |         ctx.drawImage(videoRef.current, 0, 0, 320, 240);
262 |         const dataUrl = canvasRef.current.toDataURL('image/jpeg');
263 |         const base64Data = dataUrl.split(',')[1];
264 |         
265 |         lastApiCallTime.current = now;
266 |         const description = await visionProcessor.forceAnalysis(base64Data, userPrompt || '');
267 |         
268 |         if (description && callActive) {
269 |           setLastVisionDescription(description);
270 |           setVisionHistory(prev => {
271 |             const contextEntry = userPrompt 
272 |               ? `${new Date().toLocaleTimeString()}: ${description} (User asked: "${userPrompt}")`
273 |               : `${new Date().toLocaleTimeString()}: ${description}`;
274 |             const newHistory = [...prev, contextEntry];
275 |             return newHistory.slice(-5);
276 |           });
277 |         }
278 |       }
279 |     } catch (error) {
280 |     } finally {
281 |       setVisionProcessing(false);
282 |     }
283 |   };
284 | 
285 |   const startScreenCapture = async () => {
286 |     try {
287 |       console.log('Starting screen capture...');
288 |       
289 |       // Check if getDisplayMedia is supported
290 |       if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
291 |         throw new Error('Screen capture not supported in this browser');
292 |       }
293 |       
294 |       const stream = await navigator.mediaDevices.getDisplayMedia({ 
295 |         video: {
296 |           displaySurface: 'monitor',
297 |           logicalSurface: true,
298 |           cursor: 'always'
299 |         },
300 |         audio: false
301 |       });
302 |       
303 |       console.log('Screen capture stream obtained:', stream);
304 |       
305 |       if (videoRef.current) {
306 |         videoRef.current.srcObject = stream;
307 |         setHasCamera(true);
308 |         setIsScreenSharing(true);
309 |         console.log('Screen capture started successfully');
310 |       }
311 |       
312 |       // Handle stream ending (user stops sharing)
313 |       stream.getVideoTracks()[0].onended = () => {
314 |         console.log('Screen capture ended by user');
315 |         setHasCamera(false);
316 |         setIsScreenSharing(false);
317 |       };
318 |     } catch (err) {
319 |       console.error('Screen capture error:', err);
320 |       alert(`Screen capture failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
321 |       setHasCamera(false);
322 |       setIsScreenSharing(false);
323 |     }
324 |   };
325 | 
326 |   const stopScreenCapture = () => {
327 |     if (videoRef.current && videoRef.current.srcObject) {
328 |       (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
329 |       setHasCamera(false);
330 |       setIsScreenSharing(false);
331 |     }
332 |   };
333 | 
334 |   return (
335 |     <div className="relative w-full h-screen bg-black overflow-hidden">
336 |       <div className="relative w-full h-full flex items-center justify-center">
337 |         {isClient ? (
338 |           <>
339 |             <video 
340 |               ref={videoRef} 
341 |               autoPlay 
342 |               muted 
343 |               playsInline
344 |               className="w-full h-full object-cover"
345 |             />
346 |             <canvas ref={canvasRef} width={320} height={240} className="hidden" />
347 |           </>
348 |         ) : (
349 |           <div className="w-full h-full bg-black flex items-center justify-center">
350 |           </div>
351 |         )}
352 | 
353 |         <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
354 |           <div className="flex items-center justify-between">
355 |             <div className="text-white font-medium text-lg">
356 |               Vapi Live
357 |             </div>
358 |             <div className="flex items-center space-x-2">
359 |               {!hasCamera ? (
360 |                 <button
361 |                   onClick={startScreenCapture}
362 |                   className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200"
363 |                   title="Start screen sharing"
364 |                 >
365 |                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
366 |                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
367 |                   </svg>
368 |                 </button>
369 |               ) : (
370 |                 <button
371 |                   onClick={stopScreenCapture}
372 |                   className="bg-red-500/20 hover:bg-red-500/30 rounded-full p-2 transition-all duration-200"
373 |                   title="Stop screen sharing"
374 |                 >
375 |                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
376 |                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
377 |                   </svg>
378 |                 </button>
379 |               )}
380 |               {visionProcessing && (
381 |                 <div className="flex items-center space-x-1 text-white/80 text-sm">
382 |                   <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
383 |                   <span>Analyzing...</span>
384 |                 </div>
385 |               )}
386 |               {callActive && (
387 |                 <div className="flex items-center space-x-1 text-green-400 text-sm">
388 |                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
389 |                   <span>Live</span>
390 |                 </div>
391 |               )}
392 |             </div>
393 |           </div>
394 |         </div>
395 | 
396 |         <div className="absolute bottom-0 left-0 right-0 pb-safe bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-md">
397 |           <div className="flex items-center justify-between px-4 py-6 pb-10 md:py-6 md:pb-8 md:min-h-[120px] min-h-[160px]">
398 |           <div className="w-16"></div>
399 |           
400 |           <button
401 |             onClick={callActive ? handleStopCall : handleStartCall}
402 |             className={`
403 |               w-20 h-20 rounded-full flex items-center justify-center
404 |               transition-all duration-200 backdrop-blur-sm
405 |               ${callActive 
406 |                 ? 'bg-red-500 hover:bg-red-600 border-4 border-red-300 active:scale-95' 
407 |                 : 'bg-white hover:bg-gray-100 active:scale-95'
408 |               }
409 |             `}
410 |           >
411 |             {callActive ? (
412 |               <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
413 |                 <path d="M6 6h12v12H6z"/>
414 |               </svg>
415 |             ) : (
416 |               <FontAwesomeIcon 
417 |                 icon={faPhone} 
418 |                 size="lg"
419 |                 style={{ fontSize: '24px', color: 'black' }}
420 |               />
421 |             )}
422 |           </button>
423 | 
424 |           <button
425 |                                     onClick={() => analyzeCurrentFrame("What's on this screen?")}
426 |             disabled={!callActive || !visionProcessor || visionProcessing}
427 |             className={`
428 |               w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center
429 |               transition-all duration-200 backdrop-blur-sm
430 |               ${(!callActive || !visionProcessor || visionProcessing) 
431 |                 ? 'bg-gray-600/50 cursor-not-allowed' 
432 |                 : 'bg-white/20 hover:bg-white/30 active:scale-95'
433 |               }
434 |             `}
435 |           >
436 |             <div className={`
437 |               w-8 h-8 rounded-full 
438 |               ${visionProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-white'}
439 |             `} />
440 |           </button>
441 |           </div>
442 |         </div>
443 | 
444 |         {isClient && (!vapiPublicKey || !vapiAssistantId) && (
445 |           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500/90 backdrop-blur-sm rounded-2xl p-6 text-white text-center max-w-sm mx-4">
446 |             <div className="font-medium mb-2">Setup Required</div>
447 |             <div className="text-sm opacity-90">
448 |               Please set your Vapi credentials in the environment variables.
449 |             </div>
450 |           </div>
451 |         )}
452 |       </div>
453 |     </div>
454 |   );
455 | }
456 | 
457 | export default function Home() {
458 |   return <OpenAIVisionMVP />;
459 | }
460 | 


--------------------------------------------------------------------------------
/app/voice-agent-original/secure-vision.ts:
--------------------------------------------------------------------------------
  1 | interface SecureVisionFrame {
  2 |   id: string;
  3 |   imageData: string;
  4 |   timestamp: number;
  5 |   priority: 'low' | 'medium' | 'high';
  6 |   userPrompt?: string;
  7 | }
  8 | 
  9 | interface VisionResponse {
 10 |   description: string;
 11 |   timestamp: number;
 12 |   success: boolean;
 13 |   error?: string;
 14 | }
 15 | 
 16 | export class SecureVisionProcessor {
 17 |   private frameQueue: SecureVisionFrame[] = [];
 18 |   private isBackgroundProcessing = false;
 19 |   private currentDescription = '';
 20 |   private lastSignificantChange = 0;
 21 |   private frameCounter = 0;
 22 |   private avgProcessingTime = 2000;
 23 |   private successRate = 1.0;
 24 |   private onDescriptionUpdate?: (description: string) => void;
 25 |   private onProcessingStateChange?: (isProcessing: boolean) => void;
 26 | 
 27 |   constructor(callbacks?: {
 28 |     onDescriptionUpdate?: (description: string) => void;
 29 |     onProcessingStateChange?: (isProcessing: boolean) => void;
 30 |   }) {
 31 |     this.onDescriptionUpdate = callbacks?.onDescriptionUpdate;
 32 |     this.onProcessingStateChange = callbacks?.onProcessingStateChange;
 33 | 
 34 |     // DISABLED: Background processor - using direct calls for automatic processing
 35 |     // this.startBackgroundProcessor();
 36 |   }
 37 | 
 38 |   addFrame(imageBase64: string, userPrompt?: string): string {
 39 |     return this.currentDescription;
 40 |   }
 41 | 
 42 |   private shouldProcessFrame(): boolean {
 43 |     const timeSinceLastChange = Date.now() - this.lastSignificantChange;
 44 |     
 45 |     if (timeSinceLastChange < 5000) return this.frameCounter % 2 === 0;
 46 |     if (timeSinceLastChange < 15000) return this.frameCounter % 4 === 0;
 47 |     return this.frameCounter % 8 === 0;
 48 |   }
 49 | 
 50 |   private enqueueFrame(frame: SecureVisionFrame) {
 51 |     this.frameQueue = this.frameQueue.filter(f => 
 52 |       f.priority !== 'low' || Date.now() - f.timestamp < 5000
 53 |     );
 54 | 
 55 |     if (frame.priority === 'high') {
 56 |       this.frameQueue.unshift(frame);
 57 |     } else {
 58 |       this.frameQueue.push(frame);
 59 |     }
 60 | 
 61 |     if (this.frameQueue.length > 10) {
 62 |       this.frameQueue = this.frameQueue.slice(-10);
 63 |     }
 64 |   }
 65 | 
 66 |   private startBackgroundProcessor() {
 67 |     const processNext = async () => {
 68 |       if (this.frameQueue.length === 0) {
 69 |         setTimeout(processNext, 1000);
 70 |         return;
 71 |       }
 72 | 
 73 |       if (this.isBackgroundProcessing) {
 74 |         setTimeout(processNext, 500);
 75 |         return;
 76 |       }
 77 | 
 78 |       const frame = this.frameQueue.shift()!;
 79 |       await this.processFrameInBackground(frame);
 80 |       
 81 |       setTimeout(processNext, 2000);
 82 |     };
 83 | 
 84 |     processNext();
 85 |   }
 86 | 
 87 |   private async processFrameInBackground(frame: SecureVisionFrame) {
 88 |     this.isBackgroundProcessing = true;
 89 |     this.onProcessingStateChange?.(true);
 90 |     
 91 |     const startTime = Date.now();
 92 | 
 93 |     try {
 94 |       const response = await fetch('/api/vision', {
 95 |         method: 'POST',
 96 |         headers: {
 97 |           'Content-Type': 'application/json',
 98 |         },
 99 |         body: JSON.stringify({
100 |           imageBase64: frame.imageData,
101 |           userPrompt: frame.userPrompt
102 |         })
103 |       });
104 | 
105 |       if (!response.ok) {
106 |         if (response.status === 429) {
107 |           const errorData = await response.json();
108 |           return;
109 |         }
110 |         throw new Error(`API call failed: ${response.status}`);
111 |       }
112 | 
113 |       const result: VisionResponse = await response.json();
114 |       
115 |       if (!result.success) {
116 |         throw new Error(result.error || 'Vision processing failed');
117 |       }
118 | 
119 |       const description = result.description;
120 |       const processingTime = Date.now() - startTime;
121 | 
122 |       this.updateMetrics(processingTime, true);
123 | 
124 |       if (this.isSignificantChange(description)) {
125 |         this.currentDescription = description;
126 |         this.lastSignificantChange = Date.now();
127 |         this.onDescriptionUpdate?.(description);
128 |       }
129 | 
130 |     } catch (error) {
131 |       this.updateMetrics(Date.now() - startTime, false);
132 |     } finally {
133 |       this.isBackgroundProcessing = false;
134 |       this.onProcessingStateChange?.(false);
135 |     }
136 |   }
137 | 
138 |   private isSignificantChange(newDescription: string): boolean {
139 |     if (!this.currentDescription) return true;
140 | 
141 |     const currentWords = new Set(this.currentDescription.toLowerCase().split(' '));
142 |     const newWords = new Set(newDescription.toLowerCase().split(' '));
143 |     
144 |     const intersection = new Set([...currentWords].filter(x => newWords.has(x)));
145 |     const similarity = intersection.size / Math.max(currentWords.size, newWords.size);
146 |     
147 |     return similarity < 0.7;
148 |   }
149 | 
150 |   private updateMetrics(processingTime: number, success: boolean) {
151 |     this.avgProcessingTime = this.avgProcessingTime * 0.8 + processingTime * 0.2;
152 |     this.successRate = this.successRate * 0.9 + (success ? 1 : 0) * 0.1;
153 |   }
154 | 
155 |   // Public interface methods
156 |   getCurrentDescription(): string {
157 |     return this.currentDescription;
158 |   }
159 | 
160 |   isProcessing(): boolean {
161 |     return this.isBackgroundProcessing;
162 |   }
163 | 
164 |   getQueueLength(): number {
165 |     return this.frameQueue.length;
166 |   }
167 | 
168 |   getPerformanceMetrics() {
169 |     return {
170 |       avgProcessingTime: Math.round(this.avgProcessingTime),
171 |       successRate: Math.round(this.successRate * 100),
172 |       queueLength: this.frameQueue.length,
173 |       lastUpdate: this.lastSignificantChange
174 |     };
175 |   }
176 | 
177 |   async forceAnalysis(imageBase64: string, userPrompt: string): Promise<string> {
178 |     const frame: SecureVisionFrame = {
179 |       id: `force_${Date.now()}`,
180 |       imageData: imageBase64,
181 |       timestamp: Date.now(),
182 |       priority: 'high',
183 |       userPrompt
184 |     };
185 | 
186 |     await this.processFrameInBackground(frame);
187 |     return this.currentDescription;
188 |   }
189 | 
190 |   destroy() {
191 |     this.frameQueue = [];
192 |   }
193 | } 


--------------------------------------------------------------------------------
/app/voice-agent/page.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | import React, { useRef, useEffect, useState } from 'react';
  3 | import Vapi from '@vapi-ai/web';
  4 | import { SecureVisionProcessor } from './secure-vision';
  5 | import { config } from '@fortawesome/fontawesome-svg-core';
  6 | import Link from 'next/link';
  7 | 
  8 | config.autoAddCss = false;
  9 | 
 10 | const originalConsoleWarn = console.warn;
 11 | console.warn = (...args) => {
 12 |   const message = args.join(' ');
 13 |   if (message.includes('Ignoring settings for browser- or platform-unsupported input processor(s): audio')) {
 14 |     return;
 15 |   }
 16 |   originalConsoleWarn.apply(console, args);
 17 | };
 18 | 
 19 | function OpenAIVisionMVP() {
 20 |   const videoRef = useRef<HTMLVideoElement>(null);
 21 |   const canvasRef = useRef<HTMLCanvasElement>(null);
 22 |   const [hasCamera, setHasCamera] = useState(false);
 23 |   const [capturedImage, setCapturedImage] = useState<string | null>(null);
 24 |   const [vapi, setVapi] = useState<any>(null);
 25 |   const [callActive, setCallActive] = useState(false);
 26 |   const [visionProcessor, setVisionProcessor] = useState<SecureVisionProcessor | null>(null);
 27 |   const [lastVisionDescription, setLastVisionDescription] = useState<string>('');
 28 |   const [visionProcessing, setVisionProcessing] = useState(false);
 29 |   const [isClient, setIsClient] = useState(false);
 30 |   const [visionHistory, setVisionHistory] = useState<string[]>([]);
 31 |   const [isScreenSharing, setIsScreenSharing] = useState(false);
 32 | 
 33 |   const lastApiCallTime = useRef(0);
 34 |   const MIN_API_INTERVAL = 3000;
 35 | 
 36 |   const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
 37 |   const vapiAssistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
 38 | 
 39 |   useEffect(() => {
 40 |     setIsClient(true);
 41 |   }, []);
 42 | 
 43 |   useEffect(() => {
 44 |     if (!isClient) return;
 45 |     
 46 |     console.log('Component mounted, checking screen capture support...');
 47 |     
 48 |     // Check if screen capture is supported
 49 |     if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
 50 |       console.error('Screen capture not supported in this browser');
 51 |       alert('Screen capture is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
 52 |       return;
 53 |     }
 54 |     
 55 |     console.log('Screen capture is supported, auto-starting...');
 56 |     
 57 |     // Auto-start screen capture
 58 |     const autoStartScreenCapture = async () => {
 59 |       try {
 60 |         console.log('Auto-starting screen capture...');
 61 |         
 62 |         const stream = await navigator.mediaDevices.getDisplayMedia({ 
 63 |           video: {
 64 |             displaySurface: 'monitor',
 65 |             logicalSurface: true,
 66 |             cursor: 'always'
 67 |           },
 68 |           audio: false
 69 |         });
 70 |         
 71 |         console.log('Screen capture stream obtained:', stream);
 72 |         
 73 |         if (videoRef.current) {
 74 |           videoRef.current.srcObject = stream;
 75 |           setHasCamera(true);
 76 |           setIsScreenSharing(true);
 77 |           console.log('Screen capture started successfully');
 78 |         }
 79 |         
 80 |         // Handle stream ending (user stops sharing)
 81 |         stream.getVideoTracks()[0].onended = () => {
 82 |           console.log('Screen capture ended by user');
 83 |           setHasCamera(false);
 84 |           setIsScreenSharing(false);
 85 |         };
 86 |       } catch (err) {
 87 |         console.error('Auto screen capture error:', err);
 88 |         // Don't show alert for auto-start failures, just log them
 89 |         setHasCamera(false);
 90 |         setIsScreenSharing(false);
 91 |       }
 92 |     };
 93 |     
 94 |     // Start screen capture after a short delay to ensure component is fully mounted
 95 |     const timer = setTimeout(autoStartScreenCapture, 500);
 96 |     
 97 |     return () => {
 98 |       clearTimeout(timer);
 99 |       if (videoRef.current && videoRef.current.srcObject) {
100 |         (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
101 |       }
102 |     };
103 |   }, [isClient]);
104 | 
105 |   useEffect(() => {
106 |     if (!isClient || !hasCamera || !callActive || !visionProcessor || !vapi) return;
107 |     
108 |     const continuousVisionProcessing = async () => {
109 |       if (videoRef.current && canvasRef.current) {
110 |         const ctx = canvasRef.current.getContext('2d');
111 |         if (ctx) {
112 |           ctx.drawImage(videoRef.current, 0, 0, 320, 240);
113 |           const dataUrl = canvasRef.current.toDataURL('image/jpeg');
114 |           setCapturedImage(dataUrl);
115 |           
116 |           const base64Data = dataUrl.split(',')[1];
117 |           
118 |           try {
119 |             setVisionProcessing(true);
120 |             lastApiCallTime.current = Date.now();
121 |             const description = await visionProcessor.forceAnalysis(base64Data, '');
122 |             
123 |             if (description) {
124 |               setLastVisionDescription(description);
125 |               
126 |               vapi.send({
127 |                 type: 'add-message',
128 |                 message: {
129 |                   role: 'system',
130 |                   content: `Visual context update: ${description}`,
131 |                 },
132 |               });
133 |               
134 |               setVisionHistory(prev => [description, ...prev.slice(0, 4)]);
135 |             }
136 |             setVisionProcessing(false);
137 |           } catch (error) {
138 |             console.error('Vision processing error:', error);
139 |             setVisionProcessing(false);
140 |           }
141 |         }
142 |       }
143 |     };
144 | 
145 |     const intervalId = setInterval(continuousVisionProcessing, MIN_API_INTERVAL);
146 |     return () => clearInterval(intervalId);
147 |   }, [isClient, hasCamera, callActive, visionProcessor, vapi]);
148 | 
149 |   useEffect(() => {
150 |     if (!isClient) return;
151 |     
152 |     const processor = new SecureVisionProcessor();
153 |     setVisionProcessor(processor);
154 |     
155 |     if (!vapiPublicKey) {
156 |       console.error('VAPI public key not found');
157 |       return;
158 |     }
159 | 
160 |     const vapiInstance = new Vapi(vapiPublicKey);
161 |     setVapi(vapiInstance);
162 | 
163 |     vapiInstance.on('call-start', () => {
164 |       setCallActive(true);
165 |     });
166 | 
167 |     vapiInstance.on('call-end', () => {
168 |       setCallActive(false);
169 |     });
170 | 
171 |     return () => {
172 |       vapiInstance.stop();
173 |     };
174 |   }, [isClient, vapiPublicKey]);
175 | 
176 |   const startCall = () => {
177 |     if (!vapi || !vapiAssistantId) {
178 |       console.error('Vapi or assistant ID not available');
179 |       return;
180 |     }
181 |     
182 |     vapi.start(vapiAssistantId);
183 |   };
184 | 
185 |   const endCall = () => {
186 |     if (vapi) {
187 |       vapi.stop();
188 |     }
189 |   };
190 | 
191 |   const startScreenCapture = async () => {
192 |     try {
193 |       console.log('Starting screen capture...');
194 |       
195 |       // Check if getDisplayMedia is supported
196 |       if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
197 |         throw new Error('Screen capture not supported in this browser');
198 |       }
199 |       
200 |       const stream = await navigator.mediaDevices.getDisplayMedia({ 
201 |         video: {
202 |           displaySurface: 'monitor',
203 |           logicalSurface: true,
204 |           cursor: 'always'
205 |         },
206 |         audio: false
207 |       });
208 |       
209 |       console.log('Screen capture stream obtained:', stream);
210 |       
211 |       if (videoRef.current) {
212 |         videoRef.current.srcObject = stream;
213 |         setHasCamera(true);
214 |         setIsScreenSharing(true);
215 |         console.log('Screen capture started successfully');
216 |       }
217 |       
218 |       // Handle stream ending (user stops sharing)
219 |       stream.getVideoTracks()[0].onended = () => {
220 |         console.log('Screen capture ended by user');
221 |         setHasCamera(false);
222 |         setIsScreenSharing(false);
223 |       };
224 |     } catch (err) {
225 |       console.error('Screen capture error:', err);
226 |       alert(`Screen capture failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
227 |       setHasCamera(false);
228 |       setIsScreenSharing(false);
229 |     }
230 |   };
231 | 
232 |   const stopScreenCapture = () => {
233 |     if (videoRef.current && videoRef.current.srcObject) {
234 |       (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
235 |       setHasCamera(false);
236 |       setIsScreenSharing(false);
237 |     }
238 |   };
239 | 
240 |   if (!isClient) {
241 |     return <div className="min-h-screen bg-gray-500"></div>;
242 |   }
243 | 
244 |   return (
245 |     <div className="min-h-screen bg-gray-500 text-white" style={{ fontFamily: 'monospace, Courier, "Courier New"' }}>
246 |       {/* Desktop Background Pattern */}
247 |       <div className="min-h-screen bg-gray-500 p-8" style={{
248 |         backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23404040' fill-opacity='0.1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`
249 |       }}>
250 |         
251 |         {/* Main Application Window */}
252 |         <div className="max-w-5xl mx-auto">
253 |           <div className="bg-gray-300 border-4 border-gray-600" style={{
254 |             borderStyle: 'outset',
255 |             borderTopColor: '#ffffff',
256 |             borderLeftColor: '#ffffff', 
257 |             borderRightColor: '#404040',
258 |             borderBottomColor: '#404040'
259 |           }}>
260 |             
261 |             {/* Window Title Bar */}
262 |             <div className="bg-red-600 px-2 py-1 flex items-center justify-between border-b-2 border-black">
263 |               <div className="flex items-center space-x-2">
264 |                 <div className="text-white font-bold text-sm tracking-wider">
265 |                   🎤 ROASTMASTER.EXE - LIVE AI VISION + VOICE
266 |                 </div>
267 |               </div>
268 |               <div className="flex space-x-1">
269 |                 <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-gray-300"
270 |                         style={{
271 |                           borderStyle: 'outset',
272 |                           borderTopColor: '#ffffff',
273 |                           borderLeftColor: '#ffffff',
274 |                           borderRightColor: '#404040', 
275 |                           borderBottomColor: '#404040'
276 |                         }}>
277 |                   _
278 |                 </button>
279 |                 <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-gray-300"
280 |                         style={{
281 |                           borderStyle: 'outset',
282 |                           borderTopColor: '#ffffff',
283 |                           borderLeftColor: '#ffffff',
284 |                           borderRightColor: '#404040',
285 |                           borderBottomColor: '#404040'
286 |                         }}>
287 |                   □
288 |                 </button>
289 |                 <Link href="/">
290 |                   <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-red-500"
291 |                           style={{
292 |                             borderStyle: 'outset',
293 |                             borderTopColor: '#ffffff',
294 |                             borderLeftColor: '#ffffff',
295 |                             borderRightColor: '#404040',
296 |                             borderBottomColor: '#404040'
297 |                           }}>
298 |                     ×
299 |                   </button>
300 |                 </Link>
301 |               </div>
302 |             </div>
303 | 
304 |             {/* Window Content */}
305 |             <div className="p-8 bg-black">
306 |               {/* Header */}
307 |               <div className="border-2 border-red-600 p-6 mb-8 bg-black">
308 |                 <div className="text-center">
309 |                   <div className="text-red-600 text-5xl font-bold mb-4 tracking-wider">
310 |                     ROAST MASTER
311 |                   </div>
312 |                   <div className="bg-red-600 text-black px-4 py-2 inline-block font-bold text-sm mb-4">
313 |                     [LIVE AI • SEES EVERYTHING • ROASTS ACCORDINGLY]
314 |                   </div>
315 |                   <div className="text-white text-lg font-mono max-w-3xl mx-auto">
316 |                     &gt; SHARE YOUR SCREEN
317 |                     <br />
318 |                     &gt; AI ANALYZES VISUAL CONTEXT  
319 |                     <br />
320 |                     &gt; DELIVERS REAL-TIME ROASTS
321 |                   </div>
322 |                 </div>
323 |               </div>
324 | 
325 |               {/* Main Content Grid */}
326 |               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
327 |                 
328 |                 {/* Screen Recording Section */}
329 |                 <div className="border-2 border-red-600 p-6 bg-black">
330 |                   <div className="border-2 border-red-600 bg-black mb-4 text-center p-2">
331 |                     <div className="text-red-600 font-bold text-lg">
332 |                       [SCREEN RECORDING]
333 |                     </div>
334 |                   </div>
335 |                   
336 |                   {hasCamera ? (
337 |                     <div className="relative">
338 |                       <video 
339 |                         ref={videoRef} 
340 |                         autoPlay 
341 |                         playsInline 
342 |                         muted
343 |                         className="w-full border-2 border-red-600 bg-black"
344 |                         style={{ aspectRatio: '16/9' }}
345 |                       />
346 |                       <canvas 
347 |                         ref={canvasRef} 
348 |                         width={320} 
349 |                         height={240}
350 |                         className="hidden"
351 |                       />
352 |                       
353 |                       {/* Screen Recording Controls */}
354 |                       <div className="mt-4 flex gap-2">
355 |                         <button
356 |                           onClick={stopScreenCapture}
357 |                           className="border-2 border-red-600 bg-black text-red-600 px-3 py-1 font-bold text-sm hover:bg-red-600 hover:text-black transition-colors"
358 |                         >
359 |                           STOP SHARING
360 |                         </button>
361 |                       </div>
362 |                     </div>
363 |                   ) : (
364 |                     <div className="border-2 border-red-600 bg-black p-8 text-center">
365 |                       <div className="text-red-600 text-2xl mb-4">🖥️</div>
366 |                       <div className="text-white font-mono">
367 |                         NO SCREEN SHARING
368 |                         <br />
369 |                         CLICK "START SHARING" TO BEGIN
370 |                       </div>
371 |                       <button
372 |                         onClick={startScreenCapture}
373 |                         className="mt-4 border-2 border-red-600 bg-black text-red-600 px-4 py-2 font-bold text-sm hover:bg-red-600 hover:text-black transition-colors"
374 |                       >
375 |                         START SHARING
376 |                       </button>
377 |                       
378 |                       {/* Debug Info */}
379 |                       <div className="mt-4 text-xs text-gray-400">
380 |                         <div>Screen Capture Support: {navigator.mediaDevices?.getDisplayMedia ? '✅' : '❌'}</div>
381 |                         <div>Current Status: {hasCamera ? '🟢 Active' : '🔴 Inactive'}</div>
382 |                         <div>Screen Sharing: {isScreenSharing ? '🟢 Yes' : '🔴 No'}</div>
383 |                       </div>
384 |                     </div>
385 |                   )}
386 |                 </div>
387 | 
388 |                 {/* Controls Section */}
389 |                 <div className="border-2 border-red-600 p-6 bg-black">
390 |                   <div className="border-2 border-red-600 bg-black mb-4 text-center p-2">
391 |                     <div className="text-red-600 font-bold text-lg">
392 |                       [ROAST CONTROLS]
393 |                     </div>
394 |                   </div>
395 |                   
396 |                   {/* Call Status */}
397 |                   <div className="mb-6 text-center">
398 |                     <div className={`border-2 px-4 py-2 font-bold text-lg ${
399 |                       callActive 
400 |                         ? 'border-green-500 text-green-500 bg-black' 
401 |                         : 'border-red-600 text-red-600 bg-black'
402 |                     }`}>
403 |                       {callActive ? '[ROASTING ACTIVE]' : '[READY TO ROAST]'}
404 |                     </div>
405 |                   </div>
406 | 
407 |                   {/* Main Action Button */}
408 |                   <div className="text-center mb-6">
409 |                     {!callActive ? (
410 |                       <button
411 |                         onClick={startCall}
412 |                         disabled={!hasCamera}
413 |                         className="border-4 border-red-600 bg-black text-red-600 px-8 py-4 font-bold text-xl hover:bg-red-600 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
414 |                       >
415 |                         START ROASTING
416 |                       </button>
417 |                     ) : (
418 |                       <button
419 |                         onClick={endCall}
420 |                         className="border-4 border-red-600 bg-red-600 text-black px-8 py-4 font-bold text-xl hover:bg-black hover:text-red-600 transition-colors"
421 |                       >
422 |                         STOP ROASTING
423 |                       </button>
424 |                     )}
425 |                   </div>
426 | 
427 |                   {/* Vision Status */}
428 |                   {callActive && (
429 |                     <div className="border-2 border-red-600 p-4 bg-black">
430 |                       <div className="text-red-600 font-bold mb-2">
431 |                         AI VISION STATUS:
432 |                       </div>
433 |                       <div className="text-white font-mono text-sm">
434 |                         {visionProcessing ? (
435 |                           <div className="text-yellow-500">
436 |                             [ANALYZING IMAGE...]
437 |                           </div>
438 |                         ) : (
439 |                           <div className="text-green-500">
440 |                             [VISION ACTIVE]
441 |                           </div>
442 |                         )}
443 |                       </div>
444 |                       
445 |                       {lastVisionDescription && (
446 |                         <div className="mt-3">
447 |                           <div className="text-red-600 font-bold text-xs mb-1">
448 |                             LAST VISION ANALYSIS:
449 |                           </div>
450 |                           <div className="text-white font-mono text-xs border border-red-600 p-2 bg-black">
451 |                             {lastVisionDescription}
452 |                           </div>
453 |                         </div>
454 |                       )}
455 |                     </div>
456 |                   )}
457 |                 </div>
458 |               </div>
459 | 
460 |               {/* Instructions */}
461 |               <div className="border-4 border-red-600 p-6 mt-8 bg-black">
462 |                 <div className="text-center">
463 |                   <div className="text-red-600 text-2xl font-bold mb-4">
464 |                     HOW TO GET ROASTED
465 |                   </div>
466 |                   <div className="text-white font-mono text-sm grid grid-cols-1 md:grid-cols-3 gap-4">
467 |                     <div>
468 |                       <div className="text-red-600 font-bold mb-2">1. SHARE SCREEN</div>
469 |                       <div>CLICK "START SHARING" TO SHARE YOUR SCREEN</div>
470 |                     </div>
471 |                     <div>
472 |                       <div className="text-red-600 font-bold mb-2">2. START ROASTING</div>
473 |                       <div>CLICK THE BIG RED BUTTON TO BEGIN THE DESTRUCTION</div>
474 |                     </div>
475 |                     <div>
476 |                       <div className="text-red-600 font-bold mb-2">3. PREPARE YOUR EGO</div>
477 |                       <div>AI WILL ANALYZE AND DELIVER SURGICAL ROASTS</div>
478 |                     </div>
479 |                   </div>
480 |                 </div>
481 |               </div>
482 | 
483 |               {/* Back Button */}
484 |               <div className="text-center mt-8">
485 |                 <Link href="/">
486 |                   <div className="border-4 border-red-600 bg-black hover:bg-red-600 hover:text-black transition-colors duration-150 px-8 py-4 inline-block">
487 |                     <div className="font-bold text-xl">
488 |                       ← BACK TO MAIN PROGRAM
489 |                     </div>
490 |                   </div>
491 |                 </Link>
492 |               </div>
493 | 
494 |               {/* Footer */}
495 |               <div className="mt-8 text-center">
496 |                 <div className="text-xs font-mono text-red-600">
497 |                   WARNING: AI ROASTS MAY CAUSE EMOTIONAL DAMAGE • USE AT YOUR OWN RISK
498 |                 </div>
499 |               </div>
500 |             </div>
501 |           </div>
502 |         </div>
503 |       </div>
504 |     </div>
505 |   );
506 | }
507 | 
508 | export default function VoiceAgentPage() {
509 |   return <OpenAIVisionMVP />;
510 | }
511 | 


--------------------------------------------------------------------------------
/app/voice-agent/page_new.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | import React, { useRef, useEffect, useState } from 'react';
  3 | import Vapi from '@vapi-ai/web';
  4 | import { SecureVisionProcessor } from './secure-vision';
  5 | import { config } from '@fortawesome/fontawesome-svg-core';
  6 | import Link from 'next/link';
  7 | 
  8 | config.autoAddCss = false;
  9 | 
 10 | const originalConsoleWarn = console.warn;
 11 | console.warn = (...args) => {
 12 |   const message = args.join(' ');
 13 |   if (message.includes('Ignoring settings for browser- or platform-unsupported input processor(s): audio')) {
 14 |     return;
 15 |   }
 16 |   originalConsoleWarn.apply(console, args);
 17 | };
 18 | 
 19 | function OpenAIVisionMVP() {
 20 |   const videoRef = useRef<HTMLVideoElement>(null);
 21 |   const canvasRef = useRef<HTMLCanvasElement>(null);
 22 |   const [hasCamera, setHasCamera] = useState(false);
 23 |   const [capturedImage, setCapturedImage] = useState<string | null>(null);
 24 |   const [vapi, setVapi] = useState<any>(null);
 25 |   const [callActive, setCallActive] = useState(false);
 26 |   const [visionProcessor, setVisionProcessor] = useState<SecureVisionProcessor | null>(null);
 27 |   const [lastVisionDescription, setLastVisionDescription] = useState<string>('');
 28 |   const [visionProcessing, setVisionProcessing] = useState(false);
 29 |   const [isClient, setIsClient] = useState(false);
 30 |   const [visionHistory, setVisionHistory] = useState<string[]>([]);
 31 |   const [isScreenSharing, setIsScreenSharing] = useState(false);
 32 | 
 33 |   const lastApiCallTime = useRef(0);
 34 |   const MIN_API_INTERVAL = 3000;
 35 | 
 36 |   const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
 37 |   const vapiAssistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
 38 | 
 39 |   useEffect(() => {
 40 |     setIsClient(true);
 41 |   }, []);
 42 | 
 43 |   useEffect(() => {
 44 |     if (!isClient) return;
 45 |     
 46 |     console.log('Screen capture is supported, auto-starting...');
 47 |     
 48 |     // Auto-start screen capture
 49 |     const autoStartScreenCapture = async () => {
 50 |       try {
 51 |         console.log('Auto-starting screen capture...');
 52 |         
 53 |         const stream = await navigator.mediaDevices.getDisplayMedia({ 
 54 |           video: {
 55 |             displaySurface: 'monitor',
 56 |             logicalSurface: true,
 57 |             cursor: 'always'
 58 |           },
 59 |           audio: false
 60 |         });
 61 |         
 62 |         console.log('Screen capture stream obtained:', stream);
 63 |         
 64 |         if (videoRef.current) {
 65 |           videoRef.current.srcObject = stream;
 66 |           setHasCamera(true);
 67 |           setIsScreenSharing(true);
 68 |           console.log('Screen capture started successfully');
 69 |         }
 70 |         
 71 |         // Handle stream ending (user stops sharing)
 72 |         stream.getVideoTracks()[0].onended = () => {
 73 |           console.log('Screen capture ended by user');
 74 |           setHasCamera(false);
 75 |           setIsScreenSharing(false);
 76 |         };
 77 |       } catch (err) {
 78 |         console.error('Auto screen capture error:', err);
 79 |         // Don't show alert for auto-start failures, just log them
 80 |         setHasCamera(false);
 81 |         setIsScreenSharing(false);
 82 |       }
 83 |     };
 84 |     
 85 |     // Start screen capture after a short delay to ensure component is fully mounted
 86 |     const timer = setTimeout(autoStartScreenCapture, 500);
 87 |     
 88 |     return () => {
 89 |       clearTimeout(timer);
 90 |       if (videoRef.current && videoRef.current.srcObject) {
 91 |         (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
 92 |       }
 93 |     };
 94 |   }, [isClient]);
 95 | 
 96 |   useEffect(() => {
 97 |     if (!isClient || !hasCamera || !callActive || !visionProcessor || !vapi) return;
 98 |     
 99 |     const continuousVisionProcessing = async () => {
100 |       if (videoRef.current && canvasRef.current) {
101 |         const ctx = canvasRef.current.getContext('2d');
102 |         if (ctx) {
103 |           ctx.drawImage(videoRef.current, 0, 0, 320, 240);
104 |           const dataUrl = canvasRef.current.toDataURL('image/jpeg');
105 |           setCapturedImage(dataUrl);
106 |           
107 |           const base64Data = dataUrl.split(',')[1];
108 |           
109 |           try {
110 |             setVisionProcessing(true);
111 |             lastApiCallTime.current = Date.now();
112 |             const description = await visionProcessor.forceAnalysis(base64Data, '');
113 |             
114 |             if (description) {
115 |               setLastVisionDescription(description);
116 |               
117 |               vapi.send({
118 |                 type: 'add-message',
119 |                 message: {
120 |                   role: 'system',
121 |                   content: `Visual context update: ${description}`,
122 |                 },
123 |               });
124 |               
125 |               setVisionHistory(prev => [description, ...prev.slice(0, 4)]);
126 |             }
127 |             setVisionProcessing(false);
128 |           } catch (error) {
129 |             console.error('Vision processing error:', error);
130 |             setVisionProcessing(false);
131 |           }
132 |         }
133 |       }
134 |     };
135 | 
136 |     const intervalId = setInterval(continuousVisionProcessing, MIN_API_INTERVAL);
137 |     return () => clearInterval(intervalId);
138 |   }, [isClient, hasCamera, callActive, visionProcessor, vapi]);
139 | 
140 |   useEffect(() => {
141 |     if (!isClient) return;
142 |     
143 |     const processor = new SecureVisionProcessor();
144 |     setVisionProcessor(processor);
145 |     
146 |     if (!vapiPublicKey) {
147 |       console.error('VAPI public key not found');
148 |       return;
149 |     }
150 | 
151 |     const vapiInstance = new Vapi(vapiPublicKey);
152 |     setVapi(vapiInstance);
153 | 
154 |     vapiInstance.on('call-start', () => {
155 |       setCallActive(true);
156 |     });
157 | 
158 |     vapiInstance.on('call-end', () => {
159 |       setCallActive(false);
160 |     });
161 | 
162 |     return () => {
163 |       vapiInstance.stop();
164 |     };
165 |   }, [isClient, vapiPublicKey]);
166 | 
167 |   const startCall = () => {
168 |     if (!vapi || !vapiAssistantId) {
169 |       console.error('Vapi or assistant ID not available');
170 |       return;
171 |     }
172 |     
173 |     vapi.start(vapiAssistantId);
174 |   };
175 | 
176 |   const endCall = () => {
177 |     if (vapi) {
178 |       vapi.stop();
179 |     }
180 |   };
181 | 
182 |   const startScreenCapture = async () => {
183 |     try {
184 |       console.log('Starting screen capture...');
185 |       
186 |       // Check if getDisplayMedia is supported
187 |       if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
188 |         throw new Error('Screen capture not supported in this browser');
189 |       }
190 |       
191 |       const stream = await navigator.mediaDevices.getDisplayMedia({ 
192 |         video: {
193 |           displaySurface: 'monitor',
194 |           logicalSurface: true,
195 |           cursor: 'always'
196 |         },
197 |         audio: false
198 |       });
199 |       
200 |       console.log('Screen capture stream obtained:', stream);
201 |       
202 |       if (videoRef.current) {
203 |         videoRef.current.srcObject = stream;
204 |         setHasCamera(true);
205 |         setIsScreenSharing(true);
206 |         console.log('Screen capture started successfully');
207 |       }
208 |       
209 |       // Handle stream ending (user stops sharing)
210 |       stream.getVideoTracks()[0].onended = () => {
211 |         console.log('Screen capture ended by user');
212 |         setHasCamera(false);
213 |         setIsScreenSharing(false);
214 |       };
215 |     } catch (err) {
216 |       console.error('Screen capture error:', err);
217 |       alert(`Screen capture failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
218 |       setHasCamera(false);
219 |       setIsScreenSharing(false);
220 |     }
221 |   };
222 | 
223 |   const stopScreenCapture = () => {
224 |     if (videoRef.current && videoRef.current.srcObject) {
225 |       (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
226 |       setHasCamera(false);
227 |       setIsScreenSharing(false);
228 |     }
229 |   };
230 | 
231 |   if (!isClient) {
232 |     return <div className="min-h-screen bg-gray-500"></div>;
233 |   }
234 | 
235 |   return (
236 |     <div className="min-h-screen bg-gray-500 text-white" style={{ fontFamily: 'monospace, Courier, "Courier New"' }}>
237 |       {/* Desktop Background Pattern */}
238 |       <div className="min-h-screen bg-gray-500 p-8" style={{
239 |         backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23404040' fill-opacity='0.1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`
240 |       }}>
241 |         
242 |         {/* Main Application Window */}
243 |         <div className="max-w-5xl mx-auto">
244 |           <div className="bg-gray-300 border-4 border-gray-600" style={{
245 |             borderStyle: 'outset',
246 |             borderTopColor: '#ffffff',
247 |             borderLeftColor: '#ffffff', 
248 |             borderRightColor: '#404040',
249 |             borderBottomColor: '#404040'
250 |           }}>
251 |             
252 |             {/* Window Title Bar */}
253 |             <div className="bg-red-600 px-2 py-1 flex items-center justify-between border-b-2 border-black">
254 |               <div className="flex items-center space-x-2">
255 |                 <div className="text-white font-bold text-sm tracking-wider">
256 |                   🎤 ROASTMASTER.EXE - LIVE AI VISION + VOICE
257 |                 </div>
258 |               </div>
259 |               <div className="flex space-x-1">
260 |                 <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-gray-300"
261 |                         style={{
262 |                           borderStyle: 'outset',
263 |                           borderTopColor: '#ffffff',
264 |                           borderLeftColor: '#ffffff',
265 |                           borderRightColor: '#404040', 
266 |                           borderBottomColor: '#404040'
267 |                         }}>
268 |                   _
269 |                 </button>
270 |                 <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-gray-300"
271 |                         style={{
272 |                           borderStyle: 'outset',
273 |                           borderTopColor: '#ffffff',
274 |                           borderLeftColor: '#ffffff',
275 |                           borderRightColor: '#404040',
276 |                           borderBottomColor: '#404040'
277 |                         }}>
278 |                   □
279 |                 </button>
280 |                 <Link href="/">
281 |                   <button className="bg-gray-400 border border-gray-600 px-2 py-0 text-black text-xs font-bold hover:bg-red-500"
282 |                           style={{
283 |                             borderStyle: 'outset',
284 |                             borderTopColor: '#ffffff',
285 |                             borderLeftColor: '#ffffff',
286 |                             borderRightColor: '#404040',
287 |                             borderBottomColor: '#404040'
288 |                           }}>
289 |                     ×
290 |                   </button>
291 |                 </Link>
292 |               </div>
293 |             </div>
294 | 
295 |             {/* Window Content */}
296 |             <div className="p-8 bg-black">
297 |               {/* Header */}
298 |               <div className="border-2 border-red-600 p-6 mb-8 bg-black">
299 |                 <div className="text-center">
300 |                   <div className="text-red-600 text-5xl font-bold mb-4 tracking-wider">
301 |                     ROAST MASTER
302 |                   </div>
303 |                   <div className="bg-red-600 text-black px-4 py-2 inline-block font-bold text-sm mb-4">
304 |                     [LIVE AI • SEES EVERYTHING • ROASTS ACCORDINGLY]
305 |                   </div>
306 |                   <div className="text-white text-lg font-mono max-w-3xl mx-auto">
307 |                     &gt; SHARE YOUR SCREEN
308 |                     <br />
309 |                     &gt; AI ANALYZES VISUAL CONTEXT  
310 |                     <br />
311 |                     &gt; DELIVERS REAL-TIME ROASTS
312 |                   </div>
313 |                 </div>
314 |               </div>
315 | 
316 |               {/* Main Content Grid */}
317 |               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
318 |                 
319 |                 {/* Screen Recording Section */}
320 |                 <div className="border-2 border-red-600 p-6 bg-black">
321 |                   <div className="border-2 border-red-600 bg-black mb-4 text-center p-2">
322 |                     <div className="text-red-600 font-bold text-lg">
323 |                       [SCREEN RECORDING]
324 |                     </div>
325 |                   </div>
326 |                   
327 |                   {hasCamera ? (
328 |                     <div className="relative">
329 |                       <video 
330 |                         ref={videoRef} 
331 |                         autoPlay 
332 |                         playsInline 
333 |                         muted
334 |                         className="w-full border-2 border-red-600 bg-black"
335 |                         style={{ aspectRatio: '16/9' }}
336 |                       />
337 |                       <canvas 
338 |                         ref={canvasRef} 
339 |                         width={320} 
340 |                         height={240}
341 |                         className="hidden"
342 |                       />
343 |                       
344 |                       {/* Screen Recording Controls */}
345 |                       <div className="mt-4 flex gap-2">
346 |                         <button
347 |                           onClick={stopScreenCapture}
348 |                           className="border-2 border-red-600 bg-black text-red-600 px-3 py-1 font-bold text-sm hover:bg-red-600 hover:text-black transition-colors"
349 |                         >
350 |                           STOP SHARING
351 |                         </button>
352 |                       </div>
353 |                     </div>
354 |                   ) : (
355 |                     <div className="border-2 border-red-600 bg-black p-8 text-center">
356 |                       <div className="text-red-600 text-2xl mb-4">🖥️</div>
357 |                       <div className="text-white font-mono">
358 |                         NO SCREEN SHARING
359 |                         <br />
360 |                         CLICK "START SHARING" TO BEGIN
361 |                       </div>
362 |                       <button
363 |                         onClick={startScreenCapture}
364 |                         className="mt-4 border-2 border-red-600 bg-black text-red-600 px-4 py-2 font-bold text-sm hover:bg-red-600 hover:text-black transition-colors"
365 |                       >
366 |                         START SHARING
367 |                       </button>
368 |                     </div>
369 |                   )}
370 |                 </div>
371 | 
372 |                 {/* Controls Section */}
373 |                 <div className="border-2 border-red-600 p-6 bg-black">
374 |                   <div className="border-2 border-red-600 bg-black mb-4 text-center p-2">
375 |                     <div className="text-red-600 font-bold text-lg">
376 |                       [ROAST CONTROLS]
377 |                     </div>
378 |                   </div>
379 |                   
380 |                   {/* Call Status */}
381 |                   <div className="mb-6 text-center">
382 |                     <div className={`border-2 px-4 py-2 font-bold text-lg ${
383 |                       callActive 
384 |                         ? 'border-green-500 text-green-500 bg-black' 
385 |                         : 'border-red-600 text-red-600 bg-black'
386 |                     }`}>
387 |                       {callActive ? '[ROASTING ACTIVE]' : '[READY TO ROAST]'}
388 |                     </div>
389 |                   </div>
390 | 
391 |                   {/* Main Action Button */}
392 |                   <div className="text-center mb-6">
393 |                     {!callActive ? (
394 |                       <button
395 |                         onClick={startCall}
396 |                         disabled={!hasCamera}
397 |                         className="border-4 border-red-600 bg-black text-red-600 px-8 py-4 font-bold text-xl hover:bg-red-600 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
398 |                       >
399 |                         START ROASTING
400 |                       </button>
401 |                     ) : (
402 |                       <button
403 |                         onClick={endCall}
404 |                         className="border-4 border-red-600 bg-red-600 text-black px-8 py-4 font-bold text-xl hover:bg-black hover:text-red-600 transition-colors"
405 |                       >
406 |                         STOP ROASTING
407 |                       </button>
408 |                     )}
409 |                   </div>
410 | 
411 |                   {/* Vision Status */}
412 |                   {callActive && (
413 |                     <div className="border-2 border-red-600 p-4 bg-black">
414 |                       <div className="text-red-600 font-bold mb-2">
415 |                         AI VISION STATUS:
416 |                       </div>
417 |                       <div className="text-white font-mono text-sm">
418 |                         {visionProcessing ? (
419 |                           <div className="text-yellow-500">
420 |                             [ANALYZING IMAGE...]
421 |                           </div>
422 |                         ) : (
423 |                           <div className="text-green-500">
424 |                             [VISION ACTIVE]
425 |                           </div>
426 |                         )}
427 |                       </div>
428 |                       
429 |                       {lastVisionDescription && (
430 |                         <div className="mt-3">
431 |                           <div className="text-red-600 font-bold text-xs mb-1">
432 |                             LAST VISION ANALYSIS:
433 |                           </div>
434 |                           <div className="text-white font-mono text-xs border border-red-600 p-2 bg-black">
435 |                             {lastVisionDescription}
436 |                           </div>
437 |                         </div>
438 |                       )}
439 |                     </div>
440 |                   )}
441 |                 </div>
442 |               </div>
443 | 
444 |               {/* Instructions */}
445 |               <div className="border-4 border-red-600 p-6 mt-8 bg-black">
446 |                 <div className="text-center">
447 |                   <div className="text-red-600 text-2xl font-bold mb-4">
448 |                     HOW TO GET ROASTED
449 |                   </div>
450 |                   <div className="text-white font-mono text-sm grid grid-cols-1 md:grid-cols-3 gap-4">
451 |                     <div>
452 |                       <div className="text-red-600 font-bold mb-2">1. SHARE SCREEN</div>
453 |                       <div>CLICK "START SHARING" TO SHARE YOUR SCREEN</div>
454 |                     </div>
455 |                     <div>
456 |                       <div className="text-red-600 font-bold mb-2">2. START ROASTING</div>
457 |                       <div>CLICK THE BIG RED BUTTON TO BEGIN THE DESTRUCTION</div>
458 |                     </div>
459 |                     <div>
460 |                       <div className="text-red-600 font-bold mb-2">3. PREPARE YOUR EGO</div>
461 |                       <div>AI WILL ANALYZE AND DELIVER SURGICAL ROASTS</div>
462 |                     </div>
463 |                   </div>
464 |                 </div>
465 |               </div>
466 | 
467 |               {/* Back Button */}
468 |               <div className="text-center mt-8">
469 |                 <Link href="/">
470 |                   <div className="border-4 border-red-600 bg-black hover:bg-red-600 hover:text-black transition-colors duration-150 px-8 py-4 inline-block">
471 |                     <div className="font-bold text-xl">
472 |                       ← BACK TO MAIN PROGRAM
473 |                     </div>
474 |                   </div>
475 |                 </Link>
476 |               </div>
477 | 
478 |               {/* Footer */}
479 |               <div className="mt-8 text-center">
480 |                 <div className="text-xs font-mono text-red-600">
481 |                   WARNING: AI ROASTS MAY CAUSE EMOTIONAL DAMAGE • USE AT YOUR OWN RISK
482 |                 </div>
483 |               </div>
484 |             </div>
485 |           </div>
486 |         </div>
487 |       </div>
488 |     </div>
489 |   );
490 | }
491 | 
492 | export default function VoiceAgentPage() {
493 |   return <OpenAIVisionMVP />;
494 | }
495 | 


--------------------------------------------------------------------------------
/app/voice-agent/page_old.tsx:
--------------------------------------------------------------------------------
  1 | 'use client';
  2 | import React, { useRef, useEffect, useState } from 'react';
  3 | import Vapi from '@vapi-ai/web';
  4 | import { SecureVisionProcessor } from './secure-vision';
  5 | import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  6 | import { faPhone } from '@fortawesome/free-solid-svg-icons';
  7 | import { config } from '@fortawesome/fontawesome-svg-core';
  8 | 
  9 | config.autoAddCss = false;
 10 | 
 11 | const originalConsoleWarn = console.warn;
 12 | console.warn = (...args) => {
 13 |   const message = args.join(' ');
 14 |   if (message.includes('Ignoring settings for browser- or platform-unsupported input processor(s): audio')) {
 15 |     return;
 16 |   }
 17 |   originalConsoleWarn.apply(console, args);
 18 | };
 19 | 
 20 | function OpenAIVisionMVP() {
 21 |   const videoRef = useRef<HTMLVideoElement>(null);
 22 |   const canvasRef = useRef<HTMLCanvasElement>(null);
 23 |   const [hasCamera, setHasCamera] = useState(false);
 24 |   const [capturedImage, setCapturedImage] = useState<string | null>(null);
 25 |   const [vapi, setVapi] = useState<any>(null);
 26 |   const [callActive, setCallActive] = useState(false);
 27 |   const [visionProcessor, setVisionProcessor] = useState<SecureVisionProcessor | null>(null);
 28 |   const [lastVisionDescription, setLastVisionDescription] = useState<string>('');
 29 |   const [visionProcessing, setVisionProcessing] = useState(false);
 30 |   const [isClient, setIsClient] = useState(false);
 31 |   const [visionHistory, setVisionHistory] = useState<string[]>([]);
 32 |   const [isScreenSharing, setIsScreenSharing] = useState(false);
 33 | 
 34 |   const lastApiCallTime = useRef(0);
 35 |   const MIN_API_INTERVAL = 3000;
 36 | 
 37 |   const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
 38 |   const vapiAssistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
 39 | 
 40 |   useEffect(() => {
 41 |     setIsClient(true);
 42 |   }, []);
 43 | 
 44 |   useEffect(() => {
 45 |     if (!isClient) return;
 46 |     
 47 |     console.log('Component mounted, checking screen capture support...');
 48 |     
 49 |     // Check if screen capture is supported
 50 |     if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
 51 |       console.error('Screen capture not supported in this browser');
 52 |       alert('Screen capture is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
 53 |       return;
 54 |     }
 55 |     
 56 |     console.log('Screen capture is supported, auto-starting...');
 57 |     
 58 |     // Auto-start screen capture
 59 |     const autoStartScreenCapture = async () => {
 60 |       try {
 61 |         console.log('Auto-starting screen capture...');
 62 |         
 63 |         const stream = await navigator.mediaDevices.getDisplayMedia({ 
 64 |           video: {
 65 |             displaySurface: 'monitor',
 66 |             logicalSurface: true,
 67 |             cursor: 'always'
 68 |           },
 69 |           audio: false
 70 |         });
 71 |         
 72 |         console.log('Screen capture stream obtained:', stream);
 73 |         
 74 |         if (videoRef.current) {
 75 |           videoRef.current.srcObject = stream;
 76 |           setHasCamera(true);
 77 |           setIsScreenSharing(true);
 78 |           console.log('Screen capture started successfully');
 79 |         }
 80 |         
 81 |         // Handle stream ending (user stops sharing)
 82 |         stream.getVideoTracks()[0].onended = () => {
 83 |           console.log('Screen capture ended by user');
 84 |           setHasCamera(false);
 85 |           setIsScreenSharing(false);
 86 |         };
 87 |       } catch (err) {
 88 |         console.error('Auto screen capture error:', err);
 89 |         // Don't show alert for auto-start failures, just log them
 90 |         setHasCamera(false);
 91 |         setIsScreenSharing(false);
 92 |       }
 93 |     };
 94 |     
 95 |     // Start screen capture after a short delay to ensure component is fully mounted
 96 |     const timer = setTimeout(autoStartScreenCapture, 500);
 97 |     
 98 |     return () => {
 99 |       clearTimeout(timer);
100 |       if (videoRef.current && videoRef.current.srcObject) {
101 |         (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
102 |       }
103 |     };
104 |   }, [isClient]);
105 | 
106 |   useEffect(() => {
107 |     if (!isClient || !hasCamera || !callActive || !visionProcessor || !vapi) return;
108 |     
109 |     const continuousVisionProcessing = async () => {
110 |       if (videoRef.current && canvasRef.current) {
111 |         const ctx = canvasRef.current.getContext('2d');
112 |         if (ctx) {
113 |           ctx.drawImage(videoRef.current, 0, 0, 320, 240);
114 |           const dataUrl = canvasRef.current.toDataURL('image/jpeg');
115 |           setCapturedImage(dataUrl);
116 |           
117 |           const base64Data = dataUrl.split(',')[1];
118 |           
119 |           try {
120 |             setVisionProcessing(true);
121 |             lastApiCallTime.current = Date.now();
122 |             const description = await visionProcessor.forceAnalysis(base64Data, '');
123 |             
124 |             if (description) {
125 |               setLastVisionDescription(description);
126 |               
127 |               vapi.send({
128 |                 type: 'add-message',
129 |                 message: {
130 |                   role: 'system',
131 |                   content: `Visual context update: ${description}`,
132 |                 },
133 |                 triggerResponseEnabled: false,
134 |               });
135 |               
136 |               setVisionHistory(prev => {
137 |                 const newEntry = `${new Date().toLocaleTimeString()}: ${description}`;
138 |                 const newHistory = [...prev, newEntry];
139 |                 return newHistory.slice(-5);
140 |               });
141 |             }
142 |           } catch (error) {
143 |           } finally {
144 |             setVisionProcessing(false);
145 |           }
146 |         }
147 |       }
148 |     };
149 |     
150 |     const initialTimer = setTimeout(continuousVisionProcessing, 1000);
151 |     const interval = setInterval(continuousVisionProcessing, 3000);
152 |     
153 |     return () => {
154 |       clearTimeout(initialTimer);
155 |       clearInterval(interval);
156 |     };
157 |   }, [isClient, hasCamera, callActive, visionProcessor, vapi]);
158 | 
159 |   useEffect(() => {
160 |     if (!isClient || !hasCamera || callActive) return;
161 |     
162 |     const interval = setInterval(() => {
163 |       if (videoRef.current && canvasRef.current) {
164 |         const ctx = canvasRef.current.getContext('2d');
165 |         if (ctx) {
166 |           ctx.drawImage(videoRef.current, 0, 0, 320, 240);
167 |           const dataUrl = canvasRef.current.toDataURL('image/jpeg');
168 |           setCapturedImage(dataUrl);
169 |         }
170 |       }
171 |     }, 1000);
172 |     
173 |     return () => clearInterval(interval);
174 |   }, [isClient, hasCamera, callActive]);
175 | 
176 |   useEffect(() => {
177 |     if (!isClient || !vapiPublicKey) return;
178 |     
179 |     try {
180 |       const v = new Vapi(vapiPublicKey);
181 |       
182 |       v.on('message', (message: any) => {
183 |       });
184 |       
185 |       v.on('call-start', () => {
186 |         setCallActive(true);
187 |       });
188 |       
189 |       v.on('call-end', () => {
190 |         setCallActive(false);
191 |       });
192 |       
193 |       v.on('error', (error) => {
194 |         if (!error.message?.includes('audio processor')) {
195 |           setCallActive(false);
196 |         }
197 |       });
198 |       
199 |       setVapi(v);
200 |     } catch (error) {
201 |     }
202 |     
203 |     return () => {
204 |       if (vapi) {
205 |         try {
206 |           vapi.stop();
207 |         } catch (error) {
208 |         }
209 |       }
210 |     };
211 |   }, [isClient, vapiPublicKey]);
212 | 
213 |   useEffect(() => {
214 |     if (!isClient) return;
215 |     
216 |     try {
217 |       const processor = new SecureVisionProcessor({
218 |         onDescriptionUpdate: (description) => {
219 |           setLastVisionDescription(description);
220 |         },
221 |         onProcessingStateChange: (isProcessing) => {
222 |           setVisionProcessing(isProcessing);
223 |         }
224 |       });
225 |       setVisionProcessor(processor);
226 |     } catch (error) {
227 |     }
228 |   }, [isClient]);
229 | 
230 |   const handleStartCall = () => {
231 |     if (vapi && vapiAssistantId) {
232 |       try {
233 |         vapi.start(vapiAssistantId);
234 |       } catch (error) {
235 |       }
236 |     }
237 |   };
238 |   
239 |   const handleStopCall = () => {
240 |     if (vapi) {
241 |       try {
242 |         vapi.stop();
243 |       } catch (error) {
244 |       }
245 |     }
246 |   };
247 | 
248 |   const analyzeCurrentFrame = async (userPrompt?: string) => {
249 |     if (!visionProcessor || !videoRef.current || !canvasRef.current) return;
250 |     
251 |     const now = Date.now();
252 |     if (now - lastApiCallTime.current < MIN_API_INTERVAL) {
253 |       const waitTime = Math.ceil((MIN_API_INTERVAL - (now - lastApiCallTime.current)) / 1000);
254 |       return;
255 |     }
256 |     
257 |     try {
258 |       setVisionProcessing(true);
259 |       const ctx = canvasRef.current.getContext('2d');
260 |       if (ctx) {
261 |         ctx.drawImage(videoRef.current, 0, 0, 320, 240);
262 |         const dataUrl = canvasRef.current.toDataURL('image/jpeg');
263 |         const base64Data = dataUrl.split(',')[1];
264 |         
265 |         lastApiCallTime.current = now;
266 |         const description = await visionProcessor.forceAnalysis(base64Data, userPrompt || '');
267 |         
268 |         if (description && callActive) {
269 |           setLastVisionDescription(description);
270 |           setVisionHistory(prev => {
271 |             const contextEntry = userPrompt 
272 |               ? `${new Date().toLocaleTimeString()}: ${description} (User asked: "${userPrompt}")`
273 |               : `${new Date().toLocaleTimeString()}: ${description}`;
274 |             const newHistory = [...prev, contextEntry];
275 |             return newHistory.slice(-5);
276 |           });
277 |         }
278 |       }
279 |     } catch (error) {
280 |     } finally {
281 |       setVisionProcessing(false);
282 |     }
283 |   };
284 | 
285 |   const startScreenCapture = async () => {
286 |     try {
287 |       console.log('Starting screen capture...');
288 |       
289 |       // Check if getDisplayMedia is supported
290 |       if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
291 |         throw new Error('Screen capture not supported in this browser');
292 |       }
293 |       
294 |       const stream = await navigator.mediaDevices.getDisplayMedia({ 
295 |         video: {
296 |           displaySurface: 'monitor',
297 |           logicalSurface: true,
298 |           cursor: 'always'
299 |         },
300 |         audio: false
301 |       });
302 |       
303 |       console.log('Screen capture stream obtained:', stream);
304 |       
305 |       if (videoRef.current) {
306 |         videoRef.current.srcObject = stream;
307 |         setHasCamera(true);
308 |         setIsScreenSharing(true);
309 |         console.log('Screen capture started successfully');
310 |       }
311 |       
312 |       // Handle stream ending (user stops sharing)
313 |       stream.getVideoTracks()[0].onended = () => {
314 |         console.log('Screen capture ended by user');
315 |         setHasCamera(false);
316 |         setIsScreenSharing(false);
317 |       };
318 |     } catch (err) {
319 |       console.error('Screen capture error:', err);
320 |       alert(`Screen capture failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
321 |       setHasCamera(false);
322 |       setIsScreenSharing(false);
323 |     }
324 |   };
325 | 
326 |   const stopScreenCapture = () => {
327 |     if (videoRef.current && videoRef.current.srcObject) {
328 |       (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
329 |       setHasCamera(false);
330 |       setIsScreenSharing(false);
331 |     }
332 |   };
333 | 
334 |   return (
335 |     <div className="relative w-full h-screen bg-black overflow-hidden">
336 |       <div className="relative w-full h-full flex items-center justify-center">
337 |         {isClient ? (
338 |           <>
339 |             <video 
340 |               ref={videoRef} 
341 |               autoPlay 
342 |               muted 
343 |               playsInline
344 |               className="w-full h-full object-cover"
345 |             />
346 |             <canvas ref={canvasRef} width={320} height={240} className="hidden" />
347 |           </>
348 |         ) : (
349 |           <div className="w-full h-full bg-black flex items-center justify-center">
350 |           </div>
351 |         )}
352 | 
353 |         <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
354 |           <div className="flex items-center justify-between">
355 |             <div className="text-white font-medium text-lg">
356 |               Vapi Live
357 |             </div>
358 |             <div className="flex items-center space-x-2">
359 |               {!hasCamera ? (
360 |                 <button
361 |                   onClick={startScreenCapture}
362 |                   className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200"
363 |                   title="Start screen sharing"
364 |                 >
365 |                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
366 |                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
367 |                   </svg>
368 |                 </button>
369 |               ) : (
370 |                 <button
371 |                   onClick={stopScreenCapture}
372 |                   className="bg-red-500/20 hover:bg-red-500/30 rounded-full p-2 transition-all duration-200"
373 |                   title="Stop screen sharing"
374 |                 >
375 |                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
376 |                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
377 |                   </svg>
378 |                 </button>
379 |               )}
380 |               {visionProcessing && (
381 |                 <div className="flex items-center space-x-1 text-white/80 text-sm">
382 |                   <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
383 |                   <span>Analyzing...</span>
384 |                 </div>
385 |               )}
386 |               {callActive && (
387 |                 <div className="flex items-center space-x-1 text-green-400 text-sm">
388 |                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
389 |                   <span>Live</span>
390 |                 </div>
391 |               )}
392 |             </div>
393 |           </div>
394 |         </div>
395 | 
396 |         <div className="absolute bottom-0 left-0 right-0 pb-safe bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-md">
397 |           <div className="flex items-center justify-between px-4 py-6 pb-10 md:py-6 md:pb-8 md:min-h-[120px] min-h-[160px]">
398 |           <div className="w-16"></div>
399 |           
400 |           <button
401 |             onClick={callActive ? handleStopCall : handleStartCall}
402 |             className={`
403 |               w-20 h-20 rounded-full flex items-center justify-center
404 |               transition-all duration-200 backdrop-blur-sm
405 |               ${callActive 
406 |                 ? 'bg-red-500 hover:bg-red-600 border-4 border-red-300 active:scale-95' 
407 |                 : 'bg-white hover:bg-gray-100 active:scale-95'
408 |               }
409 |             `}
410 |           >
411 |             {callActive ? (
412 |               <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
413 |                 <path d="M6 6h12v12H6z"/>
414 |               </svg>
415 |             ) : (
416 |               <FontAwesomeIcon 
417 |                 icon={faPhone} 
418 |                 size="lg"
419 |                 style={{ fontSize: '24px', color: 'black' }}
420 |               />
421 |             )}
422 |           </button>
423 | 
424 |           <button
425 |                                     onClick={() => analyzeCurrentFrame("What's on this screen?")}
426 |             disabled={!callActive || !visionProcessor || visionProcessing}
427 |             className={`
428 |               w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center
429 |               transition-all duration-200 backdrop-blur-sm
430 |               ${(!callActive || !visionProcessor || visionProcessing) 
431 |                 ? 'bg-gray-600/50 cursor-not-allowed' 
432 |                 : 'bg-white/20 hover:bg-white/30 active:scale-95'
433 |               }
434 |             `}
435 |           >
436 |             <div className={`
437 |               w-8 h-8 rounded-full 
438 |               ${visionProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-white'}
439 |             `} />
440 |           </button>
441 |           </div>
442 |         </div>
443 | 
444 |         {isClient && (!vapiPublicKey || !vapiAssistantId) && (
445 |           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500/90 backdrop-blur-sm rounded-2xl p-6 text-white text-center max-w-sm mx-4">
446 |             <div className="font-medium mb-2">Setup Required</div>
447 |             <div className="text-sm opacity-90">
448 |               Please set your Vapi credentials in the environment variables.
449 |             </div>
450 |           </div>
451 |         )}
452 |       </div>
453 |     </div>
454 |   );
455 | }
456 | 
457 | export default function Home() {
458 |   return <OpenAIVisionMVP />;
459 | }
460 | 


--------------------------------------------------------------------------------
/app/voice-agent/secure-vision.ts:
--------------------------------------------------------------------------------
  1 | interface SecureVisionFrame {
  2 |   id: string;
  3 |   imageData: string;
  4 |   timestamp: number;
  5 |   priority: 'low' | 'medium' | 'high';
  6 |   userPrompt?: string;
  7 | }
  8 | 
  9 | interface VisionResponse {
 10 |   description: string;
 11 |   timestamp: number;
 12 |   success: boolean;
 13 |   error?: string;
 14 | }
 15 | 
 16 | export class SecureVisionProcessor {
 17 |   private frameQueue: SecureVisionFrame[] = [];
 18 |   private isBackgroundProcessing = false;
 19 |   private currentDescription = '';
 20 |   private lastSignificantChange = 0;
 21 |   private frameCounter = 0;
 22 |   private avgProcessingTime = 2000;
 23 |   private successRate = 1.0;
 24 |   private onDescriptionUpdate?: (description: string) => void;
 25 |   private onProcessingStateChange?: (isProcessing: boolean) => void;
 26 | 
 27 |   constructor(callbacks?: {
 28 |     onDescriptionUpdate?: (description: string) => void;
 29 |     onProcessingStateChange?: (isProcessing: boolean) => void;
 30 |   }) {
 31 |     this.onDescriptionUpdate = callbacks?.onDescriptionUpdate;
 32 |     this.onProcessingStateChange = callbacks?.onProcessingStateChange;
 33 | 
 34 |     // DISABLED: Background processor - using direct calls for automatic processing
 35 |     // this.startBackgroundProcessor();
 36 |   }
 37 | 
 38 |   addFrame(imageBase64: string, userPrompt?: string): string {
 39 |     return this.currentDescription;
 40 |   }
 41 | 
 42 |   private shouldProcessFrame(): boolean {
 43 |     const timeSinceLastChange = Date.now() - this.lastSignificantChange;
 44 |     
 45 |     if (timeSinceLastChange < 5000) return this.frameCounter % 2 === 0;
 46 |     if (timeSinceLastChange < 15000) return this.frameCounter % 4 === 0;
 47 |     return this.frameCounter % 8 === 0;
 48 |   }
 49 | 
 50 |   private enqueueFrame(frame: SecureVisionFrame) {
 51 |     this.frameQueue = this.frameQueue.filter(f => 
 52 |       f.priority !== 'low' || Date.now() - f.timestamp < 5000
 53 |     );
 54 | 
 55 |     if (frame.priority === 'high') {
 56 |       this.frameQueue.unshift(frame);
 57 |     } else {
 58 |       this.frameQueue.push(frame);
 59 |     }
 60 | 
 61 |     if (this.frameQueue.length > 10) {
 62 |       this.frameQueue = this.frameQueue.slice(-10);
 63 |     }
 64 |   }
 65 | 
 66 |   private startBackgroundProcessor() {
 67 |     const processNext = async () => {
 68 |       if (this.frameQueue.length === 0) {
 69 |         setTimeout(processNext, 1000);
 70 |         return;
 71 |       }
 72 | 
 73 |       if (this.isBackgroundProcessing) {
 74 |         setTimeout(processNext, 500);
 75 |         return;
 76 |       }
 77 | 
 78 |       const frame = this.frameQueue.shift()!;
 79 |       await this.processFrameInBackground(frame);
 80 |       
 81 |       setTimeout(processNext, 2000);
 82 |     };
 83 | 
 84 |     processNext();
 85 |   }
 86 | 
 87 |   private async processFrameInBackground(frame: SecureVisionFrame) {
 88 |     this.isBackgroundProcessing = true;
 89 |     this.onProcessingStateChange?.(true);
 90 |     
 91 |     const startTime = Date.now();
 92 | 
 93 |     try {
 94 |       const response = await fetch('/api/vision', {
 95 |         method: 'POST',
 96 |         headers: {
 97 |           'Content-Type': 'application/json',
 98 |         },
 99 |         body: JSON.stringify({
100 |           imageBase64: frame.imageData,
101 |           userPrompt: frame.userPrompt
102 |         })
103 |       });
104 | 
105 |       if (!response.ok) {
106 |         if (response.status === 429) {
107 |           const errorData = await response.json();
108 |           return;
109 |         }
110 |         throw new Error(`API call failed: ${response.status}`);
111 |       }
112 | 
113 |       const result: VisionResponse = await response.json();
114 |       
115 |       if (!result.success) {
116 |         throw new Error(result.error || 'Vision processing failed');
117 |       }
118 | 
119 |       const description = result.description;
120 |       const processingTime = Date.now() - startTime;
121 | 
122 |       this.updateMetrics(processingTime, true);
123 | 
124 |       if (this.isSignificantChange(description)) {
125 |         this.currentDescription = description;
126 |         this.lastSignificantChange = Date.now();
127 |         this.onDescriptionUpdate?.(description);
128 |       }
129 | 
130 |     } catch (error) {
131 |       this.updateMetrics(Date.now() - startTime, false);
132 |     } finally {
133 |       this.isBackgroundProcessing = false;
134 |       this.onProcessingStateChange?.(false);
135 |     }
136 |   }
137 | 
138 |   private isSignificantChange(newDescription: string): boolean {
139 |     if (!this.currentDescription) return true;
140 | 
141 |     const currentWords = new Set(this.currentDescription.toLowerCase().split(' '));
142 |     const newWords = new Set(newDescription.toLowerCase().split(' '));
143 |     
144 |     const intersection = new Set([...currentWords].filter(x => newWords.has(x)));
145 |     const similarity = intersection.size / Math.max(currentWords.size, newWords.size);
146 |     
147 |     return similarity < 0.7;
148 |   }
149 | 
150 |   private updateMetrics(processingTime: number, success: boolean) {
151 |     this.avgProcessingTime = this.avgProcessingTime * 0.8 + processingTime * 0.2;
152 |     this.successRate = this.successRate * 0.9 + (success ? 1 : 0) * 0.1;
153 |   }
154 | 
155 |   // Public interface methods
156 |   getCurrentDescription(): string {
157 |     return this.currentDescription;
158 |   }
159 | 
160 |   isProcessing(): boolean {
161 |     return this.isBackgroundProcessing;
162 |   }
163 | 
164 |   getQueueLength(): number {
165 |     return this.frameQueue.length;
166 |   }
167 | 
168 |   getPerformanceMetrics() {
169 |     return {
170 |       avgProcessingTime: Math.round(this.avgProcessingTime),
171 |       successRate: Math.round(this.successRate * 100),
172 |       queueLength: this.frameQueue.length,
173 |       lastUpdate: this.lastSignificantChange
174 |     };
175 |   }
176 | 
177 |   async forceAnalysis(imageBase64: string, userPrompt: string): Promise<string> {
178 |     const frame: SecureVisionFrame = {
179 |       id: `force_${Date.now()}`,
180 |       imageData: imageBase64,
181 |       timestamp: Date.now(),
182 |       priority: 'high',
183 |       userPrompt
184 |     };
185 | 
186 |     await this.processFrameInBackground(frame);
187 |     return this.currentDescription;
188 |   }
189 | 
190 |   destroy() {
191 |     this.frameQueue = [];
192 |   }
193 | } 


--------------------------------------------------------------------------------
/next-env.d.ts:
--------------------------------------------------------------------------------
1 | /// <reference types="next" />
2 | /// <reference types="next/image-types/global" />
3 | 
4 | // NOTE: This file should not be edited
5 | // see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
6 | 


--------------------------------------------------------------------------------
/next.config.ts:
--------------------------------------------------------------------------------
1 | import type { NextConfig } from "next";
2 | 
3 | const nextConfig: NextConfig = {
4 |   /* config options here */
5 | };
6 | 
7 | export default nextConfig;
8 | 


--------------------------------------------------------------------------------
/node_modules/@alloc/quick-lru/index.d.ts:
--------------------------------------------------------------------------------
  1 | declare namespace QuickLRU {
  2 | 	interface Options<KeyType, ValueType> {
  3 | 		/**
  4 | 		The maximum number of milliseconds an item should remain in the cache.
  5 | 
  6 | 		@default Infinity
  7 | 
  8 | 		By default, `maxAge` will be `Infinity`, which means that items will never expire.
  9 | 		Lazy expiration upon the next write or read call.
 10 | 
 11 | 		Individual expiration of an item can be specified by the `set(key, value, maxAge)` method.
 12 | 		*/
 13 | 		readonly maxAge?: number;
 14 | 
 15 | 		/**
 16 | 		The maximum number of items before evicting the least recently used items.
 17 | 		*/
 18 | 		readonly maxSize: number;
 19 | 
 20 | 		/**
 21 | 		Called right before an item is evicted from the cache.
 22 | 
 23 | 		Useful for side effects or for items like object URLs that need explicit cleanup (`revokeObjectURL`).
 24 | 		*/
 25 | 		onEviction?: (key: KeyType, value: ValueType) => void;
 26 | 	}
 27 | }
 28 | 
 29 | declare class QuickLRU<KeyType, ValueType>
 30 | 	implements Iterable<[KeyType, ValueType]> {
 31 | 	/**
 32 | 	The stored item count.
 33 | 	*/
 34 | 	readonly size: number;
 35 | 
 36 | 	/**
 37 | 	Simple ["Least Recently Used" (LRU) cache](https://en.m.wikipedia.org/wiki/Cache_replacement_policies#Least_Recently_Used_.28LRU.29).
 38 | 
 39 | 	The instance is [`iterable`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols) so you can use it directly in a [`for…of`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/for...of) loop.
 40 | 
 41 | 	@example
 42 | 	```
 43 | 	import QuickLRU = require('quick-lru');
 44 | 
 45 | 	const lru = new QuickLRU({maxSize: 1000});
 46 | 
 47 | 	lru.set('🦄', '🌈');
 48 | 
 49 | 	lru.has('🦄');
 50 | 	//=> true
 51 | 
 52 | 	lru.get('🦄');
 53 | 	//=> '🌈'
 54 | 	```
 55 | 	*/
 56 | 	constructor(options: QuickLRU.Options<KeyType, ValueType>);
 57 | 
 58 | 	[Symbol.iterator](): IterableIterator<[KeyType, ValueType]>;
 59 | 
 60 | 	/**
 61 | 	Set an item. Returns the instance.
 62 | 
 63 | 	Individual expiration of an item can be specified with the `maxAge` option. If not specified, the global `maxAge` value will be used in case it is specified in the constructor, otherwise the item will never expire.
 64 | 
 65 | 	@returns The list instance.
 66 | 	*/
 67 | 	set(key: KeyType, value: ValueType, options?: {maxAge?: number}): this;
 68 | 
 69 | 	/**
 70 | 	Get an item.
 71 | 
 72 | 	@returns The stored item or `undefined`.
 73 | 	*/
 74 | 	get(key: KeyType): ValueType | undefined;
 75 | 
 76 | 	/**
 77 | 	Check if an item exists.
 78 | 	*/
 79 | 	has(key: KeyType): boolean;
 80 | 
 81 | 	/**
 82 | 	Get an item without marking it as recently used.
 83 | 
 84 | 	@returns The stored item or `undefined`.
 85 | 	*/
 86 | 	peek(key: KeyType): ValueType | undefined;
 87 | 
 88 | 	/**
 89 | 	Delete an item.
 90 | 
 91 | 	@returns `true` if the item is removed or `false` if the item doesn't exist.
 92 | 	*/
 93 | 	delete(key: KeyType): boolean;
 94 | 
 95 | 	/**
 96 | 	Delete all items.
 97 | 	*/
 98 | 	clear(): void;
 99 | 
100 | 	/**
101 | 	Update the `maxSize` in-place, discarding items as necessary. Insertion order is mostly preserved, though this is not a strong guarantee.
102 | 
103 | 	Useful for on-the-fly tuning of cache sizes in live systems.
104 | 	*/
105 | 	resize(maxSize: number): void;
106 | 
107 | 	/**
108 | 	Iterable for all the keys.
109 | 	*/
110 | 	keys(): IterableIterator<KeyType>;
111 | 
112 | 	/**
113 | 	Iterable for all the values.
114 | 	*/
115 | 	values(): IterableIterator<ValueType>;
116 | 
117 | 	/**
118 | 	Iterable for all entries, starting with the oldest (ascending in recency).
119 | 	*/
120 | 	entriesAscending(): IterableIterator<[KeyType, ValueType]>;
121 | 
122 | 	/**
123 | 	Iterable for all entries, starting with the newest (descending in recency).
124 | 	*/
125 | 	entriesDescending(): IterableIterator<[KeyType, ValueType]>;
126 | }
127 | 
128 | export = QuickLRU;
129 | 


--------------------------------------------------------------------------------
/node_modules/@alloc/quick-lru/index.js:
--------------------------------------------------------------------------------
  1 | 'use strict';
  2 | 
  3 | class QuickLRU {
  4 | 	constructor(options = {}) {
  5 | 		if (!(options.maxSize && options.maxSize > 0)) {
  6 | 			throw new TypeError('`maxSize` must be a number greater than 0');
  7 | 		}
  8 | 
  9 | 		if (typeof options.maxAge === 'number' && options.maxAge === 0) {
 10 | 			throw new TypeError('`maxAge` must be a number greater than 0');
 11 | 		}
 12 | 
 13 | 		this.maxSize = options.maxSize;
 14 | 		this.maxAge = options.maxAge || Infinity;
 15 | 		this.onEviction = options.onEviction;
 16 | 		this.cache = new Map();
 17 | 		this.oldCache = new Map();
 18 | 		this._size = 0;
 19 | 	}
 20 | 
 21 | 	_emitEvictions(cache) {
 22 | 		if (typeof this.onEviction !== 'function') {
 23 | 			return;
 24 | 		}
 25 | 
 26 | 		for (const [key, item] of cache) {
 27 | 			this.onEviction(key, item.value);
 28 | 		}
 29 | 	}
 30 | 
 31 | 	_deleteIfExpired(key, item) {
 32 | 		if (typeof item.expiry === 'number' && item.expiry <= Date.now()) {
 33 | 			if (typeof this.onEviction === 'function') {
 34 | 				this.onEviction(key, item.value);
 35 | 			}
 36 | 
 37 | 			return this.delete(key);
 38 | 		}
 39 | 
 40 | 		return false;
 41 | 	}
 42 | 
 43 | 	_getOrDeleteIfExpired(key, item) {
 44 | 		const deleted = this._deleteIfExpired(key, item);
 45 | 		if (deleted === false) {
 46 | 			return item.value;
 47 | 		}
 48 | 	}
 49 | 
 50 | 	_getItemValue(key, item) {
 51 | 		return item.expiry ? this._getOrDeleteIfExpired(key, item) : item.value;
 52 | 	}
 53 | 
 54 | 	_peek(key, cache) {
 55 | 		const item = cache.get(key);
 56 | 
 57 | 		return this._getItemValue(key, item);
 58 | 	}
 59 | 
 60 | 	_set(key, value) {
 61 | 		this.cache.set(key, value);
 62 | 		this._size++;
 63 | 
 64 | 		if (this._size >= this.maxSize) {
 65 | 			this._size = 0;
 66 | 			this._emitEvictions(this.oldCache);
 67 | 			this.oldCache = this.cache;
 68 | 			this.cache = new Map();
 69 | 		}
 70 | 	}
 71 | 
 72 | 	_moveToRecent(key, item) {
 73 | 		this.oldCache.delete(key);
 74 | 		this._set(key, item);
 75 | 	}
 76 | 
 77 | 	* _entriesAscending() {
 78 | 		for (const item of this.oldCache) {
 79 | 			const [key, value] = item;
 80 | 			if (!this.cache.has(key)) {
 81 | 				const deleted = this._deleteIfExpired(key, value);
 82 | 				if (deleted === false) {
 83 | 					yield item;
 84 | 				}
 85 | 			}
 86 | 		}
 87 | 
 88 | 		for (const item of this.cache) {
 89 | 			const [key, value] = item;
 90 | 			const deleted = this._deleteIfExpired(key, value);
 91 | 			if (deleted === false) {
 92 | 				yield item;
 93 | 			}
 94 | 		}
 95 | 	}
 96 | 
 97 | 	get(key) {
 98 | 		if (this.cache.has(key)) {
 99 | 			const item = this.cache.get(key);
100 | 
101 | 			return this._getItemValue(key, item);
102 | 		}
103 | 
104 | 		if (this.oldCache.has(key)) {
105 | 			const item = this.oldCache.get(key);
106 | 			if (this._deleteIfExpired(key, item) === false) {
107 | 				this._moveToRecent(key, item);
108 | 				return item.value;
109 | 			}
110 | 		}
111 | 	}
112 | 
113 | 	set(key, value, {maxAge = this.maxAge === Infinity ? undefined : Date.now() + this.maxAge} = {}) {
114 | 		if (this.cache.has(key)) {
115 | 			this.cache.set(key, {
116 | 				value,
117 | 				maxAge
118 | 			});
119 | 		} else {
120 | 			this._set(key, {value, expiry: maxAge});
121 | 		}
122 | 	}
123 | 
124 | 	has(key) {
125 | 		if (this.cache.has(key)) {
126 | 			return !this._deleteIfExpired(key, this.cache.get(key));
127 | 		}
128 | 
129 | 		if (this.oldCache.has(key)) {
130 | 			return !this._deleteIfExpired(key, this.oldCache.get(key));
131 | 		}
132 | 
133 | 		return false;
134 | 	}
135 | 
136 | 	peek(key) {
137 | 		if (this.cache.has(key)) {
138 | 			return this._peek(key, this.cache);
139 | 		}
140 | 
141 | 		if (this.oldCache.has(key)) {
142 | 			return this._peek(key, this.oldCache);
143 | 		}
144 | 	}
145 | 
146 | 	delete(key) {
147 | 		const deleted = this.cache.delete(key);
148 | 		if (deleted) {
149 | 			this._size--;
150 | 		}
151 | 
152 | 		return this.oldCache.delete(key) || deleted;
153 | 	}
154 | 
155 | 	clear() {
156 | 		this.cache.clear();
157 | 		this.oldCache.clear();
158 | 		this._size = 0;
159 | 	}
160 | 	
161 | 	resize(newSize) {
162 | 		if (!(newSize && newSize > 0)) {
163 | 			throw new TypeError('`maxSize` must be a number greater than 0');
164 | 		}
165 | 
166 | 		const items = [...this._entriesAscending()];
167 | 		const removeCount = items.length - newSize;
168 | 		if (removeCount < 0) {
169 | 			this.cache = new Map(items);
170 | 			this.oldCache = new Map();
171 | 			this._size = items.length;
172 | 		} else {
173 | 			if (removeCount > 0) {
174 | 				this._emitEvictions(items.slice(0, removeCount));
175 | 			}
176 | 
177 | 			this.oldCache = new Map(items.slice(removeCount));
178 | 			this.cache = new Map();
179 | 			this._size = 0;
180 | 		}
181 | 
182 | 		this.maxSize = newSize;
183 | 	}
184 | 
185 | 	* keys() {
186 | 		for (const [key] of this) {
187 | 			yield key;
188 | 		}
189 | 	}
190 | 
191 | 	* values() {
192 | 		for (const [, value] of this) {
193 | 			yield value;
194 | 		}
195 | 	}
196 | 
197 | 	* [Symbol.iterator]() {
198 | 		for (const item of this.cache) {
199 | 			const [key, value] = item;
200 | 			const deleted = this._deleteIfExpired(key, value);
201 | 			if (deleted === false) {
202 | 				yield [key, value.value];
203 | 			}
204 | 		}
205 | 
206 | 		for (const item of this.oldCache) {
207 | 			const [key, value] = item;
208 | 			if (!this.cache.has(key)) {
209 | 				const deleted = this._deleteIfExpired(key, value);
210 | 				if (deleted === false) {
211 | 					yield [key, value.value];
212 | 				}
213 | 			}
214 | 		}
215 | 	}
216 | 
217 | 	* entriesDescending() {
218 | 		let items = [...this.cache];
219 | 		for (let i = items.length - 1; i >= 0; --i) {
220 | 			const item = items[i];
221 | 			const [key, value] = item;
222 | 			const deleted = this._deleteIfExpired(key, value);
223 | 			if (deleted === false) {
224 | 				yield [key, value.value];
225 | 			}
226 | 		}
227 | 
228 | 		items = [...this.oldCache];
229 | 		for (let i = items.length - 1; i >= 0; --i) {
230 | 			const item = items[i];
231 | 			const [key, value] = item;
232 | 			if (!this.cache.has(key)) {
233 | 				const deleted = this._deleteIfExpired(key, value);
234 | 				if (deleted === false) {
235 | 					yield [key, value.value];
236 | 				}
237 | 			}
238 | 		}
239 | 	}
240 | 
241 | 	* entriesAscending() {
242 | 		for (const [key, value] of this._entriesAscending()) {
243 | 			yield [key, value.value];
244 | 		}
245 | 	}
246 | 
247 | 	get size() {
248 | 		if (!this._size) {
249 | 			return this.oldCache.size;
250 | 		}
251 | 
252 | 		let oldCacheSize = 0;
253 | 		for (const key of this.oldCache.keys()) {
254 | 			if (!this.cache.has(key)) {
255 | 				oldCacheSize++;
256 | 			}
257 | 		}
258 | 
259 | 		return Math.min(this._size + oldCacheSize, this.maxSize);
260 | 	}
261 | }
262 | 
263 | module.exports = QuickLRU;
264 | 


--------------------------------------------------------------------------------
/node_modules/@alloc/quick-lru/license:
--------------------------------------------------------------------------------
 1 | MIT License
 2 | 
 3 | Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
 4 | 
 5 | Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 6 | 
 7 | The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 8 | 
 9 | THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
10 | 


--------------------------------------------------------------------------------
/node_modules/@alloc/quick-lru/package.json:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"name": "@alloc/quick-lru",
 3 | 	"version": "5.2.0",
 4 | 	"description": "Simple “Least Recently Used” (LRU) cache",
 5 | 	"license": "MIT",
 6 | 	"repository": "sindresorhus/quick-lru",
 7 | 	"funding": "https://github.com/sponsors/sindresorhus",
 8 | 	"author": {
 9 | 		"name": "Sindre Sorhus",
10 | 		"email": "sindresorhus@gmail.com",
11 | 		"url": "https://sindresorhus.com"
12 | 	},
13 | 	"engines": {
14 | 		"node": ">=10"
15 | 	},
16 | 	"scripts": {
17 | 		"test": "xo && nyc ava && tsd"
18 | 	},
19 | 	"files": [
20 | 		"index.js",
21 | 		"index.d.ts"
22 | 	],
23 | 	"keywords": [
24 | 		"lru",
25 | 		"quick",
26 | 		"cache",
27 | 		"caching",
28 | 		"least",
29 | 		"recently",
30 | 		"used",
31 | 		"fast",
32 | 		"map",
33 | 		"hash",
34 | 		"buffer"
35 | 	],
36 | 	"devDependencies": {
37 | 		"ava": "^2.0.0",
38 | 		"coveralls": "^3.0.3",
39 | 		"nyc": "^15.0.0",
40 | 		"tsd": "^0.11.0",
41 | 		"xo": "^0.26.0"
42 | 	}
43 | }
44 | 


--------------------------------------------------------------------------------
/node_modules/@alloc/quick-lru/readme.md:
--------------------------------------------------------------------------------
  1 | # quick-lru [![Build Status](https://travis-ci.org/sindresorhus/quick-lru.svg?branch=master)](https://travis-ci.org/sindresorhus/quick-lru) [![Coverage Status](https://coveralls.io/repos/github/sindresorhus/quick-lru/badge.svg?branch=master)](https://coveralls.io/github/sindresorhus/quick-lru?branch=master)
  2 | 
  3 | > Simple [“Least Recently Used” (LRU) cache](https://en.m.wikipedia.org/wiki/Cache_replacement_policies#Least_Recently_Used_.28LRU.29)
  4 | 
  5 | Useful when you need to cache something and limit memory usage.
  6 | 
  7 | Inspired by the [`hashlru` algorithm](https://github.com/dominictarr/hashlru#algorithm), but instead uses [`Map`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map) to support keys of any type, not just strings, and values can be `undefined`.
  8 | 
  9 | ## Install
 10 | 
 11 | ```
 12 | $ npm install quick-lru
 13 | ```
 14 | 
 15 | ## Usage
 16 | 
 17 | ```js
 18 | const QuickLRU = require('quick-lru');
 19 | 
 20 | const lru = new QuickLRU({maxSize: 1000});
 21 | 
 22 | lru.set('🦄', '🌈');
 23 | 
 24 | lru.has('🦄');
 25 | //=> true
 26 | 
 27 | lru.get('🦄');
 28 | //=> '🌈'
 29 | ```
 30 | 
 31 | ## API
 32 | 
 33 | ### new QuickLRU(options?)
 34 | 
 35 | Returns a new instance.
 36 | 
 37 | ### options
 38 | 
 39 | Type: `object`
 40 | 
 41 | #### maxSize
 42 | 
 43 | *Required*\
 44 | Type: `number`
 45 | 
 46 | The maximum number of items before evicting the least recently used items.
 47 | 
 48 | #### maxAge
 49 | 
 50 | Type: `number`\
 51 | Default: `Infinity`
 52 | 
 53 | The maximum number of milliseconds an item should remain in cache.
 54 | By default maxAge will be Infinity, which means that items will never expire.
 55 | 
 56 | Lazy expiration happens upon the next `write` or `read` call.
 57 | 
 58 | Individual expiration of an item can be specified by the `set(key, value, options)` method.
 59 | 
 60 | #### onEviction
 61 | 
 62 | *Optional*\
 63 | Type: `(key, value) => void`
 64 | 
 65 | Called right before an item is evicted from the cache.
 66 | 
 67 | Useful for side effects or for items like object URLs that need explicit cleanup (`revokeObjectURL`).
 68 | 
 69 | ### Instance
 70 | 
 71 | The instance is [`iterable`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols) so you can use it directly in a [`for…of`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/for...of) loop.
 72 | 
 73 | Both `key` and `value` can be of any type.
 74 | 
 75 | #### .set(key, value, options?)
 76 | 
 77 | Set an item. Returns the instance.
 78 | 
 79 | Individual expiration of an item can be specified with the `maxAge` option. If not specified, the global `maxAge` value will be used in case it is specified on the constructor, otherwise the item will never expire.
 80 | 
 81 | #### .get(key)
 82 | 
 83 | Get an item.
 84 | 
 85 | #### .has(key)
 86 | 
 87 | Check if an item exists.
 88 | 
 89 | #### .peek(key)
 90 | 
 91 | Get an item without marking it as recently used.
 92 | 
 93 | #### .delete(key)
 94 | 
 95 | Delete an item.
 96 | 
 97 | Returns `true` if the item is removed or `false` if the item doesn't exist.
 98 | 
 99 | #### .clear()
100 | 
101 | Delete all items.
102 | 
103 | #### .resize(maxSize)
104 | 
105 | Update the `maxSize`, discarding items as necessary. Insertion order is mostly preserved, though this is not a strong guarantee.
106 | 
107 | Useful for on-the-fly tuning of cache sizes in live systems.
108 | 
109 | #### .keys()
110 | 
111 | Iterable for all the keys.
112 | 
113 | #### .values()
114 | 
115 | Iterable for all the values.
116 | 
117 | #### .entriesAscending()
118 | 
119 | Iterable for all entries, starting with the oldest (ascending in recency).
120 | 
121 | #### .entriesDescending()
122 | 
123 | Iterable for all entries, starting with the newest (descending in recency).
124 | 
125 | #### .size
126 | 
127 | The stored item count.
128 | 
129 | ---
130 | 
131 | <div align="center">
132 | 	<b>
133 | 		<a href="https://tidelift.com/subscription/pkg/npm-quick-lru?utm_source=npm-quick-lru&utm_medium=referral&utm_campaign=readme">Get professional support for this package with a Tidelift subscription</a>
134 | 	</b>
135 | 	<br>
136 | 	<sub>
137 | 		Tidelift helps make open source sustainable for maintainers while giving companies<br>assurances about security, maintenance, and licensing for their dependencies.
138 | 	</sub>
139 | </div>
140 | 


--------------------------------------------------------------------------------
/node_modules/@ampproject/remapping/LICENSE:
--------------------------------------------------------------------------------
  1 | 
  2 |                                  Apache License
  3 |                            Version 2.0, January 2004
  4 |                         http://www.apache.org/licenses/
  5 | 
  6 |    TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
  7 | 
  8 |    1. Definitions.
  9 | 
 10 |       "License" shall mean the terms and conditions for use, reproduction,
 11 |       and distribution as defined by Sections 1 through 9 of this document.
 12 | 
 13 |       "Licensor" shall mean the copyright owner or entity authorized by
 14 |       the copyright owner that is granting the License.
 15 | 
 16 |       "Legal Entity" shall mean the union of the acting entity and all
 17 |       other entities that control, are controlled by, or are under common
 18 |       control with that entity. For the purposes of this definition,
 19 |       "control" means (i) the power, direct or indirect, to cause the
 20 |       direction or management of such entity, whether by contract or
 21 |       otherwise, or (ii) ownership of fifty percent (50%) or more of the
 22 |       outstanding shares, or (iii) beneficial ownership of such entity.
 23 | 
 24 |       "You" (or "Your") shall mean an individual or Legal Entity
 25 |       exercising permissions granted by this License.
 26 | 
 27 |       "Source" form shall mean the preferred form for making modifications,
 28 |       including but not limited to software source code, documentation
 29 |       source, and configuration files.
 30 | 
 31 |       "Object" form shall mean any form resulting from mechanical
 32 |       transformation or translation of a Source form, including but
 33 |       not limited to compiled object code, generated documentation,
 34 |       and conversions to other media types.
 35 | 
 36 |       "Work" shall mean the work of authorship, whether in Source or
 37 |       Object form, made available under the License, as indicated by a
 38 |       copyright notice that is included in or attached to the work
 39 |       (an example is provided in the Appendix below).
 40 | 
 41 |       "Derivative Works" shall mean any work, whether in Source or Object
 42 |       form, that is based on (or derived from) the Work and for which the
 43 |       editorial revisions, annotations, elaborations, or other modifications
 44 |       represent, as a whole, an original work of authorship. For the purposes
 45 |       of this License, Derivative Works shall not include works that remain
 46 |       separable from, or merely link (or bind by name) to the interfaces of,
 47 |       the Work and Derivative Works thereof.
 48 | 
 49 |       "Contribution" shall mean any work of authorship, including
 50 |       the original version of the Work and any modifications or additions
 51 |       to that Work or Derivative Works thereof, that is intentionally
 52 |       submitted to Licensor for inclusion in the Work by the copyright owner
 53 |       or by an individual or Legal Entity authorized to submit on behalf of
 54 |       the copyright owner. For the purposes of this definition, "submitted"
 55 |       means any form of electronic, verbal, or written communication sent
 56 |       to the Licensor or its representatives, including but not limited to
 57 |       communication on electronic mailing lists, source code control systems,
 58 |       and issue tracking systems that are managed by, or on behalf of, the
 59 |       Licensor for the purpose of discussing and improving the Work, but
 60 |       excluding communication that is conspicuously marked or otherwise
 61 |       designated in writing by the copyright owner as "Not a Contribution."
 62 | 
 63 |       "Contributor" shall mean Licensor and any individual or Legal Entity
 64 |       on behalf of whom a Contribution has been received by Licensor and
 65 |       subsequently incorporated within the Work.
 66 | 
 67 |    2. Grant of Copyright License. Subject to the terms and conditions of
 68 |       this License, each Contributor hereby grants to You a perpetual,
 69 |       worldwide, non-exclusive, no-charge, royalty-free, irrevocable
 70 |       copyright license to reproduce, prepare Derivative Works of,
 71 |       publicly display, publicly perform, sublicense, and distribute the
 72 |       Work and such Derivative Works in Source or Object form.
 73 | 
 74 |    3. Grant of Patent License. Subject to the terms and conditions of
 75 |       this License, each Contributor hereby grants to You a perpetual,
 76 |       worldwide, non-exclusive, no-charge, royalty-free, irrevocable
 77 |       (except as stated in this section) patent license to make, have made,
 78 |       use, offer to sell, sell, import, and otherwise transfer the Work,
 79 |       where such license applies only to those patent claims licensable
 80 |       by such Contributor that are necessarily infringed by their
 81 |       Contribution(s) alone or by combination of their Contribution(s)
 82 |       with the Work to which such Contribution(s) was submitted. If You
 83 |       institute patent litigation against any entity (including a
 84 |       cross-claim or counterclaim in a lawsuit) alleging that the Work
 85 |       or a Contribution incorporated within the Work constitutes direct
 86 |       or contributory patent infringement, then any patent licenses
 87 |       granted to You under this License for that Work shall terminate
 88 |       as of the date such litigation is filed.
 89 | 
 90 |    4. Redistribution. You may reproduce and distribute copies of the
 91 |       Work or Derivative Works thereof in any medium, with or without
 92 |       modifications, and in Source or Object form, provided that You
 93 |       meet the following conditions:
 94 | 
 95 |       (a) You must give any other recipients of the Work or
 96 |           Derivative Works a copy of this License; and
 97 | 
 98 |       (b) You must cause any modified files to carry prominent notices
 99 |           stating that You changed the files; and
100 | 
101 |       (c) You must retain, in the Source form of any Derivative Works
102 |           that You distribute, all copyright, patent, trademark, and
103 |           attribution notices from the Source form of the Work,
104 |           excluding those notices that do not pertain to any part of
105 |           the Derivative Works; and
106 | 
107 |       (d) If the Work includes a "NOTICE" text file as part of its
108 |           distribution, then any Derivative Works that You distribute must
109 |           include a readable copy of the attribution notices contained
110 |           within such NOTICE file, excluding those notices that do not
111 |           pertain to any part of the Derivative Works, in at least one
112 |           of the following places: within a NOTICE text file distributed
113 |           as part of the Derivative Works; within the Source form or
114 |           documentation, if provided along with the Derivative Works; or,
115 |           within a display generated by the Derivative Works, if and
116 |           wherever such third-party notices normally appear. The contents
117 |           of the NOTICE file are for informational purposes only and
118 |           do not modify the License. You may add Your own attribution
119 |           notices within Derivative Works that You distribute, alongside
120 |           or as an addendum to the NOTICE text from the Work, provided
121 |           that such additional attribution notices cannot be construed
122 |           as modifying the License.
123 | 
124 |       You may add Your own copyright statement to Your modifications and
125 |       may provide additional or different license terms and conditions
126 |       for use, reproduction, or distribution of Your modifications, or
127 |       for any such Derivative Works as a whole, provided Your use,
128 |       reproduction, and distribution of the Work otherwise complies with
129 |       the conditions stated in this License.
130 | 
131 |    5. Submission of Contributions. Unless You explicitly state otherwise,
132 |       any Contribution intentionally submitted for inclusion in the Work
133 |       by You to the Licensor shall be under the terms and conditions of
134 |       this License, without any additional terms or conditions.
135 |       Notwithstanding the above, nothing herein shall supersede or modify
136 |       the terms of any separate license agreement you may have executed
137 |       with Licensor regarding such Contributions.
138 | 
139 |    6. Trademarks. This License does not grant permission to use the trade
140 |       names, trademarks, service marks, or product names of the Licensor,
141 |       except as required for reasonable and customary use in describing the
142 |       origin of the Work and reproducing the content of the NOTICE file.
143 | 
144 |    7. Disclaimer of Warranty. Unless required by applicable law or
145 |       agreed to in writing, Licensor provides the Work (and each
146 |       Contributor provides its Contributions) on an "AS IS" BASIS,
147 |       WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
148 |       implied, including, without limitation, any warranties or conditions
149 |       of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
150 |       PARTICULAR PURPOSE. You are solely responsible for determining the
151 |       appropriateness of using or redistributing the Work and assume any
152 |       risks associated with Your exercise of permissions under this License.
153 | 
154 |    8. Limitation of Liability. In no event and under no legal theory,
155 |       whether in tort (including negligence), contract, or otherwise,
156 |       unless required by applicable law (such as deliberate and grossly
157 |       negligent acts) or agreed to in writing, shall any Contributor be
158 |       liable to You for damages, including any direct, indirect, special,
159 |       incidental, or consequential damages of any character arising as a
160 |       result of this License or out of the use or inability to use the
161 |       Work (including but not limited to damages for loss of goodwill,
162 |       work stoppage, computer failure or malfunction, or any and all
163 |       other commercial damages or losses), even if such Contributor
164 |       has been advised of the possibility of such damages.
165 | 
166 |    9. Accepting Warranty or Additional Liability. While redistributing
167 |       the Work or Derivative Works thereof, You may choose to offer,
168 |       and charge a fee for, acceptance of support, warranty, indemnity,
169 |       or other liability obligations and/or rights consistent with this
170 |       License. However, in accepting such obligations, You may act only
171 |       on Your own behalf and on Your sole responsibility, not on behalf
172 |       of any other Contributor, and only if You agree to indemnify,
173 |       defend, and hold each Contributor harmless for any liability
174 |       incurred by, or claims asserted against, such Contributor by reason
175 |       of your accepting any such warranty or additional liability.
176 | 
177 |    END OF TERMS AND CONDITIONS
178 | 
179 |    APPENDIX: How to apply the Apache License to your work.
180 | 
181 |       To apply the Apache License to your work, attach the following
182 |       boilerplate notice, with the fields enclosed by brackets "[]"
183 |       replaced with your own identifying information. (Don't include
184 |       the brackets!)  The text should be enclosed in the appropriate
185 |       comment syntax for the file format. We also recommend that a
186 |       file or class name and description of purpose be included on the
187 |       same "printed page" as the copyright notice for easier
188 |       identification within third-party archives.
189 | 
190 |    Copyright [yyyy] [name of copyright owner]
191 | 
192 |    Licensed under the Apache License, Version 2.0 (the "License");
193 |    you may not use this file except in compliance with the License.
194 |    You may obtain a copy of the License at
195 | 
196 |        http://www.apache.org/licenses/LICENSE-2.0
197 | 
198 |    Unless required by applicable law or agreed to in writing, software
199 |    distributed under the License is distributed on an "AS IS" BASIS,
200 |    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
201 |    See the License for the specific language governing permissions and
202 |    limitations under the License.
203 | 


--------------------------------------------------------------------------------
/node_modules/@ampproject/remapping/README.md:
--------------------------------------------------------------------------------
  1 | # @ampproject/remapping
  2 | 
  3 | > Remap sequential sourcemaps through transformations to point at the original source code
  4 | 
  5 | Remapping allows you to take the sourcemaps generated through transforming your code and "remap"
  6 | them to the original source locations. Think "my minified code, transformed with babel and bundled
  7 | with webpack", all pointing to the correct location in your original source code.
  8 | 
  9 | With remapping, none of your source code transformations need to be aware of the input's sourcemap,
 10 | they only need to generate an output sourcemap. This greatly simplifies building custom
 11 | transformations (think a find-and-replace).
 12 | 
 13 | ## Installation
 14 | 
 15 | ```sh
 16 | npm install @ampproject/remapping
 17 | ```
 18 | 
 19 | ## Usage
 20 | 
 21 | ```typescript
 22 | function remapping(
 23 |   map: SourceMap | SourceMap[],
 24 |   loader: (file: string, ctx: LoaderContext) => (SourceMap | null | undefined),
 25 |   options?: { excludeContent: boolean, decodedMappings: boolean }
 26 | ): SourceMap;
 27 | 
 28 | // LoaderContext gives the loader the importing sourcemap, tree depth, the ability to override the
 29 | // "source" location (where child sources are resolved relative to, or the location of original
 30 | // source), and the ability to override the "content" of an original source for inclusion in the
 31 | // output sourcemap.
 32 | type LoaderContext = {
 33 |  readonly importer: string;
 34 |  readonly depth: number;
 35 |  source: string;
 36 |  content: string | null | undefined;
 37 | }
 38 | ```
 39 | 
 40 | `remapping` takes the final output sourcemap, and a `loader` function. For every source file pointer
 41 | in the sourcemap, the `loader` will be called with the resolved path. If the path itself represents
 42 | a transformed file (it has a sourcmap associated with it), then the `loader` should return that
 43 | sourcemap. If not, the path will be treated as an original, untransformed source code.
 44 | 
 45 | ```js
 46 | // Babel transformed "helloworld.js" into "transformed.js"
 47 | const transformedMap = JSON.stringify({
 48 |   file: 'transformed.js',
 49 |   // 1st column of 2nd line of output file translates into the 1st source
 50 |   // file, line 3, column 2
 51 |   mappings: ';CAEE',
 52 |   sources: ['helloworld.js'],
 53 |   version: 3,
 54 | });
 55 | 
 56 | // Uglify minified "transformed.js" into "transformed.min.js"
 57 | const minifiedTransformedMap = JSON.stringify({
 58 |   file: 'transformed.min.js',
 59 |   // 0th column of 1st line of output file translates into the 1st source
 60 |   // file, line 2, column 1.
 61 |   mappings: 'AACC',
 62 |   names: [],
 63 |   sources: ['transformed.js'],
 64 |   version: 3,
 65 | });
 66 | 
 67 | const remapped = remapping(
 68 |   minifiedTransformedMap,
 69 |   (file, ctx) => {
 70 | 
 71 |     // The "transformed.js" file is an transformed file.
 72 |     if (file === 'transformed.js') {
 73 |       // The root importer is empty.
 74 |       console.assert(ctx.importer === '');
 75 |       // The depth in the sourcemap tree we're currently loading.
 76 |       // The root `minifiedTransformedMap` is depth 0, and its source children are depth 1, etc.
 77 |       console.assert(ctx.depth === 1);
 78 | 
 79 |       return transformedMap;
 80 |     }
 81 | 
 82 |     // Loader will be called to load transformedMap's source file pointers as well.
 83 |     console.assert(file === 'helloworld.js');
 84 |     // `transformed.js`'s sourcemap points into `helloworld.js`.
 85 |     console.assert(ctx.importer === 'transformed.js');
 86 |     // This is a source child of `transformed`, which is a source child of `minifiedTransformedMap`.
 87 |     console.assert(ctx.depth === 2);
 88 |     return null;
 89 |   }
 90 | );
 91 | 
 92 | console.log(remapped);
 93 | // {
 94 | //   file: 'transpiled.min.js',
 95 | //   mappings: 'AAEE',
 96 | //   sources: ['helloworld.js'],
 97 | //   version: 3,
 98 | // };
 99 | ```
100 | 
101 | In this example, `loader` will be called twice:
102 | 
103 | 1. `"transformed.js"`, the first source file pointer in the `minifiedTransformedMap`. We return the
104 |    associated sourcemap for it (its a transformed file, after all) so that sourcemap locations can
105 |    be traced through it into the source files it represents.
106 | 2. `"helloworld.js"`, our original, unmodified source code. This file does not have a sourcemap, so
107 |    we return `null`.
108 | 
109 | The `remapped` sourcemap now points from `transformed.min.js` into locations in `helloworld.js`. If
110 | you were to read the `mappings`, it says "0th column of the first line output line points to the 1st
111 | column of the 2nd line of the file `helloworld.js`".
112 | 
113 | ### Multiple transformations of a file
114 | 
115 | As a convenience, if you have multiple single-source transformations of a file, you may pass an
116 | array of sourcemap files in the order of most-recent transformation sourcemap first. Note that this
117 | changes the `importer` and `depth` of each call to our loader. So our above example could have been
118 | written as:
119 | 
120 | ```js
121 | const remapped = remapping(
122 |   [minifiedTransformedMap, transformedMap],
123 |   () => null
124 | );
125 | 
126 | console.log(remapped);
127 | // {
128 | //   file: 'transpiled.min.js',
129 | //   mappings: 'AAEE',
130 | //   sources: ['helloworld.js'],
131 | //   version: 3,
132 | // };
133 | ```
134 | 
135 | ### Advanced control of the loading graph
136 | 
137 | #### `source`
138 | 
139 | The `source` property can overridden to any value to change the location of the current load. Eg,
140 | for an original source file, it allows us to change the location to the original source regardless
141 | of what the sourcemap source entry says. And for transformed files, it allows us to change the
142 | relative resolving location for child sources of the loaded sourcemap.
143 | 
144 | ```js
145 | const remapped = remapping(
146 |   minifiedTransformedMap,
147 |   (file, ctx) => {
148 | 
149 |     if (file === 'transformed.js') {
150 |       // We pretend the transformed.js file actually exists in the 'src/' directory. When the nested
151 |       // source files are loaded, they will now be relative to `src/`.
152 |       ctx.source = 'src/transformed.js';
153 |       return transformedMap;
154 |     }
155 | 
156 |     console.assert(file === 'src/helloworld.js');
157 |     // We could futher change the source of this original file, eg, to be inside a nested directory
158 |     // itself. This will be reflected in the remapped sourcemap.
159 |     ctx.source = 'src/nested/transformed.js';
160 |     return null;
161 |   }
162 | );
163 | 
164 | console.log(remapped);
165 | // {
166 | //   …,
167 | //   sources: ['src/nested/helloworld.js'],
168 | // };
169 | ```
170 | 
171 | 
172 | #### `content`
173 | 
174 | The `content` property can be overridden when we encounter an original source file. Eg, this allows
175 | you to manually provide the source content of the original file regardless of whether the
176 | `sourcesContent` field is present in the parent sourcemap. It can also be set to `null` to remove
177 | the source content.
178 | 
179 | ```js
180 | const remapped = remapping(
181 |   minifiedTransformedMap,
182 |   (file, ctx) => {
183 | 
184 |     if (file === 'transformed.js') {
185 |       // transformedMap does not include a `sourcesContent` field, so usually the remapped sourcemap
186 |       // would not include any `sourcesContent` values.
187 |       return transformedMap;
188 |     }
189 | 
190 |     console.assert(file === 'helloworld.js');
191 |     // We can read the file to provide the source content.
192 |     ctx.content = fs.readFileSync(file, 'utf8');
193 |     return null;
194 |   }
195 | );
196 | 
197 | console.log(remapped);
198 | // {
199 | //   …,
200 | //   sourcesContent: [
201 | //     'console.log("Hello world!")',
202 | //   ],
203 | // };
204 | ```
205 | 
206 | ### Options
207 | 
208 | #### excludeContent
209 | 
210 | By default, `excludeContent` is `false`. Passing `{ excludeContent: true }` will exclude the
211 | `sourcesContent` field from the returned sourcemap. This is mainly useful when you want to reduce
212 | the size out the sourcemap.
213 | 
214 | #### decodedMappings
215 | 
216 | By default, `decodedMappings` is `false`. Passing `{ decodedMappings: true }` will leave the
217 | `mappings` field in a [decoded state](https://github.com/rich-harris/sourcemap-codec) instead of
218 | encoding into a VLQ string.
219 | 


--------------------------------------------------------------------------------
/node_modules/@ampproject/remapping/dist/remapping.mjs:
--------------------------------------------------------------------------------
  1 | import { decodedMappings, traceSegment, TraceMap } from '@jridgewell/trace-mapping';
  2 | import { GenMapping, maybeAddSegment, setSourceContent, setIgnore, toDecodedMap, toEncodedMap } from '@jridgewell/gen-mapping';
  3 | 
  4 | const SOURCELESS_MAPPING = /* #__PURE__ */ SegmentObject('', -1, -1, '', null, false);
  5 | const EMPTY_SOURCES = [];
  6 | function SegmentObject(source, line, column, name, content, ignore) {
  7 |     return { source, line, column, name, content, ignore };
  8 | }
  9 | function Source(map, sources, source, content, ignore) {
 10 |     return {
 11 |         map,
 12 |         sources,
 13 |         source,
 14 |         content,
 15 |         ignore,
 16 |     };
 17 | }
 18 | /**
 19 |  * MapSource represents a single sourcemap, with the ability to trace mappings into its child nodes
 20 |  * (which may themselves be SourceMapTrees).
 21 |  */
 22 | function MapSource(map, sources) {
 23 |     return Source(map, sources, '', null, false);
 24 | }
 25 | /**
 26 |  * A "leaf" node in the sourcemap tree, representing an original, unmodified source file. Recursive
 27 |  * segment tracing ends at the `OriginalSource`.
 28 |  */
 29 | function OriginalSource(source, content, ignore) {
 30 |     return Source(null, EMPTY_SOURCES, source, content, ignore);
 31 | }
 32 | /**
 33 |  * traceMappings is only called on the root level SourceMapTree, and begins the process of
 34 |  * resolving each mapping in terms of the original source files.
 35 |  */
 36 | function traceMappings(tree) {
 37 |     // TODO: Eventually support sourceRoot, which has to be removed because the sources are already
 38 |     // fully resolved. We'll need to make sources relative to the sourceRoot before adding them.
 39 |     const gen = new GenMapping({ file: tree.map.file });
 40 |     const { sources: rootSources, map } = tree;
 41 |     const rootNames = map.names;
 42 |     const rootMappings = decodedMappings(map);
 43 |     for (let i = 0; i < rootMappings.length; i++) {
 44 |         const segments = rootMappings[i];
 45 |         for (let j = 0; j < segments.length; j++) {
 46 |             const segment = segments[j];
 47 |             const genCol = segment[0];
 48 |             let traced = SOURCELESS_MAPPING;
 49 |             // 1-length segments only move the current generated column, there's no source information
 50 |             // to gather from it.
 51 |             if (segment.length !== 1) {
 52 |                 const source = rootSources[segment[1]];
 53 |                 traced = originalPositionFor(source, segment[2], segment[3], segment.length === 5 ? rootNames[segment[4]] : '');
 54 |                 // If the trace is invalid, then the trace ran into a sourcemap that doesn't contain a
 55 |                 // respective segment into an original source.
 56 |                 if (traced == null)
 57 |                     continue;
 58 |             }
 59 |             const { column, line, name, content, source, ignore } = traced;
 60 |             maybeAddSegment(gen, i, genCol, source, line, column, name);
 61 |             if (source && content != null)
 62 |                 setSourceContent(gen, source, content);
 63 |             if (ignore)
 64 |                 setIgnore(gen, source, true);
 65 |         }
 66 |     }
 67 |     return gen;
 68 | }
 69 | /**
 70 |  * originalPositionFor is only called on children SourceMapTrees. It recurses down into its own
 71 |  * child SourceMapTrees, until we find the original source map.
 72 |  */
 73 | function originalPositionFor(source, line, column, name) {
 74 |     if (!source.map) {
 75 |         return SegmentObject(source.source, line, column, name, source.content, source.ignore);
 76 |     }
 77 |     const segment = traceSegment(source.map, line, column);
 78 |     // If we couldn't find a segment, then this doesn't exist in the sourcemap.
 79 |     if (segment == null)
 80 |         return null;
 81 |     // 1-length segments only move the current generated column, there's no source information
 82 |     // to gather from it.
 83 |     if (segment.length === 1)
 84 |         return SOURCELESS_MAPPING;
 85 |     return originalPositionFor(source.sources[segment[1]], segment[2], segment[3], segment.length === 5 ? source.map.names[segment[4]] : name);
 86 | }
 87 | 
 88 | function asArray(value) {
 89 |     if (Array.isArray(value))
 90 |         return value;
 91 |     return [value];
 92 | }
 93 | /**
 94 |  * Recursively builds a tree structure out of sourcemap files, with each node
 95 |  * being either an `OriginalSource` "leaf" or a `SourceMapTree` composed of
 96 |  * `OriginalSource`s and `SourceMapTree`s.
 97 |  *
 98 |  * Every sourcemap is composed of a collection of source files and mappings
 99 |  * into locations of those source files. When we generate a `SourceMapTree` for
100 |  * the sourcemap, we attempt to load each source file's own sourcemap. If it
101 |  * does not have an associated sourcemap, it is considered an original,
102 |  * unmodified source file.
103 |  */
104 | function buildSourceMapTree(input, loader) {
105 |     const maps = asArray(input).map((m) => new TraceMap(m, ''));
106 |     const map = maps.pop();
107 |     for (let i = 0; i < maps.length; i++) {
108 |         if (maps[i].sources.length > 1) {
109 |             throw new Error(`Transformation map ${i} must have exactly one source file.\n` +
110 |                 'Did you specify these with the most recent transformation maps first?');
111 |         }
112 |     }
113 |     let tree = build(map, loader, '', 0);
114 |     for (let i = maps.length - 1; i >= 0; i--) {
115 |         tree = MapSource(maps[i], [tree]);
116 |     }
117 |     return tree;
118 | }
119 | function build(map, loader, importer, importerDepth) {
120 |     const { resolvedSources, sourcesContent, ignoreList } = map;
121 |     const depth = importerDepth + 1;
122 |     const children = resolvedSources.map((sourceFile, i) => {
123 |         // The loading context gives the loader more information about why this file is being loaded
124 |         // (eg, from which importer). It also allows the loader to override the location of the loaded
125 |         // sourcemap/original source, or to override the content in the sourcesContent field if it's
126 |         // an unmodified source file.
127 |         const ctx = {
128 |             importer,
129 |             depth,
130 |             source: sourceFile || '',
131 |             content: undefined,
132 |             ignore: undefined,
133 |         };
134 |         // Use the provided loader callback to retrieve the file's sourcemap.
135 |         // TODO: We should eventually support async loading of sourcemap files.
136 |         const sourceMap = loader(ctx.source, ctx);
137 |         const { source, content, ignore } = ctx;
138 |         // If there is a sourcemap, then we need to recurse into it to load its source files.
139 |         if (sourceMap)
140 |             return build(new TraceMap(sourceMap, source), loader, source, depth);
141 |         // Else, it's an unmodified source file.
142 |         // The contents of this unmodified source file can be overridden via the loader context,
143 |         // allowing it to be explicitly null or a string. If it remains undefined, we fall back to
144 |         // the importing sourcemap's `sourcesContent` field.
145 |         const sourceContent = content !== undefined ? content : sourcesContent ? sourcesContent[i] : null;
146 |         const ignored = ignore !== undefined ? ignore : ignoreList ? ignoreList.includes(i) : false;
147 |         return OriginalSource(source, sourceContent, ignored);
148 |     });
149 |     return MapSource(map, children);
150 | }
151 | 
152 | /**
153 |  * A SourceMap v3 compatible sourcemap, which only includes fields that were
154 |  * provided to it.
155 |  */
156 | class SourceMap {
157 |     constructor(map, options) {
158 |         const out = options.decodedMappings ? toDecodedMap(map) : toEncodedMap(map);
159 |         this.version = out.version; // SourceMap spec says this should be first.
160 |         this.file = out.file;
161 |         this.mappings = out.mappings;
162 |         this.names = out.names;
163 |         this.ignoreList = out.ignoreList;
164 |         this.sourceRoot = out.sourceRoot;
165 |         this.sources = out.sources;
166 |         if (!options.excludeContent) {
167 |             this.sourcesContent = out.sourcesContent;
168 |         }
169 |     }
170 |     toString() {
171 |         return JSON.stringify(this);
172 |     }
173 | }
174 | 
175 | /**
176 |  * Traces through all the mappings in the root sourcemap, through the sources
177 |  * (and their sourcemaps), all the way back to the original source location.
178 |  *
179 |  * `loader` will be called every time we encounter a source file. If it returns
180 |  * a sourcemap, we will recurse into that sourcemap to continue the trace. If
181 |  * it returns a falsey value, that source file is treated as an original,
182 |  * unmodified source file.
183 |  *
184 |  * Pass `excludeContent` to exclude any self-containing source file content
185 |  * from the output sourcemap.
186 |  *
187 |  * Pass `decodedMappings` to receive a SourceMap with decoded (instead of
188 |  * VLQ encoded) mappings.
189 |  */
190 | function remapping(input, loader, options) {
191 |     const opts = typeof options === 'object' ? options : { excludeContent: !!options, decodedMappings: false };
192 |     const tree = buildSourceMapTree(input, loader);
193 |     return new SourceMap(traceMappings(tree), opts);
194 | }
195 | 
196 | export { remapping as default };
197 | //# sourceMappingURL=remapping.mjs.map
198 | 


--------------------------------------------------------------------------------
/node_modules/@ampproject/remapping/dist/remapping.mjs.map:
--------------------------------------------------------------------------------
1 | {"version":3,"file":"remapping.mjs","sources":["../src/source-map-tree.ts","../src/build-source-map-tree.ts","../src/source-map.ts","../src/remapping.ts"],"sourcesContent":["import { GenMapping, maybeAddSegment, setIgnore, setSourceContent } from '@jridgewell/gen-mapping';\nimport { traceSegment, decodedMappings } from '@jridgewell/trace-mapping';\n\nimport type { TraceMap } from '@jridgewell/trace-mapping';\n\nexport type SourceMapSegmentObject = {\n  column: number;\n  line: number;\n  name: string;\n  source: string;\n  content: string | null;\n  ignore: boolean;\n};\n\nexport type OriginalSource = {\n  map: null;\n  sources: Sources[];\n  source: string;\n  content: string | null;\n  ignore: boolean;\n};\n\nexport type MapSource = {\n  map: TraceMap;\n  sources: Sources[];\n  source: string;\n  content: null;\n  ignore: false;\n};\n\nexport type Sources = OriginalSource | MapSource;\n\nconst SOURCELESS_MAPPING = /* #__PURE__ */ SegmentObject('', -1, -1, '', null, false);\nconst EMPTY_SOURCES: Sources[] = [];\n\nfunction SegmentObject(\n  source: string,\n  line: number,\n  column: number,\n  name: string,\n  content: string | null,\n  ignore: boolean\n): SourceMapSegmentObject {\n  return { source, line, column, name, content, ignore };\n}\n\nfunction Source(\n  map: TraceMap,\n  sources: Sources[],\n  source: '',\n  content: null,\n  ignore: false\n): MapSource;\nfunction Source(\n  map: null,\n  sources: Sources[],\n  source: string,\n  content: string | null,\n  ignore: boolean\n): OriginalSource;\nfunction Source(\n  map: TraceMap | null,\n  sources: Sources[],\n  source: string | '',\n  content: string | null,\n  ignore: boolean\n): Sources {\n  return {\n    map,\n    sources,\n    source,\n    content,\n    ignore,\n  } as any;\n}\n\n/**\n * MapSource represents a single sourcemap, with the ability to trace mappings into its child nodes\n * (which may themselves be SourceMapTrees).\n */\nexport function MapSource(map: TraceMap, sources: Sources[]): MapSource {\n  return Source(map, sources, '', null, false);\n}\n\n/**\n * A \"leaf\" node in the sourcemap tree, representing an original, unmodified source file. Recursive\n * segment tracing ends at the `OriginalSource`.\n */\nexport function OriginalSource(\n  source: string,\n  content: string | null,\n  ignore: boolean\n): OriginalSource {\n  return Source(null, EMPTY_SOURCES, source, content, ignore);\n}\n\n/**\n * traceMappings is only called on the root level SourceMapTree, and begins the process of\n * resolving each mapping in terms of the original source files.\n */\nexport function traceMappings(tree: MapSource): GenMapping {\n  // TODO: Eventually support sourceRoot, which has to be removed because the sources are already\n  // fully resolved. We'll need to make sources relative to the sourceRoot before adding them.\n  const gen = new GenMapping({ file: tree.map.file });\n  const { sources: rootSources, map } = tree;\n  const rootNames = map.names;\n  const rootMappings = decodedMappings(map);\n\n  for (let i = 0; i < rootMappings.length; i++) {\n    const segments = rootMappings[i];\n\n    for (let j = 0; j < segments.length; j++) {\n      const segment = segments[j];\n      const genCol = segment[0];\n      let traced: SourceMapSegmentObject | null = SOURCELESS_MAPPING;\n\n      // 1-length segments only move the current generated column, there's no source information\n      // to gather from it.\n      if (segment.length !== 1) {\n        const source = rootSources[segment[1]];\n        traced = originalPositionFor(\n          source,\n          segment[2],\n          segment[3],\n          segment.length === 5 ? rootNames[segment[4]] : ''\n        );\n\n        // If the trace is invalid, then the trace ran into a sourcemap that doesn't contain a\n        // respective segment into an original source.\n        if (traced == null) continue;\n      }\n\n      const { column, line, name, content, source, ignore } = traced;\n\n      maybeAddSegment(gen, i, genCol, source, line, column, name);\n      if (source && content != null) setSourceContent(gen, source, content);\n      if (ignore) setIgnore(gen, source, true);\n    }\n  }\n\n  return gen;\n}\n\n/**\n * originalPositionFor is only called on children SourceMapTrees. It recurses down into its own\n * child SourceMapTrees, until we find the original source map.\n */\nexport function originalPositionFor(\n  source: Sources,\n  line: number,\n  column: number,\n  name: string\n): SourceMapSegmentObject | null {\n  if (!source.map) {\n    return SegmentObject(source.source, line, column, name, source.content, source.ignore);\n  }\n\n  const segment = traceSegment(source.map, line, column);\n\n  // If we couldn't find a segment, then this doesn't exist in the sourcemap.\n  if (segment == null) return null;\n  // 1-length segments only move the current generated column, there's no source information\n  // to gather from it.\n  if (segment.length === 1) return SOURCELESS_MAPPING;\n\n  return originalPositionFor(\n    source.sources[segment[1]],\n    segment[2],\n    segment[3],\n    segment.length === 5 ? source.map.names[segment[4]] : name\n  );\n}\n","import { TraceMap } from '@jridgewell/trace-mapping';\n\nimport { OriginalSource, MapSource } from './source-map-tree';\n\nimport type { Sources, MapSource as MapSourceType } from './source-map-tree';\nimport type { SourceMapInput, SourceMapLoader, LoaderContext } from './types';\n\nfunction asArray<T>(value: T | T[]): T[] {\n  if (Array.isArray(value)) return value;\n  return [value];\n}\n\n/**\n * Recursively builds a tree structure out of sourcemap files, with each node\n * being either an `OriginalSource` \"leaf\" or a `SourceMapTree` composed of\n * `OriginalSource`s and `SourceMapTree`s.\n *\n * Every sourcemap is composed of a collection of source files and mappings\n * into locations of those source files. When we generate a `SourceMapTree` for\n * the sourcemap, we attempt to load each source file's own sourcemap. If it\n * does not have an associated sourcemap, it is considered an original,\n * unmodified source file.\n */\nexport default function buildSourceMapTree(\n  input: SourceMapInput | SourceMapInput[],\n  loader: SourceMapLoader\n): MapSourceType {\n  const maps = asArray(input).map((m) => new TraceMap(m, ''));\n  const map = maps.pop()!;\n\n  for (let i = 0; i < maps.length; i++) {\n    if (maps[i].sources.length > 1) {\n      throw new Error(\n        `Transformation map ${i} must have exactly one source file.\\n` +\n          'Did you specify these with the most recent transformation maps first?'\n      );\n    }\n  }\n\n  let tree = build(map, loader, '', 0);\n  for (let i = maps.length - 1; i >= 0; i--) {\n    tree = MapSource(maps[i], [tree]);\n  }\n  return tree;\n}\n\nfunction build(\n  map: TraceMap,\n  loader: SourceMapLoader,\n  importer: string,\n  importerDepth: number\n): MapSourceType {\n  const { resolvedSources, sourcesContent, ignoreList } = map;\n\n  const depth = importerDepth + 1;\n  const children = resolvedSources.map((sourceFile: string | null, i: number): Sources => {\n    // The loading context gives the loader more information about why this file is being loaded\n    // (eg, from which importer). It also allows the loader to override the location of the loaded\n    // sourcemap/original source, or to override the content in the sourcesContent field if it's\n    // an unmodified source file.\n    const ctx: LoaderContext = {\n      importer,\n      depth,\n      source: sourceFile || '',\n      content: undefined,\n      ignore: undefined,\n    };\n\n    // Use the provided loader callback to retrieve the file's sourcemap.\n    // TODO: We should eventually support async loading of sourcemap files.\n    const sourceMap = loader(ctx.source, ctx);\n\n    const { source, content, ignore } = ctx;\n\n    // If there is a sourcemap, then we need to recurse into it to load its source files.\n    if (sourceMap) return build(new TraceMap(sourceMap, source), loader, source, depth);\n\n    // Else, it's an unmodified source file.\n    // The contents of this unmodified source file can be overridden via the loader context,\n    // allowing it to be explicitly null or a string. If it remains undefined, we fall back to\n    // the importing sourcemap's `sourcesContent` field.\n    const sourceContent =\n      content !== undefined ? content : sourcesContent ? sourcesContent[i] : null;\n    const ignored = ignore !== undefined ? ignore : ignoreList ? ignoreList.includes(i) : false;\n    return OriginalSource(source, sourceContent, ignored);\n  });\n\n  return MapSource(map, children);\n}\n","import { toDecodedMap, toEncodedMap } from '@jridgewell/gen-mapping';\n\nimport type { GenMapping } from '@jridgewell/gen-mapping';\nimport type { DecodedSourceMap, EncodedSourceMap, Options } from './types';\n\n/**\n * A SourceMap v3 compatible sourcemap, which only includes fields that were\n * provided to it.\n */\nexport default class SourceMap {\n  declare file?: string | null;\n  declare mappings: EncodedSourceMap['mappings'] | DecodedSourceMap['mappings'];\n  declare sourceRoot?: string;\n  declare names: string[];\n  declare sources: (string | null)[];\n  declare sourcesContent?: (string | null)[];\n  declare version: 3;\n  declare ignoreList: number[] | undefined;\n\n  constructor(map: GenMapping, options: Options) {\n    const out = options.decodedMappings ? toDecodedMap(map) : toEncodedMap(map);\n    this.version = out.version; // SourceMap spec says this should be first.\n    this.file = out.file;\n    this.mappings = out.mappings as SourceMap['mappings'];\n    this.names = out.names as SourceMap['names'];\n    this.ignoreList = out.ignoreList as SourceMap['ignoreList'];\n    this.sourceRoot = out.sourceRoot;\n\n    this.sources = out.sources as SourceMap['sources'];\n    if (!options.excludeContent) {\n      this.sourcesContent = out.sourcesContent as SourceMap['sourcesContent'];\n    }\n  }\n\n  toString(): string {\n    return JSON.stringify(this);\n  }\n}\n","import buildSourceMapTree from './build-source-map-tree';\nimport { traceMappings } from './source-map-tree';\nimport SourceMap from './source-map';\n\nimport type { SourceMapInput, SourceMapLoader, Options } from './types';\nexport type {\n  SourceMapSegment,\n  EncodedSourceMap,\n  EncodedSourceMap as RawSourceMap,\n  DecodedSourceMap,\n  SourceMapInput,\n  SourceMapLoader,\n  LoaderContext,\n  Options,\n} from './types';\nexport type { SourceMap };\n\n/**\n * Traces through all the mappings in the root sourcemap, through the sources\n * (and their sourcemaps), all the way back to the original source location.\n *\n * `loader` will be called every time we encounter a source file. If it returns\n * a sourcemap, we will recurse into that sourcemap to continue the trace. If\n * it returns a falsey value, that source file is treated as an original,\n * unmodified source file.\n *\n * Pass `excludeContent` to exclude any self-containing source file content\n * from the output sourcemap.\n *\n * Pass `decodedMappings` to receive a SourceMap with decoded (instead of\n * VLQ encoded) mappings.\n */\nexport default function remapping(\n  input: SourceMapInput | SourceMapInput[],\n  loader: SourceMapLoader,\n  options?: boolean | Options\n): SourceMap {\n  const opts =\n    typeof options === 'object' ? options : { excludeContent: !!options, decodedMappings: false };\n  const tree = buildSourceMapTree(input, loader);\n  return new SourceMap(traceMappings(tree), opts);\n}\n"],"names":[],"mappings":";;;AAgCA,MAAM,kBAAkB,mBAAmB,aAAa,CAAC,EAAE,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,EAAE,EAAE,IAAI,EAAE,KAAK,CAAC,CAAC;AACtF,MAAM,aAAa,GAAc,EAAE,CAAC;AAEpC,SAAS,aAAa,CACpB,MAAc,EACd,IAAY,EACZ,MAAc,EACd,IAAY,EACZ,OAAsB,EACtB,MAAe,EAAA;AAEf,IAAA,OAAO,EAAE,MAAM,EAAE,IAAI,EAAE,MAAM,EAAE,IAAI,EAAE,OAAO,EAAE,MAAM,EAAE,CAAC;AACzD,CAAC;AAgBD,SAAS,MAAM,CACb,GAAoB,EACpB,OAAkB,EAClB,MAAmB,EACnB,OAAsB,EACtB,MAAe,EAAA;IAEf,OAAO;QACL,GAAG;QACH,OAAO;QACP,MAAM;QACN,OAAO;QACP,MAAM;KACA,CAAC;AACX,CAAC;AAED;;;AAGG;AACa,SAAA,SAAS,CAAC,GAAa,EAAE,OAAkB,EAAA;AACzD,IAAA,OAAO,MAAM,CAAC,GAAG,EAAE,OAAO,EAAE,EAAE,EAAE,IAAI,EAAE,KAAK,CAAC,CAAC;AAC/C,CAAC;AAED;;;AAGG;SACa,cAAc,CAC5B,MAAc,EACd,OAAsB,EACtB,MAAe,EAAA;AAEf,IAAA,OAAO,MAAM,CAAC,IAAI,EAAE,aAAa,EAAE,MAAM,EAAE,OAAO,EAAE,MAAM,CAAC,CAAC;AAC9D,CAAC;AAED;;;AAGG;AACG,SAAU,aAAa,CAAC,IAAe,EAAA;;;AAG3C,IAAA,MAAM,GAAG,GAAG,IAAI,UAAU,CAAC,EAAE,IAAI,EAAE,IAAI,CAAC,GAAG,CAAC,IAAI,EAAE,CAAC,CAAC;IACpD,MAAM,EAAE,OAAO,EAAE,WAAW,EAAE,GAAG,EAAE,GAAG,IAAI,CAAC;AAC3C,IAAA,MAAM,SAAS,GAAG,GAAG,CAAC,KAAK,CAAC;AAC5B,IAAA,MAAM,YAAY,GAAG,eAAe,CAAC,GAAG,CAAC,CAAC;AAE1C,IAAA,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,YAAY,CAAC,MAAM,EAAE,CAAC,EAAE,EAAE;AAC5C,QAAA,MAAM,QAAQ,GAAG,YAAY,CAAC,CAAC,CAAC,CAAC;AAEjC,QAAA,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,QAAQ,CAAC,MAAM,EAAE,CAAC,EAAE,EAAE;AACxC,YAAA,MAAM,OAAO,GAAG,QAAQ,CAAC,CAAC,CAAC,CAAC;AAC5B,YAAA,MAAM,MAAM,GAAG,OAAO,CAAC,CAAC,CAAC,CAAC;YAC1B,IAAI,MAAM,GAAkC,kBAAkB,CAAC;;;AAI/D,YAAA,IAAI,OAAO,CAAC,MAAM,KAAK,CAAC,EAAE;gBACxB,MAAM,MAAM,GAAG,WAAW,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,CAAC;AACvC,gBAAA,MAAM,GAAG,mBAAmB,CAC1B,MAAM,EACN,OAAO,CAAC,CAAC,CAAC,EACV,OAAO,CAAC,CAAC,CAAC,EACV,OAAO,CAAC,MAAM,KAAK,CAAC,GAAG,SAAS,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,GAAG,EAAE,CAClD,CAAC;;;gBAIF,IAAI,MAAM,IAAI,IAAI;oBAAE,SAAS;AAC9B,aAAA;AAED,YAAA,MAAM,EAAE,MAAM,EAAE,IAAI,EAAE,IAAI,EAAE,OAAO,EAAE,MAAM,EAAE,MAAM,EAAE,GAAG,MAAM,CAAC;AAE/D,YAAA,eAAe,CAAC,GAAG,EAAE,CAAC,EAAE,MAAM,EAAE,MAAM,EAAE,IAAI,EAAE,MAAM,EAAE,IAAI,CAAC,CAAC;AAC5D,YAAA,IAAI,MAAM,IAAI,OAAO,IAAI,IAAI;AAAE,gBAAA,gBAAgB,CAAC,GAAG,EAAE,MAAM,EAAE,OAAO,CAAC,CAAC;AACtE,YAAA,IAAI,MAAM;AAAE,gBAAA,SAAS,CAAC,GAAG,EAAE,MAAM,EAAE,IAAI,CAAC,CAAC;AAC1C,SAAA;AACF,KAAA;AAED,IAAA,OAAO,GAAG,CAAC;AACb,CAAC;AAED;;;AAGG;AACG,SAAU,mBAAmB,CACjC,MAAe,EACf,IAAY,EACZ,MAAc,EACd,IAAY,EAAA;AAEZ,IAAA,IAAI,CAAC,MAAM,CAAC,GAAG,EAAE;QACf,OAAO,aAAa,CAAC,MAAM,CAAC,MAAM,EAAE,IAAI,EAAE,MAAM,EAAE,IAAI,EAAE,MAAM,CAAC,OAAO,EAAE,MAAM,CAAC,MAAM,CAAC,CAAC;AACxF,KAAA;AAED,IAAA,MAAM,OAAO,GAAG,YAAY,CAAC,MAAM,CAAC,GAAG,EAAE,IAAI,EAAE,MAAM,CAAC,CAAC;;IAGvD,IAAI,OAAO,IAAI,IAAI;AAAE,QAAA,OAAO,IAAI,CAAC;;;AAGjC,IAAA,IAAI,OAAO,CAAC,MAAM,KAAK,CAAC;AAAE,QAAA,OAAO,kBAAkB,CAAC;IAEpD,OAAO,mBAAmB,CACxB,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,EAC1B,OAAO,CAAC,CAAC,CAAC,EACV,OAAO,CAAC,CAAC,CAAC,EACV,OAAO,CAAC,MAAM,KAAK,CAAC,GAAG,MAAM,CAAC,GAAG,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,GAAG,IAAI,CAC3D,CAAC;AACJ;;ACpKA,SAAS,OAAO,CAAI,KAAc,EAAA;AAChC,IAAA,IAAI,KAAK,CAAC,OAAO,CAAC,KAAK,CAAC;AAAE,QAAA,OAAO,KAAK,CAAC;IACvC,OAAO,CAAC,KAAK,CAAC,CAAC;AACjB,CAAC;AAED;;;;;;;;;;AAUG;AACW,SAAU,kBAAkB,CACxC,KAAwC,EACxC,MAAuB,EAAA;IAEvB,MAAM,IAAI,GAAG,OAAO,CAAC,KAAK,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,IAAI,QAAQ,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC;AAC5D,IAAA,MAAM,GAAG,GAAG,IAAI,CAAC,GAAG,EAAG,CAAC;AAExB,IAAA,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,IAAI,CAAC,MAAM,EAAE,CAAC,EAAE,EAAE;QACpC,IAAI,IAAI,CAAC,CAAC,CAAC,CAAC,OAAO,CAAC,MAAM,GAAG,CAAC,EAAE;AAC9B,YAAA,MAAM,IAAI,KAAK,CACb,CAAA,mBAAA,EAAsB,CAAC,CAAuC,qCAAA,CAAA;AAC5D,gBAAA,uEAAuE,CAC1E,CAAC;AACH,SAAA;AACF,KAAA;AAED,IAAA,IAAI,IAAI,GAAG,KAAK,CAAC,GAAG,EAAE,MAAM,EAAE,EAAE,EAAE,CAAC,CAAC,CAAC;AACrC,IAAA,KAAK,IAAI,CAAC,GAAG,IAAI,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC,IAAI,CAAC,EAAE,CAAC,EAAE,EAAE;AACzC,QAAA,IAAI,GAAG,SAAS,CAAC,IAAI,CAAC,CAAC,CAAC,EAAE,CAAC,IAAI,CAAC,CAAC,CAAC;AACnC,KAAA;AACD,IAAA,OAAO,IAAI,CAAC;AACd,CAAC;AAED,SAAS,KAAK,CACZ,GAAa,EACb,MAAuB,EACvB,QAAgB,EAChB,aAAqB,EAAA;IAErB,MAAM,EAAE,eAAe,EAAE,cAAc,EAAE,UAAU,EAAE,GAAG,GAAG,CAAC;AAE5D,IAAA,MAAM,KAAK,GAAG,aAAa,GAAG,CAAC,CAAC;IAChC,MAAM,QAAQ,GAAG,eAAe,CAAC,GAAG,CAAC,CAAC,UAAyB,EAAE,CAAS,KAAa;;;;;AAKrF,QAAA,MAAM,GAAG,GAAkB;YACzB,QAAQ;YACR,KAAK;YACL,MAAM,EAAE,UAAU,IAAI,EAAE;AACxB,YAAA,OAAO,EAAE,SAAS;AAClB,YAAA,MAAM,EAAE,SAAS;SAClB,CAAC;;;QAIF,MAAM,SAAS,GAAG,MAAM,CAAC,GAAG,CAAC,MAAM,EAAE,GAAG,CAAC,CAAC;QAE1C,MAAM,EAAE,MAAM,EAAE,OAAO,EAAE,MAAM,EAAE,GAAG,GAAG,CAAC;;AAGxC,QAAA,IAAI,SAAS;AAAE,YAAA,OAAO,KAAK,CAAC,IAAI,QAAQ,CAAC,SAAS,EAAE,MAAM,CAAC,EAAE,MAAM,EAAE,MAAM,EAAE,KAAK,CAAC,CAAC;;;;;QAMpF,MAAM,aAAa,GACjB,OAAO,KAAK,SAAS,GAAG,OAAO,GAAG,cAAc,GAAG,cAAc,CAAC,CAAC,CAAC,GAAG,IAAI,CAAC;QAC9E,MAAM,OAAO,GAAG,MAAM,KAAK,SAAS,GAAG,MAAM,GAAG,UAAU,GAAG,UAAU,CAAC,QAAQ,CAAC,CAAC,CAAC,GAAG,KAAK,CAAC;QAC5F,OAAO,cAAc,CAAC,MAAM,EAAE,aAAa,EAAE,OAAO,CAAC,CAAC;AACxD,KAAC,CAAC,CAAC;AAEH,IAAA,OAAO,SAAS,CAAC,GAAG,EAAE,QAAQ,CAAC,CAAC;AAClC;;ACnFA;;;AAGG;AACW,MAAO,SAAS,CAAA;IAU5B,WAAY,CAAA,GAAe,EAAE,OAAgB,EAAA;AAC3C,QAAA,MAAM,GAAG,GAAG,OAAO,CAAC,eAAe,GAAG,YAAY,CAAC,GAAG,CAAC,GAAG,YAAY,CAAC,GAAG,CAAC,CAAC;QAC5E,IAAI,CAAC,OAAO,GAAG,GAAG,CAAC,OAAO,CAAC;AAC3B,QAAA,IAAI,CAAC,IAAI,GAAG,GAAG,CAAC,IAAI,CAAC;AACrB,QAAA,IAAI,CAAC,QAAQ,GAAG,GAAG,CAAC,QAAiC,CAAC;AACtD,QAAA,IAAI,CAAC,KAAK,GAAG,GAAG,CAAC,KAA2B,CAAC;AAC7C,QAAA,IAAI,CAAC,UAAU,GAAG,GAAG,CAAC,UAAqC,CAAC;AAC5D,QAAA,IAAI,CAAC,UAAU,GAAG,GAAG,CAAC,UAAU,CAAC;AAEjC,QAAA,IAAI,CAAC,OAAO,GAAG,GAAG,CAAC,OAA+B,CAAC;AACnD,QAAA,IAAI,CAAC,OAAO,CAAC,cAAc,EAAE;AAC3B,YAAA,IAAI,CAAC,cAAc,GAAG,GAAG,CAAC,cAA6C,CAAC;AACzE,SAAA;KACF;IAED,QAAQ,GAAA;AACN,QAAA,OAAO,IAAI,CAAC,SAAS,CAAC,IAAI,CAAC,CAAC;KAC7B;AACF;;ACpBD;;;;;;;;;;;;;;AAcG;AACqB,SAAA,SAAS,CAC/B,KAAwC,EACxC,MAAuB,EACvB,OAA2B,EAAA;IAE3B,MAAM,IAAI,GACR,OAAO,OAAO,KAAK,QAAQ,GAAG,OAAO,GAAG,EAAE,cAAc,EAAE,CAAC,CAAC,OAAO,EAAE,eAAe,EAAE,KAAK,EAAE,CAAC;IAChG,MAAM,IAAI,GAAG,kBAAkB,CAAC,KAAK,EAAE,MAAM,CAAC,CAAC;IAC/C,OAAO,IAAI,SAAS,CAAC,aAAa,CAAC,IAAI,CAAC,EAAE,IAAI,CAAC,CAAC;AAClD;;;;"}


--------------------------------------------------------------------------------
/node_modules/@ampproject/remapping/dist/remapping.umd.js:
--------------------------------------------------------------------------------
  1 | (function (global, factory) {
  2 |     typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@jridgewell/trace-mapping'), require('@jridgewell/gen-mapping')) :
  3 |     typeof define === 'function' && define.amd ? define(['@jridgewell/trace-mapping', '@jridgewell/gen-mapping'], factory) :
  4 |     (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.remapping = factory(global.traceMapping, global.genMapping));
  5 | })(this, (function (traceMapping, genMapping) { 'use strict';
  6 | 
  7 |     const SOURCELESS_MAPPING = /* #__PURE__ */ SegmentObject('', -1, -1, '', null, false);
  8 |     const EMPTY_SOURCES = [];
  9 |     function SegmentObject(source, line, column, name, content, ignore) {
 10 |         return { source, line, column, name, content, ignore };
 11 |     }
 12 |     function Source(map, sources, source, content, ignore) {
 13 |         return {
 14 |             map,
 15 |             sources,
 16 |             source,
 17 |             content,
 18 |             ignore,
 19 |         };
 20 |     }
 21 |     /**
 22 |      * MapSource represents a single sourcemap, with the ability to trace mappings into its child nodes
 23 |      * (which may themselves be SourceMapTrees).
 24 |      */
 25 |     function MapSource(map, sources) {
 26 |         return Source(map, sources, '', null, false);
 27 |     }
 28 |     /**
 29 |      * A "leaf" node in the sourcemap tree, representing an original, unmodified source file. Recursive
 30 |      * segment tracing ends at the `OriginalSource`.
 31 |      */
 32 |     function OriginalSource(source, content, ignore) {
 33 |         return Source(null, EMPTY_SOURCES, source, content, ignore);
 34 |     }
 35 |     /**
 36 |      * traceMappings is only called on the root level SourceMapTree, and begins the process of
 37 |      * resolving each mapping in terms of the original source files.
 38 |      */
 39 |     function traceMappings(tree) {
 40 |         // TODO: Eventually support sourceRoot, which has to be removed because the sources are already
 41 |         // fully resolved. We'll need to make sources relative to the sourceRoot before adding them.
 42 |         const gen = new genMapping.GenMapping({ file: tree.map.file });
 43 |         const { sources: rootSources, map } = tree;
 44 |         const rootNames = map.names;
 45 |         const rootMappings = traceMapping.decodedMappings(map);
 46 |         for (let i = 0; i < rootMappings.length; i++) {
 47 |             const segments = rootMappings[i];
 48 |             for (let j = 0; j < segments.length; j++) {
 49 |                 const segment = segments[j];
 50 |                 const genCol = segment[0];
 51 |                 let traced = SOURCELESS_MAPPING;
 52 |                 // 1-length segments only move the current generated column, there's no source information
 53 |                 // to gather from it.
 54 |                 if (segment.length !== 1) {
 55 |                     const source = rootSources[segment[1]];
 56 |                     traced = originalPositionFor(source, segment[2], segment[3], segment.length === 5 ? rootNames[segment[4]] : '');
 57 |                     // If the trace is invalid, then the trace ran into a sourcemap that doesn't contain a
 58 |                     // respective segment into an original source.
 59 |                     if (traced == null)
 60 |                         continue;
 61 |                 }
 62 |                 const { column, line, name, content, source, ignore } = traced;
 63 |                 genMapping.maybeAddSegment(gen, i, genCol, source, line, column, name);
 64 |                 if (source && content != null)
 65 |                     genMapping.setSourceContent(gen, source, content);
 66 |                 if (ignore)
 67 |                     genMapping.setIgnore(gen, source, true);
 68 |             }
 69 |         }
 70 |         return gen;
 71 |     }
 72 |     /**
 73 |      * originalPositionFor is only called on children SourceMapTrees. It recurses down into its own
 74 |      * child SourceMapTrees, until we find the original source map.
 75 |      */
 76 |     function originalPositionFor(source, line, column, name) {
 77 |         if (!source.map) {
 78 |             return SegmentObject(source.source, line, column, name, source.content, source.ignore);
 79 |         }
 80 |         const segment = traceMapping.traceSegment(source.map, line, column);
 81 |         // If we couldn't find a segment, then this doesn't exist in the sourcemap.
 82 |         if (segment == null)
 83 |             return null;
 84 |         // 1-length segments only move the current generated column, there's no source information
 85 |         // to gather from it.
 86 |         if (segment.length === 1)
 87 |             return SOURCELESS_MAPPING;
 88 |         return originalPositionFor(source.sources[segment[1]], segment[2], segment[3], segment.length === 5 ? source.map.names[segment[4]] : name);
 89 |     }
 90 | 
 91 |     function asArray(value) {
 92 |         if (Array.isArray(value))
 93 |             return value;
 94 |         return [value];
 95 |     }
 96 |     /**
 97 |      * Recursively builds a tree structure out of sourcemap files, with each node
 98 |      * being either an `OriginalSource` "leaf" or a `SourceMapTree` composed of
 99 |      * `OriginalSource`s and `SourceMapTree`s.
100 |      *
101 |      * Every sourcemap is composed of a collection of source files and mappings
102 |      * into locations of those source files. When we generate a `SourceMapTree` for
103 |      * the sourcemap, we attempt to load each source file's own sourcemap. If it
104 |      * does not have an associated sourcemap, it is considered an original,
105 |      * unmodified source file.
106 |      */
107 |     function buildSourceMapTree(input, loader) {
108 |         const maps = asArray(input).map((m) => new traceMapping.TraceMap(m, ''));
109 |         const map = maps.pop();
110 |         for (let i = 0; i < maps.length; i++) {
111 |             if (maps[i].sources.length > 1) {
112 |                 throw new Error(`Transformation map ${i} must have exactly one source file.\n` +
113 |                     'Did you specify these with the most recent transformation maps first?');
114 |             }
115 |         }
116 |         let tree = build(map, loader, '', 0);
117 |         for (let i = maps.length - 1; i >= 0; i--) {
118 |             tree = MapSource(maps[i], [tree]);
119 |         }
120 |         return tree;
121 |     }
122 |     function build(map, loader, importer, importerDepth) {
123 |         const { resolvedSources, sourcesContent, ignoreList } = map;
124 |         const depth = importerDepth + 1;
125 |         const children = resolvedSources.map((sourceFile, i) => {
126 |             // The loading context gives the loader more information about why this file is being loaded
127 |             // (eg, from which importer). It also allows the loader to override the location of the loaded
128 |             // sourcemap/original source, or to override the content in the sourcesContent field if it's
129 |             // an unmodified source file.
130 |             const ctx = {
131 |                 importer,
132 |                 depth,
133 |                 source: sourceFile || '',
134 |                 content: undefined,
135 |                 ignore: undefined,
136 |             };
137 |             // Use the provided loader callback to retrieve the file's sourcemap.
138 |             // TODO: We should eventually support async loading of sourcemap files.
139 |             const sourceMap = loader(ctx.source, ctx);
140 |             const { source, content, ignore } = ctx;
141 |             // If there is a sourcemap, then we need to recurse into it to load its source files.
142 |             if (sourceMap)
143 |                 return build(new traceMapping.TraceMap(sourceMap, source), loader, source, depth);
144 |             // Else, it's an unmodified source file.
145 |             // The contents of this unmodified source file can be overridden via the loader context,
146 |             // allowing it to be explicitly null or a string. If it remains undefined, we fall back to
147 |             // the importing sourcemap's `sourcesContent` field.
148 |             const sourceContent = content !== undefined ? content : sourcesContent ? sourcesContent[i] : null;
149 |             const ignored = ignore !== undefined ? ignore : ignoreList ? ignoreList.includes(i) : false;
150 |             return OriginalSource(source, sourceContent, ignored);
151 |         });
152 |         return MapSource(map, children);
153 |     }
154 | 
155 |     /**
156 |      * A SourceMap v3 compatible sourcemap, which only includes fields that were
157 |      * provided to it.
158 |      */
159 |     class SourceMap {
160 |         constructor(map, options) {
161 |             const out = options.decodedMappings ? genMapping.toDecodedMap(map) : genMapping.toEncodedMap(map);
162 |             this.version = out.version; // SourceMap spec says this should be first.
163 |             this.file = out.file;
164 |             this.mappings = out.mappings;
165 |             this.names = out.names;
166 |             this.ignoreList = out.ignoreList;
167 |             this.sourceRoot = out.sourceRoot;
168 |             this.sources = out.sources;
169 |             if (!options.excludeContent) {
170 |                 this.sourcesContent = out.sourcesContent;
171 |             }
172 |         }
173 |         toString() {
174 |             return JSON.stringify(this);
175 |         }
176 |     }
177 | 
178 |     /**
179 |      * Traces through all the mappings in the root sourcemap, through the sources
180 |      * (and their sourcemaps), all the way back to the original source location.
181 |      *
182 |      * `loader` will be called every time we encounter a source file. If it returns
183 |      * a sourcemap, we will recurse into that sourcemap to continue the trace. If
184 |      * it returns a falsey value, that source file is treated as an original,
185 |      * unmodified source file.
186 |      *
187 |      * Pass `excludeContent` to exclude any self-containing source file content
188 |      * from the output sourcemap.
189 |      *
190 |      * Pass `decodedMappings` to receive a SourceMap with decoded (instead of
191 |      * VLQ encoded) mappings.
192 |      */
193 |     function remapping(input, loader, options) {
194 |         const opts = typeof options === 'object' ? options : { excludeContent: !!options, decodedMappings: false };
195 |         const tree = buildSourceMapTree(input, loader);
196 |         return new SourceMap(traceMappings(tree), opts);
197 |     }
198 | 
199 |     return remapping;
200 | 
201 | }));
202 | //# sourceMappingURL=remapping.umd.js.map
203 | 


--------------------------------------------------------------------------------
/node_modules/@ampproject/remapping/dist/remapping.umd.js.map:
--------------------------------------------------------------------------------
1 | {"version":3,"file":"remapping.umd.js","sources":["../src/source-map-tree.ts","../src/build-source-map-tree.ts","../src/source-map.ts","../src/remapping.ts"],"sourcesContent":["import { GenMapping, maybeAddSegment, setIgnore, setSourceContent } from '@jridgewell/gen-mapping';\nimport { traceSegment, decodedMappings } from '@jridgewell/trace-mapping';\n\nimport type { TraceMap } from '@jridgewell/trace-mapping';\n\nexport type SourceMapSegmentObject = {\n  column: number;\n  line: number;\n  name: string;\n  source: string;\n  content: string | null;\n  ignore: boolean;\n};\n\nexport type OriginalSource = {\n  map: null;\n  sources: Sources[];\n  source: string;\n  content: string | null;\n  ignore: boolean;\n};\n\nexport type MapSource = {\n  map: TraceMap;\n  sources: Sources[];\n  source: string;\n  content: null;\n  ignore: false;\n};\n\nexport type Sources = OriginalSource | MapSource;\n\nconst SOURCELESS_MAPPING = /* #__PURE__ */ SegmentObject('', -1, -1, '', null, false);\nconst EMPTY_SOURCES: Sources[] = [];\n\nfunction SegmentObject(\n  source: string,\n  line: number,\n  column: number,\n  name: string,\n  content: string | null,\n  ignore: boolean\n): SourceMapSegmentObject {\n  return { source, line, column, name, content, ignore };\n}\n\nfunction Source(\n  map: TraceMap,\n  sources: Sources[],\n  source: '',\n  content: null,\n  ignore: false\n): MapSource;\nfunction Source(\n  map: null,\n  sources: Sources[],\n  source: string,\n  content: string | null,\n  ignore: boolean\n): OriginalSource;\nfunction Source(\n  map: TraceMap | null,\n  sources: Sources[],\n  source: string | '',\n  content: string | null,\n  ignore: boolean\n): Sources {\n  return {\n    map,\n    sources,\n    source,\n    content,\n    ignore,\n  } as any;\n}\n\n/**\n * MapSource represents a single sourcemap, with the ability to trace mappings into its child nodes\n * (which may themselves be SourceMapTrees).\n */\nexport function MapSource(map: TraceMap, sources: Sources[]): MapSource {\n  return Source(map, sources, '', null, false);\n}\n\n/**\n * A \"leaf\" node in the sourcemap tree, representing an original, unmodified source file. Recursive\n * segment tracing ends at the `OriginalSource`.\n */\nexport function OriginalSource(\n  source: string,\n  content: string | null,\n  ignore: boolean\n): OriginalSource {\n  return Source(null, EMPTY_SOURCES, source, content, ignore);\n}\n\n/**\n * traceMappings is only called on the root level SourceMapTree, and begins the process of\n * resolving each mapping in terms of the original source files.\n */\nexport function traceMappings(tree: MapSource): GenMapping {\n  // TODO: Eventually support sourceRoot, which has to be removed because the sources are already\n  // fully resolved. We'll need to make sources relative to the sourceRoot before adding them.\n  const gen = new GenMapping({ file: tree.map.file });\n  const { sources: rootSources, map } = tree;\n  const rootNames = map.names;\n  const rootMappings = decodedMappings(map);\n\n  for (let i = 0; i < rootMappings.length; i++) {\n    const segments = rootMappings[i];\n\n    for (let j = 0; j < segments.length; j++) {\n      const segment = segments[j];\n      const genCol = segment[0];\n      let traced: SourceMapSegmentObject | null = SOURCELESS_MAPPING;\n\n      // 1-length segments only move the current generated column, there's no source information\n      // to gather from it.\n      if (segment.length !== 1) {\n        const source = rootSources[segment[1]];\n        traced = originalPositionFor(\n          source,\n          segment[2],\n          segment[3],\n          segment.length === 5 ? rootNames[segment[4]] : ''\n        );\n\n        // If the trace is invalid, then the trace ran into a sourcemap that doesn't contain a\n        // respective segment into an original source.\n        if (traced == null) continue;\n      }\n\n      const { column, line, name, content, source, ignore } = traced;\n\n      maybeAddSegment(gen, i, genCol, source, line, column, name);\n      if (source && content != null) setSourceContent(gen, source, content);\n      if (ignore) setIgnore(gen, source, true);\n    }\n  }\n\n  return gen;\n}\n\n/**\n * originalPositionFor is only called on children SourceMapTrees. It recurses down into its own\n * child SourceMapTrees, until we find the original source map.\n */\nexport function originalPositionFor(\n  source: Sources,\n  line: number,\n  column: number,\n  name: string\n): SourceMapSegmentObject | null {\n  if (!source.map) {\n    return SegmentObject(source.source, line, column, name, source.content, source.ignore);\n  }\n\n  const segment = traceSegment(source.map, line, column);\n\n  // If we couldn't find a segment, then this doesn't exist in the sourcemap.\n  if (segment == null) return null;\n  // 1-length segments only move the current generated column, there's no source information\n  // to gather from it.\n  if (segment.length === 1) return SOURCELESS_MAPPING;\n\n  return originalPositionFor(\n    source.sources[segment[1]],\n    segment[2],\n    segment[3],\n    segment.length === 5 ? source.map.names[segment[4]] : name\n  );\n}\n","import { TraceMap } from '@jridgewell/trace-mapping';\n\nimport { OriginalSource, MapSource } from './source-map-tree';\n\nimport type { Sources, MapSource as MapSourceType } from './source-map-tree';\nimport type { SourceMapInput, SourceMapLoader, LoaderContext } from './types';\n\nfunction asArray<T>(value: T | T[]): T[] {\n  if (Array.isArray(value)) return value;\n  return [value];\n}\n\n/**\n * Recursively builds a tree structure out of sourcemap files, with each node\n * being either an `OriginalSource` \"leaf\" or a `SourceMapTree` composed of\n * `OriginalSource`s and `SourceMapTree`s.\n *\n * Every sourcemap is composed of a collection of source files and mappings\n * into locations of those source files. When we generate a `SourceMapTree` for\n * the sourcemap, we attempt to load each source file's own sourcemap. If it\n * does not have an associated sourcemap, it is considered an original,\n * unmodified source file.\n */\nexport default function buildSourceMapTree(\n  input: SourceMapInput | SourceMapInput[],\n  loader: SourceMapLoader\n): MapSourceType {\n  const maps = asArray(input).map((m) => new TraceMap(m, ''));\n  const map = maps.pop()!;\n\n  for (let i = 0; i < maps.length; i++) {\n    if (maps[i].sources.length > 1) {\n      throw new Error(\n        `Transformation map ${i} must have exactly one source file.\\n` +\n          'Did you specify these with the most recent transformation maps first?'\n      );\n    }\n  }\n\n  let tree = build(map, loader, '', 0);\n  for (let i = maps.length - 1; i >= 0; i--) {\n    tree = MapSource(maps[i], [tree]);\n  }\n  return tree;\n}\n\nfunction build(\n  map: TraceMap,\n  loader: SourceMapLoader,\n  importer: string,\n  importerDepth: number\n): MapSourceType {\n  const { resolvedSources, sourcesContent, ignoreList } = map;\n\n  const depth = importerDepth + 1;\n  const children = resolvedSources.map((sourceFile: string | null, i: number): Sources => {\n    // The loading context gives the loader more information about why this file is being loaded\n    // (eg, from which importer). It also allows the loader to override the location of the loaded\n    // sourcemap/original source, or to override the content in the sourcesContent field if it's\n    // an unmodified source file.\n    const ctx: LoaderContext = {\n      importer,\n      depth,\n      source: sourceFile || '',\n      content: undefined,\n      ignore: undefined,\n    };\n\n    // Use the provided loader callback to retrieve the file's sourcemap.\n    // TODO: We should eventually support async loading of sourcemap files.\n    const sourceMap = loader(ctx.source, ctx);\n\n    const { source, content, ignore } = ctx;\n\n    // If there is a sourcemap, then we need to recurse into it to load its source files.\n    if (sourceMap) return build(new TraceMap(sourceMap, source), loader, source, depth);\n\n    // Else, it's an unmodified source file.\n    // The contents of this unmodified source file can be overridden via the loader context,\n    // allowing it to be explicitly null or a string. If it remains undefined, we fall back to\n    // the importing sourcemap's `sourcesContent` field.\n    const sourceContent =\n      content !== undefined ? content : sourcesContent ? sourcesContent[i] : null;\n    const ignored = ignore !== undefined ? ignore : ignoreList ? ignoreList.includes(i) : false;\n    return OriginalSource(source, sourceContent, ignored);\n  });\n\n  return MapSource(map, children);\n}\n","import { toDecodedMap, toEncodedMap } from '@jridgewell/gen-mapping';\n\nimport type { GenMapping } from '@jridgewell/gen-mapping';\nimport type { DecodedSourceMap, EncodedSourceMap, Options } from './types';\n\n/**\n * A SourceMap v3 compatible sourcemap, which only includes fields that were\n * provided to it.\n */\nexport default class SourceMap {\n  declare file?: string | null;\n  declare mappings: EncodedSourceMap['mappings'] | DecodedSourceMap['mappings'];\n  declare sourceRoot?: string;\n  declare names: string[];\n  declare sources: (string | null)[];\n  declare sourcesContent?: (string | null)[];\n  declare version: 3;\n  declare ignoreList: number[] | undefined;\n\n  constructor(map: GenMapping, options: Options) {\n    const out = options.decodedMappings ? toDecodedMap(map) : toEncodedMap(map);\n    this.version = out.version; // SourceMap spec says this should be first.\n    this.file = out.file;\n    this.mappings = out.mappings as SourceMap['mappings'];\n    this.names = out.names as SourceMap['names'];\n    this.ignoreList = out.ignoreList as SourceMap['ignoreList'];\n    this.sourceRoot = out.sourceRoot;\n\n    this.sources = out.sources as SourceMap['sources'];\n    if (!options.excludeContent) {\n      this.sourcesContent = out.sourcesContent as SourceMap['sourcesContent'];\n    }\n  }\n\n  toString(): string {\n    return JSON.stringify(this);\n  }\n}\n","import buildSourceMapTree from './build-source-map-tree';\nimport { traceMappings } from './source-map-tree';\nimport SourceMap from './source-map';\n\nimport type { SourceMapInput, SourceMapLoader, Options } from './types';\nexport type {\n  SourceMapSegment,\n  EncodedSourceMap,\n  EncodedSourceMap as RawSourceMap,\n  DecodedSourceMap,\n  SourceMapInput,\n  SourceMapLoader,\n  LoaderContext,\n  Options,\n} from './types';\nexport type { SourceMap };\n\n/**\n * Traces through all the mappings in the root sourcemap, through the sources\n * (and their sourcemaps), all the way back to the original source location.\n *\n * `loader` will be called every time we encounter a source file. If it returns\n * a sourcemap, we will recurse into that sourcemap to continue the trace. If\n * it returns a falsey value, that source file is treated as an original,\n * unmodified source file.\n *\n * Pass `excludeContent` to exclude any self-containing source file content\n * from the output sourcemap.\n *\n * Pass `decodedMappings` to receive a SourceMap with decoded (instead of\n * VLQ encoded) mappings.\n */\nexport default function remapping(\n  input: SourceMapInput | SourceMapInput[],\n  loader: SourceMapLoader,\n  options?: boolean | Options\n): SourceMap {\n  const opts =\n    typeof options === 'object' ? options : { excludeContent: !!options, decodedMappings: false };\n  const tree = buildSourceMapTree(input, loader);\n  return new SourceMap(traceMappings(tree), opts);\n}\n"],"names":["GenMapping","decodedMappings","maybeAddSegment","setSourceContent","setIgnore","traceSegment","TraceMap","toDecodedMap","toEncodedMap"],"mappings":";;;;;;IAgCA,MAAM,kBAAkB,mBAAmB,aAAa,CAAC,EAAE,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,EAAE,EAAE,IAAI,EAAE,KAAK,CAAC,CAAC;IACtF,MAAM,aAAa,GAAc,EAAE,CAAC;IAEpC,SAAS,aAAa,CACpB,MAAc,EACd,IAAY,EACZ,MAAc,EACd,IAAY,EACZ,OAAsB,EACtB,MAAe,EAAA;IAEf,IAAA,OAAO,EAAE,MAAM,EAAE,IAAI,EAAE,MAAM,EAAE,IAAI,EAAE,OAAO,EAAE,MAAM,EAAE,CAAC;IACzD,CAAC;IAgBD,SAAS,MAAM,CACb,GAAoB,EACpB,OAAkB,EAClB,MAAmB,EACnB,OAAsB,EACtB,MAAe,EAAA;QAEf,OAAO;YACL,GAAG;YACH,OAAO;YACP,MAAM;YACN,OAAO;YACP,MAAM;SACA,CAAC;IACX,CAAC;IAED;;;IAGG;IACa,SAAA,SAAS,CAAC,GAAa,EAAE,OAAkB,EAAA;IACzD,IAAA,OAAO,MAAM,CAAC,GAAG,EAAE,OAAO,EAAE,EAAE,EAAE,IAAI,EAAE,KAAK,CAAC,CAAC;IAC/C,CAAC;IAED;;;IAGG;aACa,cAAc,CAC5B,MAAc,EACd,OAAsB,EACtB,MAAe,EAAA;IAEf,IAAA,OAAO,MAAM,CAAC,IAAI,EAAE,aAAa,EAAE,MAAM,EAAE,OAAO,EAAE,MAAM,CAAC,CAAC;IAC9D,CAAC;IAED;;;IAGG;IACG,SAAU,aAAa,CAAC,IAAe,EAAA;;;IAG3C,IAAA,MAAM,GAAG,GAAG,IAAIA,qBAAU,CAAC,EAAE,IAAI,EAAE,IAAI,CAAC,GAAG,CAAC,IAAI,EAAE,CAAC,CAAC;QACpD,MAAM,EAAE,OAAO,EAAE,WAAW,EAAE,GAAG,EAAE,GAAG,IAAI,CAAC;IAC3C,IAAA,MAAM,SAAS,GAAG,GAAG,CAAC,KAAK,CAAC;IAC5B,IAAA,MAAM,YAAY,GAAGC,4BAAe,CAAC,GAAG,CAAC,CAAC;IAE1C,IAAA,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,YAAY,CAAC,MAAM,EAAE,CAAC,EAAE,EAAE;IAC5C,QAAA,MAAM,QAAQ,GAAG,YAAY,CAAC,CAAC,CAAC,CAAC;IAEjC,QAAA,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,QAAQ,CAAC,MAAM,EAAE,CAAC,EAAE,EAAE;IACxC,YAAA,MAAM,OAAO,GAAG,QAAQ,CAAC,CAAC,CAAC,CAAC;IAC5B,YAAA,MAAM,MAAM,GAAG,OAAO,CAAC,CAAC,CAAC,CAAC;gBAC1B,IAAI,MAAM,GAAkC,kBAAkB,CAAC;;;IAI/D,YAAA,IAAI,OAAO,CAAC,MAAM,KAAK,CAAC,EAAE;oBACxB,MAAM,MAAM,GAAG,WAAW,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,CAAC;IACvC,gBAAA,MAAM,GAAG,mBAAmB,CAC1B,MAAM,EACN,OAAO,CAAC,CAAC,CAAC,EACV,OAAO,CAAC,CAAC,CAAC,EACV,OAAO,CAAC,MAAM,KAAK,CAAC,GAAG,SAAS,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,GAAG,EAAE,CAClD,CAAC;;;oBAIF,IAAI,MAAM,IAAI,IAAI;wBAAE,SAAS;IAC9B,aAAA;IAED,YAAA,MAAM,EAAE,MAAM,EAAE,IAAI,EAAE,IAAI,EAAE,OAAO,EAAE,MAAM,EAAE,MAAM,EAAE,GAAG,MAAM,CAAC;IAE/D,YAAAC,0BAAe,CAAC,GAAG,EAAE,CAAC,EAAE,MAAM,EAAE,MAAM,EAAE,IAAI,EAAE,MAAM,EAAE,IAAI,CAAC,CAAC;IAC5D,YAAA,IAAI,MAAM,IAAI,OAAO,IAAI,IAAI;IAAE,gBAAAC,2BAAgB,CAAC,GAAG,EAAE,MAAM,EAAE,OAAO,CAAC,CAAC;IACtE,YAAA,IAAI,MAAM;IAAE,gBAAAC,oBAAS,CAAC,GAAG,EAAE,MAAM,EAAE,IAAI,CAAC,CAAC;IAC1C,SAAA;IACF,KAAA;IAED,IAAA,OAAO,GAAG,CAAC;IACb,CAAC;IAED;;;IAGG;IACG,SAAU,mBAAmB,CACjC,MAAe,EACf,IAAY,EACZ,MAAc,EACd,IAAY,EAAA;IAEZ,IAAA,IAAI,CAAC,MAAM,CAAC,GAAG,EAAE;YACf,OAAO,aAAa,CAAC,MAAM,CAAC,MAAM,EAAE,IAAI,EAAE,MAAM,EAAE,IAAI,EAAE,MAAM,CAAC,OAAO,EAAE,MAAM,CAAC,MAAM,CAAC,CAAC;IACxF,KAAA;IAED,IAAA,MAAM,OAAO,GAAGC,yBAAY,CAAC,MAAM,CAAC,GAAG,EAAE,IAAI,EAAE,MAAM,CAAC,CAAC;;QAGvD,IAAI,OAAO,IAAI,IAAI;IAAE,QAAA,OAAO,IAAI,CAAC;;;IAGjC,IAAA,IAAI,OAAO,CAAC,MAAM,KAAK,CAAC;IAAE,QAAA,OAAO,kBAAkB,CAAC;QAEpD,OAAO,mBAAmB,CACxB,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,EAC1B,OAAO,CAAC,CAAC,CAAC,EACV,OAAO,CAAC,CAAC,CAAC,EACV,OAAO,CAAC,MAAM,KAAK,CAAC,GAAG,MAAM,CAAC,GAAG,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,GAAG,IAAI,CAC3D,CAAC;IACJ;;ICpKA,SAAS,OAAO,CAAI,KAAc,EAAA;IAChC,IAAA,IAAI,KAAK,CAAC,OAAO,CAAC,KAAK,CAAC;IAAE,QAAA,OAAO,KAAK,CAAC;QACvC,OAAO,CAAC,KAAK,CAAC,CAAC;IACjB,CAAC;IAED;;;;;;;;;;IAUG;IACW,SAAU,kBAAkB,CACxC,KAAwC,EACxC,MAAuB,EAAA;QAEvB,MAAM,IAAI,GAAG,OAAO,CAAC,KAAK,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,IAAIC,qBAAQ,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC;IAC5D,IAAA,MAAM,GAAG,GAAG,IAAI,CAAC,GAAG,EAAG,CAAC;IAExB,IAAA,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,IAAI,CAAC,MAAM,EAAE,CAAC,EAAE,EAAE;YACpC,IAAI,IAAI,CAAC,CAAC,CAAC,CAAC,OAAO,CAAC,MAAM,GAAG,CAAC,EAAE;IAC9B,YAAA,MAAM,IAAI,KAAK,CACb,CAAA,mBAAA,EAAsB,CAAC,CAAuC,qCAAA,CAAA;IAC5D,gBAAA,uEAAuE,CAC1E,CAAC;IACH,SAAA;IACF,KAAA;IAED,IAAA,IAAI,IAAI,GAAG,KAAK,CAAC,GAAG,EAAE,MAAM,EAAE,EAAE,EAAE,CAAC,CAAC,CAAC;IACrC,IAAA,KAAK,IAAI,CAAC,GAAG,IAAI,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC,IAAI,CAAC,EAAE,CAAC,EAAE,EAAE;IACzC,QAAA,IAAI,GAAG,SAAS,CAAC,IAAI,CAAC,CAAC,CAAC,EAAE,CAAC,IAAI,CAAC,CAAC,CAAC;IACnC,KAAA;IACD,IAAA,OAAO,IAAI,CAAC;IACd,CAAC;IAED,SAAS,KAAK,CACZ,GAAa,EACb,MAAuB,EACvB,QAAgB,EAChB,aAAqB,EAAA;QAErB,MAAM,EAAE,eAAe,EAAE,cAAc,EAAE,UAAU,EAAE,GAAG,GAAG,CAAC;IAE5D,IAAA,MAAM,KAAK,GAAG,aAAa,GAAG,CAAC,CAAC;QAChC,MAAM,QAAQ,GAAG,eAAe,CAAC,GAAG,CAAC,CAAC,UAAyB,EAAE,CAAS,KAAa;;;;;IAKrF,QAAA,MAAM,GAAG,GAAkB;gBACzB,QAAQ;gBACR,KAAK;gBACL,MAAM,EAAE,UAAU,IAAI,EAAE;IACxB,YAAA,OAAO,EAAE,SAAS;IAClB,YAAA,MAAM,EAAE,SAAS;aAClB,CAAC;;;YAIF,MAAM,SAAS,GAAG,MAAM,CAAC,GAAG,CAAC,MAAM,EAAE,GAAG,CAAC,CAAC;YAE1C,MAAM,EAAE,MAAM,EAAE,OAAO,EAAE,MAAM,EAAE,GAAG,GAAG,CAAC;;IAGxC,QAAA,IAAI,SAAS;IAAE,YAAA,OAAO,KAAK,CAAC,IAAIA,qBAAQ,CAAC,SAAS,EAAE,MAAM,CAAC,EAAE,MAAM,EAAE,MAAM,EAAE,KAAK,CAAC,CAAC;;;;;YAMpF,MAAM,aAAa,GACjB,OAAO,KAAK,SAAS,GAAG,OAAO,GAAG,cAAc,GAAG,cAAc,CAAC,CAAC,CAAC,GAAG,IAAI,CAAC;YAC9E,MAAM,OAAO,GAAG,MAAM,KAAK,SAAS,GAAG,MAAM,GAAG,UAAU,GAAG,UAAU,CAAC,QAAQ,CAAC,CAAC,CAAC,GAAG,KAAK,CAAC;YAC5F,OAAO,cAAc,CAAC,MAAM,EAAE,aAAa,EAAE,OAAO,CAAC,CAAC;IACxD,KAAC,CAAC,CAAC;IAEH,IAAA,OAAO,SAAS,CAAC,GAAG,EAAE,QAAQ,CAAC,CAAC;IAClC;;ICnFA;;;IAGG;IACW,MAAO,SAAS,CAAA;QAU5B,WAAY,CAAA,GAAe,EAAE,OAAgB,EAAA;IAC3C,QAAA,MAAM,GAAG,GAAG,OAAO,CAAC,eAAe,GAAGC,uBAAY,CAAC,GAAG,CAAC,GAAGC,uBAAY,CAAC,GAAG,CAAC,CAAC;YAC5E,IAAI,CAAC,OAAO,GAAG,GAAG,CAAC,OAAO,CAAC;IAC3B,QAAA,IAAI,CAAC,IAAI,GAAG,GAAG,CAAC,IAAI,CAAC;IACrB,QAAA,IAAI,CAAC,QAAQ,GAAG,GAAG,CAAC,QAAiC,CAAC;IACtD,QAAA,IAAI,CAAC,KAAK,GAAG,GAAG,CAAC,KAA2B,CAAC;IAC7C,QAAA,IAAI,CAAC,UAAU,GAAG,GAAG,CAAC,UAAqC,CAAC;IAC5D,QAAA,IAAI,CAAC,UAAU,GAAG,GAAG,CAAC,UAAU,CAAC;IAEjC,QAAA,IAAI,CAAC,OAAO,GAAG,GAAG,CAAC,OAA+B,CAAC;IACnD,QAAA,IAAI,CAAC,OAAO,CAAC,cAAc,EAAE;IAC3B,YAAA,IAAI,CAAC,cAAc,GAAG,GAAG,CAAC,cAA6C,CAAC;IACzE,SAAA;SACF;QAED,QAAQ,GAAA;IACN,QAAA,OAAO,IAAI,CAAC,SAAS,CAAC,IAAI,CAAC,CAAC;SAC7B;IACF;;ICpBD;;;;;;;;;;;;;;IAcG;IACqB,SAAA,SAAS,CAC/B,KAAwC,EACxC,MAAuB,EACvB,OAA2B,EAAA;QAE3B,MAAM,IAAI,GACR,OAAO,OAAO,KAAK,QAAQ,GAAG,OAAO,GAAG,EAAE,cAAc,EAAE,CAAC,CAAC,OAAO,EAAE,eAAe,EAAE,KAAK,EAAE,CAAC;QAChG,MAAM,IAAI,GAAG,kBAAkB,CAAC,KAAK,EAAE,MAAM,CAAC,CAAC;QAC/C,OAAO,IAAI,SAAS,CAAC,aAAa,CAAC,IAAI,CAAC,EAAE,IAAI,CAAC,CAAC;IAClD;;;;;;;;"}


--------------------------------------------------------------------------------
/node_modules/@ampproject/remapping/dist/types/build-source-map-tree.d.ts:
--------------------------------------------------------------------------------
 1 | import type { MapSource as MapSourceType } from './source-map-tree';
 2 | import type { SourceMapInput, SourceMapLoader } from './types';
 3 | /**
 4 |  * Recursively builds a tree structure out of sourcemap files, with each node
 5 |  * being either an `OriginalSource` "leaf" or a `SourceMapTree` composed of
 6 |  * `OriginalSource`s and `SourceMapTree`s.
 7 |  *
 8 |  * Every sourcemap is composed of a collection of source files and mappings
 9 |  * into locations of those source files. When we generate a `SourceMapTree` for
10 |  * the sourcemap, we attempt to load each source file's own sourcemap. If it
11 |  * does not have an associated sourcemap, it is considered an original,
12 |  * unmodified source file.
13 |  */
14 | export default function buildSourceMapTree(input: SourceMapInput | SourceMapInput[], loader: SourceMapLoader): MapSourceType;
15 | 


--------------------------------------------------------------------------------
/node_modules/@ampproject/remapping/dist/types/remapping.d.ts:
--------------------------------------------------------------------------------
 1 | import SourceMap from './source-map';
 2 | import type { SourceMapInput, SourceMapLoader, Options } from './types';
 3 | export type { SourceMapSegment, EncodedSourceMap, EncodedSourceMap as RawSourceMap, DecodedSourceMap, SourceMapInput, SourceMapLoader, LoaderContext, Options, } from './types';
 4 | export type { SourceMap };
 5 | /**
 6 |  * Traces through all the mappings in the root sourcemap, through the sources
 7 |  * (and their sourcemaps), all the way back to the original source location.
 8 |  *
 9 |  * `loader` will be called every time we encounter a source file. If it returns
10 |  * a sourcemap, we will recurse into that sourcemap to continue the trace. If
11 |  * it returns a falsey value, that source file is treated as an original,
12 |  * unmodified source file.
13 |  *
14 |  * Pass `excludeContent` to exclude any self-containing source file content
15 |  * from the output sourcemap.
16 |  *
17 |  * Pass `decodedMappings` to receive a SourceMap with decoded (instead of
18 |  * VLQ encoded) mappings.
19 |  */
20 | export default function remapping(input: SourceMapInput | SourceMapInput[], loader: SourceMapLoader, options?: boolean | Options): SourceMap;
21 | 


--------------------------------------------------------------------------------
/node_modules/@ampproject/remapping/dist/types/source-map-tree.d.ts:
--------------------------------------------------------------------------------
 1 | import { GenMapping } from '@jridgewell/gen-mapping';
 2 | import type { TraceMap } from '@jridgewell/trace-mapping';
 3 | export declare type SourceMapSegmentObject = {
 4 |     column: number;
 5 |     line: number;
 6 |     name: string;
 7 |     source: string;
 8 |     content: string | null;
 9 |     ignore: boolean;
10 | };
11 | export declare type OriginalSource = {
12 |     map: null;
13 |     sources: Sources[];
14 |     source: string;
15 |     content: string | null;
16 |     ignore: boolean;
17 | };
18 | export declare type MapSource = {
19 |     map: TraceMap;
20 |     sources: Sources[];
21 |     source: string;
22 |     content: null;
23 |     ignore: false;
24 | };
25 | export declare type Sources = OriginalSource | MapSource;
26 | /**
27 |  * MapSource represents a single sourcemap, with the ability to trace mappings into its child nodes
28 |  * (which may themselves be SourceMapTrees).
29 |  */
30 | export declare function MapSource(map: TraceMap, sources: Sources[]): MapSource;
31 | /**
32 |  * A "leaf" node in the sourcemap tree, representing an original, unmodified source file. Recursive
33 |  * segment tracing ends at the `OriginalSource`.
34 |  */
35 | export declare function OriginalSource(source: string, content: string | null, ignore: boolean): OriginalSource;
36 | /**
37 |  * traceMappings is only called on the root level SourceMapTree, and begins the process of
38 |  * resolving each mapping in terms of the original source files.
39 |  */
40 | export declare function traceMappings(tree: MapSource): GenMapping;
41 | /**
42 |  * originalPositionFor is only called on children SourceMapTrees. It recurses down into its own
43 |  * child SourceMapTrees, until we find the original source map.
44 |  */
45 | export declare function originalPositionFor(source: Sources, line: number, column: number, name: string): SourceMapSegmentObject | null;
46 | 


--------------------------------------------------------------------------------
/node_modules/@ampproject/remapping/dist/types/source-map.d.ts:
--------------------------------------------------------------------------------
 1 | import type { GenMapping } from '@jridgewell/gen-mapping';
 2 | import type { DecodedSourceMap, EncodedSourceMap, Options } from './types';
 3 | /**
 4 |  * A SourceMap v3 compatible sourcemap, which only includes fields that were
 5 |  * provided to it.
 6 |  */
 7 | export default class SourceMap {
 8 |     file?: string | null;
 9 |     mappings: EncodedSourceMap['mappings'] | DecodedSourceMap['mappings'];
10 |     sourceRoot?: string;
11 |     names: string[];
12 |     sources: (string | null)[];
13 |     sourcesContent?: (string | null)[];
14 |     version: 3;
15 |     ignoreList: number[] | undefined;
16 |     constructor(map: GenMapping, options: Options);
17 |     toString(): string;
18 | }
19 | 


--------------------------------------------------------------------------------
/node_modules/@ampproject/remapping/dist/types/types.d.ts:
--------------------------------------------------------------------------------
 1 | import type { SourceMapInput } from '@jridgewell/trace-mapping';
 2 | export type { SourceMapSegment, DecodedSourceMap, EncodedSourceMap, } from '@jridgewell/trace-mapping';
 3 | export type { SourceMapInput };
 4 | export declare type LoaderContext = {
 5 |     readonly importer: string;
 6 |     readonly depth: number;
 7 |     source: string;
 8 |     content: string | null | undefined;
 9 |     ignore: boolean | undefined;
10 | };
11 | export declare type SourceMapLoader = (file: string, ctx: LoaderContext) => SourceMapInput | null | undefined | void;
12 | export declare type Options = {
13 |     excludeContent?: boolean;
14 |     decodedMappings?: boolean;
15 | };
16 | 


--------------------------------------------------------------------------------
/node_modules/@ampproject/remapping/package.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "name": "@ampproject/remapping",
 3 |   "version": "2.3.0",
 4 |   "description": "Remap sequential sourcemaps through transformations to point at the original source code",
 5 |   "keywords": [
 6 |     "source",
 7 |     "map",
 8 |     "remap"
 9 |   ],
10 |   "main": "dist/remapping.umd.js",
11 |   "module": "dist/remapping.mjs",
12 |   "types": "dist/types/remapping.d.ts",
13 |   "exports": {
14 |     ".": [
15 |       {
16 |         "types": "./dist/types/remapping.d.ts",
17 |         "browser": "./dist/remapping.umd.js",
18 |         "require": "./dist/remapping.umd.js",
19 |         "import": "./dist/remapping.mjs"
20 |       },
21 |       "./dist/remapping.umd.js"
22 |     ],
23 |     "./package.json": "./package.json"
24 |   },
25 |   "files": [
26 |     "dist"
27 |   ],
28 |   "author": "Justin Ridgewell <jridgewell@google.com>",
29 |   "repository": {
30 |     "type": "git",
31 |     "url": "git+https://github.com/ampproject/remapping.git"
32 |   },
33 |   "license": "Apache-2.0",
34 |   "engines": {
35 |     "node": ">=6.0.0"
36 |   },
37 |   "scripts": {
38 |     "build": "run-s -n build:*",
39 |     "build:rollup": "rollup -c rollup.config.js",
40 |     "build:ts": "tsc --project tsconfig.build.json",
41 |     "lint": "run-s -n lint:*",
42 |     "lint:prettier": "npm run test:lint:prettier -- --write",
43 |     "lint:ts": "npm run test:lint:ts -- --fix",
44 |     "prebuild": "rm -rf dist",
45 |     "prepublishOnly": "npm run preversion",
46 |     "preversion": "run-s test build",
47 |     "test": "run-s -n test:lint test:only",
48 |     "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
49 |     "test:lint": "run-s -n test:lint:*",
50 |     "test:lint:prettier": "prettier --check '{src,test}/**/*.ts'",
51 |     "test:lint:ts": "eslint '{src,test}/**/*.ts'",
52 |     "test:only": "jest --coverage",
53 |     "test:watch": "jest --coverage --watch"
54 |   },
55 |   "devDependencies": {
56 |     "@rollup/plugin-typescript": "8.3.2",
57 |     "@types/jest": "27.4.1",
58 |     "@typescript-eslint/eslint-plugin": "5.20.0",
59 |     "@typescript-eslint/parser": "5.20.0",
60 |     "eslint": "8.14.0",
61 |     "eslint-config-prettier": "8.5.0",
62 |     "jest": "27.5.1",
63 |     "jest-config": "27.5.1",
64 |     "npm-run-all": "4.1.5",
65 |     "prettier": "2.6.2",
66 |     "rollup": "2.70.2",
67 |     "ts-jest": "27.1.4",
68 |     "tslib": "2.4.0",
69 |     "typescript": "4.6.3"
70 |   },
71 |   "dependencies": {
72 |     "@jridgewell/gen-mapping": "^0.3.5",
73 |     "@jridgewell/trace-mapping": "^0.3.24"
74 |   }
75 | }
76 | 


--------------------------------------------------------------------------------
/package-lock.json:
--------------------------------------------------------------------------------
   1 | {
   2 |   "name": "opensource-openai-vision",
   3 |   "version": "0.1.0",
   4 |   "lockfileVersion": 3,
   5 |   "requires": true,
   6 |   "packages": {
   7 |     "": {
   8 |       "name": "opensource-openai-vision",
   9 |       "version": "0.1.0",
  10 |       "dependencies": {
  11 |         "@fortawesome/fontawesome-svg-core": "^6.7.2",
  12 |         "@fortawesome/free-solid-svg-icons": "^6.7.2",
  13 |         "@fortawesome/react-fontawesome": "^0.2.2",
  14 |         "@google/generative-ai": "^0.24.1",
  15 |         "@vapi-ai/web": "^2.3.0",
  16 |         "next": "15.3.2",
  17 |         "react": "^19.0.0",
  18 |         "react-dom": "^19.0.0"
  19 |       },
  20 |       "devDependencies": {
  21 |         "@tailwindcss/postcss": "^4",
  22 |         "@types/node": "^20",
  23 |         "@types/react": "^19",
  24 |         "@types/react-dom": "^19",
  25 |         "tailwindcss": "^4",
  26 |         "typescript": "^5"
  27 |       }
  28 |     },
  29 |     "node_modules/@alloc/quick-lru": {
  30 |       "version": "5.2.0",
  31 |       "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz",
  32 |       "integrity": "sha512-UrcABB+4bUrFABwbluTIBErXwvbsU/V7TZWfmbgJfbkwiBuziS9gxdODUyuiecfdGQ85jglMW6juS3+z5TsKLw==",
  33 |       "dev": true,
  34 |       "license": "MIT",
  35 |       "engines": {
  36 |         "node": ">=10"
  37 |       },
  38 |       "funding": {
  39 |         "url": "https://github.com/sponsors/sindresorhus"
  40 |       }
  41 |     },
  42 |     "node_modules/@ampproject/remapping": {
  43 |       "version": "2.3.0",
  44 |       "resolved": "https://registry.npmjs.org/@ampproject/remapping/-/remapping-2.3.0.tgz",
  45 |       "integrity": "sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw==",
  46 |       "dev": true,
  47 |       "license": "Apache-2.0",
  48 |       "dependencies": {
  49 |         "@jridgewell/gen-mapping": "^0.3.5",
  50 |         "@jridgewell/trace-mapping": "^0.3.24"
  51 |       },
  52 |       "engines": {
  53 |         "node": ">=6.0.0"
  54 |       }
  55 |     },
  56 |     "node_modules/@babel/runtime": {
  57 |       "version": "7.27.3",
  58 |       "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.27.3.tgz",
  59 |       "integrity": "sha512-7EYtGezsdiDMyY80+65EzwiGmcJqpmcZCojSXaRgdrBaGtWTgDZKq69cPIVped6MkIM78cTQ2GOiEYjwOlG4xw==",
  60 |       "license": "MIT",
  61 |       "engines": {
  62 |         "node": ">=6.9.0"
  63 |       }
  64 |     },
  65 |     "node_modules/@daily-co/daily-js": {
  66 |       "version": "0.79.0",
  67 |       "resolved": "https://registry.npmjs.org/@daily-co/daily-js/-/daily-js-0.79.0.tgz",
  68 |       "integrity": "sha512-Ii/Zi6cfTl2EZBpX8msRPNkkCHcajA+ErXpbN2Xe2KySd1Nb4IzC/QWJlSl9VA9pIlYPQicRTDoZnoym/0uEAw==",
  69 |       "license": "BSD-2-Clause",
  70 |       "dependencies": {
  71 |         "@babel/runtime": "^7.12.5",
  72 |         "@sentry/browser": "^8.33.1",
  73 |         "bowser": "^2.8.1",
  74 |         "dequal": "^2.0.3",
  75 |         "events": "^3.1.0"
  76 |       },
  77 |       "engines": {
  78 |         "node": ">=10.0.0"
  79 |       }
  80 |     },
  81 |     "node_modules/@emnapi/runtime": {
  82 |       "version": "1.4.3",
  83 |       "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.4.3.tgz",
  84 |       "integrity": "sha512-pBPWdu6MLKROBX05wSNKcNb++m5Er+KQ9QkB+WVM+pW2Kx9hoSrVTnu3BdkI5eBLZoKu/J6mW/B6i6bJB2ytXQ==",
  85 |       "license": "MIT",
  86 |       "optional": true,
  87 |       "dependencies": {
  88 |         "tslib": "^2.4.0"
  89 |       }
  90 |     },
  91 |     "node_modules/@fortawesome/fontawesome-common-types": {
  92 |       "version": "6.7.2",
  93 |       "resolved": "https://registry.npmjs.org/@fortawesome/fontawesome-common-types/-/fontawesome-common-types-6.7.2.tgz",
  94 |       "integrity": "sha512-Zs+YeHUC5fkt7Mg1l6XTniei3k4bwG/yo3iFUtZWd/pMx9g3fdvkSK9E0FOC+++phXOka78uJcYb8JaFkW52Xg==",
  95 |       "license": "MIT",
  96 |       "engines": {
  97 |         "node": ">=6"
  98 |       }
  99 |     },
 100 |     "node_modules/@fortawesome/fontawesome-svg-core": {
 101 |       "version": "6.7.2",
 102 |       "resolved": "https://registry.npmjs.org/@fortawesome/fontawesome-svg-core/-/fontawesome-svg-core-6.7.2.tgz",
 103 |       "integrity": "sha512-yxtOBWDrdi5DD5o1pmVdq3WMCvnobT0LU6R8RyyVXPvFRd2o79/0NCuQoCjNTeZz9EzA9xS3JxNWfv54RIHFEA==",
 104 |       "license": "MIT",
 105 |       "dependencies": {
 106 |         "@fortawesome/fontawesome-common-types": "6.7.2"
 107 |       },
 108 |       "engines": {
 109 |         "node": ">=6"
 110 |       }
 111 |     },
 112 |     "node_modules/@fortawesome/free-solid-svg-icons": {
 113 |       "version": "6.7.2",
 114 |       "resolved": "https://registry.npmjs.org/@fortawesome/free-solid-svg-icons/-/free-solid-svg-icons-6.7.2.tgz",
 115 |       "integrity": "sha512-GsBrnOzU8uj0LECDfD5zomZJIjrPhIlWU82AHwa2s40FKH+kcxQaBvBo3Z4TxyZHIyX8XTDxsyA33/Vx9eFuQA==",
 116 |       "license": "(CC-BY-4.0 AND MIT)",
 117 |       "dependencies": {
 118 |         "@fortawesome/fontawesome-common-types": "6.7.2"
 119 |       },
 120 |       "engines": {
 121 |         "node": ">=6"
 122 |       }
 123 |     },
 124 |     "node_modules/@fortawesome/react-fontawesome": {
 125 |       "version": "0.2.2",
 126 |       "resolved": "https://registry.npmjs.org/@fortawesome/react-fontawesome/-/react-fontawesome-0.2.2.tgz",
 127 |       "integrity": "sha512-EnkrprPNqI6SXJl//m29hpaNzOp1bruISWaOiRtkMi/xSvHJlzc2j2JAYS7egxt/EbjSNV/k6Xy0AQI6vB2+1g==",
 128 |       "license": "MIT",
 129 |       "dependencies": {
 130 |         "prop-types": "^15.8.1"
 131 |       },
 132 |       "peerDependencies": {
 133 |         "@fortawesome/fontawesome-svg-core": "~1 || ~6",
 134 |         "react": ">=16.3"
 135 |       }
 136 |     },
 137 |     "node_modules/@google/generative-ai": {
 138 |       "version": "0.24.1",
 139 |       "resolved": "https://registry.npmjs.org/@google/generative-ai/-/generative-ai-0.24.1.tgz",
 140 |       "integrity": "sha512-MqO+MLfM6kjxcKoy0p1wRzG3b4ZZXtPI+z2IE26UogS2Cm/XHO+7gGRBh6gcJsOiIVoH93UwKvW4HdgiOZCy9Q==",
 141 |       "license": "Apache-2.0",
 142 |       "engines": {
 143 |         "node": ">=18.0.0"
 144 |       }
 145 |     },
 146 |     "node_modules/@img/sharp-darwin-arm64": {
 147 |       "version": "0.34.2",
 148 |       "resolved": "https://registry.npmjs.org/@img/sharp-darwin-arm64/-/sharp-darwin-arm64-0.34.2.tgz",
 149 |       "integrity": "sha512-OfXHZPppddivUJnqyKoi5YVeHRkkNE2zUFT2gbpKxp/JZCFYEYubnMg+gOp6lWfasPrTS+KPosKqdI+ELYVDtg==",
 150 |       "cpu": [
 151 |         "arm64"
 152 |       ],
 153 |       "license": "Apache-2.0",
 154 |       "optional": true,
 155 |       "os": [
 156 |         "darwin"
 157 |       ],
 158 |       "engines": {
 159 |         "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
 160 |       },
 161 |       "funding": {
 162 |         "url": "https://opencollective.com/libvips"
 163 |       },
 164 |       "optionalDependencies": {
 165 |         "@img/sharp-libvips-darwin-arm64": "1.1.0"
 166 |       }
 167 |     },
 168 |     "node_modules/@img/sharp-darwin-x64": {
 169 |       "version": "0.34.2",
 170 |       "resolved": "https://registry.npmjs.org/@img/sharp-darwin-x64/-/sharp-darwin-x64-0.34.2.tgz",
 171 |       "integrity": "sha512-dYvWqmjU9VxqXmjEtjmvHnGqF8GrVjM2Epj9rJ6BUIXvk8slvNDJbhGFvIoXzkDhrJC2jUxNLz/GUjjvSzfw+g==",
 172 |       "cpu": [
 173 |         "x64"
 174 |       ],
 175 |       "license": "Apache-2.0",
 176 |       "optional": true,
 177 |       "os": [
 178 |         "darwin"
 179 |       ],
 180 |       "engines": {
 181 |         "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
 182 |       },
 183 |       "funding": {
 184 |         "url": "https://opencollective.com/libvips"
 185 |       },
 186 |       "optionalDependencies": {
 187 |         "@img/sharp-libvips-darwin-x64": "1.1.0"
 188 |       }
 189 |     },
 190 |     "node_modules/@img/sharp-libvips-darwin-arm64": {
 191 |       "version": "1.1.0",
 192 |       "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-arm64/-/sharp-libvips-darwin-arm64-1.1.0.tgz",
 193 |       "integrity": "sha512-HZ/JUmPwrJSoM4DIQPv/BfNh9yrOA8tlBbqbLz4JZ5uew2+o22Ik+tHQJcih7QJuSa0zo5coHTfD5J8inqj9DA==",
 194 |       "cpu": [
 195 |         "arm64"
 196 |       ],
 197 |       "license": "LGPL-3.0-or-later",
 198 |       "optional": true,
 199 |       "os": [
 200 |         "darwin"
 201 |       ],
 202 |       "funding": {
 203 |         "url": "https://opencollective.com/libvips"
 204 |       }
 205 |     },
 206 |     "node_modules/@img/sharp-libvips-darwin-x64": {
 207 |       "version": "1.1.0",
 208 |       "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-x64/-/sharp-libvips-darwin-x64-1.1.0.tgz",
 209 |       "integrity": "sha512-Xzc2ToEmHN+hfvsl9wja0RlnXEgpKNmftriQp6XzY/RaSfwD9th+MSh0WQKzUreLKKINb3afirxW7A0fz2YWuQ==",
 210 |       "cpu": [
 211 |         "x64"
 212 |       ],
 213 |       "license": "LGPL-3.0-or-later",
 214 |       "optional": true,
 215 |       "os": [
 216 |         "darwin"
 217 |       ],
 218 |       "funding": {
 219 |         "url": "https://opencollective.com/libvips"
 220 |       }
 221 |     },
 222 |     "node_modules/@img/sharp-libvips-linux-arm": {
 223 |       "version": "1.1.0",
 224 |       "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm/-/sharp-libvips-linux-arm-1.1.0.tgz",
 225 |       "integrity": "sha512-s8BAd0lwUIvYCJyRdFqvsj+BJIpDBSxs6ivrOPm/R7piTs5UIwY5OjXrP2bqXC9/moGsyRa37eYWYCOGVXxVrA==",
 226 |       "cpu": [
 227 |         "arm"
 228 |       ],
 229 |       "license": "LGPL-3.0-or-later",
 230 |       "optional": true,
 231 |       "os": [
 232 |         "linux"
 233 |       ],
 234 |       "funding": {
 235 |         "url": "https://opencollective.com/libvips"
 236 |       }
 237 |     },
 238 |     "node_modules/@img/sharp-libvips-linux-arm64": {
 239 |       "version": "1.1.0",
 240 |       "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm64/-/sharp-libvips-linux-arm64-1.1.0.tgz",
 241 |       "integrity": "sha512-IVfGJa7gjChDET1dK9SekxFFdflarnUB8PwW8aGwEoF3oAsSDuNUTYS+SKDOyOJxQyDC1aPFMuRYLoDInyV9Ew==",
 242 |       "cpu": [
 243 |         "arm64"
 244 |       ],
 245 |       "license": "LGPL-3.0-or-later",
 246 |       "optional": true,
 247 |       "os": [
 248 |         "linux"
 249 |       ],
 250 |       "funding": {
 251 |         "url": "https://opencollective.com/libvips"
 252 |       }
 253 |     },
 254 |     "node_modules/@img/sharp-libvips-linux-ppc64": {
 255 |       "version": "1.1.0",
 256 |       "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-ppc64/-/sharp-libvips-linux-ppc64-1.1.0.tgz",
 257 |       "integrity": "sha512-tiXxFZFbhnkWE2LA8oQj7KYR+bWBkiV2nilRldT7bqoEZ4HiDOcePr9wVDAZPi/Id5fT1oY9iGnDq20cwUz8lQ==",
 258 |       "cpu": [
 259 |         "ppc64"
 260 |       ],
 261 |       "license": "LGPL-3.0-or-later",
 262 |       "optional": true,
 263 |       "os": [
 264 |         "linux"
 265 |       ],
 266 |       "funding": {
 267 |         "url": "https://opencollective.com/libvips"
 268 |       }
 269 |     },
 270 |     "node_modules/@img/sharp-libvips-linux-s390x": {
 271 |       "version": "1.1.0",
 272 |       "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-s390x/-/sharp-libvips-linux-s390x-1.1.0.tgz",
 273 |       "integrity": "sha512-xukSwvhguw7COyzvmjydRb3x/09+21HykyapcZchiCUkTThEQEOMtBj9UhkaBRLuBrgLFzQ2wbxdeCCJW/jgJA==",
 274 |       "cpu": [
 275 |         "s390x"
 276 |       ],
 277 |       "license": "LGPL-3.0-or-later",
 278 |       "optional": true,
 279 |       "os": [
 280 |         "linux"
 281 |       ],
 282 |       "funding": {
 283 |         "url": "https://opencollective.com/libvips"
 284 |       }
 285 |     },
 286 |     "node_modules/@img/sharp-libvips-linux-x64": {
 287 |       "version": "1.1.0",
 288 |       "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-x64/-/sharp-libvips-linux-x64-1.1.0.tgz",
 289 |       "integrity": "sha512-yRj2+reB8iMg9W5sULM3S74jVS7zqSzHG3Ol/twnAAkAhnGQnpjj6e4ayUz7V+FpKypwgs82xbRdYtchTTUB+Q==",
 290 |       "cpu": [
 291 |         "x64"
 292 |       ],
 293 |       "license": "LGPL-3.0-or-later",
 294 |       "optional": true,
 295 |       "os": [
 296 |         "linux"
 297 |       ],
 298 |       "funding": {
 299 |         "url": "https://opencollective.com/libvips"
 300 |       }
 301 |     },
 302 |     "node_modules/@img/sharp-libvips-linuxmusl-arm64": {
 303 |       "version": "1.1.0",
 304 |       "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-arm64/-/sharp-libvips-linuxmusl-arm64-1.1.0.tgz",
 305 |       "integrity": "sha512-jYZdG+whg0MDK+q2COKbYidaqW/WTz0cc1E+tMAusiDygrM4ypmSCjOJPmFTvHHJ8j/6cAGyeDWZOsK06tP33w==",
 306 |       "cpu": [
 307 |         "arm64"
 308 |       ],
 309 |       "license": "LGPL-3.0-or-later",
 310 |       "optional": true,
 311 |       "os": [
 312 |         "linux"
 313 |       ],
 314 |       "funding": {
 315 |         "url": "https://opencollective.com/libvips"
 316 |       }
 317 |     },
 318 |     "node_modules/@img/sharp-libvips-linuxmusl-x64": {
 319 |       "version": "1.1.0",
 320 |       "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-x64/-/sharp-libvips-linuxmusl-x64-1.1.0.tgz",
 321 |       "integrity": "sha512-wK7SBdwrAiycjXdkPnGCPLjYb9lD4l6Ze2gSdAGVZrEL05AOUJESWU2lhlC+Ffn5/G+VKuSm6zzbQSzFX/P65A==",
 322 |       "cpu": [
 323 |         "x64"
 324 |       ],
 325 |       "license": "LGPL-3.0-or-later",
 326 |       "optional": true,
 327 |       "os": [
 328 |         "linux"
 329 |       ],
 330 |       "funding": {
 331 |         "url": "https://opencollective.com/libvips"
 332 |       }
 333 |     },
 334 |     "node_modules/@img/sharp-linux-arm": {
 335 |       "version": "0.34.2",
 336 |       "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm/-/sharp-linux-arm-0.34.2.tgz",
 337 |       "integrity": "sha512-0DZzkvuEOqQUP9mo2kjjKNok5AmnOr1jB2XYjkaoNRwpAYMDzRmAqUIa1nRi58S2WswqSfPOWLNOr0FDT3H5RQ==",
 338 |       "cpu": [
 339 |         "arm"
 340 |       ],
 341 |       "license": "Apache-2.0",
 342 |       "optional": true,
 343 |       "os": [
 344 |         "linux"
 345 |       ],
 346 |       "engines": {
 347 |         "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
 348 |       },
 349 |       "funding": {
 350 |         "url": "https://opencollective.com/libvips"
 351 |       },
 352 |       "optionalDependencies": {
 353 |         "@img/sharp-libvips-linux-arm": "1.1.0"
 354 |       }
 355 |     },
 356 |     "node_modules/@img/sharp-linux-arm64": {
 357 |       "version": "0.34.2",
 358 |       "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm64/-/sharp-linux-arm64-0.34.2.tgz",
 359 |       "integrity": "sha512-D8n8wgWmPDakc83LORcfJepdOSN6MvWNzzz2ux0MnIbOqdieRZwVYY32zxVx+IFUT8er5KPcyU3XXsn+GzG/0Q==",
 360 |       "cpu": [
 361 |         "arm64"
 362 |       ],
 363 |       "license": "Apache-2.0",
 364 |       "optional": true,
 365 |       "os": [
 366 |         "linux"
 367 |       ],
 368 |       "engines": {
 369 |         "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
 370 |       },
 371 |       "funding": {
 372 |         "url": "https://opencollective.com/libvips"
 373 |       },
 374 |       "optionalDependencies": {
 375 |         "@img/sharp-libvips-linux-arm64": "1.1.0"
 376 |       }
 377 |     },
 378 |     "node_modules/@img/sharp-linux-s390x": {
 379 |       "version": "0.34.2",
 380 |       "resolved": "https://registry.npmjs.org/@img/sharp-linux-s390x/-/sharp-linux-s390x-0.34.2.tgz",
 381 |       "integrity": "sha512-EGZ1xwhBI7dNISwxjChqBGELCWMGDvmxZXKjQRuqMrakhO8QoMgqCrdjnAqJq/CScxfRn+Bb7suXBElKQpPDiw==",
 382 |       "cpu": [
 383 |         "s390x"
 384 |       ],
 385 |       "license": "Apache-2.0",
 386 |       "optional": true,
 387 |       "os": [
 388 |         "linux"
 389 |       ],
 390 |       "engines": {
 391 |         "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
 392 |       },
 393 |       "funding": {
 394 |         "url": "https://opencollective.com/libvips"
 395 |       },
 396 |       "optionalDependencies": {
 397 |         "@img/sharp-libvips-linux-s390x": "1.1.0"
 398 |       }
 399 |     },
 400 |     "node_modules/@img/sharp-linux-x64": {
 401 |       "version": "0.34.2",
 402 |       "resolved": "https://registry.npmjs.org/@img/sharp-linux-x64/-/sharp-linux-x64-0.34.2.tgz",
 403 |       "integrity": "sha512-sD7J+h5nFLMMmOXYH4DD9UtSNBD05tWSSdWAcEyzqW8Cn5UxXvsHAxmxSesYUsTOBmUnjtxghKDl15EvfqLFbQ==",
 404 |       "cpu": [
 405 |         "x64"
 406 |       ],
 407 |       "license": "Apache-2.0",
 408 |       "optional": true,
 409 |       "os": [
 410 |         "linux"
 411 |       ],
 412 |       "engines": {
 413 |         "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
 414 |       },
 415 |       "funding": {
 416 |         "url": "https://opencollective.com/libvips"
 417 |       },
 418 |       "optionalDependencies": {
 419 |         "@img/sharp-libvips-linux-x64": "1.1.0"
 420 |       }
 421 |     },
 422 |     "node_modules/@img/sharp-linuxmusl-arm64": {
 423 |       "version": "0.34.2",
 424 |       "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-arm64/-/sharp-linuxmusl-arm64-0.34.2.tgz",
 425 |       "integrity": "sha512-NEE2vQ6wcxYav1/A22OOxoSOGiKnNmDzCYFOZ949xFmrWZOVII1Bp3NqVVpvj+3UeHMFyN5eP/V5hzViQ5CZNA==",
 426 |       "cpu": [
 427 |         "arm64"
 428 |       ],
 429 |       "license": "Apache-2.0",
 430 |       "optional": true,
 431 |       "os": [
 432 |         "linux"
 433 |       ],
 434 |       "engines": {
 435 |         "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
 436 |       },
 437 |       "funding": {
 438 |         "url": "https://opencollective.com/libvips"
 439 |       },
 440 |       "optionalDependencies": {
 441 |         "@img/sharp-libvips-linuxmusl-arm64": "1.1.0"
 442 |       }
 443 |     },
 444 |     "node_modules/@img/sharp-linuxmusl-x64": {
 445 |       "version": "0.34.2",
 446 |       "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-x64/-/sharp-linuxmusl-x64-0.34.2.tgz",
 447 |       "integrity": "sha512-DOYMrDm5E6/8bm/yQLCWyuDJwUnlevR8xtF8bs+gjZ7cyUNYXiSf/E8Kp0Ss5xasIaXSHzb888V1BE4i1hFhAA==",
 448 |       "cpu": [
 449 |         "x64"
 450 |       ],
 451 |       "license": "Apache-2.0",
 452 |       "optional": true,
 453 |       "os": [
 454 |         "linux"
 455 |       ],
 456 |       "engines": {
 457 |         "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
 458 |       },
 459 |       "funding": {
 460 |         "url": "https://opencollective.com/libvips"
 461 |       },
 462 |       "optionalDependencies": {
 463 |         "@img/sharp-libvips-linuxmusl-x64": "1.1.0"
 464 |       }
 465 |     },
 466 |     "node_modules/@img/sharp-wasm32": {
 467 |       "version": "0.34.2",
 468 |       "resolved": "https://registry.npmjs.org/@img/sharp-wasm32/-/sharp-wasm32-0.34.2.tgz",
 469 |       "integrity": "sha512-/VI4mdlJ9zkaq53MbIG6rZY+QRN3MLbR6usYlgITEzi4Rpx5S6LFKsycOQjkOGmqTNmkIdLjEvooFKwww6OpdQ==",
 470 |       "cpu": [
 471 |         "wasm32"
 472 |       ],
 473 |       "license": "Apache-2.0 AND LGPL-3.0-or-later AND MIT",
 474 |       "optional": true,
 475 |       "dependencies": {
 476 |         "@emnapi/runtime": "^1.4.3"
 477 |       },
 478 |       "engines": {
 479 |         "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
 480 |       },
 481 |       "funding": {
 482 |         "url": "https://opencollective.com/libvips"
 483 |       }
 484 |     },
 485 |     "node_modules/@img/sharp-win32-arm64": {
 486 |       "version": "0.34.2",
 487 |       "resolved": "https://registry.npmjs.org/@img/sharp-win32-arm64/-/sharp-win32-arm64-0.34.2.tgz",
 488 |       "integrity": "sha512-cfP/r9FdS63VA5k0xiqaNaEoGxBg9k7uE+RQGzuK9fHt7jib4zAVVseR9LsE4gJcNWgT6APKMNnCcnyOtmSEUQ==",
 489 |       "cpu": [
 490 |         "arm64"
 491 |       ],
 492 |       "license": "Apache-2.0 AND LGPL-3.0-or-later",
 493 |       "optional": true,
 494 |       "os": [
 495 |         "win32"
 496 |       ],
 497 |       "engines": {
 498 |         "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
 499 |       },
 500 |       "funding": {
 501 |         "url": "https://opencollective.com/libvips"
 502 |       }
 503 |     },
 504 |     "node_modules/@img/sharp-win32-ia32": {
 505 |       "version": "0.34.2",
 506 |       "resolved": "https://registry.npmjs.org/@img/sharp-win32-ia32/-/sharp-win32-ia32-0.34.2.tgz",
 507 |       "integrity": "sha512-QLjGGvAbj0X/FXl8n1WbtQ6iVBpWU7JO94u/P2M4a8CFYsvQi4GW2mRy/JqkRx0qpBzaOdKJKw8uc930EX2AHw==",
 508 |       "cpu": [
 509 |         "ia32"
 510 |       ],
 511 |       "license": "Apache-2.0 AND LGPL-3.0-or-later",
 512 |       "optional": true,
 513 |       "os": [
 514 |         "win32"
 515 |       ],
 516 |       "engines": {
 517 |         "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
 518 |       },
 519 |       "funding": {
 520 |         "url": "https://opencollective.com/libvips"
 521 |       }
 522 |     },
 523 |     "node_modules/@img/sharp-win32-x64": {
 524 |       "version": "0.34.2",
 525 |       "resolved": "https://registry.npmjs.org/@img/sharp-win32-x64/-/sharp-win32-x64-0.34.2.tgz",
 526 |       "integrity": "sha512-aUdT6zEYtDKCaxkofmmJDJYGCf0+pJg3eU9/oBuqvEeoB9dKI6ZLc/1iLJCTuJQDO4ptntAlkUmHgGjyuobZbw==",
 527 |       "cpu": [
 528 |         "x64"
 529 |       ],
 530 |       "license": "Apache-2.0 AND LGPL-3.0-or-later",
 531 |       "optional": true,
 532 |       "os": [
 533 |         "win32"
 534 |       ],
 535 |       "engines": {
 536 |         "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
 537 |       },
 538 |       "funding": {
 539 |         "url": "https://opencollective.com/libvips"
 540 |       }
 541 |     },
 542 |     "node_modules/@isaacs/fs-minipass": {
 543 |       "version": "4.0.1",
 544 |       "resolved": "https://registry.npmjs.org/@isaacs/fs-minipass/-/fs-minipass-4.0.1.tgz",
 545 |       "integrity": "sha512-wgm9Ehl2jpeqP3zw/7mo3kRHFp5MEDhqAdwy1fTGkHAwnkGOVsgpvQhL8B5n1qlb01jV3n/bI0ZfZp5lWA1k4w==",
 546 |       "dev": true,
 547 |       "license": "ISC",
 548 |       "dependencies": {
 549 |         "minipass": "^7.0.4"
 550 |       },
 551 |       "engines": {
 552 |         "node": ">=18.0.0"
 553 |       }
 554 |     },
 555 |     "node_modules/@jridgewell/gen-mapping": {
 556 |       "version": "0.3.8",
 557 |       "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.8.tgz",
 558 |       "integrity": "sha512-imAbBGkb+ebQyxKgzv5Hu2nmROxoDOXHh80evxdoXNOrvAnVx7zimzc1Oo5h9RlfV4vPXaE2iM5pOFbvOCClWA==",
 559 |       "dev": true,
 560 |       "license": "MIT",
 561 |       "dependencies": {
 562 |         "@jridgewell/set-array": "^1.2.1",
 563 |         "@jridgewell/sourcemap-codec": "^1.4.10",
 564 |         "@jridgewell/trace-mapping": "^0.3.24"
 565 |       },
 566 |       "engines": {
 567 |         "node": ">=6.0.0"
 568 |       }
 569 |     },
 570 |     "node_modules/@jridgewell/resolve-uri": {
 571 |       "version": "3.1.2",
 572 |       "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
 573 |       "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
 574 |       "dev": true,
 575 |       "license": "MIT",
 576 |       "engines": {
 577 |         "node": ">=6.0.0"
 578 |       }
 579 |     },
 580 |     "node_modules/@jridgewell/set-array": {
 581 |       "version": "1.2.1",
 582 |       "resolved": "https://registry.npmjs.org/@jridgewell/set-array/-/set-array-1.2.1.tgz",
 583 |       "integrity": "sha512-R8gLRTZeyp03ymzP/6Lil/28tGeGEzhx1q2k703KGWRAI1VdvPIXdG70VJc2pAMw3NA6JKL5hhFu1sJX0Mnn/A==",
 584 |       "dev": true,
 585 |       "license": "MIT",
 586 |       "engines": {
 587 |         "node": ">=6.0.0"
 588 |       }
 589 |     },
 590 |     "node_modules/@jridgewell/sourcemap-codec": {
 591 |       "version": "1.5.0",
 592 |       "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.0.tgz",
 593 |       "integrity": "sha512-gv3ZRaISU3fjPAgNsriBRqGWQL6quFx04YMPW/zD8XMLsU32mhCCbfbO6KZFLjvYpCZ8zyDEgqsgf+PwPaM7GQ==",
 594 |       "dev": true,
 595 |       "license": "MIT"
 596 |     },
 597 |     "node_modules/@jridgewell/trace-mapping": {
 598 |       "version": "0.3.25",
 599 |       "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.25.tgz",
 600 |       "integrity": "sha512-vNk6aEwybGtawWmy/PzwnGDOjCkLWSD2wqvjGGAgOAwCGWySYXfYoxt00IJkTF+8Lb57DwOb3Aa0o9CApepiYQ==",
 601 |       "dev": true,
 602 |       "license": "MIT",
 603 |       "dependencies": {
 604 |         "@jridgewell/resolve-uri": "^3.1.0",
 605 |         "@jridgewell/sourcemap-codec": "^1.4.14"
 606 |       }
 607 |     },
 608 |     "node_modules/@next/env": {
 609 |       "version": "15.3.2",
 610 |       "resolved": "https://registry.npmjs.org/@next/env/-/env-15.3.2.tgz",
 611 |       "integrity": "sha512-xURk++7P7qR9JG1jJtLzPzf0qEvqCN0A/T3DXf8IPMKo9/6FfjxtEffRJIIew/bIL4T3C2jLLqBor8B/zVlx6g==",
 612 |       "license": "MIT"
 613 |     },
 614 |     "node_modules/@next/swc-darwin-arm64": {
 615 |       "version": "15.3.2",
 616 |       "resolved": "https://registry.npmjs.org/@next/swc-darwin-arm64/-/swc-darwin-arm64-15.3.2.tgz",
 617 |       "integrity": "sha512-2DR6kY/OGcokbnCsjHpNeQblqCZ85/1j6njYSkzRdpLn5At7OkSdmk7WyAmB9G0k25+VgqVZ/u356OSoQZ3z0g==",
 618 |       "cpu": [
 619 |         "arm64"
 620 |       ],
 621 |       "license": "MIT",
 622 |       "optional": true,
 623 |       "os": [
 624 |         "darwin"
 625 |       ],
 626 |       "engines": {
 627 |         "node": ">= 10"
 628 |       }
 629 |     },
 630 |     "node_modules/@next/swc-darwin-x64": {
 631 |       "version": "15.3.2",
 632 |       "resolved": "https://registry.npmjs.org/@next/swc-darwin-x64/-/swc-darwin-x64-15.3.2.tgz",
 633 |       "integrity": "sha512-ro/fdqaZWL6k1S/5CLv1I0DaZfDVJkWNaUU3un8Lg6m0YENWlDulmIWzV96Iou2wEYyEsZq51mwV8+XQXqMp3w==",
 634 |       "cpu": [
 635 |         "x64"
 636 |       ],
 637 |       "license": "MIT",
 638 |       "optional": true,
 639 |       "os": [
 640 |         "darwin"
 641 |       ],
 642 |       "engines": {
 643 |         "node": ">= 10"
 644 |       }
 645 |     },
 646 |     "node_modules/@next/swc-linux-arm64-gnu": {
 647 |       "version": "15.3.2",
 648 |       "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-15.3.2.tgz",
 649 |       "integrity": "sha512-covwwtZYhlbRWK2HlYX9835qXum4xYZ3E2Mra1mdQ+0ICGoMiw1+nVAn4d9Bo7R3JqSmK1grMq/va+0cdh7bJA==",
 650 |       "cpu": [
 651 |         "arm64"
 652 |       ],
 653 |       "license": "MIT",
 654 |       "optional": true,
 655 |       "os": [
 656 |         "linux"
 657 |       ],
 658 |       "engines": {
 659 |         "node": ">= 10"
 660 |       }
 661 |     },
 662 |     "node_modules/@next/swc-linux-arm64-musl": {
 663 |       "version": "15.3.2",
 664 |       "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-15.3.2.tgz",
 665 |       "integrity": "sha512-KQkMEillvlW5Qk5mtGA/3Yz0/tzpNlSw6/3/ttsV1lNtMuOHcGii3zVeXZyi4EJmmLDKYcTcByV2wVsOhDt/zg==",
 666 |       "cpu": [
 667 |         "arm64"
 668 |       ],
 669 |       "license": "MIT",
 670 |       "optional": true,
 671 |       "os": [
 672 |         "linux"
 673 |       ],
 674 |       "engines": {
 675 |         "node": ">= 10"
 676 |       }
 677 |     },
 678 |     "node_modules/@next/swc-linux-x64-gnu": {
 679 |       "version": "15.3.2",
 680 |       "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-15.3.2.tgz",
 681 |       "integrity": "sha512-uRBo6THWei0chz+Y5j37qzx+BtoDRFIkDzZjlpCItBRXyMPIg079eIkOCl3aqr2tkxL4HFyJ4GHDes7W8HuAUg==",
 682 |       "cpu": [
 683 |         "x64"
 684 |       ],
 685 |       "license": "MIT",
 686 |       "optional": true,
 687 |       "os": [
 688 |         "linux"
 689 |       ],
 690 |       "engines": {
 691 |         "node": ">= 10"
 692 |       }
 693 |     },
 694 |     "node_modules/@next/swc-linux-x64-musl": {
 695 |       "version": "15.3.2",
 696 |       "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-15.3.2.tgz",
 697 |       "integrity": "sha512-+uxFlPuCNx/T9PdMClOqeE8USKzj8tVz37KflT3Kdbx/LOlZBRI2yxuIcmx1mPNK8DwSOMNCr4ureSet7eyC0w==",
 698 |       "cpu": [
 699 |         "x64"
 700 |       ],
 701 |       "license": "MIT",
 702 |       "optional": true,
 703 |       "os": [
 704 |         "linux"
 705 |       ],
 706 |       "engines": {
 707 |         "node": ">= 10"
 708 |       }
 709 |     },
 710 |     "node_modules/@next/swc-win32-arm64-msvc": {
 711 |       "version": "15.3.2",
 712 |       "resolved": "https://registry.npmjs.org/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-15.3.2.tgz",
 713 |       "integrity": "sha512-LLTKmaI5cfD8dVzh5Vt7+OMo+AIOClEdIU/TSKbXXT2iScUTSxOGoBhfuv+FU8R9MLmrkIL1e2fBMkEEjYAtPQ==",
 714 |       "cpu": [
 715 |         "arm64"
 716 |       ],
 717 |       "license": "MIT",
 718 |       "optional": true,
 719 |       "os": [
 720 |         "win32"
 721 |       ],
 722 |       "engines": {
 723 |         "node": ">= 10"
 724 |       }
 725 |     },
 726 |     "node_modules/@next/swc-win32-x64-msvc": {
 727 |       "version": "15.3.2",
 728 |       "resolved": "https://registry.npmjs.org/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-15.3.2.tgz",
 729 |       "integrity": "sha512-aW5B8wOPioJ4mBdMDXkt5f3j8pUr9W8AnlX0Df35uRWNT1Y6RIybxjnSUe+PhM+M1bwgyY8PHLmXZC6zT1o5tA==",
 730 |       "cpu": [
 731 |         "x64"
 732 |       ],
 733 |       "license": "MIT",
 734 |       "optional": true,
 735 |       "os": [
 736 |         "win32"
 737 |       ],
 738 |       "engines": {
 739 |         "node": ">= 10"
 740 |       }
 741 |     },
 742 |     "node_modules/@sentry-internal/browser-utils": {
 743 |       "version": "8.55.0",
 744 |       "resolved": "https://registry.npmjs.org/@sentry-internal/browser-utils/-/browser-utils-8.55.0.tgz",
 745 |       "integrity": "sha512-ROgqtQfpH/82AQIpESPqPQe0UyWywKJsmVIqi3c5Fh+zkds5LUxnssTj3yNd1x+kxaPDVB023jAP+3ibNgeNDw==",
 746 |       "license": "MIT",
 747 |       "dependencies": {
 748 |         "@sentry/core": "8.55.0"
 749 |       },
 750 |       "engines": {
 751 |         "node": ">=14.18"
 752 |       }
 753 |     },
 754 |     "node_modules/@sentry-internal/feedback": {
 755 |       "version": "8.55.0",
 756 |       "resolved": "https://registry.npmjs.org/@sentry-internal/feedback/-/feedback-8.55.0.tgz",
 757 |       "integrity": "sha512-cP3BD/Q6pquVQ+YL+rwCnorKuTXiS9KXW8HNKu4nmmBAyf7urjs+F6Hr1k9MXP5yQ8W3yK7jRWd09Yu6DHWOiw==",
 758 |       "license": "MIT",
 759 |       "dependencies": {
 760 |         "@sentry/core": "8.55.0"
 761 |       },
 762 |       "engines": {
 763 |         "node": ">=14.18"
 764 |       }
 765 |     },
 766 |     "node_modules/@sentry-internal/replay": {
 767 |       "version": "8.55.0",
 768 |       "resolved": "https://registry.npmjs.org/@sentry-internal/replay/-/replay-8.55.0.tgz",
 769 |       "integrity": "sha512-roCDEGkORwolxBn8xAKedybY+Jlefq3xYmgN2fr3BTnsXjSYOPC7D1/mYqINBat99nDtvgFvNfRcZPiwwZ1hSw==",
 770 |       "license": "MIT",
 771 |       "dependencies": {
 772 |         "@sentry-internal/browser-utils": "8.55.0",
 773 |         "@sentry/core": "8.55.0"
 774 |       },
 775 |       "engines": {
 776 |         "node": ">=14.18"
 777 |       }
 778 |     },
 779 |     "node_modules/@sentry-internal/replay-canvas": {
 780 |       "version": "8.55.0",
 781 |       "resolved": "https://registry.npmjs.org/@sentry-internal/replay-canvas/-/replay-canvas-8.55.0.tgz",
 782 |       "integrity": "sha512-nIkfgRWk1091zHdu4NbocQsxZF1rv1f7bbp3tTIlZYbrH62XVZosx5iHAuZG0Zc48AETLE7K4AX9VGjvQj8i9w==",
 783 |       "license": "MIT",
 784 |       "dependencies": {
 785 |         "@sentry-internal/replay": "8.55.0",
 786 |         "@sentry/core": "8.55.0"
 787 |       },
 788 |       "engines": {
 789 |         "node": ">=14.18"
 790 |       }
 791 |     },
 792 |     "node_modules/@sentry/browser": {
 793 |       "version": "8.55.0",
 794 |       "resolved": "https://registry.npmjs.org/@sentry/browser/-/browser-8.55.0.tgz",
 795 |       "integrity": "sha512-1A31mCEWCjaMxJt6qGUK+aDnLDcK6AwLAZnqpSchNysGni1pSn1RWSmk9TBF8qyTds5FH8B31H480uxMPUJ7Cw==",
 796 |       "license": "MIT",
 797 |       "dependencies": {
 798 |         "@sentry-internal/browser-utils": "8.55.0",
 799 |         "@sentry-internal/feedback": "8.55.0",
 800 |         "@sentry-internal/replay": "8.55.0",
 801 |         "@sentry-internal/replay-canvas": "8.55.0",
 802 |         "@sentry/core": "8.55.0"
 803 |       },
 804 |       "engines": {
 805 |         "node": ">=14.18"
 806 |       }
 807 |     },
 808 |     "node_modules/@sentry/core": {
 809 |       "version": "8.55.0",
 810 |       "resolved": "https://registry.npmjs.org/@sentry/core/-/core-8.55.0.tgz",
 811 |       "integrity": "sha512-6g7jpbefjHYs821Z+EBJ8r4Z7LT5h80YSWRJaylGS4nW5W5Z2KXzpdnyFarv37O7QjauzVC2E+PABmpkw5/JGA==",
 812 |       "license": "MIT",
 813 |       "engines": {
 814 |         "node": ">=14.18"
 815 |       }
 816 |     },
 817 |     "node_modules/@swc/counter": {
 818 |       "version": "0.1.3",
 819 |       "resolved": "https://registry.npmjs.org/@swc/counter/-/counter-0.1.3.tgz",
 820 |       "integrity": "sha512-e2BR4lsJkkRlKZ/qCHPw9ZaSxc0MVUd7gtbtaB7aMvHeJVYe8sOB8DBZkP2DtISHGSku9sCK6T6cnY0CtXrOCQ==",
 821 |       "license": "Apache-2.0"
 822 |     },
 823 |     "node_modules/@swc/helpers": {
 824 |       "version": "0.5.15",
 825 |       "resolved": "https://registry.npmjs.org/@swc/helpers/-/helpers-0.5.15.tgz",
 826 |       "integrity": "sha512-JQ5TuMi45Owi4/BIMAJBoSQoOJu12oOk/gADqlcUL9JEdHB8vyjUSsxqeNXnmXHjYKMi2WcYtezGEEhqUI/E2g==",
 827 |       "license": "Apache-2.0",
 828 |       "dependencies": {
 829 |         "tslib": "^2.8.0"
 830 |       }
 831 |     },
 832 |     "node_modules/@tailwindcss/node": {
 833 |       "version": "4.1.7",
 834 |       "resolved": "https://registry.npmjs.org/@tailwindcss/node/-/node-4.1.7.tgz",
 835 |       "integrity": "sha512-9rsOpdY9idRI2NH6CL4wORFY0+Q6fnx9XP9Ju+iq/0wJwGD5IByIgFmwVbyy4ymuyprj8Qh4ErxMKTUL4uNh3g==",
 836 |       "dev": true,
 837 |       "license": "MIT",
 838 |       "dependencies": {
 839 |         "@ampproject/remapping": "^2.3.0",
 840 |         "enhanced-resolve": "^5.18.1",
 841 |         "jiti": "^2.4.2",
 842 |         "lightningcss": "1.30.1",
 843 |         "magic-string": "^0.30.17",
 844 |         "source-map-js": "^1.2.1",
 845 |         "tailwindcss": "4.1.7"
 846 |       }
 847 |     },
 848 |     "node_modules/@tailwindcss/oxide": {
 849 |       "version": "4.1.7",
 850 |       "resolved": "https://registry.npmjs.org/@tailwindcss/oxide/-/oxide-4.1.7.tgz",
 851 |       "integrity": "sha512-5SF95Ctm9DFiUyjUPnDGkoKItPX/k+xifcQhcqX5RA85m50jw1pT/KzjdvlqxRja45Y52nR4MR9fD1JYd7f8NQ==",
 852 |       "dev": true,
 853 |       "hasInstallScript": true,
 854 |       "license": "MIT",
 855 |       "dependencies": {
 856 |         "detect-libc": "^2.0.4",
 857 |         "tar": "^7.4.3"
 858 |       },
 859 |       "engines": {
 860 |         "node": ">= 10"
 861 |       },
 862 |       "optionalDependencies": {
 863 |         "@tailwindcss/oxide-android-arm64": "4.1.7",
 864 |         "@tailwindcss/oxide-darwin-arm64": "4.1.7",
 865 |         "@tailwindcss/oxide-darwin-x64": "4.1.7",
 866 |         "@tailwindcss/oxide-freebsd-x64": "4.1.7",
 867 |         "@tailwindcss/oxide-linux-arm-gnueabihf": "4.1.7",
 868 |         "@tailwindcss/oxide-linux-arm64-gnu": "4.1.7",
 869 |         "@tailwindcss/oxide-linux-arm64-musl": "4.1.7",
 870 |         "@tailwindcss/oxide-linux-x64-gnu": "4.1.7",
 871 |         "@tailwindcss/oxide-linux-x64-musl": "4.1.7",
 872 |         "@tailwindcss/oxide-wasm32-wasi": "4.1.7",
 873 |         "@tailwindcss/oxide-win32-arm64-msvc": "4.1.7",
 874 |         "@tailwindcss/oxide-win32-x64-msvc": "4.1.7"
 875 |       }
 876 |     },
 877 |     "node_modules/@tailwindcss/oxide-android-arm64": {
 878 |       "version": "4.1.7",
 879 |       "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-android-arm64/-/oxide-android-arm64-4.1.7.tgz",
 880 |       "integrity": "sha512-IWA410JZ8fF7kACus6BrUwY2Z1t1hm0+ZWNEzykKmMNM09wQooOcN/VXr0p/WJdtHZ90PvJf2AIBS/Ceqx1emg==",
 881 |       "cpu": [
 882 |         "arm64"
 883 |       ],
 884 |       "dev": true,
 885 |       "license": "MIT",
 886 |       "optional": true,
 887 |       "os": [
 888 |         "android"
 889 |       ],
 890 |       "engines": {
 891 |         "node": ">= 10"
 892 |       }
 893 |     },
 894 |     "node_modules/@tailwindcss/oxide-darwin-arm64": {
 895 |       "version": "4.1.7",
 896 |       "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-darwin-arm64/-/oxide-darwin-arm64-4.1.7.tgz",
 897 |       "integrity": "sha512-81jUw9To7fimGGkuJ2W5h3/oGonTOZKZ8C2ghm/TTxbwvfSiFSDPd6/A/KE2N7Jp4mv3Ps9OFqg2fEKgZFfsvg==",
 898 |       "cpu": [
 899 |         "arm64"
 900 |       ],
 901 |       "dev": true,
 902 |       "license": "MIT",
 903 |       "optional": true,
 904 |       "os": [
 905 |         "darwin"
 906 |       ],
 907 |       "engines": {
 908 |         "node": ">= 10"
 909 |       }
 910 |     },
 911 |     "node_modules/@tailwindcss/oxide-darwin-x64": {
 912 |       "version": "4.1.7",
 913 |       "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-darwin-x64/-/oxide-darwin-x64-4.1.7.tgz",
 914 |       "integrity": "sha512-q77rWjEyGHV4PdDBtrzO0tgBBPlQWKY7wZK0cUok/HaGgbNKecegNxCGikuPJn5wFAlIywC3v+WMBt0PEBtwGw==",
 915 |       "cpu": [
 916 |         "x64"
 917 |       ],
 918 |       "dev": true,
 919 |       "license": "MIT",
 920 |       "optional": true,
 921 |       "os": [
 922 |         "darwin"
 923 |       ],
 924 |       "engines": {
 925 |         "node": ">= 10"
 926 |       }
 927 |     },
 928 |     "node_modules/@tailwindcss/oxide-freebsd-x64": {
 929 |       "version": "4.1.7",
 930 |       "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-freebsd-x64/-/oxide-freebsd-x64-4.1.7.tgz",
 931 |       "integrity": "sha512-RfmdbbK6G6ptgF4qqbzoxmH+PKfP4KSVs7SRlTwcbRgBwezJkAO3Qta/7gDy10Q2DcUVkKxFLXUQO6J3CRvBGw==",
 932 |       "cpu": [
 933 |         "x64"
 934 |       ],
 935 |       "dev": true,
 936 |       "license": "MIT",
 937 |       "optional": true,
 938 |       "os": [
 939 |         "freebsd"
 940 |       ],
 941 |       "engines": {
 942 |         "node": ">= 10"
 943 |       }
 944 |     },
 945 |     "node_modules/@tailwindcss/oxide-linux-arm-gnueabihf": {
 946 |       "version": "4.1.7",
 947 |       "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm-gnueabihf/-/oxide-linux-arm-gnueabihf-4.1.7.tgz",
 948 |       "integrity": "sha512-OZqsGvpwOa13lVd1z6JVwQXadEobmesxQ4AxhrwRiPuE04quvZHWn/LnihMg7/XkN+dTioXp/VMu/p6A5eZP3g==",
 949 |       "cpu": [
 950 |         "arm"
 951 |       ],
 952 |       "dev": true,
 953 |       "license": "MIT",
 954 |       "optional": true,
 955 |       "os": [
 956 |         "linux"
 957 |       ],
 958 |       "engines": {
 959 |         "node": ">= 10"
 960 |       }
 961 |     },
 962 |     "node_modules/@tailwindcss/oxide-linux-arm64-gnu": {
 963 |       "version": "4.1.7",
 964 |       "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm64-gnu/-/oxide-linux-arm64-gnu-4.1.7.tgz",
 965 |       "integrity": "sha512-voMvBTnJSfKecJxGkoeAyW/2XRToLZ227LxswLAwKY7YslG/Xkw9/tJNH+3IVh5bdYzYE7DfiaPbRkSHFxY1xA==",
 966 |       "cpu": [
 967 |         "arm64"
 968 |       ],
 969 |       "dev": true,
 970 |       "license": "MIT",
 971 |       "optional": true,
 972 |       "os": [
 973 |         "linux"
 974 |       ],
 975 |       "engines": {
 976 |         "node": ">= 10"
 977 |       }
 978 |     },
 979 |     "node_modules/@tailwindcss/oxide-linux-arm64-musl": {
 980 |       "version": "4.1.7",
 981 |       "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm64-musl/-/oxide-linux-arm64-musl-4.1.7.tgz",
 982 |       "integrity": "sha512-PjGuNNmJeKHnP58M7XyjJyla8LPo+RmwHQpBI+W/OxqrwojyuCQ+GUtygu7jUqTEexejZHr/z3nBc/gTiXBj4A==",
 983 |       "cpu": [
 984 |         "arm64"
 985 |       ],
 986 |       "dev": true,
 987 |       "license": "MIT",
 988 |       "optional": true,
 989 |       "os": [
 990 |         "linux"
 991 |       ],
 992 |       "engines": {
 993 |         "node": ">= 10"
 994 |       }
 995 |     },
 996 |     "node_modules/@tailwindcss/oxide-linux-x64-gnu": {
 997 |       "version": "4.1.7",
 998 |       "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-x64-gnu/-/oxide-linux-x64-gnu-4.1.7.tgz",
 999 |       "integrity": "sha512-HMs+Va+ZR3gC3mLZE00gXxtBo3JoSQxtu9lobbZd+DmfkIxR54NO7Z+UQNPsa0P/ITn1TevtFxXTpsRU7qEvWg==",
1000 |       "cpu": [
1001 |         "x64"
1002 |       ],
1003 |       "dev": true,
1004 |       "license": "MIT",
1005 |       "optional": true,
1006 |       "os": [
1007 |         "linux"
1008 |       ],
1009 |       "engines": {
1010 |         "node": ">= 10"
1011 |       }
1012 |     },
1013 |     "node_modules/@tailwindcss/oxide-linux-x64-musl": {
1014 |       "version": "4.1.7",
1015 |       "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-x64-musl/-/oxide-linux-x64-musl-4.1.7.tgz",
1016 |       "integrity": "sha512-MHZ6jyNlutdHH8rd+YTdr3QbXrHXqwIhHw9e7yXEBcQdluGwhpQY2Eku8UZK6ReLaWtQ4gijIv5QoM5eE+qlsA==",
1017 |       "cpu": [
1018 |         "x64"
1019 |       ],
1020 |       "dev": true,
1021 |       "license": "MIT",
1022 |       "optional": true,
1023 |       "os": [
1024 |         "linux"
1025 |       ],
1026 |       "engines": {
1027 |         "node": ">= 10"
1028 |       }
1029 |     },
1030 |     "node_modules/@tailwindcss/oxide-wasm32-wasi": {
1031 |       "version": "4.1.7",
1032 |       "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-wasm32-wasi/-/oxide-wasm32-wasi-4.1.7.tgz",
1033 |       "integrity": "sha512-ANaSKt74ZRzE2TvJmUcbFQ8zS201cIPxUDm5qez5rLEwWkie2SkGtA4P+GPTj+u8N6JbPrC8MtY8RmJA35Oo+A==",
1034 |       "bundleDependencies": [
1035 |         "@napi-rs/wasm-runtime",
1036 |         "@emnapi/core",
1037 |         "@emnapi/runtime",
1038 |         "@tybys/wasm-util",
1039 |         "@emnapi/wasi-threads",
1040 |         "tslib"
1041 |       ],
1042 |       "cpu": [
1043 |         "wasm32"
1044 |       ],
1045 |       "dev": true,
1046 |       "license": "MIT",
1047 |       "optional": true,
1048 |       "dependencies": {
1049 |         "@emnapi/core": "^1.4.3",
1050 |         "@emnapi/runtime": "^1.4.3",
1051 |         "@emnapi/wasi-threads": "^1.0.2",
1052 |         "@napi-rs/wasm-runtime": "^0.2.9",
1053 |         "@tybys/wasm-util": "^0.9.0",
1054 |         "tslib": "^2.8.0"
1055 |       },
1056 |       "engines": {
1057 |         "node": ">=14.0.0"
1058 |       }
1059 |     },
1060 |     "node_modules/@tailwindcss/oxide-win32-arm64-msvc": {
1061 |       "version": "4.1.7",
1062 |       "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-win32-arm64-msvc/-/oxide-win32-arm64-msvc-4.1.7.tgz",
1063 |       "integrity": "sha512-HUiSiXQ9gLJBAPCMVRk2RT1ZrBjto7WvqsPBwUrNK2BcdSxMnk19h4pjZjI7zgPhDxlAbJSumTC4ljeA9y0tEw==",
1064 |       "cpu": [
1065 |         "arm64"
1066 |       ],
1067 |       "dev": true,
1068 |       "license": "MIT",
1069 |       "optional": true,
1070 |       "os": [
1071 |         "win32"
1072 |       ],
1073 |       "engines": {
1074 |         "node": ">= 10"
1075 |       }
1076 |     },
1077 |     "node_modules/@tailwindcss/oxide-win32-x64-msvc": {
1078 |       "version": "4.1.7",
1079 |       "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-win32-x64-msvc/-/oxide-win32-x64-msvc-4.1.7.tgz",
1080 |       "integrity": "sha512-rYHGmvoHiLJ8hWucSfSOEmdCBIGZIq7SpkPRSqLsH2Ab2YUNgKeAPT1Fi2cx3+hnYOrAb0jp9cRyode3bBW4mQ==",
1081 |       "cpu": [
1082 |         "x64"
1083 |       ],
1084 |       "dev": true,
1085 |       "license": "MIT",
1086 |       "optional": true,
1087 |       "os": [
1088 |         "win32"
1089 |       ],
1090 |       "engines": {
1091 |         "node": ">= 10"
1092 |       }
1093 |     },
1094 |     "node_modules/@tailwindcss/postcss": {
1095 |       "version": "4.1.7",
1096 |       "resolved": "https://registry.npmjs.org/@tailwindcss/postcss/-/postcss-4.1.7.tgz",
1097 |       "integrity": "sha512-88g3qmNZn7jDgrrcp3ZXEQfp9CVox7xjP1HN2TFKI03CltPVd/c61ydn5qJJL8FYunn0OqBaW5HNUga0kmPVvw==",
1098 |       "dev": true,
1099 |       "license": "MIT",
1100 |       "dependencies": {
1101 |         "@alloc/quick-lru": "^5.2.0",
1102 |         "@tailwindcss/node": "4.1.7",
1103 |         "@tailwindcss/oxide": "4.1.7",
1104 |         "postcss": "^8.4.41",
1105 |         "tailwindcss": "4.1.7"
1106 |       }
1107 |     },
1108 |     "node_modules/@types/node": {
1109 |       "version": "20.17.51",
1110 |       "resolved": "https://registry.npmjs.org/@types/node/-/node-20.17.51.tgz",
1111 |       "integrity": "sha512-hccptBl7C8lHiKxTBsY6vYYmqpmw1E/aGR/8fmueE+B390L3pdMOpNSRvFO4ZnXzW5+p2HBXV0yNABd2vdk22Q==",
1112 |       "dev": true,
1113 |       "license": "MIT",
1114 |       "dependencies": {
1115 |         "undici-types": "~6.19.2"
1116 |       }
1117 |     },
1118 |     "node_modules/@types/react": {
1119 |       "version": "19.1.6",
1120 |       "resolved": "https://registry.npmjs.org/@types/react/-/react-19.1.6.tgz",
1121 |       "integrity": "sha512-JeG0rEWak0N6Itr6QUx+X60uQmN+5t3j9r/OVDtWzFXKaj6kD1BwJzOksD0FF6iWxZlbE1kB0q9vtnU2ekqa1Q==",
1122 |       "dev": true,
1123 |       "license": "MIT",
1124 |       "dependencies": {
1125 |         "csstype": "^3.0.2"
1126 |       }
1127 |     },
1128 |     "node_modules/@types/react-dom": {
1129 |       "version": "19.1.5",
1130 |       "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-19.1.5.tgz",
1131 |       "integrity": "sha512-CMCjrWucUBZvohgZxkjd6S9h0nZxXjzus6yDfUb+xLxYM7VvjKNH1tQrE9GWLql1XoOP4/Ds3bwFqShHUYraGg==",
1132 |       "dev": true,
1133 |       "license": "MIT",
1134 |       "peerDependencies": {
1135 |         "@types/react": "^19.0.0"
1136 |       }
1137 |     },
1138 |     "node_modules/@vapi-ai/web": {
1139 |       "version": "2.3.1",
1140 |       "resolved": "https://registry.npmjs.org/@vapi-ai/web/-/web-2.3.1.tgz",
1141 |       "integrity": "sha512-g/zI/IABO/TI6cSxGwZK3jQXQd8ZIYKdhJFV09dSZXAyXyisJwtNUEPIgWYo1O6V9bq/vjf+WA8FOCO6/zOKlQ==",
1142 |       "license": "MIT",
1143 |       "dependencies": {
1144 |         "@daily-co/daily-js": "^0.79.0",
1145 |         "events": "^3.3.0"
1146 |       }
1147 |     },
1148 |     "node_modules/bowser": {
1149 |       "version": "2.11.0",
1150 |       "resolved": "https://registry.npmjs.org/bowser/-/bowser-2.11.0.tgz",
1151 |       "integrity": "sha512-AlcaJBi/pqqJBIQ8U9Mcpc9i8Aqxn88Skv5d+xBX006BY5u8N3mGLHa5Lgppa7L/HfwgwLgZ6NYs+Ag6uUmJRA==",
1152 |       "license": "MIT"
1153 |     },
1154 |     "node_modules/busboy": {
1155 |       "version": "1.6.0",
1156 |       "resolved": "https://registry.npmjs.org/busboy/-/busboy-1.6.0.tgz",
1157 |       "integrity": "sha512-8SFQbg/0hQ9xy3UNTB0YEnsNBbWfhf7RtnzpL7TkBiTBRfrQ9Fxcnz7VJsleJpyp6rVLvXiuORqjlHi5q+PYuA==",
1158 |       "dependencies": {
1159 |         "streamsearch": "^1.1.0"
1160 |       },
1161 |       "engines": {
1162 |         "node": ">=10.16.0"
1163 |       }
1164 |     },
1165 |     "node_modules/caniuse-lite": {
1166 |       "version": "1.0.30001718",
1167 |       "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001718.tgz",
1168 |       "integrity": "sha512-AflseV1ahcSunK53NfEs9gFWgOEmzr0f+kaMFA4xiLZlr9Hzt7HxcSpIFcnNCUkz6R6dWKa54rUz3HUmI3nVcw==",
1169 |       "funding": [
1170 |         {
1171 |           "type": "opencollective",
1172 |           "url": "https://opencollective.com/browserslist"
1173 |         },
1174 |         {
1175 |           "type": "tidelift",
1176 |           "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
1177 |         },
1178 |         {
1179 |           "type": "github",
1180 |           "url": "https://github.com/sponsors/ai"
1181 |         }
1182 |       ],
1183 |       "license": "CC-BY-4.0"
1184 |     },
1185 |     "node_modules/chownr": {
1186 |       "version": "3.0.0",
1187 |       "resolved": "https://registry.npmjs.org/chownr/-/chownr-3.0.0.tgz",
1188 |       "integrity": "sha512-+IxzY9BZOQd/XuYPRmrvEVjF/nqj5kgT4kEq7VofrDoM1MxoRjEWkrCC3EtLi59TVawxTAn+orJwFQcrqEN1+g==",
1189 |       "dev": true,
1190 |       "license": "BlueOak-1.0.0",
1191 |       "engines": {
1192 |         "node": ">=18"
1193 |       }
1194 |     },
1195 |     "node_modules/client-only": {
1196 |       "version": "0.0.1",
1197 |       "resolved": "https://registry.npmjs.org/client-only/-/client-only-0.0.1.tgz",
1198 |       "integrity": "sha512-IV3Ou0jSMzZrd3pZ48nLkT9DA7Ag1pnPzaiQhpW7c3RbcqqzvzzVu+L8gfqMp/8IM2MQtSiqaCxrrcfu8I8rMA==",
1199 |       "license": "MIT"
1200 |     },
1201 |     "node_modules/color": {
1202 |       "version": "4.2.3",
1203 |       "resolved": "https://registry.npmjs.org/color/-/color-4.2.3.tgz",
1204 |       "integrity": "sha512-1rXeuUUiGGrykh+CeBdu5Ie7OJwinCgQY0bc7GCRxy5xVHy+moaqkpL/jqQq0MtQOeYcrqEz4abc5f0KtU7W4A==",
1205 |       "license": "MIT",
1206 |       "optional": true,
1207 |       "dependencies": {
1208 |         "color-convert": "^2.0.1",
1209 |         "color-string": "^1.9.0"
1210 |       },
1211 |       "engines": {
1212 |         "node": ">=12.5.0"
1213 |       }
1214 |     },
1215 |     "node_modules/color-convert": {
1216 |       "version": "2.0.1",
1217 |       "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
1218 |       "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
1219 |       "license": "MIT",
1220 |       "optional": true,
1221 |       "dependencies": {
1222 |         "color-name": "~1.1.4"
1223 |       },
1224 |       "engines": {
1225 |         "node": ">=7.0.0"
1226 |       }
1227 |     },
1228 |     "node_modules/color-name": {
1229 |       "version": "1.1.4",
1230 |       "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
1231 |       "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
1232 |       "license": "MIT",
1233 |       "optional": true
1234 |     },
1235 |     "node_modules/color-string": {
1236 |       "version": "1.9.1",
1237 |       "resolved": "https://registry.npmjs.org/color-string/-/color-string-1.9.1.tgz",
1238 |       "integrity": "sha512-shrVawQFojnZv6xM40anx4CkoDP+fZsw/ZerEMsW/pyzsRbElpsL/DBVW7q3ExxwusdNXI3lXpuhEZkzs8p5Eg==",
1239 |       "license": "MIT",
1240 |       "optional": true,
1241 |       "dependencies": {
1242 |         "color-name": "^1.0.0",
1243 |         "simple-swizzle": "^0.2.2"
1244 |       }
1245 |     },
1246 |     "node_modules/csstype": {
1247 |       "version": "3.1.3",
1248 |       "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.1.3.tgz",
1249 |       "integrity": "sha512-M1uQkMl8rQK/szD0LNhtqxIPLpimGm8sOBwU7lLnCpSbTyY3yeU1Vc7l4KT5zT4s/yOxHH5O7tIuuLOCnLADRw==",
1250 |       "dev": true,
1251 |       "license": "MIT"
1252 |     },
1253 |     "node_modules/dequal": {
1254 |       "version": "2.0.3",
1255 |       "resolved": "https://registry.npmjs.org/dequal/-/dequal-2.0.3.tgz",
1256 |       "integrity": "sha512-0je+qPKHEMohvfRTCEo3CrPG6cAzAYgmzKyxRiYSSDkS6eGJdyVJm7WaYA5ECaAD9wLB2T4EEeymA5aFVcYXCA==",
1257 |       "license": "MIT",
1258 |       "engines": {
1259 |         "node": ">=6"
1260 |       }
1261 |     },
1262 |     "node_modules/detect-libc": {
1263 |       "version": "2.0.4",
1264 |       "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.0.4.tgz",
1265 |       "integrity": "sha512-3UDv+G9CsCKO1WKMGw9fwq/SWJYbI0c5Y7LU1AXYoDdbhE2AHQ6N6Nb34sG8Fj7T5APy8qXDCKuuIHd1BR0tVA==",
1266 |       "devOptional": true,
1267 |       "license": "Apache-2.0",
1268 |       "engines": {
1269 |         "node": ">=8"
1270 |       }
1271 |     },
1272 |     "node_modules/enhanced-resolve": {
1273 |       "version": "5.18.1",
1274 |       "resolved": "https://registry.npmjs.org/enhanced-resolve/-/enhanced-resolve-5.18.1.tgz",
1275 |       "integrity": "sha512-ZSW3ma5GkcQBIpwZTSRAI8N71Uuwgs93IezB7mf7R60tC8ZbJideoDNKjHn2O9KIlx6rkGTTEk1xUCK2E1Y2Yg==",
1276 |       "dev": true,
1277 |       "license": "MIT",
1278 |       "dependencies": {
1279 |         "graceful-fs": "^4.2.4",
1280 |         "tapable": "^2.2.0"
1281 |       },
1282 |       "engines": {
1283 |         "node": ">=10.13.0"
1284 |       }
1285 |     },
1286 |     "node_modules/events": {
1287 |       "version": "3.3.0",
1288 |       "resolved": "https://registry.npmjs.org/events/-/events-3.3.0.tgz",
1289 |       "integrity": "sha512-mQw+2fkQbALzQ7V0MY0IqdnXNOeTtP4r0lN9z7AAawCXgqea7bDii20AYrIBrFd/Hx0M2Ocz6S111CaFkUcb0Q==",
1290 |       "license": "MIT",
1291 |       "engines": {
1292 |         "node": ">=0.8.x"
1293 |       }
1294 |     },
1295 |     "node_modules/graceful-fs": {
1296 |       "version": "4.2.11",
1297 |       "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz",
1298 |       "integrity": "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==",
1299 |       "dev": true,
1300 |       "license": "ISC"
1301 |     },
1302 |     "node_modules/is-arrayish": {
1303 |       "version": "0.3.2",
1304 |       "resolved": "https://registry.npmjs.org/is-arrayish/-/is-arrayish-0.3.2.tgz",
1305 |       "integrity": "sha512-eVRqCvVlZbuw3GrM63ovNSNAeA1K16kaR/LRY/92w0zxQ5/1YzwblUX652i4Xs9RwAGjW9d9y6X88t8OaAJfWQ==",
1306 |       "license": "MIT",
1307 |       "optional": true
1308 |     },
1309 |     "node_modules/jiti": {
1310 |       "version": "2.4.2",
1311 |       "resolved": "https://registry.npmjs.org/jiti/-/jiti-2.4.2.tgz",
1312 |       "integrity": "sha512-rg9zJN+G4n2nfJl5MW3BMygZX56zKPNVEYYqq7adpmMh4Jn2QNEwhvQlFy6jPVdcod7txZtKHWnyZiA3a0zP7A==",
1313 |       "dev": true,
1314 |       "license": "MIT",
1315 |       "bin": {
1316 |         "jiti": "lib/jiti-cli.mjs"
1317 |       }
1318 |     },
1319 |     "node_modules/js-tokens": {
1320 |       "version": "4.0.0",
1321 |       "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
1322 |       "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
1323 |       "license": "MIT"
1324 |     },
1325 |     "node_modules/lightningcss": {
1326 |       "version": "1.30.1",
1327 |       "resolved": "https://registry.npmjs.org/lightningcss/-/lightningcss-1.30.1.tgz",
1328 |       "integrity": "sha512-xi6IyHML+c9+Q3W0S4fCQJOym42pyurFiJUHEcEyHS0CeKzia4yZDEsLlqOFykxOdHpNy0NmvVO31vcSqAxJCg==",
1329 |       "dev": true,
1330 |       "license": "MPL-2.0",
1331 |       "dependencies": {
1332 |         "detect-libc": "^2.0.3"
1333 |       },
1334 |       "engines": {
1335 |         "node": ">= 12.0.0"
1336 |       },
1337 |       "funding": {
1338 |         "type": "opencollective",
1339 |         "url": "https://opencollective.com/parcel"
1340 |       },
1341 |       "optionalDependencies": {
1342 |         "lightningcss-darwin-arm64": "1.30.1",
1343 |         "lightningcss-darwin-x64": "1.30.1",
1344 |         "lightningcss-freebsd-x64": "1.30.1",
1345 |         "lightningcss-linux-arm-gnueabihf": "1.30.1",
1346 |         "lightningcss-linux-arm64-gnu": "1.30.1",
1347 |         "lightningcss-linux-arm64-musl": "1.30.1",
1348 |         "lightningcss-linux-x64-gnu": "1.30.1",
1349 |         "lightningcss-linux-x64-musl": "1.30.1",
1350 |         "lightningcss-win32-arm64-msvc": "1.30.1",
1351 |         "lightningcss-win32-x64-msvc": "1.30.1"
1352 |       }
1353 |     },
1354 |     "node_modules/lightningcss-darwin-arm64": {
1355 |       "version": "1.30.1",
1356 |       "resolved": "https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.30.1.tgz",
1357 |       "integrity": "sha512-c8JK7hyE65X1MHMN+Viq9n11RRC7hgin3HhYKhrMyaXflk5GVplZ60IxyoVtzILeKr+xAJwg6zK6sjTBJ0FKYQ==",
1358 |       "cpu": [
1359 |         "arm64"
1360 |       ],
1361 |       "dev": true,
1362 |       "license": "MPL-2.0",
1363 |       "optional": true,
1364 |       "os": [
1365 |         "darwin"
1366 |       ],
1367 |       "engines": {
1368 |         "node": ">= 12.0.0"
1369 |       },
1370 |       "funding": {
1371 |         "type": "opencollective",
1372 |         "url": "https://opencollective.com/parcel"
1373 |       }
1374 |     },
1375 |     "node_modules/lightningcss-darwin-x64": {
1376 |       "version": "1.30.1",
1377 |       "resolved": "https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.30.1.tgz",
1378 |       "integrity": "sha512-k1EvjakfumAQoTfcXUcHQZhSpLlkAuEkdMBsI/ivWw9hL+7FtilQc0Cy3hrx0AAQrVtQAbMI7YjCgYgvn37PzA==",
1379 |       "cpu": [
1380 |         "x64"
1381 |       ],
1382 |       "dev": true,
1383 |       "license": "MPL-2.0",
1384 |       "optional": true,
1385 |       "os": [
1386 |         "darwin"
1387 |       ],
1388 |       "engines": {
1389 |         "node": ">= 12.0.0"
1390 |       },
1391 |       "funding": {
1392 |         "type": "opencollective",
1393 |         "url": "https://opencollective.com/parcel"
1394 |       }
1395 |     },
1396 |     "node_modules/lightningcss-freebsd-x64": {
1397 |       "version": "1.30.1",
1398 |       "resolved": "https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.30.1.tgz",
1399 |       "integrity": "sha512-kmW6UGCGg2PcyUE59K5r0kWfKPAVy4SltVeut+umLCFoJ53RdCUWxcRDzO1eTaxf/7Q2H7LTquFHPL5R+Gjyig==",
1400 |       "cpu": [
1401 |         "x64"
1402 |       ],
1403 |       "dev": true,
1404 |       "license": "MPL-2.0",
1405 |       "optional": true,
1406 |       "os": [
1407 |         "freebsd"
1408 |       ],
1409 |       "engines": {
1410 |         "node": ">= 12.0.0"
1411 |       },
1412 |       "funding": {
1413 |         "type": "opencollective",
1414 |         "url": "https://opencollective.com/parcel"
1415 |       }
1416 |     },
1417 |     "node_modules/lightningcss-linux-arm-gnueabihf": {
1418 |       "version": "1.30.1",
1419 |       "resolved": "https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.30.1.tgz",
1420 |       "integrity": "sha512-MjxUShl1v8pit+6D/zSPq9S9dQ2NPFSQwGvxBCYaBYLPlCWuPh9/t1MRS8iUaR8i+a6w7aps+B4N0S1TYP/R+Q==",
1421 |       "cpu": [
1422 |         "arm"
1423 |       ],
1424 |       "dev": true,
1425 |       "license": "MPL-2.0",
1426 |       "optional": true,
1427 |       "os": [
1428 |         "linux"
1429 |       ],
1430 |       "engines": {
1431 |         "node": ">= 12.0.0"
1432 |       },
1433 |       "funding": {
1434 |         "type": "opencollective",
1435 |         "url": "https://opencollective.com/parcel"
1436 |       }
1437 |     },
1438 |     "node_modules/lightningcss-linux-arm64-gnu": {
1439 |       "version": "1.30.1",
1440 |       "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.30.1.tgz",
1441 |       "integrity": "sha512-gB72maP8rmrKsnKYy8XUuXi/4OctJiuQjcuqWNlJQ6jZiWqtPvqFziskH3hnajfvKB27ynbVCucKSm2rkQp4Bw==",
1442 |       "cpu": [
1443 |         "arm64"
1444 |       ],
1445 |       "dev": true,
1446 |       "license": "MPL-2.0",
1447 |       "optional": true,
1448 |       "os": [
1449 |         "linux"
1450 |       ],
1451 |       "engines": {
1452 |         "node": ">= 12.0.0"
1453 |       },
1454 |       "funding": {
1455 |         "type": "opencollective",
1456 |         "url": "https://opencollective.com/parcel"
1457 |       }
1458 |     },
1459 |     "node_modules/lightningcss-linux-arm64-musl": {
1460 |       "version": "1.30.1",
1461 |       "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.30.1.tgz",
1462 |       "integrity": "sha512-jmUQVx4331m6LIX+0wUhBbmMX7TCfjF5FoOH6SD1CttzuYlGNVpA7QnrmLxrsub43ClTINfGSYyHe2HWeLl5CQ==",
1463 |       "cpu": [
1464 |         "arm64"
1465 |       ],
1466 |       "dev": true,
1467 |       "license": "MPL-2.0",
1468 |       "optional": true,
1469 |       "os": [
1470 |         "linux"
1471 |       ],
1472 |       "engines": {
1473 |         "node": ">= 12.0.0"
1474 |       },
1475 |       "funding": {
1476 |         "type": "opencollective",
1477 |         "url": "https://opencollective.com/parcel"
1478 |       }
1479 |     },
1480 |     "node_modules/lightningcss-linux-x64-gnu": {
1481 |       "version": "1.30.1",
1482 |       "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.30.1.tgz",
1483 |       "integrity": "sha512-piWx3z4wN8J8z3+O5kO74+yr6ze/dKmPnI7vLqfSqI8bccaTGY5xiSGVIJBDd5K5BHlvVLpUB3S2YCfelyJ1bw==",
1484 |       "cpu": [
1485 |         "x64"
1486 |       ],
1487 |       "dev": true,
1488 |       "license": "MPL-2.0",
1489 |       "optional": true,
1490 |       "os": [
1491 |         "linux"
1492 |       ],
1493 |       "engines": {
1494 |         "node": ">= 12.0.0"
1495 |       },
1496 |       "funding": {
1497 |         "type": "opencollective",
1498 |         "url": "https://opencollective.com/parcel"
1499 |       }
1500 |     },
1501 |     "node_modules/lightningcss-linux-x64-musl": {
1502 |       "version": "1.30.1",
1503 |       "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.30.1.tgz",
1504 |       "integrity": "sha512-rRomAK7eIkL+tHY0YPxbc5Dra2gXlI63HL+v1Pdi1a3sC+tJTcFrHX+E86sulgAXeI7rSzDYhPSeHHjqFhqfeQ==",
1505 |       "cpu": [
1506 |         "x64"
1507 |       ],
1508 |       "dev": true,
1509 |       "license": "MPL-2.0",
1510 |       "optional": true,
1511 |       "os": [
1512 |         "linux"
1513 |       ],
1514 |       "engines": {
1515 |         "node": ">= 12.0.0"
1516 |       },
1517 |       "funding": {
1518 |         "type": "opencollective",
1519 |         "url": "https://opencollective.com/parcel"
1520 |       }
1521 |     },
1522 |     "node_modules/lightningcss-win32-arm64-msvc": {
1523 |       "version": "1.30.1",
1524 |       "resolved": "https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.30.1.tgz",
1525 |       "integrity": "sha512-mSL4rqPi4iXq5YVqzSsJgMVFENoa4nGTT/GjO2c0Yl9OuQfPsIfncvLrEW6RbbB24WtZ3xP/2CCmI3tNkNV4oA==",
1526 |       "cpu": [
1527 |         "arm64"
1528 |       ],
1529 |       "dev": true,
1530 |       "license": "MPL-2.0",
1531 |       "optional": true,
1532 |       "os": [
1533 |         "win32"
1534 |       ],
1535 |       "engines": {
1536 |         "node": ">= 12.0.0"
1537 |       },
1538 |       "funding": {
1539 |         "type": "opencollective",
1540 |         "url": "https://opencollective.com/parcel"
1541 |       }
1542 |     },
1543 |     "node_modules/lightningcss-win32-x64-msvc": {
1544 |       "version": "1.30.1",
1545 |       "resolved": "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.30.1.tgz",
1546 |       "integrity": "sha512-PVqXh48wh4T53F/1CCu8PIPCxLzWyCnn/9T5W1Jpmdy5h9Cwd+0YQS6/LwhHXSafuc61/xg9Lv5OrCby6a++jg==",
1547 |       "cpu": [
1548 |         "x64"
1549 |       ],
1550 |       "dev": true,
1551 |       "license": "MPL-2.0",
1552 |       "optional": true,
1553 |       "os": [
1554 |         "win32"
1555 |       ],
1556 |       "engines": {
1557 |         "node": ">= 12.0.0"
1558 |       },
1559 |       "funding": {
1560 |         "type": "opencollective",
1561 |         "url": "https://opencollective.com/parcel"
1562 |       }
1563 |     },
1564 |     "node_modules/loose-envify": {
1565 |       "version": "1.4.0",
1566 |       "resolved": "https://registry.npmjs.org/loose-envify/-/loose-envify-1.4.0.tgz",
1567 |       "integrity": "sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==",
1568 |       "license": "MIT",
1569 |       "dependencies": {
1570 |         "js-tokens": "^3.0.0 || ^4.0.0"
1571 |       },
1572 |       "bin": {
1573 |         "loose-envify": "cli.js"
1574 |       }
1575 |     },
1576 |     "node_modules/magic-string": {
1577 |       "version": "0.30.17",
1578 |       "resolved": "https://registry.npmjs.org/magic-string/-/magic-string-0.30.17.tgz",
1579 |       "integrity": "sha512-sNPKHvyjVf7gyjwS4xGTaW/mCnF8wnjtifKBEhxfZ7E/S8tQ0rssrwGNn6q8JH/ohItJfSQp9mBtQYuTlH5QnA==",
1580 |       "dev": true,
1581 |       "license": "MIT",
1582 |       "dependencies": {
1583 |         "@jridgewell/sourcemap-codec": "^1.5.0"
1584 |       }
1585 |     },
1586 |     "node_modules/minipass": {
1587 |       "version": "7.1.2",
1588 |       "resolved": "https://registry.npmjs.org/minipass/-/minipass-7.1.2.tgz",
1589 |       "integrity": "sha512-qOOzS1cBTWYF4BH8fVePDBOO9iptMnGUEZwNc/cMWnTV2nVLZ7VoNWEPHkYczZA0pdoA7dl6e7FL659nX9S2aw==",
1590 |       "dev": true,
1591 |       "license": "ISC",
1592 |       "engines": {
1593 |         "node": ">=16 || 14 >=14.17"
1594 |       }
1595 |     },
1596 |     "node_modules/minizlib": {
1597 |       "version": "3.0.2",
1598 |       "resolved": "https://registry.npmjs.org/minizlib/-/minizlib-3.0.2.tgz",
1599 |       "integrity": "sha512-oG62iEk+CYt5Xj2YqI5Xi9xWUeZhDI8jjQmC5oThVH5JGCTgIjr7ciJDzC7MBzYd//WvR1OTmP5Q38Q8ShQtVA==",
1600 |       "dev": true,
1601 |       "license": "MIT",
1602 |       "dependencies": {
1603 |         "minipass": "^7.1.2"
1604 |       },
1605 |       "engines": {
1606 |         "node": ">= 18"
1607 |       }
1608 |     },
1609 |     "node_modules/mkdirp": {
1610 |       "version": "3.0.1",
1611 |       "resolved": "https://registry.npmjs.org/mkdirp/-/mkdirp-3.0.1.tgz",
1612 |       "integrity": "sha512-+NsyUUAZDmo6YVHzL/stxSu3t9YS1iljliy3BSDrXJ/dkn1KYdmtZODGGjLcc9XLgVVpH4KshHB8XmZgMhaBXg==",
1613 |       "dev": true,
1614 |       "license": "MIT",
1615 |       "bin": {
1616 |         "mkdirp": "dist/cjs/src/bin.js"
1617 |       },
1618 |       "engines": {
1619 |         "node": ">=10"
1620 |       },
1621 |       "funding": {
1622 |         "url": "https://github.com/sponsors/isaacs"
1623 |       }
1624 |     },
1625 |     "node_modules/nanoid": {
1626 |       "version": "3.3.11",
1627 |       "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.11.tgz",
1628 |       "integrity": "sha512-N8SpfPUnUp1bK+PMYW8qSWdl9U+wwNWI4QKxOYDy9JAro3WMX7p2OeVRF9v+347pnakNevPmiHhNmZ2HbFA76w==",
1629 |       "funding": [
1630 |         {
1631 |           "type": "github",
1632 |           "url": "https://github.com/sponsors/ai"
1633 |         }
1634 |       ],
1635 |       "license": "MIT",
1636 |       "bin": {
1637 |         "nanoid": "bin/nanoid.cjs"
1638 |       },
1639 |       "engines": {
1640 |         "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
1641 |       }
1642 |     },
1643 |     "node_modules/next": {
1644 |       "version": "15.3.2",
1645 |       "resolved": "https://registry.npmjs.org/next/-/next-15.3.2.tgz",
1646 |       "integrity": "sha512-CA3BatMyHkxZ48sgOCLdVHjFU36N7TF1HhqAHLFOkV6buwZnvMI84Cug8xD56B9mCuKrqXnLn94417GrZ/jjCQ==",
1647 |       "license": "MIT",
1648 |       "dependencies": {
1649 |         "@next/env": "15.3.2",
1650 |         "@swc/counter": "0.1.3",
1651 |         "@swc/helpers": "0.5.15",
1652 |         "busboy": "1.6.0",
1653 |         "caniuse-lite": "^1.0.30001579",
1654 |         "postcss": "8.4.31",
1655 |         "styled-jsx": "5.1.6"
1656 |       },
1657 |       "bin": {
1658 |         "next": "dist/bin/next"
1659 |       },
1660 |       "engines": {
1661 |         "node": "^18.18.0 || ^19.8.0 || >= 20.0.0"
1662 |       },
1663 |       "optionalDependencies": {
1664 |         "@next/swc-darwin-arm64": "15.3.2",
1665 |         "@next/swc-darwin-x64": "15.3.2",
1666 |         "@next/swc-linux-arm64-gnu": "15.3.2",
1667 |         "@next/swc-linux-arm64-musl": "15.3.2",
1668 |         "@next/swc-linux-x64-gnu": "15.3.2",
1669 |         "@next/swc-linux-x64-musl": "15.3.2",
1670 |         "@next/swc-win32-arm64-msvc": "15.3.2",
1671 |         "@next/swc-win32-x64-msvc": "15.3.2",
1672 |         "sharp": "^0.34.1"
1673 |       },
1674 |       "peerDependencies": {
1675 |         "@opentelemetry/api": "^1.1.0",
1676 |         "@playwright/test": "^1.41.2",
1677 |         "babel-plugin-react-compiler": "*",
1678 |         "react": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
1679 |         "react-dom": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
1680 |         "sass": "^1.3.0"
1681 |       },
1682 |       "peerDependenciesMeta": {
1683 |         "@opentelemetry/api": {
1684 |           "optional": true
1685 |         },
1686 |         "@playwright/test": {
1687 |           "optional": true
1688 |         },
1689 |         "babel-plugin-react-compiler": {
1690 |           "optional": true
1691 |         },
1692 |         "sass": {
1693 |           "optional": true
1694 |         }
1695 |       }
1696 |     },
1697 |     "node_modules/next/node_modules/postcss": {
1698 |       "version": "8.4.31",
1699 |       "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.4.31.tgz",
1700 |       "integrity": "sha512-PS08Iboia9mts/2ygV3eLpY5ghnUcfLV/EXTOW1E2qYxJKGGBUtNjN76FYHnMs36RmARn41bC0AZmn+rR0OVpQ==",
1701 |       "funding": [
1702 |         {
1703 |           "type": "opencollective",
1704 |           "url": "https://opencollective.com/postcss/"
1705 |         },
1706 |         {
1707 |           "type": "tidelift",
1708 |           "url": "https://tidelift.com/funding/github/npm/postcss"
1709 |         },
1710 |         {
1711 |           "type": "github",
1712 |           "url": "https://github.com/sponsors/ai"
1713 |         }
1714 |       ],
1715 |       "license": "MIT",
1716 |       "dependencies": {
1717 |         "nanoid": "^3.3.6",
1718 |         "picocolors": "^1.0.0",
1719 |         "source-map-js": "^1.0.2"
1720 |       },
1721 |       "engines": {
1722 |         "node": "^10 || ^12 || >=14"
1723 |       }
1724 |     },
1725 |     "node_modules/object-assign": {
1726 |       "version": "4.1.1",
1727 |       "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
1728 |       "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
1729 |       "license": "MIT",
1730 |       "engines": {
1731 |         "node": ">=0.10.0"
1732 |       }
1733 |     },
1734 |     "node_modules/picocolors": {
1735 |       "version": "1.1.1",
1736 |       "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
1737 |       "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
1738 |       "license": "ISC"
1739 |     },
1740 |     "node_modules/postcss": {
1741 |       "version": "8.5.3",
1742 |       "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.3.tgz",
1743 |       "integrity": "sha512-dle9A3yYxlBSrt8Fu+IpjGT8SY8hN0mlaA6GY8t0P5PjIOZemULz/E2Bnm/2dcUOena75OTNkHI76uZBNUUq3A==",
1744 |       "dev": true,
1745 |       "funding": [
1746 |         {
1747 |           "type": "opencollective",
1748 |           "url": "https://opencollective.com/postcss/"
1749 |         },
1750 |         {
1751 |           "type": "tidelift",
1752 |           "url": "https://tidelift.com/funding/github/npm/postcss"
1753 |         },
1754 |         {
1755 |           "type": "github",
1756 |           "url": "https://github.com/sponsors/ai"
1757 |         }
1758 |       ],
1759 |       "license": "MIT",
1760 |       "dependencies": {
1761 |         "nanoid": "^3.3.8",
1762 |         "picocolors": "^1.1.1",
1763 |         "source-map-js": "^1.2.1"
1764 |       },
1765 |       "engines": {
1766 |         "node": "^10 || ^12 || >=14"
1767 |       }
1768 |     },
1769 |     "node_modules/prop-types": {
1770 |       "version": "15.8.1",
1771 |       "resolved": "https://registry.npmjs.org/prop-types/-/prop-types-15.8.1.tgz",
1772 |       "integrity": "sha512-oj87CgZICdulUohogVAR7AjlC0327U4el4L6eAvOqCeudMDVU0NThNaV+b9Df4dXgSP1gXMTnPdhfe/2qDH5cg==",
1773 |       "license": "MIT",
1774 |       "dependencies": {
1775 |         "loose-envify": "^1.4.0",
1776 |         "object-assign": "^4.1.1",
1777 |         "react-is": "^16.13.1"
1778 |       }
1779 |     },
1780 |     "node_modules/react": {
1781 |       "version": "19.1.0",
1782 |       "resolved": "https://registry.npmjs.org/react/-/react-19.1.0.tgz",
1783 |       "integrity": "sha512-FS+XFBNvn3GTAWq26joslQgWNoFu08F4kl0J4CgdNKADkdSGXQyTCnKteIAJy96Br6YbpEU1LSzV5dYtjMkMDg==",
1784 |       "license": "MIT",
1785 |       "engines": {
1786 |         "node": ">=0.10.0"
1787 |       }
1788 |     },
1789 |     "node_modules/react-dom": {
1790 |       "version": "19.1.0",
1791 |       "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-19.1.0.tgz",
1792 |       "integrity": "sha512-Xs1hdnE+DyKgeHJeJznQmYMIBG3TKIHJJT95Q58nHLSrElKlGQqDTR2HQ9fx5CN/Gk6Vh/kupBTDLU11/nDk/g==",
1793 |       "license": "MIT",
1794 |       "dependencies": {
1795 |         "scheduler": "^0.26.0"
1796 |       },
1797 |       "peerDependencies": {
1798 |         "react": "^19.1.0"
1799 |       }
1800 |     },
1801 |     "node_modules/react-is": {
1802 |       "version": "16.13.1",
1803 |       "resolved": "https://registry.npmjs.org/react-is/-/react-is-16.13.1.tgz",
1804 |       "integrity": "sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==",
1805 |       "license": "MIT"
1806 |     },
1807 |     "node_modules/scheduler": {
1808 |       "version": "0.26.0",
1809 |       "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.26.0.tgz",
1810 |       "integrity": "sha512-NlHwttCI/l5gCPR3D1nNXtWABUmBwvZpEQiD4IXSbIDq8BzLIK/7Ir5gTFSGZDUu37K5cMNp0hFtzO38sC7gWA==",
1811 |       "license": "MIT"
1812 |     },
1813 |     "node_modules/semver": {
1814 |       "version": "7.7.2",
1815 |       "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.2.tgz",
1816 |       "integrity": "sha512-RF0Fw+rO5AMf9MAyaRXI4AV0Ulj5lMHqVxxdSgiVbixSCXoEmmX/jk0CuJw4+3SqroYO9VoUh+HcuJivvtJemA==",
1817 |       "license": "ISC",
1818 |       "optional": true,
1819 |       "bin": {
1820 |         "semver": "bin/semver.js"
1821 |       },
1822 |       "engines": {
1823 |         "node": ">=10"
1824 |       }
1825 |     },
1826 |     "node_modules/sharp": {
1827 |       "version": "0.34.2",
1828 |       "resolved": "https://registry.npmjs.org/sharp/-/sharp-0.34.2.tgz",
1829 |       "integrity": "sha512-lszvBmB9QURERtyKT2bNmsgxXK0ShJrL/fvqlonCo7e6xBF8nT8xU6pW+PMIbLsz0RxQk3rgH9kd8UmvOzlMJg==",
1830 |       "hasInstallScript": true,
1831 |       "license": "Apache-2.0",
1832 |       "optional": true,
1833 |       "dependencies": {
1834 |         "color": "^4.2.3",
1835 |         "detect-libc": "^2.0.4",
1836 |         "semver": "^7.7.2"
1837 |       },
1838 |       "engines": {
1839 |         "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
1840 |       },
1841 |       "funding": {
1842 |         "url": "https://opencollective.com/libvips"
1843 |       },
1844 |       "optionalDependencies": {
1845 |         "@img/sharp-darwin-arm64": "0.34.2",
1846 |         "@img/sharp-darwin-x64": "0.34.2",
1847 |         "@img/sharp-libvips-darwin-arm64": "1.1.0",
1848 |         "@img/sharp-libvips-darwin-x64": "1.1.0",
1849 |         "@img/sharp-libvips-linux-arm": "1.1.0",
1850 |         "@img/sharp-libvips-linux-arm64": "1.1.0",
1851 |         "@img/sharp-libvips-linux-ppc64": "1.1.0",
1852 |         "@img/sharp-libvips-linux-s390x": "1.1.0",
1853 |         "@img/sharp-libvips-linux-x64": "1.1.0",
1854 |         "@img/sharp-libvips-linuxmusl-arm64": "1.1.0",
1855 |         "@img/sharp-libvips-linuxmusl-x64": "1.1.0",
1856 |         "@img/sharp-linux-arm": "0.34.2",
1857 |         "@img/sharp-linux-arm64": "0.34.2",
1858 |         "@img/sharp-linux-s390x": "0.34.2",
1859 |         "@img/sharp-linux-x64": "0.34.2",
1860 |         "@img/sharp-linuxmusl-arm64": "0.34.2",
1861 |         "@img/sharp-linuxmusl-x64": "0.34.2",
1862 |         "@img/sharp-wasm32": "0.34.2",
1863 |         "@img/sharp-win32-arm64": "0.34.2",
1864 |         "@img/sharp-win32-ia32": "0.34.2",
1865 |         "@img/sharp-win32-x64": "0.34.2"
1866 |       }
1867 |     },
1868 |     "node_modules/simple-swizzle": {
1869 |       "version": "0.2.2",
1870 |       "resolved": "https://registry.npmjs.org/simple-swizzle/-/simple-swizzle-0.2.2.tgz",
1871 |       "integrity": "sha512-JA//kQgZtbuY83m+xT+tXJkmJncGMTFT+C+g2h2R9uxkYIrE2yy9sgmcLhCnw57/WSD+Eh3J97FPEDFnbXnDUg==",
1872 |       "license": "MIT",
1873 |       "optional": true,
1874 |       "dependencies": {
1875 |         "is-arrayish": "^0.3.1"
1876 |       }
1877 |     },
1878 |     "node_modules/source-map-js": {
1879 |       "version": "1.2.1",
1880 |       "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
1881 |       "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
1882 |       "license": "BSD-3-Clause",
1883 |       "engines": {
1884 |         "node": ">=0.10.0"
1885 |       }
1886 |     },
1887 |     "node_modules/streamsearch": {
1888 |       "version": "1.1.0",
1889 |       "resolved": "https://registry.npmjs.org/streamsearch/-/streamsearch-1.1.0.tgz",
1890 |       "integrity": "sha512-Mcc5wHehp9aXz1ax6bZUyY5afg9u2rv5cqQI3mRrYkGC8rW2hM02jWuwjtL++LS5qinSyhj2QfLyNsuc+VsExg==",
1891 |       "engines": {
1892 |         "node": ">=10.0.0"
1893 |       }
1894 |     },
1895 |     "node_modules/styled-jsx": {
1896 |       "version": "5.1.6",
1897 |       "resolved": "https://registry.npmjs.org/styled-jsx/-/styled-jsx-5.1.6.tgz",
1898 |       "integrity": "sha512-qSVyDTeMotdvQYoHWLNGwRFJHC+i+ZvdBRYosOFgC+Wg1vx4frN2/RG/NA7SYqqvKNLf39P2LSRA2pu6n0XYZA==",
1899 |       "license": "MIT",
1900 |       "dependencies": {
1901 |         "client-only": "0.0.1"
1902 |       },
1903 |       "engines": {
1904 |         "node": ">= 12.0.0"
1905 |       },
1906 |       "peerDependencies": {
1907 |         "react": ">= 16.8.0 || 17.x.x || ^18.0.0-0 || ^19.0.0-0"
1908 |       },
1909 |       "peerDependenciesMeta": {
1910 |         "@babel/core": {
1911 |           "optional": true
1912 |         },
1913 |         "babel-plugin-macros": {
1914 |           "optional": true
1915 |         }
1916 |       }
1917 |     },
1918 |     "node_modules/tailwindcss": {
1919 |       "version": "4.1.7",
1920 |       "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-4.1.7.tgz",
1921 |       "integrity": "sha512-kr1o/ErIdNhTz8uzAYL7TpaUuzKIE6QPQ4qmSdxnoX/lo+5wmUHQA6h3L5yIqEImSRnAAURDirLu/BgiXGPAhg==",
1922 |       "dev": true,
1923 |       "license": "MIT"
1924 |     },
1925 |     "node_modules/tapable": {
1926 |       "version": "2.2.2",
1927 |       "resolved": "https://registry.npmjs.org/tapable/-/tapable-2.2.2.tgz",
1928 |       "integrity": "sha512-Re10+NauLTMCudc7T5WLFLAwDhQ0JWdrMK+9B2M8zR5hRExKmsRDCBA7/aV/pNJFltmBFO5BAMlQFi/vq3nKOg==",
1929 |       "dev": true,
1930 |       "license": "MIT",
1931 |       "engines": {
1932 |         "node": ">=6"
1933 |       }
1934 |     },
1935 |     "node_modules/tar": {
1936 |       "version": "7.4.3",
1937 |       "resolved": "https://registry.npmjs.org/tar/-/tar-7.4.3.tgz",
1938 |       "integrity": "sha512-5S7Va8hKfV7W5U6g3aYxXmlPoZVAwUMy9AOKyF2fVuZa2UD3qZjg578OrLRt8PcNN1PleVaL/5/yYATNL0ICUw==",
1939 |       "dev": true,
1940 |       "license": "ISC",
1941 |       "dependencies": {
1942 |         "@isaacs/fs-minipass": "^4.0.0",
1943 |         "chownr": "^3.0.0",
1944 |         "minipass": "^7.1.2",
1945 |         "minizlib": "^3.0.1",
1946 |         "mkdirp": "^3.0.1",
1947 |         "yallist": "^5.0.0"
1948 |       },
1949 |       "engines": {
1950 |         "node": ">=18"
1951 |       }
1952 |     },
1953 |     "node_modules/tslib": {
1954 |       "version": "2.8.1",
1955 |       "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
1956 |       "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
1957 |       "license": "0BSD"
1958 |     },
1959 |     "node_modules/typescript": {
1960 |       "version": "5.8.3",
1961 |       "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.8.3.tgz",
1962 |       "integrity": "sha512-p1diW6TqL9L07nNxvRMM7hMMw4c5XOo/1ibL4aAIGmSAt9slTE1Xgw5KWuof2uTOvCg9BY7ZRi+GaF+7sfgPeQ==",
1963 |       "dev": true,
1964 |       "license": "Apache-2.0",
1965 |       "bin": {
1966 |         "tsc": "bin/tsc",
1967 |         "tsserver": "bin/tsserver"
1968 |       },
1969 |       "engines": {
1970 |         "node": ">=14.17"
1971 |       }
1972 |     },
1973 |     "node_modules/undici-types": {
1974 |       "version": "6.19.8",
1975 |       "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.19.8.tgz",
1976 |       "integrity": "sha512-ve2KP6f/JnbPBFyobGHuerC9g1FYGn/F8n1LWTwNxCEzd6IfqTwUQcNXgEtmmQ6DlRrC1hrSrBnCZPokRrDHjw==",
1977 |       "dev": true,
1978 |       "license": "MIT"
1979 |     },
1980 |     "node_modules/yallist": {
1981 |       "version": "5.0.0",
1982 |       "resolved": "https://registry.npmjs.org/yallist/-/yallist-5.0.0.tgz",
1983 |       "integrity": "sha512-YgvUTfwqyc7UXVMrB+SImsVYSmTS8X/tSrtdNZMImM+n7+QTriRXyXim0mBrTXNeqzVF0KWGgHPeiyViFFrNDw==",
1984 |       "dev": true,
1985 |       "license": "BlueOak-1.0.0",
1986 |       "engines": {
1987 |         "node": ">=18"
1988 |       }
1989 |     }
1990 |   }
1991 | }
1992 | 


--------------------------------------------------------------------------------
/package.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "name": "opensource-openai-vision",
 3 |   "version": "0.1.0",
 4 |   "private": true,
 5 |   "scripts": {
 6 |     "dev": "next dev --turbopack",
 7 |     "build": "next build",
 8 |     "start": "next start",
 9 |     "lint": "next lint"
10 |   },
11 |   "dependencies": {
12 |     "@fortawesome/fontawesome-svg-core": "^6.7.2",
13 |     "@fortawesome/free-solid-svg-icons": "^6.7.2",
14 |     "@fortawesome/react-fontawesome": "^0.2.2",
15 |     "@google/generative-ai": "^0.24.1",
16 |     "@vapi-ai/web": "^2.3.0",
17 |     "next": "15.3.2",
18 |     "react": "^19.0.0",
19 |     "react-dom": "^19.0.0"
20 |   },
21 |   "devDependencies": {
22 |     "@tailwindcss/postcss": "^4",
23 |     "@types/node": "^20",
24 |     "@types/react": "^19",
25 |     "@types/react-dom": "^19",
26 |     "tailwindcss": "^4",
27 |     "typescript": "^5"
28 |   }
29 | }
30 | 


--------------------------------------------------------------------------------
/postcss.config.mjs:
--------------------------------------------------------------------------------
1 | const config = {
2 |   plugins: ["@tailwindcss/postcss"],
3 | };
4 | 
5 | export default config;
6 | 


--------------------------------------------------------------------------------
/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "compilerOptions": {
 3 |     "target": "ES2017",
 4 |     "lib": ["dom", "dom.iterable", "esnext"],
 5 |     "allowJs": true,
 6 |     "skipLibCheck": true,
 7 |     "strict": true,
 8 |     "noEmit": true,
 9 |     "esModuleInterop": true,
10 |     "module": "esnext",
11 |     "moduleResolution": "bundler",
12 |     "resolveJsonModule": true,
13 |     "isolatedModules": true,
14 |     "jsx": "preserve",
15 |     "incremental": true,
16 |     "plugins": [
17 |       {
18 |         "name": "next"
19 |       }
20 |     ],
21 |     "paths": {
22 |       "@/*": ["./*"]
23 |     }
24 |   },
25 |   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
26 |   "exclude": ["node_modules"]
27 | }
28 | 


--------------------------------------------------------------------------------
/vercel.json:
--------------------------------------------------------------------------------
  1 | {
  2 |   "version": 2,
  3 |   "name": "arlo-ai-system",
  4 |   "builds": [
  5 |     {
  6 |       "src": "package.json",
  7 |       "use": "@vercel/next"
  8 |     }
  9 |   ],
 10 |   "routes": [
 11 |     {
 12 |       "src": "/api/vision",
 13 |       "methods": ["POST"],
 14 |       "headers": {
 15 |         "Access-Control-Allow-Origin": "*",
 16 |         "Access-Control-Allow-Methods": "POST, OPTIONS",
 17 |         "Access-Control-Allow-Headers": "Content-Type, Authorization",
 18 |         "Access-Control-Max-Age": "86400"
 19 |       }
 20 |     },
 21 |     {
 22 |       "src": "/api/(.*)",
 23 |       "headers": {
 24 |         "Access-Control-Allow-Origin": "*",
 25 |         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
 26 |         "Access-Control-Allow-Headers": "Content-Type, Authorization",
 27 |         "Access-Control-Max-Age": "86400"
 28 |       }
 29 |     },
 30 |     {
 31 |       "src": "/(.*)",
 32 |       "dest": "/$1"
 33 |     }
 34 |   ],
 35 |   "functions": {
 36 |     "app/api/vision/route.ts": {
 37 |       "maxDuration": 30
 38 |     }
 39 |   },
 40 |   "env": {
 41 |     "NODE_ENV": "production"
 42 |   },
 43 |   "regions": ["iad1"],
 44 |   "headers": [
 45 |     {
 46 |       "source": "/(.*)",
 47 |       "headers": [
 48 |         {
 49 |           "key": "X-Content-Type-Options",
 50 |           "value": "nosniff"
 51 |         },
 52 |         {
 53 |           "key": "X-Frame-Options",
 54 |           "value": "DENY"
 55 |         },
 56 |         {
 57 |           "key": "X-XSS-Protection",
 58 |           "value": "1; mode=block"
 59 |         },
 60 |         {
 61 |           "key": "Referrer-Policy",
 62 |           "value": "strict-origin-when-cross-origin"
 63 |         },
 64 |         {
 65 |           "key": "Permissions-Policy",
 66 |           "value": "camera=(), microphone=(), geolocation=()"
 67 |         }
 68 |       ]
 69 |     },
 70 |     {
 71 |       "source": "/api/(.*)",
 72 |       "headers": [
 73 |         {
 74 |           "key": "Cache-Control",
 75 |           "value": "no-cache, no-store, must-revalidate"
 76 |         },
 77 |         {
 78 |           "key": "Pragma",
 79 |           "value": "no-cache"
 80 |         },
 81 |         {
 82 |           "key": "Expires",
 83 |           "value": "0"
 84 |         }
 85 |       ]
 86 |     }
 87 |   ],
 88 |   "rewrites": [
 89 |     {
 90 |       "source": "/voice-agent",
 91 |       "destination": "/voice-agent/page"
 92 |     },
 93 |     {
 94 |       "source": "/voice-agent-original",
 95 |       "destination": "/voice-agent-original/page"
 96 |     },
 97 |     {
 98 |       "source": "/booking-agent",
 99 |       "destination": "/booking-agent/page"
100 |     },
101 |     {
102 |       "source": "/interactive-agent",
103 |       "destination": "/interactive-agent/page"
104 |     }
105 |   ],
106 |   "redirects": [
107 |     {
108 |       "source": "/home",
109 |       "destination": "/",
110 |       "permanent": false
111 |     },
112 |     {
113 |       "source": "/index",
114 |       "destination": "/",
115 |       "permanent": false
116 |     }
117 |   ],
118 |   "cleanUrls": true,
119 |   "trailingSlash": false,
120 |   "github": {
121 |     "silent": true
122 |   },
123 |   "build": {
124 |     "env": {
125 |       "NEXT_TELEMETRY_DISABLED": "1"
126 |     }
127 |   }
128 | }
129 | 


--------------------------------------------------------------------------------
