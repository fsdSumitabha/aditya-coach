/**
 * Scoped stylesheet for /audit.
 *
 * The audit is a document, not a marketing page: warm ivory paper, gold rules,
 * generous fields. It deliberately does not inherit the dark site surfaces, so
 * it carries its own palette rather than the global tokens. Everything is
 * namespaced under `.aud` and shipped in the server HTML by AuditFlow, so
 * there is no flash of unstyled form.
 */
export const AUDIT_CSS = `
.aud{
  --acc:#a9832f; --acc2:#c9a24b; --deep:#6e5418;
  --paper:#f7f3ec; --card:#fffdf8; --field:#fffdf9;
  --line:#ece3d1; --border:#e4dbc8; --ink:#14120e;
  --body:#3a362f; --label:#4a4336; --muted:#8b8375; --soft:#9a9082;
  background:var(--paper); color:#1e1b16;
  font-family:var(--font-inter),system-ui,sans-serif;
}
.aud *{box-sizing:border-box;}
.aud ::selection{background:rgba(201,162,75,.28);}
.aud-sr{
  position:absolute; width:1px; height:1px; margin:-1px; padding:0;
  overflow:hidden; clip:rect(0 0 0 0); clip-path:inset(50%); white-space:nowrap; border:0;
}

/* ---- chrome ---- */
.aud-bar{
  position:sticky; top:var(--header-h,64px); z-index:30;
  background:rgba(247,243,236,.92);
  backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line);
}
.aud-bar-inner{
  max-width:900px; margin:0 auto; padding:11px 20px;
  display:flex; align-items:center; justify-content:space-between; gap:16px;
}
.aud-bar-right{display:flex; align-items:center; gap:12px;}
.aud-counter{
  font:600 11px/1 inherit; letter-spacing:.18em; text-transform:uppercase;
  color:var(--acc); white-space:nowrap;
}
.aud-saved{font:500 12px/1 inherit; color:#7a9a6f; white-space:nowrap;}
.aud-saved[data-state="saving"]{color:#b0a690;}
.aud-saved[data-state="error"]{color:#b5524f;}
@media (max-width:620px){
  .aud-bar-inner{padding:10px 16px; gap:10px;}
  /* "Final · Commitment" + the PDF button overflow a 375px bar, so the
     counter is the part allowed to truncate. */
  .aud-counter{letter-spacing:.1em; min-width:0; overflow:hidden; text-overflow:ellipsis;}
  .aud-bar-right{flex:none;}
}
.aud-track{height:2px; background:var(--line);}
.aud-fill{height:100%; width:0; background:linear-gradient(90deg,var(--acc),var(--acc2)); transition:width .45s cubic-bezier(.16,1,.3,1);}
@media (prefers-reduced-motion:reduce){ .aud-fill{transition:none;} }

.aud-main{width:100%; max-width:820px; margin:0 auto; padding:clamp(24px,5vw,54px) 20px 104px;}

/* ---- cover ---- */
.aud-cover{text-align:center; padding:clamp(6px,3vw,26px) 0;}
.aud-eyebrow{font:600 12px/1 inherit; letter-spacing:.24em; text-transform:uppercase; color:var(--acc);}
.aud-title{
  font:500 clamp(34px,7vw,60px)/1.03 var(--font-fraunces),Georgia,serif;
  letter-spacing:-.025em; color:var(--ink); margin:16px auto 0; max-width:16ch; text-wrap:balance;
}
.aud-quote{
  font:400 clamp(16px,2.6vw,22px)/1.5 var(--font-fraunces),Georgia,serif;
  font-style:italic; color:var(--deep); margin:22px auto 0; max-width:30ch;
}
.aud-photo-block{display:flex; flex-direction:column; align-items:center; gap:10px; margin-top:36px;}
.aud-photo{
  width:118px; height:118px; border-radius:999px; border:1px dashed #d0c3a4;
  background:var(--field) center/cover no-repeat; display:flex; align-items:center;
  justify-content:center; cursor:pointer; overflow:hidden; padding:0;
}
.aud-photo[data-has="1"]{border:1px solid #e2d6bd;}
.aud-photo span{display:flex; flex-direction:column; align-items:center; gap:6px; font:500 11px/1.2 inherit; color:#a99a78;}
.aud-meta{
  display:inline-flex; align-items:center; gap:11px; margin-top:30px; padding:10px 18px;
  border:1px solid #ece0c8; border-radius:999px; background:var(--field); flex-wrap:wrap; justify-content:center;
}
.aud-meta-label{font:600 11px/1 inherit; letter-spacing:.14em; text-transform:uppercase; color:#a08a55;}
.aud-meta-div{width:1px; height:14px; background:#e2d6bd;}
/* The pill wraps to two lines on narrow phones — the divider then dangles. */
@media (max-width:430px){ .aud-meta-div{display:none;} }
.aud-meta-val{font:500 14px/1 inherit; color:var(--body);}
.aud-resume{margin:14px 0 0; font:500 13px/1.4 inherit; color:#7a9a6f;}
.aud-autosave{margin:12px 0 0; font:400 12px/1.4 inherit; color:#a99a80;}
.aud-cover-foot{
  margin-top:50px; padding-top:24px; border-top:1px solid var(--line); display:flex;
  flex-wrap:wrap; gap:10px 20px; align-items:center; justify-content:center;
  color:var(--muted); font:500 13px/1 inherit;
}
.aud-cover-foot b{color:var(--ink); font-weight:600;}
.aud-dot{width:4px; height:4px; border-radius:9px; background:#d8cbb0;}
.aud-cover-foot a{color:var(--deep); text-decoration:none; display:inline-flex; align-items:center; gap:6px;}
.aud-cover-foot a:hover{color:var(--acc);}

/* ---- section card ---- */
.aud-card{
  background:var(--card); border:1px solid var(--line); border-radius:24px;
  padding:clamp(24px,4vw,44px);
  box-shadow:0 1px 2px rgba(20,18,14,.05),0 24px 60px -34px rgba(20,18,14,.32);
}
.aud-head{display:flex; align-items:center; gap:16px;}
.aud-badge{
  width:52px; height:52px; flex:none; border-radius:14px; border:1px solid #e6dcc7;
  background:linear-gradient(180deg,#fffdf8,#f4ead4); display:flex; align-items:center;
  justify-content:center; color:var(--acc); box-shadow:0 1px 2px rgba(20,18,14,.05);
}
.aud-sec-eyebrow{font:600 11px/1 inherit; letter-spacing:.18em; text-transform:uppercase; color:var(--acc); margin-bottom:7px;}
.aud-h2{font:500 clamp(24px,4vw,34px)/1.08 var(--font-fraunces),Georgia,serif; letter-spacing:-.02em; color:var(--ink); margin:0;}
.aud-rule{height:1px; background:linear-gradient(90deg,rgba(169,131,47,.45),rgba(169,131,47,.1) 60%,transparent); margin:22px 0 0;}
.aud-fields{display:flex; flex-direction:column; gap:26px; margin-top:26px;}
.aud-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(var(--min,200px),1fr)); gap:20px 22px;}
.aud-group-title{font:600 12px/1 inherit; letter-spacing:.14em; text-transform:uppercase; color:#a08a55; margin-bottom:16px;}
.aud-hair{height:1px; background:#efe7d6;}

/* ---- fields ---- */
.aud-label{display:block; font:500 14px/1.35 inherit; color:var(--label); margin:0 0 9px;}
.aud-label.strong{font-size:15px; color:var(--ink); margin-bottom:4px;}
.aud-label i{color:#a99a80; font-weight:400; font-style:normal;}
.aud-note{margin:0 0 13px; font:400 13px/1.4 inherit; color:var(--soft);}
.aud-lead{margin:0 0 22px; font:400 clamp(15px,2vw,17px)/1.5 var(--font-fraunces),Georgia,serif; font-style:italic; color:var(--deep);}
.aud-callout{
  padding:16px 20px; border-radius:14px; background:linear-gradient(180deg,#fbf4e4,#f6ecd6);
  border:1px solid #ece0c8; font:400 clamp(15px,2vw,17px)/1.5 var(--font-fraunces),Georgia,serif;
  font-style:italic; color:var(--deep);
}
.aud-big-quote{margin:0; font:400 clamp(19px,3vw,26px)/1.5 var(--font-fraunces),Georgia,serif; color:#2a251c; text-wrap:pretty;}
.aud-closing{margin:0; text-align:center; font:400 clamp(15px,2vw,17px)/1.5 var(--font-fraunces),Georgia,serif; font-style:italic; color:var(--deep);}

.aud-input{
  width:100%; padding:13px 15px; border:1px solid var(--border); border-radius:12px;
  background:var(--field); font:400 16px/1.4 inherit; color:#1e1b16; outline:none;
}
textarea.aud-input{line-height:1.6; min-height:90px; resize:vertical;}
.aud-input:focus{border-color:var(--acc); box-shadow:0 0 0 3px rgba(201,162,75,.16);}
.aud-input[aria-invalid="true"]{border-color:#b5524f; box-shadow:0 0 0 3px rgba(181,82,79,.12);}
.aud-error{margin:7px 0 0; font:500 13px/1.4 inherit; color:#b5524f;}

.aud-chips{display:flex; flex-wrap:wrap; gap:9px;}
.aud-chip{
  display:inline-flex; align-items:center; gap:7px; padding:10px 15px; border:1px solid var(--border);
  border-radius:999px; background:var(--field); font:500 14px/1 inherit; color:var(--body);
  cursor:pointer; user-select:none;
  transition:border-color .15s,background .15s,color .15s,box-shadow .15s;
}
.aud-chip.lg{padding:11px 17px;}
.aud-chip:hover{border-color:#d3c19a;}
.aud-chip[aria-pressed="true"]{
  border-color:var(--acc); background:rgba(201,162,75,.14); color:var(--ink);
  box-shadow:inset 0 0 0 1px var(--acc);
}
.aud-chip:focus-visible{outline:2px solid var(--acc); outline-offset:2px;}
@media (prefers-reduced-motion:reduce){ .aud-chip{transition:none;} }

/* ---- rating ---- */
.aud-rate{padding:2px 0;}
.aud-rate-top{display:flex; justify-content:space-between; align-items:baseline; gap:12px;}
.aud-rate-top label{font:500 15px/1.3 inherit; color:var(--ink);}
.aud-rate-val{font:500 30px/1 var(--font-fraunces),Georgia,serif; color:var(--acc); min-width:1.4ch; text-align:right;}
.aud-rate-wrap{position:relative; height:34px; display:flex; align-items:center; margin-top:4px;}
.aud-rate-bg{position:absolute; left:0; right:0; height:7px; background:#eaddc4; border-radius:999px;}
.aud-rate-fill{position:absolute; left:0; height:7px; background:linear-gradient(90deg,var(--acc2),var(--acc)); border-radius:999px;}
.aud-rate-thumb{
  position:absolute; width:20px; height:20px; border-radius:999px; background:var(--field);
  border:2px solid var(--acc); box-shadow:0 2px 7px rgba(20,18,14,.28); transform:translateX(-50%);
}
.aud-range{
  position:absolute; left:0; top:0; width:100%; height:100%; margin:0; opacity:0; cursor:pointer;
  -webkit-appearance:none; appearance:none; background:transparent;
}
.aud-range::-webkit-slider-thumb{-webkit-appearance:none; width:36px; height:36px; background:transparent;}
.aud-range::-moz-range-thumb{width:36px; height:36px; background:transparent; border:0;}
.aud-range:focus-visible + .aud-rate-focus{outline:2px solid var(--acc); outline-offset:6px; border-radius:999px;}
.aud-rate-focus{position:absolute; inset:0; pointer-events:none;}
.aud-scale{display:flex; justify-content:space-between; margin-top:2px; font:500 10px/1 inherit; color:#bcae95;}

/* ---- timeline ---- */
.aud-timeline{position:relative; padding-left:24px;}
.aud-timeline::before{content:""; position:absolute; left:5px; top:8px; bottom:8px; width:1px; background:linear-gradient(180deg,var(--acc),rgba(169,131,47,.2));}
.aud-stops{display:flex; flex-direction:column; gap:18px;}
.aud-stop{position:relative;}
.aud-stop::before{content:""; position:absolute; left:-23px; top:11px; width:9px; height:9px; border-radius:9px; background:var(--field); border:2px solid var(--acc);}
.aud-stop label{display:block; font:600 12px/1 inherit; letter-spacing:.06em; text-transform:uppercase; color:#8a7a55; margin:0 0 7px;}

/* ---- signature ---- */
.aud-sig{position:relative; border:1px solid var(--border); border-radius:12px; background:var(--field); overflow:hidden;}
.aud-sig span{
  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  font:400 15px var(--font-fraunces),Georgia,serif; font-style:italic; color:#c7b59a; pointer-events:none;
}
.aud-sig canvas{display:block; width:100%; height:150px; touch-action:none; cursor:crosshair;}
.aud-linkbtn{background:none; border:0; padding:0; margin-top:8px; color:var(--muted); font:500 12px inherit; cursor:pointer; text-decoration:underline;}
.aud-linkbtn:hover{color:var(--body);}

/* ---- buttons ---- */
.aud-btn{
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  padding:14px 26px; min-height:52px; border:0; border-radius:12px;
  background:linear-gradient(180deg,#d4ab52,var(--acc)); color:#241d0b;
  font:600 15px/1 inherit; cursor:pointer; box-shadow:0 8px 20px -10px rgba(169,131,47,.7);
  transition:transform .15s,box-shadow .15s;
}
.aud-btn:hover{transform:translateY(-1px); box-shadow:0 14px 28px -12px rgba(169,131,47,.8);}
.aud-btn:disabled{opacity:.6; cursor:progress; transform:none;}
.aud-btn.ghost{background:var(--card); border:1px solid #d9cfb9; color:var(--label); box-shadow:none;}
.aud-btn.ghost:hover{background:#f4ecdb; transform:none; box-shadow:none;}
.aud-btn.small{padding:9px 13px; min-height:0; font-size:12px; background:var(--card); border:1px solid #ddd2ba; color:#4a4336; box-shadow:none;}
.aud-btn.small:hover{background:#f4ecdb; transform:none;}
.aud-btn.begin{margin-top:30px; padding:17px 34px; font-size:16px; border-radius:14px;}
@media (prefers-reduced-motion:reduce){ .aud-btn{transition:none;} .aud-btn:hover{transform:none;} }

.aud-nav{
  display:flex; align-items:center; gap:12px; margin-top:34px;
  padding-bottom:calc(env(safe-area-inset-bottom,0px));
}
.aud-nav .spacer{flex:1;}
@media (max-width:520px){
  .aud-nav{flex-wrap:wrap;}
  .aud-nav .spacer{display:none;}
  .aud-nav .aud-btn{flex:1 1 100%;}
}

/* ---- submit panel ---- */
.aud-submit{margin-top:34px; padding:24px; border-radius:18px; background:var(--card); border:1px solid var(--line);}
.aud-submit h3{margin:0 0 8px; font:500 22px/1.2 var(--font-fraunces),Georgia,serif; color:var(--ink);}
.aud-submit p{margin:0 0 18px; font:400 14px/1.6 inherit; color:#6b6357;}
.aud-status{margin:16px 0 0; padding:13px 16px; border-radius:12px; font:500 14px/1.5 inherit;}
.aud-status.ok{background:#eef4ea; border:1px solid #cfe0c6; color:#3f6033;}
.aud-status.partial{background:#fdf5e3; border:1px solid #ecd9a8; color:#7a5f16;}
.aud-status.error{background:#fbeceb; border:1px solid #eccbc9; color:#8f3b38;}
.aud-status a{color:inherit; font-weight:600;}

.aud-done{text-align:center; padding:clamp(20px,5vw,44px) 0;}
.aud-done .aud-title{font-size:clamp(28px,5vw,44px); max-width:18ch;}
`;
