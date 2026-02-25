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
    { id: "OPT2", nombre: "Optativa II", nivel: 5, cReg: ["OPT1"], nApr: [1, 2, 3] },
    { id: "PPA", nombre: "Práctica Profesional", nivel: 5, cApr: ["ARQ4"], cReg: ["DOO", "EST3"], nApr: [1, 2, 3] },
    { id: "SEMF", nombre: "Seminario Final", nivel: 5, cApr: ["ARQ5"], nApr: [1, 2, 3] },
    { id: "INVA", nombre: "Investig. Arq.", nivel: 5, cReg: ["ARQ4", "HAU3", "PLAN"], nApr: [1, 2, 3] }
];

let estado = JSON.parse(localStorage.getItem("ucsf_tracker_v3")) || {};
let currentMateria = null;

function render() {
    const grid = document.getElementById('tracker-body');
    const listCursar = document.getElementById('list-cursar');
    const listRendir = document.getElementById('list-rendir');
    
    if(!grid) return;

    grid.innerHTML = '';
    listCursar.innerHTML = '';
    listRendir.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const col = document.createElement('div');
        col.className = 'nivel-col';
        
        const header = document.createElement('div');
        header.className = 'nivel-header';
        header.innerHTML = `
            <h2>Nivel ${i}</h2>
            <div class="nivel-actions">
                <button class="btn-inline btn-apr-all" onclick="aprobarTodoElNivel(${i})">APR</button>
                <button class="btn-inline btn-reset-all" onclick="resetearNivel(${i})">CLR</button>
            </div>
        `;
        col.appendChild(header);
        
        materias.filter(m => m.nivel === i).forEach(m => {
            const isReady = puedeCursar(m);
            const card = document.createElement('div');
            card.className = `materia-card ${estado[m.id] || ''} ${isReady ? 'ready' : ''}`;
            card.innerHTML = `<span class="code">${m.id}</span><h4>${m.nombre}</h4>`;
            card.onclick = () => openModal(m);
            col.appendChild(card);

            if (isReady) listCursar.innerHTML += `<li>${m.nombre}</li>`;
            if (estado[m.id] === 'regular') listRendir.innerHTML += `<li>${m.nombre}</li>`;
        });
        grid.appendChild(col);
    }
    updateStats();
}

function puedeCursar(m) {
    if (estado[m.id] === 'aprobada' || estado[m.id] === 'regular') return false;
    const r = (m.cReg || []).every(id => ['regular', 'aprobada'].includes(estado[id]));
    const a = (m.cApr || []).every(id => estado[id] === 'aprobada');
    const n = (m.nApr || []).every(nv => materias.filter(x => x.nivel == nv).every(x => estado[x.id] === 'aprobada'));
    return r && a && n;
}

function openModal(m) {
    currentMateria = m;
    document.getElementById('modal-title').innerText = m.nombre;
    const reqText = m.cApr ? `Final de: ${m.cApr.join(', ')}` : 'Sin requisitos de final.';
    document.getElementById('modal-info').innerText = reqText;
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() { document.getElementById('modal').style.display = 'none'; }

function setMateriaEstado(s) {
    estado[currentMateria.id] = s;
    guardarYRefrescar();
    closeModal();
}

function aprobarTodoElNivel(n) {
    if(confirm(`¿Marcar Nivel ${n} como APROBADO?`)) {
        materias.filter(m => m.nivel === n).forEach(m => estado[m.id] = 'aprobada');
        guardarYRefrescar();
    }
}

function resetearNivel(n) {
    if(confirm(`¿Resetear Nivel ${n}?`)) {
        materias.filter(m => m.nivel === n).forEach(m => delete estado[m.id]);
        guardarYRefrescar();
    }
}

function guardarYRefrescar() {
    localStorage.setItem("ucsf_tracker_v3", JSON.stringify(estado));
    render();
}

function updateStats() {
    const total = materias.length;
    const apr = materias.filter(m => estado[m.id] === 'aprobada').length;
    document.getElementById('stats-text').innerText = `${apr}/${total} Aprobadas`;
    document.getElementById('p-fill').style.width = (apr/total*100) + "%";
}

document.addEventListener('DOMContentLoaded', render);
