// স্টার লেজেন্ড টগল ফাংশন
document.addEventListener('DOMContentLoaded', function() {
    const likeStar = document.getElementById('likeStar');
    const starLegend = document.getElementById('starLegend');
    const closeStarLegend = document.getElementById('closeStarLegend');

    if (likeStar && starLegend) {
        // স্টার বাটনে ক্লিক করলে
        likeStar.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = likeStar.getAttribute('aria-expanded') === 'true';
            likeStar.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                starLegend.removeAttribute('hidden');
                starLegend.setAttribute('aria-hidden', 'false');
            } else {
                starLegend.setAttribute('hidden', 'true');
                starLegend.setAttribute('aria-hidden', 'true');
            }
        });

        // ক্লোজ বাটনে ক্লিক করলে
        if (closeStarLegend) {
            closeStarLegend.addEventListener('click', function(e) {
                e.stopPropagation();
                likeStar.setAttribute('aria-expanded', 'false');
                starLegend.setAttribute('hidden', 'true');
                starLegend.setAttribute('aria-hidden', 'true');
            });
        }

        // বাইরে ক্লিক করলে বন্ধ হওয়ার জন্য
        document.addEventListener('click', function(event) {
            if (!likeStar.contains(event.target) && !starLegend.contains(event.target)) {
                likeStar.setAttribute('aria-expanded', 'false');
                starLegend.setAttribute('hidden', 'true');
                starLegend.setAttribute('aria-hidden', 'true');
            }
        });

        // Esc কী চাপলে বন্ধ হওয়ার জন্য
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                likeStar.setAttribute('aria-expanded', 'false');
                starLegend.setAttribute('hidden', 'true');
                starLegend.setAttribute('aria-hidden', 'true');
            }
        });
    }
});

// script.js — Combined app logic + Active Users widget + Three-dot + Private Messenger
// Updated: added per-post three-dot menu with Edit/Delete (author-only) and realtime edit/delete handling
(function(){
  'use strict';

  // ---------- preserved app logic (improved/responsive tweaks) ----------
  let currentUser = localStorage.getItem("mini_user_name");
  let currentUserId = localStorage.getItem("mini_user_id");
  // ... বাকি কোডগুলি একই থাকবে
})();

