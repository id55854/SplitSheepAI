# SheepAI Summer 2026 — "Let's Make Split Better"
## Comprehensive Problem Space & Idea Map

**Constraints recap:** 9 hours to build. 5 min demo + 3 min Q&A. Execution = 80%, presentation = 20%. Judges want: "does it work, would a citizen use this Monday morning, credible path to v1." Mixed audience (locals / tourists / SMBs), bilingual HR/EN, no live user validation time.

---

## How to Read This Document

For each problem space:
1. **What exists today** — concrete apps, services, data sources we'd be competing with or building on.
2. **Where it breaks** — the real gaps a citizen actually feels.
3. **Idea menu** — 3–5 concrete product concepts, each with target user, PMF thesis, monetization angle, and a 9-hour build feasibility rating (★ = doable demo, ★★ = strong demo, ★★★ = shippable v1 in a day).

The very last section ranks the top 5–7 across all spaces.

---

## 1. Mobility & Public Space

### What exists
- **Promet Split** has a real-time GPS bus tracker with live vehicle positions, arrival ETAs, ticket purchase, eWallet, monthly passes. Solid bones, but App Store/Tripadvisor reviews flag: app freezes, QR scanner failure, ticket-validation confusion (each individual ticket must be validated separately), aggressive inspectors fining tourists who didn't understand. Bus reliability itself is mixed; holiday schedules cause confusion.
- **Split Parking app** (Profico) covers Zone I–IV, sensor-based occupancy on some streets, card payments via PayDo. Award-winning Smart City pilot but coverage isn't city-wide and tourists still default to SMS.
- **Nextbike Croatia ("Sjedni i Vozi")** — bike share with ~40+ stations in Split metro, classic + e-bikes, 0.66€/30min. Functional, but station/dock data and route planning is generic.
- **Smart City Split** (Grad Split + Hrvatski Telekom, launched 2023, last update Sep 2024, 10k+ downloads) — bill paying, city news, contact city. Mediocre adoption.

### Where it breaks
- Tourists get burned on tickets (validation confusion → fines). Locals know the trick. No "first-time rider" mode anywhere.
- Multi-modal trip planning (bus + Nextbike + walk + ferry) is absent — Google Maps does some of this poorly because Promet GTFS feed quality varies.
- Riva crowding in July/August is a known phenomenon but there's zero crowd-density signal — visitors and locals just walk into the wall.
- Bike lanes "exist in theory" — no usable map of which lanes are safe vs. painted-over-parking vs. closed for construction.
- Ferry queue at Jadrolinija = 1–3 hours waiting in your car. No queue ETA.
- Airport bus 37 → city is a meme of confusion for first-timers.

### Idea menu

**M1. "First-Time Rider Split" — tourist-safe Promet companion (★★★)**
A bilingual mini-app that wraps Promet's existing API. Show me which bus, where to validate, *step-by-step* what the inspector will check, screenshot of my valid ticket, walk-from-airport flow. Auto-detects you just landed at SPU. *User:* tourists arriving SPU, first 48h in city. *PMF:* reviews of Promet are full of "I got fined and I had a ticket" — the pain is real and recurring. *Monetization:* white-label license to Promet/TZ Split; affiliate to taxis/transfers as fallback; sponsored "first stop" recommendations. *Demo killer move:* show side-by-side: Promet's confusing flow vs. your 3-tap flow.

**M2. "Riva Heatmap" — real-time crowd density on Riva, Marjan, beaches (★★)**
Multiple inputs: scrape webcam feeds (Riva, Bačvice — public livestreams exist), Google Places "popular times," Promet stop boarding density, Nextbike station depletion as proxies. Output: "Right now Riva is 9/10 crowded — try Matejuška instead." *User:* locals who hate the July crush + tourists optimizing visits. *PMF:* enormous — beach/promenade timing is the single biggest QoL question May–September. *Monetization:* TZ Split contract (overtourism is officially their KPI); B2B for cafés/restaurants ("come now, line is short"); ads from neighborhood alternatives. *Risk:* webcam scraping legal/TOS issues — but Croatia ranks first in EU water quality data openness, so public sources are findable.

