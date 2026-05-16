# Split Heritage Games Platform — Concept Brief

A dual-track concept brief: hackathon pitch on one side, civic proposal to the City of Split on the other. The product is the same; the framing changes by audience.

Companion file: `game-catalog.md` — the full Dalmatian game catalog with heritage status, rules, and digitization notes.

## 1. The one-sentence pitch

A central platform where Splićani, the diaspora, and visitors learn, play online, and meet in person around Split's traditional games — taught by AI agents that speak English, standard Croatian, or splitska čakavština, with city-wide leaderboards that make heritage competitive again.

## 2. Why this is the right idea right now

Three independent forces are converging in Split, and a platform that sits at their intersection is far more defensible than a generic "card games app."

**Force 1 — The City of Split is actively pivoting away from party tourism.** Mayor Šuta's current strategic line, repeatedly stated in the press through 2025–2026, is to move Split's tourism identity *away* from 24-hour nightlife and *toward* cultural and historical experiences, citing Barcelona and Prague as models. A heritage-game platform is a literal embodiment of that pivot — it gives tourists something to *do* that is unmistakably Split and that crowds them into Riva, Bačvice, and konobas rather than the strip clubs.

**Force 2 — Split-Dalmatia County is already running the analog version of this idea.** The Split-Dalmatia County Tourist Board, in partnership with the Faculty of Kinesiology in Split, is running the *Povratak igri* ("Return to Play") program in May 2026 across six towns (Split, Hvar, Makarska, Bol, Marina, Imotski) — bringing školice, lastiš, klikeri, pljočkanje and more back to public squares. There is *no digital layer* on this program. Yours is the obvious one.

**Force 3 — Split čakavski is officially endangered and officially protected.** Splitska čakavština is on Croatia's national intangible cultural heritage register (Z-5902, since 2013), and the *Čakavski Sabor* has been campaigning for years to get the dialect into Split primary school curricula. An AI tutor that speaks čakavski is not a quirky novelty — it's the single most scalable language-preservation tool anyone has proposed for the city.

The hackathon-judge version of this section: "the three groups that should be running this don't have a product yet; we build it before they do."

## 3. The product, deepened

The original idea (registration, leaderboards, online play, AI tutor, in-person meetups) is the right skeleton. Below are the layers that make it specifically Split and specifically defensible.

### 3.1 Heritage AI agents as personas, not modes

Don't ship "language toggle: English / Croatian / Čakavski." Ship *characters* — each with backstory, voice, and a strong opinion about how to play.

- **Dida Frane iz Velog Varoša** — čakavski-speaking grandfather. Teaches briškula like your dida did. Cracks gentle jokes. Calls you "moj barba" when you win. Sources: oral history clips, Marko Uvodić Splićanin association corpus.
- **Profesor Ćiro** — standard Croatian, formal. Best for kids learning rules from scratch and for school deployments.
- **Tony from the Riva** — English with a Dalmatian accent for tourists. Knows that a stranger from Manchester does not need to hear about the 1715 siege of Sinj before learning briškula.
- **Šjora Mare** — čakavski-speaking older woman; teaches trešeta strategy with proverbs. Counterweight to a male-dominated konoba game culture (mora was historically male-only — your platform fixes that).

This is the part of the demo that wins a hackathon: a live conversation with Dida Frane in čakavski while you play briškula on screen.

### 3.2 The multimodal Mora showstopper

Mora / šijavica is the perfect AI demo: you point your camera and microphone at the screen, throw out fingers, and shout a number from 2 to 10 — the AI does the same, scored in real time. Roman roots, ancient Mediterranean game, *and* a multimodal-AI flagship in one. Build this. Nothing else in the demo will draw a louder reaction from judges.

### 3.3 City-level leaderboards as civic infrastructure

User's spec already has daily/weekly/monthly/yearly/all-time + per-game + overall. Push it further:

