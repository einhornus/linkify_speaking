
//let speech;


function inittts()
{
    //utterance = new SpeechSynthesisUtterance();
    //window.speechSynthesis.speak(utterance);
    speak("荒野", false)
}



var speechUtteranceChunker = function (utt, settings, callback) {
    settings = settings || {};
    var newUtt;
    var txt = (settings && settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text);
    if (utt.voice && utt.voice.voiceURI === 'native') { // Not part of the spec
        newUtt = utt;
        newUtt.text = txt;
        newUtt.addEventListener('end', function () {
            if (speechUtteranceChunker.cancel) {
                speechUtteranceChunker.cancel = false;
            }
            if (callback !== undefined) {
                callback();
            }
        });
    }
    else {
        var chunkLength = (settings && settings.chunkLength) || 160;
        var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
        var chunkArr = txt.match(pattRegex);

        if (chunkArr[0] === undefined || chunkArr[0].length <= 2) {
            //call once all text has been spoken...
            if (callback !== undefined) {
                callback();
            }
            return;
        }
        var chunk = chunkArr[0];
        newUtt = new SpeechSynthesisUtterance(chunk);
        var x;
        for (x in utt) {
            if (utt.hasOwnProperty(x) && x !== 'text') {
                newUtt[x] = utt[x];
            }
        }
        newUtt.addEventListener('end', function () {
            if (speechUtteranceChunker.cancel) {
                speechUtteranceChunker.cancel = false;
                return;
            }
            settings.offset = settings.offset || 0;
            settings.offset += chunk.length - 1;
            speechUtteranceChunker(utt, settings, callback);
        });
    }

    if (settings.modifier) {
        settings.modifier(newUtt);
    }
    newUtt.lang = utt.lang
    newUtt.voice = utt.voice
    console.log(newUtt); //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
    //placing the speak invocation inside a callback fixes ordering and onend issues.
    setTimeout(function () {
        speechSynthesis.speak(newUtt);
    }, 0);
};

function resumeInfinity() {
    window.speechSynthesis.resume();
    timeoutResumeInfinity = setTimeout(resumeInfinity, 1000);
}


function speak(stuff, notification=true){

    if(notification && stuff == ""){
        alert("Select some text on the page to sound it out")
        return
    }

    clearedStuff = stuff.replaceAll("\n", "")
    clearedStuff = stuff.replaceAll(String.fromCharCode(769), "")

    if(main_lang == 8){
        /*
        ncs = ""
        for(let i = 0; i<clearedStuff.length; i++){
            if(clearedStuff[i] >= '一'){
                ncs+=clearedStuff[i]
            }
        }
        clearedStuff = ncs
        */

        var reg = /[\u4e00-\u9fa5]/g;
        clearedStuffs = clearedStuff.match(reg);
        clearedStuff = clearedStuffs.join("");
        clearedStuff = clearedStuff.replaceAll(" ", "")

    }



    /*
    //speech.text = stuff
    //window.speechSynthesis.speak(speech);
    var voiceArr = window.speechSynthesis.getVoices();
    goodVoices = []
    for(let i = 0; i<voiceArr.length; i++){
        console.log("voice", voiceArr[i].lang.substring(0, 2), std_langs[main_lang])
        if(voiceArr[i].lang.substring(0, 2) == std_langs[main_lang]){
            goodVoices.push(voiceArr[i])
        }
    }

    clearedStuff = stuff.replaceAll("\n", "")
    clearedStuff = stuff.replaceAll(String.fromCharCode(64), "")


    if (goodVoices.length == 0){
        alert("No "+std_langs_full[main_lang]+" voices found. Try a different browser")
        return
    }


    sp = new SpeechSynthesisUtterance(clearedStuff);
    sp.voice = goodVoices[0]
    sp.lang = std_langs_full[main_lang]
    console.log("Speaking ", clearedStuff, "with", sp.voice)


    speechUtteranceChunker(sp, {
        chunkLength: 120
    }, function () {
        //some code to execute when done
        console.log('done');
    });
     */


    /*
    utterance.onstart = function(event) {
        resumeInfinity();
    };

    utterance.onend = function(event) {
        clearTimeout(timeoutResumeInfinity);
    };
     */

    utterance = new SpeechSynthesisUtterance(clearedStuff);
    voiceArr = window.speechSynthesis.getVoices();

    goodVoices = []
    for(let i = 0; i<voiceArr.length; i++){
        console.log("voice", voiceArr[i].lang.substring(0, 2), std_langs[main_lang])
        if(voiceArr[i].lang.substring(0, 2) == std_langs[main_lang]){
            goodVoices.push(voiceArr[i])
        }
    }

    if (goodVoices.length == 0){
        if(notification) {
            alert("No " + std_langs_full[main_lang] + " voices found. Try a different browser")
        }
        return
    }

    utterance.voice = goodVoices[0]
    utterance.lang = std_langs_full[main_lang]

    /*
    utterance.speech = clearedStuff

    utterance.onstart = function(event) {
        resumeInfinity();
    };

    utterance.onend = function(event) {
        clearTimeout(timeoutResumeInfinity);
    };
     */

    //window.speechSynthesis.speak(utterance);

    console.log("Saying, ", "|", clearedStuff)

    speechUtteranceChunker(utterance, {
        chunkLength: 100
    }, function () {
        //some code to execute when done
        console.log('done');
    });
}

/*
let voices = [];
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];
    let voiceSelect = document.querySelector("#voices");
    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
};

document.querySelector("#rate").addEventListener("input", () => {
    const rate = document.querySelector("#rate").value;
    speech.rate = rate;
    document.querySelector("#rate-label").innerHTML = rate;
});

document.querySelector("#volume").addEventListener("input", () => {
    const volume = document.querySelector("#volume").value;
    speech.volume = volume;
    document.querySelector("#volume-label").innerHTML = volume;
});

document.querySelector("#pitch").addEventListener("input", () => {
    const pitch = document.querySelector("#pitch").value;
    speech.pitch = pitch;
    document.querySelector("#pitch-label").innerHTML = pitch;
});

document.querySelector("#voices").addEventListener("change", () => {
    speech.voice = voices[document.querySelector("#voices").value];
});

document.querySelector("#start").addEventListener("click", () => {
    speech.text = document.querySelector("textarea").value;
    window.speechSynthesis.speak(speech);
});

document.querySelector("#pause").addEventListener("click", () => {
    window.speechSynthesis.pause();
});

document.querySelector("#resume").addEventListener("click", () => {
    window.speechSynthesis.resume();
});

document.querySelector("#cancel").addEventListener("click", () => {
    window.speechSynthesis.cancel();
});
*/











