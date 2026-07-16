const firstOnsets = {};
let onset = {
    "": [],
    "h": ["liq"],
    "r": [],
    "y": [],
    "l": [
        "r",
        "y",
        "w"
    ],
    "w": [],
    "p": ["liq"],
    "t": [
        "r",
        "y",
        "w"
    ],
    "k": ["liq"],
    "b": ["liq"],
    "d": [
        "r",
        "y",
        "w"
    ],
    "g": ["liq"],
    "f": [
        "liq",
        "t",
        "k",
        "m"
    ],
    "v": [
        "r",
        "y",
        "l"
    ],
    "s": [
        "liq",
        "p",
        "t",
        "k",
        "v",
        "m",
        "n"
    ],
    "q": [],
    "x": [
        "p",
        "t",
        "k",
        "l",
        "w"
    ],
    "c": [],
    "z": [],
    "j": [],
    "m": ["liq"],
    "n": [
        "y",
        "w"
    ]
}
let vowelBasic = [
    "i",
    "e",
    "a",
    "o",
    "u"
]
let vowelSpecial = [
    "ü",
    "y"
]
let vowelReserve = [
    "ey",
    "ay",
    "ar",
    "ir"
]
function syllableAllowed(c, g, v){
    if((c+g+v).includes("yi")||(c+g+v).includes("wu")){
        return false;
    }
    if((c+g+v).length>=4){
        return false;
    }
    if((c+g).length>=2&&vowelSpecial.includes(v)){
        return false;
    }
    return true;
}
function codasOf(v){
    if(!vowelReserve.includes(v)){
        if(v!="o"){
            return ["", "n", "k"];
        }
        return ["", "n"];
    }
    return [""];
}
function createTable(){
    let vowelTotal = vowelBasic.length + vowelSpecial.length + vowelReserve.length;
    let table = document.createElement("table");
    let head = document.createElement("thead");
    let headRow1 = document.createElement("tr");
    headRow1.innerHTML = `
        <th colspan="2" rowspan="2"></th>
        <th colspan="`+vowelBasic.length+`">BASIC VOWELS</th>
        <th colspan="`+vowelSpecial.length+`">ADDITIONAL VOWELS</th>
        <th colspan="`+vowelReserve.length+`">RESERVED VOWELS</th>
    `;
    head.appendChild(headRow1);
    let headRow2 = document.createElement("tr");
    let vg = function(vowels){
        for(let d of vowels){
            let trtmp = document.createElement("th");
            trtmp.innerHTML = d;
            headRow2.appendChild(trtmp);
        }
    }
    vg(vowelBasic);
    vg(vowelSpecial);
    vg(vowelReserve);
    head.appendChild(headRow2);
    table.appendChild(head);

    //consonant rows
    for(let c in onset){
        let l = onset[c];
        l.unshift("");
        if(l.indexOf("liq")>0){
            l.splice(l.indexOf("liq"), 1);
            l.push("r", "l", "y", "w");
        }
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerHTML = c;
        td.rowSpan = l.length;
        firstOnsets[c] = {
            elem: td,
            span: td.rowSpan
        }
        tr.appendChild(td);
        for(let g of l){
            td = document.createElement("td");
            td.innerHTML = g;
            tr.appendChild(td);
            if(g!=""){
                tr.classList.add("glide");
            }
            for(let v of [...vowelBasic, ...vowelSpecial, ...vowelReserve]){
                td = document.createElement("td");
                let root = c+g+v;
                td.innerHTML = codasOf(v).map((k)=>("<div "+(k==""?"":"class=\"coda\"")+" id=\"root-"+root+k+"\">"+root+k+"</div>")).join("");
                if(!syllableAllowed(c,g,v)){
                    td.style.backgroundColor = "black";
                }
                td.style.textAlign = "left";
                tr.appendChild(td);
            }
            table.appendChild(tr);
            tr = document.createElement("tr");
        }
    }
    return table;
}
document.getElementById("root-table").appendChild(createTable());
const codaElements = document.querySelectorAll(".coda");
const glideElements = document.querySelectorAll(".glide");
const codaToggle = document.getElementById("table-show-coda");
const glideToggle = document.getElementById("table-show-glide");
codaToggle.addEventListener("change", ()=>{
    if(codaToggle.checked){
        for(let e of codaElements){
            e.style.display = "block";
        }
    }else{
        for(let e of codaElements){
            e.style.display = "none";
        }
    }
});
glideToggle.addEventListener("change", ()=>{
    if(glideToggle.checked){
        for(let e of glideElements){
            e.style.display = "table-row";
        }
        for(let fc in firstOnsets){
            firstOnsets[fc].elem.rowSpan = firstOnsets[fc].span;
        }
    }else{
        for(let e of glideElements){
            e.style.display = "none";
        }
        for(let fc in firstOnsets){
            firstOnsets[fc].elem.rowSpan = 1;
        }
    }
});