// script.js — Combined app logic + Active Users widget + Three-dot + Private Messenger
// Updated: added per-post three-dot menu with Edit/Delete (author-only) and realtime edit/delete handling
(function(){
  'use strict';

  // ---------- preserved app logic (improved/responsive tweaks) ----------
  let currentUser = localStorage.getItem("mini_user_name");
let currentUserId = localStorage.getItem("mini_user_id");
let currentUserAge = localStorage.getItem("mini_user_age");

// ইউজার ইনফো মডাল শো করার ফাংশন
// ইউজার ইনফো মডাল শো করার ফাংশন - আপডেট করা
function showUserInfoModal() {
  const modal = document.getElementById('userInfoModal');
  const mainContent = document.getElementById('mainContent');
  
  // মডাল শো করুন
  modal.style.display = 'flex';
  
  // মূল কন্টেন্ট হাইড করুন
  if (mainContent) {
    mainContent.style.display = 'none';
  }
  
  // বডি থেকে স্ক্রল বার হাইড করুন (ঐচ্ছিক)
  document.body.style.overflow = 'hidden';

  const form = document.getElementById('userInfoForm');
  form.onsubmit = function(e) {
    e.preventDefault();
    
    const userName = document.getElementById('userName').value.trim();
    const userAge = document.getElementById('userAge').value.trim();
    
    if (!userName || !userAge) {
      alert('দয়া করে নাম এবং বয়স উভয়ই প্রদান করুন');
      return;
    }
    
    currentUser = userName;
    currentUserAge = userAge;
    
    // ইউজার আইডি জেনারেট করুন
    const raw = (crypto && crypto.randomUUID) ? crypto.randomUUID() : ('id-' + Date.now() + '-' + Math.random().toString(36).slice(2));
    const suffix = raw.replace(/-/g,'').slice(0,6);
    const cleanName = currentUser.replace(/\s+/g,'').slice(0,12) || 'User';
    currentUserId = `${cleanName}#${suffix}`;
    
    // লোকাল স্টোরেজে সেভ করুন
    localStorage.setItem("mini_user_name", currentUser);
    localStorage.setItem("mini_user_id", currentUserId);
    localStorage.setItem("mini_user_age", currentUserAge);
    
    // মডাল হাইড করুন এবং মূল কন্টেন্ট শো করুন
    modal.style.display = 'none';
    if (mainContent) {
      mainContent.style.display = 'block';
    }
    document.body.style.overflow = 'auto';
    
    // ইউজার ইন্টারফেস আপডেট করুন
    document.getElementById('idBadge').textContent = `You: ${currentUserId}`;
    
    // সকেটে ইউজার প্রেজেন্স জানান
    if (socket && socket.connected) {
      socket.emit('im_here', { 
        userId: currentUserId, 
        userName: currentUser,
        userAge: currentUserAge 
      });
    }
  };
}

// DOM কন্টেন্ট লোড হলে চেক করুন
document.addEventListener('DOMContentLoaded', function() {
  // যদি ইউজার ইনফো না থাকে তবে মডাল শো করুন
  if (!currentUser || !currentUserId || !currentUserAge) {
    showUserInfoModal();
  } else {
    // যদি ইতিমধ্যে ইউজার ইনফো থাকে তবে মূল কন্টেন্ট শো করুন
    const mainContent = document.getElementById('mainContent');
    const modal = document.getElementById('userInfoModal');
    
    if (mainContent) {
      mainContent.style.display = 'block';
    }
    if (modal) {
      modal.style.display = 'none';
    }
    
    document.getElementById('idBadge').textContent = `You: ${currentUserId}`;
  }
});

  // ------------------ Socket.IO connection ------------------
  const socket = io("https://islambook.onrender.com", { transports: ['websocket','polling'] });
  socket.on('connect', () => { console.log('[SOCKET] connected', socket.id); socket.emit('request_sync'); socket.emit('request_messages');
    // announce presence to server
    socket.emit('im_here', { userId: currentUserId, userName: currentUser });
    socket.emit('request_active_users');
    // optional request for contacts (server may respond with 'contacts')
    try{ socket.emit('request_contacts'); }catch(_){ }
  });

  // ------------------ small client-side sets/maps to avoid duplicate UI appends/sends ------------------
  const displayedChatMessageIds = new Set();
  // changed: per-conversation tracking for private messages
  const displayedPrivateMessageIdsByConv = new Map(); // otherUserId -> Set(messageId)
  const pendingPrivateSends = new Map(); // messageId -> timeoutId
  const ACK_TIMEOUT = 8000; // ms

  // ------------------ Active Users widget (NEW) ------------------
  // Elements
  const auToggle = document.getElementById('active-users-toggle');
  const auListPanel = document.getElementById('active-users-list');
  const auUl = document.getElementById('active-users-ul');
  const auTemplate = document.getElementById('au-item-template');
  const auCountEl = document.getElementById('active-users-count');
  const auCloseBtn = document.getElementById('au-list-close');
  const auCopyBtn = document.getElementById('au-copy-list');
  const auRefreshBtn = document.getElementById('au-refresh');

  // Internal state
  const activeUsers = new Map(); // userId -> {userId, userName, lastSeen, socketId}
  function setActiveCount(n){ auCountEl.textContent = String(n || 0); auToggle.setAttribute('aria-expanded', String(Boolean(auListPanel && !auListPanel.hasAttribute('hidden')))); }

  function renderActiveUsers(){
    // clear list
    auUl.innerHTML = '';
    if(activeUsers.size === 0){ const li = document.createElement('li'); li.className = 'au-empty'; li.textContent = 'কেউ অনলাইন নেই'; auUl.appendChild(li); setActiveCount(0); return; }

    // sort by lastSeen desc (most recent first)
    const arr = Array.from(activeUsers.values()).sort((a,b)=> (b.lastSeen||0) - (a.lastSeen||0));
    arr.forEach(u => {
      const node = auTemplate.content.cloneNode(true);
      const li = node.querySelector('.au-item');
      li.dataset.userId = u.userId;
      // Build inner left area with name + ID and a message button to open PM
      const nameEl = li.querySelector('.au-item-name');
      const idEl = li.querySelector('.au-item-id');
      nameEl.textContent = u.userName || 'Anonymous';
      idEl.textContent = u.userId;

      // Remove the default whole-li click copy behavior and replace with:
      // left-click name => copy id (quick), message icon => open private chat
      li.addEventListener('click', async (evt)=> {
        // Prevent double/triple click accidental toggles
        if (evt.detail && evt.detail > 1) return;
        // if clicking the message button (we'll check class), skip copy
        if(evt.target && (evt.target.closest && evt.target.closest('.au-msg-btn'))) return;
        try{ await navigator.clipboard.writeText(u.userId);
          const old = idEl.textContent;
          idEl.textContent = 'Copied!';
          setTimeout(()=> idEl.textContent = old, 900);
        }catch(e){ alert('Copy failed: '+u.userId); }
      });

      // add a small message button on each row to open private messenger directly
      const msgBtn = document.createElement('button');
      msgBtn.type = 'button';
      msgBtn.className = 'au-msg-btn';
      msgBtn.title = `Message ${u.userName || u.userId}`;
      msgBtn.style.border = '0';
      msgBtn.style.background = 'transparent';
      msgBtn.style.cursor = 'pointer';
      msgBtn.style.fontWeight = '800';
      msgBtn.style.color = 'var(--muted)';
      msgBtn.textContent = '✉';
      // click opens private messenger and then conversation
      msgBtn.addEventListener('click', (ev)=>{
        // Prevent accidental double sends
        if (ev.detail && ev.detail > 1) return;
        ev.stopPropagation();
        openPrivateMessenger().then(()=> openConversationWith(u.userId, u.userName||u.userId)).catch(()=>{/*ignore*/});
        // close active-users panel to avoid overlap
        closeAuPanel();
      });

      // append msgBtn to li (on the right)
      li.appendChild(msgBtn);

      auUl.appendChild(li);
    });

    setActiveCount(activeUsers.size);
  }

  function openAuPanel(){ auListPanel.removeAttribute('hidden'); auListPanel.setAttribute('aria-hidden','false'); auToggle.setAttribute('aria-expanded','true'); auListPanel.classList.add('open'); auCloseBtn.focus(); }
  function closeAuPanel(){ auListPanel.setAttribute('hidden',''); auListPanel.setAttribute('aria-hidden','true'); auToggle.setAttribute('aria-expanded','false'); auListPanel.classList.remove('open'); }
  function toggleAuPanel(){ if(auListPanel.hasAttribute('hidden')) openAuPanel(); else closeAuPanel(); }

  // toggle events
  if(auToggle) auToggle.addEventListener('click', (e)=>{ if (e.detail && e.detail > 1) return; e.stopPropagation(); toggleAuPanel(); });
  if(auCloseBtn) auCloseBtn.addEventListener('click', (e)=>{ e.stopPropagation(); closeAuPanel(); });

  // copy list
  auCopyBtn.addEventListener('click', async ()=> {
    if(activeUsers.size===0) return alert('No active users to copy');
    const lines = Array.from(activeUsers.values()).map(u=>`${u.userName||'Anon'} \t ${u.userId}`);
    const payload = lines.join('\n');
    try{ await navigator.clipboard.writeText(payload); auCopyBtn.textContent = 'Copied'; setTimeout(()=> auCopyBtn.textContent = 'কপি', 900); }catch(e){ alert('Copy failed'); }
  });

  // refresh -> request server for active list
  auRefreshBtn.addEventListener('click', ()=>{ if (event && event.detail && event.detail > 1) return; socket.emit('request_active_users'); auRefreshBtn.textContent = '...'; setTimeout(()=> auRefreshBtn.textContent = 'রিফ্রেশ', 800); });

  // close panel when clicking outside
  document.addEventListener('click', (e)=>{ if(auListPanel && !auListPanel.contains(e.target) && auToggle && !auToggle.contains(e.target)){ closeAuPanel(); } });

  // ------------------ presence helpers & socket integration ------------------
  function markUserActive(u){ if(!u || !u.userId) return; const now = Date.now(); const prev = activeUsers.get(u.userId) || {}; activeUsers.set(u.userId, { userId: u.userId, userName: u.userName||u.name||'Anonymous', lastSeen: now, socketId: u.socketId||prev.socketId || null }); }
  function removeUser(userId){ activeUsers.delete(userId); }

  // handle a bulk list from server
  socket.on('active_users', (list)=> {
    try{
      activeUsers.clear();
      (list||[]).forEach(u=> markUserActive(u));
      renderActiveUsers();
    }catch(e){ console.error('[presence] active_users handler err', e); }
  });

  // optional server events (more granular)
  socket.on('user_join', (u)=>{ try{ markUserActive(u); renderActiveUsers(); }catch(e){} });
  socket.on('user_leave', (payload)=>{ try{ const id = (payload && (payload.userId||payload.id)) || payload; if(id) removeUser(id); renderActiveUsers(); }catch(e){} });
  socket.on('presence_update', (u)=>{ try{ markUserActive(u); renderActiveUsers(); }catch(e){} });

  // Fallback: some servers might send 'presence' or 'presence_list'
  socket.on('presence', (p)=>{ try{ if(Array.isArray(p)){ activeUsers.clear(); p.forEach(markUserActive); } else if(p && p.userId){ markUserActive(p); } renderActiveUsers(); }catch(e){} });
  socket.on('presence_list', (arr)=>{ try{ activeUsers.clear(); (arr||[]).forEach(markUserActive); renderActiveUsers(); }catch(e){} });

  // if server sends individual notifications named differently
  socket.on('online', (payload)=>{ try{ if(Array.isArray(payload)){ activeUsers.clear(); payload.forEach(markUserActive); } else markUserActive(payload); renderActiveUsers(); }catch(e){} });

  // heartbeat: periodically re-announce presence so server can keep TTL
  setInterval(()=>{ if(socket && socket.connected){ socket.emit('heartbeat', { userId: currentUserId, userName: currentUser }); } }, 30000);

  // expose a small API so other code can mark local presence (if you switch tabs)
  window.__miniAppPresence = { markLocalActive: ()=>{ markUserActive({ userId: currentUserId, userName: currentUser }); renderActiveUsers(); } };

  // initial UI render
  renderActiveUsers();

  // ------------------ IndexedDB helpers (existing) ------------------
  const DB_NAME = 'mini_social_v1'; const STORE = 'posts'; const MSTORE = 'messages'; let dbPromise = null;
  const DEFAULT_DB_VERSION = 2; // bumped to add messages store

  function openDB(){
    if(dbPromise) return dbPromise;
    dbPromise = new Promise((res, rej) => {
      let triedDelete = false;

      const setupObjectStore = (db) => {
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' });
          store.createIndex('created_at', 'created_at');
          store.createIndex('userId', 'userId');
        }
        if (!db.objectStoreNames.contains(MSTORE)) {
          const m = db.createObjectStore(MSTORE, { keyPath: 'id' });
          m.createIndex('created_at', 'created_at');
          m.createIndex('userId', 'userId');
        }
      };

      const attempt = (version) => {
        const req = indexedDB.open(DB_NAME, version);

        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          try{ setupObjectStore(db); }catch(err){ console.error('[DB] upgrade error', err); }
        };

        req.onsuccess = () => {
          const db = req.result;
          // Close if another tab triggers a versionchange
          db.onversionchange = () => { db.close(); console.warn('[DB] connection closed due to versionchange'); };
          res(db);
        };

        req.onerror = (e) => {
          const err = e.target && e.target.error;
          // If version mismatch happens (requested version < existing), attempt to delete DB and retry.
          if (err && err.name === 'VersionError' && !triedDelete) {
            triedDelete = true;
            console.warn('[DB] VersionError detected — deleting existing DB and retrying (development fallback).');
            const del = indexedDB.deleteDatabase(DB_NAME);
            del.onsuccess = () => { console.warn('[DB] deleted old DB — retrying open'); attempt(version); };
            del.onerror = () => { dbPromise = null; rej(del.error || new Error('Failed to delete DB')); };
            del.onblocked = () => { dbPromise = null; rej(new Error('Delete blocked — close other tabs using the DB')); };
          } else {
            // Reset dbPromise so future calls can try again
            dbPromise = null;
            rej(err || e);
          }
        };
      };

      attempt(DEFAULT_DB_VERSION);
    });
    return dbPromise;
  }

  async function savePostToDB(post){ const db = await openDB(); return new Promise((res, rej) => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(post); tx.oncomplete = ()=> res(); tx.onerror = ()=> rej(tx.error); }); }
  async function existsInDB(postId){ const db = await openDB(); return new Promise((res, rej) => { const tx = db.transaction(STORE,'readonly'); const req = tx.objectStore(STORE).get(postId); req.onsuccess = ()=> res(!!req.result); req.onerror = ()=> rej(req.error); }); }
  async function getAllPostsFromDB(){ const db = await openDB(); return new Promise((res, rej) => { const tx = db.transaction(STORE,'readonly'); const req = tx.objectStore(STORE).getAll(); req.onsuccess = ()=> res(req.result.sort((a,b)=> new Date(b.created_at) - new Date(a.created_at))); req.onerror = ()=> rej(req.error); }); }
  async function updatePostInDB(post){ return savePostToDB(post); }
  async function deletePostFromDB(postId){ const db = await openDB(); return new Promise((res, rej)=>{ const tx = db.transaction(STORE,'readwrite'); tx.objectStore(STORE).delete(postId); tx.oncomplete = ()=> res(); tx.onerror = ()=> rej(tx.error); }); }

  // messages helpers
  async function saveMessageToDB(msg){ const db = await openDB(); return new Promise((res, rej) => { const tx = db.transaction(MSTORE, 'readwrite'); tx.objectStore(MSTORE).put(msg); tx.oncomplete = ()=> res(); tx.onerror = ()=> rej(tx.error); }); }
  async function existsMessageInDB(id){ const db = await openDB(); return new Promise((res, rej) => { const tx = db.transaction(MSTORE,'readonly'); const req = tx.objectStore(MSTORE).get(id); req.onsuccess = ()=> res(!!req.result); req.onerror = ()=> rej(req.error); }); }
  async function getAllMessagesFromDB(){ const db = await openDB(); return new Promise((res, rej) => { const tx = db.transaction(MSTORE,'readonly'); const req = tx.objectStore(MSTORE).getAll(); req.onsuccess = ()=> res(req.result.sort((a,b)=> new Date(a.created_at) - new Date(b.created_at))); req.onerror = ()=> rej(req.error); }); }

  function uid(){ return (crypto && crypto.randomUUID) ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2,9); }
  function timeNow(){ return new Date().toISOString(); }
  function escapeHtml(s){ return (!s? '': String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]))); }

  const input = document.getElementById("imageInput");
