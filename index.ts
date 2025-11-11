let phrase: string = "paska";
function splitString(str: string): string[] {
    return str.split(" ");
}
type IndependentClause = {
    verb: VerbClause;
    object: NounClause;
    subject: NounClause;
    comments?: BComment[];
};
type VerbClause = {
    verb: string;
    adverbs?: Adverb[];
    prepositions?: Preposition[];
};
type NounClause = {
    preadjectives?: PreAdjective[];
    noun: string;
    adjectives?: Adjective[];
    prepositions?: Preposition[];
};
type BComment = {
    text: string;
};
type Adverb = {
    text: string;
};
type Preposition = {
    text: string;
};
type PreAdjective = {
    text: string;
    object?: NounClause;
};
type Adjective = {
    text: string;
};
function isVerb(word: string): boolean {
    if(word.endsWith("s")){
        return true;
    }
    if(word.includes("sk")||word.includes("st")){
        return true;
    }
    return false;
}
function isNoun(word: string): boolean {
    if (word.endsWith("o") && !word.includes("st")) {
        return true;
    }
    return false;
}
function parseAdjectivesAndPrepositions(startIndex: number, words: string[]): number {
    let i = startIndex;
    while (i < words.length) {
        if (words[i].endsWith("i")) { // Assuming normal adjectives end with 'i'
            let word = { text: words[i] } as Adjective;
            i++;
        } else if (words[i].startsWith("-")) { // Assuming prepositions start with '-'
            i++;
        } else {
            break;
        }
    }
    return i;
}
const words = splitString(phrase);
//Assume the first word is not "kwey" or an interjection
//We don't know if the first word is a comment or part of the noun clause
//Find the lower and upper bounds of the first noun clause
let nounClauseStart = 0;
let nounClauseEnd = 0;
for (let i = 0; i < words.length; i++) {
    if (isNoun(words[i])) {
        nounClauseStart = i;
        i = parseAdjectivesAndPrepositions(i+1, words);
        nounClauseEnd = i;
        i = nounClauseStart;
        //i = parsePreAdjectives(i-1, words);
        break;
    }
}
//96 roots