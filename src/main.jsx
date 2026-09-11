import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight, Menu, X, Sun, Moon, ShieldCheck, Building2, HardHat,
  Ruler, Layers3, CheckCircle2, Phone, Mail, MapPin, LogOut, Save,
  RotateCcw, Upload, Image as ImageIcon, LockKeyhole, Eye, EyeOff,
  ChevronRight, Sparkles
} from 'lucide-react';
import './styles.css';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin@2026';
const STORAGE_KEY = 'forgebuild-site-data';
const THEME_KEY = 'forgebuild-theme';

const DEFAULTS = {
  company: 'ForgeBuild', suffix: 'Construction', logoImage: '', themePreset: 'maroon', accentColor: '#6f1720',
  eyebrow: 'BUILT WITH PURPOSE',
  heroTitle: 'We shape places.', heroAccent: 'You shape the future.',
  heroText: 'A modern construction partner for commercial, residential and renovation projects — from first concept to final handover.',
  years: '15+', projectsCount: '120+', onTime: '98%',
  phone: '+63 917 555 2026', email: 'hello@forgebuild.com', address: 'Makati City, Philippines',
  heroImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2200&q=90',
  aboutImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=88',
  projects: [
    { title: 'Cedar Heights', type: 'Residential', year: '2026', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=88' },
    { title: 'Axis Corporate Center', type: 'Commercial', year: '2026', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=88' },
    { title: 'Harborline Infrastructure', type: 'Infrastructure', year: '2026', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=88' },
    { title: 'The Grove Villa', type: 'Residential', year: '2026', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=88' }
  ]
};

const services = [
  { icon: Building2, number: '01', title: 'Commercial', text: 'Workplaces, retail and mixed-use spaces designed for performance and built to last.' },
  { icon: HardHat, number: '02', title: 'Residential', text: 'Homes with disciplined construction, thoughtful details and materials that age beautifully.' },
  { icon: Ruler, number: '03', title: 'Renovation', text: 'Smart transformations that respect the existing structure while creating something new.' },
  { icon: Layers3, number: '04', title: 'Fit-Out', text: 'End-to-end interior execution with coordinated trades, finishes and handover.' }
];

function getData() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { return DEFAULTS; }
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1800, scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', .82));
      };
      img.onerror = reject; img.src = reader.result;
    };
    reader.onerror = reject; reader.readAsDataURL(file);
  });
}

function useSitePalette(data) {
  useEffect(() => {
    const preset = data?.themePreset || 'maroon';
    document.documentElement.dataset.palette = preset;
    if (data?.accentColor) {
      document.documentElement.style.setProperty('--custom-accent', data.accentColor);
      document.documentElement.style.setProperty('--accent', data.accentColor);
      document.documentElement.style.setProperty('--accent-2', data.accentColor);
    }
    return () => {
      document.documentElement.style.removeProperty('--custom-accent');
      document.documentElement.style.removeProperty('--accent');
      document.documentElement.style.removeProperty('--accent-2');
    };
  }, [data?.themePreset, data?.accentColor]);
}

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark');
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem(THEME_KEY, theme); }, [theme]);
  return [theme, setTheme];
}

function Brand({ data, onClick }) {
  return <button className="brand" onClick={onClick}><span className="brand-symbol">{data.logoImage ? <img src={data.logoImage} alt="Company logo"/> : 'F'}</span><span>{data.company}<small>{data.suffix}</small></span></button>;
}

