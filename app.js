const materias = [
    { id: "ARQ1", nombre: "Arquitectura I", nivel: 1 },
    { id: "CON1", nombre: "Construcciones I", nivel: 1 },
    { id: "FILO", nombre: "Filosofía", nivel: 1 },
    { id: "FISI", nombre: "Física", nivel: 1 },
    { id: "MAT1", nombre: "Matemática I", nivel: 1 },
    { id: "MOR1", nombre: "Morfología I", nivel: 1 },
    { id: "SEMI", nombre: "Seminario de Investigación", nivel: 1 },
    { id: "SR1", nombre: "Sistemas de Representación I", nivel: 1 },
    { id: "ITAU", nombre: "ITAU", nivel: 1 },
    { id: "ARQ2", nombre: "Arquitectura II", nivel: 2, cReg: ["ARQ1", "CON1", "ITAU", "SR1"] },
    { id: "CON2", nombre: "Construcciones II", nivel: 2, cReg: ["CON1"] },
    { id: "EST1", nombre: "Estructuras I", nivel: 2, cReg: ["FISI", "MAT1"] },
    { id: "HAU1", nombre: "Hist. Arq. y Urb. I", nivel: 2, cReg: ["ITAU"] },
    { id: "INS1", nombre: "Instalaciones I", nivel: 2, cReg: ["CON1"] },
    { id: "MAT2", nombre: "Matemática II", nivel: 2, cReg: ["MAT1"] },
    { id: "MOR2", nombre: "Morfología II", nivel: 2, cReg: ["MOR1"] },
    { id: "SR2", nombre: "Sistemas de Representación II", nivel: 2, cReg: ["SR1"] },
    { id: "TEOD", nombre: "Teología Dogmática", nivel: 2, cReg: ["FILO"] },
    { id: "ARQ3", nombre: "Arquitectura III", nivel: 3, cReg: ["ARQ2", "CON2", "EST1", "HAU1", "INS1", "ITAU", "MAT1", "SR2"] },
    { id: "CON3", nombre: "Construcciones III", nivel: 3, cReg: ["CON2", "INS1"] },
    { id: "EST2", nombre: "Estructuras II", nivel: 3, cReg: ["EST1", "MAT2"] },
    { id: "HAU2", nombre: "Hist. Arq. y Urb. II", nivel: 3, cReg: ["HAU1", "ITAU"] },
    { id: "INS2", nombre: "Instalaciones II", nivel: 3, cReg: ["CON2", "INS1"] },
    { id: "MOR3", nombre: "Morfología III", nivel: 3, cReg: ["MOR2", "SR2"] },
    { id: "URB", nombre: "Urbanismo", nivel: 3, cReg: ["HAU1", "ITAU"] },
    { id: "ARQ4", nombre: "Arquitectura IV", nivel: 4, cApr: ["ARQ3"], cReg: ["CON3", "EST2", "HAU2", "INS2", "URB"], nApr: [1, 2] },
    { id: "AUL", nombre: "Arq. y Urb. Legal", nivel: 4, cReg: ["CON2", "INS1", "URB"], nApr: [1] },
    { id: "DOO", nombre: "Dir. y Org. de Obras", nivel: 4, cReg: ["ARQ2", "CON2", "EST1", "EST2", "INS1"], nApr: [1] },
    { id: "EST3", nombre: "Estructuras III", nivel: 4, cReg: ["EST1", "EST2"], nApr: [1] },
    { id: "PLAN", nombre: "Planeamiento", nivel: 4, cReg: ["ARQ2", "HAU1", "HAU2", "URB"], nApr: [1] },
    { id: "HAU3", nombre: "Hist. Arq. y Urb. III", nivel: 4, cReg: ["HAU2"], nApr: [1] },
    { id: "TEOM", nombre: "Teología Moral", nivel: 4, cReg: ["TEOD"], nApr: [1] },
    { id: "ARQ5", nombre: "Arquitectura V", nivel: 5, cApr: ["ARQ4"], cReg: ["PLAN", "HAU3", "EST3", "INS2"], nApr: [1, 2, 3] },
    { id: "OPT1", nombre: "Optativa I", nivel: 5, nApr: [1, 2, 3] },
    { id: "OPT2", nombre: "Optativa II", nivel: 5, nApr: [1, 2, 3] },
    { id: "PPA", nombre: "Práctica Profesional", nivel: 5, cApr: ["ARQ4"], cReg: ["DOO", "EST3"], nApr: [1, 2, 3] },
    { id: "SEMF", nombre: "Seminario Final", nivel: 5, cApr: ["ARQ4"], cReg: ["HAU3", "PLAN"], nApr: [1, 2, 3] }
];