const fileName = document.getElementById("fileName");

input.addEventListener("change", () => {
  if (input.files.length > 0) {
    fileName.textContent = input.files[0].name;
  } else {
    fileName.textContent = "কোন ফাইল সিলেক্ট করা হয়নি";
  }
});

  // ---------- Responsive image processing on upload (auto-size per device) ----------
  function chooseTargetSize(){
    const w = Math.max(window.innerWidth || 360, 360);
    if (w >= 1400) return {w:1600,h:1000};
    if (w >= 1000) return {w:1400,h:880};
    if (w >= 700) return {w:1200,h:800};
    return {w:900,h:600};
  }

  function supportsWebP(){
    try{
      const c = document.createElement('canvas');
      return !!(c && c.toDataURL && c.toDataURL('image/webp').indexOf('data:image/webp') === 0);
    }catch(e){return false}
  }

  async function processImageFile(file){
    const target = chooseTargetSize();
    const mimePref = supportsWebP() && file.type !== 'image/png' ? 'image/webp' : (file.type === 'image/png' ? 'image/png' : 'image/jpeg');
    const quality = mimePref === 'image/webp' ? 0.85 : 0.92;
    return new Promise((res, rej) => {
      const img = new Image(); img.onload = () => {
        try{
          const canvas = document.createElement('canvas'); canvas.width = target.w; canvas.height = target.h; const ctx = canvas.getContext('2d');
          if (mimePref === 'image/png') ctx.clearRect(0,0,canvas.width,canvas.height); else { ctx.fillStyle='#000'; ctx.fillRect(0,0,canvas.width,canvas.height); }
          const iw = img.naturalWidth||img.width, ih = img.naturalHeight||img.height;
          const scale = Math.min(target.w/iw, target.h/ih);
          const drawW = Math.round(iw*scale), drawH = Math.round(ih*scale);
          const dx = Math.round((target.w - drawW)/2), dy = Math.round((target.h - drawH)/2);
          ctx.drawImage(img,0,0,iw,ih,dx,dy,drawW,drawH);
          const out = canvas.toDataURL(mimePref, quality);
          res(out);
        }catch(err){ rej(err); }
      };
      img.onerror = (e)=> rej(e);
      const fr = new FileReader(); fr.onload = ()=> img.src = fr.result; fr.onerror = (e)=> rej(e); fr.readAsDataURL(file);
    });
  }

  // ---------- UI: render feed with nicer cards and accessibility ----------
  const feedEl = document.getElementById('feed'); const searchInput = document.getElementById('searchInput'); const searchBtn = document.getElementById('searchBtn'); const clearSearch = document.getElementById('clearSearch'); const searchInfo = document.getElementById('searchInfo');

  function renderComments(container, comments){
    container.innerHTML = '';
    if(!comments || comments.length === 0){
      container.innerHTML = "<div style='opacity:0.75'>কোনো কমেন্ট নেই</div>";
      return;
    }
    comments.forEach(c=>{
      const div = document.createElement('div');
      div.className = 'comment-item';
      div.innerHTML = `<strong>${escapeHtml(c.userName||'Anon')}:</strong> ${escapeHtml(c.text)}`;
      container.appendChild(div);
    });
  }

  // ---------- UPDATED createPostElement: shows comment-count beside the comment toggle + post menu ----------
  function createPostElement(post){
    const el = document.createElement('article'); el.className='post'; el.id='post-'+post.id; el.setAttribute('tabindex','0');
    // mark dataset for scoping the menu styles
    el.dataset.postId = post.id; el.dataset.authorId = post.userId || '';

    // header (meta left + post-menu right)
    const header = document.createElement('div'); header.className='post-header';
    const meta = document.createElement('div'); meta.className='meta';
    const left = document.createElement('div'); left.className='user-meta'; left.innerHTML = `<strong>${escapeHtml(post.userName||'Anonymous')}</strong>` + (post.userId? ` <small style="color:var(--muted)">${escapeHtml(post.userId)}</small>`:'');
    const right = document.createElement('div'); right.className='post-time'; right.textContent = new Date(post.created_at).toLocaleString();
    meta.appendChild(left); meta.appendChild(right);

    // post actions container (menu)
    const actionWrap = document.createElement('div'); actionWrap.className = 'post-actions';

    // per-post menu button
    const menuBtn = document.createElement('button'); menuBtn.className='post-menu-btn'; menuBtn.type='button'; menuBtn.title='Options'; menuBtn.setAttribute('aria-haspopup','true'); menuBtn.setAttribute('aria-expanded','false'); menuBtn.textContent = '⋯';

    // menu panel
    const menuPanel = document.createElement('div'); menuPanel.className = 'post-menu'; menuPanel.setAttribute('hidden','');
    // Edit button (only if author)
    const editBtn = document.createElement('button'); editBtn.type='button'; editBtn.className='post-menu-item'; editBtn.dataset.action='edit'; editBtn.textContent = 'পোস্ট এডিট করুন';
    // Delete button
    const deleteBtn = document.createElement('button'); deleteBtn.type='button'; deleteBtn.className='post-menu-item'; deleteBtn.dataset.action='delete'; deleteBtn.textContent = 'পোস্ট ডিলিট করুন'; deleteBtn.style.color='#ff6b6b';

    // If current user is not author, disable these actions
    const isAuthor = (String(post.userId) === String(currentUserId));
    if(!isAuthor){ editBtn.disabled = true; editBtn.style.opacity = '0.5'; deleteBtn.disabled = true; deleteBtn.style.opacity='0.5'; }

    menuPanel.appendChild(editBtn); menuPanel.appendChild(deleteBtn);

    // wire menu toggle
    menuBtn.addEventListener('click', (ev)=>{ ev.stopPropagation(); const hidden = menuPanel.hasAttribute('hidden'); if(hidden){ menuPanel.removeAttribute('hidden'); menuBtn.setAttribute('aria-expanded','true'); } else { menuPanel.setAttribute('hidden',''); menuBtn.setAttribute('aria-expanded','false'); } });
    // close on outside click
    document.addEventListener('click', (evt)=>{ if(menuPanel && !menuPanel.contains(evt.target) && !menuBtn.contains(evt.target)){ menuPanel.setAttribute('hidden',''); menuBtn.setAttribute('aria-expanded','false'); } });

    actionWrap.appendChild(menuBtn); actionWrap.appendChild(menuPanel);

    header.appendChild(meta); header.appendChild(actionWrap);

    const frame = document.createElement('div'); frame.className='img-frame aspect-16-10';
    const img = document.createElement('img'); img.className='post-img'; img.alt = post.caption || ''; img.loading='lazy'; img.decoding='async'; img.src = post.imageData; img.draggable=false; img.setAttribute('aria-label','Open image viewer');
    img.addEventListener('click', ()=> openLightbox(post.imageData, post.caption));
    frame.appendChild(img);

    const caption = document.createElement('div'); caption.className='caption post-caption'; caption.textContent = post.caption || '';

    const actions = document.createElement('div'); actions.className='actions';
const likeBtn = document.createElement('button'); 
likeBtn.className = 'lb-small-btn like-btn'; 
likeBtn.innerHTML = `🤍 <span class="like-count">${(post.likes||[]).length}</span>`; 
likeBtn.setAttribute('aria-pressed', 'false'); // এই লাইন যোগ করুন
likeBtn.onclick = ()=> toggleLike(post.id, likeBtn);
    // Comment toggle button now includes a comment-count span
    const commentToggle = document.createElement('button'); commentToggle.className='lb-small-btn';
    const commentCount = (post.comments || []).length;
    commentToggle.innerHTML = `💬 <span class="comment-count">${commentCount}</span>`;
    commentToggle.title='Show comments';

    actions.appendChild(likeBtn); actions.appendChild(commentToggle);

    // comment list + form
    const commentsWrap = document.createElement('div'); commentsWrap.className='comments';
    const commentsList = document.createElement('div'); commentsList.className='comments-list';
    renderComments(commentsList, post.comments||[]);
    commentsWrap.appendChild(commentsList);

    const commentForm = document.createElement('form'); commentForm.className='comment-form'; commentForm.style.display='none'; commentsWrap.style.display='none';
    const commentInput = document.createElement('input'); commentInput.type='text'; commentInput.placeholder='কমেন্ট লিখুন...'; commentInput.setAttribute('aria-label','Write a comment');
    const commentSubmit = document.createElement('button'); commentSubmit.type='submit'; commentSubmit.textContent='Send';
    commentForm.appendChild(commentInput); commentForm.appendChild(commentSubmit);

    commentForm.addEventListener('submit', (ev)=>{
      ev.preventDefault(); const text = commentInput.value.trim(); if(!text) return; commentSubmit.disabled = true;
      postComment(post.id, text).then(()=> {
        // quick local increment for immediate UI feedback; DB/socket will bring canonical state soon
        const span = commentToggle.querySelector('.comment-count');
        if(span) span.textContent = (parseInt(span.textContent||'0',10) + 1);
      }).finally(()=> { commentInput.value=''; setTimeout(()=> commentSubmit.disabled = false, 300); });
    });

    commentToggle.addEventListener('click', ()=>{ if (event && event.detail && event.detail > 1) return;
      const isHidden = commentsWrap.style.display === 'none';
      commentsWrap.style.display = isHidden ? 'flex' : 'none';
      commentForm.style.display = isHidden ? 'flex' : 'none';
      commentToggle.title = isHidden ? 'Hide comments' : 'Show comments';
      // if opening, ensure comments are up-to-date (socket will update when new comments arrive)
      if(isHidden){ renderComments(commentsList, post.comments||[]); }
    });

    // Inline edit form (hidden by default)
    const editForm = document.createElement('form'); editForm.className='post-edit-form'; editForm.setAttribute('hidden','');
    const editTextarea = document.createElement('textarea'); editTextarea.className='edit-caption'; editTextarea.value = post.caption || '';
    const editControls = document.createElement('div'); editControls.className='edit-controls';
    const cancelBtn = document.createElement('button'); cancelBtn.type='button'; cancelBtn.className='edit-cancel'; cancelBtn.textContent='বাতিল';
    const saveBtn = document.createElement('button'); saveBtn.type='button'; saveBtn.className='edit-save'; saveBtn.textContent='সেভ';
    editControls.appendChild(cancelBtn); editControls.appendChild(saveBtn);
    editForm.appendChild(editTextarea); editForm.appendChild(editControls);

    // Edit button behavior (only if author)
    editBtn.addEventListener('click', async (ev)=>{
      ev.stopPropagation(); if(!isAuthor) return;
      // toggle edit form visibility
      const hidden = editForm.hasAttribute('hidden');
      if(hidden){ editForm.removeAttribute('hidden'); editTextarea.focus(); menuPanel.setAttribute('hidden',''); menuBtn.setAttribute('aria-expanded','false'); }
      else { editForm.setAttribute('hidden',''); }
    });

    cancelBtn.addEventListener('click', (ev)=>{ ev.preventDefault(); ev.stopPropagation(); editForm.setAttribute('hidden',''); });

    // ক্লায়েন্ট সাইডে saveBtn event handler-এ পরিবর্তন
saveBtn.addEventListener('click', async (ev)=>{
  ev.preventDefault(); 
  ev.stopPropagation(); 
  if(!isAuthor) return alert('You are not the author');
  
  const newCaption = editTextarea.value.trim();
  
  try {
    const db = await openDB(); 
    const tx = db.transaction(STORE,'readwrite'); 
    const req = tx.objectStore(STORE).get(post.id);
    
    req.onsuccess = async ()=>{
      const existing = req.result || post;
      existing.caption = newCaption;
      
      // update DB and UI
      await updatePostInDB(existing);
      refreshPostInDOM(post.id, existing);
      
      // পুরো পোস্ট অবজেক্ট সহ এডিট ইভেন্ট পাঠান
      socket.emit('edit_post', {
        postId: post.id,
        caption: newCaption,
        // অন্যান্য প্রয়োজনীয় ফিল্ডস
        userId: currentUserId,
        userName: currentUser,
        imageData: existing.imageData,
        likes: existing.likes,
        comments: existing.comments,
        created_at: existing.created_at
      });
      
      editForm.setAttribute('hidden','');
      await updateTotalsFromDB();
    };
    
    req.onerror = (e)=>{ 
      console.error('edit save failed', e); 
      alert('Save failed'); 
    };
  } catch(e){ 
    console.error('edit flow failed', e); 
    alert('Edit failed'); 
  }
});

    // Delete behavior (only if author)
    deleteBtn.addEventListener('click', async (ev)=>{
      ev.stopPropagation(); if(!isAuthor) return; if(!confirm('আপনি কি নিশ্চিত যে এই পোস্টটি ডিলিট করতে চান?')) return;
      try{
        await deletePostFromDB(post.id);
        const elToRemove = document.getElementById('post-'+post.id);
        if(elToRemove) elToRemove.remove();
        try{ socket.emit('delete_post', { postId: post.id, userId: currentUserId }); }catch(_){ }
        try{ socket.emit('post_delete', { postId: post.id, userId: currentUserId }); }catch(_){ }
        await updateTotalsFromDB();
      }catch(e){ console.error('delete failed', e); alert('Delete failed'); }
    });

    // assemble
    el.appendChild(header);
    el.appendChild(frame);
    el.appendChild(caption);
    el.appendChild(editForm);
    el.appendChild(actions);
    el.appendChild(commentsWrap);
    el.appendChild(commentForm);

    return el;
  }

  function prependPostToFeed(post){ const existing = document.getElementById('post-'+post.id); if(existing) existing.remove(); const el = createPostElement(post); feedEl.insertAdjacentElement('afterbegin', el); }
  function refreshPostInDOM(postId, post){ const container = document.getElementById('post-'+postId); if(!container) return; const newEl = createPostElement(post); container.replaceWith(newEl); }

  async function loadAndRenderFeed(filter=null, opts={partial:true,profile:false}){ const posts = await getAllPostsFromDB(); let shown = posts; if(filter){ const q = filter.toLowerCase(); if(opts.partial) shown = posts.filter(p=>((p.userId||'').toLowerCase().includes(q) || (p.userName||'').toLowerCase().includes(q))); else shown = posts.filter(p=>((p.userId||'').toLowerCase()===q || (p.userName||'').toLowerCase()===q)); searchInfo.style.display='block'; searchInfo.innerHTML = opts.profile? `Profile: <strong>${escapeHtml(filter)}</strong> — ${shown.length} post(s)` : `Search: <strong>${escapeHtml(filter)}</strong> — ${shown.length} result(s)`; } else { searchInfo.style.display='none'; searchInfo.textContent=''; }
    feedEl.innerHTML=''; if(shown.length===0){ feedEl.innerHTML=`<div style="padding:20px;color:var(--muted)">No posts found${filter? ' for '+escapeHtml(filter):''}.</div>`; return; } shown.forEach(p=>feedEl.appendChild(createPostElement(p))); }

  window.clearAndShowAll = async function(){ searchInput.value=''; await loadAndRenderFeed(); };

  // ---------- Star color update logic ----------
  const starColors = [
      { likes: 25, color: '#C0C0C0', class: 'like-star-silver' },
      { likes: 50, color: '#D4AF37', class: 'like-star-gold' },
      { likes: 75, color: '#40E0D0', class: 'like-star-turquoise' },
      { likes: 100, color: '#FF007F', class: 'like-star-rose' },
      { likes: 125, color: '#8A2BE2', class: 'like-star-purple' },
      { likes: 150, color: '#87CEEB', class: 'like-star-sky' },
      { likes: 175, color: '#FFA500', class: 'like-star-orange' },
      { likes: 200, color: '#50C878', class: 'like-star-emerald' }
  ];

  function updateStarColor(totalLikes) {
      const likeStarBtn = document.getElementById('likeStar');
      if (!likeStarBtn) return;
      likeStarBtn.classList.remove('like-star-silver', 'like-star-gold', 'like-star-turquoise', 
                                 'like-star-rose', 'like-star-purple', 'like-star-sky', 
                                 'like-star-orange', 'like-star-emerald');
      let selectedColorClass = 'like-star-silver';
      for (let i = starColors.length - 1; i >= 0; i--) {
          if (totalLikes >= starColors[i].likes) {
              selectedColorClass = starColors[i].class;
              break;
          }
      }
      likeStarBtn.classList.add(selectedColorClass);
  }

  // ---------- Totals logic: compute total posts and total likes (only count likes on current user's posts) ----------
  function countLikesForPost(p){
    if(Array.isArray(p.likes)) return p.likes.length;
    if(typeof p.likes === 'number') return Number(p.likes) || 0;
    if(p.likes && typeof p.likes === 'object' && p.likes.count) return Number(p.likes.count) || 0;
    return 0;
  }

  async function computeTotals(){
    try{
      const posts = await getAllPostsFromDB();
      const totalPosts = posts.length || 0;

      // Count ONLY likes that belong to posts created by the current user
      let totalLikesForMyPosts = 0;
      for(const p of posts){
        if(p.userId === currentUserId){
          totalLikesForMyPosts += countLikesForPost(p);
        }
      }

      return { totalPosts, totalLikesForMyPosts };
    }catch(e){
      console.error('[totals] compute failed', e);
      return { totalPosts:0, totalLikesForMyPosts:0 };
    }
  }

  async function updateTotalsFromDB(){
    const totalsBar = document.getElementById('totalsBar');
    const totalLikesEl = document.getElementById('totalLikes');
    const totalPostsEl = document.getElementById('totalPosts');
    const likesBlock = document.querySelector('.total-likes');
    if(!totalLikesEl || !totalPostsEl) return;

    const { totalPosts, totalLikesForMyPosts } = await computeTotals();

    totalPostsEl.textContent = String(totalPosts);
    totalLikesEl.textContent = String(totalLikesForMyPosts);
    totalLikesEl.title = 'আপনার পোস্টগুলোর মোট লাইক';

    updateStarColor(totalLikesForMyPosts);

    const threshold = totalsBar && totalsBar.dataset && parseInt(totalsBar.dataset.likesThreshold, 10) ? parseInt(totalsBar.dataset.likesThreshold, 10) : 20;
    if(likesBlock){
      if(totalLikesForMyPosts >= threshold) likesBlock.classList.add('golden'); 
      else likesBlock.classList.remove('golden');
    }
  }

  // ---------- Socket handlers (keep existing emit/listen) ----------
  socket.on('sync', async (posts)=>{ for(const p of posts||[]){ try{ if(!(await existsInDB(p.id))) await savePostToDB(p); }catch(e){} } await loadAndRenderFeed(); await updateTotalsFromDB(); });
  socket.on('post', async (post)=>{ if(!post) return; if(await existsInDB(post.id)) return; await savePostToDB(post); prependPostToFeed(post); await updateTotalsFromDB(); });
  socket.on('like', async (payload)=>{ try{ const db = await openDB(); const tx = db.transaction(STORE,'readwrite'); const store = tx.objectStore(STORE); const req = store.get(payload.postId); req.onsuccess = async ()=>{ const post = req.result; if(!post) return; post.likes = post.likes||[]; if(payload.action==='like'){ if(!post.likes.find(l=>l.id===payload.likeId||l.userId===payload.userId)) post.likes.push({id:payload.likeId,userId:payload.userId,userName:payload.userName||null,created_at:payload.created_at}); } else { post.likes = post.likes.filter(l=>l.id!==payload.likeId&&l.userId!==payload.userId); } await updatePostInDB(post); refreshPostInDOM(post.id,post); await updateTotalsFromDB(); }; }catch(e){console.error(e);} });
  socket.on('comment', async (payload)=>{ try{ const db = await openDB(); const tx = db.transaction(STORE,'readwrite'); const store = tx.objectStore(STORE); const req = store.get(payload.postId); req.onsuccess = async ()=>{ const post = req.result; if(!post) return; post.comments = post.comments||[]; if(!post.comments.find(c=>c.id===payload.comment.id)){ post.comments.unshift(payload.comment); await updatePostInDB(post); refreshPostInDOM(post.id,post); } }; await updateTotalsFromDB(); }catch(e){console.error(e);} });

  // Handle post edits from server — update DB + UI
  socket.on('post_edited', async (payload)=>{
    try{
      const post = payload && payload.id ? payload : (payload && payload.post ? payload.post : null);
      if(!post || !post.id) return;
      await savePostToDB(post);
      refreshPostInDOM(post.id, post);
      await updateTotalsFromDB();
    }catch(e){ console.error('[post_edited] handler error', e); }
  });
  // alternative event names
  socket.on('post_updated', async (post)=>{ try{ if(!post || !post.id) return; await savePostToDB(post); refreshPostInDOM(post.id, post); await updateTotalsFromDB(); }catch(e){console.error(e);} });

  // Handle post deletions from server
  socket.on('post_deleted', async (payload)=>{ try{ const postId = (payload && (payload.postId || payload.id)) || payload; if(!postId) return; await deletePostFromDB(postId); const el = document.getElementById('post-'+postId); if(el) el.remove(); await updateTotalsFromDB(); }catch(e){console.error('[post_deleted] handler', e);} });
  socket.on('post_delete', async (payload)=>{ try{ const postId = (payload && (payload.postId || payload.id)) || payload; if(!postId) return; await deletePostFromDB(postId); const el = document.getElementById('post-'+postId); if(el) el.remove(); await updateTotalsFromDB(); }catch(e){console.error('[post_delete] handler', e);} });

  // NEW: respond to server's request to announce local posts (metadata only)
  socket.on('please_announce_posts', async ()=> {
    try{
      const posts = await getAllPostsFromDB();
      const metaList = posts.map(p=>({ id: p.id, created_at: p.created_at, userId: p.userId, userName: p.userName, meta: { size: (p.imageData && p.imageData.length) || 0, caption: p.caption || '' }, hasBlob: !!p.imageData }));
      socket.emit('announce_posts', metaList);
    }catch(e){ console.error('[announce_posts] failed', e); }
  });

  // NEW: if server asks this client to upload specific posts (ids), send full posts
  socket.on('request_upload_posts', async (ids)=> {
    try{
      if(!Array.isArray(ids) || ids.length===0) return;
      for(const id of ids){
        try{
          const db = await openDB();
          const tx = db.transaction(STORE,'readonly');
          const req = tx.objectStore(STORE).get(id);
          req.onsuccess = ()=>{
            const post = req.result;
            if(post){
              try{ socket.emit('upload_full_post', post); }catch(_){ }
              try{ socket.emit('new_post', post); }catch(_){ }
            }
          };
        }catch(e){ console.error('[request_upload_posts] per-id error', e); }
      }
    }catch(e){ console.error('[request_upload_posts] failed', e); }
  });

  // NEW: server tells this client which server-posts the client is missing
  socket.on('sync_needed', async (ids)=> {
    try{
      if(!Array.isArray(ids) || ids.length===0) return;
      socket.emit('request_posts_by_id', ids);
    }catch(e){ console.error('[sync_needed] failed', e); }
  });

  // NEW: server bulk-sends posts requested by this client
  socket.on('bulk_posts', async (posts)=> {
    try{
      if(!Array.isArray(posts) || posts.length===0) return;
      for(const p of posts){
        try{ if(!(await existsInDB(p.id))) await savePostToDB(p); }catch(e){}
        prependPostToFeed(p);
      }
    }catch(e){ console.error('[bulk_posts] handler failed', e); }
  });

  // messages socket handlers
  socket.on('messages_sync', async (messages)=>{ // optional server support
    for(const m of messages||[]){ try{ if(!(await existsMessageInDB(m.id))) await saveMessageToDB(m); }catch(e){} }
    if(chatPanelOpen) loadAndRenderMessages();
    if(privateMessengerOpen) await renderPMContacts();
  });

  socket.on('message', async (msg)=>{ // single new message from server (global chat)
    try{
      if(!msg || !msg.id) return;
      if (msg.toId) { return; }
      if(!(await existsMessageInDB(msg.id))){
        await saveMessageToDB(msg);
        if(chatPanelOpen) appendMessageToUI(msg); else incrementUnreadBadge();
      } else {
        if(!displayedChatMessageIds.has(msg.id)){
          if(chatPanelOpen) appendMessageToUI(msg); else incrementUnreadBadge();
        }
      }
    }catch(e){ console.error(e); }
  });

  // ---------- Upload handler (uses processImageFile) ----------
  document.getElementById('uploadBtn').addEventListener('click', async (e)=>{
    e.preventDefault(); 
    const fileInput = document.getElementById('imageInput'); 
    const caption = document.getElementById('caption').value.trim(); 
    const file = fileInput.files && fileInput.files[0]; 
    
    // ফাইলের নাম মুছে দিন
    document.getElementById('fileName').textContent = 'কোন ফাইল সিলেক্ট করা হয়নি';
    
    if(!file) return alert('Choose an image first'); 
    if(file.size > 20*1024*1024 && !confirm('Image is large (>20MB). Continue?')) return;
    
    let processedDataUrl; 
    try{ 
        processedDataUrl = await processImageFile(file); 
    }catch(err){ 
        console.error('processing failed',err); 
        processedDataUrl = await new Promise((res,rej)=>{ 
            const fr = new FileReader(); 
            fr.onload = ()=> res(fr.result); 
            fr.onerror = rej; 
            fr.readAsDataURL(file); 
        }); 
    }
    
    const post = { 
        id:uid(), 
        userId:currentUserId, 
        userName:currentUser, 
        caption, 
        imageData:processedDataUrl, 
        created_at:timeNow(), 
        likes:[], 
        comments:[] 
    };
    
    await savePostToDB(post); 
    prependPostToFeed(post);
    
    try{ 
        socket.emit('upload_full_post', post); 
    }catch(e){}
    
    try{ 
        socket.emit('new_post', post); 
    }catch(e){}
    
    fileInput.value=''; 
    document.getElementById('caption').value=''; 
});

  // like/comment helpers (same as before)
