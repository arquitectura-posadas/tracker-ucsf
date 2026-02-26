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
    { id: "SEMF", nombre: "Seminario Final", nivel: 5, cApr: ["ARQ5"], nApr: [1, 2, 3] }
];

let estado = JSON.parse(localStorage.getItem("ucsf_track_v7")) || {};
let currentMateria = null;

function render() {
    const grid = document.getElementById('tracker-body');
    const lc = document.getElementById('list-cursar');
    const lr = document.getElementById('list-rendir');
    if(!grid) return;

    grid.innerHTML = ''; lc.innerHTML = ''; lr.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const col = document.createElement('div');
        col.className = 'nivel-col';
        col.innerHTML = `
            <div class="nivel-header">
                <h2>NIVEL ${i}</h2> 
                <div>
                    <button onclick="aprNiv(${i})" style="font-size:9px; cursor:pointer;">APR</button>
                    <button onclick="clrNiv(${i})" style="font-size:9px; cursor:pointer; color:red;">CLR</button>
                </div>
            </div>`;
        
        materias.filter(m => m.nivel === i).forEach(m => {
            const isDone = estado[m.id] === 'regular' || estado[m.id] === 'aprobada';
            const isReady = puedeCursar(m);
            
            const div = document.createElement('div');
            // Si ya está hecha, muestra su color. Si no, si está lista muestra 'ready', sino 'locked'.
            const statusClass = isDone ? (estado[m.id]) : (isReady ? 'ready' : 'locked');
            
            div.className = `materia-card ${statusClass}`;
            div.innerHTML = `<small style="font-weight:700; color:#999">${m.id}</small><h4>${m.nombre}</h4>`;
            
            // Solo clickable si está lista o ya tiene estado
            if (isReady || isDone) {
                div.onclick = () => { 
                    currentMateria = m; 
                    document.getElementById('modal-title').innerText = m.nombre; 
                    document.getElementById('modal-info').innerText = `Requisitos: ${m.cReg ? m.cReg.join(', ') : 'Ninguno'}`;
                    document.getElementById('modal').style.display = 'flex'; 
                };
            } else {
                div.onclick = () => alert(`Bloqueada: Requiere correlativas o niveles anteriores completos.`);
            }

            col.appendChild(div);
            if(isReady) lc.innerHTML += `<li>${m.nombre}</li>`;
            if(estado[m.id] === 'regular') lr.innerHTML += `<li>${m.nombre}</li>`;
        });
        grid.appendChild(col);
    }
    const aprCount = materias.filter(m => estado[m.id] === 'aprobada').length;
    document.getElementById('stats-text').innerText = `${aprCount}/${materias.length} Aprobadas`;
    document.getElementById('p-fill').style.width = (aprCount/materias.length*100) + "%";
}

function puedeCursar(m) {
    if (estado[m.id] === 'aprobada' || estado[m.id] === 'regular') return false;
    
    // 1. Correlativas de Regularidad (cReg)
    const regOk = (m.cReg || []).every(id => ['regular', 'aprobada'].includes(estado[id]));
    
    // 2. Correlativas de Aprobación (cApr)
    const aprOk = (m.cApr || []).every(id => estado[id] === 'aprobada');
    
    // 3. Niveles completos (nApr)
    const nivOk = (m.nApr || []).every(nv => {
        const materiasDelNivel = materias.filter(x => x.nivel === nv);
        return materiasDelNivel.every(x => estado[x.id] === 'aprobada');
    });

    return regOk && aprOk && nivOk;
}

function setMateriaEstado(s) { 
    if(s === 'no_cursada') delete estado[currentMateria.id];
    else estado[currentMateria.id] = s;
    localStorage.setItem("ucsf_track_v7", JSON.stringify(estado));
    closeModal(); render(); 
}

function aprNiv(n) { 
    if(confirm(`¿Aprobar todo el Nivel ${n}?`)) {
        materias.filter(m => m.nivel === n).forEach(m => estado[m.id] = 'aprobada'); 
        localStorage.setItem("ucsf_track_v7", JSON.stringify(estado)); 
        render(); 
    }
}

function clrNiv(n) { 
    if(confirm(`¿Resetear todo el Nivel ${n}?`)) {
        materias.filter(m => m.nivel === n).forEach(m => delete estado[m.id]); 
        localStorage.setItem("ucsf_track_v7", JSON.stringify(estado)); 
        render(); 
    }
}

function closeModal() { document.getElementById('modal').style.display = 'none'; }

window.onload = render;
