(function(){
  var value = atob(window.location.hash.substr(1)) || "function hello(){\n  return 'hey there';\n}\n\nhello();"
  var cm = CodeMirror(document.getElementById("input"),{
    value: value,
    mode: 'javascript',
    lineNumbers: true
  })
  evaluate(cm.getValue())
  function evaluate(input){
    try{
      input = input.replace(/console\.log/g,"log")
  console.log(input)
      var ret = eval(input)
      output.innerHTML = output.innerHTML + "<br>-> " +ret;
    } catch (e) {
      output.innerHTML += e; 
    }
    function log(){
      console.log("args", arguments);
      for(var i = 0; i < arguments.length; i++)
	output.innerHTML = output.innerHTML + "<br><- "+arguments[i];
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
      save( cm.getValue() )
    },1000) 
  })
  function save(val){
    window.location.hash = btoa(val)
  }
})()