- **By kvart** (Split neighborhood): Veli Varoš vs. Lučac vs. Manuš vs. Bačvice. Reproduce real Split rivalries.
- **By konoba**: partner taverns sponsor a board; the best briškula player at *Konoba Matejuška* is publicly known.
- **Diaspora boards**: Split ↔ Toronto ↔ Buenos Aires ↔ Pittsburgh ↔ Sydney ↔ Melbourne. The diaspora is the largest underused asset Split has for cultural retention.
- **Hajduk-themed seasons**: leaderboard skins follow Hajduk's match calendar. (Practical detail: get permission. But Hajduk is the soul of the city; ignoring it would be a mistake.)
- **Annual championship**: an official *Split Heritage Games Championship*, held on Riva in late summer, livestreamed. Real trophies. Picigin World Championship slots in cleanly here.

### 3.4 In-person organizing — the part most digital "heritage" projects skip

Most heritage apps are content libraries. The point of this platform is to push people off the app and into Bačvice, the konobas, and the squares.

- **"Riva Mode" live map**: which balote courts are active *right now*. Which konoba has briškula tables open. Which Bačvice corner is mid-picigin.
- **One-tap meetup**: "Looking for a fourth for trešeta tonight" with auto-rendezvous at a partner konoba. Karaoke-style "looking for klapa singers" extension.
- **Tourist exchange marketplace**: a Splićanin can offer "balote afternoon with locals, 2h, €20" or "trešeta lesson at our konoba, €15" — direct revenue for residents, authentic experience for visitors, mayor's tourism pivot served on a plate.
- **Event calendar**: official integration with Sinjska Alka (August), Picigin World Championship (annually at Bačvice), Povratak igri sessions, Čakavski susreti, klapa festivals.

### 3.5 The school mode

The Čakavski Sabor has been trying for years to get Split čakavski into primary schools. This is the unlock:

- A free school edition with Profesor Ćiro and Šjora Mare as the default tutors.
- Curriculum-aligned briškula / trešeta / mora lessons that double as čakavski vocabulary drills.
- Class leaderboards by school. School A vs. School B trešeta tournaments.
- Teacher dashboard.

If the mayor's office sees a working prototype in one Split classroom, the rest writes itself.

### 3.6 The diaspora bridge

This is where the civic case is unexpectedly strongest. The Croatian diaspora — Toronto, Buenos Aires, Pittsburgh, Sydney, Melbourne — is anxious about losing language and identity (a 2026 Hrvatski Vjesnik reader poll found 9 in 10 worry younger Croatian-Australians are losing touch with their roots). A platform where a teenager in Sydney can learn briškula from Dida Frane in čakavski, and then play her grandmother in Split on Sunday evening, is a heritage retention product the diaspora associations would actively promote.

For the mayor, this is "Split as the cultural capital of the global Croatian diaspora" — a brand position the city does not currently own and that Dubrovnik and Zagreb cannot credibly take.

## 4. Hackathon framing (for judges)

Lead with these four notes:

1. **The demo:** A round of briškula taught live by Dida Frane in čakavski, then a 30-second multimodal mora match where the judge waves fingers at the camera and shouts numbers. Both work. Sit down. Win.
2. **Technical novelty:** Low-resource dialect TTS/STT for splitska čakavština is a real, under-explored AI problem. We treat it seriously. (Use Croatian as the base, fine-tune on the Marko Uvodić Splićanin corpus.)
3. **Social impact:** UNESCO heritage (Alka, klapa), Croatian national heritage (picigin, pljočkanje, splitska čakavština) all rolled into a single product. Three separate cultural preservation programs would each pay for a slice of this.
4. **Defensibility:** Card-games apps are a dime a dozen. *Civically endorsed, dialect-native, locally-mapped, diaspora-spanning* card-games-and-more apps are not. The moat is the partnerships and the corpus, not the code.

## 5. Civic framing (for the mayor's office)

Lead with these five notes:

1. **It implements your existing tourism strategy.** This is the digital embodiment of the pivot away from party tourism and toward cultural experience. Tourists who book a balote afternoon at Konoba X are tourists who *aren't* in the Bačvice all-nighter discos.
2. **It scales the work the County Tourist Board and Kinesiology Faculty are already doing.** Povratak igri runs six locations for one month. The platform runs all year, in every kvart, with the same partners as the institutional spine.
3. **It is the most scalable čakavski preservation tool available.** Every conversation a child or tourist has with Dida Frane is a čakavski conversation. Multiply by users. The Čakavski Sabor and Marko Uvodić Splićanin Association become content partners.
4. **It activates the diaspora as a civic asset.** Split currently has no flagship platform for diaspora cultural engagement. Owning that position is a long-term identity play that Zagreb and Dubrovnik cannot copy.
5. **It is a revenue channel for konoba owners and Splićani.** The tourist-exchange marketplace creates a direct income stream for residents, not for hotel chains. Politically friendly framing for any mayor.