**M3. "Split Multimodal" — Citymapper for Split (★★)**
Combine Promet GTFS + Nextbike API + Jadrolinija schedules + walking. Tell me "Žnjan → KBC Firule, 22 min: 5 min walk + bus 17 + 4 min walk" with real ETAs and ticket cost. *User:* commuters (students from Žnjan, nurses at KBC). *PMF:* Google Maps is unreliable here; locals use word-of-mouth. *Monetization:* freemium, B2B for HR teams of Split employers (KBC, AD Plastik). *Risk:* GTFS data quality.

**M4. "Bike Lane Reality" — crowdsourced bike infrastructure map (★)**
Mapillary-style — riders report broken/blocked/missing lanes, you generate a real ride-safety map. Lower demo wow but extremely defensible because the city has no such map. *Monetization:* sell aggregated data to Grad Split planning department.

**M5. "Jadrolinija Queue ETA" (★★)**
Use airport-runway-style queue prediction: count cars in line via the existing port webcam, predict your boarding probability ("Get in line by 13:40 for the 15:00 to Supetar"). *User:* islanders, weekenders, summer cottage owners — a small but high-pain group. *Monetization:* premium "guaranteed boarding" alert subscription.

---

## 2. Tourism vs. Residents

### What exists
- **Croatia's nationwide STR (short-term rental) register** launches June 2026 — every rental gets a unique number, mandatory for Airbnb/Booking listings. Split itself has a **moratorium on new STR registrations inside the UNESCO Diocletian's Palace buffer zone** since 2023 (extended through 2026).
- **VisitSplit / TZ Split** — generic visitor info, events calendar, "where to go" listicles. Not interactive.
- **Beach review/guide sites** (BeachAtlas, Split Curated) — static editorial, no live signal.
- **Google Places "popular times"** — patchy, lags reality.

### Where it breaks
- Locals have no way to surface the legitimacy of an STR next door (legal vs. illegal) — a register is coming but no consumer app surfaces it.
- Tourists have no way to know *now* whether Bačvice is empty or jammed, whether the Riva is bearable, whether Marjan is closed for fire risk.
- The narrative tension is real: locals resent overtourism, tourists feel unwelcome in August — neither side has tools.
- No "where do locals actually go right now" signal — TripAdvisor noise dominates.

### Idea menu

**T1. "Is My Airbnb Legal?" — STR transparency tool (★★★)**
Paste an Airbnb/Booking URL or address. Cross-check against Croatia's new STR register (launches June 2026 — perfect timing) + Split's Old Town moratorium zone. Output: "This listing is in the UNESCO buffer, new registrations frozen — verify the host's category number" or "✅ Registered, OPGy123." *User:* journalists, neighbors, tourists who care, Grad Split inspectors. *PMF:* timely — register launches just as the hackathon happens. *Monetization:* B2G (Grad Split / Ministry of Tourism contract for enforcement tooling); B2B to property managers needing to compliance-check competitors. *Demo killer move:* live-paste a real Split listing and show the data.

**T2. "Split Locals Mode" — anti-TripAdvisor (★★)**
A curated, locals-first recommendation app. Every place rated by: ratio of local-to-tourist patrons (we infer from Instagram check-in language, Google review demographics, time-of-day patterns), price relative to median, "is this a fake konoba." *User:* both — locals discover new spots without tourist crush; tourists who actively want to avoid feeling like a tourist. *PMF:* TripAdvisor has lost trust; "where do locals go" is the #1 query in every travel Reddit. *Monetization:* freemium, sponsored placements from konobas verified by locals (not pay-to-rank), data licensing to Grad Split for tourism policy.

