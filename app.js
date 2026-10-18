const $=s=>document.querySelector(s);
const routes={work:{label:'WORK / SELECTED EXPERIENCE',title:'Build it well. Make it matter.',copy:'From React and API integrations at SpeedBox to data and research at NYU Stern. Explore the context, contribution, and outcomes behind my work.',url:'#work',link:'Explore selected work ↘',color:0xeebc78},code:{label:'CODE / GITHUB',title:'The work beneath the interface.',copy:'Explore my repositories on GitHub: a place for code, experiments, and the systems behind the experience.',url:'#code',link:'Explore repositories ↘',color:0x91bcd8},writing:{label:'WRITING / 500+ SUBSCRIBERS',title:'From Pilot to Prod.',copy:'My LinkedIn newsletter on agentic AI, data, and the work required to move beyond a convincing demo. Written for 500+ subscribers.',url:'#writing',link:'Explore the newsletter ↘',color:0xaed2ac}};
let selected='work',motion=!matchMedia('(prefers-reduced-motion:reduce)').matches;
try{if(localStorage.getItem('landing-motion')==='off')motion=false;}catch{}
let wake=()=>{};
function syncMotion(){document.body.dataset.motion=motion?'on':'off';document.documentElement.dataset.motion=motion?'on':'off';$('#motion').textContent=motion?'Motion on':'Motion off';$('#motion').setAttribute('aria-pressed',String(motion));wake();}
$('#motion').addEventListener('click',()=>{motion=!motion;syncMotion();try{localStorage.setItem('landing-motion',motion?'on':'off');}catch{}});
syncMotion();$('#year').textContent=new Date().getFullYear();
document.querySelectorAll('[data-route]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.route;const r=routes[selected];document.querySelectorAll('[data-route]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});$('#detail-label').textContent=r.label;$('#detail-title').textContent=r.title;$('#detail-copy').textContent=r.copy;$('#detail-link').textContent=r.link;$('#detail-link').href=r.url;const detail=$('.detail');detail.classList.remove('changing');if(motion){void detail.offsetWidth;detail.classList.add('changing');}wake();}));
$('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('pb3225@stern.nyu.edu');$('#copy-status').textContent='Email copied';}catch{$('#copy-status').textContent='pb3225@stern.nyu.edu';}});
if(typeof IntersectionObserver!=='undefined'){
 const revealObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('revealed');revealObserver.unobserve(entry.target);}}},{threshold:.06});
 document.querySelectorAll('.content-section').forEach(el=>revealObserver.observe(el));
}
// The page and its navigation remain usable when WebGL or the module is unavailable.
let renderer;
function fallback(){renderer?.dispose();$('.scene').classList.remove('ready');$('#engine').hidden=true;$('#expand').hidden=true;$('#reset').hidden=true;$('#scene-note').textContent='STATIC VIEW · EXPLORE THE LINKS BELOW';}
try{
 const THREE=await import('./three.module.js');
 const canvas=$('#engine');
 renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<700?1.25:1.6));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,30);camera.position.set(0,0,8);
 const world=new THREE.Group();scene.add(world);
 scene.add(new THREE.HemisphereLight(0xcde7ff,0x1b1820,3));
 const light=new THREE.DirectionalLight(0xffffff,6);light.position.set(-3,5,4);scene.add(light);
 const warm=new THREE.PointLight(0xeebc78,35);warm.position.set(2,-1,3);scene.add(warm);
 const blue=new THREE.PointLight(0x79a9d4,35);blue.position.set(-3,1,-2);scene.add(blue);
 const metal=new THREE.MeshStandardMaterial({color:0xd4dde1,metalness:.72,roughness:.3});
 const accent=new THREE.MeshStandardMaterial({color:routes.work.color,metalness:.45,roughness:.25,emissive:routes.work.color,emissiveIntensity:.13});
 const rings=[];
 for(let i=0;i<3;i++){
  const group=new THREE.Group();group.rotation.set(.65+i*.75,.35+i*.6,.2+i*.75);world.add(group);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.65-i*.18,.055+i*.02,12,140),i===1?accent:metal);group.add(ring);
  const track=new THREE.Mesh(new THREE.TorusGeometry(1.78-i*.18,.008,5,100),new THREE.MeshBasicMaterial({color:0x7f9ca9,transparent:true,opacity:.4}));group.add(track);
  for(let j=0;j<30;j++){const angle=j/30*Math.PI*2;const tick=new THREE.Mesh(new THREE.BoxGeometry(.016,.06,.02),metal);tick.position.set(Math.cos(angle)*(1.65-i*.18),Math.sin(angle)*(1.65-i*.18),.08);tick.rotation.z=angle-Math.PI/2;group.add(tick);}
  rings.push(group);
 }
 const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.64,1),metal);world.add(core);
 const edges=new THREE.LineSegments(new THREE.EdgesGeometry(core.geometry),new THREE.LineBasicMaterial({color:0xd8eef9,transparent:true,opacity:.55}));core.add(edges);
 const satellite=new THREE.Mesh(new THREE.SphereGeometry(.095,16,12),accent);world.add(satellite);
 let yaw=.2,pitch=.15,actualYaw=yaw,actualPitch=pitch,spread=0,separated=false,clock=0,last=0,frame=0,visible=true,drag=null,dead=false;
 function resize(){const rect=$('.scene').getBoundingClientRect();if(!rect.width||!rect.height)return;renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.position.z=camera.aspect<.85?9:8;camera.updateProjectionMatrix();wake();}
 function draw(time){frame=0;if(dead)return;const dt=Math.min((time-(last||time))/1000,.05);last=time;const ease=motion?1-Math.exp(-8*(dt||.016)):1;actualYaw+=(yaw-actualYaw)*ease;actualPitch+=(pitch-actualPitch)*ease;spread+=((separated?1:0)-spread)*ease;if(motion&&visible&&!document.hidden){clock+=dt;if(!drag)yaw+=dt*.045;}world.rotation.set(actualPitch,actualYaw,0);rings.forEach((ring,i)=>{ring.scale.setScalar(1+spread*(.17+i*.14));ring.position.y=(i-1)*spread*.55;});core.rotation.set(clock*.09,clock*.12,0);satellite.position.set(Math.cos(clock*.3)*1.9,Math.sin(clock*.3)*1.9,0);const color=new THREE.Color(routes[selected].color);accent.color.lerp(color,ease);accent.emissive.lerp(color,ease);warm.color.lerp(color,ease);renderer.render(scene,camera);if(motion&&visible&&!document.hidden)frame=requestAnimationFrame(draw);}
 wake=()=>{if(!frame&&!dead)frame=requestAnimationFrame(draw);};
 $('#expand').addEventListener('click',()=>{separated=!separated;$('#expand').setAttribute('aria-pressed',String(separated));$('#expand').textContent=separated?'Assemble layers −':'Separate layers +';wake();});
 function reset(){yaw=.2;pitch=.15;separated=false;$('#expand').setAttribute('aria-pressed','false');$('#expand').textContent='Separate layers +';wake();}
 $('#reset').addEventListener('click',reset);
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,yaw,pitch};canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;const rect=canvas.getBoundingClientRect();yaw=drag.yaw+(e.clientX-drag.x)/rect.width*3;pitch=THREE.MathUtils.clamp(drag.pitch+(e.clientY-drag.y)/rect.height*2,-1,1);wake();});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{drag=null;});
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home')reset();if(e.key==='ArrowLeft')yaw-=.2;if(e.key==='ArrowRight')yaw+=.2;if(e.key==='ArrowUp')pitch-=.15;if(e.key==='ArrowDown')pitch+=.15;pitch=THREE.MathUtils.clamp(pitch,-1,1);wake();});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;wake();});observer.observe(canvas);
 addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{last=0;wake();});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();dead=true;cancelAnimationFrame(frame);fallback();});
 resize();renderer.render(scene,camera);$('.scene').classList.add('ready');$('#scene-note').textContent='DRAG TO ROTATE · ARROW KEYS SUPPORTED';wake();
 addEventListener('pagehide',e=>{if(e.persisted)return;dead=true;cancelAnimationFrame(frame);observer.disconnect();scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});renderer.dispose();});
}catch{fallback();}
