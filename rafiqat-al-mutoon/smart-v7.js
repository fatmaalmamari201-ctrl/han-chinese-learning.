/* بطاقة الحضور الذكية — رفيقة المتون v7. لا تُفترض صفحات مجهولة. */
(function(){
'use strict';
var STORE='rafiqah-page-maps-v7',SET='rafiqah-wizard-v7';
var P={};try{P=JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(e){}
var v={edition:'1441',newTopic:'athkar-1',from:'1',to:'2',revA:'athkar-1',revB:'athkar-17'};
try{Object.assign(v,JSON.parse(localStorage.getItem(SET)||'{}')||{})}catch(e){}
var ED={'1441':['التمهيدي — الأذكار والآداب (1441هـ)','https://d1.islamhouse.com/data/ar/ih_books/single_010/ar-2807403-pp-athkaar.pdf'],
'current':['الأذكار والآداب — نسخة الحفظ الحالية','https://files.a-alqasim.com/books/mutoon/0101Athkaar.pdf'],
'short':['مختصر الأذكار والآداب (1445هـ)','https://d1.islamhouse.com/data/ar/ih_books/single_010/ar-0102mukhtasaralathkaar.pdf']};
var KNOWN={'1441':{'athkar-1':[[11,11],[11,11],[11,12]]}};
function esc(s){return escapeHTML(String(s==null?'':s))}
function num(s){var n=Number(s);return Number.isInteger(n)&&n>0&&n<2001?n:null}
function inc(a,b){a=num(a);b=num(b);return a&&b&&b>=a?[a,b,b-a+1]:null}
function k(){return Array.prototype.join.call(arguments,'|')}
function read(book){return (MATN_INDEX[book]||[]).flatMap(function(c){return c.items||[]})}
function item(book,id){return read(book).find(function(x){return x.id===id})}
function first(book,id){return item(book,id)?id:(read(book)[0]?.id||'')}
function persist(){try{localStorage.setItem(STORE,JSON.stringify(P));localStorage.setItem(SET,JSON.stringify(v))}catch(e){}}
function mapped(book,topic,from,to){
 from=num(from);to=num(to);if(!from||!to||from>to)return null;
 var z=P[k('range',v.edition,book,topic,from+'-'+to)];
 if(z&&inc(z[0],z[1]))return inc(z[0],z[1]);
 var a=(KNOWN[v.edition]||{})[topic];return book==='athkar'&&a&&to<=a.length?inc(a[from-1][0],a[to-1][1]):null
}
function edge(book,topic,side){
 var z=num(P[k('edge',v.edition,book,topic,side)]);
 if(z)return z;
 var a=(KNOWN[v.edition]||{})[topic];
 if(book==='athkar'&&a&&topic==='athkar-1')return side==='start'?a[0][0]:a[a.length-1][1];
 return null
}
function options(book,id){return read(book).map(function(x){return '<option value="'+esc(x.id)+'"'+(x.id===id?' selected':'')+'>'+esc(x.title)+'</option>'}).join('')||'<option value="">لا يوجد فهرس لهذا المتن حتى الآن</option>'}
function f(){return document.getElementById('day-form')}
function newBook(){return f()?.elements.book.value||'athkar'}
function revBook(){return f()?.elements.reviewBook.value||'athkar'}
function res(id,x){var e=document.getElementById(id);if(!e)return;e.className='smart-result '+(x?'ok':'unknown');
 e.textContent=x?'من صفحة '+x[0]+' إلى '+x[1]+' — '+x[2]+' صفحة ✓':'لم تُفهرَس صفحات هذا المدى بعد. أدخلي البداية والنهاية مرة واحدة؛ وسيحفظهما الجهاز.'}
function refresh(){
 var form=f();if(!form)return;
 var book=newBook(),rb=revBook();
 v.newTopic=first(book,v.newTopic);v.revA=first(rb,v.revA);v.revB=first(rb,v.revB);
 var selectors=[['smart-topic',book,v.newTopic],['smart-rev-start',rb,v.revA],['smart-rev-end',rb,v.revB]];
 selectors.forEach(function(x){var e=document.getElementById(x[0]);if(e)e.innerHTML=options(x[1],x[2])});
 var n=mapped(book,v.newTopic,v.from,v.to);
 var r=inc(edge(rb,v.revA,'start'),edge(rb,v.revB,'end'));
 res('smart-new-result',n);res('smart-rev-result',r);
 var link=document.getElementById('smart-pdf');if(link)link.href=book==='athkar'?ED[v.edition][1]:(BOOKS[book]?.reading||ED.current[1]);
 var q={'smart-man-a':n?.[0],'smart-man-b':n?.[1],'smart-rev-a':r?.[0]||edge(rb,v.revA,'start'),'smart-rev-b':r?.[1]||edge(rb,v.revB,'end')};
 Object.keys(q).forEach(function(id){var e=document.getElementById(id);if(e)e.placeholder=q[id]?String(q[id]):'رقم الصفحة'});
 persist()
}
function apply(side){
 var form=f();if(!form)return;
 if(side==='new'){
 var topic=item(newBook(),v.newTopic),a=num(v.from),b=num(v.to),r=mapped(newBook(),v.newTopic,v.from,v.to);
 if(!topic||!a||!b||b<a){alert('اختاري عنوان الحفظ ورقمَي الحديثين بصورة صحيحة.');return}
 if(!r){alert('لم نتحقق من صفحتي هذا المدى بعد. افتحي «صفحات غير مفهرسة» وسجليهما مرة واحدة.');return}
 form.elements.newText.value=topic.title+' ('+a+'-'+b+')';form.elements.newFrom.value=r[0];form.elements.newTo.value=r[1];form.elements.newPages.value=r[2];
 }else{
 var a=item(revBook(),v.revA),b=item(revBook(),v.revB),ids=read(revBook()).map(function(x){return x.id});
 if(!a||!b||ids.indexOf(a.id)>ids.indexOf(b.id)){alert('اختاري عنوان البداية والنهاية بترتيب الكتاب.');return}
 var r=inc(edge(revBook(),v.revA,'start'),edge(revBook(),v.revB,'end'));
 if(!r){alert('لم تُحدد صفحات المراجعة بعد. سجلي صفحة البداية والنهاية مرة واحدة.');return}
 form.elements.reviewText.value='من '+a.title+' إلى '+b.title;form.elements.reviewFrom.value=r[0];form.elements.reviewTo.value=r[1];form.elements.reviewPages.value=r[2]
 }
 syncCard();toast('تعبأت البطاقة؛ اضغطي «حفظ بطاقة اليوم» بعد التسميع 🌼')
}
function saveNew(){
 var a=num(v.from),b=num(v.to),r=inc(document.getElementById('smart-man-a').value,document.getElementById('smart-man-b').value);
 if(!a||!b||b<a||!item(newBook(),v.newTopic)||!r){alert('تحققي من رقمي الحديثين وصفحتي البداية والنهاية.');return}
 P[k('range',v.edition,newBook(),v.newTopic,a+'-'+b)]=[r[0],r[1]];
 persist();refresh();toast('حفظنا هذا المدى على جهازك؛ لن تعيدي عدّه 🌷')
}
function saveReview(){
 var book=revBook(),ids=read(book).map(function(x){return x.id});
 var a=num(document.getElementById('smart-rev-a').value)||edge(book,v.revA,'start');
 var b=num(document.getElementById('smart-rev-b').value)||edge(book,v.revB,'end');
 var r=inc(a,b);
 if(!r||ids.indexOf(v.revA)<0||ids.indexOf(v.revA)>ids.indexOf(v.revB)){alert('تحققي من ترتيب العناوين ومن الصفحتين.');return}
 P[k('edge',v.edition,book,v.revA,'start')]=r[0];P[k('edge',v.edition,book,v.revB,'end')]=r[1];
 persist();refresh();toast('تذكّر التطبيق هذا المدى للمراجعات المقبلة 🌿')
}
function field(label,id,val){return '<label class="smart-field"><span>'+label+'</span><input id="'+id+'" type="number" min="1" max="2000" inputmode="numeric"'+(val?' value="'+esc(val)+'"':'')+'></label>'}
function mountHome(){
 var form=f();if(!form||form.querySelector('#smart-wizard'))return;
 var shell=document.createElement('section');shell.id='smart-wizard';
 shell.innerHTML='<div class="smart-head"><b>🌼 بطاقتي الذكية</b><span>تسميع جديد · مراجعة كاملة</span></div>'+
 '<p class="smart-note">اختاري المتن من البطاقة الأصلية، ثم المقطع وأرقام الأحاديث. المراجعة من عنوان إلى عنوان دون عدّ يدوي متى كانت الصفحات مفهرسة.</p>'+
 '<label class="smart-field"><span>الطبعة — مهمة لصحة أرقام الصفحات</span><select id="smart-edition">'+Object.entries(ED).map(function(x){return '<option value="'+x[0]+'"'+(x[0]===v.edition?' selected':'')+'>'+x[1][0]+'</option>'}).join('')+'</select></label>'+
 '<div class="smart-section"><h3>💛 حفظ اليوم</h3><label class="smart-field"><span>اسم المقطع</span><select id="smart-topic"></select></label><div class="smart-two">'+field('من حديث','smart-hadith-a',v.from)+field('إلى حديث','smart-hadith-b',v.to)+'</div>'+
 '<div id="smart-new-result" class="smart-result"></div><details class="smart-details"><summary>📄 صفحات غير مفهرسة؟ حدديها مرة واحدة</summary><div class="smart-two">'+field('من صفحة','smart-man-a','')+field('إلى صفحة','smart-man-b','')+'</div><button class="smart-button light" type="button" data-smart-action="save-new">حفظ حدود هذا المدى</button></details><button class="smart-button" type="button" data-smart-action="new">تعبئة الحفظ تلقائيًا ✓</button></div>'+
 '<div class="smart-section"><h3>💗 مراجعة من عنوان إلى عنوان</h3><div class="smart-two"><label class="smart-field"><span>من عنوان</span><select id="smart-rev-start"></select></label><label class="smart-field"><span>إلى عنوان</span><select id="smart-rev-end"></select></label></div>'+
 '<div id="smart-rev-result" class="smart-result"></div><details class="smart-details"><summary>📄 غير مفهرس؟ احفظي حدود المراجعة</summary><div class="smart-two">'+field('أول صفحة','smart-rev-a','')+field('آخر صفحة','smart-rev-b','')+'</div><button class="smart-button light" type="button" data-smart-action="save-review">حفظ حدود المراجعة</button></details><button class="smart-button" type="button" data-smart-action="review">تعبئة المراجعة تلقائيًا ✓</button></div>'+
 '<p class="smart-note">📖 <a id="smart-pdf" target="_blank" rel="noopener noreferrer">راجعي موضعك في النسخة الأصلية</a>. لا نُخمّن صفحات أحاديث لم تُفهرس بعد. ولا يُحتسب حضور إلا بعد تأكيده وحفظ البطاقة.</p>';
 form.insertBefore(shell,form.firstElementChild);
 ['newText','reviewText'].forEach(function(n){form.elements[n]?.closest('.field')?.classList.add('smart-old')});
 ['newFrom','reviewFrom'].forEach(function(n){form.elements[n]?.closest('.form-row')?.classList.add('smart-old')});
 refresh()
}
function mountLibrary(){
 if(tab!=='library')return;
 document.querySelectorAll('.level-btn').forEach(function(b){if(!['pre','2','3'].includes(b.dataset.level))b.style.display='none'});
 var labels=document.querySelector('.levels');if(labels&&!labels.dataset.smart){labels.dataset.smart='1';var p=document.createElement('p');p.className='smart-note';p.textContent='نعرض الآن التمهيدي والثاني والثالث فقط، مع الاحتفاظ ببيانات جميع المتون السابقة.';labels.after(p)}
}
function mount(){try{if(db.profile&&tab==='home')mountHome();if(db.profile&&tab==='library')mountLibrary()}catch(e){console.warn('smart-card helper',e)}}
var original=render;render=function(){original();mount()};
autoCard=function(x){return '🌼بطاقة حضور 🌼\n🤍 الإسم: '+(db.profile?.name||'')+'\n💛 الحفظ: '+(x.newText||'—')+'\n🌼 عدد صفحات الحفظ: '+(x.newPages||0)+'\n💛المراجعه: '+(x.reviewText||'—')+(x.reviewText?' | '+(BOOKS[x.reviewBook]?.title||''):'')+'\n🌼عدد الصفحات: '+(x.reviewPages||0)};
document.addEventListener('change',function(e){
 var el=e.target,form=f();if(!form||!document.getElementById('smart-wizard'))return;
 if(el.id==='smart-edition')v.edition=el.value;
 if(el.id==='smart-topic')v.newTopic=el.value;
 if(el.id==='smart-rev-start')v.revA=el.value;
 if(el.id==='smart-rev-end')v.revB=el.value;
 if(['smart-edition','smart-topic','smart-rev-start','smart-rev-end','day-book'].includes(el.id)||el.name==='reviewBook')refresh();
});
document.addEventListener('input',function(e){if(e.target.id==='smart-hadith-a'){v.from=e.target.value;refresh()}if(e.target.id==='smart-hadith-b'){v.to=e.target.value;refresh()}});
document.addEventListener('click',function(e){var el=e.target.closest('[data-smart-action]');if(!el)return;e.preventDefault();
 if(el.dataset.smartAction==='new')apply('new');
 if(el.dataset.smartAction==='review')apply('review');
 if(el.dataset.smartAction==='save-new')saveNew();
 if(el.dataset.smartAction==='save-review')saveReview();
});
var css=document.createElement('style');css.textContent='#smart-wizard{padding:16px;border:1px solid #b9dec8;background:#f0faf4;border-radius:21px;display:grid;gap:15px;margin-bottom:19px}.smart-head{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}.smart-head b{font-size:20px;color:#245e49}.smart-head span,.smart-note{font-size:12px;color:#567c68}.smart-note{line-height:1.9;margin:0}.smart-note a{text-decoration:underline}.smart-section{background:white;border-radius:17px;border:1px solid #dcebe0;padding:14px;display:grid;gap:12px}.smart-section h3{font-size:16px;color:#2a6d56;margin:0}.smart-field{display:grid;gap:4px;min-width:0}.smart-field span{font-size:12px;font-weight:700;color:#527261}.smart-field select,.smart-field input{width:100%;min-width:0;background:#fff;border:1px solid #d1e4da;border-radius:12px;padding:10px}.smart-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.smart-result{font-size:13px;padding:11px;border-radius:12px;font-weight:700;line-height:1.8}.smart-result.ok{background:#e4f4ea;color:#28684e}.smart-result.unknown{background:#fff3e5;color:#95672d}.smart-details{border:1px dashed #cbdfd0;padding:11px;border-radius:12px}.smart-details summary{font-weight:700;font-size:12px;color:#527c66;cursor:pointer}.smart-details .smart-two{margin:11px 0}.smart-button{border:0;border-radius:12px;background:#2c8065;color:white;font-weight:700;font-size:13px;padding:11px;width:100%}.smart-button.light{background:#e5f3e8;color:#256b4f;border:1px solid #cbe3d3}.smart-old{display:none!important}';document.head.append(css);
mount();
})();