**T3. "Beach Worth Going" — real-time beach signal (★★★)**
Combines: live webcam crowd count (Bačvice, Žnjan, Kasjuni have public cams), sea temp + wind from DHMZ, wave forecast, parking availability (Split Parking API), sea bathing water quality (open Croatian gov data, sampled biweekly May–Oct). Output: "Bačvice — 8/10 crowded, water 24°C, no algae, parking 70% full, sea quality EXCELLENT (sampled May 12)." *User:* literally everyone in Split May–October. *PMF:* universal. *Monetization:* freemium with premium "alert me when Kasjuni drops below 4/10," B2B for beach clubs ("Trigger 10% off when crowd <5"), city sponsorship.

**T4. "Resident Defense Dashboard" — neighborhood STR pressure map (★★)**
Plot every Airbnb in Split with density per building, percent of building converted to STR, average per-night rate vs. neighborhood median rent. Surface the streets where locals are most being pushed out. *User:* neighborhood associations, journalists, Grad Split. *Monetization:* civic-tech grants, B2G research subscriptions, public good launch for press attention.

**T5. "Diocletian Decoder" — AR-light cultural context (★)**
Point your phone at any wall in Old Town, get a 30-second story about it in your language. Less original (similar apps exist) but very demo-able. Hard to monetize beyond ticket bundling.

---

## 3. Public Services & Bureaucracy

### What exists
- **e-Građani** national portal (gov.hr) — 117 services, ~2M users, vouched by 81% in 2025 Eurobarometer.
- **mGrađani mobile app** (launched Sept 2025) — currently 20 of the 117 services.
- **"Životne situacije"** sub-portal launched Sept 2025 — groups services by life event (buy property, register child for kindergarten, deal with death) with an AI chatbot.
- **Grad Split's own portal at eusluge.split.hr** — local building permits, taxes, certificates.
- **e-Obrt** — register a sole proprietorship online.
- **ePorezna** — tax filing.

### Where it breaks
- The new gov AI chatbot is brand new — quality unproven, probably not deeply trained on Split-specific procedures (specific clerks, specific forms, who at which window).
- "Information in someone's head" — the part the official portal can never capture. Which OPG officer is friendly. Which day the porezna queue is shortest. Which form has the trick checkbox that voids it.
- Foreigners drowning in mixed HR/EN content with security-level barriers.
- Konoba owner / small business: VAT thresholds, monthly contributions, e-invoicing (mandatory 2026 under Fiscalization 2.0) are a labyrinth.

### Idea menu

**B1. "Bureaucracy Concierge" — AI agent for Croatian procedures (★★★)**
Trained on every PDF, FAQ, expat-in-Croatia article, and gov.hr page about Croatian bureaucracy + Grad Split specifics. User types "I want to open an obrt as a tour guide" in any language → step-by-step in their language, list of forms, fees, where to go physically, links to the right e-Građani service, prep checklist. *User:* every new resident, returning diaspora (Diaspora Friendship Games July 2026 is timely), every expat, every small business owner. *PMF:* enormous and underserved despite the new gov chatbot — that one is bound by gov constraints (no humor, no shortcuts, no "skip this if you're under €40k VAT"). Yours can be honest. *Monetization:* B2C subscription for nomads/expats (€5/mo), B2B for accountants/lawyers as "tier-1 client support," B2G as a Grad Split partnership. *Demo killer move:* ask the official gov chatbot a hard question, watch it fail, ask yours, watch it nail it.

**B2. "Porezna Whisperer" — tax-form copilot for freelancers (★★)**
Croatian freelancers and obrt owners file monthly. Common mistakes: missing JOPPD deadlines, wrong NKD codes, e-invoice XML format (Fiscalization 2.0 mandate). An agent that takes your PayPal/Stripe/Wise statements + invoices → produces filled forms ready to submit on ePorezna. *Monetization:* freemium, €15/mo. Long-term: become "Doola for Croatia."

**B3. "Vrtić Triage" — kindergarten enrollment tracker (★★)**
Demand exceeds supply in Split. Parents have no transparency on where their kid is on each waitlist. Build a scraper + parent-side dashboard ("3rd on Manuš, 11th on Lokve, 22nd on Žnjan") plus prediction of likely placement. *User:* every parent in Split with a 0–6yo. *PMF:* extremely sticky annual ritual. *Monetization:* freemium, B2G dashboard for Grad Split's vrtić office.