What the city would be asked for: endorsement, access to the Tourist Board / Kinesiology Faculty / Čakavski Sabor as content partners, and a single demo classroom in a Split primary school.

## 6. Twelve ideas worth adding to the original spec

A short list of features beyond the original brief that significantly strengthen the Split positioning. Pick the ones that fit the hackathon time budget; keep the rest in the roadmap.

1. **Carte triestine illustrated by Split artists.** Commission a new local-artist deck (Diocletian's Palace, Sustipan, Marjan) as the platform's signature deck. Doubles as a merchandise revenue line and a Split Tourist Board collateral.
2. **Picigin World Championship official partner status.** The Bačvice championship has no digital home today. Offer to be it.
3. **Sinjska Alka spectator companion.** Live ring-strike tracker, rider profiles, the 1715 siege history in three languages, čakavski commentary track.
4. **Klapa-style audio identity.** Victory jingles, menu chimes, loading sounds — all sourced from real Split klapa groups. Free authenticity per second of audio.
5. **Konoba partnership network.** Partner taverns get a featured page, a "play briškula here" badge, and their best regular's name on the leaderboard. Foot traffic in, content out.
6. **AR overlay at Bačvice.** Point your phone at the picigin circle; see famous historical moves named and attributed.
7. **"Stari Splićani" oral history archive.** Short video interviews with elders explaining one rule, one game, one čakavski word. Doubles as Dida Frane training corpus.
8. **"Pomalo Mode."** A deliberate slow-onboarding flow for tourists framing the platform as antidote to overtourism — directly aligned with the Croatian "slow travel / pomalo" tourism brand.
9. **Hajduk seasonal skins.** Subject to permission. The Hajduk fanbase is the most engaged demographic in the city; ignoring it is leaving the dock without rope.
10. **Multimodal mora trainer (the AI hero feature).** Already covered above; flagging again because it's the single highest-leverage build.
11. **Voice-only briškula for elders and the visually impaired.** Plays entirely through speech in čakavski. Accessibility *and* heritage in one feature.
12. **"Igre kvarta" annual neighborhood tournament.** Veli Varoš vs. Manuš vs. Lučac vs. Varoš vs. Bačvice. Riva final. City-sponsored. This is the kind of event the mayor's office hands a budget to.

## 7. Risks and open questions worth naming before the pitch

- **Rule disputes are the local sport's local sport.** Balote rules vary village-to-village; trešeta variants differ between konobas. Don't try to canonicalize — let communities define rule sets and rank within them.
- **Dialect data is scarce.** Splitska čakavština is an under-resourced language for TTS/STT. Be honest about this in the pitch — and propose the Marko Uvodić Splićanin corpus + Čakavski Sabor partnership as the path forward.
- **Gender history is uncomfortable.** Mora / šijavica was historically male-only in konobas. Don't ignore that — explicitly reframe the digital version as open to everyone. Šjora Mare as the trešeta tutor is part of this fix.
- **Don't claim UNESCO status for picigin.** It's nationally protected, not UNESCO-listed. UNESCO applies to Alka, klapa, and (as a "good practice" register) the Tocatì traditional-games festival of which pljočkanje is part. Get this right or a judge will catch it.
- **Hajduk and Sinjska Alka logos require permission.** Don't put them in the demo without it; sketch the partnership pitch instead.
- **Karambol terminology needs a local sanity check.** Some sources class it as a card game; others as carrom (the disc game). Call a Split konoba regular before shipping the icon.

## Sources

- [Briškula, Trešeta, Karambol, Balota, Picigin… Dalmatian Pastimes — Total Croatia](https://total-croatia-news.com/destinations/destination-split/split-blog/tell-me-something-about-split/briskula-treseta-karambol-balota-picigindalmatian-pastimes/)
- [9 Croatian card games you can play right now — Expat in Croatia](https://www.expatincroatia.com/croatian-card-games/)
- [National and regional card games: Croatia — Pagat](https://www.pagat.com/national/croatia.html)
- [Tressette — Wikipedia](https://en.wikipedia.org/wiki/Tressette)
- [Briscola — Wikipedia](https://en.wikipedia.org/wiki/Briscola)
- [100 Years of Playing Picigin at Bačvice Beach — Visit Split](https://visitsplit.com/en/6264/100-years-of-playing-picigin-at-bacvice-beach)
- [Croatia's Ministry of Culture Protects Picigin — Croatia Week](https://www.croatiaweek.com/croatias-ministry-of-culture-protects-picigin/)
- [Discover the Croatian beach game of Picigin — Croatia Week](https://www.croatiaweek.com/video-indigenous-croatian-beach-game-of-picigin/)
- [Balote is more than just a game for Dalmatians — Croatia Week](https://www.croatiaweek.com/balote-is-more-than-just-a-game-for-dalmatians/)
- [Boćanje — origin and rules, Pomorski i povijesni muzej HP](https://bocanje.ppmhp.hr/en/on-the-origin-and-rules/)
- [On the ball (boća, buća, balota…) — PPMHP](https://bocanje.ppmhp.hr/en/on-the-ball-boca-buca-balota/)
- [Three games locals love to play the most in Dalmatia — Croatia Week](https://www.croatiaweek.com/three-loved-games-dalmatia/)
- [Sinjska Alka — UNESCO Intangible Cultural Heritage](https://ich.unesco.org/en/RL/sinjska-alka-a-knights-tournament-in-sinj-00357)
- [Sinjska alka — Wikipedia](https://en.wikipedia.org/wiki/Sinjska_alka)
- [Sinjska alka — annual knightly competition in Sinj — Expat in Croatia](https://www.expatincroatia.com/sinjska-alka-croatia-knightly-competition/)
- [Pljočkanje — Wikipedia (HR)](https://hr.wikipedia.org/wiki/Pljo%C4%8Dkanje)
- [Pljočke (Croatia) — Traditional Sports](https://www.traditionalsports.org/traditional-sports/europe/pljocke-croatia.html)
- [Pljočkanje — Istrapedia](https://www.istrapedia.hr/hr/natuknice/3214/pljockanje)
- [Morra (game) — Wikipedia](https://en.wikipedia.org/wiki/Morra_(game))
- [Learn about the unique finger-guessing game played across Croatia (Šijavica) — Croatia Week](https://www.croatiaweek.com/ancient-finger-guessing-game-sijavica/)
- [Traditional Games — briškula, tressette, mora — Colours of Istria](https://coloursofistria.com/en/activities/traditional-games-cards-and-mora-cantada)
- [Bringing traditional games back to Dalmatian streets (Povratak igri 2026) — Croatia Week](https://www.croatiaweek.com/dalmatia-rediscover-play-traditional-games-2026/)
- [Splitska čakavština — Wikipedija](https://hr.wikipedia.org/wiki/Splitska_%C4%8Dakav%C5%A1tina)
- [Preserving local culture: The Split dialect debate — Croatia Week](https://www.croatiaweek.com/preserving-local-culture-the-split-dialect-debate/)
- [Počeli Čakavski susreti, cilj je očuvati splitski govor — Dalmatinski portal](https://mail.dalmatinskiportal.hr/zivot/poceli-cakavski-susreti--cilj-je-ocuvati-splitski-govor/235858)
- [Chakavian — Wikipedia](https://en.wikipedia.org/wiki/Chakavian)
- [Split Redefines Its Tourism Strategy: Moving Away From Nightlife — Travel and Tour World](https://www.travelandtourworld.com/news/article/split-redefines-its-tourism-strategy-moving-away-from-nightlife-to-cultural-experiences-in-croatia/)
- [Cultural Tourism as a Tourist Development Strategy of City of Split — SCIRP](https://www.scirp.org/journal/paperinformation?paperid=130634)
- [Nine in ten Vjesnik readers fear youth are losing their roots — Hrvatski Vjesnik (2026)](https://vjesnik.com.au/2026/03/nine-in-ten-vjesnik-readers-fear-youth-are-losing-their-roots/)
- [Traditional games — Creski Kaić](https://creskikaic.eu/traditional-games/?lang=en)
