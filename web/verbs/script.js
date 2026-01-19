function getPartOfSpeech(word = ""){
    let pos;
    let data = {};
    //Test for preposition
    if(word.startsWith("-")){
        pos = "prep";
    }else{
        //Test for postcomment
        if(word.endsWith("m")){
            pos = "post";
        }
    }
    //Test for verb
    if(word.includes("s")){
        let end = word.substring(word.lastIndexOf("s"));
        if(end.length==1){
            pos = "verb";
            data.number = "s";
            data.person = 3;
        }else if(end.length==2){
            if(end.charAt(1)==='i'){
                pos = "verb";
                data.number = "s";
            }
        }
    }
}

// Return complete verb
// root example: pas
// data example: {tense: "present", person: "2nd", number: "p"}
function buildVerb(root, data){
    let word = root;
    if(data.person){
        if(data.person==2){
            word+="t";
        }else if(data.person==1){
            word+="k";
        }
    }
    if(data.tense){
        if(data.tense==="present"){
            //Do not add a if 3rd person singular
            if(data.person&&data.person!=3||data.number&&data.number==="p"){
                word+="a";
            }else if(data.gender){
                word+="y";
            }
        }else if(data.tense==="past"){
            word+="i";
        }else if(data.tense==="imperfect"){
            word+="ia";
        }
    }
    if(data.gender){
        if(data.gender==="m"){
            word+="f";
        }else if(data.gender==="f"){
            word+="m";
        }
    }
    if(data.number){
        if(data.number=="p"){
            word+="ti";
        }
    }
    return word;
}

// Return div containing verb tables
function buildVerbTable(word, tense, gender=""){
    var tenses = {
        present: "Present",
        past: "Past",
        imperfect: "Imperfect"
    }
    var persons = {
        1: "1st",
        2: "2nd",
        3: "3rd"
    }
    let div = document.createElement("table");
    let caption = document.createElement("caption");
    caption.innerHTML = tenses[tense];
    div.appendChild(caption);
    let data = {
        tense: tense,
    }
    if(gender!==""){
        data.gender = gender;
    }
    div.innerHTML+=`<tr><td></td><th>Singular</th><th>Plural</th></tr>`
    for(let person = 1; person <= 3; person++){
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        th.innerHTML = persons[person];
        tr.appendChild(th);
        data.person = person;
        let s = document.createElement("td");
        data.number = "s";
        s.innerHTML = buildVerb(word, data);
        let p = document.createElement("td");
        data.number = "p";
        p.innerHTML = buildVerb(word, data);
        tr.appendChild(s);
        tr.appendChild(p);
        div.appendChild(tr);
    }
    return div;
}
function showVerbConjugations(word, gender=""){
    let conjugationsElement = document.getElementById("conjugations");
    conjugationsElement.innerHTML = "";
    conjugationsElement.appendChild(buildVerbTable(word, "present", gender));
    conjugationsElement.appendChild(buildVerbTable(word, "past", gender));
    conjugationsElement.appendChild(buildVerbTable(word, "imperfect", gender));
    if(!word.endsWith("s")){
        conjugationsElement.innerHTML = "INVALID VERB";
    }
}
function updateVerbConjugations(){
    showVerbConjugations(document.getElementById("r").value, document.querySelector('input[name="gender"]:checked').value);
}
for(var h of ['r', 'g-nb', 'g-m', 'g-f']){
    document.getElementById(h).addEventListener("change", updateVerbConjugations);
}
updateVerbConjugations();