**B4. "Document Dating App" — match citizens with the right office (★)**
Photograph any document/form you don't understand → AI tells you what it is, who issued it, what you have to do with it, where, by when. Pensioner-friendly UI. Less original but underserved demo.

**B5. "Permit Path" — building permits for Split renovators (★★)**
Old Town renovations are a regulatory minefield (UNESCO, conservation, fire code). Turn the maze into a guided flow. *Monetization:* B2B for architects/contractors, lead-gen to certified pros.

---

## 4. Health & Aging

### What exists
- **e-Recept** — electronic prescription, fully functional, automatic at any HZZO doctor → pharmacy.
- **Portal zdravlja** — patient portal inside e-Građani, shows prescriptions and lab results.
- **KBC Split e-naručivanje** via CEZIH — appointment scheduling, theoretically reduces queues.
- **HZJZ Counseling Center** — free mental health, up to 10 sessions, no referral. Most people don't know it exists.
- **Private therapy in Split** — growing, mostly Croatian-only, hard to discover, no transparent waiting lists.
- **Mental health dispensaries** — first ones under Croatia's mental health reform are in Split and Zagreb.

### Where it breaks
- Pensioners can't use any of the digital tools. Adult children become unpaid IT support.
- e-naručivanje exists but specialist wait times at Firule (months for cardio, derma) are opaque — you don't know if waiting privately is worth it.
- Mental health: HZJZ free service is one of Croatia's best-kept secrets. Discovery is the bottleneck.
- Foreigners + nomads → no clue how the system works (you need an OIB, HZZO card, registered GP).

### Idea menu

**H1. "Wait Where" — specialist wait-time comparison Firule vs. private (★★★)**
Scrape and crowdsource current wait times for top 20 specialties at KBC Firule, Križine, and the major private clinics (Medicor, Sveta Katarina branch). Output: "Cardiology — KBC Firule 87 days, Medicor Split 9 days, €120." *User:* every chronic patient + every parent + every elderly person's adult child. *PMF:* this question is asked daily in every Croatian Facebook group. *Monetization:* lead-gen to private clinics (huge willingness to pay for qualified leads), insurance comparison affiliate, B2B for HR benefits teams. *Risk:* data acquisition is gnarly — but even partial coverage demos well.

**H2. "Baka Mode" — pensioner-friendly e-Građani wrapper (★★)**
A giant-font, voice-first, single-task-at-a-time wrapper over e-Građani and e-Recept. "Show me my prescriptions" → one screen, big text, "pick up at Ljekarna na Plokitama." Bilingual HR/EN for foreign retirees. *User:* 800k+ Croatians over 65 + adult children setting up parents. *PMF:* huge underserved segment, no competition. *Monetization:* freemium consumer; bulk license to social services / care homes; sponsored pharmacy delivery.

**H3. "Find Help Split" — mental health discovery (★★)**
Curated index of every mental health resource in Split: free HZJZ counseling, sliding-scale private, language support, specific issue (postpartum, addiction, grief). One question wizard → matched provider with current waitlist. *User:* anyone in distress + GPs who want a referral cheat sheet. *PMF:* nobody's done this for Split. *Monetization:* B2G grant funding (Ministry of Health mental health reform), B2B referral aggregator. Strong "story" angle for the demo.

**H4. "Nurse Shift Switch" — peer scheduling for KBC staff (★)**
Closed app for KBC Split nurses to swap shifts without going through admin chain. *User:* niche but devoted. *Monetization:* B2B per-hospital license. Hard for demo because no public users.

**H5. "Prescription Refill Reminder + Pharmacy Live Stock" (★★)**
e-Recept + nearest pharmacy live stock check. Pharmacies have stock APIs through the gov system. Useful for chronics and nomads who don't know which pharmacy carries what.

---

## 5. Environment & Coast