function PublicSite() {
  const [data, setData] = useState(getData);
  const [theme, setTheme] = useTheme();
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState('All');
  const [activeNav, setActiveNav] = useState('home');
  useSitePalette(data);

  useEffect(() => {
    const sync = () => setData(getData());
    window.addEventListener('storage', sync); return () => window.removeEventListener('storage', sync);
  }, []);
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } }), { threshold: .12 });
    els.forEach(e => io.observe(e)); return () => io.disconnect();
  }, [data, filter]);

  useEffect(() => {
    const sections = ['home','about','services','projects','contact'].map(id => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveNav(entry.target.id); });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => io.observe(section));
    return () => io.disconnect();
  }, [data]);

  const go = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveNav(id); setMenu(false); };
  const projects = useMemo(() => filter === 'All' ? data.projects : data.projects.filter(p => p.type === filter), [data.projects, filter]);

  return <div className="public-site">
    <header className="public-nav">
      <div className="container nav-inner">
        <Brand data={data} onClick={() => go('home')} />
        <nav className={menu ? 'nav-menu open' : 'nav-menu'} aria-label="Primary navigation">
          {['about','services','projects','contact'].map(id => <button key={id} className={activeNav===id?'active':''} onClick={() => go(id)}><span>{id[0].toUpperCase()+id.slice(1)}</span></button>)}
        </nav>
        <div className="nav-actions">
          <button className="theme-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle light and dark mode">{theme === 'dark' ? <Sun/> : <Moon/>}</button>
          <button className="outline-btn desktop" onClick={() => go('contact')}>Start a project <ArrowUpRight size={16}/></button>
          <button className="menu-toggle" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
        </div>
      </div>
    </header>

    <main>
      <section id="home" className="hero-new">
        <div className="hero-bg" style={{ backgroundImage: `url("${data.heroImage}")` }}/><div className="hero-vignette"/>
        <div className="container hero-inner">
          <div className="hero-copy reveal show"><div className="kicker"><span/> {data.eyebrow}</div><h1>{data.heroTitle}<br/><i>{data.heroAccent}</i></h1><p>{data.heroText}</p><div className="hero-buttons"><button className="solid-btn" onClick={() => go('contact')}>Start a conversation <ArrowUpRight/></button><button className="playless-link" onClick={() => go('projects')}>View selected work <ChevronRight/></button></div></div>
          <div className="hero-side reveal show"><span>EST. 2011</span><div className="side-line"/><span>PH · 14.6°N</span></div>
        </div>
        <div className="container hero-metrics"><div><strong>{data.years}</strong><span>Years building</span></div><div><strong>{data.projectsCount}</strong><span>Projects delivered</span></div><div><strong>{data.onTime}</strong><span>On-time completion</span></div><div className="metric-note">From groundworks<br/>to final details.</div></div>
      </section>

      <section id="about" className="section about-new"><div className="container about-layout"><div className="section-number reveal">01 / ABOUT</div><div className="about-content"><div className="about-image reveal"><img src={data.aboutImage} alt="Construction project"/><span>CRAFT / CLARITY / CONTROL</span></div><div className="about-text reveal"><p className="display">We don't just build structures. <em>We build confidence.</em></p><p>Every project is a balance of vision, budget, people and time. Our job is to make those moving parts feel simple — with clear communication, disciplined execution and a finish we are proud to put our name on.</p><div className="signature"><span>FB</span><div><b>{data.company}</b><small>Built for what comes next.</small></div></div></div></div></div></section>

      <section id="services" className="section services-new"><div className="container"><div className="section-head reveal"><div><div className="section-number">02 / CAPABILITIES</div><h2>What we <em>do.</em></h2></div><p>One partner from planning through completion, with the people and process to keep your project moving.</p></div><div className="service-grid-new">{services.map((s,i) => { const Icon=s.icon; return <article className="service-card-new reveal" key={s.title}><div className="service-top"><span>{s.number}</span><Icon/></div><h3>{s.title}</h3><p>{s.text}</p><span className="card-arrow">↗</span></article>; })}</div></div></section>

      <section id="projects" className="section projects-new"><div className="container"><div className="section-head project-head reveal"><div><div className="section-number">03 / SELECTED WORK</div><h2>Built, <em>delivered.</em></h2></div><div className="filters">{['All','Residential','Commercial','Infrastructure'].map(f => <button key={f} className={filter===f?'active':''} onClick={()=>setFilter(f)}>{f}</button>)}</div></div><div className="project-grid-new">{projects.length ? projects.map((p,i)=><article className="project-card-new reveal show" key={`${filter}-${p.title}`}><div className="project-photo"><img src={p.image} alt={p.title}/><div className="project-overlay"><span>{p.type}</span><b>↗</b></div></div><div className="project-caption"><div><h3>{p.title}</h3><span>{p.type}</span></div><time>{p.year}</time></div></article>) : <div className="project-empty"><span>No projects in this category yet.</span><button className="filter-reset" onClick={()=>setFilter('All')}>View all projects <ArrowUpRight size={15}/></button></div>}</div></div></section>

      <section className="statement-new"><div className="container"><div className="statement-mark"><Sparkles/></div><p>Good construction is invisible in the final result. <strong>Great construction is felt.</strong></p><div className="statement-bottom"><span>QUALITY IS A HABIT.</span><span>— {data.company.toUpperCase()}</span></div></div></section>

      <section className="section trust-new"><div className="container"><div className="section-number reveal">04 / WHY US</div><div className="trust-grid"><h2 className="reveal">The details are<br/><em>the difference.</em></h2><div className="trust-list">{[['01','Clear communication','No disappearing acts. You always know what is happening, what is next and why.'],['02','Quality control','We catch small issues early, before they become expensive problems.'],['03','Built to last','Practical materials, skilled trades and decisions made for the long run.']].map(x=><div className="trust-row reveal" key={x[0]}><span>{x[0]}</span><div><h3>{x[1]}</h3><p>{x[2]}</p></div><CheckCircle2/></div>)}</div></div></div></section>

      <section id="contact" className="contact-new"><div className="container contact-layout"><div className="contact-copy"><div className="section-number">05 / CONTACT</div><h2>Have a project<br/><em>in mind?</em></h2><p>Tell us what you are building. We will take it from there.</p><div className="contact-details"><a href={`tel:${data.phone}`}><Phone/> {data.phone}</a><a href={`mailto:${data.email}`}><Mail/> {data.email}</a><span><MapPin/> {data.address}</span></div></div><form className="contact-form-new" onSubmit={e=>{e.preventDefault(); alert('Thanks! This demo form is ready to connect to your email/backend.');}}><label>Name<input required placeholder="Your name"/></label><label>Email<input required type="email" placeholder="you@example.com"/></label><label>Project type<select><option>Commercial</option><option>Residential</option><option>Renovation</option><option>Fit-Out</option></select></label><label>Message<textarea rows="5" placeholder="Tell us a little about the project..."/></label><button className="solid-btn" type="submit">Send inquiry <ArrowUpRight/></button></form></div></section>
    </main>
    <footer className="footer-new"><div className="container footer-row"><Brand data={data} onClick={() => go('home')}/><span>© {new Date().getFullYear()} {data.company} {data.suffix}. All rights reserved.</span></div></footer>
  </div>;
}