async function toggleLike(postId, btnEl){ 
    const userId=currentUserId; 
    const userName=currentUser; 
    const likeId=uid(); 
    const db=await openDB(); 
    const tx=db.transaction(STORE,'readwrite'); 
    const store = tx.objectStore(STORE); 
    const req = store.get(postId); 
    req.onsuccess = async ()=>{ 
        const post = req.result; 
        if(!post) return; 
        post.likes = post.likes||[]; 
        const existing = post.likes.find(l=>l.userId===userId); 
        const payload = { postId, userId, userName, likeId, action:'like', created_at:timeNow() }; 
        if(existing){ 
            payload.action='unlike'; 
            payload.likeId = existing.id; 
            post.likes = post.likes.filter(l=>l.userId!==userId); 
            btnEl.classList.remove('liked'); 
            btnEl.setAttribute('aria-pressed', 'false'); // এই লাইন যোগ করুন
        } else { 
            post.likes.push({id:likeId,userId,userName,created_at:payload.created_at}); 
            btnEl.classList.add('liked'); 
            btnEl.setAttribute('aria-pressed', 'true'); // এই লাইন যোগ করুন
        } 
        const countEl = btnEl.querySelector('.like-count'); 
        if(countEl) countEl.textContent = post.likes.length; 
        await updatePostInDB(post); 
        socket.emit('like', payload); 
    }; 
    req.onerror = (e)=> console.error(e); 
}  async function postComment(postId,text){ const comment = { id:uid(), userId:currentUserId, userName:currentUser, text, created_at:timeNow() }; const payload = { postId, comment }; const db = await openDB(); const tx = db.transaction(STORE,'readwrite'); const store = tx.objectStore(STORE); const req = store.get(postId); req.onsuccess = async ()=>{ const post = req.result; if(!post) return; post.comments = post.comments||[]; post.comments.unshift(comment); await updatePostInDB(post); refreshPostInDOM(postId,post); socket.emit('comment', payload); }; req.onerror = (e)=> console.error(e); }

  // ---------- Lightbox: zoom/pan/touch (improved UX) ----------
  const lbOverlay = document.getElementById('lightboxOverlay'); const lbInner = document.querySelector('.lightbox-inner'); const lbCanvas = document.querySelector('.lightbox-canvas'); const lbImgEl = document.getElementById('lbImg'); const lbCaptionEl = document.getElementById('lbCaption'); const btnIn = document.getElementById('zoomIn'); const btnOut = document.getElementById('zoomOut'); const btnReset = document.getElementById('resetZoom'); const btnClose = document.getElementById('closeLBox');

  let viewer = { scale:1, min:1, max:4, x:0, y:0, dragging:false };
  function openLightbox(src, caption){ lbImgEl.src = src; lbImgEl.alt = caption||''; lbCaptionEl.textContent = caption||''; viewer.scale = 1; viewer.x=0; viewer.y=0; lbImgEl.style.transform = 'translate(0px,0px) scale(1)'; lbOverlay.classList.add('open'); lbOverlay.setAttribute('aria-hidden','false'); btnClose.focus(); document.body.classList.add('lightbox-open'); }
  function closeLightbox(){ lbOverlay.classList.remove('open'); lbOverlay.setAttribute('aria-hidden','true'); setTimeout(()=> lbImgEl.src='', 300); document.body.classList.remove('lightbox-open'); }
  btnClose.addEventListener('click', closeLightbox);

  function applyViewer(){ lbImgEl.style.transform = `translate(${viewer.x}px, ${viewer.y}px) scale(${viewer.scale})`; }
  function zoomTo(newScale, cx, cy){ const rect = lbImgEl.getBoundingClientRect(); const imgX = (cx - viewer.x) / viewer.scale; const imgY = (cy - viewer.y) / viewer.scale; viewer.x = cx - imgX * newScale; viewer.y = cy - imgY * newScale; viewer.scale = Math.max(viewer.min, Math.min(viewer.max, newScale)); applyViewer(); }
  function zoomBy(factor){ const rect = lbImgEl.getBoundingClientRect(); zoomTo(viewer.scale * factor, rect.width/2, rect.height/2); }
  btnIn.addEventListener('click', ()=> zoomBy(1.25)); btnOut.addEventListener('click', ()=> zoomBy(0.8)); btnReset.addEventListener('click', ()=>{ viewer.scale=1; viewer.x=0; viewer.y=0; applyViewer(); });

  // pointer pan
  let pDown=false, pId=null, lastX=0, lastY=0;
  lbImgEl.addEventListener('pointerdown',(e)=>{ lbImgEl.setPointerCapture(e.pointerId); pDown=true; pId=e.pointerId; lastX=e.clientX; lastY=e.clientY; viewer.dragging=true; });
  lbImgEl.addEventListener('pointermove',(e)=>{ if(!pDown||e.pointerId!==pId) return; const dx = e.clientX - lastX; const dy = e.clientY - lastY; lastX=e.clientX; lastY=e.clientY; if(viewer.scale>1.01){ viewer.x += dx; viewer.y += dy; applyViewer(); } });
  lbImgEl.addEventListener('pointerup',(e)=>{ pDown=false; viewer.dragging=false; try{ lbImgEl.releasePointerCapture(e.pointerId);}catch(_){} }); lbImgEl.addEventListener('pointercancel',()=>{ pDown=false; viewer.dragging=false; });

  // double tap / dblclick
  lbImgEl.addEventListener('dblclick',(e)=>{ const rect=lbImgEl.getBoundingClientRect(); const cx=e.clientX-rect.left; const cy=e.clientY-rect.top; if(viewer.scale<=1.05) zoomTo(2.5,cx,cy); else { viewer.scale=1; viewer.x=0; viewer.y=0; applyViewer(); } });

  // wheel to zoom
  lbImgEl.addEventListener('wheel',(e)=>{ if(!lbOverlay.classList.contains('open')) return; e.preventDefault(); const dir = e.deltaY < 0 ? 1.12 : 0.88; const rect=lbImgEl.getBoundingClientRect(); const cx=e.clientX-rect.left; const cy=e.clientY-rect.top; zoomTo(viewer.scale * dir, cx, cy); }, { passive:false });

  // pinch handlers
  let pinchState={active:false, startDist:0, startScale:1, midX:0, midY:0};
  lbImgEl.addEventListener('touchstart',(e)=>{ if(e.touches.length===2){ e.preventDefault(); pinchState.active=true; pinchState.startDist=distanceBetween(e.touches[0], e.touches[1]); pinchState.startScale=viewer.scale; const rect=lbImgEl.getBoundingClientRect(); pinchState.midX = (e.touches[0].clientX + e.touches[1].clientX)/2 - rect.left; pinchState.midY = (e.touches[0].clientY + e.touches[1].clientY)/2 - rect.top; } }, {passive:false});
  lbImgEl.addEventListener('touchmove',(e)=>{ if(pinchState.active && e.touches.length===2){ e.preventDefault(); const dist = distanceBetween(e.touches[0], e.touches[1]); const factor = dist / pinchState.startDist; const target = Math.max(viewer.min, Math.min(viewer.max, pinchState.startScale * factor)); zoomTo(target, pinchState.midX, pinchState.midY); } }, {passive:false});
  lbImgEl.addEventListener('touchend',(e)=>{ if(pinchState.active && e.touches.length<2) pinchState.active=false; });
  function distanceBetween(a,b){ return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); }

  // keyboard navigation for accessibility
  window.addEventListener('keydown',(e)=>{ if(!lbOverlay.classList.contains('open')) return; if(e.key==='Escape') closeLightbox(); if(e.key==='ArrowUp'){ viewer.y += 20; applyViewer(); } if(e.key==='ArrowDown'){ viewer.y -= 20; applyViewer(); } if(e.key==='ArrowLeft'){ viewer.x += 20; applyViewer(); } if(e.key==='ArrowRight'){ viewer.x -=20; applyViewer(); } });

  // ---------- Search handlers ----------
  searchBtn.addEventListener('click', async ()=>{ await loadAndRenderFeed(searchInput.value.trim()); });
  searchInput.addEventListener('keydown',(e)=>{ if(e.key==='Enter'){ e.preventDefault(); loadAndRenderFeed(searchInput.value.trim()); } });

  // ---------- Global chat logic ----------
  const chatToggleBtn = document.getElementById('chatToggleBtn');
  const chatPanel = document.getElementById('chatPanel');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatMessagesEl = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatUnread = document.getElementById('chatUnread');

  let chatPanelOpen = false;
  let unreadCount = 0;

  function showUnreadBadge(){ if(unreadCount>0){ chatUnread.style.display='flex'; chatUnread.textContent = unreadCount>99? '99+' : String(unreadCount); } else chatUnread.style.display='none'; }
  function incrementUnreadBadge(){ unreadCount++; showUnreadBadge(); }

  chatToggleBtn.addEventListener('click', async (e)=>{
    if (e.detail && e.detail > 1) return; // ignore double clicks
    chatPanelOpen = !chatPanelOpen;
    chatPanel.style.display = chatPanelOpen ? 'flex' : 'none';
    if(chatPanelOpen){
      unreadCount = 0; showUnreadBadge();
      displayedChatMessageIds.clear();
      await loadAndRenderMessages();
      chatInput.focus();
    }
  });
  chatCloseBtn.addEventListener('click', ()=>{ chatPanelOpen = false; chatPanel.style.display='none'; });

  chatSendBtn.addEventListener('click', ()=>{ const txt = chatInput.value.trim(); if(!txt) return; sendMessage(txt); chatInput.value=''; });
  chatInput.addEventListener('keydown',(e)=>{ if(e.key==='Enter'){ e.preventDefault(); chatSendBtn.click(); } });

  async function sendMessage(text){
    const msg = { id: uid(), userId: currentUserId, userName: currentUser, text, created_at: timeNow() };
    try{
      await saveMessageToDB(msg);
      appendMessageToUI(msg);
      socket.emit('message', msg);
    }catch(e){ console.error('message save failed', e); alert('Message failed to send locally.'); }
  }

  function appendMessageToUI(msg){
    if(!msg || !msg.id) return;
    if(displayedChatMessageIds.has(msg.id)) return;
    displayedChatMessageIds.add(msg.id);

    const div = document.createElement('div');
    div.className = 'chat-msg';
    const when = new Date(msg.created_at).toLocaleTimeString();
    div.innerHTML = `<strong>${escapeHtml(msg.userName||'Anon')}</strong><div>${escapeHtml(msg.text)}</div><div style="font-size:11px;color:var(--muted);margin-top:6px">${when}</div>`;
    chatMessagesEl.appendChild(div);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  async function loadAndRenderMessages(){
    chatMessagesEl.innerHTML = '';
    try{
      const msgs = await getAllMessagesFromDB();
      const groupMessages = msgs.filter(m => !m.toId);
      groupMessages.forEach(m=>{ appendMessageToUI(m); });
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }catch(e){ console.error('load messages failed', e); chatMessagesEl.innerHTML = "<div style='opacity:0.75'>Unable to load messages</div>"; }
  }

  function handleIncomingMessage(msg){
    if(chatPanelOpen){
      appendMessageToUI(msg);
    } else {
      incrementUnreadBadge();
    }
  }

  async function loadAndRenderMessagesIfOpen(){
    if(chatPanelOpen) await loadAndRenderMessages();
  }

  

  // ---------- PRIVATE MESSENGER: three-dot + panel integration ----------
  const threeDotToggle = document.getElementById('threeDotToggle');
  const threeDotDropdown = document.getElementById('threeDotDropdown');
  const openPrivateBtn = document.getElementById('open-private-messenger');
  const openGroupBtn = document.getElementById('open-group-messages');
  const privateMessengerPanel = document.getElementById('privateMessengerPanel');
  const pmUserList = document.getElementById('pm-user-list');
  const pmUserTemplate = document.getElementById('pm-user-template');
  const pmChatArea = document.getElementById('pm-chat-area');
  const pmChatMessages = document.getElementById('pm-chat-messages');
  const pmChatForm = document.getElementById('pm-chat-form');
  const pmChatInput = document.getElementById('pmChatInput');
  const pmSendBtn = document.getElementById('pmSendBtn');
  const pmCloseBtn = document.getElementById('pmCloseBtn');
  const pmBackBtn = document.getElementById('pm-back-to-list');
  const pmRefreshBtn = document.getElementById('pmRefresh');

  let privateMessengerOpen = false;
  let selectedPMUserId = null;
  let selectedPMUserName = null;

  // Dropdown toggle
  if(threeDotToggle){
    threeDotToggle.addEventListener('click', (e)=>{
      if (e.detail && e.detail > 1) return;
      e.stopPropagation();
      const isHidden = threeDotDropdown && threeDotDropdown.hasAttribute('hidden');
      if(threeDotDropdown){
        if(isHidden){ threeDotDropdown.removeAttribute('hidden'); threeDotToggle.setAttribute('aria-expanded','true'); threeDotDropdown.querySelector('button')?.focus(); }
        else { threeDotDropdown.setAttribute('hidden',''); threeDotToggle.setAttribute('aria-expanded','false'); }
      }
    });
    document.addEventListener('click', (e)=>{ if(threeDotDropdown && !threeDotDropdown.contains(e.target) && !threeDotToggle.contains(e.target)){ threeDotDropdown.setAttribute('hidden',''); threeDotToggle.setAttribute('aria-expanded','false'); } });
  }

  // Open private messenger
  if(openPrivateBtn){
    openPrivateBtn.addEventListener('click', async (e)=>{
      if (e.detail && e.detail > 1) return;
      e.stopPropagation();
      try{ openPrivateMessenger(); }catch(err){ console.error(err); }
      if(threeDotDropdown) { threeDotDropdown.setAttribute('hidden',''); threeDotToggle.setAttribute('aria-expanded','false'); }
    });
  }
  if(openGroupBtn){
    openGroupBtn.addEventListener('click',(e)=>{ if (e.detail && e.detail > 1) return; e.stopPropagation(); alert('Group messages already available via global chat button.'); if(threeDotDropdown){ threeDotDropdown.setAttribute('hidden',''); threeDotToggle.setAttribute('aria-expanded','false'); } });
  }

  async function openPrivateMessenger(){
    privateMessengerPanel.removeAttribute('hidden'); privateMessengerPanel.setAttribute('aria-hidden','false'); privateMessengerPanel.classList.add('open'); privateMessengerOpen = true;
    document.body.classList.add('pm-open');
    await renderPMContacts();
    const first = pmUserList.querySelector('button');
    if(first) first.focus();
  }
  function closePrivateMessenger(){
    privateMessengerPanel.setAttribute('hidden',''); privateMessengerPanel.setAttribute('aria-hidden','true'); privateMessengerPanel.classList.remove('open'); privateMessengerOpen = false;
    document.body.classList.remove('pm-open');
    selectedPMUserId = null; selectedPMUserName = null;
    pmChatArea.setAttribute('hidden','');
  }
  if(pmCloseBtn) pmCloseBtn.addEventListener('click', ()=> closePrivateMessenger());
  if(pmBackBtn) pmBackBtn.addEventListener('click', ()=> { selectedPMUserId = null; selectedPMUserName = null; pmChatArea.setAttribute('hidden',''); pmUserList.querySelector('button')?.focus(); });
  if(pmRefreshBtn) pmRefreshBtn.addEventListener('click', async ()=> { pmRefreshBtn.textContent = '...'; await renderPMContacts(); setTimeout(()=> pmRefreshBtn.textContent = '↻', 700); });

  async function gatherContacts(){
    const contacts = new Map();
    for(const [id,u] of activeUsers.entries()){
      if(id === currentUserId) continue;
      contacts.set(id, { userId:id, userName:u.userName||id, lastSeen: u.lastSeen || Date.now(), unread: 0 });
    }
    try{
      const msgs = await getAllMessagesFromDB();
      msgs.forEach(m=>{
        const from = m.fromId || m.userId || null;
        const to = m.toId || m.to || null;
        if(from && to){
          const partner = (from === currentUserId) ? to : (to === currentUserId ? from : null);
          if(partner && partner !== currentUserId){
            const existing = contacts.get(partner) || { userId:partner, userName: m.fromName||m.toName||partner, lastSeen:0, unread:0 };
            existing.lastSeen = Math.max(existing.lastSeen || 0, new Date(m.created_at).getTime());
            contacts.set(partner, existing);
          }
        } else {
          if(m.userId && m.userId !== currentUserId){
            const existing = contacts.get(m.userId) || { userId:m.userId, userName: m.userName||m.userId, lastSeen:0, unread:0 };
            existing.lastSeen = Math.max(existing.lastSeen || 0, new Date(m.created_at).getTime());
            contacts.set(m.userId, existing);
          }
        }
      });
    }catch(e){ console.warn('gatherContacts failed', e); }

    try{
      const msgs = await getAllMessagesFromDB();
      msgs.forEach(m=>{
        const from = m.fromId || m.userId || null;
        const to = m.toId || m.to || null;
        if(to === currentUserId && from && contacts.has(from)){
          const c = contacts.get(from); c.unread = (c.unread||0) + 1; contacts.set(from, c);
        }
      });
    }catch(e){}

    const arr = Array.from(contacts.values()).sort((a,b)=> (b.lastSeen||0) - (a.lastSeen||0));
    return arr;
  }

  async function renderPMContacts(){
    pmUserList.innerHTML = '';
    const contacts = await gatherContacts();
    if(contacts.length===0){ const li = document.createElement('li'); li.className = 'pm-empty'; li.textContent = 'কোনো যোগাযোগ নেই'; pmUserList.appendChild(li); return; }
    contacts.forEach(c=>{
      const node = pmUserTemplate.content.cloneNode(true);
      const li = node.querySelector('.pm-user-item');
      const btn = node.querySelector('.pm-user-btn');
      btn.dataset.userId = c.userId;
      const nameEl = node.querySelector('.pm-user-name');
      const idSpan = node.querySelector('.pm-user-id');
      nameEl.textContent = c.userName || c.userId;
      if(idSpan) idSpan.textContent = c.userId;
      if(c.unread && c.unread>0){
        const span = document.createElement('span');
        span.className = 'pm-unread-badge';
        span.textContent = c.unread>99 ? '99+' : String(c.unread);
        span.style.marginLeft='8px';
        span.style.fontSize='12px';
        span.style.background='var(--c3)';
        span.style.color='#fff';
        span.style.padding='2px 6px';
        span.style.borderRadius='999px';
        btn.appendChild(span);
      }
      btn.addEventListener('click', async (e)=>{ 
        if (e.detail && e.detail > 1) return; e.stopPropagation(); const uid = btn.dataset.userId; await openConversationWith(uid, c.userName||uid); 
      });
      pmUserList.appendChild(li);
    });
  }

  async function loadConversationFromDB(otherId){
    pmChatMessages.innerHTML = '';
    displayedPrivateMessageIdsByConv.set(otherId, new Set());
    const msgs = await getAllMessagesFromDB();
    const convo = msgs.filter(m=>{
      const from = m.fromId || m.userId || null;
      const to = m.toId || m.to || null;
      if(from && to) return (from === currentUserId && to === otherId) || (from === otherId && to === currentUserId);
      if(m.userId && m.userId === currentUserId && (m.toId === otherId || m.to === otherId)) return true;
      if(m.userId && m.userId === otherId && (m.toId === currentUserId || m.to === currentUserId)) return true;
      return false;
    });
    convo.forEach(m => { appendPrivateMessageToUI(m, otherId); });
    pmChatMessages.scrollTop = pmChatMessages.scrollHeight;
  }

  function appendPrivateMessageToUI(msg, otherId){
    if(!msg || !msg.id) return;
    let convSet = displayedPrivateMessageIdsByConv.get(otherId);
    if(!convSet){ convSet = new Set(); displayedPrivateMessageIdsByConv.set(otherId, convSet); }
    if(convSet.has(msg.id)) return; convSet.add(msg.id);
    const from = msg.fromId || msg.userId || null;
    const to = msg.toId || msg.to || null;
    if(!(from === currentUserId || to === currentUserId || from === otherId || to === otherId)) return;
    const div = document.createElement('div');
    const isSent = (msg.fromId === currentUserId) || (msg.userId === currentUserId && (!msg.toId || msg.toId));
    div.className = 'pm-msg' + (isSent ? ' sent' : '');
    const when = new Date(msg.created_at).toLocaleString();
    const meta = `<span style="font-weight:800">${escapeHtml(msg.fromName||msg.userName|| (isSent ? 'You' : 'Them'))}</span>`;
    div.innerHTML = `${escapeHtml(msg.text)}<div class="pm-meta">${meta} • <small style="color:var(--muted)">${when}</small></div>`;
    pmChatMessages.appendChild(div);
  }

  async function openConversationWith(otherId, otherName){
    selectedPMUserId = otherId;
    selectedPMUserName = otherName || otherId;
    pmChatArea.removeAttribute('hidden');
    const chatWithNameEl = document.getElementById('pm-chat-with-name');
    if(chatWithNameEl) chatWithNameEl.textContent = selectedPMUserName;
    await loadConversationFromDB(otherId);
    const btn = Array.from(pmUserList.querySelectorAll('button')).find(b=> b.dataset.userId === otherId);
    if(btn){ const badge = btn.querySelector('.pm-unread-badge'); if(badge) badge.remove(); }
    pmChatInput.focus();
  }

  pmChatForm.addEventListener('submit', async (e)=>{
    e.preventDefault(); if(pmChatForm.classList.contains('sending')) return; const text = (pmChatInput.value||'').trim(); if(!text || !selectedPMUserId) return; await sendPrivateMessageTo(selectedPMUserId, text); pmChatInput.value='';
  });

  async function sendPrivateMessageTo(otherId, text){
    const msg = { id: uid(), fromId: currentUserId, fromName: currentUser, toId: otherId, toName: null, text, created_at: timeNow() };
    try{
      await saveMessageToDB(msg);
      if(selectedPMUserId === otherId) appendPrivateMessageToUI(msg, otherId);
      pmChatForm.classList.add('sending'); pmSendBtn.disabled = true; pmChatInput.disabled = true;
      const t = setTimeout(()=>{ pendingPrivateSends.delete(msg.id); pmChatForm.classList.remove('sending'); pmSendBtn.disabled = false; pmChatInput.disabled = false; console.warn('[PM] ack timeout for', msg.id); }, ACK_TIMEOUT);
      pendingPrivateSends.set(msg.id, t);
      try{
        socket.emit('private_message', msg, (ack)=>{
          const timeoutId = pendingPrivateSends.get(msg.id); if(timeoutId) clearTimeout(timeoutId); pendingPrivateSends.delete(msg.id); pmChatForm.classList.remove('sending'); pmSendBtn.disabled = false; pmChatInput.disabled = false; if(ack && ack.ok) {} else { console.warn('[PM] server ack returned falsy for', msg.id, ack); }
        });
      }catch(e){ const timeoutId = pendingPrivateSends.get(msg.id); if(timeoutId) clearTimeout(timeoutId); pendingPrivateSends.delete(msg.id); pmChatForm.classList.remove('sending'); pmSendBtn.disabled = false; pmChatInput.disabled = false; console.error('[PM] emit failed', e); }

    }catch(e){ console.error('private send failed', e); alert('Failed to send private message'); pmChatForm.classList.remove('sending'); pmSendBtn.disabled = false; pmChatInput.disabled = false; }
  }

  socket.on('private_message', async (msg)=> {
    try{
      if(!msg || !msg.id) return;
      if(!(msg.toId === currentUserId || msg.fromId === currentUserId)) return;
      const alreadyExists = await existsMessageInDB(msg.id);
      if(!alreadyExists){ await saveMessageToDB(msg); }
      const isRelevantToOpenConversation = privateMessengerOpen && selectedPMUserId && (msg.fromId === selectedPMUserId || msg.toId === selectedPMUserId);
      if(isRelevantToOpenConversation){ appendPrivateMessageToUI(msg, selectedPMUserId); pmChatMessages.scrollTop = pmChatMessages.scrollHeight; } else {
        const partnerId = (msg.fromId === currentUserId) ? msg.toId : msg.fromId;
        const btn = Array.from(pmUserList.querySelectorAll('button')).find(b=> b.dataset.userId === partnerId);
        if(btn){ let badge = btn.querySelector('.pm-unread-badge'); if(badge){ const v = parseInt(badge.textContent||'0',10) || 0; badge.textContent = v+1; } else { badge = document.createElement('span'); badge.className = 'pm-unread-badge'; badge.textContent = '1'; badge.style.marginLeft='8px'; badge.style.fontSize='12px'; badge.style.background='var(--c3)'; badge.style.color='#fff'; badge.style.padding='2px 6px'; badge.style.borderRadius='999px'; btn.appendChild(badge); } }
      }
      if(privateMessengerOpen) await renderPMContacts();
    }catch(e){ console.error('[private_message] handler error', e); }
  });

  socket.on('contacts', async (list) => {
    try{
      if(!Array.isArray(list)) return;
      list.forEach(c=>{ if(c && c.userId && c.userId !== currentUserId){ markUserActive({ userId: c.userId, userName: c.userName || c.name, socketId: c.socketId || null }); } });
      renderActiveUsers();
      if(privateMessengerOpen) await renderPMContacts();
    }catch(e){ console.error('contacts handler', e); }
  });

  // close messenger on outside click (defensive)
  document.addEventListener('click', (e)=> {
    if(privateMessengerOpen && privateMessengerPanel && !privateMessengerPanel.contains(e.target) && !threeDotToggle.contains(e.target) && !openPrivateBtn.contains(e.target)){
      // keep open to avoid accidental closures
    }
  });

  // ---------- Initial load ----------
  (async ()=>{ await openDB(); await loadAndRenderFeed(); try{ const msgs = await getAllMessagesFromDB(); unreadCount = 0; showUnreadBadge(); }catch(e){ console.warn('messages preload failed', e); } })();

})();



