import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-200 selection:text-orange-900">
      <Navbar />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');
        
        .newsletter-wrapper {
          --color-background-primary: #ffffff;
          --color-background-secondary: #f4f2ed;
          --color-text-primary: #1a1a1a;
          --color-text-secondary: #555555;
          --color-border-tertiary: #e8e4dc;
          font-family: 'DM Sans', sans-serif;
          max-width: 620px;
          margin: 0 auto;
          background: var(--color-background-primary);
          color: var(--color-text-primary);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1);
        }
        
        .newsletter-wrapper * { box-sizing: border-box; }
        .hd { background: #162716; padding: 44px 48px 36px; text-align: center; }
        .hd-tag { font-size: 10px; font-weight: 500; letter-spacing: .18em; text-transform: uppercase; color: #7ec87e; border: .5px solid #7ec87e; padding: 4px 14px; border-radius: 20px; display: inline-block; margin-bottom: 20px; }
        .hd-title { font-family: 'Playfair Display', serif; font-size: 34px; color: #f0ece4; line-height: 1.25; margin-bottom: 8px; }
        .hd-meta { font-size: 12px; color: #6a8a6a; letter-spacing: .06em; }
        .ms { display: flex; justify-content: space-between; align-items: center; padding: 10px 48px; background: #f4f2ed; border-bottom: .5px solid #e8e4dc; }
        
        @media(prefers-color-scheme: dark) {
          .newsletter-wrapper {
            --color-background-primary: #121212;
            --color-background-secondary: #1a1a18;
            --color-text-primary: #f0ece4;
            --color-text-secondary: #aaaaaa;
            --color-border-tertiary: #2a2a28;
          }
          .ms { background: #1a1a18; border-bottom-color: #2a2a28; }
          .ms span { color: #666 !important; }
          .ms strong { color: #8dc98d !important; }
          .chip { background: #1e2e10 !important; color: #8dc98d !important; }
        }
        
        .ms span { font-size: 11.5px; color: #888; }
        .ms strong { font-size: 11.5px; color: #3b6d11; font-weight: 500; }
        .bd { padding: 0 48px 48px; }
        .hero { padding: 32px 0; border-bottom: .5px solid var(--color-border-tertiary); display: grid; grid-template-columns: 1fr 160px; gap: 28px; align-items: center; }
        .hero-text h2 { font-family: 'Playfair Display', serif; font-size: 22px; line-height: 1.35; margin-bottom: 12px; color: var(--color-text-primary); }
        .hero-text p { font-size: 13.5px; line-height: 1.75; color: var(--color-text-secondary); }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 24px 0; }
        .stat { background: var(--color-background-secondary); border-radius: 10px; padding: 16px 12px; text-align: center; }
        .stat-n { font-family: 'Playfair Display', serif; font-size: 26px; color: #3b6d11; line-height: 1; margin-bottom: 5px; }
        .stat-l { font-size: 11px; color: var(--color-text-secondary); line-height: 1.45; }
        .sec { padding: 26px 0; border-bottom: .5px solid var(--color-border-tertiary); }
        .sec-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .chip { font-size: 10px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: #639922; background: #eef5e4; padding: 3px 12px; border-radius: 20px; }
        .sec h3 { font-family: 'Playfair Display', serif; font-size: 19px; color: var(--color-text-primary); margin-bottom: 12px; }
        .sec p { font-size: 13.5px; line-height: 1.75; color: var(--color-text-secondary); }
        .area-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 18px; }
        .area-card { border: .5px solid var(--color-border-tertiary); border-radius: 12px; padding: 20px 16px; text-align: center; }
        .area-card h4 { font-size: 13px; font-weight: 500; color: var(--color-text-primary); margin: 14px 0 6px; }
        .area-card p { font-size: 12px; line-height: 1.65; color: var(--color-text-secondary); }
        .phases { display: flex; flex-direction: column; gap: 0; margin-top: 18px; position: relative; }
        .phases::before { content: ''; position: absolute; left: 30px; top: 24px; bottom: 24px; width: 1px; background: var(--color-border-tertiary); }
        .phase { display: flex; gap: 16px; align-items: flex-start; padding: 12px 0; }
        .phase-dot { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: #162716; border: 2px solid #639922; margin-top: 2px; position: relative; z-index: 1; }
        .phase-dot-inner { width: 8px; height: 8px; background: #639922; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .phase-info { flex: 1; }
        .phase-label { font-size: 10px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: #639922; margin-bottom: 3px; }
        .phase-name { font-size: 13.5px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 2px; }
        .phase-ex { font-size: 12px; color: var(--color-text-secondary); }
        .cta { background: #162716; border-radius: 14px; padding: 30px 28px; text-align: center; margin-top: 26px; }
        .cta h3 { font-family: 'Playfair Display', serif; font-size: 20px; color: #f0ece4; margin-bottom: 10px; }
        .cta p { font-size: 13px; color: #7a9a7a; line-height: 1.65; margin-bottom: 20px; }
        .cta-btn { display: inline-block; background: #639922; color: #fff; font-size: 12.5px; font-weight: 500; padding: 10px 28px; border-radius: 24px; text-decoration: none; letter-spacing: .04em; }
        .ft { padding: 22px 48px; text-align: center; border-top: .5px solid var(--color-border-tertiary); }
        .ft-logo { font-family: 'Playfair Display', serif; font-size: 15px; color: var(--color-text-primary); margin-bottom: 6px; }
        .ft-txt { font-size: 11px; color: var(--color-text-secondary); line-height: 1.6; }
        .dots { display: flex; justify-content: center; gap: 4px; margin-top: 10px; }
        .dots span { width: 3px; height: 3px; border-radius: 50%; background: #639922; opacity: .5; }
      `}} />

      <main className="py-16 px-4">
        <div className="newsletter-wrapper">
          <div className="hd">
            <div className="hd-tag">Snail Runner</div>
            <h1 className="hd-title">Running Injury<br />Prevention</h1>
            <p className="hd-meta">The Runner&apos;s Weekly · Issue No. 01 · April 2026</p>
          </div>

          <div className="ms">
            <span>April 6, 2026</span>
            <strong>Vol. 1 — Strength Training</strong>
            <span>5 min read</span>
          </div>

          <div className="bd">
            <div className="hero">
              <div className="hero-text">
                <h2>The Secret Weapon:<br />Strength Training</h2>
                <p>Running injuries affect up to 92% of runners. Sports science now confirms that systematic strength training is the most effective way to stay on the road — reducing your injury risk by nearly two-thirds.</p>
              </div>
              <div>
                <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" width="160" height="160">
                  <circle cx="80" cy="80" r="72" fill="#eef5e4" opacity=".7"/>
                  <circle cx="100" cy="38" r="12" fill="#162716"/>
                  <line x1="100" y1="50" x2="80" y2="84" stroke="#162716" strokeWidth="5" strokeLinecap="round"/>
                  <line x1="94" y1="62" x2="112" y2="72" stroke="#162716" strokeWidth="4" strokeLinecap="round"/>
                  <line x1="90" y1="64" x2="66" y2="58" stroke="#162716" strokeWidth="4" strokeLinecap="round"/>
                  <line x1="80" y1="84" x2="100" y2="108" stroke="#162716" strokeWidth="5" strokeLinecap="round"/>
                  <line x1="100" y1="108" x2="116" y2="130" stroke="#162716" strokeWidth="5" strokeLinecap="round"/>
                  <line x1="80" y1="84" x2="60" y2="106" stroke="#162716" strokeWidth="5" strokeLinecap="round"/>
                  <line x1="60" y1="106" x2="48" y2="128" stroke="#162716" strokeWidth="5" strokeLinecap="round"/>
                  <ellipse cx="116" cy="132" rx="9" ry="5" fill="#639922"/>
                  <ellipse cx="48" cy="130" rx="9" ry="5" fill="#639922"/>
                  <line x1="28" y1="68" x2="44" y2="68" stroke="#7ec87e" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="22" y1="80" x2="40" y2="80" stroke="#7ec87e" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="28" y1="92" x2="44" y2="92" stroke="#7ec87e" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div className="stats">
              <div className="stat">
                <div className="stat-n">~66%</div>
                <div className="stat-l">Reduction in injury risk</div>
              </div>
              <div className="stat">
                <div className="stat-n">2×</div>
                <div className="stat-l">Sessions per week recommended</div>
              </div>
              <div className="stat">
                <div className="stat-n">+4pt</div>
                <div className="stat-l">Risk drop per 10% more volume</div>
              </div>
            </div>

            <div className="sec">
              <div className="sec-header"><span className="chip">Key Areas</span></div>
              <h3>Where Should Runners Focus?</h3>
              <p>Two critical areas to target in every training block to prevent the most common running injuries.</p>

              <div className="area-grid">
                <div className="area-card">
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
                    <circle cx="40" cy="40" r="36" fill="#eef5e4"/>
                    <ellipse cx="40" cy="44" rx="18" ry="10" fill="none" stroke="#162716" strokeWidth="2.5"/>
                    <circle cx="24" cy="50" r="5" fill="none" stroke="#639922" strokeWidth="2.5"/>
                    <circle cx="56" cy="50" r="5" fill="none" stroke="#639922" strokeWidth="2.5"/>
                    <line x1="40" y1="34" x2="40" y2="18" stroke="#162716" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3"/>
                    <circle cx="40" cy="40" r="22" stroke="#7ec87e" strokeWidth="1.2" strokeDasharray="4 3" opacity=".6"/>
                  </svg>
                  <h4>Hips &amp; Core</h4>
                  <p>Hip abductor weakness is a leading cause of ITB syndrome and knee pain. Strengthening this area stabilizes knee alignment and keeps your biomechanics safe.</p>
                </div>
                <div className="area-card">
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
                    <circle cx="40" cy="40" r="36" fill="#eef5e4"/>
                    <path d="M36 16 Q33 38 34 54 Q35 62 40 66 Q45 62 46 54 Q47 38 44 16 Z" fill="none" stroke="#162716" strokeWidth="2.5" strokeLinejoin="round"/>
                    <path d="M37 36 Q35 46 36 54" stroke="#639922" strokeWidth="3.5" strokeLinecap="round" opacity=".9"/>
                    <path d="M43 36 Q45 46 44 54" stroke="#639922" strokeWidth="3.5" strokeLinecap="round" opacity=".9"/>
                    <line x1="40" y1="58" x2="40" y2="66" stroke="#162716" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M34 66 Q36 70 40 70 Q48 70 50 67" stroke="#162716" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M25 47 L25 53" stroke="#7ec87e" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M22 44 L25 47" stroke="#7ec87e" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M22 56 L25 53" stroke="#7ec87e" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <h4>Calves &amp; Feet</h4>
                  <p>The soleus absorbs massive impact with every stride. Bodyweight alone isn&apos;t enough — heavy resistance training is essential to prevent Achilles tendinopathy and plantar fasciitis.</p>
                </div>
              </div>
            </div>

            <div className="sec">
              <div className="sec-header"><span className="chip">Training Plan</span></div>
              <h3>12-Week Phased Program</h3>
              <p>A three-phase plan that builds neuromuscular performance without unwanted bulk. Perform each phase twice a week.</p>

              <div className="phases">
                <div className="phase">
                  <div className="phase-dot"><div className="phase-dot-inner"></div></div>
                  <div className="phase-info">
                    <div className="phase-label">Phase 1 · Week 1–4</div>
                    <div className="phase-name">Activation &amp; Form</div>
                    <div className="phase-ex">Squats · Pelvic bridges · Planks</div>
                  </div>
                  <svg viewBox="0 0 52 52" fill="none" width="52" height="52" style={{flexShrink:0}}>
                    <circle cx="26" cy="26" r="24" fill="#eef5e4"/>
                    <circle cx="26" cy="13" r="5" fill="#162716"/>
                    <path d="M26 18 L26 28" stroke="#162716" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M26 28 L18 38" stroke="#162716" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M26 28 L34 38" stroke="#162716" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M20 23 L26 26 L32 23" stroke="#639922" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="phase">
                  <div className="phase-dot"><div className="phase-dot-inner"></div></div>
                  <div className="phase-info">
                    <div className="phase-label">Phase 2 · Week 5–8</div>
                    <div className="phase-name">Functional Strength</div>
                    <div className="phase-ex">Lunges · Single-leg RDLs · Step-ups</div>
                  </div>
                  <svg viewBox="0 0 52 52" fill="none" width="52" height="52" style={{flexShrink:0}}>
                    <circle cx="26" cy="26" r="24" fill="#eef5e4"/>
                    <circle cx="28" cy="13" r="5" fill="#162716"/>
                    <path d="M28 18 L26 28" stroke="#162716" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M26 28 L18 40" stroke="#162716" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M26 28 L36 35" stroke="#162716" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M36 35 L36 42" stroke="#162716" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M22 21 L28 24" stroke="#639922" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="phase">
                  <div className="phase-dot"><div className="phase-dot-inner"></div></div>
                  <div className="phase-info">
                    <div className="phase-label">Phase 3 · Week 9–12</div>
                    <div className="phase-name">Power &amp; Explosiveness</div>
                    <div className="phase-ex">Jump squats · A-skips · Box jumps</div>
                  </div>
                  <svg viewBox="0 0 52 52" fill="none" width="52" height="52" style={{flexShrink:0}}>
                    <circle cx="26" cy="26" r="24" fill="#eef5e4"/>
                    <circle cx="26" cy="12" r="5" fill="#162716"/>
                    <path d="M26 17 L26 28" stroke="#162716" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M26 28 L20 36" stroke="#162716" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M26 28 L32 36" stroke="#162716" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M20 22 L16 18" stroke="#162716" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M32 22 L36 18" stroke="#162716" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M26 42 L26 46" stroke="#639922" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M23 44 L26 41 L29 44" stroke="#639922" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="sec" style={{borderBottom: "none"}}>
              <div className="sec-header"><span className="chip">Key Benefit</span></div>
              <h3>Improved Running Economy</h3>
              <p>Adding plyometric training lets you run at the same pace while burning significantly less energy — so you go further, faster, for longer.</p>
              <div style={{marginTop: "20px", padding: "20px 24px", background: "var(--color-background-secondary)", borderRadius: "12px"}}>
                <svg viewBox="0 0 480 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" style={{display: "block"}}>
                  <text x="0" y="14" fontFamily="DM Sans,sans-serif" fontSize="11" fill="#888">Energy used</text>
                  <text x="0" y="55" fontFamily="DM Sans,sans-serif" fontSize="11" fill="#888">Speed</text>
                  <rect x="80" y="20" width="140" height="20" rx="4" fill="#162716" opacity=".2"/>
                  <text x="228" y="35" fontFamily="DM Sans,sans-serif" fontSize="11" fill="#888">Before training</text>
                  <rect x="80" y="46" width="88" height="20" rx="4" fill="#639922"/>
                  <text x="176" y="61" fontFamily="DM Sans,sans-serif" fontSize="11" fill="#639922" fontWeight="500">After training (−37%)</text>
                  <line x1="80" y1="85" x2="440" y2="85" stroke="#162716" strokeWidth="1.5" opacity=".2"/>
                  <text x="250" y="97" fontFamily="DM Sans,sans-serif" fontSize="11" fill="#888" textAnchor="middle">Same pace maintained</text>
                  <line x1="80" y1="82" x2="80" y2="88" stroke="#888" strokeWidth="1.2"/>
                  <line x1="440" y1="82" x2="440" y2="88" stroke="#888" strokeWidth="1.2"/>
                </svg>
              </div>
            </div>

            <div className="cta">
              <h3>Start Today</h3>
              <p>A strong running stride starts with a strong body.<br />Add hip- and calf-focused strength work twice a week — your future self will thank you.</p>
              <Link className="cta-btn" href="/">Read More on the Blog</Link>
            </div>

          </div>

          <div className="ft">
            <div className="ft-logo">Snail Runner</div>
            <p className="ft-txt">Your weekly companion for safe, joyful, and sustainable running.<br />Questions or feedback? Reply to this newsletter anytime.</p>
            <div className="dots"><span></span><span></span><span></span></div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
