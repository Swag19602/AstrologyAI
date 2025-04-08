"use strict";(()=>{var e={};e.id=273,e.ids=[273],e.modules={3480:(e,a,t)=>{e.exports=t(5600)},3498:(e,a,t)=>{t.a(e,async(e,n)=>{try{t.r(a),t.d(a,{default:()=>d});var r=t(9021),i=t.n(r),s=t(3873),o=t.n(s),l=t(3813),u=e([l]);let c=new(l=(u.then?(await u)():u)[0]).GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({model:"gemini-2.0-flash"});async function d(e,a){if("POST"!==e.method)return a.status(405).json({message:"Method not allowed"});let{userMessage:t,kundaliData:n}=e.body;console.log("Received request to generate Gemini response"),console.log("Request body:",e.body);let r=n.kundaliData.name;if(!t||!r)return console.error("Missing userMessage or kundaliData"),a.status(400).json({message:"Missing userMessage or name"});if(!process.env.GEMINI_API_KEY)return a.status(500).json({message:"Gemini API key not set"});try{let e=`${r.trim().replace(/\s+/g,"_")}_kundali.json`,s=o().join(process.cwd(),"public",e);console.log("File path:",s);let l="";l=i().existsSync(s)?i().readFileSync(s,"utf-8"):n?.kundaliData||"";let u=p(l,t),d=(await c.generateContent(u)).response.text();if(!d)return console.error("Gemini response is empty"),a.status(500).json({message:"Gemini response is empty"});return a.status(200).json({reply:d})}catch(e){return console.error("Gemini error:",e),a.status(500).json({message:"Internal server error"})}}let p=(e,a)=>`
You are a revered Vedic astrologer with decades of experience, deeply grounded in the principles of Jyotish Shastra, Nakshatra analysis, and Dasha interpretations. You combine spiritual wisdom with analytical precision.

Your goal is to provide insightful, personalized, and accurate astrological guidance based on the user's unique Kundali. Interpret planetary alignments, yogas, doshas, dashas, and house placements in context.

Respond in a tone that is empathetic, wise, and easy to understand — as if you’re guiding someone on a transformative life journey.

---

📜 **Kundali Data (JSON Format)**:
${e}

---

🧘‍♂️ **Guidelines for Interpretation**:
1. Analyze **planetary placements** in Rashi and Bhava.
2. Identify and explain relevant **Yogas**, **Doshas**, and **Raj Yogas**.
3. Decode the current **Mahadasha / Antardasha** and their psychological and material effects.
4. Provide actionable guidance rooted in **Vedic tradition** (career, marriage, health, spiritual growth).
5. Use simple language for clarity, but maintain spiritual depth.
6. Avoid repeating the input; focus on meaningful analysis and personalized insight.

---

🧠 **User's Question**:
${a}

---

🎯 **Your Role**: Provide a detailed, compassionate, and spiritually attuned response. Support your answers with logical astrological reasoning from the Kundali data.
`;n()}catch(e){n(e)}})},3813:e=>{e.exports=import("@google/generative-ai")},3873:e=>{e.exports=require("path")},4720:(e,a,t)=>{t.a(e,async(e,n)=>{try{t.r(a),t.d(a,{config:()=>d,default:()=>u,routeModule:()=>c});var r=t(3480),i=t(8667),s=t(6435),o=t(3498),l=e([o]);o=(l.then?(await l)():l)[0];let u=(0,s.M)(o,"default"),d=(0,s.M)(o,"config"),c=new r.PagesAPIRouteModule({definition:{kind:i.A.PAGES_API,page:"/api/chat",pathname:"/api/chat",bundlePath:"",filename:""},userland:o});n()}catch(e){n(e)}})},5600:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6435:(e,a)=>{Object.defineProperty(a,"M",{enumerable:!0,get:function(){return function e(a,t){return t in a?a[t]:"then"in a&&"function"==typeof a.then?a.then(a=>e(a,t)):"function"==typeof a&&"default"===t?a:void 0}}})},8667:(e,a)=>{Object.defineProperty(a,"A",{enumerable:!0,get:function(){return t}});var t=function(e){return e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE",e.IMAGE="IMAGE",e}({})},9021:e=>{e.exports=require("fs")}};var a=require("../../webpack-api-runtime.js");a.C(e);var t=a(a.s=4720);module.exports=t})();