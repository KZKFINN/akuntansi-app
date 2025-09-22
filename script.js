// Akuntansi Pro Script
let appData = {
  transaksi: [],
  piutang: [],
  hutang: [],
  kas: 0,
  pendapatan: 0,
  pengeluaran: 0
};

// load data
if (localStorage.getItem("akuntansiPro")) {
  appData = JSON.parse(localStorage.getItem("akuntansiPro"));
  updateDashboard();
}

function saveData() {
  localStorage.setItem("akuntansiPro", JSON.stringify(appData));
  updateDashboard();
}

function updateDashboard() {
  document.getElementById('saldo-kas').textContent = formatCurrency(appData.kas);
  renderTransactions();
  renderPiutang();
  renderHutang();
  updateReports();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
}

// transaksi
document.getElementById('transaction-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const type = document.getElementById('transaction-type').value;
  const category = document.getElementById('transaction-category').value;
  const amount = parseFloat(document.getElementById('transaction-amount').value);
  const description = document.getElementById('transaction-description').value;
  const t = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    type, category, amount, description
  };
  appData.transaksi.unshift(t);
  if (type==='pemasukan'){appData.kas+=amount; appData.pendapatan+=amount;}
  else {appData.kas-=amount; appData.pengeluaran+=amount;}
  saveData();
  this.reset();
});

function renderTransactions(){
  const c=document.getElementById('transactions-list');
  if(appData.transaksi.length===0){c.innerHTML='<p>Belum ada transaksi</p>';return;}
  c.innerHTML=appData.transaksi.map(t=>`<div>${t.date} - ${t.type} - ${t.category} - ${formatCurrency(t.amount)}</div>`).join('');
}

// Piutang
function showAddPiutang(){document.getElementById('piutang-form').style.display='block';}
function hideAddPiutang(){document.getElementById('piutang-form').style.display='none';}
document.getElementById('add-piutang-form').addEventListener('submit',function(e){
  e.preventDefault();
  const p={id:Date.now(),date:new Date().toISOString().split('T')[0],name:document.getElementById('piutang-name').value,amount:parseFloat(document.getElementById('piutang-amount').value),description:document.getElementById('piutang-desc').value,status:'belum_lunas'};
  appData.piutang.unshift(p);
  saveData();renderPiutang();hideAddPiutang();
});
function renderPiutang(){
  const c=document.getElementById('piutang-list');
  if(appData.piutang.length===0){c.innerHTML='<p>Belum ada piutang</p>';return;}
  c.innerHTML=appData.piutang.map(p=>`<div>${p.name} - ${formatCurrency(p.amount)} - ${p.status}</div>`).join('');
}

// Hutang
function showAddHutang(){document.getElementById('hutang-form').style.display='block';}
function hideAddHutang(){document.getElementById('hutang-form').style.display='none';}
document.getElementById('add-hutang-form').addEventListener('submit',function(e){
  e.preventDefault();
  const h={id:Date.now(),date:new Date().toISOString().split('T')[0],name:document.getElementById('hutang-name').value,amount:parseFloat(document.getElementById('hutang-amount').value),description:document.getElementById('hutang-desc').value,status:'belum_lunas'};
  appData.hutang.unshift(h);
  saveData();renderHutang();hideAddHutang();
});
function renderHutang(){
  const c=document.getElementById('hutang-list');
  if(appData.hutang.length===0){c.innerHTML='<p>Belum ada hutang</p>';return;}
  c.innerHTML=appData.hutang.map(h=>`<div>${h.name} - ${formatCurrency(h.amount)} - ${h.status}</div>`).join('');
}

// Reports
function updateReports(){
  document.getElementById('total-income').textContent=formatCurrency(appData.pendapatan);
  document.getElementById('total-expense').textContent=formatCurrency(appData.pengeluaran);
  document.getElementById('profit-loss').textContent=formatCurrency(appData.pendapatan-appData.pengeluaran);
  document.getElementById('total-piutang').textContent=formatCurrency(appData.piutang.filter(p=>p.status==='belum_lunas').reduce((a,b)=>a+b.amount,0));
  document.getElementById('total-hutang').textContent=formatCurrency(appData.hutang.filter(h=>h.status==='belum_lunas').reduce((a,b)=>a+b.amount,0));
}

// Backup
function exportData(){
  const blob=new Blob([JSON.stringify(appData,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='backup-akuntansi.json';
  a.click();
}