### What exists
- **Sea bathing water quality** — official mapped database, 162 sampling locations in Split-Dalmatia County, sampled biweekly May–Oct, free open data on Ministry of Economy/Sustainable Development site. Almost no one knows it's there.
- **DHMZ** — weather, sea, fire warnings (yellow/orange/red).
- **Air quality** — Split is on AQICN/IQAir/WAQI with PM2.5/PM10/NO2/SO2/O3. PurpleAir hardware is buyable. Generally Split's AQI is "Good" — not a daily anxiety like Skopje.
- **Marjan park** — IPNAS fire-monitoring system, watchtower at Sedlo (rebuilt under EU Marjan 2020 project), but citizen interface = ~zero.
- **Waste recycling** — Razvrstaj MojZG covers Zagreb only. Split's "Čistoća" has no comparable app.

### Where it breaks
- Sea quality data is *excellent* and *open* but completely invisible to the average swimmer.
- Marjan: tons of monitoring, no public "is Marjan safe to hike today?" signal.
- Recycling: Croatia has a waste reform mandate, Zagreb has an app, Split doesn't. Citizens don't know what bin, what day.
- No accessible "do I let my kid swim here today?" answer.

### Idea menu

**E1. "Splash Score" — beach-by-beach swim-safety score (★★★)**
Mashup of: latest official sea quality sample (open data), live sea temp, wind/wave, jellyfish reports (crowdsource), air quality. One number per beach updated daily. *User:* everyone with a kid + every health-conscious local + every nomad. *PMF:* "Croatia has the cleanest sea in Europe" is the brand — surfacing it well is a national-pride product. *Monetization:* TZ Split / TZ Splitsko-Dalmatinska sponsorship (their KPI is repeat tourism), freemium app with premium "alert when my favorite beach turns excellent." Strong combination with T3 (Beach Worth Going).

**E2. "Split Reciklira" — recycling answer engine (★★)**
Photo of any item → which bin, which day at your address, where the recycling islands are. Bilingual. Localized to Split's Čistoća pickup schedule. *User:* every household, every tourist who can't read the Croatian bin labels. *PMF:* universal, daily. *Monetization:* B2G contract with Čistoća; sponsored placement from refill stores / second-hand. *Demo:* upload a photo of a Plodine cracker box, watch it route correctly.

**E3. "Marjan Today" — citizen-facing park status (★★)**
Fire risk index (DHMZ orange/red), trails currently safe, water fountains working, sunset time at viewpoints, current crowd density at major lookouts. *User:* runners, hikers, dog walkers, tourists. *Monetization:* TZ Split, partnership with Marjan Park Service, premium guided routes.

**E4. "Microplastic Watch" — citizen science Adriatic monitoring (★)**
Crowdsourced plastic-debris reporting on beaches → heatmap → "this beach gets X kg/week of debris." Science-y, donation-grant-friendly, less demo-snappy.

**E5. "Air Aware Split" — neighborhood air-quality alerts (★)**
Probably the weakest play because Split's AQ is genuinely fine most of the time — alarm fatigue. Maybe pivot to *cruise ship emissions* in port, which is a real and underreported story.

---

## 6. Community & Local Economy

### What exists
- **VisitSplit events calendar** + Grad Split kalendar — editorial, not interactive.
- **Eventbrite Split, Allevents, Bandsintown, Songkick** — only catch the ticketed/festival stuff.
- **Facebook groups** — where neighborhood events actually live, but unsearchable.
- **Croatian Diaspora Friendship Games** July 16–20, 2026 in Split and Brač — first edition. Government push to engage diaspora.
- **Expat in Croatia** — content site, no real tools.
- **Njuškalo / OLX** — generic marketplaces, nothing neighborhood-scoped.

### Where it breaks
- Real Split community life happens on Facebook, WhatsApp, and physical bulletin boards. No tech aggregator.
- Konobas have no shared digital muscle vs. chain restaurants.
- Diaspora wants to engage but the only channel is "visit Croatia, eat ćevapi" — nothing year-round.
- Neighborhood-level event discovery is a dead zone.

### Idea menu

