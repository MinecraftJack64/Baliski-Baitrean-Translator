let raww = `p:
1012
1121
t:
000111
1012
k:
10211112
s:
102112
x:
0011
201112

vo:
012122
fr:
0222
af:
1012
na:
1001

b:
p+vo
d:
t+vo
g:
k+vo
z:
s+vo
j:
x+vo

f:
p+fr
kh:
p+fr
-:
t+fr

v:
f+vo
h:
kh+vo
z':
z+af
dj:
j+af
q:
s+af
c:
x+af

m:
p+na
n:
t+na
nh:
k+na
r:
x+na

l:
1012
011221

y:
i
w:
u

r':
031223
l':
1213
021322
y':
120203
w':
122322

!VOWEL
i:
20210102
e:
1012
0121
a:
0022
0220
o:
00012120
U:
001120
ü:
00111222
1120
ÿ:
20210102
er:
011021

y":
021213
r":
031223
k":
0222
n":
1221

br:
1112`;
ldata = {
    //
}
const canvas = document.getElementById("orthography");
const ctx = canvas.getContext("2d");
function loadLetters(data){
    let currently = "c";
    let lines = data.split("\n");
    let defl = "";
    let dat = [];
    for(let line of lines){
        if(line.endsWith(":")){
            if(dat.length>0){
                lldata = {
                }
                if(typeof dat[0]==="string"){
                    lldata.type = "composite";
                    lldata.components = dat;
                    dat = [];
                }else{
                    lldata.type = "core";
                    lldata.strokes = dat;
                    dat = [];
                }
                ldata[defl] = lldata;
            }
            defl = line.split(":")[0];
        }else{
            if(/^\d+$/.test(line.charAt(0))){
                let path = [];
                let c = 0;
                while(c<line.length){
                    if(currently=="c"){
                        path.push([+line.charAt(c), +line.charAt(c+1)]);
                    }else{
                        path.push([+line.charAt(c), -(+line.charAt(c+1))]);
                    }
                    c+=2;
                }
                dat.push(path);
            }else if(line.startsWith("!")){
                currently = "v";
            }else if(line!=""){
                for(let comp of line.split("+")){
                    dat.push(comp);
                }
            }
        }
    }
}
function drawLetter(letter, position = 50, y = 50, scale = 20){
    let data = ldata[letter];
    if(data.type=="core"){
        for(let stroke of data.strokes){
            ctx.beginPath();
            ctx.moveTo(position+stroke[0][0]*scale, y+stroke[0][1]*scale);
            for(let line of stroke){
                ctx.lineTo(position+line[0]*scale, y+line[1]*scale)
            }
            ctx.stroke();
        }
    }else{
        for(let l of data.components){
            drawLetter(l, position, y, scale);
        }
    }
}
function drawWord(word, position = 0, y = 30, scale = 10){
    let parts = [["l", "o", 'n"'], ["r", "e", 'k"'], ["k", "w'", "i"]];
    for(let syllable of parts){
        for(let part of syllable){
            drawLetter(part, position, y, scale);
        }
        ctx.beginPath();
        ctx.moveTo(position, y);
        ctx.lineTo(position+3*scale, y);
        ctx.stroke();
        position+=scale*3;
    }
}
function drawSentence(sentence){
    //
}
loadLetters(raww);