import {encoded, translations} from './data.js'

console.log("Let's rock");
function decoded(encoded){
    const uniqueId = new Set();
    const decoded = encoded.map(obj =>{
        const objKeys = Object.keys(obj);
        objKeys.forEach(key=>{
            key.includes('Id') && key !== 'groupId' && (typeof obj[key] !== 'object')
                ? obj[key] in translations
                    ? obj[key] = translations[obj[key]]
                    : uniqueId.add(obj[key])
                : false;
        });
        return obj;
    })
    return [].concat(decoded, {uniqueId: [...uniqueId]});
}

console.log(encoded, translations);
console.log(decoded(encoded));
