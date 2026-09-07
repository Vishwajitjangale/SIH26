/* BIS Intelligence — shared multi-page interactions.
   Kept separate from the original homepage script so existing
   homepage behavior remains intact. */
(function () {
  'use strict';

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function initActiveNav() {
    var current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (current === 'compliance.html') current = 'compliance-assistant.html';
    document.querySelectorAll('.nav-pill[href]').forEach(function (link) {
      var href = (link.getAttribute('href') || '').split('?')[0].split('#')[0].toLowerCase();
      var active = href === current;
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function initButtons() {
    document.querySelectorAll('[data-link]').forEach(function (el) {
      el.addEventListener('click', function () { window.location.href = el.getAttribute('data-link'); });
    });
  }

  var standards = [
    {number:'IS 302 (Part 1):2008', title:'Safety of Household and Similar Electrical Appliances', category:'Electrical appliances', status:'Active', desc:'General safety requirements for household and similar electrical appliances.', related:'IS 302 Part 2 series', keywords:'electrical appliance heater iron mixer household'},
    {number:'IS 456:2000', title:'Plain and Reinforced Concrete — Code of Practice', category:'Cement & construction', status:'Active', desc:'Code of practice covering plain and reinforced concrete construction.', related:'IS 10262, IS 383', keywords:'cement concrete construction'},
    {number:'IS 1786:2008', title:'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement', category:'Steel products', status:'Active', desc:'Requirements for high-strength deformed steel bars and wires used for reinforcement.', related:'IS 432, IS 2502', keywords:'steel bars reinforcement tmt'},
    {number:'IS 9845:1998', title:'Determination of Overall Migration of Constituents of Plastics to Foodstuffs', category:'Food packaging', status:'Active', desc:'Method for determining overall migration from plastics intended for contact with food.', related:'IS 10146', keywords:'food packaging plastic food contact'},
    {number:'IS 10500:2012', title:'Drinking Water — Specification', category:'Water', status:'Active', desc:'Specification for drinking water quality parameters and limits.', related:'IS 3025 series', keywords:'drinking water potable water'},
    {number:'IS 9873 (Part 1):2012', title:'Safety of Toys — Safety Aspects Related to Mechanical and Physical Properties', category:'Toys', status:'Revised', desc:'Safety requirements for toys covering mechanical and physical hazards.', related:'IS 9873 series', keywords:'toys children safety'},
    {number:'IS 2925:1984', title:'Industrial Safety Helmets', category:'Personal protective equipment', status:'Active', desc:'Requirements for industrial safety helmets and associated performance tests.', related:'IS 4770', keywords:'helmet safety head protection'}
  ];

  var labs = [
    {name:'BIS Recognized Laboratory — Electrical Testing', city:'Pune', state:'Maharashtra', status:'Recognition details required from live BIS directory', standards:'IS 302 series', tests:'Electrical safety, insulation, leakage, endurance', distance:'Nearby', type:'Electrical'},
    {name:'BIS Recognized Laboratory — Materials Testing', city:'Mumbai', state:'Maharashtra', status:'Recognition details required from live BIS directory', standards:'IS 456, IS 1786', tests:'Concrete, steel, strength and dimensional tests', distance:'—', type:'Materials'},
    {name:'BIS Recognized Laboratory — Food Contact Testing', city:'Ahmedabad', state:'Gujarat', status:'Recognition details required from live BIS directory', standards:'IS 9845', tests:'Migration and food-contact material tests', distance:'—', type:'Food contact'}
  ];

  function standardCard(s) {
    return '<article class="result-card page-card hoverable" data-search="'+esc((s.number+' '+s.title+' '+s.category+' '+s.keywords).toLowerCase())+'">' +
      '<div class="flex-between"><div><div class="std-number">'+esc(s.number)+'</div><h3>'+esc(s.title)+'</h3></div><span class="tag tag-hi">'+esc(s.status)+'</span></div>' +
      '<div class="result-meta"><span class="tag tag-neutral">'+esc(s.category)+'</span><span class="tag tag-primary">Evidence-linked</span></div>' +
      '<p>'+esc(s.desc)+'</p><div class="meta-row"><div class="meta-cell"><div class="k">Related</div><div class="v">'+esc(s.related)+'</div></div><div class="meta-cell"><div class="k">Source</div><div class="v">Official BIS</div></div></div>' +
      '<div class="page-actions"><a class="btn btn-secondary btn-sm" href="evidence.html?is='+encodeURIComponent(s.number)+'">View Evidence</a><a class="btn btn-primary btn-sm" href="compliance-assistant.html?standard='+encodeURIComponent(s.number)+'">Check Compliance</a></div></article>';
  }

  function initFindPage() {
    var form = document.getElementById('standardsSearchForm');
    if (!form) return;
    var input = document.getElementById('standardsSearch');
    var category = document.getElementById('standardsCategory');
    var grid = document.getElementById('standardsResults');
    var count = document.getElementById('standardsCount');
    var empty = document.getElementById('standardsEmpty');
    function render() {
      var q=(input.value||'').trim().toLowerCase(), c=(category.value||'').toLowerCase();
      var matches=standards.filter(function(s){ return (!q || (s.number+' '+s.title+' '+s.category+' '+s.keywords).toLowerCase().indexOf(q)>-1) && (!c || s.category.toLowerCase()===c); });
      grid.innerHTML=matches.map(standardCard).join('');
      count.textContent=matches.length+' standard'+(matches.length===1?'':'s')+' found';
      empty.hidden=matches.length>0;
    }
    form.addEventListener('submit',function(e){e.preventDefault();render();});
    document.querySelectorAll('[data-standard-query]').forEach(function(chip){chip.addEventListener('click',function(){input.value=chip.dataset.standardQuery;render();});});
    render();
  }

  function initCompliancePage() {
    var form=document.getElementById('complianceFormNew'); if(!form) return;
    var result=document.getElementById('complianceDashboard');
    var scoreEl=document.getElementById('scoreValue');
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var product=(document.getElementById('productName').value||'Product').trim();
      var desc=(document.getElementById('productDescription').value||'').toLowerCase();
      var match=/electrical|appliance|heater|mixer|iron/.test(desc+' '+product.toLowerCase()) ? standards[0] : (/steel|tmt/.test(desc+' '+product.toLowerCase()) ? standards[2] : standards[3]);
      var score=/electrical|steel|plastic|food/.test(desc+' '+product.toLowerCase())?78:61;
      scoreEl.textContent=score+'%';
      result.innerHTML='<div class="analysis-grid"><div><span class="tag tag-hi">High-confidence demo match</span><h3>'+esc(match.number)+' — '+esc(match.title)+'</h3><p>Potentially applicable based on the product information supplied. Verify the latest official BIS applicability before making a certification decision.</p><div class="analysis-list"><div><b>Certification required</b><span>Depends on product and applicable scheme</span></div><div><b>Certification type</b><span>Product-specific BIS conformity pathway</span></div><div><b>Testing</b><span>Review the applicable standard test methods</span></div><div><b>Documents</b><span>Technical, manufacturing and business records</span></div><div><b>Laboratory</b><span>Select a suitable recognized laboratory</span></div></div></div><div class="score-panel"><div class="score-ring"><span>'+score+'%</span></div><div class="score-caption">Compliance Score</div><p>Demo score based on completeness of the supplied product information.</p></div></div>';
      document.getElementById('analysisSection').scrollIntoView({behavior:'smooth'});
    });
  }

  function initEvidencePage() {
    var input=document.getElementById('evidenceSearch'); if(!input) return;
    var cards=[].slice.call(document.querySelectorAll('.evidence-card'));
    function filter(){var q=input.value.toLowerCase().trim();cards.forEach(function(c){c.hidden=q && c.innerText.toLowerCase().indexOf(q)===-1;});document.getElementById('evidenceEmpty').hidden=cards.some(function(c){return !c.hidden;});}
    input.addEventListener('input',filter);
    document.querySelectorAll('[data-evidence]').forEach(function(btn){btn.addEventListener('click',function(){openEvidence(btn.dataset.evidence);});});
    document.querySelectorAll('[data-close-modal]').forEach(function(b){b.addEventListener('click',closeEvidence);});
    document.getElementById('evidenceModal').addEventListener('click',function(e){if(e.target===this)closeEvidence();});
    function openEvidence(id){var data=document.getElementById(id);if(!data)return;document.getElementById('modalBody').innerHTML=data.innerHTML;document.getElementById('evidenceModal').classList.add('open');document.body.classList.add('modal-open');}
    function closeEvidence(){document.getElementById('evidenceModal').classList.remove('open');document.body.classList.remove('modal-open');}
  }

  function initLabsPage() {
    var form=document.getElementById('labSearchForm'); if(!form)return;
    var grid=document.getElementById('labResults'), empty=document.getElementById('labEmpty');
    function render(){var q=(document.getElementById('labSearch').value||'').toLowerCase(), state=(document.getElementById('labState').value||'').toLowerCase(), type=(document.getElementById('labType').value||'').toLowerCase();var m=labs.filter(function(l){return (!q || (l.name+' '+l.city+' '+l.state+' '+l.standards+' '+l.tests).toLowerCase().indexOf(q)>-1)&&(!state||l.state.toLowerCase()===state)&&(!type||l.type.toLowerCase()===type);});grid.innerHTML=m.map(function(l){return '<article class="lab-card page-card hoverable"><div class="flex-between"><div><h3>'+esc(l.name)+'</h3><p>'+esc(l.city)+', '+esc(l.state)+'</p></div><span class="tag tag-primary">Directory check</span></div><div class="result-meta"><span class="tag tag-neutral">'+esc(l.standards)+'</span><span class="tag tag-neutral">'+esc(l.type)+'</span></div><div class="lab-lines"><p><b>Tests:</b> '+esc(l.tests)+'</p><p><b>Status:</b> '+esc(l.status)+'</p><p><b>Distance:</b> '+esc(l.distance)+'</p></div><div class="page-actions"><button class="btn btn-secondary btn-sm" type="button">View Details</button><button class="btn btn-primary btn-sm" type="button">Select Laboratory</button></div></article>';}).join('');empty.hidden=m.length>0;}
    form.addEventListener('submit',function(e){e.preventDefault();render();}); render();
  }

  function initFaqPage(){
    var input=document.getElementById('faqSearch');if(!input)return;
    var items=[].slice.call(document.querySelectorAll('.faq-item'));
    function filter(){var q=input.value.toLowerCase().trim();items.forEach(function(i){i.hidden=q && i.innerText.toLowerCase().indexOf(q)===-1;});}
    input.addEventListener('input',filter);
    document.querySelectorAll('.faq-category').forEach(function(btn){btn.addEventListener('click',function(){document.querySelectorAll('.faq-category').forEach(function(x){x.classList.remove('active');});btn.classList.add('active');var cat=btn.dataset.category;items.forEach(function(i){i.hidden=cat!=='all'&&i.dataset.category!==cat;});input.value='';});});
  }

  document.addEventListener('DOMContentLoaded',function(){initActiveNav();initButtons();initFindPage();initCompliancePage();initEvidencePage();initLabsPage();initFaqPage();});
})();