**C1. "Što Se Dogada" — neighborhood event ticker (★★★)**
AI scrapes Facebook events, Instagram stories, Grad Split kalendar, klapa society pages, konoba postings → one timeline. Filter by neighborhood (Žnjan, Manuš, Veli Varoš, Lovret), by free/paid, by family/adult, by language. *User:* locals, expats, students, nomads. *PMF:* nobody owns this layer; Facebook events are dying. *Monetization:* freemium, "boost your event" for organizers (€5–20), B2B for konobas/clubs, TZ Split partnership. *Demo:* show 4–5 real events happening tonight in different neighborhoods. *9-hour feasibility:* high — scraping + LLM categorization is exactly what AI is good at.

**C2. "Diaspora Bridge" — match Croatian diaspora with home-village activities (★★)**
Especially given Friendship Games July 2026 — perfect timing. Map every Croatian diaspora person's village/town of origin to current events/people/needs there. "Your great-grandfather's village in Imotski needs hands for the grape harvest in October." *User:* US/AU/Canada/Argentina Croats (millions). *PMF:* "I Choose Croatia" tax incentive program needs an attention layer. *Monetization:* B2G via Croats Abroad office, sponsored heritage tourism. *Risk:* identity verification is tricky.

**C3. "Konoba Co-op" — group buying & shared logistics for SMBs (★★)**
Three konobas in Veli Varoš pool their fish orders → better wholesale prices, shared delivery. Or shared waste pickup, shared accountant, shared Instagram management. Marketplace + workflow. *User:* 100+ konobas/cafés in Split, similar problem in every Dalmatian town. *PMF:* high — survival pressure is real. *Monetization:* transaction fee on group purchases, B2B SaaS.

**C4. "Split Local Coin" — neighborhood-loyalty cashback (★)**
Spend €10 at a konoba in Veli Varoš → get 5% back at any other Veli Varoš business. Hard to launch from scratch but a great pitch.

**C5. "Volunteer Split" — match retirees and nomads with civic projects (★)**
Marjan cleanup, klapa rehearsal, language exchange. *Monetization:* CSR sponsorship.

---

## 7. Safety & Emergencies

### What exists
- **DHMZ color warnings** (green/yellow/orange/red) — official but generic, mostly aimed at sailors.
- **112 emergency line** + 193 firefighters.
- **Croatian civil protection siren** system + nationwide mobile alert (EU CB-alert, mandated, deployed).
- **HGSS** Mountain Rescue.
- **Windy.com / PredictWind / Bora.gekom.hr** — sailor-grade tools.
- **EU EFFIS** — fire info.

### Where it breaks
- The official siren means *something different* depending on context (fire, flood, dam, chemical) but the average tourist doesn't know.
- Bura warnings are deeply technical — average pensioner won't open Windy.
- Trumbićeva obala flash floods (July 2025 incident) — no neighborhood-scoped alerting beyond national broadcast.
- The official CB-alert is good for life-safety but useless for "should I close my café shutters in 30 min." Operational alerts don't exist for normal civilians.

### Idea menu

**S1. "Sirena Translator" — what is this siren and what do I do? (★★)**
Push notification triggered by the official EU CB-alert in your area. Translates the warning into your language, with images: "Wildfire 4km north of Žnjan. Do not drive toward Stobreč. Close windows. Move pets indoors. Refresh in 15 min." Optional Bluetooth siren detector triggers the same flow even offline. *User:* tourists primarily, plus elderly and foreigners. *PMF:* compounds every wildfire/flood season, every summer. *Monetization:* TZ Split + Civil Protection contract; freemium; airline/hotel pre-load. *Demo angle:* incredible visual storytelling — Croatian sirens are eerie and the demo writes itself.

**S2. "Bura Briefing" — practical wind alerts (★★)**
Personalized to your activity: "Bura tomorrow 06:00, gusts 90 km/h. Your morning ferry to Supetar — cancelled. Your kid's school commute — fine. Your patio umbrellas — secure." Cross-references Jadrolinija, school district, your saved interests. *User:* parents, sailors, café owners, Airbnb hosts. *Monetization:* freemium, B2B for café/restaurant patio liability.

