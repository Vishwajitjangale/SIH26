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
    if (!input || !grid) return;

    var API = window.BIS_API_BASE || 'http://127.0.0.1:8000';

    function liveCard(s) {
      var number = s.standard || 'Unspecified standard';
      var title = s.title || 'Untitled standard';
      var cat = s.category || 'General';
      var status = s.status || 'Unknown';
      var verification = s.verified ? 'Verified' : 'Unverified';
      var score = s.match_score != null ? '<span class="tag tag-neutral">'+esc(s.match_score)+'% match</span>' : '';
      var source = s.source_url || 'https://www.bis.gov.in/';
      return '<article class="result-card page-card hoverable">' +
        '<div class="flex-between"><div><div class="std-number">'+esc(number)+'</div><h3>'+esc(title)+'</h3></div><span class="tag tag-hi">'+esc(status)+'</span></div>' +
        '<div class="result-meta"><span class="tag tag-neutral">'+esc(cat)+'</span><span class="tag tag-primary">'+esc(verification)+'</span>'+score+'</div>' +
        '<div class="meta-row"><div class="meta-cell"><div class="k">Version</div><div class="v">'+esc(s.version || '—')+'</div></div><div class="meta-cell"><div class="k">Category</div><div class="v">'+esc(cat)+'</div></div><div class="meta-cell"><div class="k">Status</div><div class="v">'+esc(status)+'</div></div><div class="meta-cell"><div class="k">Source</div><div class="v">Official BIS</div></div></div>' +
        '<div class="page-actions"><a class="btn btn-secondary btn-sm" href="'+esc(source)+'" target="_blank" rel="noopener noreferrer">View BIS Source</a><a class="btn btn-primary btn-sm" href="compliance.html?q='+encodeURIComponent(number+' '+title)+'">Check Compliance</a></div>' +
        '</article>';
    }

    function renderLoading() {
      grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;padding:30px;">Searching the indexed BIS standards library…</div>';
      if (empty) empty.hidden = true;
    }

    function render(matches, q, label) {
      grid.innerHTML = matches.map(liveCard).join('');
      if (count) count.innerHTML = matches.length+' standard'+(matches.length===1?'':'s')+' found' + (q ? ' for <strong>'+esc(q)+'</strong>' : '') + (label ? ' <span class="tag tag-neutral" style="margin-left:8px;">'+esc(label)+'</span>' : '');
      if (empty) empty.hidden = matches.length > 0;
    }

    async function runSearch() {
      var q = (input.value || '').trim();
      renderLoading();
      var params = new URLSearchParams();
      if (q) params.set('q', q);
      if (category && category.value) params.set('category', category.value);
      try {
        var response = await fetch(API + '/api/standards?' + params.toString(), {headers:{Accept:'application/json'}});
        if (!response.ok) throw new Error('HTTP '+response.status);
        var data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid response');
        render(data, q, 'Live backend');
      } catch (err) {
        console.warn('Live BIS search unavailable; showing local demo index.', err);
        var fallback = standards.filter(function(s) {
          var hay = (s.number+' '+s.title+' '+s.category+' '+s.keywords).toLowerCase();
          var ql = q.toLowerCase();
          var c = category ? category.value.toLowerCase() : '';
          return (!ql || hay.indexOf(ql) > -1) && (!c || s.category.toLowerCase() === c);
        });
        render(fallback.map(function(s){ return {standard:s.number,title:s.title,category:s.category,status:s.status,version:'Demo',verified:false,source_url:'https://www.bis.gov.in/'}; }), q, 'Demo fallback');
      }
    }

    form.addEventListener('submit', function(e){ e.preventDefault(); runSearch(); });
    if (category) category.addEventListener('change', runSearch);
    document.querySelectorAll('[data-standard-query]').forEach(function(chip){
      chip.addEventListener('click', function(){ input.value = chip.dataset.standardQuery || ''; runSearch(); });
    });
    runSearch();
  }

  function initCompliancePage() {
    var form = document.getElementById('complianceFormNew');
    if (!form) return;

    var result = document.getElementById('complianceDashboard');
    if (!result) return;

    var API = window.BIS_API_BASE || 'http://127.0.0.1:8000';

    function showLoading() {
      result.innerHTML = '<div class="empty-state" style="background:transparent;padding:32px;text-align:center"><h3>Searching BIS sources…</h3><p>Checking the live BIS web evidence and your local knowledge base. This may take a few seconds.</p></div>';
    }

    function linkHtml(source) {
      if (!source || !source.url) return '';
      return '<li><a href="' + esc(source.url) + '" target="_blank" rel="noopener noreferrer">' + esc(source.title || source.url) + '</a></li>';
    }

    function renderAnswer(data) {
      var answer = data.answer || 'No answer was returned.';
      var confidence = data.confidence_label || 'LOW';
      var webSources = Array.isArray(data.web_sources) ? data.web_sources : [];
      var localSources = Array.isArray(data.sources) ? data.sources : [];
      var standards = Array.isArray(data.standards) ? data.standards : [];

      var sourceHtml = '';
      if (webSources.length) {
        sourceHtml += '<div class="analysis-list" style="margin-top:18px"><div><b>Live BIS web sources</b><span><ul style="margin:8px 0 0 18px">' + webSources.map(linkHtml).join('') + '</ul></span></div></div>';
      }
      if (localSources.length) {
        sourceHtml += '<div class="analysis-list" style="margin-top:12px"><div><b>Local evidence</b><span>' + localSources.map(function(s){ return esc(s.title || s.standard || 'BIS evidence'); }).join(', ') + '</span></div></div>';
      }

      var standardsHtml = standards.length
        ? '<div class="analysis-list" style="margin-top:12px"><div><b>Potentially applicable standards</b><span>' + standards.map(function(s){ return '<b>' + esc(s.is_number || '') + '</b> — ' + esc(s.title || '') + ' (' + esc(s.status || 'Unknown') + ')'; }).join('<br>') + '</span></div></div>'
        : '';

      var statusClass = data.status === 'grounded' ? 'tag-hi' : 'tag-warn';
      var searchTag = data.web_search ? '<span class="tag tag-primary">Live web search</span>' : '<span class="tag tag-neutral">Web search not configured</span>';

      result.innerHTML =
        '<div class="analysis-grid">' +
          '<div>' +
            '<div class="result-meta"><span class="tag ' + statusClass + '">' + esc(data.status === 'grounded' ? 'Evidence-grounded answer' : 'Insufficient BIS evidence') + '</span>' + searchTag + '<span class="tag tag-neutral">Confidence: ' + esc(confidence) + '</span></div>' +
            '<h3 style="margin-top:16px">Compliance analysis</h3>' +
            '<div class="answer-body" style="white-space:pre-wrap;line-height:1.7">' + esc(answer) + '</div>' +
            standardsHtml +
            sourceHtml +
          '</div>' +
          '<div class="score-panel"><div class="score-ring"><span>' + esc(data.confidence != null ? Math.round(Number(data.confidence) * 100) + '%' : '—') + '</span></div><div class="score-caption">Evidence confidence</div><p>Confidence reflects the retrieved evidence. Always verify the latest official BIS requirements.</p></div>' +
        '</div>';
    }

    async function runCompliance() {
      var product = (document.getElementById('productName').value || '').trim();
      var category = (document.getElementById('productCategory').value || '').trim();
      var description = (document.getElementById('productDescription').value || '').trim();
      var manufacturer = (document.getElementById('manufacturerType').value || '').trim();
      var market = (document.getElementById('market').value || '').trim();
      var location = (document.getElementById('location').value || '').trim();
      var existing = (document.getElementById('existingStandard').value || '').trim();

      if (!product || !description) return;

      var question = [
        'Product name: ' + product,
        'Product category: ' + category,
        'Product description: ' + description,
        'Manufacturer type: ' + manufacturer,
        'Intended market: ' + market,
        'Country/location: ' + location,
        existing ? 'Existing IS number: ' + existing : '',
        '',
        'Find the applicable BIS/Indian Standards and explain whether BIS certification or another mandatory requirement applies. Include relevant testing and documentation requirements only when supported by authoritative BIS evidence. Search the live internet for current official BIS information and provide source links.'
      ].filter(Boolean).join('\n');

      showLoading();
      document.getElementById('analysisSection').scrollIntoView({behavior:'smooth'});

      try {
        var response = await fetch(API + '/api/ask', {
          method: 'POST',
          headers: {'Content-Type':'application/json', 'Accept':'application/json'},
          body: JSON.stringify({question: question, language: 'en'})
        });

        var raw = await response.text();
        var data;
        try { data = JSON.parse(raw); } catch (_) { data = null; }
        if (!response.ok) {
          throw new Error((data && (data.detail || data.answer)) || ('Backend returned HTTP ' + response.status));
        }
        renderAnswer(data);
      } catch (err) {
        console.error('Compliance analysis failed:', err);
        result.innerHTML = '<div class="empty-state" style="padding:32px"><h3>Could not get a live compliance answer</h3><p>' + esc(err.message || 'Could not connect to the BIS Intelligence backend.') + '</p><p style="margin-top:10px">Make sure the FastAPI server is running at ' + esc(API) + ' and that NVIDIA_API_KEY and TAVILY_API_KEY are configured in backend/.env.</p></div>';
      }
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      runCompliance();
    });

    // Support links from Find Standards / homepage that pass ?q=...
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || params.get('standard') || '';
    if (q) {
      var nameEl = document.getElementById('productName');
      var descEl = document.getElementById('productDescription');
      if (nameEl && !nameEl.value) nameEl.value = q;
      if (descEl && !descEl.value) descEl.value = 'Please determine the current BIS requirements for ' + q + '.';
    }
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
