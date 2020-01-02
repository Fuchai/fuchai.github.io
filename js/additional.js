// Git file

// better image preloading @ https://perishablepress.com/press/2009/12/28/3-ways-preload-images-css-javascript-ajax/

function preloader() {
    if (document.getElementById) {
        document.getElementById("preload-01").style.background = "url(img/portfolio/mom_low.jpg) no-repeat -9999px -9999px";
        document.getElementById("preload-02").style.background = "url(img/portfolio/Noah_low.jpg) no-repeat -9999px -9999px";
        document.getElementById("preload-03").style.background = "url(img/portfolio/niece_low.jpg) no-repeat -9999px -9999px";
        document.getElementById("preload-03").style.background = "url(img/portfolio/summer_low.jpg) no-repeat -9999px -9999px";
        document.getElementById("preload-03").style.background = "url(img/portfolio/ballroom_low.jpg) no-repeat -9999px -9999px";
        document.getElementById("preload-03").style.background = "url(img/portfolio/yunnan_low.jpg) no-repeat -9999px -9999px";
    }
}

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}
addLoadEvent(preloader);


//AngularJS button
angular.module('angularapp', ['ngMaterial']).controller('AppCtrl', buttonController);

var mlPaused=false;
var ranOnce=false;
var continueisDisabled=false;

function buttonController($scope,$window) {
    $scope.demoisDisabled=false;
	
    $scope.disablecontinueButton=function(){
    	$window.continueisDisabled=true;
    }
    $scope.disabledemoButton=function(){
        $scope.demoisDisabled=true;
    }
	$scope.continueifnotPaused=function(){

	}
	
    $scope.rundemo=function(){
        $.getJSON("https://api.myjson.com/bins/g94r5", function(j) {
        data = j;
        T.initDataRaw(data.vecs);
        // init embedding
        drawEmbedding();
        // draw initial embedding
		$window.ranOnce=true;
        //T.debugGrad();
        setInterval(function(){if (!$window.mlPaused)step();}, 0);

        //step();
    	});
	    $scope.fadeout=function(){
	        $("#mlbutton").fadeToggle();
	    }
	}
	$scope.continue=function() {
		$("#pause-box").removeClass("visible").addClass("hidden");
		mlPaused=false;
	}
	
}

$(window).scroll(function() {
   var hT = $('#photography').offset().top,
       hH = $('#photography').outerHeight(),
       wH = $(window).height(),
       wS = $(this).scrollTop();
   if (wS > (hT-300)&& ranOnce==true){
       mlPaused=true;
       $("#pause-box").removeClass("hidden").addClass("visible");
       continueisDisabled=false;
   }
   if (wS < (hT-1400) && ranOnce==true){
	   mlPaused=true
	   $("#pause-box").removeClass("hidden").addClass("visible");
	   continueisDisabled=false;
   }
});


// This runs the machine learning graph

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-3698471-13']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

var opt = {
    epsilon: 10,
    perplexity: 30
};
var T = new tsnejs.tSNE(opt);
// create a tSNE instance

var Y;

var data;

function updateEmbedding() {
    var Y = T.getSolution();
    svg.selectAll('.u').data(data.words).attr("transform", function(d, i) {
        return "translate(" + ((Y[i][0] * 20 * ss + tx) + 300) + "," + ((Y[i][1] * 20 * ss + ty) + 300) + ")";
    });
}

var svg;
function drawEmbedding() {
    // need to debug this line
    $("#embed").empty();
    var div = d3.select("#embed");

    // get min and max in each column of Y
    var Y = T.Y;

    svg = div.append("svg")// svg is global
    .attr("width", 600).attr("height", 600);

    var g = svg.selectAll(".b").data(data.words).enter().append("g").attr("class", "u");

    g.append("text").attr("text-anchor", "top").attr("font-size", 12).attr("fill", "#333").text(function(d) {
        return d;
    });

    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 10]).center([0, 0]).on("zoom", zoomHandler);
    zoomListener(svg);
}

var tx = 0
  , ty = 0;
var ss = 1;
function zoomHandler() {
    tx = d3.event.translate[0];
    ty = d3.event.translate[1];
    ss = d3.event.scale;
}

var stepnum = 0;
function step() {
    var cost = T.step();
    // do a few steps
    $("#cost").html("Iteration " + T.iter + "</br>Cost: " + cost);
    updateEmbedding();
}

function rundemo(){

    //$.getJSON("data/wordvecs50dtop1000.json", function(j) {
    $.getJSON("https://api.myjson.com/bins/g94r5", function(j) {
        data = j;
        T.initDataRaw(data.vecs);
        // init embedding
        drawEmbedding();
        // draw initial embedding

        //T.debugGrad();
        setInterval(step, 0);
        //step();

    });
}

/*

$(window).load(function() {

    //$.getJSON("data/wordvecs50dtop1000.json", function(j) {
    $.getJSON("https://api.myjson.com/bins/g94r5", function(j) {
        data = j;
        T.initDataRaw(data.vecs);
        // init embedding
        drawEmbedding();
        // draw initial embedding

        //T.debugGrad();
        setInterval(step, 0);
        //step();

    });
});

*/