let estado = JSON.parse(localStorage.getItem("ucsf_master_v13")) || {};
let currentMateria = null;

function render() {
    const grid = document.getElementById('tracker-body');
    const lc = document.getElementById('list-cursar');
    const lr = document.getElementById('list-rendir');
    grid.innerHTML = ''; lc.innerHTML = ''; lr.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const col = document.createElement('div');
        col.className = 'nivel-col';
        col.innerHTML = `<div class="nivel-header"><h2>NIVEL ${i}</h2> 
            <div><button onclick="aprNiv(${i})">APR</button><button onclick="clrNiv(${i})" style="color:red">CLR</button></div></div>`;
        
        materias.filter(m => m.nivel === i).forEach(m => {
            const info = estado[m.id] || {};
            const isDone = info.status === 'regular' || info.status === 'aprobada';
            const isReady = puedeCursar(m);
            const statusClass = isDone ? info.status : (isReady ? 'ready' : 'locked');
            
            const div = document.createElement('div');
            div.className = `materia-card ${statusClass}`;
            div.innerHTML = `<small>${m.id}</small><h4>${m.nombre}</h4> ${info.nota ? `<span class="nota-tag">${info.nota}</span>` : ''}`;
            
            if (isReady || isDone) {
                div.onclick = () => {
                    currentMateria = m;
                    document.getElementById('modal-title').innerText = m.nombre;
                    document.getElementById('materia-nota').value = info.nota || '';
                    document.getElementById('check-comodin').checked = info.comodin || false;
                    document.getElementById('check-art26').checked = info.art26 || false;
                    document.getElementById('modal').style.display = 'flex';
                };
            }
            col.appendChild(div);
            if(isReady) lc.innerHTML += `<li>${m.nombre}</li>`;
            if(info.status === 'regular') lr.innerHTML += `<li>${m.nombre}</li>`;
        });
        grid.appendChild(col);
    }
    updateStats();
}

function puedeCursar(m) {
    if (estado[m.id]?.status === 'aprobada' || estado[m.id]?.status === 'regular') return false;
    const regOk = (m.cReg || []).every(id => ['regular', 'aprobada'].includes(estado[id]?.status) || estado[id]?.comodin);
    const aprOk = (m.cApr || []).every(id => estado[id]?.status === 'aprobada');
    const nivOk = (m.nApr || []).every(nv => materias.filter(x => x.nivel === nv).every(x => estado[x.id]?.status === 'aprobada'));
    return regOk && aprOk && nivOk;
}

function guardarMateria(status) {
    const notaInput = document.getElementById('materia-nota');
    const nota = parseInt(notaInput.value);
    
    // VALIDACIÓN: Si es aprobada, requiere nota
    if (status === 'aprobada' && (isNaN(nota) || nota < 4 || nota > 10)) {
        alert("Por favor, ingresá una nota válida (4 a 10) para las materias aprobadas.");
        notaInput.focus();
        return;
    }

    const comodin = document.getElementById('check-comodin').checked;
    const art26 = document.getElementById('check-art26').checked;

    if (status === 'no_cursada') delete estado[currentMateria.id];
    else estado[currentMateria.id] = { status, nota: isNaN(nota) ? null : nota, comodin, art26 };

    localStorage.setItem("ucsf_master_v13", JSON.stringify(estado));
    closeModal(); render();
}

function updateStats() {
    const s = Object.values(estado);
    const aprs = s.filter(x => x.status === 'aprobada' && x.nota >= 4);
    const acad = aprs.length ? (aprs.reduce((a, b) => a + b.nota, 0) / aprs.length).toFixed(2) : '-';
    document.getElementById('prom-acad').innerText = acad;
    document.getElementById('stats-text').innerText = `${aprs.length}/${materias.length}`;
    document.getElementById('p-fill').style.width = (aprs.length/materias.length*100) + "%";
}

function toggleDarkMode() { document.body.classList.toggle('dark'); }
function closeModal() { document.getElementById('modal').style.display = 'none'; }
function aprNiv(n) { materias.filter(m => m.nivel === n).forEach(m => estado[m.id] = {status:'aprobada', nota: 4}); localStorage.setItem("ucsf_master_v13", JSON.stringify(estado)); render(); }
function clrNiv(n) { materias.filter(m => m.nivel === n).forEach(m => delete estado[m.id]); localStorage.setItem("ucsf_master_v13", JSON.stringify(estado)); render(); }

window.onload = render;
