(function(){
  var Eval = Object.create( new ActiveStorage("Eval") )
  var editor = {
    cm: CodeMirror(document.getElementById("input"),{
      value: "/* Your JavaScript Code Here */",
      mode: 'javascript',
      lineNumbers: true
    }),
    evaluate: function(input){
      try{
	// use our `log` function, instead of console.log
	var parsedInput = input.replace(/console\.log/g,"editor.log");
	// process the input, outputing the results (console.logs included, via log())
	var code_result = JSON.stringify(eval(parsedInput));

	output.innerHTML += "<br>-> " +code_result;
	output.innerHTML += "<br/>---";
      } catch (e) {
	output.innerHTML += e;
      }
    },
    log: function(){
      // output each list of eval'd arguments
      output.innerHTML += "<br> ";
      for(var i = 0; i < arguments.length; i++){
	if(arguments[i].constructor.name == "String"){
	  output.innerText += JSON.stringify(arguments[i])
	} else if(typeof arguments[i] == "function"){
	  output.innerText += arguments[i].toString()
	} else {
	  output.innerText += JSON.stringify(arguments[i])
	}
      }
    }
  }

  var api = {
    url: "http://eval-api.jshawl.com/evals",
    create: function(val){
      $.post(api.url, {
	contents: val
      },function(res){
	els.changeCreateToUpdate()
	window.location.hash = "/" + res.evalId + "/0";
	Eval.create({hash: window.location.hash, time: new Date()})
      })
    },
    update: function(val){
      $.post(api.url + "/" + app.params().evalId + "/versions", {
	contents: val
      },function(res){
	window.location.hash = "/" + res.version.evalId + "/" + (res.index - 1);
	Eval.create({hash: window.location.hash, time: new Date()})
      })
    }
  }

  var els = {
    create: document.querySelector(".js-create"),
    run: document.querySelector(".js-run"),
    clear: document.querySelector(".js-clear"),
    recent: document.querySelector(".js-recent"),
    listen: function(){
      this.run.addEventListener("click", function(e){
	e.preventDefault();
	editor.evaluate(editor.cm.getValue())
      })
      this.clear.addEventListener("click", function(e){
	e.preventDefault();
	output.innerHTML = "";
      })
      this.recent.addEventListener("click", function(e){
	e.preventDefault();
	document.body.classList.toggle("show-recent");
      })
      this.create.addEventListener("click", function(event){
	event.preventDefault();
	api.create(editor.cm.getValue());
        els.changeCreateToUpdate();
      })
      window.onhashchange = function(event){
	document.body.classList.remove("show-recent")
	app.load()
      }
      $("body").on("click", ".js-update", function(event){
	event.preventDefault();
	api.update(editor.cm.getValue());
      })
    },
    changeCreateToUpdate: function(){
      var $createButton = $('.js-create')
      $createButton.after("<a href='' class='js-update'>Update</a>")
      $createButton.remove();
    }
  }

  var app = {
    params: function(){
      var params = window.location.hash.substr(1).split("/")
      params.shift()
      return {
	versionId: params[1],
	evalId: params[0]
      }
    },
    load: function(){
      if(this.params().versionId){
	els.changeCreateToUpdate()
	$.getJSON(api.url +"/"+ this.params().evalId + "/versions/" + this.params().versionId)
	 .then(function(res){
	   editor.cm.setValue(res.contents)
	   output.innerHTML = "";
	   editor.evaluate(editor.cm.getValue())
	 })
      }
      var evls = Eval.all().reverse();
      var $container = $(".js-recent ul")
      for(var i = 0; i < evls.length; i++){
	var hash = evls[i].hash
	var $a = $("<a href='"+hash+"'>"+hash+"</a>");
	var $s = $("<small> "+$.timeago(evls[i].time)+"</small>");
	var $li = $("<li></li>");
	$li.append($a);
	$li.append($s);
	$container.append($li)
      }
    }
  }
  app.load();
  els.listen();
})()






  // show recent

