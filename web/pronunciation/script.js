String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
function toIPA(word = "", dialect){
    let symbolMap = {
        '!': "ni",
        '@': "do",
        '#': "ca",
        '&': "jan",
        '*': "aze",
        '(': "th",
        ')': "ch",
        //
        ':': "ma",
        '|': "jor",
        '.': "a",
        '?': "kwey"
    }
    let map = {
        a: ["a", 'v'],
        ay: ["eɪ", 'v'],
        b: ["b", 'pv'],
        c: ["tʃ", 'a'],
        ch: ["x", 'f'], //*
        d: ["d", 'pv'],
        e: ["ɛ", 'v'],
        ey: ["eɪ", 'v'],
        f: ["f", 'f'],
        g: ["g", 'pv'],
        h: ["", ''],
        ħ: ["ʁ", 'fv'],
        i: ["i", 'v'],
        j: ["ʒ", 'fv'],
        k: ["k", 'p'],
        kh: ["x", 'f'],
        kk: ["ʔ", 'p'],
        l: ["l", 'l'],
        lc: ["ɫ", 'c'],
        m: ["m", 'n'],
        n: ["n", 'n'],
        nh: ["ŋ", 'n'],
        o: ["o", 'v'],
        p: ["p", 'p'],
        q: ["ts", 'a'],
        r: ["ʐ", 'l'],
        rc: ["ɹ", 'c'],
        er: ["ɚ", 'v'],
        s: ["s", 'f'],
        sh: ["ʃ", 'f'], //**
        t: ["t", 'p'],
        th: ["θ", 'f'], //**
        "-": ["θ", 'f'],
        "-i": ["ɚ", 'v'],
        u: ["u", 'v'],
        ü: ["y", 'v'],
        v: ["v", 'fv'],
        w: ["w", 'l'],
        x: ["ks", 'cf'],
        ẋ: ["ʃ", 'f'],
        xh: ["kʃ", 'cf'],
        ÿ: ["j", 'l'],
        y: ["ɪ", 'v'],
        z: ["z", 'fv'],
        ż: ["dz", 'av'],
        zh: ["dʒ", 'av'], //*
        "'": ["", 'v']
    }
    //* - only in loanwords
    //** - only in loanwords, sound is represented a different way

    //replace shothands
    for(let k in symbolMap){
        word = word.replaceAll(k, symbolMap[k]);
    }
    
    //remove ending duplicate vowel(comments)
    if(word.length>=2&&word.charAt(word.length-1)==word.charAt(word.length-2)){
        word = word.substring(0, word.length-1);
    }

    //Strip ending fricative
    let frick = "";
    let tmp = word.charAt(word.length-1);
    if(word.includes("xh")){
        frick = "xh";
        word = word.substring(0, word.length-2);
    }else if(tmp!="n"&&map[tmp][1].includes("f")||map[tmp][1]=="n"){
        frick = tmp;
        word = word.substring(0, word.length-1);
    }

    //replace liquid y
    let reformed = true;
    if(reformed){
        if(word.charAt(0)=='y'&&map[word.charAt(1)][1]=='v'){
            word = word.replaceAt(0, 'ÿ');
        }
        for(let i = 1; i < word.length-1; i++){
            if(word.charAt(i)=='y'){
                if(map[word.charAt(i-1)][1]!='v'&&map[word.charAt(i+1)][1]=='v'){
                    word = word.replaceAt(i, 'ÿ');
                }
            }
        }
    }

    //Split word into syllables
    let cSlb = "";
    let wordf = [];
    let hasVowel = false;
    let vowelDone = false;
    const possibleVowelModifiers = ['y', 'r', 'l'];
    for(let i = 0; i < word.length; i++){
        let d = word.charAt(i);
        if(map[d][1]=="v"){
            hasVowel = true;
        }
        let coda = 0;
        if(d=="n"&hasVowel){
            if(i!=word.length-1){
                let n = word.charAt(i+1);
                if(n==d){
                    coda = 2;
                }
                else if(n=="h"){
                    coda = 2;
                }
                else if((map[n][1]!='l'||n=='l')&&map[n][1]!="v"){
                    coda = 1;
                }
            }else{
                coda = 1;
            }
        }else if(d=="k"&&hasVowel){
            if(i!=word.length-1){
                let n = word.charAt(i+1);
                if(n==d){
                    coda = 3;
                }
                else if(n=="h"){
                    coda = 2;
                }
                else if(map[n][1]!='l'&&map[n][1]!="v"){
                    coda = 1;
                }
            }else{
                coda = 1;
            }
        }else if(possibleVowelModifiers.includes(d)&&hasVowel){
            let n = word.charAt(i+1);
            if(i==word.length-1){
                coda = 1;
            }else if(n=="h"){
                coda = 1;
            }else if(d!='l'&&map[n][1]!='v'||d=='l'&&n!='l'&&map[n][1].includes('l')){
                coda = 1;
            }
        }
        if(coda==0){
            if(hasVowel&&map[d][1]!='v'||vowelDone){
                wordf.push(cSlb);
                cSlb = "";
                hasVowel = false;
                vowelDone = false;
                if(map[d][1]=='v'){
                    hasVowel = true;
                }
            }
            if(hasVowel){
                vowelDone = true;
            }
        }
        cSlb+=d;
        if(coda==2){
            cSlb+="h";
        }else if(coda==3){
            cSlb+="k";
        }
    }
    wordf.push(cSlb);
    if(frick!=""){
        wordf.push(" "+frick);
    }
    //TODO: actually convert syllables, add in frick, maybe shift s of verb forward
    console.log(wordf);
    for(let i = 0; i < wordf.length; i++){
        let final = "";
        let tword = wordf[i];
        for(let j = 0; j < tword.length; j++){
            let d = tword.charAt(j);
            let n = j<tword.length-1?tword.charAt(j+1):"'";
            console.log(d);
            if(!(d in map)){
                final+=d;
                continue;
            }
            let choice = map[d][0];
            if(map[d][1]!='v'&&n=='h'){
                if(d+'h' in map){
                    choice = map[d+'h'][0];
                }
            }else if(map[d][1]!='v'&&n==d){
                if(d+d in map){
                    choice = map[d+d][0];
                    j++;
                }
            }else if(map[d][1]=='v'&&n=='y'){
                if(d+'y' in map){
                    choice = map[d+'y'][0];
                    j++;
                }
            }else if((d=='r'||d=='l')&&j==tword.length-1){
                choice = map[d+'c'][0];
            }else if(d=='e'&&n=='r'){
                choice = map['er'][0];
                j++;
            }
            final+=choice;
        }
        if(final.startsWith(" ")){
            final = final.substring(1);
            wordf[i-1]+=final;
            wordf.pop();
        }else{
            wordf[i] = final;
        }
    }
    return wordf;
}
function isAgglutinatedPronoun(word){
    return false;
}
function combineSyllables(word){
    let emphasized = false; // every other syllable past penultimate is stressed lightly
    if(word.length==1){
        return word[0];
    }
    if(isAgglutinatedPronoun(word)){
        //
    }
    for(let x = 1; x <= word.length; x++){
        word[word.length-x] = (emphasized&&x%2==0?",":".")+word[word.length-x];
    }
    word[word.length-2] = "'"+word[word.length-2].substring(1);
    let f = word.join("");
    if(f.startsWith('.')){
        f = f.substring(1);
    }
    return f;
}
function getPronunciation(phrase, dialect){
    let wordsIn = phrase.split(" ");
    let wordsOut = [];
    for(let word of wordsIn){
        if(word.endsWith(',')||word.endsWith(';')){
            word = word.substring(0, word.length-1);
        }
        wordsOut.push(combineSyllables(toIPA(word, dialect)));
    }
    return wordsOut.join(" ");
}
function showPronunciation(phrase, dialect=""){
    document.getElementById("dialect").innerHTML = dialect;
    let ipaElement = document.getElementById("ipa");
    ipaElement.innerHTML = "/"+getPronunciation(phrase, dialect)+"/";
}
function updatePronunciation(){
    showPronunciation(document.getElementById("phraseInput").value, document.querySelector('input[name="dialect"]:checked').value);
}
for(var h of ['phraseInput', 'd-salus']){
    document.getElementById(h).addEventListener("change", updatePronunciation);
}
updatePronunciation();