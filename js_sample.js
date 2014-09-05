// This code was written by Kelly Enochson at George Mason University.
// Thanks to Chris Callison-Burch at Penn for some of the code used in these functions.
// These two functions instantiate a self-paced reading task for use on Amazon Mechanical Turk.
// The function doInitialize() should be called for each new test item. 
// The function doTimer() is called with each key press, i.e., each word.

// global variables

var results = [];
var counter = 0;

// this function identifies the test item sentence, writes it to the document, and initalizes the timer

function doInitialize() {
    counter = 0;
    var sentence = "This is a sample sentence for self paced reading."
    var words = sentence.split(" ")
    var divInstr = document.createElement('div');
    divInstr.id = "instrDiv";
    document.body.appendChild(divInstr)
    
    // create a div that displays the instructions
    $('#instrDiv')
    .attr('style', "margin-left:45px")
    .attr('align', "center")
    .css('font-size', "16px")
    .append('<p id="message">press SPACEBAR for next word</p>')
    
    // create a div that displays the words
    var divWords = document.createElement('div');
    divWords.id = "wordsDiv";
    document.body.appendChild(divWords);
    $('#wordsDiv')
    .attr('style', "margin-left:45px")
    .css('font-size', "24px")
    
    // write the sentence to the document, and hide each word by setting its display style to none.
    for(var i = 0; i < words.length; i++) {
        $('#wordsDiv').append("<center><span id='word" + i + "' style='display: none;font-size:24px'>" + words[i] + " </span></center>");
    }
    
    // initialize the timer to record when the user saw each word
    // this will store the click times in milliseconds in an array
    var prevTime = -1;
    var clickTimes = new Array();
    for(var i = 0; i < words.length; i++) {
        clickTimes[i] = -1;
    }
    // on spacebar press, begin the self-paced reading presentation
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 32) {
            prevTime = doTimer(words, clickTimes, divWords, prevTime, divInstr);
        }
    };
}

// this function hides the previous word, displays the current word, and records click times

function doTimer(words, clickTimes, divWords, prevTime, divInstr) {
	// set the timer
    var currTime = new Date().getTime();
	var elapseTime = currTime - prevTime;
	prevTime = currTime;
    
	if(counter > 0) {
		var prevWordIndex = counter-1;
		var prevWord = document.getElementById("word"+prevWordIndex);
		prevWord.style.display = "none";
        
		// record how long the reader looked at the previous word
		clickTimes[prevWordIndex] = elapseTime;
	}
    
    if(counter == words.length) {
		for(var i = 0; i < words.length; i++) {
			results += words[i] + " " + clickTimes[i] + "<br>";
        }
        return prevTime;
	}

	if(counter <= words.length) {
		var word = document.getElementById("word"+counter);
		word.style.display = "block";
	}

	counter++;
    return prevTime;

}