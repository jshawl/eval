  var value = "function hello(){\n  return 'hey there';\n}\n\nhello();"
  var create = document.querySelector(".js-create");
  var params = function(){
    var params = window.location.hash.substr(1).split("/")
    params.shift()
    return {
      versionId: params[1],
      evalId: params[0]
    }
  }
  if(params().versionId){
    changeCreateToUpdate()
    $.getJSON("http://localhost:3000/evals/" + params().evalId + "/versions/" + params().versionId)
     .then(function(res){
       console.log(res); 
       cm.setValue(res.contents)
       output.innerHTML = "";
       evaluate(cm.getValue())
     })
  }else{
    $.getJSON("http://localhost:3000/evals/" + params().evalId + "/versions/last")
     .then(function(res){
       console.log(res); 
       cm.setValue(res.contents)
     })
  }
  var cm = CodeMirror(document.getElementById("input"),{
    value: value,
    mode: 'javascript',
    lineNumbers: true
  })
  evaluate(cm.getValue())
  function evaluate(input){
    try{
      input = input.replace(/console\.log/g,"log")
      var ret = JSON.stringify(eval(input))
      output.innerHTML = output.innerHTML + "<br>-> " +ret;
    } catch (e) {
      output.innerHTML += e; 
    }
    function log(){
      console.log("args", arguments);
      for(var i = 0; i < arguments.length; i++)
	output.innerHTML = output.innerHTML + "<br> "+arguments[i];
    }
  }

  var run = document.querySelector(".js-run")
  run.addEventListener("click", function(e){
    e.preventDefault(); 
    evaluate(cm.getValue())
  })
  var clear = document.querySelector(".js-clear")
  clear.addEventListener("click", function(e){
    e.preventDefault(); 
    output.innerHTML = "";
  })
  var isTyping
  document.body.addEventListener("keyup", function(event){
    isTyping = clearTimeout( isTyping )
    isTyping = setTimeout(function(e){
      //save( cm.getValue() )
    },1000) 
  })
  create.addEventListener("click", function(event){
    event.preventDefault(); 
    createEval(cm.getValue());
  })
  function createEval(val){
    $.post("http://localhost:3000/evals", {
      contents: val
    },function(res){
      changeCreateToUpdate()
      window.location.hash = "/" + res.evalId + "/0";
    })
  }
  $("body").on("click", ".js-update", function(event){
    event.preventDefault(); 
    update(cm.getValue());
  })
  function create(val){
    $.post("http://localhost:3000/evals", {
      contents: val
    },function(res){
      window.location.hash = "/" + res.evalId + "/0";
    })
  }
  function update(val){
    $.post("http://localhost:3000/evals/" + params().evalId + "/versions", {
      contents: val
    },function(res){
      console.log(res);
      window.location.hash = "/" + res.version.evalId + "/" + (res.index - 1);
    })
  }
  function changeCreateToUpdate(){
    $(".js-create").remove();
    $(".ctrl").append("<a href='' class='js-update'>Update</a>")
  }