**S3. "Wildfire Watch Split" — Marjan & hinterland (★★)**
Combines EFFIS satellite hotspots, DHMZ fire-risk index, Marjan IPNAS public data, citizen-reported smoke (photo upload → image classifier confirms or de-dups), historic fire scars. Output: "Marjan: HIGH risk today. Yesterday's Jesenice fire 12km east — contained." *User:* hikers, hill-village residents (Klis, Solin), Marjan visitors. *Monetization:* B2G civil protection, insurance partnerships.

**S4. "Trumbićeva Live" — flash-flood radar for the coast (★★)**
DHMZ rainfall radar + the city's drain capacity model (some of this is in Smart City Split data) + storm-surge model = "Trumbićeva will flood at 17:30 if rain continues." *User:* shop/café owners on the obala, parking-on-low-ground drivers. *Monetization:* B2B insurance, café/shop alert subscription.

**S5. "Tourist Safety One-Pager" — sea-urchin, jellyfish, kamenice, sirena (★)**
Static-ish but useful: a card for every "WTF is this" tourist moment (sea urchin spike, jellyfish sting, sudden meltemi, what 911 is). Less innovative.

---

## 8. New Problem Spaces (Not on the Official List)

### N1. **School & education logistics**
- Parents tracking school bus pickup (no real-time anywhere).
- High school grade portal "e-Dnevnik" is functional but parent-side UX is terrible.
- Tutor / vannastavni activity discovery for kids.
- **Best idea:** "Split Roditelj" — unified parent app combining e-Dnevnik notifications, vrtić waitlist tracker (B3), neighborhood pediatrician availability, school bus tracker, kid-friendly events.

### N2. **Cruise ship pulse / port chaos**
- Split port hosts dozens of cruise calls a week in season. Every call dumps 2000–5000 people on Riva in a 2-hour window.
- **Best idea:** "Cruise Calendar Split" — public-facing dashboard of which ships dock when, what neighborhoods will be flooded, where to redirect. B2B for restaurants and shops to staff up. B2C for locals to avoid.

### N3. **Language & integration for digital nomads**
- 18-month digital nomad visa exists, Split is the #1 coastal hub.
- **Best idea:** "Croatian for Nomads" — AI tutor specialized in Split-Dalmatian dialect and survival phrases. Or "Nomad Concierge Split" — bundled OIB-getting, lease-finding, GP-registering. Monetization is obvious (€50–100/mo subscriptions). High build feasibility.

### N4. **Last-mile delivery / logistics for the islands**
- Brač, Hvar, Šolta — getting normal stuff (a part, a prescription, a document) to/from islands is a nightmare.
- **Best idea:** "Otok Express" — peer-to-peer courier matching ferry passengers willing to carry a package. Marketplace play, regulatory risk.

### N5. **Klapa & cultural preservation**
- Klapa singing is UNESCO intangible heritage. Aging singers, fading repertoire.
- **Best idea:** AI-powered klapa archive + match-making for new singers. Demo-friendly, story-rich. Low monetization.

### N6. **Emergency dental / urgent care navigation**
- Sunday night with a tooth abscess in Split = panic.
- **Best idea:** Hyper-local urgent care directory with real opening hours and bilingual contact. Lead-gen play.

### N7. **Pet emergencies & lost pets**
- Active community on Facebook ("Izgubljeni psi Split"). No tool.
- **Best idea:** AI photo-match for found/lost pets across Facebook groups, vet clinics, shelter. Sticky niche.

### N8. **Public toilets, water fountains, shaded benches**
- A real urban-fabric layer missing from Google Maps. Pensioners and parents care intensely.
- **Best idea:** "Split Pit-Stop" — crowdsourced + verified map. Boring but extremely useful, charm-of-the-mundane judge appeal.

### N9. **The "Riva Replacement" — where to actually hang out**
- Locals' answer to overtourism. Curated "evening spots that aren't on TripAdvisor."
- Overlaps with T2 but could be its own product for residents only.

### N10. **Trades & repairs (majstor)**
- Finding a reliable plumber/electrician in Split is word-of-mouth-only.
- **Best idea:** Verified majstor marketplace with neighbor reviews. Classic vertical marketplace, proven monetization model (TaskRabbit-for-Split).