function ImageField({ label, value, onChange }) {
  const [url, setUrl] = useState(value?.startsWith('data:') ? '' : value || '');
  const upload = async e => { const file=e.target.files?.[0]; if(!file) return; try { onChange(await compressImage(file)); } catch { alert('Could not read image.'); } };
  return <div className="image-field"><div className="image-preview" style={{backgroundImage:`url("${value}")`}}><span>{label}</span><label className="upload-btn"><Upload size={15}/> Upload<input type="file" accept="image/*" onChange={upload}/></label></div><input value={url} onChange={e=>{setUrl(e.target.value);onChange(e.target.value)}} placeholder="Or paste an image URL"/></div>;
}

function Login({ onSuccess }) {
  const [user,setUser]=useState(''); const [pass,setPass]=useState(''); const [show,setShow]=useState(false); const [error,setError]=useState('');
  const submit=e=>{e.preventDefault(); if(user===ADMIN_USERNAME && pass===ADMIN_PASSWORD){sessionStorage.setItem('forgebuild-admin','1');onSuccess();} else setError('Invalid username or password.');};
  return <div className="login-page"><div className="login-art"><div className="login-art-inner"><span className="login-badge">FORGEBUILD / CONTROL</span><h1>Build the site<br/><em>behind the site.</em></h1><p>Private admin workspace for editing your public company website.</p></div></div><div className="login-box"><div className="login-logo"><span>F</span><div>FORGEBUILD<small>ADMIN PORTAL</small></div></div><div className="login-title"><span>SECURE AREA</span><h2>Welcome back.</h2><p>Sign in to manage website content and project images.</p></div><form onSubmit={submit}><label>Username<input autoFocus value={user} onChange={e=>setUser(e.target.value)} placeholder="Enter username"/></label><label>Password<div className="password-input"><input type={show?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter password"/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></div></label>{error&&<div className="login-error"><LockKeyhole size={15}/>{error}</div>}<button className="solid-btn full" type="submit">Sign in <ArrowUpRight/></button></form><button className="back-public" onClick={()=>{location.hash='';}}>← Back to public site</button><small className="security-note">Demo credentials are fixed in the frontend. For real production security, use a server-side auth system.</small></div></div>;
}

function Admin({ onLogout }) {
  const [draft,setDraft]=useState(getData); const [tab,setTab]=useState('overview'); const [saved,setSaved]=useState(false);
  useSitePalette(draft);
  const update=(k,v)=>setDraft(d=>({...d,[k]:v}));
  const updateProject=(i,k,v)=>setDraft(d=>({...d,projects:d.projects.map((p,idx)=>idx===i?{...p,[k]:v}:p)}));
  const save=()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(draft));setSaved(true);setTimeout(()=>setSaved(false),1800);};
  const reset=()=>{if(confirm('Reset all website content to the demo defaults?')){setDraft(DEFAULTS);localStorage.removeItem(STORAGE_KEY);}};
  return <div className="admin-shell"><aside className="admin-sidebar"><div className="admin-brand"><span>{draft.logoImage ? <img src={draft.logoImage} alt="Company logo"/> : 'F'}</span><div>{draft.company.toUpperCase()}<small>ADMIN</small></div></div><nav><button className={tab==='overview'?'active':''} onClick={()=>setTab('overview')}>Overview</button><button className={tab==='content'?'active':''} onClick={()=>setTab('content')}>Site content</button><button className={tab==='media'?'active':''} onClick={()=>setTab('media')}>Images</button><button className={tab==='projects'?'active':''} onClick={()=>setTab('projects')}>Projects</button></nav><div className="sidebar-bottom"><button onClick={()=>{location.hash='';}}><Eye size={16}/> View website</button><button onClick={onLogout}><LogOut size={16}/> Sign out</button></div></aside><div className="admin-main"><header className="admin-top"><div><span>CONTROL PANEL</span><h1>{tab==='overview'?'Dashboard':tab==='content'?'Site content':tab==='media'?'Media library':'Project manager'}</h1></div><div className="admin-top-actions"><span className="saved-dot">● {saved?'Saved':'Ready'}</span><button className="reset-btn" onClick={reset}><RotateCcw size={15}/> Reset</button><button className="save-btn" onClick={save}><Save size={15}/> Save changes</button></div></header>{tab==='overview'&&<div className="dashboard"><div className="welcome-card"><div><span>WELCOME, ADMIN</span><h2>Your website, your control.</h2><p>Edit the content, swap images and manage project cards. Everything is stored locally in this no-database demo.</p><button className="solid-btn" onClick={()=>setTab('content')}>Edit site <ArrowUpRight/></button></div><div className="welcome-mark">F</div></div><div className="stat-cards"><div><span>EXPERIENCE</span><b>{draft.years}</b></div><div><span>PROJECTS</span><b>{draft.projectsCount}</b></div><div><span>ON-TIME</span><b>{draft.onTime}</b></div><div><span>CONTENT</span><b>{draft.projects.length} cards</b></div></div><div className="admin-note"><ShieldCheck/><div><b>About security</b><p>This login gate is suitable for a static demo only. Because the credentials live in frontend code, they are not truly secret. For a real public admin, add a backend/auth service.</p></div></div></div>}{tab==='content'&&<div className="editor"><EditorSection title="Brand & theme"><div className="brand-theme-editor"><ImageField label="Company logo" value={draft.logoImage} onChange={v=>update('logoImage',v)}/><div className="theme-controls"><Field label="Company name" value={draft.company} onChange={v=>update('company',v)}/><Field label="Suffix" value={draft.suffix} onChange={v=>update('suffix',v)}/><Field label="Tagline / eyebrow" value={draft.eyebrow} onChange={v=>update('eyebrow',v)}/><label className="field-label">Color theme<select value={draft.themePreset||'maroon'} onChange={e=>update('themePreset',e.target.value)}><option value="maroon">Dark Maroon</option><option value="brown">Warm Brown</option><option value="black">Black & White</option><option value="white">Clean White</option></select></label><label className="field-label">Accent color<div className="color-picker"><input type="color" value={draft.accentColor||'#6f1720'} onChange={e=>update('accentColor',e.target.value)}/><span>{draft.accentColor||'#6f1720'}</span></div></label></div></div></EditorSection><EditorSection title="Brand details"><Field label="Tagline / eyebrow" value={draft.eyebrow} onChange={v=>update('eyebrow',v)}/></EditorSection><EditorSection title="Hero"><Field label="Hero title" value={draft.heroTitle} onChange={v=>update('heroTitle',v)}/><Field label="Hero accent line" value={draft.heroAccent} onChange={v=>update('heroAccent',v)}/><TextField label="Hero description" value={draft.heroText} onChange={v=>update('heroText',v)}/></EditorSection><EditorSection title="Stats"><div className="field-grid"><Field label="Years" value={draft.years} onChange={v=>update('years',v)}/><Field label="Projects" value={draft.projectsCount} onChange={v=>update('projectsCount',v)}/><Field label="On-time" value={draft.onTime} onChange={v=>update('onTime',v)}/></div></EditorSection><EditorSection title="Contact"><div className="field-grid"><Field label="Phone" value={draft.phone} onChange={v=>update('phone',v)}/><Field label="Email" value={draft.email} onChange={v=>update('email',v)}/><Field label="Address" value={draft.address} onChange={v=>update('address',v)}/></div></EditorSection></div>}{tab==='media'&&<div className="editor"><EditorSection title="Website images"><ImageField label="Hero image" value={draft.heroImage} onChange={v=>update('heroImage',v)}/><ImageField label="About image" value={draft.aboutImage} onChange={v=>update('aboutImage',v)}/></EditorSection><div className="media-tip"><ImageIcon/><div><b>Tip</b><p>Uploaded images are compressed and stored in this browser's local storage. For a shared multi-user website, host images on a server/CDN and store the content centrally.</p></div></div></div>}{tab==='projects'&&<div className="editor project-editor-admin">{draft.projects.map((p,i)=><div className="admin-project" key={i}><div className="project-admin-head"><span>PROJECT {String(i+1).padStart(2,'0')}</span><b>{p.type}</b></div><div className="project-admin-grid"><ImageField label="Project image" value={p.image} onChange={v=>updateProject(i,'image',v)}/><div><Field label="Title" value={p.title} onChange={v=>updateProject(i,'title',v)}/><Field label="Type" value={p.type} onChange={v=>updateProject(i,'type',v)}/><Field label="Year" value={p.year} onChange={v=>updateProject(i,'year',v)}/></div></div></div>)}</div>}</div></div>;
}

function Field({label,value,onChange}){return <label className="field-label">{label}<input value={value??''} onChange={e=>onChange(e.target.value)}/></label>}
function TextField({label,value,onChange}){return <label className="field-label full-field">{label}<textarea rows="4" value={value??''} onChange={e=>onChange(e.target.value)}/></label>}
function EditorSection({title,children}){return <section className="editor-section"><h2>{title}</h2><div className="editor-fields">{children}</div></section>}

function App(){
  const [route,setRoute]=useState(location.hash);
  const [auth,setAuth]=useState(sessionStorage.getItem('forgebuild-admin')==='1');
  useEffect(()=>{const h=()=>setRoute(location.hash);window.addEventListener('hashchange',h);return()=>window.removeEventListener('hashchange',h)},[]);
  if(route.startsWith('#/admin')) return auth?<Admin onLogout={()=>{sessionStorage.removeItem('forgebuild-admin');setAuth(false)}}/>:<Login onSuccess={()=>setAuth(true)}/>;
  return <PublicSite/>;
}

createRoot(document.getElementById('root')).render(<App/>);