---

## 9. Top-Ranked Ideas: 9-Hour Hackathon Filter

Scoring against the rubric:
- **Real pain** (would someone use it Monday morning?)
- **Demo-able** (can the jury *see* it work in 5 min?)
- **Data accessible** (no gov contract needed by Sunday)
- **PMF & monetization** (credible path to v1)
- **AI angle** (this is *SheepAI* — agentic build feasibility matters)

### Tier 1 — Strongest contenders (build these)

**🥇 Bureaucracy Concierge (B1)**
Why: Universal pain, AI-shaped from the ground up, demoable side-by-side against the new gov chatbot. Bilingual HR/EN is a *feature* not overhead. Real path to v1 (€5/mo nomad SaaS, Grad Split contract). Story: "Croatia just launched a gov chatbot — we built one that actually helps." Build: scrape gov.hr + expat-in-croatia + Grad Split + LLM agent + bilingual chat UI.

**🥈 Splash Score / Beach Worth Going (E1 + T3 combined)**
Why: Best use of free public data (sea quality is genuinely excellent and totally invisible). Universal user. Visual demo (heatmap, beach cards). Five months/year of usage. TZ Split is an obvious paying customer. Build: scrape gov.hr open data + DHMZ + webcam frame analysis + simple scoring + map UI.

**🥉 Što Se Događa / Neighborhood Events (C1)**
Why: Empty market, AI scraping + LLM categorization is exactly the right tool, every neighborhood is sticky, freemium → B2B is obvious. Demo: open the app on Saturday at the hackathon, show 4 real events tonight in 4 neighborhoods that *aren't on visitsplit.com*. Build: FB/IG scrapers + LLM categorizer + map + filters.

### Tier 2 — Strong demos but harder

**Sirena Translator (S1)** — best presentation potential (eerie siren + multilingual flash card = unforgettable). Risk: rare-event product, hard to *demonstrate* live unless you fake an alert.

**Is My Airbnb Legal? (T1)** — perfectly timed (STR register launches one month after the hackathon). Limited daily use case but strong story.

**Wait Where (H1)** — high pain, data acquisition is the bottleneck for 9 hours.

### Tier 3 — Excellent v1 candidates, hard for 9h

Split Multimodal (M3), Konoba Co-op (C3), Vrtić Triage (B3), Pension/Baka Mode (H2), Nomad Concierge (N3).

---

## 10. Recommended Direction & Storytelling

For a SheepAI build with mixed audience + 80% execution weight:

**Pick one of: B1, E1, or C1.**

All three have:
- Demo on a single screen.
- AI agent at the core (this is *Sheep**AI***).
- Data that exists today, no permission needed.
- Bilingual default.
- A "this matters to Split" narrative that lands in 30 seconds.
- A credible v1 path with a paying customer (Grad Split, TZ Split, or a B2C subscription).

**If you want to swing for the fences — combine B1 + a vertical.** "Bureaucracy Concierge for Konoba Owners" is a sharper wedge than a general assistant — judges will see the path to revenue.

**If you want the most photogenic demo** — E1. A map of Split with live beach scores, drag a date slider, pick favorites. Visual storytelling wins presentation rounds.

**If you want maximum local credibility** — C1. Walk into the demo with "here's 7 real events tonight nobody knows about" and the room is yours.

---

## 11. Decision Questions

Before locking in, three checks worth running tomorrow morning:
1. **Spend 30 min on each top-3 idea's data source.** Confirm the scrapers/APIs work *before* you commit to a build path. Beach webcams especially — check ToS, check whether HLS streams are accessible.
2. **Pick a hero user.** Not "everyone in Split" — *one* persona for the demo. The 28-year-old freelancer registering an obrt. The mom planning Bačvice for Saturday. The Žnjan resident discovering klapa rehearsal at 19:00.
3. **Write the 5-minute pitch first.** If you can't see the slides + demo arc Saturday morning, the build will sprawl.
